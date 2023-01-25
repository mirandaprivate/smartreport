package log

import (
	"logi/src/server/lib/config"
	"os"

	"github.com/sirupsen/logrus"
)

var (
	Logger      *logrus.Logger
	DebugLogger *logrus.Logger
)

func Init() {
	level := config.Viper.GetString(config.SyslogLevel)
	Logger = logrus.New()
	Logger.SetFormatter(&logrus.JSONFormatter{})
	l, err := logrus.ParseLevel(level)
	if err != nil {
		l = logrus.InfoLevel
	}
	Logger.SetLevel(l)
	if config.Viper.GetBool(config.SyslogStdout) {
		Logger.SetOutput(os.Stdout)
	} else {
		logPath := config.Viper.GetString(config.SyslogFilePath)
		// If the file doesn't exist, create it, or append to the file
		f, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			panic(err.Error())
		}
		Logger.SetOutput(f)
	}

	DebugLogger = logrus.New()
	DebugLogger.SetReportCaller(true)
	DebugLogger.SetFormatter(&logrus.JSONFormatter{})
	DebugLogger.SetOutput(os.Stdout)
	DebugLogger.SetLevel(logrus.DebugLevel)
}
