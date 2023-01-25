package jianda

import (
	"bytes"
	"context"
	"net/http"

	jianda_file_pb "logi/src/proto/jianda/file"
	"logi/src/server/lib/consts"
	"logi/src/server/lib/errors"

	"github.com/golang/protobuf/jsonpb"
)

func GetFileHistory(
	ctx context.Context,
	r *jianda_file_pb.GetFileVersionHistoryRequest,
) (*jianda_file_pb.GetFileVersionHistoryResponse, error) {
	apiURL, err := getJiandaApiURL(consts.JiandaServerGetFileHistoryInfoApiPath)
	if err != nil {
		return nil, err
	}
	reqPB := &jianda_file_pb.GetFileVersionHistoryRequest{
		Id:     r.Id,
		Type:   r.Type,
		Offset: r.Offset,
		Count:  r.Count,
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
	respPB := &jianda_file_pb.GetFileVersionHistoryResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), string(b.Bytes()), err.Error())
	}
	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}
	return respPB, nil
}
