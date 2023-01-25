package jianda

import (
	"testing"

	"logi/src/server/lib/config"
	test_util "logi/src/server/lib/testing"

	"github.com/stretchr/testify/assert"
)

func TestGetApi(t *testing.T) {
	test_util.SetupViper()
	config.Viper.Set(config.JiandaApiURL, "www.jianda.com")
	t.Run("test get api", func(t *testing.T) {
		u, err := getJiandaApiURL("/saas/v1/api")
		assert.Nil(t, err)
		assert.Equal(t, "www.jianda.com/api/library/saas/v1/api", u.String())
	})
}
