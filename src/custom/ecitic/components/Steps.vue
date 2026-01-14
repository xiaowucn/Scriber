<template>
  <div class="steps-container">
    <slot></slot>
    <el-row>
      <el-col :span="24">
        <h4>系统使用方法</h4>
        <el-row :gutter="20" class="steps">
          <el-col :span="6" v-for="(step, index) in steps" :key="index">
            <img :src="step.image" alt="" />
            <p>{{ step.title }}</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pocSystemStepsImage1 from '../assets/poc/step-1.png';
import pocSystemStepsImage2 from '../assets/poc/step-2.png';
import pocSystemStepsImage3 from '../assets/poc/step-3.png';
import pocSystemStepsImage4 from '../assets/poc/step-4.png';

import sharesSystemStepsImage1 from '../assets/shares/step-1.png';
import sharesSystemStepsImage2 from '../assets/shares/step-2.png';
import sharesSystemStepsImage3 from '../assets/shares/step-3.png';
import sharesSystemStepsImage4 from '../assets/shares/step-4.png';

export default {
  name: 'ecitic-steps',
  props: {
    system: {
      type: String,
      default: 'poc',
    },
  },
  data() {
    return {
      systemSteps: {
        poc: [
          {
            image: pocSystemStepsImage1,
            title: '上传文件',
          },
          {
            image: pocSystemStepsImage2,
            title: '等待处理',
          },
          {
            image: pocSystemStepsImage3,
            title: '人工复核',
          },
          {
            image: pocSystemStepsImage4,
            title: '文件导出',
          },
        ],
        shares: [
          {
            image: sharesSystemStepsImage1,
            title: '上传文件',
          },
          {
            image: sharesSystemStepsImage2,
            title: '等待处理',
          },
          {
            image: sharesSystemStepsImage3,
            title: '人工复核',
          },
          {
            image: sharesSystemStepsImage4,
            title: '文件导出',
          },
        ],
      },
    };
  },
  computed: {
    steps() {
      return this.systemSteps[this.system];
    },
  },
};
</script>

<style lang="scss" scoped>
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
      background: #2b70cf;
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
