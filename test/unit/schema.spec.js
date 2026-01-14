import { expect } from 'chai';
import loopSchema from '../mock/schema.error.mock';
import { schemaToEntity, parseEntityToTree } from '../../src/utils/index';

describe('测试schema', function() {
  expect(function() {
    const entity = schemaToEntity(loopSchema);
    parseEntityToTree({ data: entity });
  }).to.be.throw();
});
