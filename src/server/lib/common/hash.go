package common

import (
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"math/rand"
	"strings"
	"time"
)

// Sha256Hash convert a string to sha256sum string.
func Sha256Hash(s ...string) string {
	s1 := strings.Join(s, "")
	h := sha256.New()
	io.WriteString(h, s1)
	return hex.EncodeToString(h.Sum(nil))
}

// MD5Hash convert a string to md5sum string.
func MD5Hash(s ...string) string {
	s1 := strings.Join(s, "")
	return fmt.Sprintf("%x", md5.Sum([]byte(s1)))
}

// RandomPass returns a random password.
func RandomPass(length int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, length)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

// RandomPass returns a random password.
func RandomCode(length int) string {
	var letters = []rune("0123456789")
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, length)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
