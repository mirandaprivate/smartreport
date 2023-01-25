package service

import (
	"context"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"

	doc_pb "logi/src/proto/doc/rpc"
	ping_pb "logi/src/proto/ping/rpc"
	wps_pb "logi/src/proto/wps/rpc"
	doc_svc "logi/src/server/service/doc"
	ping_svc "logi/src/server/service/ping"
	wps_svc "logi/src/server/service/wps"
)

const (
	// 50 M
	maxMsgSize = 50 * 1024 * 1024
)

// RegisterServers register grpc services.
func RegisterServers(grpcServer *grpc.Server) {
	ping_pb.RegisterPingSvcServer(grpcServer, new(ping_svc.Service))
	wps_pb.RegisterWpsSvcServer(grpcServer, new(wps_svc.Service))
	doc_pb.RegisterDocSvcServer(grpcServer, new(doc_svc.Service))
}

// RegisterHandlers register grpc gateway handlers.
func RegisterHandlers(gwmux *runtime.ServeMux, grpcAddr string) {
	ctx := context.Background()
	dopts := []grpc.DialOption{
		grpc.WithInsecure(),
		grpc.WithDefaultCallOptions(
			grpc.MaxCallRecvMsgSize(maxMsgSize),
			grpc.MaxCallSendMsgSize(maxMsgSize),
		),
	}
	type RegisterHandlerFromEndpoint func(
		ctx context.Context,
		gwmux *runtime.ServeMux,
		endpoint string,
		opts []grpc.DialOption) (err error)

	funcs := []RegisterHandlerFromEndpoint{
		ping_pb.RegisterPingSvcHandlerFromEndpoint,
		wps_pb.RegisterWpsSvcHandlerFromEndpoint,
		doc_pb.RegisterDocSvcHandlerFromEndpoint,
	}

	for _, f := range funcs {
		f(ctx, gwmux, grpcAddr, dopts)
	}
}
