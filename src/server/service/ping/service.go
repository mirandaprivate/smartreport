package ping

import (
	"context"
	ping_pb "logi/src/proto/ping"
)

// Service implements ping_pb.pingSrvServer.
type Service struct{}

// Check implements ping_pb.pingSrv.Pong
func (*Service) Check(
	ctx context.Context,
	_ *ping_pb.Ping,
) (*ping_pb.Pong, error) {

	return &ping_pb.Pong{
		Res: "pong",
	}, nil
}
