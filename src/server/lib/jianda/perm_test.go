package jianda

import (
	"bytes"
	"context"
	"io"
	jianda "logi/src/proto/jianda/file"
	perm_pb "logi/src/proto/jianda/perm"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPerm(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("test get perm", func(t *testing.T) {
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/perm?file_id=file1&type=FILE_TYPE_REPORT&user_id=user1":
				respPB := &perm_pb.GetPermResponse{
					Status: "SUCCESS",
					Data:   perm_pb.FilePerm_PERM_WRITE,
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
		req := &perm_pb.GetPermRequest{
			FileId: "file1",
			UserId: "user1",
			Type:   jianda.FileType_FILE_TYPE_REPORT,
		}
		resp, err := GetPerm(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, perm_pb.FilePerm_PERM_WRITE, resp.Data)
	})
}
