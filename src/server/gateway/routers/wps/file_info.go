package wps

import (
	"context"
	"fmt"
	file_pb "logi/src/proto/jianda/file"
	perm_pb "logi/src/proto/jianda/perm"
	user_pb "logi/src/proto/jianda/user"
	wps_pb "logi/src/proto/wps"
	"logi/src/server/lib/errors"
	jianda_lib "logi/src/server/lib/jianda"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	excelSuffix = ".xlsx"
)

func getFileInfo(c *gin.Context) {
	var err error
	fileType, err := getParamFileType(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	var resp *wps_pb.FileInfoResponse
	fileID, err := getParamFileID(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	uid, err := getParamUserID(c)
	if err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		return
	}
	jwt, err := getParamJwt(c)
	if err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		return
	}
	ctx := createJwtCtx(jwt)
	switch fileType {
	case wps_pb.FileType_FILE_TYPE_REPORT:
		resp, err = getReportFileInfo(ctx, uid, fileID)
	case wps_pb.FileType_FILE_TYPE_REPORT_TEMPLATE:
		resp, err = getReportTemplateFileInfo(ctx, uid, fileID)
	default:
		c.String(http.StatusBadRequest,
			fmt.Sprintf("暂不支持类型, %s", fileType))
		return
	}
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
		return
	}

	c.JSON(http.StatusOK, resp)
}

func getReportFileInfo(
	ctx context.Context,
	uid, fileID string,
) (*wps_pb.FileInfoResponse, error) {
	perm, err := checkPerm(ctx, &perm_pb.GetPermRequest{
		FileId: fileID,
		UserId: uid,
		Type:   file_pb.FileType_FILE_TYPE_REPORT,
	})
	if err != nil {
		return nil, err
	}
	reqPB := &file_pb.FileInfoRequest{
		Id:   fileID,
		Type: file_pb.FileType_FILE_TYPE_REPORT,
	}
	fileInfoResp, err := jianda_lib.GetFileInfo(ctx, reqPB)
	if err != nil {
		return nil, err
	}
	fileInfo := fileInfoResp.Data

	usersInfo, err := jianda_lib.GetUsersInfo(
		ctx, &user_pb.UserInfoRequest{Ids: []string{uid}})
	if err != nil {
		return nil, err
	}
	if len(usersInfo.Data) != 1 {
		return nil, errors.ErrInternalRaw(
			fmt.Sprintf("返回的userInfo数量不为1，%v", len(usersInfo.Data)))
	}
	userInfo := usersInfo.Data[0]
	wpsFile := toWpsFile(fileInfo)
	wpsUser := &wps_pb.WpsUser{
		Id:         userInfo.Id,
		Name:       userInfo.FullName,
		AvatarUrl:  userInfo.AvatarUrl,
		Permission: string(perm),
	}

	wpsFileInfo := &wps_pb.FileInfoResponse{
		File: wpsFile,
		User: wpsUser,
	}

	return wpsFileInfo, nil
}

func getReportTemplateFileInfo(
	ctx context.Context,
	uid, fileID string,
) (*wps_pb.FileInfoResponse, error) {
	perm, err := checkPerm(ctx, &perm_pb.GetPermRequest{
		FileId: fileID,
		UserId: uid,
		Type:   file_pb.FileType_FILE_TYPE_TEMPLATE,
	})
	if err != nil {
		return nil, err
	}
	reqPB := &file_pb.FileInfoRequest{
		Id:   fileID,
		Type: file_pb.FileType_FILE_TYPE_TEMPLATE,
	}
	fileInfoResp, err := jianda_lib.GetFileInfo(ctx, reqPB)
	if err != nil {
		return nil, err
	}
	fileInfo := fileInfoResp.Data
	wpsFile := toWpsFile(fileInfo)

	usersInfo, err := jianda_lib.GetUsersInfo(
		ctx, &user_pb.UserInfoRequest{Ids: []string{uid}})
	if err != nil {
		return nil, err
	}
	if len(usersInfo.Data) != 1 {
		return nil, errors.ErrInternalRaw(
			fmt.Sprintf("返回的userInfo数量不为1，%v", len(usersInfo.Data)))
	}
	userInfo := usersInfo.Data[0]
	wpsUser := &wps_pb.WpsUser{
		Id:         userInfo.Id,
		Name:       userInfo.FullName,
		AvatarUrl:  userInfo.AvatarUrl,
		Permission: string(perm),
	}

	wpsFileInfo := &wps_pb.FileInfoResponse{
		File: wpsFile,
		User: wpsUser,
	}

	return wpsFileInfo, nil
}
