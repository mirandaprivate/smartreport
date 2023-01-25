package wps

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getFileOnline(c *gin.Context) {
	c.Status(http.StatusOK)
}
