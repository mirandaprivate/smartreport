package testing

import (
	"logi/src/server/lib/config"

	"github.com/spf13/viper"
)

// SetupViper create and assign viper to /src/server/lib/config.Viper
func SetupViper() {
	Viper := viper.New()
	config.Viper = Viper
}
