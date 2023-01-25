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

func TestDataValue(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("test get data value", func(t *testing.T) {
		testResearchID := "1"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.jianda.com/api/library/v1/data/dataValue":
				respPB := &data_pb.DataValueResponse{
					Status: "SUCCESS",
					Data: &data_pb.DataValueResponse_Data{
						ResearchId: testResearchID,
						Data: []*data_pb.DataValue{
							{
								PlaceholderId: "1",
							},
							{
								PlaceholderId: "2",
							},
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
		req := &data_pb.DataValueRequest{
			ResearchId: testResearchID,
			ValuesDesc: []*data_pb.DataValueDesc{
				{
					Id:   "1",
					Name: "name1",
				},
				{
					Id:   "2",
					Name: "name2",
				},
			},
		}
		resp, err := GetDataValues(ctx, req)
		assert.Nil(t, err)
		assert.Equal(t, "1", resp.Data.Data[0].PlaceholderId)
		assert.Equal(t, "2", resp.Data.Data[1].PlaceholderId)
	})
}
