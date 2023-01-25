package error

import (
	"context"
	"logi/src/server/lib/errors"
	"logi/src/server/lib/log"

	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pkgerrors "github.com/pkg/errors"
	"google.golang.org/grpc"
)

func Interceptor() grpc.UnaryServerInterceptor {
	return errMappingInterceptor
}

func errMappingInterceptor(
	ctx context.Context,
	req interface{},
	reqinfo *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	res, err := handler(ctx, req)
	if err == nil {
		return res, err
	}
	var code codes.Code
	switch pkgerrors.Cause(err).(type) {
	case errors.InitError:
		code = codes.Internal
	case errors.InternalError:
		code = codes.Internal
	case errors.InvalidError:
		code = codes.InvalidArgument
	case errors.NotFoundError:
		code = codes.NotFound
	case errors.PermissionError:
		code = codes.PermissionDenied
	case errors.UnauthorizedError:
		code = codes.Unauthenticated
	default:
		log.Logger.WithError(err).WithField("method", reqinfo.FullMethod).
			Warn("此error没有使用src/server/lib/errors生成！")
		return res, err
	}
	stack := errors.GetStackError(err)
	if stack == nil {
		log.Logger.WithError(err).WithField("method", reqinfo.FullMethod).
			Warn("此error wrap方式错误,拿不到stack")
		return res, err
	}
	info := &errdetails.DebugInfo{
		Detail:       err.Error(),
		StackEntries: stack.Stack(),
	}
	s, _ := status.New(code, err.Error()).WithDetails(info)
	return res, s.Err()
}
