package jianda

import (
	"bytes"
	"context"

	"net/http"
)

func DownloadFile(ctx context.Context, rawURL string) ([]byte, error) {
	u := rawURL
	payload := &requestPayload{
		Method: http.MethodGet,
		Url:    u,
		Body:   bytes.NewBuffer([]byte{}),
		Ctx:    ctx,
	}

	respBodyBytes, err := payload.Send()
	if err != nil {
		return nil, err
	}
	return respBodyBytes, nil
}
