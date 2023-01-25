package config

func IsTestingMode() bool {
	return Viper.GetBool(TestOnly)
}
