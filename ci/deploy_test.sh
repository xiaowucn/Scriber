#!/usr/bin/bash
set -ex
#c121
rsync -avz --progress --delete --exclude=.git ./dist/ ci@100.64.0.10:/data2/scriber_test/code_src/Scriber-Backend/remarkable/static/

if [ -f "/data/ci/fitout/autodoc/send_mm_msg.sh" ]; then
  bash /data/ci/fitout/autodoc/send_mm_msg.sh http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa scriber "[Scriber(4082)-测试环境-前端-更新成功](http://100.64.0.10:4082)\`版本：${GO_REVISION_SCRIBER_FRONT:0:8}(${GO_MATERIAL_BRANCH_SCRIBER_FRONT})\`"
fi
