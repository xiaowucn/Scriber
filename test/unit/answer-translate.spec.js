import { expect } from 'chai';
import { schema, answerV1, answerV2_2 } from '../mock/answer-translate.mock';
import { parseAnswerToV2_2 } from '../../src/utils/answer-translateV2.2';

describe('测试answerV1格式转换answerV2.2格式', function() {
  it('answerV1->answerV2.2, parseAnswerToV2()', function() {
    let newAnswer = parseAnswerToV2_2(answerV1, schema);
    expect(newAnswer).to.be.deep.eq(answerV2_2);
  });
});
