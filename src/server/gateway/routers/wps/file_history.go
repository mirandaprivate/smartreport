package wps

import (
	"context"
	"fmt"
	"net/http"

	file_pb "logi/src/proto/jianda/file"
	perm_pb "logi/src/proto/jianda/perm"
	user_pb "logi/src/proto/jianda/user"
	wps_pb "logi/src/proto/wps"
	"logi/src/server/lib/errors"
	jianda_lib "logi/src/server/lib/jianda"

	"github.com/gin-gonic/gin"
)

func getFileHistory(c *gin.Context) {
	fileType, err := getParamFileType(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	fileID, err := getParamFileID(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	hisReq := &wps_pb.FileHistoryRequest{}
	c.BindJSON(hisReq)
	jwt, err := getParamJwt(c)
	if err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		return
	}
	ctx := createJwtCtx(jwt)

	var resp *wps_pb.FileHistoryResponse
	switch fileType {
	case wps_pb.FileType_FILE_TYPE_REPORT:
		resp, err = getReportHistoryInfo(
			ctx, fileID, int32(hisReq.Offset), int32(hisReq.Count))
	case wps_pb.FileType_FILE_TYPE_REPORT_TEMPLATE:
		resp, err = getTemplateHistoryInfo(
			ctx, fileID, int32(hisReq.Offset), int32(hisReq.Count))
	default:
		c.String(http.StatusBadRequest, fmt.Sprintf("暂不支持类型, %s", fileType))
		return
	}
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
		return
	}
	c.JSON(http.StatusOK, resp)
}

func getReportHistoryInfo(
	ctx context.Context,
	id string,
	offset, count int32,
) (*wps_pb.FileHistoryResponse, error) {
	respPB, err := jianda_lib.GetFileHistory(ctx, &file_pb.GetFileVersionHistoryRequest{
		Id:     id,
		Type:   file_pb.FileType_FILE_TYPE_REPORT,
		Offset: offset,
		Count:  count,
	})
	if err != nil {
		return nil, err
	}
	files := []*wps_pb.FileHistoryResponse_File{}
	for _, info := range respPB.Data {
		f, err := toWpsFileHistoryInfo(ctx, info)
		if err != nil {
			return nil, err
		}
		files = append(files, f)
	}

	return &wps_pb.FileHistoryResponse{
		Histories: files,
	}, nil
}

func getTemplateHistoryInfo(
	ctx context.Context,
	id string,
	offset, count int32,
) (*wps_pb.FileHistoryResponse, error) {
	respPB, err := jianda_lib.GetFileHistory(ctx, &file_pb.GetFileVersionHistoryRequest{
		Id:     id,
		Type:   file_pb.FileType_FILE_TYPE_TEMPLATE,
		Offset: offset,
		Count:  count,
	})
	if err != nil {
		return nil, err
	}
	files := []*wps_pb.FileHistoryResponse_File{}
	for _, info := range respPB.Data {
		f, err := toWpsFileHistoryInfo(ctx, info)
		if err != nil {
			return nil, err
		}
		files = append(files, f)
	}

	return &wps_pb.FileHistoryResponse{
		Histories: files,
	}, nil
}

func toWpsFileHistoryInfo(
	ctx context.Context,
	info *file_pb.FileInfo,
) (*wps_pb.FileHistoryResponse_File, error) {
	resp, err := jianda_lib.GetUsersInfo(ctx, &user_pb.UserInfoRequest{
		Ids: []string{info.OwnerId, info.LastModifyUser},
	})
	if err != nil {
		return nil, err
	}
	users := []*wps_pb.WpsUser{}
	for _, userInfo := range resp.Data {
		perm, err := checkPerm(ctx, &perm_pb.GetPermRequest{
			FileId: info.Id,
			UserId: userInfo.Id,
			Type:   info.Type,
		})
		if err != nil {
			return nil, err
		}
		user := &wps_pb.WpsUser{
			Id:         userInfo.Id,
			Name:       userInfo.FullName,
			AvatarUrl:  userInfo.AvatarUrl,
			Permission: string(perm),
		}
		users = append(users, user)
	}
	creator, err := findWpsUser(info.OwnerId, users)
	if err != nil {
		return nil, err
	}
	modifier, err := findWpsUser(info.LastModifyUser, users)
	if err != nil {
		return nil, err
	}
	return &wps_pb.FileHistoryResponse_File{
		Id:          info.Id,
		Name:        info.Name,
		Version:     uint32(info.Version),
		Size:        uint32(info.Size),
		DownloadUrl: info.DownloadUrl,
		CreateTime:  uint32(info.CreateTime),
		ModifyTime:  uint32(info.LastModifyTime),
		Creator:     creator,
		Modifier:    modifier,
	}, nil
}

func findWpsUser(id string, users []*wps_pb.WpsUser) (*wps_pb.WpsUser, error) {
	for _, user := range users {
		if user.Id == id {
			return user, nil
		}
	}
	return nil, errors.ErrInternalRaw(fmt.Sprintf("找不到user_id: %v", id))
}
