package gateway

import (
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"path/filepath"
	r1 "runtime"
	"time"

	"github.com/gorilla/mux"
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_recovery "github.com/grpc-ecosystem/go-grpc-middleware/recovery"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	// "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
	// "google.golang.org/grpc/reflection"

	error_middleware "logi/src/server/gateway/error"
	"logi/src/server/gateway/log"
	"logi/src/server/gateway/routers"
	// "logi/src/server/gateway/swagger"
	"logi/src/server/gateway/validate"
	"logi/src/server/lib"
	"logi/src/server/lib/config"
	"logi/src/server/lib/errors"
	"logi/src/server/service"
)

var (
	// Create some standard server metrics.
	grpcMetrics = grpc_prometheus.NewServerMetrics()
)

const (
	swaggerPrefix    = "/swagger/"
	prometheusPrefix = "/metrics"
	// 50 M
	maxMsgSize         = 50 * 1024 * 1024
	clientMinWaitPing  = 5 * time.Second
	serverPingDuration = 10 * time.Minute
)

func serveSwagger(router *mux.Router) {
	// swagger json file is generated from protos in `alpha/proto`.
	swaggerJSON, _ := filepath.Abs("src/proto/swagger.json")
	// see:
	// 	   `bazel/npm/patches/swagger-ui-dist+3.25.0.patch`
	jsonPrefix := fmt.Sprintf("%s%s", swaggerPrefix, "swagger.json")
	router.PathPrefix(jsonPrefix).Handler(
		http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			f, err := ioutil.ReadFile(swaggerJSON)
			if err != nil {
				panic(err)
			}
			w.Write(f)
		}))
}


func mainInit() error {
	if err := lib.Init(); err != nil {
		return err
	}
	routers.Init()
	return service.Init()
}

func recoverFunc(p interface{}) (err error) {
	_, f1, l1, _ := r1.Caller(6)
	_, f2, l2, _ := r1.Caller(7)
	detail := fmt.Sprintf("%v\n%s, %d\n%s,%d", p, f1, l1, f2, l2)
	return errors.ErrInternalRaw(detail)
}

// Serve serve
func Serve() {
	config.PrintConfig()
	if err := mainInit(); err != nil {
		panic(err)
	}
	gwmux := runtime.NewServeMux()
	opts := []grpc.ServerOption{
		grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
			grpc_prometheus.UnaryServerInterceptor,
			log.Interceptor(),
			validate.Interceptor,
			grpc_recovery.UnaryServerInterceptor(
				grpc_recovery.WithRecoveryHandler(recoverFunc)),
			error_middleware.Interceptor(),
		)),
		grpc.MaxSendMsgSize(maxMsgSize),
		grpc.MaxRecvMsgSize(maxMsgSize),
		grpc.KeepaliveParams(keepalive.ServerParameters{
			Time: serverPingDuration,
		}),
		grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{
			MinTime:             clientMinWaitPing,
			PermitWithoutStream: true,
		}),
	}

	grpcAddr := config.Viper.GetString(config.ServerGrpcAddr)
	gatewayAddr := config.Viper.GetString(config.ServerGatewayAddr)

	// Create grpc server & register grpc services.
	grpcServer := grpc.NewServer(opts...)
	service.RegisterServers(grpcServer)
	service.RegisterHandlers(gwmux, grpcAddr)
	grpc_prometheus.EnableHandlingTimeHistogram()
	grpc_prometheus.Register(grpcServer)
	// reflection.Register(grpcServer)

	go func() {
		lis, err := net.Listen("tcp", grpcAddr)
		if err != nil {
			panic(err)
		}
		if err := grpcServer.Serve(lis); err != nil {
			panic(err)
		}
	}()

	router := mux.NewRouter()
	serveSwagger(router)
	router.PathPrefix(prometheusPrefix).Handler(promhttp.Handler())
	router.PathPrefix(routers.GinPrefix).Handler(routers.Route)
	router.PathPrefix("/").Handler(gwmux)

	gateWay := &http.Server{
		Addr:    gatewayAddr,
		Handler: router,
	}
	fmt.Printf("API: http://%s%s \n", gatewayAddr, swaggerPrefix)
	if err := gateWay.ListenAndServe(); err != nil {
		panic(err)
	}
}
