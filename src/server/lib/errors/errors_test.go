package errors

import (
	stderrors "errors"
	"fmt"
	"testing"

	pkgerrors "github.com/pkg/errors"
	"github.com/stretchr/testify/assert"
)

func createWrapErr() error {
	return ErrWrap(createErr())
}

func createErr() error {
	return ErrNotFound(stderrors.New("not found error"))
}

func createInternalErr() error {
	return ErrInternal(stderrors.New("internal error"))
}

func createInternalWrapErr() error {
	return ErrWrap(createInternalErr())
}

func createNestedErr() error {
	return ErrInvalid(createWrapErr())
}

func TestErrors(t *testing.T) {
	t.Run("not found error test", func(t *testing.T) {
		err1 := stderrors.New("not found error")
		newErr := ErrNotFound(err1)
		assert.Equal(t, "not found error: 资源不存在", newErr.Error())

		err2 := createErr()
		assert.Equal(t, "资源不存在\nnot found error\nlogi/src/server/lib/errors.wrapErr\n\t/home/jiabao/code/logi/src/server/lib/errors/errors.go:135\nlogi/src/server/lib/errors.ErrNotFound\n\t/home/jiabao/code/logi/src/server/lib/errors/errors.go:44\nlogi/src/server/lib/errors.createErr\n\t/home/jiabao/code/logi/src/server/lib/errors/errors_test.go:17\nlogi/src/server/lib/errors.TestErrors.func1\n\t/home/jiabao/code/logi/src/server/lib/errors/errors_test.go:38\ntesting.tRunner\n\t/usr/local/go/src/testing/testing.go:1123\nruntime.goexit\n\t/usr/local/go/src/runtime/asm_amd64.s:1374",
			fmt.Sprintf("%+v", err2))
	})
	t.Run("not found raw error test", func(t *testing.T) {
		err1 := stderrors.New("not found error")
		newErr := ErrNotFoundf(err1, "err1 error %s", "test")
		assert.Equal(t, "not found error: err1 error test: 资源不存在", newErr.Error())
	})
	t.Run("cause test", func(t *testing.T) {
		err := createWrapErr()
		switch pkgerrors.Cause(err).(type) {
		case NotFoundError:
		default:
			t.Error("expect to equal NotFoundError type")
		}

		err2 := createInternalErr()
		switch pkgerrors.Cause(err2).(type) {
		case InternalError:
		default:
			t.Error("expect to equal internal type")
		}
	})
	t.Run("nested cause test", func(t *testing.T) {
		err := createNestedErr()
		switch pkgerrors.Cause(err).(type) {
		case InvalidError:
		default:
			t.Error("expect to equal InvalidError type")
		}
	})
}
