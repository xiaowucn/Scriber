<template>
  <div class="user-popup">
    <el-dialog
      visible
      :close-on-click-modal="false"
      :before-close="close"
      width="600px">
      <span slot="title">{{ mode }}</span>
      <el-form ref="form" :model="user" :rules="rules" label-width="140px">
        <el-form-item :label="$t(`message['用户名']`)" prop="name">
          <el-input
            v-model="user.name"
            ref="nameInput"
            :placeholder="$t(`message['请输入用户名']`)"
            :disabled="user.id === userRole.isAdmin"></el-input>
        </el-form-item>
        <el-form-item v-if="isEdit" :label="$t(`message['更新密码']`)">
          <el-switch v-model="needUpdatePassword"></el-switch>
        </el-form-item>
        <el-form-item
          v-if="showPasswordInput"
          :label="passwordLabel"
          prop="password">
          <el-input
            v-model="user.password"
            ref="passwordInput"
            :type="showPasswordPlaintext ? 'text' : 'password'"
            autocomplete="new-password"
            :placeholder="$t(`message['请输入密码']`)"
            @input="replaceInputValue('password')">
            <i
              slot="suffix"
              :class="[
                'fas',
                showPasswordPlaintext ? 'fa-eye-slash' : 'fa-eye',
              ]"
              @click="
                switchPasswordDisplayMode(
                  'passwordInput',
                  'showPasswordPlaintext',
                )
              "></i>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="showPasswordInput"
          :label="$t(`message['确认密码']`)"
          prop="passwordCheck">
          <el-input
            v-model="user.passwordCheck"
            ref="passwordCheckInput"
            :type="showPasswordCheckPlaintext ? 'text' : 'password'"
            :placeholder="$t(`message['请再次输入密码']`)"
            @input="replaceInputValue('passwordCheck')">
            <i
              slot="suffix"
              :class="[
                'fas',
                showPasswordCheckPlaintext ? 'fa-eye-slash' : 'fa-eye',
              ]"
              @click="
                switchPasswordDisplayMode(
                  'passwordCheckInput',
                  'showPasswordCheckPlaintext',
                )
              "></i>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t(`message['备注']`)" prop="note">
          <el-input
            v-model="user.note"
            :placeholder="$t(`message['请输入备注']`)"
            maxlength="50"></el-input>
        </el-form-item>
        <el-form-item :label="$t(`message['到期时间']`)">
          <el-date-picker
            v-model="user.expired_utc"
            value-format="timestamp"
            type="date"
            :placeholder="$t(`message['请选择日期']`)"></el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t(`message['权限']`)"
          class="user-select-wrapper"
          prop="permission">
          <el-select
            multiple
            :placeholder="$t(`message['请选择权限']`)"
            v-model="user.permission"
            :popper-append-to-body="false"
            class="permission-select">
            <el-option-group
              v-for="group in permOptions"
              :key="group.key"
              :label="group.label"
              :disabled="group.disabled">
              <el-option
                v-for="(perm, index) in group.options"
                :key="index"
                :label="perm.label"
                :value="perm.value"
                :disabled="perm.basic">
                <span>{{ perm.label }}</span>
                <el-tooltip
                  v-if="perm.desc"
                  placement="right"
                  popper-class="user-permission-tooltip"
                  :content="perm.desc">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">
          {{ $t(`message['取消']`) }}
        </el-button>
        <el-button type="primary" @click="persistUser" :disabled="disabled">
          {{ $t(`message['确定']`) }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { userRole, dayTime } from '@/store/constants';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';

export default {
  name: 'user-popup',
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: {},
      showPasswordPlaintext: false,
      showPasswordCheckPlaintext: false,
      disabled: false,
      rules: {
        name: [{ required: true, validator: this.validateName }],
        password: [{ required: true, validator: this.validatePassword }],
        passwordCheck: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: this.validatePasswordCheck, trigger: 'blur' },
        ],
        permission: [{ required: true, validator: this.validatePermission }],
      },
      userRole,
      needUpdatePassword: false,
    };
  },
  async created() {
    this.user = cloneDeep(this.current);

    if (!this.isEdit) {
      this.user.permission = this.userPermissions
        .filter((i) => i.basic)
        .map((i) => i.value);
    }

    await this.$nextTick();
    this.$refs.nameInput.focus();
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('userModule', ['users', 'userPermissions']),
    isEdit() {
      return this.current.id !== -1;
    },
    showPasswordInput() {
      if (this.isEdit) {
        return this.needUpdatePassword;
      }
      return true;
    },
    passwordLabel() {
      return this.isEdit
        ? this.$t(`message['新密码']`)
        : this.$t(`message['密码']`);
    },
    mode() {
      const mode = this.isEdit ? '修改用户' : '新增用户';
      return this.$t(`message['${mode}']`);
    },
    permOptions() {
      const basic = {
        key: 'basic',
        label: this.$t(`message['基础权限']`),
        disabled: true,
        options: [],
      };

      const others = {
        key: 'other',
        label: this.$t(`message['其他权限']`),
        disabled: false,
        options: [],
      };

      this.userPermissions.forEach((item) => {
        if (item.basic) {
          basic.options.push(item);
        } else {
          others.options.push(item);
        }
      });

      return [basic, others];
    },
  },
  methods: {
    validateName(rule, value, cb) {
      const name = this.user.name.trim();
      if (!name) {
        cb(new Error(this.$t(`message['用户名不能为空']`)));
        return;
      }
      const index = this.users.items.findIndex((e) => {
        return e.id !== this.user.id && e.name === name;
      });
      if (index !== -1) {
        cb(new Error(this.$t(`message['用户名不能重复']`)));
        return;
      }
      cb();
    },
    validatePassword(rule, value, cb) {
      const password = this.user.password.trim();
      const reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,128}/;
      if (this.showPasswordInput) {
        if (password === '') {
          cb(new Error(this.$t(`message['密码不能为空']`)));
          return;
        }
        if (!reg.test(password)) {
          cb(
            new Error(
              this.$t(
                `message['密码设置至少6位，由数字、英文字母、字符组合而成，不能包含空格']`,
              ),
            ),
          );
          return;
        }
      }
      cb();
    },
    validatePasswordCheck(rule, value, cb) {
      if (this.user.password && value !== this.user.password) {
        cb(new Error(this.$t(`message['两次输入密码不一致']`)));
      } else {
        cb();
      }
    },
    switchPasswordDisplayMode(inputRef, value) {
      this[value] = !this[value];
      this.$nextTick(() => {
        this.$refs[inputRef].focus();
      });
    },
    replaceInputValue(input) {
      this.user[input] = this.user[input].replace(/[\u4e00-\u9fa5]|[\s]/g, '');
    },
    validatePermission(rule, value, cb) {
      if (this.user.permission.length === 0) {
        cb(new Error(this.$t(`message['权限不能为空']`)));
        return;
      }
      cb();
    },
    close() {
      this.$emit('close');
    },
    async persistUser() {
      try {
        await this.$refs.form.validate();
      } catch (e) {
        return;
      } finally {
        this.user.name = this.user.name.trim();
        if (this.user.password) {
          this.user.password = this.user.password.trim();
        }
      }
      const userData = {
        id: this.user.id,
        name: this.user.name,
        note: this.user.note,
        expired_utc: this.user.expired_utc
          ? dayjs(this.user.expired_utc + dayTime * 1000).unix()
          : 0,
        permission: _.clone(this.user.permission),
      };
      if (this.user.password !== '') {
        // edit mode, only add password when not empty string
        userData.password = this.user.password;
      }
      this.$emit('persist-user', { userData });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-select-wrapper {
  .el-select {
    width: 100%;
    .el-select-dropdown__item {
      i {
        margin-left: 5px;
        color: #999;
      }
    }
  }
}
::v-deep .el-dialog {
  .el-dialog__body {
    padding: 30px 45px;
  }
  .el-form-item:last-child {
    margin-bottom: 0;
  }
  .el-input .fas {
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      color: #999;
    }
  }
  .el-date-editor {
    width: 100%;

    .el-icon-date {
      line-height: 52px;
      &::before {
        content: '';
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url('~@/assets/svg-icons/date.svg') center center no-repeat;
      }
    }
  }
}

::v-deep .permission-select {
  .el-select__tags .el-tag__close {
    display: none;
  }
}
</style>
