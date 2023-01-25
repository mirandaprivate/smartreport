package jianda

import (
	"bytes"
	"context"
	"io"
	data_pb "logi/src/proto/jianda/data"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLastDate(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("test last date", func(t *testing.T) {
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/data/lastDate":
				respPB := &data_pb.DataLastDateResponse{
					Status: "SUCCESS",
					Dates: []*data_pb.DataLastDate{
						{
							Id:   "1",
							Date: "2020-06-30",
						},
						{
							Id:   "2",
							Date: "2020-09-30",
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
		req := &data_pb.DataLastDateRequest{
			ResearchId: "1",
			Ids:        []string{"1", "2"},
		}
		_, err := GetLastDate(ctx, req)
		assert.Nil(t, err)
	})
}
