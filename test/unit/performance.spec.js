import { expect } from 'chai';
import _ from 'lodash';
import {
  eachTreeNode,
  initTreeData,
  parseEntityToTree,
  schemaToEntity,
} from '../../src/utils';
import {
  expandTreeNodeByAnswers,
  rebuildAnswersIndex,
  expand,
  remarkTools,
  createAnswerTreeMap,
  getForkIndex,
  updateKey,
  changeItemAfterIndex,
  sortAnswers,
  quickRebuildAnswersIndex,
} from '../../src/utils/remarkAnswerTools';
import { answers, schema } from '../mock/answer-tree.performance.mock';
import { answers as answer6262 } from '../mock/answer-6262.mock';
import {
  sortedMultipleLevelAnswers,
  multipleLevelAnswers,
  originalAnswers,
  deletedAnswers,
} from '../mock/answer-out-of-order.mock';

describe('性能测试', function() {
  // xa.cheftin.com:1555/index.html#/project/remark/12844?treeId=117&fileId=3099&schemaId=4&projectId=4&fileName=%E8%B1%AA%E5%B0%94%E8%B5%9B%E7%A7%91%E6%8A%80%E9%9B%86%E5%9B%A2%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E9%A6%96%E6%AC%A1%E5%85%AC%E5%BC%80%E5%8F%91%E8%A1%8C%E8%82%A1%E7%A5%A8%E6%8B%9B%E8%82%A1%E8%AF%B4%E6%98%8E%E4%B9%A6%EF%BC%88%E7%94%B3%E6%8A%A5%E7%A8%BF2019%E5%B9%B41%E6%9C%888%E6%97%A5%E6%8A%A5%E9%80%81%EF%BC%89.pdf
  it.skip('expandTreeNodeByAnswers', function() {
    // time: 71 s
    expect(function() {
      const entity = schemaToEntity(schema);
      const treeData = parseEntityToTree({
        data: entity,
      }).relations.tree;
      initTreeData(treeData);
      eachTreeNode(treeData, node => {
        if (_.isArray(node.children) && node.children.length > 0) {
          // 需要保持children中的数据不被answer污染
          const pureChildren = _.cloneDeep(node.children);
          Object.assign(node, {
            // childrenGroup: [node.children],
            childrenGroup: [pureChildren],
          });
        }
      });
      expandTreeNodeByAnswers(treeData, answers.userAnswer.items);
    }).not.throw();
  });
  it('rebuild', function() {
    rebuildAnswersIndex(answers.userAnswer.items);
  });
  it('expend', function() {
    // 51 ms
    const entity = schemaToEntity(schema);
    const schemaTreeData = parseEntityToTree({
      data: entity,
    }).relations.tree;
    initTreeData(schemaTreeData);
    expand(schemaTreeData, answers.userAnswer.items);
  });
  it.skip('find nodeItem by key', function() {
    console.time('init');
    const entity = schemaToEntity(schema);
    const treeData = parseEntityToTree({
      data: entity,
    }).relations.tree;
    const answerItems = answers.userAnswer.items;
    initTreeData(treeData);
    console.timeEnd('init');
    console.time('createAnswerTreeMap');
    const treeMap = createAnswerTreeMap(treeData);
    console.timeEnd('createAnswerTreeMap');
    console.time('expand');
    expand(treeData, answerItems, treeMap);
    console.timeEnd('expand');
    console.time('getTreeNode');
    const node = remarkTools.getTreeNode(
      answerItems[135].key,
      treeData,
      treeMap,
    );
    console.timeEnd('getTreeNode');
    expect(node.data.label).to.be.eq('监事基本情况');
  });
});

describe('测试key操作函数', function() {
  it('getForkIndex', function() {
    const key1 = [
      '科创板招股说明书信息导出json:0',
      '业务与技术-专利:1',
      '复合测试类型:0',
      '简单子类型:0',
    ];
    const key2 = [
      '科创板招股说明书信息导出json:0',
      '业务与技术-专利:1',
      '复合测试类型:0',
      '组合子类型:0',
      '简单类型值A:0',
    ];
    expect(getForkIndex(key1, key2)).to.be.eq(2);

    const key3 = [
      '科创板招股说明书信息导出json:0',
      '业务与技术-专利:3',
      '复合测试类型:0',
      '组合子类型:1',
      '简单类型值C:0',
    ];
    const key4 = [
      '科创板招股说明书信息导出json:0',
      '业务与技术-专利:4',
      '专利号:0',
    ];
    expect(getForkIndex(key3, key4)).to.be.eq(0);

    const key5 = [
      '科创板招股说明书信息导出json:0',
      '业务与技术-专利:3',
      '复合测试类型:0',
      '组合子类型:0',
      '简单类型值A:0',
    ];
    const key6 = [
      '科创板招股说明书信息导出json:0',
      '业务与技术-专利:3',
      '复合测试类型:0',
      '组合子类型:0',
      '简单类型值B:0',
    ];
    expect(getForkIndex(key5, key6)).to.be.eq(3);
  });
  it('updateKey', function() {
    const key1 = [
      '科创板招股说明书信息导出json:0',
      '业务与技术-专利:1',
      '复合测试类型:0',
      '简单子类型:0',
    ];
    const indexes = [5, 4, 3, 2];
    expect(updateKey(key1, indexes)).to.be.deep.equal([
      '科创板招股说明书信息导出json:5',
      '业务与技术-专利:4',
      '复合测试类型:3',
      '简单子类型:2',
    ]);
  });
  it('changeItemAfterIndex', function() {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    changeItemAfterIndex(arr, 0, 2);
    expect(arr).to.be.deep.eq([1, 2, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe('quickAnswerIndex', function() {
  it('sort answers(simple)', function() {
    const sortedAnswers = sortAnswers(multipleLevelAnswers);
    expect(sortedAnswers).to.be.deep.eq(sortedMultipleLevelAnswers);
  });
  it('sort answers', function() {
    expect(function() {
      sortAnswers(originalAnswers);
      sortAnswers(deletedAnswers);
    }).not.throw();
  });
  it('quickAnswerIndex', function() {
    quickRebuildAnswersIndex(deletedAnswers);
  });
  it.skip('main', function() {
    const sortedAnswers = sortAnswers(answer6262);
    console.time('old');
    const oldRebuildedAnswers = rebuildAnswersIndex(sortedAnswers);
    console.timeEnd('old');
    console.time('new');
    const newRebuildedAnswers = quickRebuildAnswersIndex(answer6262);
    console.timeEnd('new');
    expect(newRebuildedAnswers).to.be.deep.eq(oldRebuildedAnswers);
  });
});
