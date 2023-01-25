package testing

import (
	"logi/src/server/lib/log"

	"github.com/sirupsen/logrus"
)

// SetupLog create and assign logger instances to /src/server/lib/log.Logger and
// DebugLogger.
func SetupLog() {
	debugLogger := logrus.New()
	logger := logrus.New()
	log.DebugLogger = debugLogger
	log.Logger = logger
}
