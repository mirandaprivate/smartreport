package common

import (
	"path"
	"strings"
	"text/template"

	pgs "github.com/lyft/protoc-gen-star"
)

// Register common functions for templates.
func Register(tpl *template.Template, params pgs.Parameters) {
	tpl.Funcs(map[string]interface{}{
		// Used for naming.
		"getFullTsName": getFullTsName,
		"mangle":        Mangle,
		"getImportPath": getImportPath(params),
		// Used for generating comment
		"getAllLeadingComments": getAllLeadingComments,
	})
}

// GetName gets class or enum name of a field or message node.
func GetName(pkg pgs.Package, fullyQualifiedName string) string {
	prefix := "." + pkg.ProtoName().String()
	name := fullyQualifiedName
	if strings.HasPrefix(name, prefix) {
		name = name[len(prefix):]
	}
	name = strings.Trim(name, ".")
	spls := strings.Split(name, ".")
	for i, spl := range spls {
		spls[i] = strings.Title(spl)
	}
	return strings.Join(spls, "_")
}

// Mangle imported proto name to a unique name.
// TODO(zecheng): Find a better way to mangle.
func Mangle(raw string) string {
	spl := strings.Split(strings.TrimSuffix(raw, ".proto"), "/")
	return strings.Join(spl, "__")
}

// Get full name of Message or Enum node, including import path.
func getFullTsName(entity pgs.Entity) string {
	currPkg := entity.Package()
	importPath := ""
	importPath = Mangle(entity.File().Name().String()) + "."
	tsName := GetName(currPkg, entity.FullyQualifiedName())
	return importPath + tsName
}

// Get import path of imported proto.
func getImportPath(params pgs.Parameters) func(protoPath string) string {
	return func(protoPath string) string {
		importPath := params.Str(protoPath)
		suffix := params.StrDefault("-suffix", "_pb")
		if importPath != "" {
			return importPath + "/" +
				strings.TrimSuffix(path.Base(protoPath), ".proto") + suffix
		}
		return "@logi-pb" + "/" +
			strings.TrimSuffix(protoPath, ".proto") + suffix
	}
}

func getAllLeadingComments(entity pgs.Entity, indent int) string {
	if entity.SourceCodeInfo() == nil {
		return ""
	}
	comment := entity.SourceCodeInfo().LeadingComments()
	detacheds := entity.SourceCodeInfo().LeadingDetachedComments()
	res := ""
	for _, detached := range detacheds {
		res += getMultiTypeComment(detached, indent) + "\n"
	}
	res += getMultiTypeComment(comment, indent)
	return res
}

func getMultiTypeComment(comment string, indent int) string {
	if comment == "" {
		return ""
	}
	indentStr := strings.Repeat(" ", indent*4)
	res := indentStr + "/**\n" + indentStr + " *"
	spls := strings.Split(strings.TrimLeft(comment, "*\n"), "\n")
	filtered := []string{}
	for _, spl := range spls {
		if strings.HasPrefix(spl, " api-linter: core::") {
			continue
		}
		filtered = append(filtered, strings.ReplaceAll(spl, "*/", "*\\/"))
	}
	if len(filtered) == 1 {
		return ""
	}
	res += strings.Join(filtered, "\n"+indentStr+" *")
	res += "/\n"
	return res
}
