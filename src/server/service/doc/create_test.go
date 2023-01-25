package doc

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"io"
	inner_pb "logi/src/proto/inner"
	logi_data_pb "logi/src/proto/jianda/data"
	logi_file_pb "logi/src/proto/jianda/file"
	"logi/src/server/lib/config"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/golang/protobuf/proto"
	"github.com/stretchr/testify/assert"
	"google.golang.org/grpc"
)

func TestGetTemplate(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.logiApiURL, "www.logi.com")

	t.Run("test template id 1", func(t *testing.T) {
		templateResult := "testtemplate"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.logi.com/api/library/v1/file/info?id=1&type=FILE_TYPE_TEMPLATE":
				respPB := &logi_file_pb.FileInfoResponse{
					Status: "SUCCESS",
					Data: &logi_file_pb.FileInfo{
						Id:          "123",
						DownloadUrl: "http://www.logi.com/saas/v1/download",
					},
				}
				respBody, _ := json.Marshal(respPB)
				reader = test_utils.NewBodyReader(respBody)
			case "http://www.logi.com/saas/v1/download":
				reader = test_utils.NewBodyReader([]byte(templateResult))
			default:
				t.Fatal(r.URL.String())
			}
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		templateID := "1"
		ctx := context.WithValue(
			context.Background(),
			consts.logiRequestAuthHeaderKey,
			"auth",
		)
		b, err := getTemplate(ctx, templateID)
		assert.Nil(t, err)
		assert.Equal(t, []byte(templateResult), b)
	})
}

func TestGetPlaceHolderDescs(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.logiApiURL, "www.logi.com")
	t.Run("test get placeholder descs", func(t *testing.T) {
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.logi.com/api/library/v1/data/placeholder?ids=1&ids=2":
				ps1 := &logi_data_pb.Placeholder{
					Id:   "1",
					Text: encodePlaceHolderDesc("1"),
				}
				ps2 := &logi_data_pb.Placeholder{
					Id:   "2",
					Text: encodePlaceHolderDesc("2"),
				}
				respPB := &logi_data_pb.GetPlaceholderResponse{
					Status: "SUCCESS",
					Data:   []*logi_data_pb.Placeholder{ps1, ps2},
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
		resp, err := getPlaceHolderDescs(ctx, []string{"1", "2"})
		assert.Nil(t, err)
		assert.Equal(t, 2, len(resp))
		assert.Equal(t, "1", resp[0].Id)
		assert.Equal(t, "2", resp[1].Id)
	})
}

func encodePlaceHolderDesc(id string) string {
	desc := logi_data_pb.PlaceHolderDesc{
		Id: id,
	}
	b, _ := proto.Marshal(&desc)
	return base64.StdEncoding.EncodeToString(b)
}

type mockInnerGrpcClient struct{}

func (*mockInnerGrpcClient) GetDocContent(
	ctx context.Context,
	in *inner_pb.DocContentRequest,
	opts ...grpc.CallOption,
) (*inner_pb.DocContent, error) {
	return nil, nil
}

func (*mockInnerGrpcClient) GetPlaceholderIDs(
	ctx context.Context,
	in *inner_pb.PlaceholderIDsRequest,
	opts ...grpc.CallOption,
) (*inner_pb.PlaceholderIDsResponse, error) {
	return nil, nil
}

func (*mockInnerGrpcClient) RenderTemplate(
	ctx context.Context,
	in *inner_pb.RenderTemplateRequest,
	opts ...grpc.CallOption,
) (*inner_pb.RenderTemplateResponse, error) {
	return nil, nil
}

func (*mockInnerGrpcClient) CalculateDate(
	ctx context.Context,
	in *inner_pb.CalculateDateRequest,
	opts ...grpc.CallOption,
) (*inner_pb.CalculateDateResponse, error) {
	results := []*inner_pb.CalculateDate{}
	for _, desc := range in.Descs {
		d := &inner_pb.CalculateDate{
			Id:   desc.Id,
			Date: desc.Date,
		}
		results = append(results, d)
	}
	return &inner_pb.CalculateDateResponse{
		Dates: results,
	}, nil
}

func TestDynamicToStaticDesc(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.logiApiURL, "www.logi.com")
	t.Run("test dynamic to static desc", func(t *testing.T) {
		mockClient := &mockInnerGrpcClient{}
		test_utils.SetupInnerGrpcClient(mockClient)
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.logi.com/api/library/v1/data/lastDate":
				respPB := &logi_data_pb.DataLastDateResponse{
					Status: "SUCCESS",
					Dates: []*logi_data_pb.DataLastDate{
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
		desc1 := &logi_data_pb.PlaceHolderDesc{
			Id:            "1",
			Date:          "2020-01-01",
			PlaceholderId: "p1",
			IsTimeseries:  true,
			IsDynamic:     true,
			Distance:      1,
			Name:          "p1",
		}
		desc2 := &logi_data_pb.PlaceHolderDesc{
			Id:            "2",
			Date:          "2021-01-01",
			PlaceholderId: "p2",
			IsTimeseries:  true,
			IsDynamic:     true,
			Distance:      1,
			Name:          "p2",
		}
		res, err := dynamicToStaticDesc(ctx, "", []*logi_data_pb.PlaceHolderDesc{desc1, desc2})
		assert.Nil(t, err)
		expectDesc1 := &logi_data_pb.PlaceHolderDesc{
			Id:            "1",
			Date:          "2020-06-30",
			PlaceholderId: "p1",
			IsTimeseries:  true,
			IsDynamic:     false,
			Name:          "p1",
		}
		expectDesc2 := &logi_data_pb.PlaceHolderDesc{
			Id:            "2",
			Date:          "2020-09-30",
			PlaceholderId: "p2",
			IsTimeseries:  true,
			IsDynamic:     false,
			Name:          "p2",
		}
		assert.Equal(t, 2, len(res))
		assert.Equal(t, expectDesc1, res[0])
		assert.Equal(t, expectDesc2, res[1])
	})
}

func TestToDataValueDescs(t *testing.T) {
	test_utils.SetupViper()
	config.Viper.Set(config.logiApiURL, "www.logi.com")
	t.Run("test to DataValueDescs", func(t *testing.T) {
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.logi.com/api/library/v1/data/lastDate":
				respPB := &logi_data_pb.DataLastDateResponse{
					Status: "SUCCESS",
					Dates: []*logi_data_pb.DataLastDate{
						{
							Id:   "1",
							Date: "2020-06-30",
						},
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
		mockClient := &mockInnerGrpcClient{}
		test_utils.SetupInnerGrpcClient(mockClient)
		desc1 := &logi_data_pb.PlaceHolderDesc{
			Id:            "1",
			Date:          "2020-01-01",
			PlaceholderId: "p1",
			Name:          "p1",
			IsTimeseries:  true,
			Format:        "1",
			IsDynamic:     true,
			Distance:      1,
		}
		desc2 := &logi_data_pb.PlaceHolderDesc{
			Id:            "2",
			Date:          "2021-01-01",
			PlaceholderId: "p2",
			Name:          "p2",
			IsTimeseries:  true,
			Format:        "2",
			IsDynamic:     false,
		}
		desc3 := &logi_data_pb.PlaceHolderDesc{
			Id:            "3",
			PlaceholderId: "p3",
			Name:          "p3",
			IsTimeseries:  false,
			Format:        "2",
			IsDynamic:     false,
		}
		ctx := context.WithValue(
			context.Background(),
			consts.logiRequestAuthHeaderKey,
			"auth",
		)

		res, err := toDataValueDescs(ctx, "",
			[]*logi_data_pb.PlaceHolderDesc{desc1, desc2, desc3})
		assert.Nil(t, err)
		assert.Equal(t, 3, len(res))
		expectDesc1 := &logi_data_pb.DataValueDesc{
			Id:            "1",
			Date:          "2020-06-30",
			PlaceholderId: "p1",
			Name:          "p1",
			IsTimeseries:  true,
			Format:        "1",
		}
		expectDesc2 := &logi_data_pb.DataValueDesc{
			Id:            "2",
			Date:          "2021-01-01",
			PlaceholderId: "p2",
			Name:          "p2",
			IsTimeseries:  true,
			Format:        "2",
		}
		expectDesc3 := &logi_data_pb.DataValueDesc{
			Id:            "3",
			PlaceholderId: "p3",
			Name:          "p3",
			IsTimeseries:  false,
			Format:        "2",
		}

		assert.Equal(t, expectDesc1, res[2])
		assert.Equal(t, expectDesc2, res[0])
		assert.Equal(t, expectDesc3, res[1])
	})
	t.Run("test to DataValueDescs2", func(t *testing.T) {
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case "www.logi.com/api/library/v1/data/lastDate":
				respPB := &logi_data_pb.DataLastDateResponse{
					Status: "SUCCESS",
					Dates: []*logi_data_pb.DataLastDate{
						{
							Id:   "1",
							Date: "2020-06-30",
						},
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
		mockClient := &mockInnerGrpcClient{}
		test_utils.SetupInnerGrpcClient(mockClient)
		desc1 := &logi_data_pb.PlaceHolderDesc{
			Id:            "1",
			Date:          "2021-10-25",
			PlaceholderId: "779",
			Name:          "p1",
			IsTimeseries:  true,
			Format:        "1",
			IsDynamic:     true,
			Distance:      -1,
		}
		desc2 := &logi_data_pb.PlaceHolderDesc{
			Id:            "1",
			Date:          "2021-01-01",
			PlaceholderId: "783",
			Name:          "p2",
			IsTimeseries:  true,
			Format:        "2",
			IsDynamic:     true,
			Distance:      -1,
		}
		ctx := context.WithValue(
			context.Background(),
			consts.logiRequestAuthHeaderKey,
			"auth",
		)

		res, err := toDataValueDescs(ctx, "",
			[]*logi_data_pb.PlaceHolderDesc{desc1, desc2})
		assert.Nil(t, err)
		assert.Equal(t, 2, len(res))
		expectDesc1 := &logi_data_pb.DataValueDesc{
			Id:            "1",
			Date:          "2020-06-30",
			PlaceholderId: "779",
			Name:          "p1",
			IsTimeseries:  true,
			Format:        "1",
		}
		expectDesc2 := &logi_data_pb.DataValueDesc{
			Id:            "1",
			Date:          "2020-06-30",
			PlaceholderId: "783",
			Name:          "p2",
			IsTimeseries:  true,
			Format:        "2",
		}
		assert.Equal(t, expectDesc1.Id, res[0].Id)
		assert.Equal(t, expectDesc1.Date, res[0].Date)
		assert.Equal(t, expectDesc1.PlaceholderId, res[0].PlaceholderId)

		assert.Equal(t, expectDesc2.Id, res[1].Id)
		assert.Equal(t, expectDesc2.Date, res[1].Date)
		assert.Equal(t, expectDesc2.PlaceholderId, res[1].PlaceholderId)
	})
}
