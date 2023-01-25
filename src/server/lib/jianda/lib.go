package jianda

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	"logi/src/server/lib/errors"
	"logi/src/server/lib/http_client"
	"net/http"
	"net/url"
	"path"

	"github.com/golang/protobuf/jsonpb"
	"google.golang.org/grpc/metadata"
)

const (
	jiandaServerPathPrefix = "api/library"
)

var (
	defaultMarshaler = jsonpb.Marshaler{EnumsAsInts: false}
)

func loginErr() error {
	return errors.ErrUnauthorizedRaw("登录失败，请刷新后重新登录")
}

func jwtErr() error {
	return errors.ErrInvalidRaw("ctx中没有或有多个jwt")
}

func jiandaApiURLErr() error {
	return errors.ErrInternalRaw("简答api的url设置出错, ENV:LOGI_JIANDA_SERVER_URL")
}

func badRequestErr(body string) error {
	return errors.ErrInternalRaw(fmt.Sprintf("bad request: %s", body))
}

func unmarshalErr(u, body, msg string) error {
	return errors.ErrInternalRaw(
		fmt.Sprintf("reqURL: %s, unmarshal %s failed, %s", u, body, msg))
}

type requestPayload struct {
	Method string
	Url    string
	Body   io.Reader
	Ctx    context.Context
}

func (r *requestPayload) Send() ([]byte, error) {
	req, err := http.NewRequest(
		r.Method,
		r.Url,
		r.Body,
	)
	if err != nil {
		return nil, errors.ErrInternal(err)
	}

	if err := addJwtToReq(r.Ctx, req); err != nil {
		return nil, err
	}
	resp, err := http_client.Client.Do(req)
	if err != nil {
		return nil, errors.ErrInternal(err)
	}
	respBodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.ErrInternal(err)
	}

	if resp.StatusCode >= http.StatusBadRequest {
		if resp.StatusCode == http.StatusUnauthorized {
			return nil, loginErr()
		}
		body, _ := ioutil.ReadAll(r.Body)
		return nil, badRequestErr(
			fmt.Sprintf("请求%s发送失败，返回code：%v，request body：%s",
				r.Url, resp.StatusCode, string(body)))
	}
	return respBodyBytes, nil
}

func getJiandaApiURL(p string) (*url.URL, error) {
	host := config.Viper.GetString(config.JiandaApiURL)
	u, err := url.Parse(host)
	if err != nil {
		return nil, jiandaApiURLErr()
	}
	u.Path = path.Join(u.Path, jiandaServerPathPrefix, p)
	return u, nil
}

func addJwtToReq(ctx context.Context, r *http.Request) error {
	ctxJwt := ctx.Value(consts.JiandaRequestAuthHeaderKey)
	if ctxJwt != nil {
		r.Header.Add(consts.JiandaRequestAuthHeaderKey, ctxJwt.(string))
		return nil
	}
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return jwtErr()
	}
	values := md.Get(consts.JiandaRequestAuthHeaderKey)
	if len(values) != 1 {
		return jwtErr()
	}
	r.Header.Add(consts.JiandaRequestAuthHeaderKey, values[0])
	return nil
}

func checkResp(status string) error {
	if status != "SUCCESS" {
		return badRequestErr("")
	}
	return nil
}
