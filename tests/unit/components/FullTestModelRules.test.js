import { mount } from '@vue/test-utils';
import FullTestModelRules from '../../../src/custom/general/components/FullTestModelRules.vue';

describe('FullTestModelRules - Templates Comparison', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(FullTestModelRules, {
      propsData: {
        orderIds: [1, 2, 3],
      },
      mocks: {
        $notify: jest.fn(),
        $alert: jest.fn(),
        $features: {
          showExternalAudit: () => false,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('isTemplatesEqual', () => {
    test('应该正确处理null和undefined情况', () => {
      const vm = wrapper.vm;

      // 两者都为null
      expect(vm.isTemplatesEqual(null, null)).toBe(true);
      expect(vm.isTemplatesEqual(undefined, undefined)).toBe(true);

      // 一个为null另一个不为null
      expect(vm.isTemplatesEqual(null, { groups: [] })).toBe(false);
      expect(vm.isTemplatesEqual({ groups: [] }, null)).toBe(false);
    });

    test('应该正确处理没有groups字段的情况', () => {
      const vm = wrapper.vm;

      // 都没有groups字段
      expect(vm.isTemplatesEqual({}, {})).toBe(true);

      // 一个有groups另一个没有
      expect(vm.isTemplatesEqual({}, { groups: [] })).toBe(false);
      expect(vm.isTemplatesEqual({ groups: [] }, {})).toBe(false);
    });

    test('应该正确比较groups数组长度', () => {
      const vm = wrapper.vm;

      const template1 = { groups: [{ label: 'test1' }] };
      const template2 = { groups: [{ label: 'test1' }, { label: 'test2' }] };

      expect(vm.isTemplatesEqual(template1, template2)).toBe(false);
    });

    test('应该正确比较相同的templates（顺序相同）', () => {
      const vm = wrapper.vm;

      const template1 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容2',
              },
            ],
          },
        ],
      };

      const template2 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容2',
              },
            ],
          },
        ],
      };

      expect(vm.isTemplatesEqual(template1, template2)).toBe(true);
    });

    test('应该正确比较相同的templates（顺序不同）', () => {
      const vm = wrapper.vm;

      const template1 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容2',
              },
            ],
          },
        ],
      };

      const template2 = {
        groups: [
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容2',
              },
            ],
          },
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
        ],
      };

      expect(vm.isTemplatesEqual(template1, template2)).toBe(true);
    });

    test('应该正确识别不同的templates（label不同）', () => {
      const vm = wrapper.vm;

      const template1 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
        ],
      };

      const template2 = {
        groups: [
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
        ],
      };

      expect(vm.isTemplatesEqual(template1, template2)).toBe(false);
    });

    test('应该正确识别不同的templates（content不同）', () => {
      const vm = wrapper.vm;

      const template1 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
        ],
      };

      const template2 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容2',
              },
            ],
          },
        ],
      };

      expect(vm.isTemplatesEqual(template1, template2)).toBe(false);
    });

    test('应该正确处理重复label的情况', () => {
      const vm = wrapper.vm;

      const template1 = {
        groups: [
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容2',
              },
            ],
          },
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容3',
              },
            ],
          },
        ],
      };

      const template2 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容3',
              },
            ],
          },
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
          {
            label: '法规',
            contents: [
              {
                chapters: [],
                diff_context: false,
                content: '内容2',
              },
            ],
          },
        ],
      };

      expect(vm.isTemplatesEqual(template1, template2)).toBe(true);
    });

    test('应该正确处理chapters数组排序', () => {
      const vm = wrapper.vm;

      const template1 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: ['章节B', '章节A', '章节C'],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
        ],
      };

      const template2 = {
        groups: [
          {
            label: '范文',
            contents: [
              {
                chapters: ['章节A', '章节C', '章节B'],
                diff_context: false,
                content: '内容1',
              },
            ],
          },
        ],
      };

      expect(vm.isTemplatesEqual(template1, template2)).toBe(true);
    });
  });

  describe('compareGroupsByMatching', () => {
    test('应该正确匹配相同的groups', () => {
      const vm = wrapper.vm;

      const groups1 = [
        { label: '范文', contents: [{ content: '内容1' }] },
        { label: '法规', contents: [{ content: '内容2' }] },
      ];

      const groups2 = [
        { label: '法规', contents: [{ content: '内容2' }] },
        { label: '范文', contents: [{ content: '内容1' }] },
      ];

      expect(vm.compareGroupsByMatching(groups1, groups2)).toBe(true);
    });

    test('应该正确识别不匹配的groups', () => {
      const vm = wrapper.vm;

      const groups1 = [
        { label: '范文', contents: [{ content: '内容1' }] },
        { label: '法规', contents: [{ content: '内容2' }] },
      ];

      const groups2 = [
        { label: '范文', contents: [{ content: '内容1' }] },
        { label: '法规', contents: [{ content: '内容3' }] }, // 内容不同
      ];

      expect(vm.compareGroupsByMatching(groups1, groups2)).toBe(false);
    });
  });

  describe('isGroupEqual', () => {
    test('应该正确比较group的label', () => {
      const vm = wrapper.vm;

      const group1 = { label: '范文', contents: [] };
      const group2 = { label: '法规', contents: [] };

      expect(vm.isGroupEqual(group1, group2)).toBe(false);
    });

    test('应该正确比较group的contents长度', () => {
      const vm = wrapper.vm;

      const group1 = { label: '范文', contents: [{ content: '内容1' }] };
      const group2 = {
        label: '范文',
        contents: [{ content: '内容1' }, { content: '内容2' }],
      };

      expect(vm.isGroupEqual(group1, group2)).toBe(false);
    });
  });

  describe('sortContents', () => {
    test('应该正确排序contents', () => {
      const vm = wrapper.vm;

      const contents = [
        { content: 'B内容', chapters: ['章节2', '章节1'] },
        { content: 'A内容', chapters: ['章节B', '章节A'] },
      ];

      const sorted = vm.sortContents(contents);

      expect(sorted[0].content).toBe('A内容');
      expect(sorted[1].content).toBe('B内容');
      expect(sorted[0].chapters).toEqual(['章节A', '章节B']);
      expect(sorted[1].chapters).toEqual(['章节1', '章节2']);
    });
  });
});
