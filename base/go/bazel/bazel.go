package bazel

import (
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"
)

// GetWorkspace returns the path of workspace.
// Such as `/home/chuji/work/LogiOcean`.
// The initial way you can read the func comment of `getWorkspace()` at the
// `src/src/ts/bazel.ts`
func GetWorkspace() (string, error) {
	// From: https://docs.bazel.build/versions/2.0.0/user-manual.html#run
	workspaceDir := os.Getenv("BUILD_WORKSPACE_DIRECTORY")
	if workspaceDir != "" {
		return workspaceDir, nil
	}
	var currentDir, _ = os.Getwd()
	for currentDir != "/" {
		currentDir = filepath.Dir(currentDir)
		var path = filepath.Join(currentDir, "DO_NOT_BUILD_HERE")
		if _, err := os.Stat(path); err == nil {
			content, _ := ioutil.ReadFile(path)
			return string(content), nil
		}
	}
	return "", errors.New("can not find the `DO_NOT_BUILD_HERE` file")
}

const msg = `The 'RUNFILES_DIR' enviroment value is not set.
You need to set your binary or test target attr 'vendor = True'.
For example:
'''
go_binary(
	name = 'foo',
	...
	vendor = True,
)
go_test(
	name = 'foo_test',
	...
	vendor = True,
)
'''
`

// GetRunfilesDir returns the runfiles root dir.
// Such as `..bazel-out/k8-fastbuild/bin/src/web/projects/docsite/app/`
// `__gen_router_json_bin.runfiles`
func GetRunfilesDir() (string, error) {
	runfilesDir := os.Getenv("RUNFILES_DIR")
	if runfilesDir != "" {
		return runfilesDir, nil
	}
	return "", errors.New(msg)
}
