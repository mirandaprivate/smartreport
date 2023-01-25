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

func TestSaveFile(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("test save file", func(t *testing.T) {
		testFileID := "1"
		testFileType := jianda_file_pb.FileType_FILE_TYPE_REPORT
		testBase64 := "base64"
		testFileName := "file1"
		testFileVersion := 2
		testFileDownloadURL := "www.file.com"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/file/save":
				respPB := &jianda_file_pb.SaveFileResponse{
					Status: "SUCCESS",
					Data: &jianda_file_pb.FileInfo{
						Id:          testFileID,
						Name:        testFileName,
						Version:     int32(testFileVersion),
						DownloadUrl: testFileDownloadURL,
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
		req := &jianda_file_pb.SaveFileRequest{
			Id:            testFileID,
			Type:          testFileType,
			Base64Content: testBase64,
		}
		resp, err := SaveFile(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, testFileID, resp.Data.Id)
	})
}
