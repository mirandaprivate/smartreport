package wps

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	fileInfoPath    = "/file/info"
	saveFilePath    = "/file/save"
	userInfoPath    = "/user/info"
	fileHisotryPath = "/file/history"
	fileVersionPath = "/file/version/:version"
	fileOnlinePath  = "/file/online"
	onnotifyPath    = "/onnotify"
)

func SetupGroup(router *gin.RouterGroup) {
	router.Handle(http.MethodGet, fileInfoPath, getFileInfo)
	router.Handle(http.MethodPost, saveFilePath, saveFile)
	router.Handle(http.MethodPost, userInfoPath, getUserInfo)
	router.Handle(http.MethodPost, fileHisotryPath, getFileHistory)
	router.Handle(http.MethodGet, fileVersionPath, getFileVersion)
	router.Handle(http.MethodPost, fileOnlinePath, getFileOnline)
	router.Handle(http.MethodPost, onnotifyPath, getOnnotify)
}
