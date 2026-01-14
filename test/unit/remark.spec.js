import { expect } from 'chai';
import _ from 'lodash';
import { schema as remarkSchema, answer } from '../mock/remark.mock';
import { lrsSchema } from '../mock/shcema.LRs.mock';
import answerTreeDatas from '../mock/answerTreeData.mock';
import {
  fillChildrenGroup,
  answerKeyTools,
  hasKeywordInKey,
} from '../../src/utils/remarkAnswerTools';
import {
  mergeAnswerToTreeData,
  fullSchemaToEntity,
  parseEntityToTree,
  initTreeData,
  eachTreeNode,
} from '../../src/utils';

describe.skip('测试合并schema和answer', function() {
  it('mergeAnswerToTreeData()', function() {
    expect(function() {
      const entity = fullSchemaToEntity({ data: remarkSchema });
      const treeData = parseEntityToTree(entity);
      const tree = treeData.relations.tree;
      initTreeData(tree);
      mergeAnswerToTreeData(tree, answer);
    }).not.to.be.throw();
  });
});

describe('检查answers是否都是uidKey', function() {
  this.beforeAll(function() {
    this.answersWithUidKeys = [
      { key: '["LRs:1", "A10:2"]' },
      { key: '["LRs:1", "A10:2", "A10.1:4"]' },
      { key: '["LRs:1", "A11:23"]' },
    ];
    this.answersWithoutUidKeys = [
      { key: '["LRs:1", "A10:2"]' },
      { key: '["LRs:1", "A10:2", "A10.1:4"]' },
      { key: '["LRs", "A11:23"]' },
    ];
  });
  it('answersWithUidKeys应该有效', function() {
    expect(
      answerKeyTools
        .selectAllAnswer(this.answersWithUidKeys)
        .allKeyIsIndexKey(),
    ).to.be.eq(true);
  });
  it('answersWithoutUidKeys应该无效', function() {
    expect(
      answerKeyTools
        .selectAllAnswer(this.answersWithoutUidKeys)
        .allKeyIsIndexKey(),
    ).to.be.eq(false);
  });
  it('["LRs:0","A10:2","Country of operation:0"] 应该有效', function() {
    expect(
      answerKeyTools
        .selectAllAnswer([
          { key: '["LRs:0","A10:2","Country of operation:0"]' },
        ])
        .allKeyIsIndexKey(),
    ).to.be.eq(true);
  });
});

describe('为非uidKeys的answers加上:0', function() {
  const answersWithoutUidKeys = [
    { key: '["LRs","A10"]', name: 'a' },
    { key: '["LRs","A10:1987","A10.1"]', name: 'b' },
    { key: '["LRs","A11"]', name: 'c' },
  ];

  const answersWithUidKeys = [
    { key: '["LRs:0","A10:0"]', name: 'a' },
    { key: '["LRs:0","A10:1987:0","A10.1:0"]', name: 'b' },
    { key: '["LRs:0","A11:0"]', name: 'c' },
  ];
  it('为每一项的key加上:0', function() {
    expect(
      answerKeyTools.selectAllAnswer(answersWithoutUidKeys).parseIndexKeys(),
    ).to.be.deep.eq(answersWithUidKeys);
  });
});

describe('测试getAnswerTreeNodeByKey', function() {
  it('从LRs中获取["LRs:0","A11:0"]的label应该为A11', function() {
    const entity = fullSchemaToEntity({ data: lrsSchema });
    const treeData = parseEntityToTree(entity);
    const tree = treeData.relations.tree;
    initTreeData(tree);
    eachTreeNode(tree, node => {
      Object.assign(node, {
        childrenGroup: [_.cloneDeep(node.children)],
      });
    });
    const schemaItem = answerKeyTools
      .select('["LRs:0","A11:0"]')
      .getAnswerTreeNode(tree);
    expect(schemaItem.data.label).to.be.eq('A11');
  });
});

describe.skip('测试fillChildrenGroup', function() {
  this.beforeAll(function() {
    this.fullList = [{ name: 'a' }, { name: 'b' }];
    this.lastItem = fillChildrenGroup({ name: 'c' }, this.fullList, 5);
  });
  it('期待fullList的长度为5', function() {
    expect(this.fullList.length).to.be.eq(6);
  });
  it('期待fillChildrenGroup的返回项（最后一项）name=c', function() {
    expect(this.lastItem.name).to.be.eq('c');
  });
  it('期待fillChildrenGroup中填充项，其中一项内容变更，不会影响其他项（深拷贝）', function() {
    const thirdItem = this.fullList[2];
    thirdItem.name = 'foo';
    expect(this.lastItem.name).to.be.eq('c');
  });
  it('如果数组长度大于len长度，保持现状', function() {
    const bigList = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
    const lastItem = fillChildrenGroup({ name: 'foo' }, bigList, 2);
    expect(lastItem.name).to.be.eq('c');
    expect(bigList.length).to.be.eq(3);
  });
});

describe('测试getAnswerTreeNodeKey', function() {
  it('getAnswerTreeNodeKey 应该返回 ["LRs:0", "A12:1", "List of directors:0"]', function() {
    Object.assign(answerTreeDatas[0], {
      childrenGroup: [answerTreeDatas[0].children],
    });
    const keys = answerKeyTools.getAnswerTreeKeyByNode(
      answerTreeDatas[0],
      answerTreeDatas[0].children[11].childrenGroup[1][0],
    );
    expect(keys).to.be.deep.eq(['LRs:0', 'A12:1', 'List of directors:0']);
  });
});

describe('测试splitUidKeys和mergeUidKeys', function() {
  this.beforeAll(function() {
    this.correctKey = '["LRs:0","A10:2","Country of operation:0"]';
    this.errorKey = '["LRs","A10:2","Country of operation:0"]';
    this.keys = ['LRs', 'A10', 'Country of operation'];
    this.indexes = [0, 2, 0];
  });
  it('splitUidKeys应该返回["LRs", "A10", "C..."]和[0, 2, 0]', function() {
    const keys = answerKeyTools.select(this.correctKey).splitIndexKey();
    expect(keys).to.be.deep.eq([
      ['LRs', 'A10', 'Country of operation'],
      [0, 2, 0],
    ]);
  });
  it('splitUidKeys拆分非法unidKeys时应该报错', function() {
    expect(function() {
      answerKeyTools.select(this.errorKey).splitIndexKey();
    }).to.be.throw();
  });
  it('合并key和indexes应该和组合值一致', function() {
    expect(answerKeyTools.mergeIndexKey(this.keys, this.indexes)).to.be.deep.eq(
      JSON.parse(this.correctKey),
    );
  });
});

describe('测试resetKeyLastIndex', function() {
  it('重设["LRs:0","A1:0"], 2应该等于["LRs:0","A1:2"]', function() {
    expect(answerKeyTools.select(['LRs:0', 'A1:0']).resetLastIndex(2)).to.be.eq(
      '["LRs:0","A1:2"]',
    );
  });
  it('重设["LRs:0","A1:0","Country...:0"], 2应该等于["LRs:0","A1:2","Country...:0"]', function() {
    expect(
      answerKeyTools
        .select(['LRs:0', 'A1:0', 'Country...:0'])
        .resetLastIndex(2, 1),
    ).to.be.eq('["LRs:0","A1:2","Country...:0"]');
  });
});

describe('测试keyStartWith', function() {
  this.beforeAll(function() {
    this.fullKeys = [
      '["LRs:0","A1:0"]',
      '["LRs:0","A10:1","Country of operation:0"]',
    ];
    this.headKey = ['["LRs:0","A1"]', '["LRs:0","A10:1"]'];
  });
  it('["LRs:0","A1"]应该包含在["LRs:0","A1:0"]中', function() {
    // expect(keyStartWith(this.fullKeys[0], this.headKey[0])).to.be.eq(true);
    expect(
      answerKeyTools.select(this.fullKeys[0]).isStartsWith(this.headKey[0]),
    ).to.be.eq(true);
  });
  it('["LRs:0","A10"]应该包含在["LRs:0","A10:1","Country of operation:0"]中', function() {
    expect(
      answerKeyTools.select(this.fullKeys[1]).isStartsWith(this.headKey[1]),
    ).to.be.eq(true);
  });
  it('["LRs:0","A1"]不应该包含在["LRs:0","A10:1","Country of operation:0"]中', function() {
    expect(
      answerKeyTools.select(this.fullKeys[1]).isStartsWith(this.headKey[0]),
    ).to.be.eq(false);
  });
});
describe('测试isClonedKey', function() {
  this.beforeAll(function() {
    this.keys = [
      '["LRs:0","A1:0"]',
      '["LRs:0","A1:2"]',
      '["LRs:0","A1:3"]',
      '["LRs:0","A10:0"]',
      '["LRs:0","A10:0","Country of operation:0"]',
      '["LRs:0","A10:1","Country of operation:0"]',
      '["LRs:0","A10:3","Country of operation:0"]',
    ];
  });
  it('["LRs:0","A1:0"]和["LRs:0","A1:2"]应该属于被克隆出的key', function() {
    expect(answerKeyTools.isClonedKey(this.keys[0], this.keys[1])).to.be.eq(
      true,
    );
  });
  it(`["LRs:0","A10:0","C...:0"]和["LRs:0","A10:1","C...:0"]不应属于被克隆出的key`, function() {
    expect(answerKeyTools.isClonedKey(this.keys[4], this.keys[5])).to.be.eq(
      false,
    );
  });
  it(`["LRs:0","A10:0"]和["LRs:0","A10:0","C...:0"]不应属于被克隆出的key`, function() {
    expect(answerKeyTools.isClonedKey(this.keys[3], this.keys[4])).to.be.eq(
      false,
    );
  });
});

describe('测试getLastIndexOfKey', function() {
  it('["LRs:0","A1:0"]应该为0', function() {
    expect(answerKeyTools.select(['LRs:0', 'A1:0']).getLastIndex()).to.be.eq(0);
  });
  it('["LRs:0","A1:2","A11:1"]的第2项应该为2', function() {
    expect(
      answerKeyTools.select(['LRs:0', 'A1:2', 'A11:1']).getLastIndex(1),
    ).to.be.eq(2);
  });
});

describe('测试rebuildAnswersIndex', function() {
  this.beforeAll(function() {
    this.randomIndexAnswers1 = [
      { key: '["LRs:0","A1:0"]', name: 'test1' },
      { key: '["LRs:0","A1:2"]', name: 'test2' },
      { key: '["LRs:0","A1:3"]', name: 'test3' },
      { key: '["LRs:0","A10:0"]', name: 'test4' },
      { key: '["LRs:0","A10:0","Country of operation:0"]', name: 'test5' },
      { key: '["LRs:0","A10:3","Country of operation:0"]', name: 'test6' },
    ];
    this.randomIndexAnswers2 = [
      { key: '["LRs:0","A1:0"]', name: 'test1' },
      { key: '["LRs:0","A1:2"]', name: 'test2' },
      { key: '["LRs:0","A1:3"]', name: 'test3' },
      { key: '["LRs:0","A10:0"]', name: 'test4' },
      { key: '["LRs:0","A10:1","Country of operation:0"]', name: 'test5' },
      { key: '["LRs:0","A10:100","Country of operation:0"]', name: 'test6' },
      { key: '["LRs:0","A10:100","Country of operation:1"]', name: 'test7' },
    ];
  });
  it('rebuildAnswersIndex应该返回从0开始计数index的值', function() {
    const rebuildedIndexAnswers = answerKeyTools
      .selectAllAnswer(this.randomIndexAnswers2)
      .rebuildAnswersIndex();
    expect(rebuildedIndexAnswers).to.be.deep.eq([
      { key: '["LRs:0","A1:0"]', name: 'test1' },
      { key: '["LRs:0","A1:1"]', name: 'test2' },
      { key: '["LRs:0","A1:2"]', name: 'test3' },
      { key: '["LRs:0","A10:0"]', name: 'test4' },
      { key: '["LRs:0","A10:1","Country of operation:0"]', name: 'test5' },
      { key: '["LRs:0","A10:2","Country of operation:0"]', name: 'test6' },
      { key: '["LRs:0","A10:2","Country of operation:1"]', name: 'test7' },
    ]);
  });
});

describe('测试tracker', function() {
  this.beforeAll(function() {
    const entity = fullSchemaToEntity({ data: remarkSchema });
    const treeData = parseEntityToTree(entity);
    this.tree = treeData.relations.tree;
    initTreeData(this.tree);
    eachTreeNode(this.tree, node => {
      if (_.isArray(node.children) && node.children.length > 0) {
        Object.assign(node, {
          childrenGroup: [node.children],
        });
      }
    });
    this.answers = [
      { key: '["LRs:0","A1:0"]', name: 'test1', data: [], schema: {} },
      { key: '["LRs:0","A2:0"]', name: 'test2', data: [], schema: {} },
      {
        key: '["LRs:0","A10:0","Name of every subsidiary:0"]',
        name: 'test3',
        data: [],
        schema: {},
      },
      {
        key: '["LRs:0","A10:0","Country of operation:0"]',
        name: 'test4',
        data: [],
        schema: {},
      },
      {
        key: '["LRs:0","A10:2","Country of operation:0"]',
        name: 'test5',
        data: [],
        schema: {},
      },
      {
        key: '["LRs:0","A24:0","Details:0"]',
        name: 'test6',
        data: [],
        schema: {},
      },
      {
        key: '["LRs:0","A24:0","Table for related party transaction:0"]',
        name: 'test7',
        data: [],
        schema: {},
      },
      { key: '["LRs:0","A25:0"]', name: 'test8', data: [], schema: {} },
    ];
  });
  // it('tracker应该能找到对应的answer和treeNode', function() {
  //   answerKeyTools.selectAllAnswer(this.answers).rebuildAnswersIndex();
  //   const tracker = Object.create(AnswerTracker);
  //   tracker.init();
  //   tracker.scan(this.answers, this.tree);
  //   expect(tracker.select(this.answers[0]).getTreeNode()).not.to.be.undefined();
  // });
});

describe('测试 hasKeywordInKey', function() {
  it('是否包含keyword', function() {
    expect(hasKeywordInKey(['abc:0', 'def:1', 'zzz:0'], 'abcd')).to.be.eq(
      false,
    );
    expect(hasKeywordInKey(['abc:0', 'def:1', 'zzz:0'], 'abc:0')).to.be.eq(
      false,
    );
    expect(hasKeywordInKey(['abc:0', 'def:1', 'zzz:0'], 'abc')).to.be.eq(true);
    expect(hasKeywordInKey(['abc:0', 'def:1', 'zzz:0'], 'zzz')).to.be.eq(true);
    expect(hasKeywordInKey(['abc:0', 'def:1', 'zzz:0'], 'zzz:0')).to.be.eq(
      false,
    );
  });
});
