package jianda

import (
	"bytes"
	"context"
	"net/http"

	data_pb "logi/src/proto/jianda/data"
	"logi/src/server/lib/consts"
	"logi/src/server/lib/errors"

	"github.com/golang/protobuf/jsonpb"
)

func GetLastDate(
	ctx context.Context,
	r *data_pb.DataLastDateRequest,
) (*data_pb.DataLastDateResponse, error) {
	apiURL, err := getJiandaApiURL(consts.JiandaServerDataLastDateApiPath)
	if err != nil {
		return nil, err
	}
	reqPB := &data_pb.DataLastDateRequest{
		ResearchId: r.ResearchId,
		Ids:        r.Ids,
	}
	b := bytes.NewBuffer([]byte{})
	if err := defaultMarshaler.Marshal(b, reqPB); err != nil {
		return nil, errors.ErrInternal(err)
	}
	payload := &requestPayload{
		Method: http.MethodPost,
		Url:    apiURL.String(),
		Body:   b,
		Ctx:    ctx,
	}
	respBodyBytes, err := payload.Send()
	if err != nil {
		return nil, err
	}
	respPB := &data_pb.DataLastDateResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), string(b.Bytes()), err.Error())
	}
	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}
	return respPB, nil
}
