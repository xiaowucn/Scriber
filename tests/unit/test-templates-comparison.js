#!/usr/bin/env node

/**
 * Templates比较方法的独立测试脚本
 * 可以直接运行来验证比较逻辑的正确性
 */

const _ = require('lodash');

// 模拟FullTestModelRules组件中的比较方法
class TemplatesComparator {
  // 比较templates字段，排除排序干扰
  isTemplatesEqual(templates1, templates2) {
    // 如果两者都为null或undefined，认为相等
    if (!templates1 && !templates2) {
      return true;
    }

    // 如果一个为null另一个不为null，认为不相等
    if (!templates1 || !templates2) {
      return false;
    }

    // 如果都没有groups字段，认为相等
    if (!templates1.groups && !templates2.groups) {
      return true;
    }

    // 如果一个有groups另一个没有，认为不相等
    if (!templates1.groups || !templates2.groups) {
      return false;
    }

    // 比较groups数组长度
    if (templates1.groups.length !== templates2.groups.length) {
      return false;
    }

    // 使用查找匹配的方式比较groups，而不是依赖排序
    const isEqual = this.compareGroupsByMatching(
      templates1.groups,
      templates2.groups,
    );

    return isEqual;
  }

  // 通过查找匹配的方式比较groups，解决label重复导致的排序问题
  compareGroupsByMatching(groups1, groups2) {
    // 为每个group1找到在groups2中的匹配项
    const usedIndices = new Set();

    for (let i = 0; i < groups1.length; i++) {
      const group1 = groups1[i];
      let foundMatch = false;

      // 在groups2中查找匹配的group
      for (let j = 0; j < groups2.length; j++) {
        if (usedIndices.has(j)) continue; // 跳过已经匹配的项

        const group2 = groups2[j];
        const isMatch = this.isGroupEqual(group1, group2);

        if (isMatch) {
          usedIndices.add(j);
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        return false;
      }
    }

    // 检查是否所有group2都被匹配了
    return usedIndices.size === groups2.length;
  }

  // 比较两个group是否相等
  isGroupEqual(group1, group2) {
    // 比较label
    if (group1.label !== group2.label) {
      return false;
    }

    // 比较contents数组长度
    if (group1.contents?.length !== group2.contents?.length) {
      return false;
    }

    // 如果都没有contents，认为相等
    if (!group1.contents && !group2.contents) {
      return true;
    }

    // 对contents进行排序后比较
    const sortedContents1 = this.sortContents(group1.contents || []);
    const sortedContents2 = this.sortContents(group2.contents || []);

    return _.isEqual(sortedContents1, sortedContents2);
  }

  // 对contents进行排序
  sortContents(contents) {
    return contents
      .map((content) => ({
        ...content,
        chapters: content.chapters ? _.sortBy(content.chapters) : [],
      }))
      .sort((a, b) => {
        return (a.content || '').localeCompare(b.content || '');
      });
  }
}

// 测试用例
function runTests() {
  const comparator = new TemplatesComparator();
  let passedTests = 0;
  let totalTests = 0;

  function test(description, testFn) {
    totalTests++;
    try {
      testFn();
      console.log(`✅ ${description}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${description}: ${error.message}`);
    }
  }

  function expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, but got ${actual}`);
        }
      }
    };
  }

  console.log('🧪 开始测试 Templates 比较方法...\n');

  // 测试null和undefined情况
  test('应该正确处理null和undefined情况', () => {
    expect(comparator.isTemplatesEqual(null, null)).toBe(true);
    expect(comparator.isTemplatesEqual(undefined, undefined)).toBe(true);
    expect(comparator.isTemplatesEqual(null, { groups: [] })).toBe(false);
    expect(comparator.isTemplatesEqual({ groups: [] }, null)).toBe(false);
  });

  // 测试没有groups字段的情况
  test('应该正确处理没有groups字段的情况', () => {
    expect(comparator.isTemplatesEqual({}, {})).toBe(true);
    expect(comparator.isTemplatesEqual({}, { groups: [] })).toBe(false);
    expect(comparator.isTemplatesEqual({ groups: [] }, {})).toBe(false);
  });

  // 测试groups数组长度
  test('应该正确比较groups数组长度', () => {
    const template1 = { groups: [{ label: 'test1' }] };
    const template2 = { groups: [{ label: 'test1' }, { label: 'test2' }] };
    expect(comparator.isTemplatesEqual(template1, template2)).toBe(false);
  });

  // 测试相同的templates（顺序相同）
  test('应该正确比较相同的templates（顺序相同）', () => {
    const template1 = {
      groups: [
        {
          label: '范文',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        },
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容2' }]
        }
      ]
    };
    
    const template2 = {
      groups: [
        {
          label: '范文',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        },
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容2' }]
        }
      ]
    };
    
    expect(comparator.isTemplatesEqual(template1, template2)).toBe(true);
  });

  // 测试相同的templates（顺序不同）
  test('应该正确比较相同的templates（顺序不同）', () => {
    const template1 = {
      groups: [
        {
          label: '范文',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        },
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容2' }]
        }
      ]
    };
    
    const template2 = {
      groups: [
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容2' }]
        },
        {
          label: '范文',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        }
      ]
    };
    
    expect(comparator.isTemplatesEqual(template1, template2)).toBe(true);
  });

  // 测试不同的templates（label不同）
  test('应该正确识别不同的templates（label不同）', () => {
    const template1 = {
      groups: [
        {
          label: '范文',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        }
      ]
    };
    
    const template2 = {
      groups: [
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        }
      ]
    };
    
    expect(comparator.isTemplatesEqual(template1, template2)).toBe(false);
  });

  // 测试重复label的情况
  test('应该正确处理重复label的情况', () => {
    const template1 = {
      groups: [
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        },
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容2' }]
        },
        {
          label: '范文',
          contents: [{ chapters: [], diff_context: false, content: '内容3' }]
        }
      ]
    };
    
    const template2 = {
      groups: [
        {
          label: '范文',
          contents: [{ chapters: [], diff_context: false, content: '内容3' }]
        },
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容1' }]
        },
        {
          label: '法规',
          contents: [{ chapters: [], diff_context: false, content: '内容2' }]
        }
      ]
    };
    
    expect(comparator.isTemplatesEqual(template1, template2)).toBe(true);
  });

  // 测试chapters数组排序
  test('应该正确处理chapters数组排序', () => {
    const template1 = {
      groups: [
        {
          label: '范文',
          contents: [
            {
              chapters: ['章节B', '章节A', '章节C'],
              diff_context: false,
              content: '内容1'
            }
          ]
        }
      ]
    };
    
    const template2 = {
      groups: [
        {
          label: '范文',
          contents: [
            {
              chapters: ['章节A', '章节C', '章节B'],
              diff_context: false,
              content: '内容1'
            }
          ]
        }
      ]
    };
    
    expect(comparator.isTemplatesEqual(template1, template2)).toBe(true);
  });

  console.log(`\n📊 测试结果: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.log('💥 有测试失败！');
    process.exit(1);
  }
}

// 运行测试
runTests();
