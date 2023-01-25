package common

import (
	"context"
	"logi/src/server/lib/consts"
	"logi/src/server/lib/errors"

	"google.golang.org/grpc/metadata"
)

func JwtFromContext(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", errors.ErrInvalidRaw("此request没有jwt")
	}
	values := md.Get(consts.JiandaRequestAuthHeaderKey)
	if len(values) != 1 {
		return "", errors.ErrInvalidRaw("此request没有jwt")
	}
	return values[0], nil
}
