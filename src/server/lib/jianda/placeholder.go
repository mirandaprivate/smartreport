package jianda

import (
	"bytes"
	"context"
	"net/http"

	jianda_data_pb "logi/src/proto/jianda/data"
	"logi/src/server/lib/consts"

	"github.com/golang/protobuf/jsonpb"
)

func GetPlaceHolders(
	ctx context.Context,
	r *jianda_data_pb.GetPlaceholderRequest,
) (*jianda_data_pb.GetPlaceholderResponse, error) {
	apiURL, err := getJiandaApiURL(consts.JiandaServerPlaceHolderDescApiPath)
	if err != nil {
		return nil, err
	}
	q := apiURL.Query()
	for _, id := range r.Ids {
		q.Add("ids", id)
	}
	apiURL.RawQuery = q.Encode()
	b := bytes.NewBuffer([]byte{})
	payload := &requestPayload{
		Method: http.MethodGet,
		Url:    apiURL.String(),
		Body:   b,
		Ctx:    ctx,
	}
	respBodyBytes, err := payload.Send()
	if err != nil {
		return nil, err
	}
	respPB := &jianda_data_pb.GetPlaceholderResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), "", err.Error())
	}
	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}
	return respPB, nil
}
