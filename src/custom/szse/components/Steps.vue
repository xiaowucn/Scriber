<template>
  <div class="steps-container">
    <slot></slot>
    <el-row>
      <el-col :span="24">
        <h4>温馨提示</h4>
        <p class="text primary-text">
          IPO辅助填报工具主要为您提供IPO招股说明书关键信息提取，该工具可以上传IPO说明书提取出关键信息，并支持信息抽取结果的可视化校核，以方便您整理填报文件。
        </p>
        <p class="text">
          注：文件抽取填报工具由AI模型抽取出结果，不代表该信息的最终结果，请务必进行人工确认，以确保信息准确性。由于抽取结果较为耗时（一般为20分钟），如需使用此工具，请提前上传文件，避免影响正常业务填报。
        </p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h4>IPO辅助填报工具使用步骤</h4>
        <el-row :gutter="20" class="steps">
          <el-col :span="6">
            <img src="../assets/step-1.png" alt="" />
            <p>上传文件</p>
          </el-col>
          <el-col :span="6">
            <img src="../assets/step-2.png" alt="" />
            <p>等待处理</p>
          </el-col>
          <el-col :span="6">
            <img src="../assets/step-3.png" alt="" />
            <p>人工复核</p>
          </el-col>
          <el-col :span="6">
            <img src="../assets/step-4.png" alt="" />
            <p>文件导出</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'szse-steps',
};
</script>

<style lang="scss" scoped>
@import '../styles/szse-ipo.common.scss';

.steps-container {
  h4 {
    position: relative;
    margin: 20px 0;
    padding-left: 20px;
    &::before {
      content: '';
      position: absolute;
      top: 7px;
      left: 0;
      display: inline-block;
      width: 8px;
      height: 8px;
      background: $primary-color;
      transform: rotate(45deg);
    }
  }
  .text {
    margin: 20px 0;
    padding-left: 20px;
    color: #7e7e7e;
    line-height: 26px;
    &.primary-text {
      font-weight: 500;
      color: #333;
    }
  }
  .steps {
    .el-col {
      position: relative;
      text-align: center;
      color: #666;
      img {
        width: 100%;
      }
      p {
        font-size: 14px;
      }
      &:not(:last-child) {
        &::after {
          content: '';
          position: absolute;
          top: 42%;
          right: -13px;
          display: block;
          width: 30px;
          height: 20px;
          background: url(../assets/step-arrow.svg) no-repeat;
          background-size: 100%;
        }
      }
    }
  }
}
</style>
