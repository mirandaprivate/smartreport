package jianda

import (
	"bytes"
	"context"
	"io"
	file_pb "logi/src/proto/jianda/file"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFileHistory(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("test get fileInfo", func(t *testing.T) {
		testFileID := "1"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/file/history":
				respPB := &file_pb.GetFileVersionHistoryResponse{
					Status: "SUCCESS",
					Data: []*file_pb.FileInfo{
						{
							Id: "1",
						},
						{
							Id: "2",
						},
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
		req := &file_pb.GetFileVersionHistoryRequest{
			Id: testFileID,
		}
		resp, err := GetFileHistory(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, 2, len(resp.Data))
	})
}
