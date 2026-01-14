<template>
  <div class="diff-aside">
    <el-tabs class="tabs" @tab-click="onTabClicked">
      <el-tab-pane
        v-for="answer in answers"
        :key="answer.id"
        :label="answer.label">
        <el-tabs
          type="border-card"
          :class="[answer.subTabs.length === 1 ? 'hide-tab-header' : '']"
          @tab-click="onTabClicked">
          <el-tab-pane
            v-for="item in answer.subTabs"
            :key="item.id"
            :label="`${item.name}: ${item.children.length}`">
            <el-collapse
              accordion
              @change="(event) => handleCollapseChange(item.children, event)">
              <el-collapse-item
                v-for="child in item.children"
                :key="child.key"
                :name="child.key">
                <template slot="title">
                  <span>{{ child.key }}</span>
                  <span v-if="!answer.equal" class="tips">
                    <span v-if="emptyItems(child).length > 0" class="empty">
                      (空：{{ emptyItems(child).length }})
                    </span>
                    <span v-if="diffItems(child).length > 0" class="diff">
                      (差异：{{ diffItems(child).length }})
                    </span>
                    <span class="total">（全部：{{ child.pager.total }}）</span>
                  </span>
                </template>
                <ul class="answers">
                  <li
                    v-for="item in currentPageItems(child)"
                    :key="item.key"
                    :class="{ active: item.key === currentDiffItem.key }">
                    <div class="title">
                      <div class="navs">
                        <template v-if="item.data.length > 1">
                          <span
                            v-for="(itm, idx) in item.data"
                            :key="itm.key"
                            :class="[item.dataIndex === idx ? 'active' : '']"
                            @click.stop="viewDiff(child.items[0], item, idx)">
                            {{ idx + 1 }}
                          </span>
                        </template>
                      </div>
                      <div>
                        <el-tag
                          v-if="showBasicAnswerItemTag(child.items, item)"
                          size="mini"
                          :type="item.data.length === 0 ? 'info' : 'success'">
                          {{
                            item.data.length === 0 ? '答案未提取' : '比对答案'
                          }}
                        </el-tag>
                        <span v-if="diffMode === 'task'">
                          《{{ getFileInfo(item.fid).file_type }}》
                        </span>
                        <span>
                          页码:
                          {{
                            (item.data[item.dataIndex] &&
                              item.data[item.dataIndex].boxes[0].page + 1) ||
                            '-'
                          }}
                        </span>
                      </div>
                    </div>
                    <div
                      class="content"
                      @click="viewDiff(child.items[0], item, item.dataIndex)">
                      <p v-if="item.data.length === 0" class="text">
                        <i
                          v-if="!answer.equal"
                          class="el-icon-remove icon-empty"></i>
                        <span>{{ item.schema.data.label }}</span>
                      </p>
                      <p v-else class="text">
                        <i
                          v-if="
                            !answer.equal &&
                            item.diffs &&
                            item.diffs[item.dataIndex] &&
                            item.diffs[item.dataIndex].equal === false &&
                            item.diffs[item.dataIndex].html_diff_content
                          "
                          class="el-icon-error icon-diff"></i>
                        <span
                          class="diff-content"
                          v-html="
                            item.diffs &&
                            item.diffs[item.dataIndex] &&
                            item.diffs[item.dataIndex].html_diff_content
                          "></span>
                      </p>
                      <template>
                        <el-button
                          v-if="showViewDiffDetailsButton(child.items, item)"
                          type="text"
                          size="mini"
                          @click.stop="viewDiffDetails(child, item)">
                          查看详情
                        </el-button>
                        <el-button
                          v-if="diffMode === 'task' && item.data.length === 0"
                          type="text"
                          size="mini"
                          @click.stop="viewSample(item)">
                          查看范文
                        </el-button>
                      </template>
                    </div>
                  </li>
                </ul>
                <el-pagination
                  small
                  layout="total, prev, pager, next"
                  :current-page="child.pager.page"
                  :page-size="child.pager.size"
                  :total="child.pager.total"
                  @current-change="(page) => changePage(page, child)">
                </el-pagination>
              </el-collapse-item>
            </el-collapse>
            <el-empty v-if="!loading && item.children.length === 0"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-if="showDiffDetailsDialog"
      :title="diffDetails.key"
      :visible="true"
      width="70%"
      class="diff-details-dialog"
      @close="showDiffDetailsDialog = false">
      <div class="diff-content-container">
        <div class="diff-content">
          <div v-for="(item, index) in diffDetails.diffs" :key="index">
            <h4>《{{ item.name }}》 页码: {{ item.page }}</h4>
            <p v-if="item.position" class="position">
              <i class="el-icon-location-outline"></i>
              {{ item.position }}
            </p>
            <div v-if="item.text" class="text" v-html="item.text"></div>
            <div v-else class="empty">答案未提取</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'diff-aside',
  props: {
    diffMode: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    answers: {
      type: Array,
      required: true,
      default: () => [],
    },
    files: {
      type: Array,
      required: false,
      default: () => [],
    },
    currentDiffItem: {
      type: Object,
      required: false,
      default: () => ({
        key: '',
      }),
    },
  },
  data() {
    return {
      showDiffDetailsDialog: false,
      diffDetails: {
        key: '',
        diffs: [],
      },
    };
  },
  computed: {
    currentPageItems() {
      return (answer) => {
        const { page, size } = answer.pager;
        const start = (page - 1) * size;
        const end = page * size;
        return answer.items.slice(start, end);
      };
    },
    emptyItems() {
      return (answer) => {
        return answer.items.filter((i) => i.data.length === 0);
      };
    },
    diffItems() {
      return (answer) => {
        return answer.items.filter((i) =>
          i.diffs?.some((d) => d.equal === false),
        );
      };
    },
    showViewDiffDetailsButton() {
      return (items, item) => items[0].key !== item.key && item.data.length > 0;
    },
    showBasicAnswerItemTag() {
      return (items, item) => items[0].key === item.key;
    },
  },
  created() {},
  methods: {
    onTabClicked() {
      this.$emit('tab-clicked');
    },
    handleCollapseChange(items) {
      items.forEach((item) => {
        item.pager.page = 1;
      });
    },
    changePage(page, obj) {
      obj.pager.page = page;
    },
    getFileInfo(fid) {
      return this.files.find((file) => file.id === fid) || {};
    },
    viewDiff(mainFile, item, dataIndex = 0) {
      item.dataIndex = dataIndex;
      this.$emit('view-diff', { mainFile, item, dataIndex });
    },
    viewDiffDetails(answer, item) {
      this.showDiffDetailsDialog = true;
      const mainFile = answer.items[0];
      const dataIndex = item.dataIndex;
      this.diffDetails = {
        key: answer.key,
        diffs: [
          {
            name: this.getFileInfo(mainFile.fid)?.name,
            page: mainFile.data[0] ? mainFile.data[0].boxes[0].page + 1 : '-',
            text: mainFile.diffs ? mainFile.diffs[0]?.html_diff_content : '',
            position: this.getDiffPosition(mainFile.positions),
          },
          {
            name: this.getFileInfo(item.fid)?.name,
            page: item.data[dataIndex]?.boxes[0].page + 1,
            text: item.diffs[dataIndex]?.html_diff_content,
            position: this.getDiffPosition(item.positions),
          },
        ],
      };
    },
    viewSample(item) {
      this.$emit('view-sample', { item });
    },
    getDiffPosition(positions) {
      if (!positions || positions.length === 0) {
        return '';
      }
      return positions.join(' - ');
    },
  },
};
</script>

<style lang="scss" scoped>
.diff-aside {
  flex: 2;
  height: 100%;
  overflow-y: auto;
  .tabs {
    ::v-deep > .el-tabs__header {
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: #f6f7fa;
      .el-tabs__nav-wrap {
        padding: 0 20px;
      }
    }
    ::v-deep .el-tabs__content {
      overflow: initial;
    }
    .el-tabs {
      box-shadow: none;
      background: transparent;
      border: none;
      ::v-deep .el-tabs__header {
        position: sticky;
        top: 0;
        z-index: 1;
        border-top: 1px solid #e4e7ed;
        border-bottom: none;
        .el-tabs__nav {
          .el-tabs__item {
            &[id='tab-1'] {
              &.is-active {
                color: #ff0000;
              }
            }
          }
        }
      }
      &.hide-tab-header {
        ::v-deep .el-tabs__header {
          display: none;
        }
      }
      ::v-deep .el-tabs__content {
        padding: 0;
        .el-tab-pane {
          .el-collapse {
            .el-collapse-item {
              div[role='tab'] {
                position: relative;
                background: #fff;
                box-shadow: 0 1px 0px #ebeef5;
                &::before {
                  position: absolute;
                  left: 0;
                  top: 0;
                  content: '';
                  width: 3px;
                  height: 100%;
                  background-color: transparent;
                }
                .el-collapse-item__header {
                  padding-left: 20px;
                  .tips {
                    margin: 0 10px;
                    > span {
                      margin: 0 5px;
                      font-weight: normal;
                      &.empty {
                        color: #a5a9ac;
                      }
                      &.diff {
                        color: #ff0000;
                      }
                      &.total {
                        position: absolute;
                        top: 0;
                        right: 20px;
                        color: #999;
                      }
                    }
                  }
                  i {
                    font-weight: bold;
                  }
                }
              }
              &.green {
                > div[role='tab'] {
                  .el-collapse-item__header {
                    padding-left: 15px;
                    font-weight: bold;
                    color: #0090c0;
                  }
                }
              }
              &.red {
                > div[role='tab'] {
                  .el-collapse-item__header {
                    padding-left: 15px;
                    font-weight: bold;
                    color: #ff0000;
                  }
                }
              }
              .el-collapse-item__content {
                padding-bottom: 10px;
                div[role='tab'] {
                  position: sticky;
                  top: 0;
                  z-index: 98;
                  background: #fff;
                  .el-collapse-item__header {
                    padding-left: 25px;
                  }
                }
                .answers {
                  list-style: none;
                  li {
                    padding: 5px 25px 25px 25px;
                    border-bottom: 1px solid #f0f0f2;
                    background-color: #fafafa;
                    &:hover {
                      background: #f6f7fa;
                    }
                    .title {
                      display: flex;
                      justify-content: space-between;
                      margin-bottom: 5px;
                      font-size: 12px;
                      color: #777;
                      .navs {
                        > span {
                          margin-right: 20px;
                          font-weight: bold;
                          cursor: pointer;
                          &.active {
                            color: #0090c0;
                            text-decoration: underline;
                          }
                        }
                      }
                      .el-tag {
                        margin: 0 10px;
                        height: 18px;
                        line-height: 17px;
                      }
                    }
                    .content {
                      position: relative;
                      display: flex;
                      align-items: end;
                      justify-content: space-between;
                      .text {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        line-height: 20px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        cursor: pointer;
                        i[class^='el-icon-'] {
                          margin-right: 5px;
                          font-size: 14px;
                          &.icon-empty {
                            color: #a5a9ac;
                          }
                          &.icon-diff {
                            color: #ff0000;
                          }
                        }
                      }
                      .el-button {
                        margin-left: 10px;
                        padding: 4px 0;
                        color: #0090c0;
                      }
                    }
                  }
                }
                .el-pagination {
                  padding: 10px 25px 0;
                  text-align: right;
                }
              }
            }
          }
          &[id='pane-0'] {
            .el-collapse-item {
              &.is-active {
                > div[role='tab'] {
                  color: #0090c0;
                  &::before {
                    background-color: #0090c0;
                  }
                  .el-collapse-item__header {
                    color: #0090c0;
                  }
                }
                .answers {
                  li {
                    &.active {
                      background-color: rgba(#0090c0, 0.05);
                    }
                  }
                }
              }
            }
          }
          &[id='pane-1'] {
            .el-collapse-item {
              &.is-active {
                > div[role='tab'] {
                  &::before {
                    background-color: #ff0000;
                  }
                  .el-collapse-item__header {
                    color: #ff0000;
                  }
                }
                .answers {
                  li {
                    &.active {
                      background-color: rgba(#ff0000, 0.05);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .diff-details-dialog {
    ::v-deep .el-dialog__body {
      padding-top: 20px;
    }
    .diff-content-container {
      max-height: 60vh;
      overflow-y: auto;
      .diff-content {
        display: flex;
        > div {
          flex: 1;
          h4 {
            position: sticky;
            top: 0;
            display: flex;
            justify-content: center;
            padding-bottom: 10px;
            background: #fff;
          }
          .position {
            margin-bottom: 10px;
            padding: 8px 10px;
            border-radius: 3px;
            background-color: #eee;
            i {
              margin-right: 5px;
              font-size: 16px;
            }
          }
          .text {
            line-height: 26px;
            white-space: pre-line;
          }
          .empty {
            display: flex;
            justify-content: center;
            align-items: center;
            height: calc(100% - 30px);
            color: #a5a9ac;
          }
          &:first-child {
            padding-right: 15px;
            border-right: 1px solid #e3e3e3;
          }
          &:last-child {
            padding-left: 15px;
          }
        }
      }
    }
  }

  ::v-deep .diff-content {
    s,
    u {
      text-decoration: underline;
      text-underline-offset: -5px;
      text-decoration-thickness: 8px;
      text-decoration-skip-ink: none;
    }
    s {
      text-decoration-color: #ff000078;
    }
    u {
      text-decoration-color: #00ff728a;
    }
  }
}
</style>
