package jianda

import (
	"bytes"
	"context"
	"io"
	jianda_data_pb "logi/src/proto/jianda/data"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPlaceholders(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("get placeholders", func(t *testing.T) {
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/data/placeholder?ids=1&ids=2":
				respPB := &jianda_data_pb.GetPlaceholderResponse{
					Status: "SUCCESS",
					Data: []*jianda_data_pb.Placeholder{
						{
							Id:   "1",
							Text: "123",
						},
						{
							Id:   "2",
							Text: "456",
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
		req := &jianda_data_pb.GetPlaceholderRequest{
			Ids: []string{"1", "2"},
		}
		resp, err := GetPlaceHolders(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, 2, len(resp.Data))
		assert.Equal(t, "1", resp.Data[0].Id)
		assert.Equal(t, "2", resp.Data[1].Id)
	})
}
