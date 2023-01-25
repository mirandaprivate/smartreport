package wps

import (
	"fmt"
	wps_pb "logi/src/proto/wps"
	"logi/src/server/lib/config"
)

const (
	fileIDKey    = "_w_file_id"
	fileTypeKey  = "_w_file_type"
	versionIDKey = "_w_version_id"
	tokenTypeKey = "_w_tokentype"
	userIDKey    = "_w_user_id"
	appidKey     = "_w_appid"
	dbgUserKey   = "_w_dbg_user"
	jwtKey       = "_w_jwt"

	// pub cloud consts
	signedSignatureKey = "_w_signature"
	wpsURL             = "https://wwo.wps.cn/office"
	usernameEnv        = "LOGI_WPS_DBG_USER"

	// private saas consts
	wpsServerSignApiPath   = "/auth/v1/app/inscope/token"
	wpsServerGetEditorPath = "/weboffice/v1/url"
	wpsServerApiPrefix     = "/open"

	wpsServerScopeKey = "scope"
	wpsServerScope    = "file_edit"

	wpsServerAppIdKey    = "app_id"
	wpsServerAppTokenKey = "app_token"
	wpsServerFileIDKey   = "file_id"
	wpsServerFileTypeKey = "type"
)

func getWpsID(fileID string, fileType wps_pb.FileType) string {
	dbgUser := config.Viper.GetString(config.WpsDebugUser)
	if dbgUser != "" {
		return fmt.Sprintf("%d_%s_%s", fileType, fileID, dbgUser)
	}
	return fmt.Sprintf("%d_%s", fileType, fileID)
}
