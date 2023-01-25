package jianda

import (
	"context"
	"io"
	"logi/src/server/lib/consts"
	test_utils "logi/src/server/lib/testing"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDownloadFile(t *testing.T) {
	t.Run("test download file", func(t *testing.T) {
		test_utils.SetupViper()
		testFileBytes := []byte("testfile")
		u := "http://www.jianda.com/file"
		test_utils.SetupHttpClient(func(r *http.Request) (*http.Response, error) {
			var reader io.ReadCloser
			switch r.URL.String() {
			case u:
				reader = test_utils.NewBodyReader(testFileBytes)
			default:
				t.Fatal(r.URL.String())
			}
			return &http.Response{
				Status:     "200, ok",
				StatusCode: http.StatusOK,
				Body:       reader,
			}, nil
		})
		ctx := context.WithValue(
			context.Background(),
			consts.JiandaRequestAuthHeaderKey,
			"auth",
		)

		b, err := DownloadFile(ctx, u)
		assert.Nil(t, err)
		assert.Equal(t, testFileBytes, b)
	})
}
