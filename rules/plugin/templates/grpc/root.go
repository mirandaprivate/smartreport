package grpc

import (
	"io/ioutil"
	"path"
	"text/template"

	utils "logi/base/go/bazel"
	"logi/rules/plugin/templates/common"

	pgs "github.com/lyft/protoc-gen-star"
	"google.golang.org/genproto/googleapis/api/annotations"
)

var workspace, _ = utils.GetRunfilesDir()
var pathSuffix = path.Join(
	workspace,
	"/logi/rules/plugin/templates/grpc/",
)

// WebTemplate gets the grpc web template.
func WebTemplate(params pgs.Parameters) *template.Template {
	tpl := template.New("web")
	common.Register(tpl, params)
	register(tpl)
	content, err := ioutil.ReadFile(path.Join(pathSuffix, "web.go.in"))
	if err != nil {
		panic(err)
	}
	template.Must(tpl.Parse(string(content)))
	tplMap := map[string]string{
		"common": "common.go.in",
		"client": "client_web.go.in",
	}
	for name, filePath := range tplMap {
		content, err := ioutil.ReadFile(path.Join(pathSuffix, filePath))
		if err != nil {
			panic(err)
		}
		template.Must(tpl.New(name).Parse(string(content)))
	}

	return tpl
}

// NodeTemplate gets the grpc node template.
func NodeTemplate(params pgs.Parameters) *template.Template {
	tpl := template.New("node")
	common.Register(tpl, params)
	register(tpl)
	content, err := ioutil.ReadFile(path.Join(pathSuffix, "node.go.in"))
	if err != nil {
		panic(err)
	}
	template.Must(tpl.Parse(string(content)))
	tplMap := map[string]string{
		"common": "common.go.in",
		"client": "client_node.go.in",
		"server": "server_node.go.in",
	}
	for name, filePath := range tplMap {
		content, err := ioutil.ReadFile(path.Join(pathSuffix, filePath))
		if err != nil {
			panic(err)
		}
		template.Must(tpl.New(name).Parse(string(content)))
	}

	return tpl
}

func register(tpl *template.Template) {
	tpl.Funcs(map[string]interface{}{
		"getImportFiles": getImportFiles,
		"getGrpcPath":    getGrpcPath,
		"getGateWayInfo": getGateWayInfo,
		"getHandleType":  getHandleType,
	})
}

// Get the import files of all messages.
func getImportFiles(file pgs.File) []pgs.File {
	fileMap := map[pgs.File]bool{}
	for _, service := range file.Services() {
		for _, method := range service.Methods() {
			fileMap[method.Input().File()] = true
			fileMap[method.Output().File()] = true
		}
	}
	res := []pgs.File{}
	for f := range fileMap {
		res = append(res, f)
	}
	return res
}

func getGrpcPath(method pgs.Entity, name pgs.Name) string {
	res := name.String() + "/" + method.Name().String()
	pkg := method.Package().ProtoName().String()
	if pkg != "" {
		res = pkg + "." + res
	}
	return "/" + res
}

type gateWayInfo struct {
	Url    string
	Method string
}

func getGateWayInfo(method pgs.Method) *gateWayInfo {
	var httpRule annotations.HttpRule
	method.Extension(annotations.E_Http, &httpRule)
	switch r := httpRule.GetPattern().(type) {
	case *annotations.HttpRule_Get:
		return &gateWayInfo{Method: "get", Url: r.Get}
	case *annotations.HttpRule_Post:
		return &gateWayInfo{Method: "post", Url: r.Post}
	case *annotations.HttpRule_Put:
		return &gateWayInfo{Method: "put", Url: r.Put}
	case *annotations.HttpRule_Patch:
		return &gateWayInfo{Method: "patch", Url: r.Patch}
	case *annotations.HttpRule_Delete:
		return &gateWayInfo{Method: "delete", Url: r.Delete}
	}
	return nil
}

func getHandleType(method pgs.Method) string {
	if !method.ClientStreaming() && !method.ServerStreaming() {
		return "grpc.UnaryCall"
	}
	if !method.ClientStreaming() && method.ServerStreaming() {
		return "grpc.ServerStreamingCall"
	}
	if method.ServerStreaming() && !method.ClientStreaming() {
		return "grpc.ClientStreamingCall"
	}
	return "grpc.BidiStreamingCall"
}
