package jianda

import (
	"bytes"
	"context"
	file_pb "logi/src/proto/jianda/file"

	"logi/src/server/lib/consts"
	"net/http"

	"github.com/golang/protobuf/jsonpb"
)

func GetFileInfo(
	ctx context.Context,
	r *file_pb.FileInfoRequest,
) (*file_pb.FileInfoResponse, error) {
	apiURL, err := getJiandaApiURL(consts.JiandaServerGetFileInfoApiPath)
	if err != nil {
		return nil, err
	}
	q := apiURL.Query()
	q.Add("id", r.Id)
	q.Add("type", r.Type.String())
	apiURL.RawQuery = q.Encode()
	payload := &requestPayload{
		Method: http.MethodGet,
		Url:    apiURL.String(),
		Body:   bytes.NewBuffer([]byte{}),
		Ctx:    ctx,
	}
	respBodyBytes, err := payload.Send()
	if err != nil {
		return nil, err
	}
	respPB := &file_pb.FileInfoResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), "", err.Error())
	}
	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}

	return respPB, nil
}
