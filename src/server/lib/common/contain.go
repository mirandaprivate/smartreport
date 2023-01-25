package common

// InInt32Array returns true if given array contains given number.
func InInt32Array(array []int32, num int32) bool {
	for _, n := range array {
		if num == n {
			return true
		}
	}
	return false
}

// InStringArray returns true if given array contains given string.
func InStringArray(array []string, s string) bool {
	for _, s1 := range array {
		if s1 == s {
			return true
		}
	}
	return false
}

type StringContains struct {
	table map[string]bool
}

func NewStringContains(array []string) *StringContains {
	table := map[string]bool{}
	for _, s := range array {
		table[s] = true
	}
	return &StringContains{table: table}
}

func (sc *StringContains) In(s string) bool {
	return sc.table[s]
}

type Int32Contains struct {
	table map[int32]bool
}

func NewInt32Contains(array []int32) *Int32Contains {
	table := map[int32]bool{}
	for _, s := range array {
		table[s] = true
	}
	return &Int32Contains{table: table}
}

func (ic *Int32Contains) In(i int32) bool {
	return ic.table[i]
}
