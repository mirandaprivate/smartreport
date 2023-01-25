package encode

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"path"
	"reflect"
	"strings"
	"testing"

	pb "logi_base/src/ts/proto/test_data/person"
	pet "logi_base/src/ts/proto/test_data/pet"

	bazelutils "logi_base/src/go/bazel"

	"github.com/golang/protobuf/proto"
)

const (
	tsBinFile   = "logi_base/src/ts/proto/encode/ts.bin"
	contentFile = "logi_base/src/ts/proto/test_data/content.json"
)

func readTsBin(t *testing.T) *pb.Person {
	runfilesDir, err := bazelutils.GetRunfilesDir()
	if err != nil {
		t.Error(err.Error())
	}
	tsbin, err := ioutil.ReadFile(path.Join(runfilesDir, tsBinFile))
	if err != nil {
		t.Errorf("Failed to read the bin file: %v.", err)
	}
	person := &pb.Person{}
	err = proto.Unmarshal(tsbin, person)
	if err != nil {
		t.Errorf("Failed to unmarshal: %v.", err)
	}
	return person
}

/**
 * The way to test `encode` is decoding the binary stream in Go which generated
 * by `encode`. The `encode` function generated the stream in
 * `../test_data/person_bin.ts`. Later we get it through `genrule` in`BUILD`.
 * Then compare the decoded result `person` with `expect` built with
 * the data in `content.json`.
 */
func TestTsEncode(t *testing.T) {
	runfilesDir, err := bazelutils.GetRunfilesDir()
	content, err := ioutil.ReadFile(path.Join(runfilesDir, contentFile))

	if err != nil {
		t.Errorf("Failed to read the content file.")
	}
	person := readTsBin(t)
	var expect = &pb.Person{}
	err = json.Unmarshal(content, expect)
	if err != nil {
		t.Errorf("Failed to unmarshal the content.json.")
	}
	expect.Address = &pb.Person_Home{Home: "Shenzhen"}
	expect.Empty = &pb.Person_Text{Text: ""}
	proto.GetExtension(person.Pet, pet.E_Age)
	proto.GetExtension(person.Pet, pet.E_Number)
	proto.GetExtension(person.Pet, pet.E_Type)
	proto.SetExtension(expect.Pet, pet.E_Age, proto.Int(2))
	proto.SetExtension(
		expect.Pet,
		pet.E_Number,
		[]int32{*proto.Int(1), *proto.Int(2), *proto.Int(3)},
	)
	proto.SetExtension(
		expect.Pet,
		pet.E_Type,
		&pet.Type{Name: proto.String("dog")},
	)
	personRef := reflect.ValueOf(person).Elem()
	expectRef := reflect.ValueOf(expect).Elem()
	for i := 0; i < expectRef.NumField(); i++ {
		fieldName := expectRef.Type().Field(i).Name
		firstChar := string([]rune(fieldName)[0])
		if strings.ToUpper(firstChar) != firstChar {
			continue
		}
		personString := fmt.Sprint(
			personRef.FieldByName(fieldName).Interface(),
		)
		expectString := fmt.Sprint(
			expectRef.FieldByName(fieldName).Interface(),
		)
		if personString != expectString {
			t.Errorf(fieldName + " is not true.")
		}
	}
}
