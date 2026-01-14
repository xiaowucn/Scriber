#!/usr/bin/bash
set -ex
#c122
rsync -avz --progress --delete --exclude=.git ./dist_zts/ ci@100.64.0.11:/data/scriber_zts_test/code_src/Scriber-Backend/remarkable/static/

if [ -f "/data/ci/fitout/autodoc/send_mm_msg.sh" ]; then
  bash /data/ci/fitout/autodoc/send_mm_msg.sh http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa scriber "[Scriber-中泰证券测试环境-前端-更新成功](http://100.64.0.9:55845)\`版本：${GO_REVISION_SCRIBER:0:8}(${GO_MATERIAL_BRANCH_SCRIBER})\`"
fi
