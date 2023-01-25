package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"path/filepath"

	pb "logi_base/src/ts/proto/test_data/person"
	pet "logi_base/src/ts/proto/test_data/pet"

	"github.com/golang/protobuf/proto"
)

func main() {
	genBin()
}

func genBin() {
	person := buildPerson()
	bin, err := proto.Marshal(person)
	if err != nil {
		panic(err)
	}
	ioutil.WriteFile("person_go.bin", bin, 0644)
}

func buildPerson() *pb.Person {
	wordPtr := flag.String(
		"json",
		"tools/build_rules/proto/ts_proto_library/runtime/test_data/content.json",
		"filepath of the json which contains the content of a proto message.",
	)
	flag.Parse()
	var contentFile, _ = filepath.Abs(*wordPtr)
	content, err := ioutil.ReadFile(contentFile)
	if err != nil {
		panic(err)
	}
	var person = &pb.Person{}
	err = json.Unmarshal(content, person)
	if err != nil {
		panic(err)
	}
	person.Address = &pb.Person_Home{Home: "Shenzhen"}
	person.Empty = &pb.Person_Text{Text: ""}
	proto.SetExtension(person.Pet, pet.E_Age, proto.Int(2))
	proto.SetExtension(
		person.Pet,
		pet.E_Number,
		[]int32{*proto.Int(1), *proto.Int(2), *proto.Int(3)},
	)
	proto.SetExtension(
		person.Pet,
		pet.E_Type,
		&pet.Type{Name: proto.String("dog")},
	)
	return person
}
