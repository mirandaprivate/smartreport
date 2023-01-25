package config

import (
	"fmt"
	"os"
	"text/tabwriter"
)

// Argument reprents an argument
type Argument struct {
	Name        string
	Default     interface{}
	Description string
}

const (
	// EnvPrefix is prefix for env vars
	EnvPrefix = "LOGI"

	// ServerGatewayAddr is server gateway address
	ServerGatewayAddr = "server.gateway_addr"
	// ServerGrpcAddr is server grpc address
	ServerGrpcAddr = "server.grpc_addr"
	// ServerNodeGrpcAddr is nodejs server grpc address
	ServerNodeGrpcAddr = "server.node_grpc_addr"
	SyslogLevel        = "syslog.level"
	SyslogFilePath     = "syslog.filepath"
	SyslogStdout       = "syslog.stdout"
	TestOnly           = "testonly"
	WpsAppkey          = "wps.appkey"
	WpsAppid           = "wps.appid"
	WpsDebugUser       = "wps.dbg_user"
	WpsServerUrl       = "wps.server.url"
	JiandaApiURL       = "jianda.server.url"
)

var Arguments = []Argument{
	{
		Name:        ServerGatewayAddr,
		Default:     "0.0.0.0:10000",
		Description: "server gateway address",
	},
	{
		Name:        ServerGrpcAddr,
		Default:     "localhost:10001",
		Description: "server grpc address",
	},
	{
		Name:        ServerNodeGrpcAddr,
		Default:     "localhost:10002",
		Description: "server nodejs grpc address",
	},
	{
		Name:    SyslogLevel,
		Default: "info",
		Description: `output level of server logs, including:
			'panic' 'fatal' 'error' 'warn' 'info' 'debug' 'trace'`,
	},
	{
		Name:        SyslogFilePath,
		Default:     "/file.log",
		Description: `the syslog`,
	},
	{
		Name:        SyslogStdout,
		Default:     true,
		Description: `If the syslog output to stdout.`,
	},
	{
		Name:        TestOnly,
		Default:     "false",
		Description: "TestOnly",
	},
	{
		Name:        WpsAppkey,
		Default:     "",
		Description: "The app key to the wps server",
	},
	{
		Name:        WpsAppid,
		Default:     "",
		Description: "The app id to the wps server",
	},
	{
		Name:        WpsDebugUser,
		Default:     "",
		Description: "The debug user used by traefik to proxy the req",
	},
	{
		Name:        WpsServerUrl,
		Default:     "https://wps-server.logiocean.com",
		Description: "The wps server url",
	},
	{
		Name:        JiandaApiURL,
		Default:     "",
		Description: "The jianda server url",
	},
}

func PrintConfig() {
	writer := tabwriter.NewWriter(
		os.Stdout, 0, 8, 1, '\t', tabwriter.AlignRight)

	for _, conf := range Arguments {
		name := conf.Name
		fmt.Fprintf(writer, "%s:\t%s\n", name, Viper.Get(name))
	}
	writer.Flush()
}
