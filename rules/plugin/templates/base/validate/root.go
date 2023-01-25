package validate

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/url"
	"path"
	"strings"
	"text/template"

	"github.com/golang/protobuf/proto"
	pgs "github.com/lyft/protoc-gen-star"

	utils "logi/base/go/bazel"
	pb "logi/rules/plugin/templates/base/validate/validate"
)

// Register validate template.
func Register(tpl *template.Template) {
	validateTpl := template.New("validate")
	workspace, _ := utils.GetRunfilesDir()
	pathSuffix := path.Join(
		workspace,
		"logi/rules/plugin/templates/base/validate/",
	)
	tplMap := map[string]string{
		"number":     "number.go.in",
		"long":       "long.go.in",
		"boolean":    "boolean.go.in",
		"enum":       "enum.go.in",
		"string":     "string.go.in",
		"uint8array": "uint8array.go.in",
		"repeated":   "repeated.go.in",
		"map":        "map.go.in",
		"message":    "message.go.in",
		"any":        "any.go.in",
		"timestamp":  "timestamp.go.in",
	}
	validateTpl.Funcs(map[string]interface{}{
		"formatPattern":      formatPattern,
		"getItemsDecorators": getItemsDecorators(validateTpl),
	})
	for name, filePath := range tplMap {
		content, err := ioutil.ReadFile(path.Join(pathSuffix, filePath))
		if err != nil {
			panic(err)
		}
		template.Must(validateTpl.New(name).Parse(string(content)))
	}
	tpl.Funcs(map[string]interface{}{
		"getDecorators":     getDecorators(validateTpl),
		"isRequiredOneOf":   isRequiredOneOf,
		"isRequiredField":   isRequiredField,
		"isValidateDisable": isValidateDisable,
	})
	url.Parse("rawurl")
}

// Convert special chars to \0x## format.
func formatPattern(x string) string {
	format := fmt.Sprintf("%q", x)
	return format[1 : len(format)-1]
}

// Get validate decorators for each field.
func getDecorators(tpl *template.Template) func(pgs.Field) string {
	return func(field pgs.Field) string {
		if disable := isValidateDisable(field.Message()); disable {
			return ""
		}
		var validateRule pb.FieldRules
		if _, e := field.Extension(pb.E_Rules, &validateRule); e != nil {
			panic(e)
		}
		if &validateRule == nil {
			return ""
		}
		ctx := &ruleContext{}
		ctx.Field = field
		ruleType, rules := resolveRules(&validateRule)
		ctx.Rules = rules
		var b bytes.Buffer
		if field.Type().ProtoType().Proto().String() == "TYPE_MESSAGE" &&
			ruleType == "" {
			tpl.ExecuteTemplate(&b, "message", validateRule)
			return b.String()
		}
		if ruleType == "" {
			return ""
		}
		tpl.ExecuteTemplate(&b, ruleType, ctx)
		return b.String()
	}
}

// Get decorators for array items and map values.
func getItemsDecorators(
	tpl *template.Template,
) func(pb.FieldRules, pgs.Field) string {
	return func(validateRule pb.FieldRules, field pgs.Field) string {
		ctx := &ruleContext{}
		ctx.Field = field
		ruleType, rules := resolveRules(&validateRule)
		ctx.Rules = rules
		var b bytes.Buffer
		if field.Type().ProtoType().Proto().String() == "TYPE_MESSAGE" &&
			ruleType == "" {
			tpl.ExecuteTemplate(&b, "message", validateRule)
		} else if ruleType != "" {
			tpl.ExecuteTemplate(&b, ruleType, ctx)
		} else {
			return ""
		}
		decorators := b.String()
		spls := strings.Split(decorators, ")\n    @")
		res := ""
		for _, spl := range spls[:len(spls)-1] {
			res += spl
			if !strings.HasSuffix(spl, "(") {
				res += ", "
			}
			res += "{each: true})\n    @"
		}
		last := spls[len(spls)-1]
		last = last[:len(last)-len(")\n")]
		res += last
		if !strings.HasSuffix(last, "(") {
			res += ", "
		}
		res += "{each: true})"
		return res
	}
}

// Check wheter this oneof field is required.
func isRequiredOneOf(oneOf pgs.OneOf) bool {
	var required bool
	if _, e := oneOf.Extension(pb.E_Required, &required); e != nil {
		panic(e)
	}
	return required
}

// Check whether this message should use validate.
func isValidateDisable(msg pgs.Message) bool {
	var disable bool
	if _, e := msg.Extension(pb.E_Disabled, &disable); e != nil {
		panic(e)
	}
	return disable
}

// Check whether this field is required. If return false, daa will not add this
// field.
func isRequiredField(field pgs.Field) bool {
	if disable := isValidateDisable(field.Message()); disable {
		return false
	}
	var validateRule pb.FieldRules
	if _, e := field.Extension(pb.E_Rules, &validateRule); e != nil {
		panic(e)
	}
	if &validateRule == nil {
		return false
	}
	switch r := validateRule.GetType().(type) {
	case *pb.FieldRules_Any:
		return r.Any.GetRequired()
	case *pb.FieldRules_Timestamp:
		return r.Timestamp.GetRequired()
	}
	if validateRule.Message == nil || validateRule.Message.Required == nil {
		return false
	}
	return validateRule.Message.GetRequired()
}

// The validate rules context for each templates.
type ruleContext struct {
	Field pgs.Field
	Rules proto.Message
}

// Resolve validate rules to corresponding type.
func resolveRules(rule *pb.FieldRules) (string, proto.Message) {
	numberType := "number"
	longType := "long"
	switch r := rule.GetType().(type) {
	case *pb.FieldRules_Int32:
		return numberType, r.Int32
	case *pb.FieldRules_Uint32:
		return numberType, r.Uint32
	case *pb.FieldRules_Sint32:
		return numberType, r.Sint32
	case *pb.FieldRules_Fixed32:
		return numberType, r.Fixed32
	case *pb.FieldRules_Sfixed32:
		return numberType, r.Sfixed32
	case *pb.FieldRules_Double:
		return numberType, r.Double
	case *pb.FieldRules_Float:
		return numberType, r.Float
	case *pb.FieldRules_Int64:
		return longType, r.Int64
	case *pb.FieldRules_Uint64:
		return longType, r.Uint64
	case *pb.FieldRules_Sint64:
		return longType, r.Sint64
	case *pb.FieldRules_Fixed64:
		return longType, r.Fixed64
	case *pb.FieldRules_Sfixed64:
		return longType, r.Sfixed64
	case *pb.FieldRules_Bool:
		return "boolean", r.Bool
	case *pb.FieldRules_Enum:
		return "enum", r.Enum
	case *pb.FieldRules_String_:
		return "string", r.String_
	case *pb.FieldRules_Bytes:
		return "uint8array", r.Bytes
	case *pb.FieldRules_Repeated:
		return "repeated", r.Repeated
	case *pb.FieldRules_Map:
		return "map", r.Map
	case *pb.FieldRules_Any:
		return "any", r.Any
	case *pb.FieldRules_Timestamp:
		return "timestamp", r.Timestamp
	}
	return "", nil
}
