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

func TestFileInfo(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("test get fileInfo", func(t *testing.T) {
		testFileID := "1"
		testFileName := "filename"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/file/info?id=1&type=FILE_TYPE_REPORT":
				respPB := &file_pb.FileInfoResponse{
					Status: "SUCCESS",
					Data: &file_pb.FileInfo{
						Id:   testFileID,
						Name: testFileName,
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
		req := &file_pb.FileInfoRequest{
			Id:   testFileID,
			Type: file_pb.FileType_FILE_TYPE_REPORT,
		}
		resp, err := GetFileInfo(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, "1", resp.Data.Id)
	})
}
