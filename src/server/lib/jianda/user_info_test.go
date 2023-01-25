package jianda

import (
	"bytes"
	"context"
	"io"
	user_pb "logi/src/proto/jianda/user"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetUsersInfo(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("get user info", func(t *testing.T) {
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/user?ids=1&ids=2":
				respPB := &user_pb.UserInfoResponse{
					Status: "SUCCESS",
					Data: []*user_pb.User{
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
		req := &user_pb.UserInfoRequest{
			Ids: []string{"1", "2"},
		}
		resp, err := GetUsersInfo(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, 2, len(resp.Data))
	})
}
