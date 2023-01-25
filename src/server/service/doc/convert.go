package doc

import (
	"bytes"
	"context"
	"crypto/md5"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"path"
	"strings"
	"time"

	file_pb "logi/src/proto/jianda/file"
	"logi/src/server/lib/config"
	"logi/src/server/lib/errors"
	"logi/src/server/lib/http_client"
	jianda_lib "logi/src/server/lib/jianda"
)

const (
	wpsServerSignApiPath          = "/auth/v1/app/inscope/token"
	wpsServerConvertApiPath       = "/cps/v2/office/convert"
	wpsServerConvertResultApiPath = "/cps/v1/task/query"
	wpsServerDownloadFileApiPath  = "/cps/v1/download/file"
	wpsServerApiPrefix            = "/open"

	wpsServerScopeKey    = "scope"
	wpsServerScope       = "file_format_control,file_edit,file_preview"
	dbgUserKey           = "_w_dbg_user"
	wpsServerAppIdKey    = "app_id"
	wpsServerAppTokenKey = "app_token"
)

var (
	logiApiURLErr            = errors.ErrInternalRaw("简答api的url设置出错, ENV:LOGI_logi_SERVER_URL")
	wpsServerConvertTimeoutErr = errors.ErrInternalRaw("转换超时")
)

func convert(
	ctx context.Context,
	fileID string,
	fileType file_pb.FileType,
	format string,
) ([]byte, error) {
	token, err := getAppToken()
	if err != nil {
		return nil, err
	}
	fileInfo, err := getFileInfo(ctx, fileID, fileType)
	if err != nil {
		return nil, err
	}
	taskID, err := asyncConvert(token, fileInfo.DownloadUrl, fileInfo.Name, format)
	if err != nil {
		return nil, err
	}
	var downloadID string
	for i := 0; i < 10; i++ {
		id, err := queryConvertResult(token, taskID)
		if errors.ErrorIs(err, errors.NotFoundError{}) {
			time.Sleep(time.Second)
			continue
		} else if errors.ErrorIs(err, errors.InternalError{}) {
			return nil, err
		} else {
			downloadID = id
			break
		}
	}
	if downloadID == "" {
		return nil, wpsServerConvertTimeoutErr
	}
	htmlBytes, err := download(token, downloadID)
	if err != nil {
		return nil, err
	}
	return htmlBytes, nil
}

func wps3Sign(uri string, query url.Values, date, contentMd5 string) string {
	appID := config.Viper.GetString(config.WpsAppid)
	appKey := config.Viper.GetString(config.WpsAppkey)
	var u string
	if query.Encode() == "" {
		u = uri
	} else {
		u = fmt.Sprintf("%s?%s", uri, query.Encode())
	}

	s := sha1.New()
	io.WriteString(s, strings.ToLower(appKey))
	io.WriteString(s, contentMd5)
	io.WriteString(s, u)
	io.WriteString(s, "application/json")
	io.WriteString(s, date)
	sign := fmt.Sprintf("%x", s.Sum(nil))
	sign = fmt.Sprintf("WPS-3:%s:%s", appID, sign)
	return sign
}

func getTaskID(fileID string) string {
	date := time.Now().UTC().Format(http.TimeFormat)
	randomNumber := rand.Int()
	str := fmt.Sprintf("%s_%v_%s", date, randomNumber, fileID)
	s := sha1.New()
	io.WriteString(s, str)
	sign := fmt.Sprintf("%x", s.Sum(nil))
	return sign
}

type wpsTokenResp struct {
	Result int32    `json:"result"`
	Token  wpsToken `json:"token"`
}

type wpsToken struct {
	AppToken  string `json:"app_token"`
	ExpiresIn int64  `json:"expires_in"`
}

type wpsConvertReq struct {
	AppToken         string `json:"app_token"`
	TaskID           string `json:"task_id"`
	DocFileName      string `json:"doc_filename"`
	DocURL           string `json:"doc_url"`
	TargetFileFormat string `json:"target_file_format"`
	SceneID          string `json:"scene_id"`
}

type wpsConvertQueryReq struct {
	AppToken string `json:"app_token"`
	TaskID   string `json:"task_id"`
}

type wpsConvertQueryResp struct {
	Status     string `json:"status"`
	DownloadID string `json:"download_id"`
}

func getAppToken() (string, error) {
	wpsServerURL := config.Viper.GetString(config.WpsServerUrl)
	u, err := url.Parse(wpsServerURL)
	if err != nil {
		return "", logiApiURLErr
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
		return "", errors.ErrInternal(err)
	}
	contentMd5 := fmt.Sprintf("%x", md5.New().Sum(nil))
	setWpsRequestHeader(&req.Header, wpsServerSignApiPath, contentMd5, q)
	resp, err := http_client.Client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return "", errors.ErrInternalRaw(string(bodyBytes))
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

func getSignQuery() url.Values {
	values := make(url.Values)
	appID := config.Viper.GetString(config.WpsAppid)
	values.Add(wpsServerAppIdKey, appID)
	values.Add(wpsServerScopeKey, wpsServerScope)
	dbgUser := config.Viper.GetString(config.WpsDebugUser)
	if dbgUser != "" {
		values.Add(dbgUserKey, dbgUser)
	}
	return values
}

func setWpsRequestHeader(header *http.Header, signPath, contentMd5 string, query url.Values) {
	header.Set("Content-Type", "application/json")
	date := time.Now().UTC().Format(http.TimeFormat)
	wps3SignResult := wps3Sign(signPath, query, date, contentMd5)
	header.Set("X-Auth", wps3SignResult)
	header.Set("Date", date)
	header.Set("Content-Md5", contentMd5)
}

func getFileInfo(
	ctx context.Context,
	fileID string,
	fileType file_pb.FileType,
) (*file_pb.FileInfo, error) {
	reqPB := &file_pb.FileInfoRequest{
		Id:   fileID,
		Type: fileType,
	}
	respPB, err := jianda_lib.GetFileInfo(ctx, reqPB)
	if err != nil {
		return nil, err
	}
	return respPB.Data, nil
}

func asyncConvert(apptoken, fileURL, fileName, targetFormat string) (string, error) {
	taskID := getTaskID(fileURL)
	convertReq := &wpsConvertReq{
		AppToken:         apptoken,
		TaskID:           taskID,
		DocFileName:      fileName,
		DocURL:           fileURL,
		TargetFileFormat: targetFormat,
		SceneID:          "1",
	}
	b, err := jsonMarshal(convertReq)
	if err != nil {
		return "", errors.ErrInternal(err)
	}
	wpsServerURL := config.Viper.GetString(config.WpsServerUrl)
	u, err := url.Parse(wpsServerURL)
	if err != nil {
		return "", logiApiURLErr
	}
	u.Path = path.Join(u.Path, wpsServerApiPrefix, wpsServerConvertApiPath)
	req, err := http.NewRequest(
		http.MethodPost,
		u.String(),
		bytes.NewBuffer(b),
	)
	if err != nil {
		return "", errors.ErrInternal(err)
	}
	contentMd5 := fmt.Sprintf("%x", md5.Sum(b))
	setWpsRequestHeader(&req.Header, wpsServerConvertApiPath, contentMd5, u.Query())
	resp, err := http_client.Client.Do(req)
	if resp.StatusCode >= http.StatusBadRequest {
		body, _ := ioutil.ReadAll(resp.Body)
		errInfo := fmt.Sprintf("bad response code: %v, %s", resp.StatusCode, string(body))
		return "", errors.ErrInternalRaw(errInfo)
	}
	if err != nil {
		return "", errors.ErrInternal(err)
	}
	return taskID, nil
}

func queryConvertResult(appToken, taskID string) (string, error) {
	convertReq := &wpsConvertQueryReq{
		AppToken: appToken,
		TaskID:   taskID,
	}
	b, err := jsonMarshal(convertReq)
	if err != nil {
		return "", errors.ErrInternal(err)
	}
	wpsServerURL := config.Viper.GetString(config.WpsServerUrl)
	u, err := url.Parse(wpsServerURL)
	if err != nil {
		return "", logiApiURLErr
	}
	u.Path = path.Join(u.Path, wpsServerApiPrefix, wpsServerConvertResultApiPath)
	req, err := http.NewRequest(
		http.MethodPost,
		u.String(),
		bytes.NewBuffer(b),
	)
	contentMd5 := fmt.Sprintf("%x", md5.Sum(b))
	setWpsRequestHeader(&req.Header, wpsServerConvertResultApiPath, contentMd5, u.Query())
	if err != nil {
		return "", errors.ErrInternal(err)
	}
	resp, err := http_client.Client.Do(req)
	if err != nil {
		return "", errors.ErrInternal(err)
	}
	if resp.StatusCode >= http.StatusBadRequest {
		body, _ := ioutil.ReadAll(resp.Body)
		errInfo := fmt.Sprintf(
			"bad response code: %v, %s", resp.StatusCode, string(body))
		return "", errors.ErrInternalRaw(errInfo)
	}
	respBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", errors.ErrInternal(err)
	}
	rs := &wpsConvertQueryResp{}
	if err := json.Unmarshal(respBytes, rs); err != nil {
		return "", errors.ErrInternal(err)
	}
	switch rs.Status {
	case "RUNNING":
		return "", errors.ErrNotFoundRaw("RUNNING")
	case "WAITING":
		return "", errors.ErrNotFoundRaw("WAITING")
	case "SUCCESS":
		return rs.DownloadID, nil
	default:
		return "", errors.ErrInternalRaw(fmt.Sprintf("bad status: %s", rs.Status))
	}
}

func download(appToken, downloadID string) ([]byte, error) {
	wpsServerURL := config.Viper.GetString(config.WpsServerUrl)
	u, err := url.Parse(wpsServerURL)
	if err != nil {
		return nil, logiApiURLErr
	}
	u.Path = path.Join(u.Path, wpsServerApiPrefix, wpsServerDownloadFileApiPath, downloadID)
	query := u.Query()
	query.Add(wpsServerAppTokenKey, appToken)
	u.RawQuery = query.Encode()
	req, err := http.NewRequest(
		http.MethodGet,
		u.String(),
		bytes.NewBuffer(nil),
	)
	contentMd5 := fmt.Sprintf("%x", md5.Sum(nil))
	setWpsRequestHeader(&req.Header, path.Join(wpsServerDownloadFileApiPath, downloadID), contentMd5, u.Query())
	resp, err := http_client.Client.Do(req)
	if err != nil {
		return nil, errors.ErrInternal(err)
	}
	if resp.StatusCode >= http.StatusBadRequest {
		body, _ := ioutil.ReadAll(resp.Body)
		errInfo := fmt.Sprintf("bad response code: %v, %s", resp.StatusCode, string(body))
		return nil, errors.ErrInternalRaw(errInfo)
	}
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.ErrInternal(err)
	}
	return bodyBytes, nil
}

func jsonMarshal(t interface{}) ([]byte, error) {
	buffer := &bytes.Buffer{}
	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	err := encoder.Encode(t)
	return buffer.Bytes(), err
}
