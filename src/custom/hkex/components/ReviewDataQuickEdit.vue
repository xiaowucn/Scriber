<template>
  <div class="review-data-quick-edit">
    <div class="operation-icons">
      <el-popover placement="top" trigger="hover" :append-to-body="false">
        <div>
          <ul class="copy-options">
            <li
              v-for="(item, index) in copyOptions"
              :key="index"
              @click="copyAnswer(item.label)">
              <el-tooltip
                effect="dark"
                :content="item.description"
                placement="left"
                popper-class="review-data-quick-edit-popover">
                <div>
                  <em
                    :class="[
                      'from',
                      { ai: item.from === 'AI', m: item.from === 'M' },
                    ]">
                    {{ item.from }}
                  </em>
                  <i class="el-icon-right arrow"></i>
                  <em class="to">{{ item.to }}</em>
                  <span class="label">{{ item.label }}</span>
                </div>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <i slot="reference" class="icon-sync"></i>
      </el-popover>
      <el-tooltip effect="dark" content="Delete All at Once" placement="top">
        <i class="icon-remove" @click="deleteAllAnswers"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'review-data-quick-edit',
  props: {},
  data() {
    return {
      copyOptions: [
        {
          from: 'AI',
          to: 'M',
          label: 'ALL',
          description:
            'Automatically synchronize the "Compliance Assessment", all attribute "Disclosure Location", and "AI Tagged Information" data from the AI Suggestion area to the Manual Adjustment.',
        },
        {
          from: 'AI',
          to: 'M',
          label: 'CURRENT',
          description:
            'Sync current attribute data, including Disclosure Location and AI Tagged Information, to Manual Adjustment automatically.',
        },
        {
          from: 'M',
          to: 'M',
          label: 'OTHERS',
          description:
            "Sync current attribute's Manual Adjustment data, including Disclosure Location and Manual Tagged Information, to all other attributes.",
        },
      ],
    };
  },
  created() {},
  methods: {
    copyAnswer(type) {
      this.$emit('copy-answer', type);
    },
    deleteAllAnswers() {
      this.$emit('delete-all-answers');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';

.review-data-quick-edit {
  .operation-icons {
    display: flex;
    i {
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 5px;
      background-size: 100% 100%;
      cursor: pointer;
      &.icon-sync {
        background-image: url(../common/images/icon-ratio-ai.svg);
      }
      &.icon-remove {
        background-image: url(../common/images/icon-ratio-remove.svg);
      }
    }
    .copy-options {
      padding: 0;
      font-size: 12px;
      li {
        margin: 5px 0;
        padding: 5px;
        list-style: none;
        cursor: pointer;
        background-color: #f3f3f3;
        &:hover {
          background-color: #e6e6e6;
        }
        &:not(:last-child) {
          .el-tooltip {
            .arrow {
              color: $--color-blue;
            }
          }
        }
        .el-tooltip {
          display: flex;
          align-items: center;
          em {
            width: 16px;
            height: 16px;
            line-height: 16px;
            font-style: normal;
            text-align: center;
            color: #fff;
            &.from {
              margin-right: 10px;
              background-color: $--color-blue;
              &.m {
                background-color: $--color-primary;
              }
            }
            &.to {
              background-color: $--color-primary;
            }
          }
          .arrow {
            width: 16px;
            height: 16px;
            line-height: inherit;
            font-weight: bold;
            color: $--color-primary;
          }
          .label {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.review-data-quick-edit-popover {
  max-width: 300px;
  line-height: 20px;
}
</style>
