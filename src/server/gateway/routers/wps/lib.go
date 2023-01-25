package wps

import (
	"context"
	"fmt"
	"strconv"

	jianda_file_pb "logi/src/proto/jianda/file"
	perm_pb "logi/src/proto/jianda/perm"
	wps_pb "logi/src/proto/wps"
	"logi/src/server/lib/consts"
	"logi/src/server/lib/errors"
	jianda_lib "logi/src/server/lib/jianda"

	"github.com/gin-gonic/gin"
)

type PermissionType string

var (
	defaultUserAcl = &wps_pb.File_UserAcl{
		Rename:  0,
		History: 1,
		Copy:    1,
		Export:  1,
		Print:   1,
	}
	defaultWaterMark           = &wps_pb.Watermark{Type: 0}
	defaultPreviewPages uint32 = 0
)

func permissionDeniedErr() error {
	return errors.ErrPermissionDeniedRaw("您无权限访问此文件")
}

const (
	wpsFileIDFormat      = "%d_%d"
	wpsExcelFileIDFormat = "%d_%d_%d"
	usernameEnv          = "LOGI_WPS_DBG_USER"
	userParam            = "_w_dbg_user"

	PermRead  PermissionType = "read"
	PermWrite PermissionType = "write"
)

func checkPerm(
	ctx context.Context,
	req *perm_pb.GetPermRequest,
) (PermissionType, error) {
	permPB, err := jianda_lib.GetPerm(ctx, &perm_pb.GetPermRequest{
		FileId: req.FileId,
		UserId: req.UserId,
		Type:   req.Type,
	})
	if err != nil {
		return "", err
	}
	var perm PermissionType
	switch permPB.Data {
	case perm_pb.FilePerm_PERM_DENIED:
		return "", permissionDeniedErr()
	case perm_pb.FilePerm_PERM_READ:
		perm = PermRead
	case perm_pb.FilePerm_PERM_WRITE:
		perm = PermWrite
	case perm_pb.FilePerm_PERM_UNSPECIFIED:
		return "", permissionDeniedErr()
	}
	return perm, nil
}

func getParamUserID(c *gin.Context) (string, error) {
	id := c.Query("_w_user_id")
	return id, nil
}

func getParamFileType(c *gin.Context) (wps_pb.FileType, error) {
	rawFileType, err := strconv.Atoi(c.Query("_w_file_type"))
	if err != nil {
		return wps_pb.FileType(rawFileType), errors.ErrInvalidRaw(
			fmt.Sprintf("_file_type %v is not valid type", rawFileType),
		)
	}
	return wps_pb.FileType(rawFileType), nil
}

func getParamFileID(c *gin.Context) (string, error) {
	id := c.Query("_w_file_id")
	return id, nil
}

func getParamJwt(c *gin.Context) (string, error) {
	jwt := c.Query("_w_jwt")
	if jwt == "" {
		return "", errors.ErrPermissionDeniedRaw("no jwt in header")
	}
	return jwt, nil
}

func createJwtCtx(jwt string) context.Context {
	ctx := context.Background()
	return context.WithValue(ctx, consts.JiandaRequestAuthHeaderKey, jwt)
}

func toWpsFile(fileInfo *jianda_file_pb.FileInfo) *wps_pb.File {
	wpsFile := &wps_pb.File{
		Id:           fileInfo.Id,
		Name:         fileInfo.Name,
		Version:      uint32(fileInfo.Version),
		Size:         uint32(fileInfo.Size),
		Creator:      fileInfo.OwnerId,
		CreateTime:   uint32(fileInfo.CreateTime),
		Modifier:     fileInfo.LastModifyUser,
		ModifyTime:   uint32(fileInfo.LastModifyTime),
		DownloadUrl:  fileInfo.DownloadUrl,
		PreviewPages: defaultPreviewPages,
		UserAcl:      defaultUserAcl,
		Watermark:    &wps_pb.Watermark{Type: 0},
	}
	return wpsFile
}

func getParamVersionID(c *gin.Context) (int, error) {
	s, ok := c.Params.Get("version")
	if !ok {
		return 0, errors.ErrInvalidRaw("no version in url path")
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return 0, errors.ErrInvalidRaw(fmt.Sprintf("not valid version %v", v))
	}
	return v, nil
}

func badRequest() error {
	return errors.ErrInternalRaw("bad request")
}
