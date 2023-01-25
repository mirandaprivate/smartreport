package main

import (
	"logi/rules/plugin/module"

	pgs "github.com/lyft/protoc-gen-star"
)

func main() {
	pgs.Init(pgs.DebugEnv("DEBUG")).
		RegisterModule(module.New()).
		Render()
}
