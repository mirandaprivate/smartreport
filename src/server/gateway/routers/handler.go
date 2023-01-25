package routers

import (
	"logi/src/server/gateway/routers/wps"
	"logi/src/server/lib/consts"
	"net/http"

	"logi/src/server/lib/log"

	"github.com/gin-gonic/gin"
)

const (
	GinPrefix = "/saas/gin"
)

var Route *gin.Engine

func defaultHandler(c *gin.Context) {
	c.String(http.StatusBadRequest, "error url %v", c.Request.URL.String())
}

func Init() {
	Route = gin.New()
	Route.Use(Logger(log.Logger), gin.Recovery())

	wpsGroup := Route.Group(consts.WpsProviderPrefix)
	wps.SetupGroup(wpsGroup)

	Route.Handle("GET", "/", defaultHandler)
	Route.Handle("POST", "/", defaultHandler)
}
