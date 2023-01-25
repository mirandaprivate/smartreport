package common

import (
	"encoding/json"
	"fmt"
	"net/url"
	"reflect"
)

// FullGetURL encode the body in url for http.MethodGet
func FullGetURL(origin string, body interface{}) string {
	bodyRaw, _ := json.Marshal(body)
	values := map[string]interface{}{}
	json.Unmarshal(bodyRaw, &values)
	params := url.Values{}
	for k, v := range values {
		if reflect.TypeOf(v).Kind() == reflect.Slice {
			v1 := v.([]interface{})
			for _, value := range v1 {
				params.Add(k, fmt.Sprint(value))
			}
			continue
		}
		if reflect.TypeOf(v).Kind() == reflect.String && v == "" {
			continue
		}
		params.Add(k, fmt.Sprint(v))
	}
	baseURL, err := url.Parse(origin)
	if err != nil {
		return origin
	}
	baseURL.RawQuery = params.Encode()
	return baseURL.String()
}
