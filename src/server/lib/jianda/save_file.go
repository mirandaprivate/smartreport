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

func SaveFile(
	ctx context.Context,
	r *jianda_file_pb.SaveFileRequest,
) (*jianda_file_pb.SaveFileResponse, error) {
	apiURL, err := getJiandaApiURL(consts.JiandaServerSaveFileApiPath)
	if err != nil {
		return nil, err
	}
	b := bytes.NewBuffer([]byte{})
	if err := defaultMarshaler.Marshal(b, r); err != nil {
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
	respPB := &jianda_file_pb.SaveFileResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), string(b.Bytes()), err.Error())
	}
	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}
	return respPB, nil
}
