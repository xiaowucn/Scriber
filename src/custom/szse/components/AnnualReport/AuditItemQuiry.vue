<template>
  <div class="audit-item-quiry">
    <div class="audit-item-quiry-header">
      <div>
        <i class="go-back el-icon-back" @click="closeQuiry"></i>
        <span class="title">问询函</span>
      </div>
      <div>
        <el-button type="primary" size="mini" @click="openAllQuiry"
          >全部问询函</el-button
        >
        <el-button type="primary" size="mini" @click="submitQuiry"
          >提交</el-button
        >
      </div>
    </div>
    <div class="audit-item-quiry-details">
      <p class="chapter-title">{{ auditItem.chapter_title }}</p>
      <div class="quiry-details-list">
        <div class="list-item origin-content">
          <span>原文:</span>
          <p>{{ auditItem.content }}</p>
        </div>
        <div
          v-for="(item, index) in quiryDetails"
          :key="item.id"
          class="list-item quiry-content">
          <span>问题{{ index + 1 }}:</span>
          <el-input
            v-if="quiryEdited && quiryEdited.id === item.id"
            ref="quiryEdited"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="quiryEdited.content"
            class="edit-input"></el-input>
          <p v-else>{{ item.content }}</p>
          <div class="quiry-operation">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteQuiry(item.id)"></el-button
            ><el-button
              v-if="quiryEdited && quiryEdited.id === item.id"
              type="primary"
              icon="el-icon-check"
              size="mini"
              @click="updateQuiry"></el-button>
            <el-button
              v-else
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editQuiry(item)"></el-button>
          </div>
        </div>
        <button class="create-quiry-trigger" @click="createQuiry">
          <i class="el-icon-question"></i>
          <span>添加问题</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  fetchProjectAuditItemQuiry,
  createProjectAuditItemQuiry,
  updateProjectAuditItemQuiry,
  deleteProjectAuditItemQuiry,
} from '@/store/api/szse-annual.api';

export default {
  name: 'szse-annual-report-audit-item-quiry',
  props: {
    auditItem: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      quiryDetails: [],
      quiryEdited: null,
    };
  },
  async created() {
    await this.getAuditItemQuiry();
  },
  methods: {
    async getAuditItemQuiry() {
      try {
        const { data } = await fetchProjectAuditItemQuiry(this.auditItem.id);
        this.quiryDetails = data;
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async createQuiry() {
      try {
        const { data } = await createProjectAuditItemQuiry(this.auditItem.id, {
          content: '',
        });
        await this.getAuditItemQuiry();

        const quiry = this.quiryDetails.find((item) => item.id === data.id);
        this.editQuiry(quiry);
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async editQuiry(quiry) {
      this.quiryEdited = quiry;

      await this.$nextTick();
      this.$refs.quiryEdited[0].focus();
    },
    async updateQuiry() {
      try {
        await updateProjectAuditItemQuiry(this.quiryEdited.id, {
          content: this.quiryEdited.content,
        });
        await this.getAuditItemQuiry();
        this.quiryEdited = null;
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteQuiry(id) {
      await this.$confirm(`确认删除该问题？`);

      try {
        await deleteProjectAuditItemQuiry(id);
        await this.getAuditItemQuiry();

        if (this.quiryEdited && this.quiryEdited.id === id) {
          this.quiryEdited = null;
        }
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async submitQuiry() {
      if (this.quiryEdited) {
        await this.updateQuiry();
      }

      this.closeQuiry();
    },
    async closeQuiry() {
      if (this.quiryEdited) {
        this.$alert('编辑问题尚未保存');
        return;
      }

      this.$emit('close');
    },
    openAllQuiry() {
      this.$emit('open-all-quiry');
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.audit-item-quiry {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}

.audit-item-quiry-header {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 20px;
  width: 100%;
  background: white;

  .go-back {
    cursor: pointer;
  }

  .title {
    display: inline-block;
    margin-left: 10px;
    font-weight: 600;
  }
}

.audit-item-quiry-details {
  flex: 1;
  overflow: auto;
  margin: 10px 0 10px 10px;
  padding: 10px 20px;
  background: white;

  .chapter-title {
    margin: 0;
    padding: 10px 0 20px 0;
    border-bottom: 1px solid #e9e9e9;
  }
}

.quiry-details-list {
  display: flex;
  flex-flow: column;
  justify-content: center;
  row-gap: 10px;
  margin-top: 20px;
}

.list-item {
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  column-gap: 15px;
  padding: 16px 12px;

  p,
  .edit-input {
    flex: 1;
  }

  span {
    white-space: nowrap;
  }

  .quiry-operation {
    width: 30px;
    text-align: center;

    & > button {
      display: block;
      margin: 0;
      padding: 5px;

      &:not(:first-of-type) {
        margin-top: 10px;
      }
    }
  }
}

.origin-content {
  background: #f6f6f6;
}

.quiry-content {
  background: #f7fafe;

  p {
    color: #4b7dd0;
  }
}

.create-quiry-trigger {
  margin-top: 20px;
  border: none;
  outline: none;
  background: white;
  text-align: center;
  color: #418bed;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  i {
    font-size: 24px;
  }

  i,
  span {
    display: block;
  }
}
</style>
