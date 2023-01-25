package doc

import (
	"context"
	"encoding/base64"
	doc_pb "logi/src/proto/doc"
)

type Service struct{}

func (*Service) DocToHtml(
	ctx context.Context,
	req *doc_pb.DocToHtmlRequest,
) (*doc_pb.DocToHtmlResponse, error) {
	b, err := convert(ctx, req.FileId, req.FileType, "HTML")
	if err != nil {
		return nil, err
	}
	return &doc_pb.DocToHtmlResponse{
		Base64Content: base64.RawStdEncoding.EncodeToString(b),
	}, nil
}

func (*Service) DocToPDF(
	ctx context.Context,
	req *doc_pb.DocToPDFRequest,
) (*doc_pb.DocToPDFResponse, error) {
	b, err := convert(ctx, req.FileId, req.FileType, "PDF")
	if err != nil {
		return nil, err
	}
	return &doc_pb.DocToPDFResponse{
		Base64Content: base64.RawStdEncoding.EncodeToString(b),
	}, nil
}

func (*Service) CreateDoc(
	ctx context.Context,
	req *doc_pb.CreateDocRequest,
) (*doc_pb.CreateDocResponse, error) {
	return createDoc(ctx, req)
}
