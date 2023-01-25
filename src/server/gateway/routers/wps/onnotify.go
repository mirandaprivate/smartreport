package wps

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getOnnotify(c *gin.Context) {
	c.Status(http.StatusOK)
}
