package errors

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func createErr2() error {
	return createErr()
}

func TestStackError(t *testing.T) {
	t.Run("full stack error test", func(t *testing.T) {
		err := createWrapErr()
		stackErr := GetStackError(err)
		assert.Equal(t, []string{
			"/home/jiabao/code/logi/src/server/lib/errors/errors.go:135",
			"/home/jiabao/code/logi/src/server/lib/errors/errors.go:44",
			"/home/jiabao/code/logi/src/server/lib/errors/errors_test.go:17",
			"/home/jiabao/code/logi/src/server/lib/errors/errors_test.go:13",
			"/home/jiabao/code/logi/src/server/lib/errors/stack_test.go:15",
			"/usr/local/go/src/testing/testing.go:1123",
			"/usr/local/go/src/runtime/asm_amd64.s:1374",
		}, stackErr.FullStack())
	})
	t.Run("stack error test", func(t *testing.T) {
		err := createWrapErr()
		stackErr := GetStackError(err)
		assert.Equal(t, []string{
			"/home/jiabao/code/logi/src/server/lib/errors/errors_test.go:17",
			"/home/jiabao/code/logi/src/server/lib/errors/errors_test.go:13",
			"/home/jiabao/code/logi/src/server/lib/errors/stack_test.go:28",
		}, stackErr.Stack())
	})
	t.Run("proxy stack error test", func(t *testing.T) {
		err := createNestedErr()
		stackErr := GetStackError(err)
		assert.Equal(t, []string{
			"/home/jiabao/code/logi/src/server/lib/errors/errors_test.go:29",
			"/home/jiabao/code/logi/src/server/lib/errors/stack_test.go:37",
		}, stackErr.Stack())
	})
	t.Run("other error test", func(t *testing.T) {
		err := fmt.Errorf("other error")
		stackErr := GetStackError(err)
		assert.Nil(t, stackErr)
	})
}
