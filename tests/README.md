# Scriber 项目测试目录

## 目录结构

```
tests/
├── README.md                           # 测试目录总体说明
├── unit/                              # 单元测试
│   ├── test-templates-comparison.js   # Templates比较方法独立测试脚本
│   └── components/                    # 组件单元测试
│       ├── FullTestModelRules.test.js # FullTestModelRules组件测试
│       └── README.md                  # 组件测试说明文档
├── integration/                       # 集成测试（待添加）
└── e2e/                              # 端到端测试（待添加）
```

## 测试类型说明

### 单元测试 (Unit Tests)
- **位置**: `tests/unit/`
- **目的**: 测试单个函数、方法或组件的功能
- **工具**: Jest, Vue Test Utils
- **运行**: `npm test`

### 集成测试 (Integration Tests)
- **位置**: `tests/integration/`
- **目的**: 测试多个模块之间的交互
- **状态**: 待添加

### 端到端测试 (E2E Tests)
- **位置**: `tests/e2e/`
- **目的**: 测试完整的用户流程
- **状态**: 待添加

## 当前测试覆盖

### ✅ FullTestModelRules 组件
- **文件**: `tests/unit/components/FullTestModelRules.test.js`
- **覆盖**: Templates字段比较逻辑
- **测试用例**: 8个
- **状态**: 全部通过

### ✅ Templates比较算法
- **文件**: `tests/unit/test-templates-comparison.js`
- **类型**: 独立测试脚本
- **覆盖**: 核心比较算法
- **状态**: 全部通过

## 运行测试

### 运行所有测试
```bash
npm test
```

### 运行特定测试文件
```bash
# Jest测试
npm test FullTestModelRules.test.js

# 独立脚本测试
node tests/unit/test-templates-comparison.js
```

### 运行测试并查看覆盖率
```bash
npm test -- --coverage
```

## 测试规范

### 文件命名
- 单元测试: `*.test.js`
- 集成测试: `*.integration.test.js`
- E2E测试: `*.e2e.test.js`

### 测试结构
```javascript
describe('组件/模块名称', () => {
  describe('方法名称', () => {
    test('应该做什么', () => {
      // 测试代码
    });
  });
});
```

### 测试原则
1. **单一职责**: 每个测试只验证一个功能点
2. **独立性**: 测试之间不应相互依赖
3. **可读性**: 测试名称应清晰描述测试内容
4. **覆盖性**: 包括正常情况、边界情况和异常情况

## 添加新测试

### 1. 组件测试
```bash
# 在 tests/unit/components/ 目录下创建
touch tests/unit/components/YourComponent.test.js
```

### 2. 工具函数测试
```bash
# 在 tests/unit/ 目录下创建
touch tests/unit/your-utility.test.js
```

### 3. 集成测试
```bash
# 在 tests/integration/ 目录下创建
mkdir -p tests/integration
touch tests/integration/your-feature.integration.test.js
```

## 测试工具配置

### Jest 配置
项目使用 Jest 作为主要测试框架，配置文件位于 `jest.config.js`。

### Vue Test Utils
用于测试 Vue 组件，提供组件挂载和交互功能。

### 模拟 (Mocks)
- API 调用模拟
- 外部依赖模拟
- 浏览器 API 模拟

## 持续集成

### 本地开发
```bash
# 开发前运行测试
npm test

# 提交前运行测试
npm run test:ci
```

### CI/CD 流程
1. 代码提交触发测试
2. 所有测试必须通过
3. 生成测试覆盖率报告
4. 部署到测试环境

## 测试最佳实践

### ✅ 好的实践
- 测试名称清晰描述预期行为
- 使用 AAA 模式 (Arrange, Act, Assert)
- 测试边界情况和错误情况
- 保持测试简单和专注

### ❌ 避免的做法
- 测试实现细节而非行为
- 测试之间有依赖关系
- 过于复杂的测试设置
- 忽略异步操作的测试

## 故障排除

### 常见问题
1. **测试超时**: 检查异步操作是否正确处理
2. **模拟失效**: 确认模拟配置是否正确
3. **环境问题**: 检查测试环境配置

### 调试技巧
1. 使用 `console.log` 输出调试信息
2. 使用 `--verbose` 参数查看详细输出
3. 单独运行失败的测试进行调试

## 贡献指南

### 添加测试时请确保:
1. 遵循现有的测试结构和命名规范
2. 添加适当的文档说明
3. 确保新测试通过
4. 更新相关的 README 文档

### 代码审查检查点:
- [ ] 测试覆盖新功能
- [ ] 测试名称清晰
- [ ] 包含边界情况测试
- [ ] 文档已更新
