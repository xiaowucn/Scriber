<template>
  <el-aside
    :class="{
      'schema-viewer-wrapper': true,
      [isShowSchemaViewer ? 'schema-viewer-show' : 'schema-viewer-hide']: true,
    }">
    <el-container>
      <el-header height="auto">
        <div class="schema-viewer-header">
          <div
            v-if="isShowSchemaViewer"
            class="schema-toggle-wrapper schema-normal-wrapper">
            <section>
              <el-button type="text" @click="closeSchemaViewer">
                <i class="el-icon-arrow-left"></i>
                <span>收缩</span>
              </el-button>
            </section>
            <section class="file-info">
              <div class="file-name">
                <span>{{ $t(`message['文件名']`) }}：</span
                >{{ fileInfo.fileName }}
              </div>
              <div class="file-id">
                <span>{{ $t(`message['文件ID']`) }}：</span
                >{{ fileInfo.fileId }}
              </div>
              <div class="file-path">
                <span>{{ $t(`message['位置']`) }}：</span>
                <bread-crumb :currentTab="currentTab"></bread-crumb>
              </div>
            </section>
          </div>
          <div v-else class="schema-toggle-wrapper schema-mini-wrapper">
            <el-button type="text" @click="openSchemaViewer"
              ><i class="fa fa-bars fa-fw"></i
            ></el-button>
            <div class="nav-btns">
              <el-tooltip
                effect="dark"
                :content="$t(`message['上一篇文档']`)"
                placement="right">
                <el-button type="text" :disabled="prevDisabled">
                  <i
                    class="el-icon-arrow-up"
                    @click="loadPrevOrNextQuestion('prev')"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                :content="$t(`message['下一篇文档']`)"
                placement="right">
                <el-button type="text" :disabled="nextDisabled">
                  <i
                    class="el-icon-arrow-down"
                    @click="loadPrevOrNextQuestion('next')"></i>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-header>
      <el-main
        class="schema-viewer"
        v-show="isShowSchemaTree"
        ref="schemaTreeContainer">
        <div v-show="isShowSchemaTree" class="schema-show-btn">
          <el-button
            @click="gotoSchema"
            size="mini"
            icon="el-icon-view"
            circle></el-button>
        </div>
        <file-remark-schema-readonly
          :treeData="treeData"></file-remark-schema-readonly>
      </el-main>
    </el-container>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex';
import FileRemarkSchemaReadonly from './FileRemarkSchemaReadonly';
import BreadCrumb from '@/components/BreadCrumb';

export default {
  name: 'file-remark-schema-aside',
  components: {
    FileRemarkSchemaReadonly,
    BreadCrumb,
  },
  props: {
    treeData: {
      type: Object,
      required: true,
    },
    entity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isShowSchemaViewer: false,
      isShowSchemaTree: false,
      fileInfo: {
        fileName: '',
        fileId: '',
      },
      currentTab: 'projectAll',
      prevDisabled: false,
      nextDisabled: false,
    };
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    fileList() {
      return this.fileViewer.files.filter(
        (file) =>
          file.fileType !== 'folder' && file.qid !== null && file.mold !== null,
      );
    },
  },
  watch: {
    $route() {
      this.setPrevOrNextBtnStatus();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        if (this.fileViewer.filePath.length === 0) {
          await this.$store.dispatch('detailModule/fetchFilePath', {
            treeId: this.$route.query.treeId,
          });
        }
        this.getFileInfo();
        this.setPrevOrNextBtnStatus();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    toggleSchemaViewer() {
      this.isShowSchemaViewer = !this.isShowSchemaViewer;
    },
    async openSchemaViewer() {
      this.isShowSchemaViewer = true;
      setTimeout(() => {
        this.isShowSchemaTree = true;
      });
    },
    async closeSchemaViewer() {
      this.isShowSchemaTree = false;
      setTimeout(() => {
        this.isShowSchemaViewer = false;
      });
    },
    gotoSchema() {
      this.isShowSchemaTree = false;
      setTimeout(() => {
        this.$router.push({ path: `/schema/${this.entity.id}/tree` });
      });
    },
    getFileInfo() {
      this.fileInfo = this.$route.query;
    },
    setPrevOrNextBtnStatus() {
      const currentFileId = Number(this.$route.query.fileId);
      const index = this.fileList.findIndex(
        (file) => file.id === currentFileId,
      );
      this.prevDisabled = false;
      this.nextDisabled = false;
      if (index === 0) {
        this.prevDisabled = true;
      }
      if (index === this.fileList.length - 1) {
        this.nextDisabled = true;
      }
    },
    loadPrevOrNextQuestion(direction) {
      const currentFileId = Number(this.$route.query.fileId);
      const index = this.fileList.findIndex(
        (file) => file.id === currentFileId,
      );
      let navIndex = 0;
      if (index !== -1) {
        if (direction === 'prev') {
          if (index === 0) {
            return;
          }
          navIndex = index - 1;
        } else {
          if (index >= this.fileList.length - 1) {
            return;
          }
          navIndex = index + 1;
        }

        const { tree_id, id, pid, name } = this.fileList[navIndex];
        const { id: qid, mold } = this.fileList[navIndex].questions[0];
        this.$router.push({
          name: 'remark',
          params: { qid },
          query: {
            treeId: tree_id,
            fileId: id,
            schemaId: mold,
            projectId: pid,
            fileName: name,
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$miniSchemaViewerWidth: 40px;
$SchemaViewerToggleHeight: 31px;

.schema-viewer-wrapper {
  .el-header {
    padding: 0;
    height: $SchemaViewerToggleHeight;
  }
  .schema-viewer-header {
    width: 100%;
    .schema-toggle-wrapper {
      width: 100%;
      button {
        height: $SchemaViewerToggleHeight;
        padding: 0;
      }
      .nav-btns {
        margin-top: 5px;
        .el-button {
          margin: 0;
          ::v-deep span {
            display: inline-block;
            width: 17px;
            height: 17px;
            line-height: 17px;
            border: 1px solid #409dff;
            border-radius: 3px;
            i {
              font-weight: bold;
            }
            &:hover {
              background: #409dff;
              i {
                color: #fff;
              }
            }
          }
          &.is-disabled {
            ::v-deep span {
              border: 1px solid #c0c4cc;
              &:hover {
                background: none;
                i {
                  color: #c0c4cc;
                }
              }
            }
          }
        }
      }
    }
    .schema-mini-wrapper {
      button {
        width: 100%;
        .fa-bars {
          font-size: 16px;
        }
      }
    }
    section {
      padding: 0 0.7em;
    }
    .file-info {
      padding: 0.7em 0.5em 0.7em 0.85em;
      border-top: 1px solid #ccc;
      .file-id {
        margin: 5px 0;
      }
      .file-path {
        display: flex;
        > span {
          min-width: 51px;
        }
        .bread-crumb {
          flex: 1;
          align-items: baseline;
          margin: 1px 0 0 0;
        }
      }
    }
  }
  .schema-viewer {
    position: relative;
    padding: 0 0 0 5px;
  }
  &.schema-viewer-show {
    width: 20% !important;
    overflow: auto;
    .schema-viewer {
      opacity: 1;
      .el-tree {
        ::v-deep .el-tree-node__children {
          overflow: auto;
        }
      }
    }
  }
  &.schema-viewer-hide {
    overflow: hidden;
    width: $miniSchemaViewerWidth !important;

    .schema-viewer {
      opacity: 0;
    }
  }
}
</style>
<style lang="scss">
.load-next-message-tips {
  top: 50px;
}
</style>
