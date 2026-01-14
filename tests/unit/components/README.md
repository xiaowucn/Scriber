# FullTestModelRules 测试文档

## 概述

本目录包含了 `FullTestModelRules.vue` 组件的测试文件，主要测试 templates 字段的比较逻辑。

## 测试文件

### FullTestModelRules.test.js

这是使用 Jest 和 Vue Test Utils 编写的单元测试文件，测试组件中的 templates 比较方法。

#### 测试覆盖的方法：

1. **isTemplatesEqual** - 主要的 templates 比较方法
2. **compareGroupsByMatching** - 通过匹配方式比较 groups 数组
3. **isGroupEqual** - 比较两个 group 是否相等
4. **sortContents** - 对 contents 进行排序

#### 测试用例：

- ✅ null 和 undefined 情况处理
- ✅ 没有 groups 字段的情况
- ✅ groups 数组长度比较
- ✅ 相同 templates（顺序相同）
- ✅ 相同 templates（顺序不同）
- ✅ 不同 templates（label 不同）
- ✅ 不同 templates（content 不同）
- ✅ 重复 label 的处理
- ✅ chapters 数组排序处理

## 运行测试

### 方法一：使用 Jest（推荐）

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test FullTestModelRules.test.js

# 运行测试并显示覆盖率
npm test -- --coverage
```

### 方法二：使用独立测试脚本

项目根目录下的 `test-templates-comparison.js` 是一个独立的测试脚本，可以直接运行：

```bash
node test-templates-comparison.js
```

这个脚本的优势：
- 不依赖 Jest 环境
- 可以快速验证比较逻辑
- 输出清晰的测试结果

## 测试数据结构

### Templates 数据结构示例：

```javascript
{
  groups: [
    {
      label: "范文",
      contents: [
        {
          chapters: ["章节1", "章节2"],
          diff_context: false,
          content: "具体内容文本"
        }
      ]
    },
    {
      label: "法规",
      contents: [
        {
          chapters: [],
          diff_context: false,
          content: "法规内容文本"
        }
      ]
    }
  ]
}
```

## 比较算法说明

### 核心特性：

1. **排序无关性**：相同内容但不同顺序的数组被认为是相等的
2. **label 重复处理**：正确处理多个相同 label 的 groups
3. **深度比较**：递归比较嵌套的对象和数组
4. **null 安全**：正确处理 null 和 undefined 值

### 算法流程：

1. 检查 null/undefined 情况
2. 检查 groups 字段存在性
3. 比较 groups 数组长度
4. 使用匹配算法找到对应的 groups
5. 对每个 group 进行深度比较
6. 对 contents 和 chapters 进行排序后比较

## 性能考虑

- 时间复杂度：O(n²) 其中 n 是 groups 的数量
- 空间复杂度：O(n) 用于存储已匹配的索引
- 对于大多数实际使用场景，性能表现良好

## 维护说明

当修改 templates 比较逻辑时，请确保：

1. 运行所有测试确保没有回归
2. 添加新的测试用例覆盖新功能
3. 更新文档说明变更内容
4. 考虑性能影响

## 故障排除

### 常见问题：

1. **测试失败**：检查数据结构是否符合预期格式
2. **性能问题**：考虑优化比较算法或减少数据量
3. **边界情况**：确保处理所有可能的 null/undefined 情况

### 调试技巧：

1. 使用 `console.log` 输出中间结果
2. 检查数据结构的完整性
3. 验证排序逻辑是否正确
4. 确认匹配算法的逻辑
