package cmd

import (
	"logi/src/server/gateway"
	"logi/src/server/lib/config"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	serveCmd = &cobra.Command{
		Use:   "serve",
		Short: "logi server",
		Run: func(cmd *cobra.Command, args []string) {
			gateway.Serve()
		},
	}
)

func initServe() {
	Viper := viper.New()
	for _, conf := range config.Arguments {
		var tmpVar string
		name := conf.Name
		serveCmd.Flags().StringVar(&tmpVar, name, "", conf.Description)
		Viper.BindPFlag(name, serveCmd.Flags().Lookup(name))
		Viper.SetDefault(name, conf.Default)
		env := config.GetEnv(conf)
		Viper.BindEnv(name, env)
	}
	config.Viper = Viper
}

// Execute executes the root command.
func Execute() error {
	initServe()
	return serveCmd.Execute()
}
