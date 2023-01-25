package config

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

// Viper viper.Viper
var Viper *viper.Viper

func GetEnv(arg Argument) string {
	env := strings.ToUpper(strings.ReplaceAll(arg.Name, ".", "_"))
	env = fmt.Sprintf("%s_%s", EnvPrefix, env)
	return env
}
