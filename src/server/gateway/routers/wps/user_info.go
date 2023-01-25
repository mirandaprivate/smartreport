package wps

import (
	jianda_user_pb "logi/src/proto/jianda/user"
	wps_pb "logi/src/proto/wps"
	jianda_lib "logi/src/server/lib/jianda"
	"net/http"

	"github.com/gin-gonic/gin"
)

func getUserInfo(c *gin.Context) {
	userInfoReq := &wps_pb.UserInfoRequest{}
	c.BindJSON(userInfoReq)
	jwt, err := getParamJwt(c)
	if err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		return
	}
	ctx := createJwtCtx(jwt)
	usersInfoResp, err := jianda_lib.GetUsersInfo(
		ctx, &jianda_user_pb.UserInfoRequest{Ids: userInfoReq.Ids})
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	users := []*wps_pb.WpsUser{}
	for _, userInfo := range usersInfoResp.Data {
		user := &wps_pb.WpsUser{
			Id:        userInfo.Id,
			Name:      userInfo.FullName,
			AvatarUrl: userInfo.AvatarUrl,
		}
		users = append(users, user)
	}

	resp := &wps_pb.UserInfoResponse{
		Users: users,
	}
	c.JSON(http.StatusOK, resp)
}
