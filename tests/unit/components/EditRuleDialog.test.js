#!/usr/bin/env node

// Node.js 单文件测试 - EditRuleDialog getOriginalVerificationType 方法
// 运行方式: node EditRuleDialog.test.js

const path = require('path');
const fs = require('fs');

// 简单的断言函数
function assert(condition, message) {
  if (!condition) {
    throw new Error(`断言失败: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`断言失败: ${message}\n期望: ${expected}\n实际: ${actual}`);
  }
}

// 模拟Vue组件的getOriginalVerificationType方法
class MockEditRuleDialog {
  constructor() {
    this.originalData = null;
  }

  getOriginalVerificationType() {
    if (!this.originalData) {
      return '';
    }

    if (this.originalData.check_method !== null) {
      return `非一致性检查\n${this.originalData.check_method}`;
    }

    let result = '一致性检查';

    if (!this.originalData.templates || !this.originalData.templates.groups) {
      return result;
    }

    const groups = this.originalData.templates.groups;
    
    // 分别处理法规组和范文组
    const faguiGroups = groups.filter(group => group.label === '法规');
    const fanwenGroups = groups.filter(group => group.label === '范文');

    // 处理法规组
    faguiGroups.forEach((group, groupIndex) => {
      const validContents = group.contents.filter(item => item.content && item.content.trim());
      
      if (validContents.length === 1) {
        // 单条内容，只显示大序号
        result += `\n法规${groupIndex + 1}：${validContents[0].content}`;
      } else if (validContents.length > 1) {
        // 多条内容，显示层级序号
        validContents.forEach((item, itemIndex) => {
          result += `\n法规${groupIndex + 1}-${itemIndex + 1}：${item.content}`;
        });
      }
    });

    // 处理范文组
    fanwenGroups.forEach((group, groupIndex) => {
      const validContents = group.contents.filter(item => item.content && item.content.trim());
      
      if (validContents.length === 1) {
        // 单条内容，只显示大序号
        result += `\n范文${groupIndex + 1}：${validContents[0].content}`;
      } else if (validContents.length > 1) {
        // 多条内容，显示层级序号
        validContents.forEach((item, itemIndex) => {
          result += `\n范文${groupIndex + 1}-${itemIndex + 1}：${item.content}`;
        });
      }
    });

    return result;
  }
}

// 测试用例
function runTests() {
  console.log('开始运行 EditRuleDialog getOriginalVerificationType 测试...');
  let passedTests = 0;
  let totalTests = 0;

  function test(description, testFn) {
    totalTests++;
    try {
      testFn();
      console.log(`✅ ${description}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${description}`);
      console.log(`   错误: ${error.message}`);
    }
  }

  // 测试1: 返回空字符串当originalData为空时
  test('应该返回空字符串当originalData为空时', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = null;
    assertEqual(vm.getOriginalVerificationType(), '', '空数据应返回空字符串');
  });

  // 测试2: 返回非一致性检查信息当check_method不为null时
  test('应该返回非一致性检查信息当check_method不为null时', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: '自定义验证方法'
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '非一致性检查\n自定义验证方法', '非一致性检查格式错误');
  });

  // 测试3: 返回一致性检查当check_method为null且无templates时
  test('应该返回一致性检查当check_method为null且无templates时', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查', '基础一致性检查格式错误');
  });

  // 测试4: 正确处理单个法规组单条内容
  test('应该正确处理单个法规组单条内容（只显示大序号）', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '法规',
            contents: [
              { content: '第一条法规内容' }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查\n法规1：第一条法规内容', '单个法规组单条内容格式错误');
  });

  // 测试5: 正确处理单个法规组多条内容
  test('应该正确处理单个法规组多条内容（显示层级序号）', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '法规',
            contents: [
              { content: '第一条法规内容' },
              { content: '第二条法规内容' }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查\n法规1-1：第一条法规内容\n法规1-2：第二条法规内容', '单个法规组多条内容格式错误');
  });

  // 测试6: 正确处理多个法规组
  test('应该正确处理多个法规组（混合单条和多条内容）', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '法规',
            contents: [
              { content: '第一组唯一内容' }
            ]
          },
          {
            label: '法规',
            contents: [
              { content: '第二组第一条内容' },
              { content: '第二组第二条内容' }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查\n法规1：第一组唯一内容\n法规2-1：第二组第一条内容\n法规2-2：第二组第二条内容', '多个法规组格式错误');
  });

  // 测试7: 正确处理单个范文组单条内容
  test('应该正确处理单个范文组单条内容（只显示大序号）', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '范文',
            contents: [
              { content: '第一条范文内容' }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查\n范文1：第一条范文内容', '单个范文组单条内容格式错误');
  });

  // 测试8: 正确处理单个范文组多条内容
  test('应该正确处理单个范文组多条内容（显示层级序号）', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '范文',
            contents: [
              { content: '第一条范文内容' },
              { content: '第二条范文内容' }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查\n范文1-1：第一条范文内容\n范文1-2：第二条范文内容', '单个范文组多条内容格式错误');
  });

  // 测试9: 正确处理法规和范文混合
  test('应该正确处理法规和范文混合（法规在前，范文在后）', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '范文',
            contents: [
              { content: '范文内容1' },
              { content: '范文内容2' }
            ]
          },
          {
            label: '法规',
            contents: [
              { content: '法规内容1' }
            ]
          },
          {
            label: '法规',
            contents: [
              { content: '法规内容2' },
              { content: '法规内容3' }
            ]
          },
          {
            label: '范文',
            contents: [
              { content: '范文内容3' }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    const expected = '一致性检查\n' +
      '法规1：法规内容1\n' +
      '法规2-1：法规内容2\n' +
      '法规2-2：法规内容3\n' +
      '范文1-1：范文内容1\n' +
      '范文1-2：范文内容2\n' +
      '范文2：范文内容3';
    assertEqual(result, expected, '法规和范文混合格式错误');
  });

  // 测试10: 过滤掉空内容
  test('应该过滤掉空内容', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '法规',
            contents: [
              { content: '' },
              { content: '有效内容1' },
              { content: null },
              { content: '有效内容2' },
              { content: undefined }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查\n法规1-1：有效内容1\n法规1-2：有效内容2', '空内容过滤错误');
  });

  // 测试11: 处理空的groups数组
  test('应该处理空的groups数组', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: []
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查', '空groups数组处理错误');
  });

  // 测试12: 处理没有有效内容的groups
  test('应该处理没有有效内容的groups', () => {
    const vm = new MockEditRuleDialog();
    vm.originalData = {
      check_method: null,
      templates: {
        groups: [
          {
            label: '法规',
            contents: [
              { content: '' },
              { content: null },
              { content: undefined }
            ]
          }
        ]
      }
    };
    const result = vm.getOriginalVerificationType();
    assertEqual(result, '一致性检查', '无有效内容groups处理错误');
  });

  console.log('\n=== 测试结果 ===');
  console.log(`总测试数: ${totalTests}`);
  console.log(`通过测试: ${passedTests}`);
  console.log(`失败测试: ${totalTests - passedTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.log('\n❌ 部分测试失败！');
    process.exit(1);
  }
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runTests();
}

module.exports = { MockEditRuleDialog, runTests };