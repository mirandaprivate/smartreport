package doc

import (
	"context"
	"encoding/json"
	"io"
	file_pb "logi/src/proto/jianda/file"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAppToken(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.WpsServerUrl, "http://wps-server.logiocean.com")
	config.Viper.Set(config.WpsAppid, "AK20210729JOMDQZ")
	config.Viper.Set(config.WpsAppkey, "953d3386cb3d7e2125e00a1d949cfa7f")
	t.Run("test get app token", func(t *testing.T) {
		testToken := "token1"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "http://wps-server.logiocean.com/open/auth/v1/app/inscope/token?app_id=AK20210729JOMDQZ&scope=file_format_control%2Cfile_edit%2Cfile_preview":
				tokenResp := wpsTokenResp{
					Result: 0,
					Token: wpsToken{
						AppToken: testToken,
					},
				}
				b, _ := json.Marshal(&tokenResp)
				reader = test_utils.NewBodyReader(b)
			default:
				t.Fatal(r.URL.String())
			}
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		token, err := getAppToken()
		assert.Nil(t, err)
		assert.Equal(t, testToken, token)
	})
}

func TestGetFileInfo(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.WpsServerUrl, "http://wps-server.logiocean.com")
	config.Viper.Set(config.logiApiURL, "www.logi.com")
	t.Run("test get fileInfo", func(t *testing.T) {
		testFileID := "1"
		testFileName := "filename"
		testFileDownloadURL := "http://vpn.logiocean.com:1196/saas/gin/v1/file/word-template/970d2a50a4335abb9b8ee578abe2718f?_w_dbg_user=jiabao&_w_file_id=1"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.logi.com/api/library/v1/file/info?id=1&type=FILE_TYPE_REPORT":
				respPB := &file_pb.FileInfoResponse{
					Status: "SUCCESS",
					Data: &file_pb.FileInfo{
						Id:          testFileID,
						Name:        testFileName,
						DownloadUrl: testFileDownloadURL,
					},
				}
				b, _ := json.Marshal(respPB)
				reader = test_utils.NewBodyReader(b)
			default:
				t.Fatal(r.URL.String())
			}
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		ctx := context.WithValue(
			context.Background(),
			consts.logiRequestAuthHeaderKey,
			"auth",
		)
		fileInfo, err := getFileInfo(ctx, testFileID, file_pb.FileType_FILE_TYPE_REPORT)
		assert.Nil(t, err)
		assert.Equal(t, testFileID, fileInfo.Id)
		assert.Equal(t, testFileName, fileInfo.Name)
		assert.Equal(t, testFileDownloadURL, fileInfo.DownloadUrl)
	})
}

func TestAsyncConvert(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.WpsServerUrl, "http://wps-server.logiocean.com")
	t.Run("test async convert html", func(t *testing.T) {
		testToken := "token1"
		testFileName := "filename"
		testFileDownloadURL := "http://vpn.logiocean.com:1196/saas/gin/v1/file/word-template/970d2a50a4335abb9b8ee578abe2718f?_w_dbg_user=jiabao&_w_file_id=1"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "http://wps-server.logiocean.com/open/cps/v2/office/convert":
				reader = test_utils.NewBodyReader([]byte(""))
			default:
				t.Fatal(r.URL.String())
			}
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		taskID, err := asyncConvert(testToken, testFileDownloadURL, testFileName, "HTML")
		assert.Nil(t, err)
		assert.NotEqual(t, "", taskID)
	})
}

func TestQueryConvertResult(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.WpsServerUrl, "http://wps-server.logiocean.com")
	t.Run("test query convert result", func(t *testing.T) {
		testToken := "token1"
		testTaskID := "task1"
		testDownloadID := "downloadID1"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "http://wps-server.logiocean.com/open/cps/v1/task/query":
				rs := &wpsConvertQueryResp{
					Status:     "SUCCESS",
					DownloadID: testDownloadID,
				}
				b, _ := json.Marshal(rs)
				reader = test_utils.NewBodyReader(b)
			default:
				t.Fatal(r.URL.String())
			}
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		downloadID, err := queryConvertResult(testToken, testTaskID)
		assert.Nil(t, err)
		assert.Equal(t, testDownloadID, downloadID)
	})
}

func TestDownload(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.WpsServerUrl, "http://wps-server.logiocean.com")
	t.Run("test getHTML", func(t *testing.T) {
		testToken := "token1"
		testDownloadID := "downloadID"
		testHTMLBytes := "htmlbytes"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "http://wps-server.logiocean.com/open/cps/v1/download/file/downloadID?app_token=token1":
				reader = test_utils.NewBodyReader([]byte(testHTMLBytes))
			default:
				t.Fatal(r.URL.String())
			}
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		b, err := download(testToken, testDownloadID)
		assert.Nil(t, err)
		assert.Equal(t, []byte(testHTMLBytes), b)
	})
}
