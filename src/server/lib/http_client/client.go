package http_client

import "net/http"

// 所有http的client使用interface的原因是因为能够写单元测试
type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

var (
	Client HTTPClient
)

func Init() {
	Client = &http.Client{}
}
