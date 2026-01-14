<template>
  <div class="all-quiry">
    <div class="all-quiry-header">
      <div>
        <i class="go-back el-icon-back" @click="closeQuiry"></i>
        <span class="title">全部问询函（{{ quiryDetails.length }}）</span>
      </div>
      <div>
        <el-button type="primary" size="mini">预览</el-button>
        <a
          download
          :href="exportLink"
          class="export-quiry el-button el-button--primary el-button--mini"
          >导出</a
        >
      </div>
    </div>
    <div class="all-quiry-details">
      <div
        v-for="(item, index) in quiryDetails"
        :key="index"
        class="quiry-item">
        <div class="list-item origin-content">
          <span>原文:</span>
          <p>
            {{ item.content }}
            <el-button
              type="text"
              class="edit-quiry-trigger"
              @click="editQuiry(item)"
              >修改 >></el-button
            >
          </p>
        </div>
        <div
          v-for="(question, index) in item.questions"
          :key="question.id"
          class="list-item quiry-content">
          <span>问题{{ index + 1 }}:</span>
          <p>{{ question.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  fetchProjectAllQuiry,
  getExportAllQuiry,
} from '@/store/api/szse-annual.api';
export default {
  name: 'szse-annual-report-all-quiry',
  props: {
    projectID: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      quiryDetails: [],
    };
  },
  computed: {
    exportLink() {
      return getExportAllQuiry(this.projectID);
    },
  },
  async created() {
    await this.getAllQuiry();
  },
  methods: {
    async getAllQuiry() {
      try {
        const { data } = await fetchProjectAllQuiry(this.projectID);
        this.quiryDetails = data;
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    editQuiry(auditItem) {
      if (auditItem.from_sub_item) {
        this.$emit('check-sub-quiry', {
          id: auditItem.sub_result_id,
          parentId: auditItem.id,
        });
      } else {
        this.$emit('check-quiry', auditItem.id);
      }
    },
    closeQuiry() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.all-quiry {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}

.all-quiry-header {
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

  .export-quiry {
    text-decoration: none;
  }
}

.all-quiry-details {
  flex: 1;
  display: flex;
  flex-flow: column;
  row-gap: 10px;
  margin: 10px 0 10px 10px;
  padding-right: 10px;
  overflow: auto;
}

.quiry-item {
  display: flex;
  flex-flow: column;
  row-gap: 10px;
  padding: 10px 20px;
  background: white;

  .list-item {
    display: flex;
    flex-flow: row;
    align-items: flex-start;
    column-gap: 15px;
    padding: 16px 12px;

    p {
      flex: 1;
    }

    span {
      white-space: nowrap;
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

  .edit-quiry-trigger {
    float: right;
  }
}
</style>
