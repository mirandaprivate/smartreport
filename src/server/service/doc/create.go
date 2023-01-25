package doc

import (
	"context"
	"encoding/base64"

	doc_pb "logi/src/proto/doc"
	inner_pb "logi/src/proto/inner"
	logi_data_pb "logi/src/proto/jianda/data"
	logi_file_pb "logi/src/proto/jianda/file"
	"logi/src/server/lib/errors"
	"logi/src/server/lib/grpc_client"
	jianda_lib "logi/src/server/lib/jianda"

	"github.com/golang/protobuf/proto"
)

func createDoc(
	ctx context.Context,
	req *doc_pb.CreateDocRequest,
) (*doc_pb.CreateDocResponse, error) {
	templateBytes, err := getTemplate(ctx, req.TemplateId)
	if err != nil {
		return nil, err
	}
	ids, err := getPlaceHolderIDs(ctx, templateBytes)
	if err != nil {
		return nil, err
	}
	placeHolderDescs, err := getPlaceHolderDescs(ctx, ids)
	if err != nil {
		return nil, err
	}
	descs, err := toDataValueDescs(ctx, req.ResearchId, placeHolderDescs)
	if err != nil {
		return nil, err
	}
	dataVaues, err := getDataValues(ctx, descs, req.ResearchId)
	if err != nil {
		return nil, err
	}
	newDoc, err := renderTemplate(templateBytes, dataVaues)
	if err != nil {
		return nil, err
	}
	return &doc_pb.CreateDocResponse{
		Base64Content: base64.StdEncoding.EncodeToString(newDoc),
	}, nil
}

func getTemplate(ctx context.Context, templateID string) ([]byte, error) {
	respPB, err := jianda_lib.GetFileInfo(
		ctx,
		&logi_file_pb.FileInfoRequest{
			Id:   templateID,
			Type: logi_file_pb.FileType_FILE_TYPE_TEMPLATE,
		})
	if err != nil {
		return nil, err
	}

	docURL := respPB.Data.DownloadUrl
	docBytes, err := jianda_lib.DownloadFile(ctx, docURL)
	if err != nil {
		return nil, err
	}

	return docBytes, nil
}

func getPlaceHolderIDs(ctx context.Context, template []byte) ([]string, error) {
	req := &inner_pb.PlaceholderIDsRequest{
		Binary: template,
	}
	resp, err := grpc_client.InnerGrpcClient.GetPlaceholderIDs(ctx, req)
	if err != nil {
		return nil, errors.ErrInvalidRaw("模板占位符格式错误")
	}
	return resp.Ids, nil
}

func getPlaceHolderDescs(
	ctx context.Context,
	ids []string,
) ([]*logi_data_pb.PlaceHolderDesc, error) {
	reqPB := &logi_data_pb.GetPlaceholderRequest{Ids: ids}
	respPB, err := jianda_lib.GetPlaceHolders(ctx, reqPB)
	if err != nil {
		return nil, err
	}
	descs := []*logi_data_pb.PlaceHolderDesc{}
	for _, placeholder := range respPB.Data {
		b, err := base64.StdEncoding.DecodeString(placeholder.Text)
		if err != nil {
			return nil, errors.ErrInternal(err)
		}
		desc := logi_data_pb.PlaceHolderDesc{}
		if err := proto.Unmarshal(b, &desc); err != nil {
			return nil, errors.ErrInternal(err)
		}
		desc.PlaceholderId = placeholder.Id
		descs = append(descs, &desc)
	}
	return descs, nil
}

func contains(ids []string, id string) bool {
	for _, i := range ids {
		if i == id {
			return true
		}
	}
	return false
}

func dynamicToStaticDesc(
	ctx context.Context,
	researchID string,
	placeholderDescs []*logi_data_pb.PlaceHolderDesc,
) ([]*logi_data_pb.PlaceHolderDesc, error) {
	ids := []string{}
	for _, desc := range placeholderDescs {
		if !contains(ids, desc.Id) {
			ids = append(ids, desc.Id)
		}
	}
	reqPB := &logi_data_pb.DataLastDateRequest{
		ResearchId: researchID,
		Ids:        ids,
	}
	resp, err := jianda_lib.GetLastDate(ctx, reqPB)
	if err != nil {
		return nil, err
	}
	calDateDescs := []*inner_pb.CalculateDateDesc{}

	for _, id := range ids {
		var date *logi_data_pb.DataLastDate
		for _, d := range resp.Dates {
			if d.Id == id {
				date = d
			}
		}
		if date == nil {
			return nil, errors.ErrInitRaw("logi server返回的id不正确")
		}
		for _, desc := range placeholderDescs {
			if desc.Id == id {
				r := &inner_pb.CalculateDateDesc{
					Id:       desc.PlaceholderId,
					Freq:     desc.Freq,
					Distance: desc.Distance,
					Date:     date.Date,
				}
				calDateDescs = append(calDateDescs, r)
			}
		}
	}
	innerResp, err := grpc_client.InnerGrpcClient.CalculateDate(
		context.Background(), &inner_pb.CalculateDateRequest{
			Descs: calDateDescs,
		})
	if err != nil {
		return nil, errors.ErrInternal(err)
	}

	descs := []*logi_data_pb.PlaceHolderDesc{}
	for _, date := range innerResp.Dates {
		var placeholderDesc *logi_data_pb.PlaceHolderDesc
		for _, desc := range placeholderDescs {
			if desc.PlaceholderId == date.Id {
				placeholderDesc = desc
			}
		}
		if placeholderDesc == nil {
			return nil, errors.ErrInternalRaw("node server返回的id不正确")
		}
		descs = append(descs, &logi_data_pb.PlaceHolderDesc{
			Id:            placeholderDesc.Id,
			Name:          placeholderDesc.Name,
			Format:        placeholderDesc.Format,
			IsTimeseries:  placeholderDesc.IsTimeseries,
			DataType:      placeholderDesc.DataType,
			Freq:          placeholderDesc.Freq,
			IsDynamic:     false,
			Magnitude:     placeholderDesc.Magnitude,
			PlaceholderId: placeholderDesc.PlaceholderId,
			Date:          date.Date,
		})
	}

	return descs, nil
}

func toDataValueDescs(
	ctx context.Context,
	researchID string,
	placeholderDescs []*logi_data_pb.PlaceHolderDesc,
) ([]*logi_data_pb.DataValueDesc, error) {
	dynamicDescs := []*logi_data_pb.PlaceHolderDesc{}
	staticDescs := []*logi_data_pb.PlaceHolderDesc{}
	for _, pd := range placeholderDescs {
		if pd.IsDynamic {
			dynamicDescs = append(dynamicDescs, pd)
		} else {
			staticDescs = append(staticDescs, pd)
		}
	}
	newstaticDesc, err := dynamicToStaticDesc(ctx, researchID, dynamicDescs)
	if err != nil {
		return nil, err
	}
	staticDescs = append(staticDescs, newstaticDesc...)

	dataValueDescs := []*logi_data_pb.DataValueDesc{}
	for _, pd := range staticDescs {
		dataValueDesc := &logi_data_pb.DataValueDesc{
			Id:            pd.Id,
			Name:          pd.Name,
			Format:        pd.Format,
			IsTimeseries:  pd.IsTimeseries,
			DataType:      pd.DataType,
			Date:          pd.Date,
			Freq:          pd.Freq,
			PlaceholderId: pd.PlaceholderId,
		}
		dataValueDescs = append(dataValueDescs, dataValueDesc)
	}
	return dataValueDescs, nil
}

func getDataValues(
	ctx context.Context,
	descs []*logi_data_pb.DataValueDesc,
	researchID string,
) ([]*logi_data_pb.DataValue, error) {
	reqPB := &logi_data_pb.DataValueRequest{
		ResearchId: researchID,
		ValuesDesc: descs,
	}
	respPB, err := jianda_lib.GetDataValues(ctx, reqPB)
	if err != nil {
		return nil, err
	}
	return respPB.Data.Data, nil
}

func renderTemplate(
	template []byte, dataValues []*logi_data_pb.DataValue) ([]byte, error) {
	doc, err := grpc_client.InnerGrpcClient.RenderTemplate(
		context.Background(), &inner_pb.RenderTemplateRequest{
			Template: template,
			Data:     dataValues,
		})
	if err != nil {
		return nil, errors.ErrInternal(err)
	}
	return doc.Doc, nil
}
