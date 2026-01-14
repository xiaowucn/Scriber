/**
 * 工具函数的单元测试
 */
/* eslint-disable */
import { expect } from 'chai';
import md5 from 'blueimp-md5';
import _ from 'lodash';

import {
  splitLabels,
  parseAnswerToV2,
  parseAnswerToV1,
  schemaToEntity,
  initTreeData,
  parseEntityToTree,
  getAnsweredList,
  checkPermission,
  createObjectFromArray,
  getMaxIndexInKeys
} from '../../src/utils';

import { SPLIT_SYMBOL } from '../../src/store/constants';
import { schema, oldAnswer, answer2, answerA33 } from '../mock/answer.mock';
import {
  answer as answerIssue2,
  schema as schemaIssue2,
} from '../mock/answer.issue2.mock';
import {
  answer as answerIssue63,
  schema as schemaIssue63,
} from '../mock/answer.issue63.mock';
import {
  answer as answerIssue64,
  schema as schemaIssue64,
} from '../mock/answer.issue64.mock';
import {
  answer as answerIssue67,
  schema as schemaIssue67,
} from '../mock/answer.issue67.mock';
import {
  answer as answerIssue1,
  schema as schemaIssue1,
} from '../mock/answer.issue1.mock';
import {
  schema as originalSchema,
  schema2,
  schemaA33,
} from '../mock/schema.mock';
import {
  schema as schemaX1,
  answer as answerX1,
} from '../mock/answer.issue_x1.mock';
import {
  schema as schemaIssue80,
  answer as answerIssue80,
  answered10 as answeredIssue80Answered10,
} from '../mock/answer.issue80.mock';
import {
  schema as schemaIssue89,
  answer as answerIssue89,
} from '../mock/answer.issue89.mock';

describe('对标签进行分组', function() {
  it(`splitLabels(['ab', 'c'], [[{text: 'a'}, {text: 'b'}], [{text: 'c'}]])`, function() {
    const labels = ['ab', 'c'],
      items = [{ text: 'a' }, { text: 'b' }, { text: 'c' }],
      result = [[{ text: 'a' }, { text: 'b' }], [{ text: 'c' }]];
    expect(splitLabels(labels, items)).to.be.deep.equal(result);
  });
  it(`UseFont|_|_|CDN|_|_|Test|_|_|Test123|_|_|Test -> [[{text: 'Use'}, {text: 'Font'}], [{text: 'CDN'}], [{text: 'Test'}], [{text: 'Test'}, {text: '123'}], [{text: 'Test'}]]`, function() {
    const labels = 'UseFont|_|_|CDN|_|_|Test|_|_|Test123|_|_|Test'.split(
        SPLIT_SYMBOL,
      ),
      items = [
        { text: 'Use' },
        { text: 'Font' },
        { text: 'CDN' },
        { text: 'Test' },
        { text: 'Test' },
        { text: '123' },
        { text: 'Test' },
      ],
      result = [
        [{ text: 'Use' }, { text: 'Font' }],
        [{ text: 'CDN' }],
        [{ text: 'Test' }],
        [{ text: 'Test' }, { text: '123' }],
        [{ text: 'Test' }],
      ];
    expect(splitLabels(labels, items)).to.be.deep.eq(result);
  });
});

describe.skip('test md5', function() {
  it('md5(admin) equals 21232f297a57a5a743894a0e4a801fc3', function() {
    expect(md5('admin')).to.be.eq('21232f297a57a5a743894a0e4a801fc3');
  });
});
describe.skip('test parseAnswerToV2 => parseAnswerToV1 => parseAnswerToV2 value', function() {
  this.beforeAll(function() {
    this.v2 = parseAnswerToV2(oldAnswer, schema);
    this.v1 = _.cloneDeep(parseAnswerToV1(v2, schema));
    this.newV2 = parseAnswerToV2(v1, schema);
  })
  it('v1 and oldAnswer should be equals.', function() {
    const v1Keys = Object.keys(oldAnswer);
    for (let i = 0; i < v1Keys.length; i++) {
      const key = v1Keys[i];
      it(`key "${key}" should be equals.`, function() {
        expect(this.v1[key]).to.be.deep.eq(oldAnswer[key]);
      });
    }
  });
  it('v2 and newV2 should be equals.', function() {
    for (let i = 0; i < this.v2.items.length; i++) {
      const key = this.v2.items[i].key;
      it(`key "${key}" should be equals.`, function() {
        expect(this.v2.items[i]).to.be.deep.eq(this.newV2.items[i]);
      });
    }
  });
});

describe.skip('测试schema转换', function() {
  it('schema -> entity', function() {
    const entity = schemaToEntity(originalSchema);
    const { relations } = parseEntityToTree({ data: entity });
    initTreeData(relations.tree);
    const mockTree0 = {
      data: {
        label: 'A1',
        type: 'D/NS/N',
        required: false,
        multi: true,
        words: '',
      },
      meta: {
        _path: ['LRs', 'D/NS/N'],
        _index: 2,
        _partType: 'top',
        _type: {
          label: 'D/NS/N',
          values: [
            { isDefault: false, name: 'disclosure' },
            { isDefault: false, name: 'negative statement' },
            { isDefault: false, name: 'no disclosure' },
          ],
          type: 'enum',
        },
        _isHide: false,
        _nodeIndex: 1002,
        _parent: ['LRs'],
      },
      children: [],
    };
    expect(relations.tree.children[0]).to.be.deep.eq(mockTree0);
  });
  it('测试schema2 转换，不应抛出异常', function() {
    expect(function() {
      const entity = schemaToEntity(schema2);
      const { relations } = parseEntityToTree({ data: entity });
      initTreeData(relations.tree);
      parseAnswerToV2(answer2, { data: schema2 });
    }).to.be.not.throw();
  });
});

describe('测试v1 -> v2 丢失答案的问题', function() {
  let schema = { data: schemaIssue1 };
  let v2;
  it('v1 -> v2后，data数组的长度应该是1', function() {
    v2 = parseAnswerToV2(answerIssue1, schema);
    expect(v2.items[1].data.length).to.be.eq(1);
  });
  it('v2 -> v1时，应保留用户的枚举值', function() {
    let v1 = parseAnswerToV1(v2, schema);
    expect(v1['55622a7fe414dbb873986be9ca331fe0'].items[0].enumLabel).to.be.eq(
      'disclosure',
    );
  });
});
describe('issue#63', function() {
  it('v2 -> v1 -> v2 后，A2的答案不应为空', function() {
    const schema = { data: schemaIssue63 };
    const v1 = parseAnswerToV1(answerIssue63, schema);
    const v2 = parseAnswerToV2(v1, schema);
    expect(v2.items[1].data[0].boxes.length).not.to.be.eq(0);
  });
});
describe('issue#64', function() {
  it('v2 -> v1后，旧版A10的答案应该和新版A10答案一致', function() {
    const schema = { data: schemaIssue64 };
    const v1 = parseAnswerToV1(answerIssue64, schema);
    expect(
      v1['ee6df835798bd6f92eb956f51b401800'].items[0].fields.length,
    ).to.be.eq(6);
  });
});
describe('issue#67', function() {
  it('v2 -> v1 -> newV2后，v2答案的组合框应该和newV2的组合框一致', function() {
    const schema = { data: schemaIssue67 };
    const v2 = parseAnswerToV2(answerIssue67, schema);
    const answers = v2.items.filter(
      ans => ans.data.length > 0 && ans.data[0].boxes.length > 0,
    );
    const v1 = parseAnswerToV1({ items: answers }, schema);
    const newV2 = parseAnswerToV2(v1, schema);
    expect(answers[1].data[0].boxes.length).to.be.eq(
      newV2.items[1].data[0].boxes.length,
    );
  });
});
describe('issue#X1', function() {
  const schema = { data: schemaX1 };
  it('v1->v2时，没有画框却有单选框勾选的答案，应该被保存', function() {
    const v2 = parseAnswerToV2(answerX1, schema);
    const a1 = v2.items.find(itm => itm.key === '["LRs - test","A1"]');
    expect(a1.data[0].value).to.be.eq('D');
  });
  it('v2->v1时，没有框的项，fields中不应有field', function() {
    const v2 = parseAnswerToV2(answerX1, schema);
    const v1 = parseAnswerToV1(v2, schema);
    expect(v1['14fa40cb271ba9eec8bc36cbb188b23e'].items[0].fields.length).to.be.eq(0);
  });
});

describe('测试统计已做答案功能', function() {
  const schema = { data: schemaIssue80};
  it('已做答案 === 9', function() {
    const a33V2 = parseAnswerToV2(answerA33, schema);
    const answeredList = getAnsweredList(a33V2.items);
    expect(answeredList.length).to.be.eq(9);
  });
  it('已做答案 === 6', function() {
    const answeredList = getAnsweredList(answerIssue80.items);
    expect(answeredList.length).to.be.eq(6);
  });
  it('已做答案 === 10', function() {
    const answeredList = getAnsweredList(answeredIssue80Answered10);
    expect(answeredList.length).to.be.eq(10);    
  });
});

describe('issue#89', function() {
  it('v2->v1, v1->v2 后，items的顺序应该一致', function() {
    const schema = { data: schemaIssue89};
    const v1 = parseAnswerToV1(answerIssue89, schema);
    const oldArray = getLabels(v1['55622a7fe414dbb873986be9ca331fe0']);
    const v2 = parseAnswerToV2(v1, schema);
    const newV1 = parseAnswerToV1(v2, schema);
    const newArray = getLabels(newV1['55622a7fe414dbb873986be9ca331fe0']);
    expect(oldArray).to.be.deep.eq(newArray);
  });
  function getLabels (answer){
    return answer.items.map(item => {
      return item.fields.map(field => field.label).join('');
    });
  }
});

describe('测试权限', function() {
  const all = ['browse', 'remark', 'manageProject', 'manageSchema', 'manageUser', 'remarkManagement'];
  it('test browse', function() {
    const myPermission = [all[0], all[1]];
    expect(checkPermission('browse', check(myPermission))).to.be.eq(true);
  });
  it('test remark || remarkManagement', function() {
    const myPermission = [all[0], all[1], all[5]];
    expect(checkPermission('remark || remarkManagement', check(myPermission))).to.be.eq(true);
  });
  it('test browse && remark && manageSchema', function() {
    const myPermission = [all[0], all[1], all[2]];
    expect(checkPermission('browse && remark && manageSchema', check(myPermission))).to.be.eq(false);
    expect(checkPermission('browse && remark && manageProject', check(myPermission))).to.be.eq(true);
  });
});

describe('测试 createObjectFromArray', function() {
  it(`createObjectFromArray(['a', 'b']) equals {a: 'a', b: 'b'}`, function() {
    expect(createObjectFromArray(['a', 'b'])).to.deep.eq({a: 'a', b: 'b'});
  });
  it(`createObjectFromArray(['a', 'b'], {c: 'c'}) equals {a: 'a', b: 'b', c: 'c'}`, function() {
    expect(createObjectFromArray(['a', 'b'], {c: 'c'})).to.deep.eq({a: 'a', b: 'b', c: 'c'});
  });
})

function check(permission = ['browse']) {
  return function createCheck(singlePermStr) {
    return permission.includes(singlePermStr);
  }
}

describe('测试 key 中最大值', function() {
  it('最大值应该等于21', function() {
    const keys = [
      '["LRs:1","A1:2"]',
      '["LRs:3","A2:4"]',
      '["LRs:5","A3:6"]',
      '["LRs:7","A4:8"]',
      '["LRs:9","A5:10"]',
      '["LRs:11","A6:12"]',
      '["LRs:13","A7:14"]',
      '["LRs:15","A8:16"]',
      '["LRs:17","A9:18"]',
      '["LRs:19","A10:20","Name of every subsidiary:21"]'
    ];
    const maxIndex = getMaxIndexInKeys(keys);
    expect(maxIndex).to.be.eq(21);
  });
});