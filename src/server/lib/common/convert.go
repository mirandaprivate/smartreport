package common

import "strconv"

func String2Int32(s string) int32 {
	r := 0
	i, err := strconv.Atoi(s)
	if err == nil {
		r = i
	}
	return int32(r)
}

func String2Int(s string) int {
	r := 0
	i, err := strconv.Atoi(s)
	if err == nil {
		r = i
	}
	return r
}

func String2Float32(s string) float32 {
	value, err := strconv.ParseFloat(s, 32)
	if err != nil {
		return 0
	}
	return float32(value)
}

func Int2String(i int) string {
	return strconv.Itoa(i)
}

func Int32ToString(i int32) string {
	return strconv.Itoa(int(i))
}
