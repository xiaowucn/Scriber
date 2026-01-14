#!/bin/bash

run() {
  "$@"
  _exit_code=$?
  if [ ${_exit_code} -ne 0 ]; then
    echo "Error: exec $* with exit code ${_exit_code}"
    exit ${_exit_code}
  fi
}

# frontend
run rsync -avz --progress --delete ./dist_hkex/ ci@100.64.0.105:/data/scriber_hkex_test/code_src/Scriber-Backend/remarkable/static/

# mm
bash /data/ci/fitout/autodoc/send_mm_msg.sh \
  http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa \
  jura "[Scriber港交所测试环境](https://jura.test.paodingai.com)已更新: \`前端:${GO_REVISION_SCRIBER:0:8}(${GO_MATERIAL_BRANCH_SCRIBER})\`"
