import { expect } from 'chai';
import _ from 'lodash';
import {
  answerTree,
  answer as originalAnswer,
} from '../mock/issue200_204.mock';
import { answerKeyTools } from '../../src/utils/remarkAnswerTools';

describe('测试 rebuildAnswerIndex', function() {
  it('转换复杂结构不应报错', function() {
    expect(function() {
      const original = originalAnswer;
      const clonedAnswer = _.cloneDeep(original);
      const answerTools = answerKeyTools.selectAllAnswer(clonedAnswer);
      answerTools.rebuildAnswersIndex();
      answerTools.expandAnswerTree(answerTree);
    }).not.to.be.throw();
  });
});
