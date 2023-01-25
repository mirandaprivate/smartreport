package jianda

import (
	"bytes"
	"context"
	"net/http"

	jianda_data_pb "logi/src/proto/jianda/data"
	"logi/src/server/lib/consts"
	"logi/src/server/lib/errors"

	"github.com/golang/protobuf/jsonpb"
)

func GetDataValues(
	ctx context.Context,
	r *jianda_data_pb.DataValueRequest,
) (*jianda_data_pb.DataValueResponse, error) {
	b := bytes.NewBuffer([]byte{})
	if err := defaultMarshaler.Marshal(b, r); err != nil {
		return nil, errors.ErrInternal(err)
	}
	bs := b.Bytes()
	apiURL, err := getJiandaApiURL(consts.JiandaServerDataValueApiPath)
	if err != nil {
		return nil, err
	}
	payload := &requestPayload{
		Ctx:    ctx,
		Method: http.MethodPost,
		Url:    apiURL.String(),
		Body:   bytes.NewBuffer(bs),
	}
	respBodyBytes, err := payload.Send()
	if err != nil {
		return nil, errors.ErrWrapf(err, "body: %s", string(bs))
	}

	respPB := &jianda_data_pb.DataValueResponse{}
	if err := jsonpb.UnmarshalString(string(respBodyBytes), respPB); err != nil {
		return nil, unmarshalErr(apiURL.String(), string(b.Bytes()), err.Error())
	}

	if err := checkResp(respPB.Status); err != nil {
		return nil, err
	}
	return respPB, nil
}
