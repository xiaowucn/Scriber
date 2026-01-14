<template>
  <el-dialog visible :before-close="close" :close-on-click-modal="false">
    <span slot="title">
      {{
        currentEditId ? $t(`message['编辑推送']`) : $t(`message['新增推送']`)
      }}
    </span>
    <el-form
      ref="form"
      :rules="rules"
      :model="datPushConfig"
      label-width="80px">
      <el-form-item
        class="mold-select-wrapper"
        :label="$t(`message['模板名称']`)"
        prop="template">
        <el-select
          :placeholder="$t(`message['请选择参数模板']`)"
          v-model="datPushConfig.template"
          :loading="templateLoading"
          filterable>
          <el-option
            v-for="item in templates"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t(`message['系统名称']`)" prop="system">
        <el-input
          v-model="datPushConfig.system"
          :placeholder="$t(`message['请输入系统名称']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['功能名称']`)" prop="function">
        <el-input
          v-model="datPushConfig.function"
          :placeholder="$t(`message['请输入功能名称']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['邮件地址']`)" prop="email">
        <el-input
          v-model="datPushConfig.email"
          :placeholder="$t(`message['请输入邮件地址']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['回调地址']`)" prop="push_address">
        <el-input
          v-model="datPushConfig.push_address"
          :placeholder="$t(`message['请输入回调地址']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['自动推送']`)" prop="auto_push">
        <el-switch v-model="datPushConfig.enabled"> </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close">
        {{ $t(`message['取消']`) }}
      </el-button>
      <el-button type="primary" :loading="submitting" @click="submitPushConfig">
        {{ $t(`message['确定']`) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { createPushConfig, editPushConfig } from '@/store/api/citics-tg.api';
export default {
  name: 'create-data-push-dialog',
  data() {
    return {
      datPushConfig: {
        template: '',
        system: '',
        function: '',
        email: '',
        push_address: '',
        enabled: false,
      },
      rules: {
        template: [
          {
            required: true,
            message: this.$t(`message['请选择参数模板']`),
            trigger: 'change',
          },
        ],
        system: [
          {
            required: true,
            message: this.$t(`message['请输入系统名称']`),
            trigger: 'blur',
          },
        ],
        function: [
          {
            required: true,
            message: this.$t(`message['请输入功能名称']`),
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: this.$t(`message['请输入邮件地址']`),
            trigger: 'blur',
          },
          {
            type: 'email',
            message: this.$t(`message['请输入正确的邮件地址']`),
            trigger: ['blur', 'change'],
          },
        ],
        push_address: [
          {
            required: true,
            message: this.$t(`message['请输入回调地址']`),
            trigger: 'blur',
          },
        ],
      },
      submitting: false,
      templateLoading: false,
      currentEditId: null,
    };
  },
  props: {
    currentEditItem: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('citicsTgModule', ['templates']),
  },
  mounted() {
    this.fetchAllTemplates();
    if (this.currentEditItem) {
      for (let key in this.datPushConfig) {
        this.datPushConfig[key] = this.currentEditItem[key];
      }
      this.datPushConfig.template = this.currentEditItem.template_id;
      this.currentEditId = this.currentEditItem.id;
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async fetchAllTemplates() {
      try {
        this.templateLoading = true;
        await this.$store.dispatch('citicsTgModule/fetchAllTemplates');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.templateLoading = false;
      }
    },
    submitPushConfig() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handleSavePushConfig();
        } else {
          return false;
        }
      });
    },
    async handleSavePushConfig() {
      try {
        this.submitting = true;
        const data = {
          ...this.datPushConfig,
          uid: this.loginUser.id,
        };
        if (this.currentEditId) {
          await editPushConfig(this.currentEditId, data);
        } else {
          await createPushConfig(data);
        }
        this.$notify({
          title: '成功',
          message: `${this.currentEditId ? '修改' : '新增'}推送成功`,
          type: 'success',
        });
        this.close();
        this.$emit('fetchList');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
