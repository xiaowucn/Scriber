<template>
  <el-tooltip placement="top" :content="$t(`message['提交记录']`)">
    <el-popover
      ref="popover"
      placement="right"
      width="220"
      popper-class="archived-answers-popover"
      trigger="click"
      @show="showArchivedAnswers"
      @after-leave="activeIndex = null">
      <div v-loading="loading">
        <template v-if="answers.length > 0">
          <ul class="archived-answers">
            <li
              v-for="(answer, index) in answers"
              :key="index"
              :class="{ active: index === activeIndex }"
              @click="switchAnswer(index, answer.data)">
              <h4>{{ answer.user.name }}</h4>
              <p class="time">{{ answer.updated_utc | datetime }}</p>
              <el-popconfirm
                :title="$t(`message['确定要还原到这次提交吗？']`)"
                cancel-button-type="default"
                width="170"
                placement="bottom-end"
                popper-class="restore-archived-answer-popconfirm"
                @confirm="restoreAnswer(answer.data)">
                <el-button
                  slot="reference"
                  type="text"
                  size="mini"
                  icon="el-icon-refresh-left"
                  class="btn-restore"
                  @click.stop>
                  {{ $t(`message['还原']`) }}
                </el-button>
              </el-popconfirm>
            </li>
          </ul>
          <el-pagination
            small
            layout="prev, pager, next"
            :current-page="pager.page"
            :page-size="pager.size"
            :total="pager.total"
            @current-change="changePage">
          </el-pagination>
        </template>
        <template v-else>
          <el-empty :description="$t(`message['暂无提交记录']`)"></el-empty>
        </template>
      </div>
      <svg-font-icon slot="reference" name="time-history" :size="18">
      </svg-font-icon>
    </el-popover>
  </el-tooltip>
</template>

<script>
import { RemarkTreeLoading } from '@/utils/remark-tree-loading';
import { getArchivedAnswers } from '@/store/api/remark.api';

export default {
  name: 'archived-answers',
  props: {
    qid: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      activeIndex: null,
      answers: [],
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
    };
  },
  methods: {
    showArchivedAnswers() {
      this.pager.page = 1;
      this.getArchivedAnswers();
    },
    async getArchivedAnswers() {
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          page_size: this.pager.size,
        };
        const res = await getArchivedAnswers(this.qid, params);
        this.answers = res.items;
        this.pager.total = res.total;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      this.pager.page = page;
      this.getArchivedAnswers();
    },
    async switchAnswer(index, data) {
      try {
        this.activeIndex = index;
        await RemarkTreeLoading.start();
        this.$store.dispatch('remarkModule/switchUserAnswer', data.userAnswer);
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        RemarkTreeLoading.close();
      }
    },
    async restoreAnswer(data) {
      try {
        this.loading = true;
        await this.$store.dispatch('remarkModule/sendQuestionAnswer', {
          qid: this.qid,
          data: { data },
          type: 0,
          isExportAnswer: false,
        });
        this.$refs.popover.doClose();
        this.$emit('reload-question');
        this.activeIndex = null;
        this.showArchivedAnswers();
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['答案已还原']`),
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tooltip {
  ::v-deep i {
    margin-right: 15px;
    font-weight: bold;
  }
}
</style>

<style lang="scss">
.archived-answers-popover {
  padding: 0;
  .archived-answers {
    max-height: 50vh;
    overflow-y: auto;
    list-style: none;
    padding: 10px 0;
    font-size: 13px;

    li {
      position: relative;
      padding: 5px 12px;
      cursor: pointer;
      &.active,
      &:hover {
        background-color: #eee;

        .btn-restore {
          visibility: visible;
        }
      }
      .time {
        margin-top: 2px;
        color: #777;
      }
      .btn-restore {
        position: absolute;
        top: 0;
        right: 12px;
        visibility: hidden;
        > span {
          margin: 0;
        }
      }
    }
  }

  .el-pagination {
    padding: 5px 10px;
  }
}
.restore-archived-answer-popconfirm {
  font-size: 13px;

  .el-popconfirm__action {
    .el-button {
      padding: 3px 7px;
    }
  }
}
</style>
