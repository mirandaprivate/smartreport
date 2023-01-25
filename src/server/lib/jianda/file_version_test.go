package jianda

import (
	"bytes"
	"context"
	"io"
	jianda_file_pb "logi/src/proto/jianda/file"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetFileVersionInfo(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("get placeholders", func(t *testing.T) {
		testFileID := "1"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/file/version":
				respPB := &jianda_file_pb.FileInfoResponse{
					Status: "SUCCESS",
					Data: &jianda_file_pb.FileInfo{
						Id: testFileID,
					},
				}
				b := bytes.NewBuffer([]byte{})
				defaultMarshaler.Marshal(b, respPB)
				reader = test_utils.NewBodyReader(b.Bytes())
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
			consts.JiandaRequestAuthHeaderKey,
			"auth",
		)
		req := &jianda_file_pb.GetFileVersionInfoRequest{}
		resp, err := GetFileVersion(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, testFileID, resp.Data.Id)
	})
}
