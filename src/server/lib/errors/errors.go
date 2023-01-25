package errors

import (
	"fmt"

	pkgerrors "github.com/pkg/errors"
)

const (
	notFoundErr     = "资源不存在"
	internalErr     = "服务器内部错误"
	invalidErr      = "非法请求"
	permissionErr   = "没有权限"
	initErr         = "初始化错误"
	unauthorizedErr = "未授权"
)

type NotFoundError struct{}

func (NotFoundError) Error() string { return notFoundErr }

type InternalError struct{}

func (InternalError) Error() string { return internalErr }

type InvalidError struct{}

func (InvalidError) Error() string { return invalidErr }

type PermissionError struct{}

func (PermissionError) Error() string { return permissionErr }

type InitError struct{}

func (InitError) Error() string { return initErr }

type UnauthorizedError struct{}

func (UnauthorizedError) Error() string { return unauthorizedErr }

// ErrNotFound is an extend of codes.NotFound
func ErrNotFound(err error) error {
	return wrapErr(NotFoundError{}, err)
}

// ErrNotFoundf is an extend of codes.Invalid
func ErrNotFoundf(err error, format string, args ...interface{}) error {
	return wrapErrf(NotFoundError{}, err, format, args...)
}

func ErrNotFoundRaw(message string) error {
	return wrapErr(NotFoundError{}, pkgerrors.New(message))
}

// ErrInternal is an extend of codes.Internal
func ErrInternal(err error) error {
	return wrapErr(InternalError{}, err)
}

// ErrInternalf is an extend of codes.Internal
func ErrInternalf(err error, format string, args ...interface{}) error {
	return wrapErrf(InternalError{}, err, format, args...)
}

func ErrInternalRaw(message string) error {
	return wrapErr(InternalError{}, pkgerrors.New(message))
}

// ErrInvalid is an extend of codes.Invalid
func ErrInvalid(err error) error {
	return wrapErr(InvalidError{}, err)
}

// ErrInvalidf is an extend of codes.Invalid
func ErrInvalidf(err error, format string, args ...interface{}) error {
	return wrapErrf(InvalidError{}, err, format, args...)
}

func ErrInvalidRaw(message string) error {
	return wrapErr(InvalidError{}, pkgerrors.New(message))
}

// ErrPermissionDenied is an extend of codes.PermissionDenied
func ErrPermissionDenied(err error) error {
	return wrapErr(PermissionError{}, err)
}

// ErrPermissionDeniedf is an extend of codes.PermissionDenied
func ErrPermissionDeniedf(
	err error, format string, args ...interface{}) error {
	return wrapErrf(PermissionError{}, err, format, args...)
}

func ErrPermissionDeniedRaw(message string) error {
	return wrapErr(PermissionError{}, pkgerrors.New(message))
}

func ErrInit(err error) error {
	return wrapErr(InitError{}, err)
}

func ErrInitf(err error, format string, args ...interface{}) error {
	return wrapErrf(InitError{}, err, format, args...)
}

func ErrInitRaw(message string) error {
	return wrapErr(InitError{}, pkgerrors.New(message))
}

func ErrUnauthorized(err error) error {
	return wrapErr(UnauthorizedError{}, err)
}

func ErrUnauthorizedf(err error, format string, args ...interface{}) error {
	return wrapErrf(UnauthorizedError{}, err, format, args...)
}

func ErrUnauthorizedRaw(message string) error {
	return wrapErr(UnauthorizedError{}, pkgerrors.New(message))
}

func ErrWrap(err error) error {
	return pkgerrors.WithMessage(err, "")
}

func ErrWrapf(err error, format string, args ...interface{}) error {
	return pkgerrors.WithMessage(err, fmt.Sprintf(format, args...))
}

func ErrorIs(err error, target error) bool {
	return pkgerrors.Is(err, target)
}

func wrapErr(wrapedErr error, err error) error {
	if err == nil {
		return pkgerrors.Wrap(wrapedErr, "")
	}
	return pkgerrors.Wrap(wrapedErr, err.Error())
}

func wrapErrf(
	wrapedErr error, err error, format string, args ...interface{}) error {
	e := pkgerrors.WithMessagef(wrapedErr, format, args...)
	if err == nil {
		return pkgerrors.Wrap(wrapedErr, e.Error())
	}
	return pkgerrors.Wrap(e, err.Error())
}
