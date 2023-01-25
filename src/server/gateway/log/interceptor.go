package log

import (
	"context"
	"encoding/json"
	syslog "logi/src/server/lib/log"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_logrus "github.com/grpc-ecosystem/go-grpc-middleware/logging/logrus"
	"github.com/grpc-ecosystem/go-grpc-middleware/logging/logrus/ctxlogrus"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	logEntry           *logrus.Entry
	logMethodBlackList = []string{
		"/saas.NotificationSvc/List",
	}
)

const (
	maxShowReqLength = 200
)

func logInterceptor1(
	ctx context.Context,
	req interface{},
	_ *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	newCtx := ctxlogrus.ToContext(ctx, logEntry)
	fields := logrus.Fields{}
	bytes, _ := json.Marshal(req)
	if len(bytes) < maxShowReqLength {
		fields["req"] = string(bytes)
	}
	grpc_logrus.AddFields(newCtx, fields)
	return handler(newCtx, req)
}

func logInterceptor2(
	ctx context.Context,
	req interface{},
	_ *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	fields := make(logrus.Fields)
	res, err := handler(ctx, req)
	s, ok := status.FromError(err)
	if ok {
		code := runtime.HTTPStatusFromCode(s.Code())
		fields["code"] = code
	}
	if err != nil && ok {
		msg, _ := new(runtime.JSONPb).Marshal(s.Proto())
		fields["resp"] = string(msg)
	}
	grpc_logrus.AddFields(ctx, fields)
	return res, err
}

func customFunc(c codes.Code) logrus.Level {
	switch c {
	case codes.Internal:
		return logrus.ErrorLevel
	case codes.InvalidArgument,
		codes.Unauthenticated,
		codes.PermissionDenied:
		return logrus.WarnLevel
	default:
		return logrus.InfoLevel
	}
}

func decider(fullMethodName string, err error) bool {
	if err != nil {
		return true
	}
	for _, name := range logMethodBlackList {
		if fullMethodName == name {
			return false
		}
	}
	return true
}

func Interceptor() func(
	ctx context.Context,
	req interface{},
	_ *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler) (interface{}, error) {
	logEntry = logrus.NewEntry(syslog.Logger)
	// Make sure that log statements internal to gRPC library are logged using
	// the logrus Logger as well.
	// Disable the following grpc logger for the current time, it seems useless
	// for our debug.
	// grpc_logrus.ReplaceGrpcLogger(logEntry)

	ops := []grpc_logrus.Option{
		grpc_logrus.WithLevels(customFunc),
		grpc_logrus.WithDecider(decider),
	}
	return grpc_middleware.ChainUnaryServer(
		logInterceptor1,
		grpc_logrus.UnaryServerInterceptor(logEntry, ops...),
		logInterceptor2,
	)
}
