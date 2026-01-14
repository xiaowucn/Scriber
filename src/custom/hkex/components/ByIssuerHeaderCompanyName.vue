<template>
  <div class="by-issuer-company-name">
    <span class="label">Company Name:</span>
    <span v-if="issuerHeader.length <= 1" class="name">
      <el-tag
        v-if="currentIssuerHeader.delist === true"
        type="info"
        size="mini"
        effect="dark">
        Delisted
      </el-tag>
      <el-tag
        v-if="currentIssuerHeader.delist === false"
        size="mini"
        effect="dark">
        Current
      </el-tag>
      {{ currentIssuerHeader.company_name }}
    </span>
    <el-select
      v-else
      v-model="companyName"
      size="mini"
      popper-class="issuer-header-company-select-dropdown"
      placeholder="Please select company name"
      @change="changeCompanyName">
      <template slot="prefix">
        <el-tag
          v-if="currentIssuerHeader.delist === true"
          type="info"
          size="mini"
          effect="dark">
          Delisted
        </el-tag>
        <el-tag
          v-if="currentIssuerHeader.delist === false"
          size="mini"
          effect="dark">
          Current
        </el-tag>
      </template>
      <el-option
        v-for="(item, index) in issuerHeader"
        :key="index"
        :label="item.company_name"
        :value="item.company_name">
        <el-tag
          v-if="item.delist === true"
          type="info"
          size="mini"
          effect="dark"
          >Delisted</el-tag
        >
        <el-tag v-if="item.delist === false" size="mini" effect="dark"
          >Current</el-tag
        >
        <span>{{ item.company_name }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'by-issuer-header-company-name',
  props: {
    issuerHeader: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      companyName: '',
    };
  },
  computed: {
    currentIssuerHeader() {
      if (!_.isEmpty(this.issuerHeader)) {
        return (
          this.issuerHeader.find((i) => i.company_name === this.companyName) ||
          {}
        );
      }
      return {};
    },
  },
  watch: {
    issuerHeader() {
      this.setDefaultCompanyName();
    },
  },
  created() {},
  methods: {
    setDefaultCompanyName() {
      this.companyName =
        this.issuerHeader.length > 0 ? this.issuerHeader[0].company_name : '';
    },
    changeCompanyName(name) {
      this.$emit('change-company-name', name);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';

.by-issuer-company-name {
  display: flex;
  align-items: center;
  margin: 0 30px 10px 0;
  font-size: 15px;
  .label {
    margin-right: 10px;
    color: rgba($--color-white, 0.8);
  }
  .name {
    font-size: 14px;
    color: $--color-white;
    .el-tag {
      vertical-align: 1px;
    }
  }
  .el-select {
    flex: 1;
    ::v-deep .el-input {
      .el-input__inner {
        &:has(+ .el-input__prefix) {
          padding-left: 70px;
        }
      }
      .el-input__prefix {
        display: flex;
        align-items: center;
        .el-tag {
          height: 16px;
          line-height: 15px;
          background-color: $--color-blue;
          &.el-tag--info {
            background-color: $--color-grey;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.issuer-header-company-select-dropdown {
  .el-tag {
    height: 16px;
    line-height: 15px;
    vertical-align: 1px;
  }
}
</style>
