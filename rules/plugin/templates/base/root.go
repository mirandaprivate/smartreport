package base

import (
	"bytes"
	"io/ioutil"
	"path"
	"reflect"
	"strconv"
	"strings"
	"text/template"

	utils "logi/base/go/bazel"
	"logi/rules/plugin/templates/base/validate"
	"logi/rules/plugin/templates/common"

	"github.com/golang/protobuf/proto"
	pgs "github.com/lyft/protoc-gen-star"
	"google.golang.org/genproto/googleapis/api/annotations"
)

var workspace, _ = utils.GetRunfilesDir()
var pathSuffix = path.Join(
	workspace,
	"logi/rules/plugin/templates/base",
)

// Template gets the base ts file template.
func Template(params pgs.Parameters) *template.Template {
	tpl := template.New("root")
	common.Register(tpl, params)
	validate.Register(tpl)
	register(tpl)
	content, err := ioutil.ReadFile(path.Join(pathSuffix, "root.go.in"))
	if err != nil {
		panic(err)
	}
	template.Must(tpl.Parse(string(content)))
	return tpl
}

// Register function used in templates and sub templates.
func register(tpl *template.Template) {
	tpl.Funcs(map[string]interface{}{
		// Used for naming.
		"getTsName": getTsName,
		"toUpper":   toUpper,
		// Used in file template.
		"getImportFiles": getImportFiles,
		// Used in msg template and its sub template.
		"getTsType":      getTsType,
		"isMessage":      isMessage,
		"isLong":         isLong,
		"isLongMapValue": isLongMapValue,
		"isLongMapKey":   isLongMapKey,
		"isUnsigned":     isUnsigned,
		"render":         render(tpl),
		"isAnyTypeField": isAnyTypeField,
		"getAnyFields":   getAnyFields,
		"getAnyType":     getAnyType,
		// Used in descriptor template
		"getExtensionBytes": getExtensionBytes,
		"getLabelNum":       getLabelNum,
		"getTypeNum":        getTypeNum,
		// Used in registry template.
		"getImportMessage": getImportMessage,
		// Used in extension template.
		"getAllExtensions": getAllExtensions,
		// Used in onof template.
		"getAllOneOfs":      getAllOneOfs,
		"getOneOfUnionType": getOneOfUnionType,
		// Used in gateway template.
		"getGrpcGateWayUrl": getGrpcGateWayUrl,
	})

	tplMap := map[string]string{
		// Sub template in file template.
		"oneof":     "oneof.go.in",
		"enum":      "enum.go.in",
		"message":   "message.go.in",
		"desc":      "descriptor.go.in",
		"registry":  "registry.go.in",
		"extension": "extension.go.in",
		// TODO(zecheng): This template is only get the url from gateway option.
		// Implement the whole grpc gateway to support send and recieve http
		// request oneday.
		"gateway": "gateway.go.in",
		// Sub template in msg template.
		"interface":     "message/interface.go.in",
		"impl":          "message/impl.go.in",
		"builder":       "message/builder.go.in",
		"typeGuide":     "message/type_guide.go.in",
		"typeAssertion": "message/type_assertion.go.in",
		// Sub template in impl tempalte
		"number":      "message/impl/number.go.in",
		"Long":        "message/impl/long.go.in",
		"string":      "message/impl/string.go.in",
		"Uint8Array":  "message/impl/uint8array.go.in",
		"boolean":     "message/impl/boolean.go.in",
		"enumType":    "message/impl/enum_type.go.in",
		"messageType": "message/impl/message_type.go.in",
		"repeated":    "message/impl/repeated.go.in",
		"map":         "message/impl/map.go.in",
		"any":         "message/impl/any.go.in",
		// Sub template in desc tempalte
		"fileDesc":    "descriptor/file.go.in",
		"fieldDesc":   "descriptor/field.go.in",
		"enumDesc":    "descriptor/enum.go.in",
		"serviceDesc": "descriptor/service.go.in",
		"fileOpt":     "descriptor/file_opt.go.in",
	}
	for name, filePath := range tplMap {
		content, err := ioutil.ReadFile(path.Join(
			pathSuffix,
			filePath,
		))
		if err != nil {
			panic(err)
		}
		template.Must(tpl.New(name).Parse(string(content)))
	}
}

// Convert proto type to ts base type.
func getTsBaseType(field pgs.Field) string {
	switch field.Type().ProtoType().Proto().String() {
	case "TYPE_DOUBLE", "TYPE_FLOAT", "TYPE_INT32", "TYPE_UINT32",
		"TYPE_SINT32", "TYPE_FIXED32", "TYPE_SFIXED32":
		return "number"
	case "TYPE_INT64", "TYPE_UINT64", "TYPE_SINT64", "TYPE_FIXED64",
		"TYPE_SFIXED64":
		return "Long"
	case "TYPE_ENUM":
		return "enumType"
	case "TYPE_STRING":
		return "string"
	case "TYPE_BYTES":
		return "Uint8Array"
	case "TYPE_BOOL":
		return "boolean"
	case "TYPE_MESSAGE":
		return "messageType"
	default:
		return ""
	}
}

// Convert message or enum name to class name or enum name in ts.
func getTsName(entity pgs.Entity) string {
	return common.GetName(entity.Package(), entity.FullyQualifiedName())
}

func toUpper(str string) string {
	return strings.ToUpper(str)
}

func getImportFiles(curr pgs.File) []pgs.File {
	fileMap := map[pgs.File]bool{}
	for _, msg := range curr.AllMessages() {
		for _, f := range msg.Imports() {
			fileMap[f] = true
		}
	}
	res := []pgs.File{}
	for f := range fileMap {
		res = append(res, f)
	}
	return res
}

// Get full name of message or enum type field, include import path.
func getFullName(field pgs.Field) string {
	if len(field.Imports()) != 1 {
		return common.GetName(field.Package(), field.Descriptor().GetTypeName())
	}
	fullName := common.GetName(
		field.Imports()[0].Package(),
		field.Descriptor().GetTypeName(),
	)
	return common.Mangle(field.Imports()[0].Name().String()) + "." + fullName
}

// Get key and value elements type of map.
func getMapElemType(field pgs.Field) string {
	typeName := field.Descriptor().GetTypeName()
	mapEntries := field.Message().MapEntries()
	var targetEntry pgs.Message
	for _, entry := range mapEntries {
		if entry.FullyQualifiedName() == typeName {
			targetEntry = entry
			break
		}
	}
	if targetEntry == nil || !targetEntry.IsMapEntry() {
		panic("can't find MapEntry " + typeName)
	}
	keyType := ""
	valueType := ""
	for _, field := range targetEntry.Fields() {
		if field.Name().String() == "key" {
			keyType = getTsType(field)
		}
		if field.Name().String() == "value" {
			valueType = getTsType(field)
		}
	}
	return keyType + ", " + valueType
}

// Get full ts type of field, include Map, Array and message name.
func getTsType(field pgs.Field) string {
	if field.Type().IsMap() {
		return "ReadonlyMap<" + getMapElemType(field) + ">"
	}
	tsType := getTsBaseType(field)
	if tsType == "Uint8Array" {
		tsType = "Readonly<Uint8Array>"
	}
	if tsType == "messageType" {
		tsType = getFullName(field)
	}
	if tsType == "enumType" {
		tsType = getFullName(field) + "Enum"
	}
	if field.Type().IsRepeated() {
		tsType = "readonly " + tsType + "[]"
	}
	return tsType
}

// Check if a field is single message but not map or repeated messages.
func isMessage(field pgs.Field) bool {
	typ := field.Type()
	return !typ.IsMap() &&
		!typ.IsRepeated() &&
		typ.ProtoType().Proto().String() == "TYPE_MESSAGE"
}

// Check if Long type is unsigned.
func isUnsigned(field pgs.Field) bool {
	switch field.Type().ProtoType().Proto().String() {
	case "TYPE_UINT64", "TYPE_FIXED64":
		return true
	default:
		return false
	}
}

func isLong(field pgs.Field) bool {
	return isLongProtoType(field.Type().ProtoType().Proto().String())
}

func isLongMapValue(field pgs.Field) bool {
	if !field.Type().IsMap() {
		return false
	}
	return isLongProtoType(field.Type().Element().ProtoType().Proto().String())
}

func isLongMapKey(field pgs.Field) bool {
	if !field.Type().IsMap() {
		return false
	}
	return isLongProtoType(field.Type().Key().ProtoType().Proto().String())
}

func isLongProtoType(protoType string) bool {
	switch protoType {
	case "TYPE_INT64", "TYPE_UINT64", "TYPE_SINT64", "TYPE_FIXED64",
		"TYPE_SFIXED64":
		return true
	}
	return false
}

// Render the templates in impl field.
func render(tpl *template.Template) func(field pgs.Field) (string, error) {
	return func(field pgs.Field) (string, error) {
		var b bytes.Buffer
		tplName := ""
		field.Descriptor().GetTypeName()
		if isAnyTypeField(field) {
			tplName = "any"
		} else if field.Type().IsMap() {
			tplName = "map"
		} else if field.Type().IsRepeated() {
			tplName = "repeated"
		} else {
			tplName = getTsBaseType(field)
		}
		err := tpl.ExecuteTemplate(&b, tplName, field)
		return b.String(), err
	}
}

// Get extension bytes of extensions in optional field.
func getExtensionBytes(pb proto.Message, indent int) string {
	if reflect.ValueOf(pb).IsZero() {
		return ""
	}
	var ext reflect.Value
	for i := 0; i < reflect.ValueOf(pb).Elem().NumField(); i++ {
		if reflect.ValueOf(pb).Elem().Field(i).Type().Name() ==
			"XXX_InternalExtensions" {
			ext = reflect.ValueOf(pb).Elem().Field(i)
			break
		}
	}
	if ext.String() != "<proto.XXX_InternalExtensions Value>" {
		return ""
	}
	p := ext.Field(0)
	if p.IsZero() {
		return ""
	}
	mapRange := p.Elem().Field(1).MapRange()
	res := ""
	ind := ""
	for i := 0; i < indent; i++ {
		ind += "    "
	}
	for mapRange.Next() {
		item := "\n" + ind + "["
		item += strconv.Itoa(int(mapRange.Key().Int())) + ","
		item += " new Uint8Array(["
		byteStr := []string{}
		for _, b := range mapRange.Value().Field(2).Bytes() {
			byteStr = append(byteStr, strconv.Itoa(int(b)))
		}
		item += strings.Join(byteStr, ", ") + "])],"
		res += item
	}
	return res
}

// Convert label enum to int.
func getLabelNum(field pgs.Field) int {
	return int(field.Descriptor().GetLabel())
}

// Convert type enum to int.
func getTypeNum(field pgs.Field) int {
	return int(field.Descriptor().GetType())
}

// Get import messages to set registry.
func getImportMessage(file pgs.File) []pgs.Field {
	importMap := map[pgs.Field]bool{}
	for _, msg := range file.AllMessages() {
		for _, f := range msg.Fields() {
			if len(f.Imports()) == 1 {
				importMap[f] = true
			}
		}
	}
	importMsg := []pgs.Field{}
	for f := range importMap {
		importMsg = append(importMsg, f)
	}
	return importMsg
}

// Get all extensions to generate extension descriptor.
func getAllExtensions(file pgs.File) []pgs.Extension {
	all := []pgs.Extension{}
	all = append(all, file.DefinedExtensions()...)
	for _, msg := range file.AllMessages() {
		all = append(all, msg.DefinedExtensions()...)
	}
	return all
}

// Get all OneOfs to generate one of enum message.
func getAllOneOfs(file pgs.File) []pgs.OneOf {
	all := []pgs.OneOf{}
	for _, msg := range file.AllMessages() {
		all = append(all, msg.OneOfs()...)
	}
	return all
}

func getOneOfUnionType(fields []pgs.Field) string {
	types := []string{}
	for _, field := range fields {
		if isAnyTypeField(field) {
			types = append(types, getAnyType(field))
			continue
		}
		types = append(types, getTsType(field))
	}
	return strings.Join(types, " | ")
}

// Check if this field contains any message.
func isAnyTypeField(field pgs.Field) bool {
	if field.Descriptor().GetTypeName() == ".google.protobuf.Any" {
		return true
	}
	// Check value field type in map.
	if !field.Type().IsMap() {
		return false
	}
	typeName := field.Descriptor().GetTypeName()
	mapEntries := field.Message().MapEntries()
	var targetEntry pgs.Message
	for _, entry := range mapEntries {
		if entry.FullyQualifiedName() == typeName {
			targetEntry = entry
			break
		}
	}
	if targetEntry == nil || !targetEntry.IsMapEntry() {
		return false
	}
	for _, field := range targetEntry.Fields() {
		if field.Name().String() != "value" {
			continue
		}
		return field.Descriptor().GetTypeName() == ".google.protobuf.Any"
	}
	return false
}

// Filter the any type field in fields.
func getAnyFields(fields []pgs.Field) []pgs.Field {
	anyFields := []pgs.Field{}
	for _, field := range fields {
		if isAnyTypeField(field) {
			anyFields = append(anyFields, field)
		}
	}
	return anyFields
}

// Get the any type in ts.
func getAnyType(field pgs.Field) string {
	anyType := "Readonly<proto.Message>"
	if field.Type().IsRepeated() {
		return "readonly " + anyType + "[]"
	}
	if field.Type().IsMap() {
		mapKey := strings.Split(getMapElemType(field), ",")[0]
		return "ReadonlyMap<" + mapKey + ", " + anyType + ">"
	}
	return anyType
}

func getGrpcGateWayUrl(service pgs.Service) map[string]string {
	res := map[string]string{}
	for _, method := range service.Methods() {
		var httpRule annotations.HttpRule
		method.Extension(annotations.E_Http, &httpRule)
		url := ""
		switch r := httpRule.GetPattern().(type) {
		case *annotations.HttpRule_Get:
			url = r.Get
		case *annotations.HttpRule_Post:
			url = r.Post
		case *annotations.HttpRule_Put:
			url = r.Put
		case *annotations.HttpRule_Patch:
			url = r.Patch
		case *annotations.HttpRule_Delete:
			url = r.Delete
		}
		if url != "" {
			res[method.Name().UpperSnakeCase().String()] = url
		}
	}
	return res
}
