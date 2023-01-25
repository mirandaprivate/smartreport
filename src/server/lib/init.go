package lib

import (
	"logi/src/server/lib/grpc_client"
	"logi/src/server/lib/http_client"
	"logi/src/server/lib/log"
)

// Init setup
func Init() error {
	log.Init()
	http_client.Init()
	return grpc_client.Init()
}
