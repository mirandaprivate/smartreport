package templates

import (
	"text/template"

	"logi/rules/plugin/templates/base"
	"logi/rules/plugin/templates/grpc"

	pgs "github.com/lyft/protoc-gen-star"
)

// Templates gets the templates map of all generated files.
func Templates(params pgs.Parameters) map[string]*template.Template {
	/**
	 * Mapping filename suffix to template.
	 */
	return map[string]*template.Template{
		params.StrDefault("-suffix", "_pb"): base.Template(params),
		"_grpc":                             grpc.NodeTemplate(params),
		"_grpc_web":                         grpc.WebTemplate(params),
	}
}
