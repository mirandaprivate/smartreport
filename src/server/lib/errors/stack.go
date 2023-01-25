package errors

import (
	"fmt"
	"regexp"
	"strings"

	pkgerrors "github.com/pkg/errors"
)

var (
	blackListStackPrefix = []string{
		"/usr/local/go/src",
		"bazel-out",
		"external",
		"GOROOT",
	}
	blackListStackExpr = regexp.MustCompile("src.*interceptor.go:.*")
)

type StackError struct {
	message string
	stack   []string
}

func (e *StackError) Stack() []string {
	// 移除前两个stack元素，因为前两个元素是errors.go中新建error的stack，
	// 每个stack的前两个都是这两个元素，所以没有意义.
	stackWithoutErrors := e.stack[2:]

	// 移除所有/usr/local/go/src/的stack，对于浅层次的debug，应该用不到
	stackWithoutGoSrcs := []string{}
Err:
	for _, e := range stackWithoutErrors {
		for _, prefix := range blackListStackPrefix {
			if strings.HasPrefix(e, prefix) {
				continue Err
			}
			if blackListStackExpr.MatchString(e) {
				continue Err
			}
		}
		stackWithoutGoSrcs = append(stackWithoutGoSrcs, e)
	}

	return stackWithoutGoSrcs
}

func (e *StackError) FullStack() []string {
	return e.stack
}

func GetStackError(e error) *StackError {
	if e == nil {
		return nil
	}
	sources := getTrace(e)
	if len(sources) == 0 {
		return nil
	}
	return &StackError{
		message: e.Error(),
		stack:   sources,
	}
}

func getTrace(e error) []string {
	sources := []string{}
	if e == nil {
		return sources
	}
	if err, ok := e.(stackTracer); ok {
		for _, f := range err.StackTrace() {
			message := strings.Split(fmt.Sprintf("%+v", f), "\n\t")
			if len(message) != 2 {
				continue
			}
			source := message[1]
			sources = append(sources, source)
		}
	} else if err, ok := e.(cause); ok {
		sources = append(sources, getTrace(err.Cause())...)
	}
	return sources
}

type stackTracer interface {
	StackTrace() pkgerrors.StackTrace
}

type cause interface {
	Cause() error
}
