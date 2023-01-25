package module

import (
	"path"
	"strings"

	"logi/rules/plugin/templates"

	pgs "github.com/lyft/protoc-gen-star"
)

type pluginModule struct {
	*pgs.ModuleBase
}

// New configures the module with an instance of ModuleBase
func New() pgs.Module { return &pluginModule{&pgs.ModuleBase{}} }

// Name is the identifier used to identify the module. This value is
// automatically attached to the BuildContext associated with the ModuleBase.
func (m *pluginModule) Name() string { return "plugin" }

// Execute is passed the target files as well as its dependencies in the pkgs
// map. The implementation should return a slice of Artifacts that represent
// the files to be generated. In this case, "/tmp/report.txt" will be created
// outside of the normal protoc flow.
func (m *pluginModule) Execute(
	targets map[string]pgs.File,
	_ map[string]pgs.Package,
) []pgs.Artifact {
	tpls := templates.Templates(m.Parameters())
	for _, f := range targets {
		m.Push(f.Name().String())
		if !f.BuildTarget() {
			continue
		}
		for _, msg := range f.AllMessages() {
			m.CheckRules(msg)
		}
		baseName := strings.TrimSuffix(
			path.Base(f.Name().String()),
			".proto",
		)
		for suffix, tpl := range tpls {
			fileName := baseName + suffix + ".ts"
			m.AddGeneratorTemplateFile(fileName, tpl, f)
		}
		m.Pop()
	}

	return m.Artifacts()
}
