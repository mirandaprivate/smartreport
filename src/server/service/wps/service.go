package wps

import (
	"context"
	wps_pb "logi/src/proto/wps"
)

// Service implements auth_pb.Auth
type Service struct{}

func (*Service) GetSaasWpsUrl(
	ctx context.Context,
	req *wps_pb.WpsUrlParams,
) (*wps_pb.WpsUrlResponse, error) {
	return getSaasWpsUrl(ctx, req)
}
