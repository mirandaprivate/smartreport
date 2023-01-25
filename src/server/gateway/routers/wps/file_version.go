package wps

import (
	"context"
	"fmt"
	"net/http"

	jianda "logi/src/proto/jianda/file"
	jianda_file_pb "logi/src/proto/jianda/file"
	wps_pb "logi/src/proto/wps"

	jianda_lib "logi/src/server/lib/jianda"

	"github.com/gin-gonic/gin"
)

func getFileVersion(c *gin.Context) {
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
	fileVersion, err := getParamVersionID(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	var file *wps_pb.File
	jwt, err := getParamJwt(c)
	if err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		return
	}
	ctx := createJwtCtx(jwt)
	switch fileType {
	case wps_pb.FileType_FILE_TYPE_REPORT:
		file, err = getReportVersionInfo(ctx, fileID, int32(fileVersion))
	case wps_pb.FileType_FILE_TYPE_REPORT_TEMPLATE:
		file, err = getTemplateVersionInfo(ctx, fileID, int32(fileVersion))
	default:
		c.String(http.StatusBadRequest, fmt.Sprintf("暂不支持类型, %s", fileType))
		return
	}
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
		return
	}
	resp := &wps_pb.FileVersionResponse{
		File: file,
	}
	c.JSON(http.StatusOK, resp)
}

func getReportVersionInfo(
	ctx context.Context,
	id string,
	version int32,
) (*wps_pb.File, error) {
	resp, err := jianda_lib.GetFileVersion(ctx, &jianda.GetFileVersionInfoRequest{
		Id:      id,
		Type:    jianda_file_pb.FileType_FILE_TYPE_REPORT,
		Version: version,
	})
	if err != nil {
		return nil, err
	}
	return toWpsFile(resp.Data), nil
}

func getTemplateVersionInfo(
	ctx context.Context,
	id string,
	version int32,
) (*wps_pb.File, error) {
	resp, err := jianda_lib.GetFileVersion(ctx, &jianda.GetFileVersionInfoRequest{
		Id:      id,
		Type:    jianda_file_pb.FileType_FILE_TYPE_TEMPLATE,
		Version: version,
	})
	if err != nil {
		return nil, err
	}
	return toWpsFile(resp.Data), nil
}
