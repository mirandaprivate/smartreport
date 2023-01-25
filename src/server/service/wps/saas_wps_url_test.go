package wps

import (
	"fmt"
	wps_pb "logi/src/proto/wps"
	"logi/src/server/lib/config"
	test_util "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestWps3Sign(t *testing.T) {
	test_util.SetupViper()
	config.Viper.Set(config.WpsAppid, "AK20210706RTTISK")
	config.Viper.Set(config.WpsAppkey, "859e4b11152e9ea007fd58d7921b621c")
	config.Viper.Set(config.WpsDebugUser, "minglong")
	config.Viper.Set(config.WpsServerUrl, "https://wps-server.logiocean.com")
	t.Run("test md5 hash", func(t *testing.T) {
		auth := wps3Sign(wpsServerSignApiPath, getSignQuery(), "Mon, 12 Jul 2021 08:07:05 GMT")
		assert.Equal(t, "WPS-3:AK20210706RTTISK:f148b42e600dbbebe367001a605188b764f133af", auth)
	})
	t.Run("test apptoken", func(t *testing.T) {
		u := "https://wps-server.logiocean.com/open/auth/v1/app/inscope/token?_w_dbg_user=minglong&app_id=AK20210706RTTISK&scope=file_edit"
		test_util.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			assert.Equal(t, u, r.URL.String())
			reader := test_util.NewBodyReader([]byte(`{"result": 0, "token": {"app_token": "123", "expires_in": 86400}}`))
			return &http.Response{
				Status:     "200 ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		apptoken, err := getAppToken()
		assert.Nil(t, err)
		assert.Equal(t, "123", apptoken)
	})
	t.Run("test apptoken failed", func(t *testing.T) {
		test_util.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			reader := test_util.NewBodyReader([]byte(`{"failed": "error response"}`))
			return &http.Response{
				Status:     "failed",
				StatusCode: http.StatusBadRequest,
				Body:       reader,
			}, nil
		})
		apptoken, err := getAppToken()
		assert.NotNil(t, err)
		assert.Equal(t, "", apptoken)
	})
	t.Run("test weboffice edit url", func(t *testing.T) {
		jwt := "jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJ6blBkUFdLUlp3ZVdVb0hwbW9KVVEiLCJleHAiOjE2MzIxMTg3Nzd9.JaJiEvBx55TJEtVRaQSxM_JVjSDTTwOz09zrDHEXHvY"
		u := "https://wps-server.logiocean.com/weboffice/office/s/4d0ec46ab884855d97b644cd96e39029?_w_appid=AK20210704IWRYCY&_w_appid=AK20210706RTTISK&_w_dbg_user=minglong&_w_file_id=172&_w_file_type=2&_w_third_appid=AK20210706RTTISK&_w_third_file_id=2_172&_w_tokentype=1&version=1"
		respBody := []byte(fmt.Sprintf(`{"result": 0, "url": "%s"}`, u))
		apptoken := "testapptoken"
		test_util.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			reader := test_util.NewBodyReader(respBody)
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		resp, err := getWebOfficeEditUrl(&wps_pb.WpsUrlParams{
			FileId:    "289",
			FileType:  2,
			TokenType: 1,
			WpsType:   "s",
			UserId:    "user1",
		}, apptoken, jwt)
		assert.Nil(t, err)
		assert.Equal(t, u, resp)
	})
}
