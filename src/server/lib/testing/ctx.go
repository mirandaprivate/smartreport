package testing

import (
	"context"

	"google.golang.org/grpc/metadata"
)

func MakeGrpcCtx(userID string) context.Context {
	m := map[string]string{
		"user_id": userID,
	}
	md := metadata.New(m)
	return metadata.NewIncomingContext(context.Background(), md)
}
