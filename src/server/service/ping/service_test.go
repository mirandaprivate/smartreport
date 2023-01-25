package ping

import (
	"context"
	ping_pb "logi/src/proto/ping"
	"testing"
)

func TestPing(t *testing.T) {
	s := &Service{}
	resp, err := s.Check(context.Background(), &ping_pb.Ping{
		Req: "",
	})
	if err != nil {
		t.Errorf("Ping error %s", err.Error())
	}
	respMsg := "pong"
	if resp.Res != respMsg {
		t.Errorf("Response error, expect %s, got %s", respMsg, resp.Res)
	}
}
