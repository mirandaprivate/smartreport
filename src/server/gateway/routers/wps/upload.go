package wps

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"

	file_pb "logi/src/proto/jianda/file"
	jianda "logi/src/proto/jianda/file"
	wps_pb "logi/src/proto/wps"
	jianda_lib "logi/src/server/lib/jianda"

	"github.com/gin-gonic/gin"
)

func saveFile(c *gin.Context) {
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
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	var file *wps_pb.File
	multipartFile, _, err := c.Request.FormFile("file")
	defer multipartFile.Close()
	if err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("bad file format"))
		return
	}
	fileBuffer := bytes.NewBuffer(nil)
	if _, err := io.Copy(fileBuffer, multipartFile); err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("bad file format"))
		return
	}
	fileBytes := fileBuffer.Bytes()
	base64Content := base64.StdEncoding.EncodeToString(fileBytes)
	jwt, err := getParamJwt(c)
	if err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		return
	}
	ctx := createJwtCtx(jwt)

	switch fileType {
	case wps_pb.FileType_FILE_TYPE_REPORT:
		file, err = saveReport(ctx, fileID, base64Content)
	case wps_pb.FileType_FILE_TYPE_REPORT_TEMPLATE:
		file, err = saveReportTemplate(ctx, fileID, base64Content)
	default:
		c.String(http.StatusBadRequest,
			fmt.Sprintf("暂不支持类型, %s", fileType))
		return
	}
	if err != nil {
		c.String(http.StatusInternalServerError,
			fmt.Sprintf("save file %v failed, %v", fileID, err.Error()))
		return
	}
	resp := wps_pb.FileSaveResponse{
		File: file,
	}
	c.JSON(http.StatusOK, &resp)
}

func saveReportTemplate(
	ctx context.Context,
	templateID string,
	content string,
) (*wps_pb.File, error) {
	respPB, err := jianda_lib.SaveFile(ctx, &jianda.SaveFileRequest{
		Id:            templateID,
		Type:          file_pb.FileType_FILE_TYPE_TEMPLATE,
		Base64Content: content,
	})
	if err != nil {
		return nil, err
	}
	return toWpsFile(respPB.Data), nil
}

func saveReport(
	ctx context.Context,
	reportID string,
	content string,
) (*wps_pb.File, error) {
	respPB, err := jianda_lib.SaveFile(ctx, &jianda.SaveFileRequest{
		Id:            reportID,
		Type:          file_pb.FileType_FILE_TYPE_REPORT,
		Base64Content: content,
	})
	if err != nil {
		return nil, err
	}
	return toWpsFile(respPB.Data), nil
}
