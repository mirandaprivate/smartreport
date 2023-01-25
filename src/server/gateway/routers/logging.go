package routers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

const (
	system = "gin"
	// 5k
	maxResponseBodyInLogging = 5 * 1024
	maxRequestBodyInLogging  = 1024
)

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	if len(b) < maxResponseBodyInLogging {
		w.body.Write(b)
	}
	return w.ResponseWriter.Write(b)
}

// Logger is the logrus logger handler
func Logger(logger logrus.FieldLogger) gin.HandlerFunc {
	return func(c *gin.Context) {
		body, _ := ioutil.ReadAll(c.Request.Body)
		c.Request.Body = ioutil.NopCloser(bytes.NewReader(body))
		path := c.Request.URL.Path
		start := time.Now()
		blw := &bodyLogWriter{
			body:           new(bytes.Buffer),
			ResponseWriter: c.Writer,
		}
		c.Writer = blw
		c.Next()
		duration := time.Since(start).Milliseconds()
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		clientUserAgent := c.Request.UserAgent()
		fields := logrus.Fields{
			"code":        statusCode,
			"duration_ms": duration,
			"client_ip":   clientIP,
			"method":      c.Request.Method,
			"path":        path,
			"user_agent":  clientUserAgent,
			"system":      system,
			"url":         c.Request.URL.String(),
		}
		referer := c.Request.Referer()
		if referer != "" {
			fields["referer"] = referer
		}
		if len(body) > 0 && len(body) < maxRequestBodyInLogging {
			compactBody := new(bytes.Buffer)
			if err := json.Compact(compactBody, body); err == nil {
				fields["req"] = string(compactBody.Bytes())
			}
		}
		if statusCode >= 400 {
			fields["resp"] = string(blw.body.Bytes())
		}

		entry := logger.WithFields(fields)

		if len(c.Errors) > 0 {
			entry.Error(c.Errors.ByType(gin.ErrorTypePrivate).String())
		} else {
			if statusCode >= http.StatusInternalServerError {
				entry.Error()
			} else if statusCode >= http.StatusBadRequest {
				entry.Warn()
			} else {
				entry.Info()
			}
		}
	}
}
