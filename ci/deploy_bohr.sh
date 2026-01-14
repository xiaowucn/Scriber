#!/usr/bin/env bash

run() {
  "$@"
  _exit_code=$?
  if [ ${_exit_code} -ne 0 ]; then
    echo "Error: exec "$@" with exit code ${_exit_code}"
    exit ${_exit_code}
  fi
}

BIN_DIR=$(dirname $0)
PROJECT_ROOT=$(python -c "import os; print(os.path.abspath('$BIN_DIR/..'))")

cd "${PROJECT_ROOT}"
run yarn install
run yarn build-ccxi

run rsync -av --exclude=.git dist/ docker_test@bohr.cheftin.cn:/data/scriber/scriber_front/dist/

if [ -f "/data/ci/fitout/autodoc/send_mm_msg.sh" ]; then
  if [ -d .git ]; then
    BRANCH_NAME="$(git rev-parse --abbrev-ref HEAD)"
  fi

  bash /data/ci/fitout/autodoc/send_mm_msg.sh http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa scriber \[Scriber测试环境\(4080\)\]\(http://bohr.cheftin.cn:4080/\)前端已更新至版本\:\`${GO_REVISION_DEV:0:8}\(${BRANCH_NAME}\)\`
fi
