package testing

import (
	inner_rpc "logi/src/proto/inner/rpc"
	"logi/src/server/lib/grpc_client"
)

func SetupInnerGrpcClient(client inner_rpc.InnerSvcClient) {
	grpc_client.InnerGrpcClient = client
}
