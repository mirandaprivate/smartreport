package jianda

import (
	"bytes"
	"context"
	user_pb "logi/src/proto/jianda/user"
	"logi/src/server/lib/consts"
	"net/http"

	"github.com/golang/protobuf/jsonpb"
)

func GetUsersInfo(
	ctx context.Context,
	r *user_pb.UserInfoRequest,
) (*user_pb.UserInfoResponse, error) {
	apiURL, err := getJiandaApiURL(consts.JiandaServerGetUserInfoApiPath)
	if err != nil {
		return nil, err
	}
	q := apiURL.Query()
	for _, id := range r.Ids {
		q.Add("ids", id)
	}
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
	respPB := &user_pb.UserInfoResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), "", err.Error())
	}

	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}
	return respPB, nil
}
