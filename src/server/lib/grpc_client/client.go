package grpc_client

import (
	inner_rpc "logi/src/proto/inner/rpc"
	"logi/src/server/lib/config"
	"logi/src/server/lib/errors"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
)

const (
	clientPingDuration = 10 * time.Second
)

var (
	// the grpc client is thread safe
	// https://github.com/grpc/grpc-go/blob/master/Documentation/concurrency.md
	InnerGrpcClient inner_rpc.InnerSvcClient
)

func Init() error {
	addr := config.Viper.GetString(config.ServerNodeGrpcAddr)
	conn, err := grpc.Dial(addr, grpc.WithInsecure(), grpc.WithKeepaliveParams(
		keepalive.ClientParameters{
			Time:                clientPingDuration,
			PermitWithoutStream: true,
		},
	))
	if err != nil {
		return errors.ErrInit(err)
	}
	InnerGrpcClient = inner_rpc.NewInnerSvcClient(conn)
	return nil
}
