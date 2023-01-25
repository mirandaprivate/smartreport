package wps

import (
	"bytes"
	"context"
	"crypto/md5"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	wps_pb "logi/src/proto/wps"
	"logi/src/server/lib/common"
	"logi/src/server/lib/config"
	"logi/src/server/lib/http_client"
	"net/http"
	"net/url"
	"path"
	"strconv"
	"strings"
	"time"
)

func wps3Sign(uri string, query url.Values, date string) string {
	appid := config.Viper.GetString(config.WpsAppid)
	appkey := config.Viper.GetString(config.WpsAppkey)

	contentMd5 := fmt.Sprintf("%x", md5.New().Sum(nil))
	u := fmt.Sprintf("%s?%s", uri, query.Encode())

	s := sha1.New()
	io.WriteString(s, strings.ToLower(appkey))
	io.WriteString(s, contentMd5)
	io.WriteString(s, u)
	io.WriteString(s, "application/json")
	io.WriteString(s, date)
	sign := fmt.Sprintf("%x", s.Sum(nil))
	sign = fmt.Sprintf("WPS-3:%s:%s", appid, sign)
	return sign
}

func getSignQuery() url.Values {
	values := make(url.Values)
	appid := config.Viper.GetString(config.WpsAppid)
	values.Add(wpsServerAppIdKey, appid)
	values.Add(wpsServerScopeKey, wpsServerScope)
	dbgUser := config.Viper.GetString(config.WpsDebugUser)
	if dbgUser != "" {
		values.Add(dbgUserKey, dbgUser)
	}
	return values
}

type wpsTokenResp struct {
	Result int32    `json:"result"`
	Token  wpsToken `json:"token"`
}

type wpsToken struct {
	AppToken  string `json:"app_token"`
	ExpiresIn int64  `json:"expires_in"`
}

func setWpsRequestHeader(header *http.Header, signPath string, query url.Values) {
	header.Set("Content-Type", "application/json")
	date := time.Now().UTC().Format(http.TimeFormat)
	wps3SignResult := wps3Sign(signPath, query, date)
	header.Set("X-Auth", wps3SignResult)
	header.Set("Date", date)
	contentMd5 := fmt.Sprintf("%x", md5.New().Sum(nil))
	header.Set("Content-Md5", contentMd5)
}

func getAppToken() (string, error) {
	wpsServeUrl := config.Viper.GetString(config.WpsServerUrl)
	u, err := url.Parse(wpsServeUrl)
	if err != nil {
		return "", fmt.Errorf("wps server url is not valid url")
	}
	u.Path = path.Join(u.Path, wpsServerApiPrefix, wpsServerSignApiPath)
	q := getSignQuery()
	u.RawQuery = q.Encode()

	req, err := http.NewRequest(
		http.MethodGet,
		u.String(),
		bytes.NewBuffer([]byte{}),
	)
	if err != nil {
		return "", fmt.Errorf("build token request failed")
	}
	setWpsRequestHeader(&req.Header, wpsServerSignApiPath, q)
	resp, err := http_client.Client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return "", fmt.Errorf(string(bodyBytes))
	}
	if err != nil {
		return "", err
	}
	tokenResp := wpsTokenResp{
		Result: 0,
		Token:  wpsToken{},
	}
	if err := json.Unmarshal(bodyBytes, &tokenResp); err != nil {
		return "", err
	}
	return tokenResp.Token.AppToken, nil
}

func getWebOfficeQuery(req *wps_pb.WpsUrlParams, appToken, jwt string) url.Values {
	wpsID := getWpsID(req.FileId, req.FileType)

	q := make(url.Values)
	q.Add(wpsServerAppTokenKey, appToken)
	q.Add(wpsServerFileIDKey, wpsID)
	q.Add(wpsServerFileTypeKey, req.WpsType)
	q.Add(fileIDKey, req.FileId)
	q.Add(fileTypeKey, strconv.Itoa(int(req.FileType)))
	q.Add(tokenTypeKey, strconv.Itoa(int(req.TokenType)))
	q.Add(userIDKey, req.UserId)
	q.Add(jwtKey, jwt)
	q.Add(appidKey, config.Viper.GetString(config.WpsAppid))
	dbgUser := config.Viper.GetString(config.WpsDebugUser)
	if dbgUser != "" {
		q.Add(dbgUserKey, dbgUser)
	}
	if req.VersionId != 0 {
		q.Add(versionIDKey, strconv.Itoa(int(req.VersionId)))
	}
	return q
}

type wpsEditUrlResponse struct {
	Result int32  `json:"result"`
	Url    string `json:"url"`
}

func getWebOfficeEditUrl(req *wps_pb.WpsUrlParams, appToken, jwt string) (string, error) {
	wpsServeUrl := config.Viper.GetString(config.WpsServerUrl)
	u, err := url.Parse(wpsServeUrl)
	if err != nil {
		return "", fmt.Errorf("wps server url is not valid url")
	}
	u.Path = path.Join(u.Path, wpsServerApiPrefix, wpsServerGetEditorPath)
	q := getWebOfficeQuery(req, appToken, jwt)
	u.RawQuery = q.Encode()

	r, err := http.NewRequest(
		http.MethodGet,
		u.String(),
		bytes.NewBuffer([]byte{}),
	)
	if err != nil {
		return "", fmt.Errorf("build wps3 request failed")
	}
	setWpsRequestHeader(&r.Header, wpsServerGetEditorPath, q)
	resp, err := http_client.Client.Do(r)
	if err != nil {
		return "", err
	}
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return "", fmt.Errorf(string(bodyBytes))
	}

	editUrlResp := wpsEditUrlResponse{}
	if err := json.Unmarshal(bodyBytes, &editUrlResp); err != nil {
		return "", err
	}
	return editUrlResp.Url, nil
}

func getSaasWpsUrl(
	ctx context.Context,
	req *wps_pb.WpsUrlParams,
) (*wps_pb.WpsUrlResponse, error) {
	jwt, err := common.JwtFromContext(ctx)
	if err != nil {
		return nil, err
	}
	appToken, err := getAppToken()
	if err != nil {
		return nil, err
	}
	editUrl, err := getWebOfficeEditUrl(req, appToken, jwt)
	if err != nil {
		return nil, err
	}
	return &wps_pb.WpsUrlResponse{
		Url: editUrl,
	}, nil
}
