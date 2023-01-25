package jianda

import (
	"bytes"
	"context"
	perm_pb "logi/src/proto/jianda/perm"
	"logi/src/server/lib/consts"
	"net/http"

	"github.com/golang/protobuf/jsonpb"
)

func GetPerm(
	ctx context.Context,
	req *perm_pb.GetPermRequest,
) (*perm_pb.GetPermResponse, error) {
	apiURL, err := getJiandaApiURL(consts.JiandaServerGetPermApiPath)
	if err != nil {
		return nil, err
	}
	q := apiURL.Query()
	q.Add("file_id", req.FileId)
	q.Add("user_id", req.UserId)
	q.Add("type", req.Type.Enum().String())
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
	respPB := &perm_pb.GetPermResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), "", err.Error())
	}
	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}
	return respPB, nil
}
