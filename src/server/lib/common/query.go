package common

import (
	"gorm.io/gorm"
)

const (
	maxCount = 3000
)

func GDBSetOffsetLength(
	q *gorm.DB,
	off int32,
	leng int32,
) (query *gorm.DB, offset int) {
	offset, length := 0, 20
	if off != 0 {
		offset = int(off)
	}
	if leng != -1 {
		if leng != 0 {
			length = int(leng)
			if length > maxCount {
				length = maxCount
			}
		}
		q.Offset(offset).Limit(length)
	} else {
		q.Offset(offset).Limit(maxCount)
	}
	return q, offset
}

func GDBClearOffsetLength(
	q *gorm.DB,
) *gorm.DB {
	q.Offset(0).Limit(maxCount)
	return q
}
