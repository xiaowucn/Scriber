export const schema = {
  id: 17,
  checksum: 'd1f0525dd16ac52bc0d38de9e417f87e',
  name: '测试环境来的Schema',
  data: {
    schemas: [
      {
        name: '测试环境来的Schema',
        orders: ['姓名', '年龄', '生日', '爱好', '技能', '性别'],
        schema: {
          姓名: {
            type: '文本',
            required: false,
            multi: false,
            words: '开发勿动-描述信息',
          },
          年龄: { type: '数字', required: false, multi: false },
          生日: { type: '日期', required: false, multi: true },
          爱好: { type: '文本列表', required: false, multi: true },
          技能: { type: '技能列表', required: false, multi: false },
          性别: { type: '性别', required: false, multi: false },
        },
      },
      {
        name: '技能列表',
        orders: ['烹饪', '钓鱼'],
        schema: {
          烹饪: { type: '技能', required: false, multi: false },
          钓鱼: { type: '技能', required: false, multi: false },
        },
      },
      {
        name: '技能',
        orders: ['难度', '操作者', '熟练度'],
        schema: {
          难度: { type: '文本', required: false, multi: false },
          操作者: { type: '性别', required: true, multi: true },
          熟练度: { type: '数字', required: false, multi: true },
        },
      },
      {
        name: '文本列表',
        orders: ['吃1', '喝1', '熟练度'],
        schema: {
          吃1: { type: '文本', required: false, multi: false },
          喝1: { type: '文本', required: false, multi: false },
          熟练度: { type: '文本', required: false, multi: true },
        },
      },
    ],
    schema_types: [
      {
        type: 'enum',
        values: [
          { isDefault: true, name: '男' },
          { isDefault: false, name: '女' },
        ],
        label: '性别',
      },
    ],
  },
  created_utc: 1539315377,
  updated_utc: 1539316225,
};

export const oldAnswer = {
  '8588853b1e7ac798a5bf42bd2e9ba84d': {
    type: '测试环境来的Schema',
    label: '测试环境来的Schema',
    schemaPath: ['测试环境来的Schema'],
    md5: '8588853b1e7ac798a5bf42bd2e9ba84d',
    attributes: [],
    items: [],
  },
  '8a55389d4d1462fffc62f8813407c7d4': {
    type: '文本',
    label: '姓名',
    schemaPath: ['测试环境来的Schema', '姓名'],
    md5: '8a55389d4d1462fffc62f8813407c7d4',
    required: false,
    multiple: false,
    attributes: [
      { name: '姓名', multiple: false, required: false, type: '文本' },
    ],
    items: [
      {
        schemaMD5: '8a55389d4d1462fffc62f8813407c7d4',
        fields: [
          {
            components: [
              {
                frameData: {
                  left: '208.4737',
                  top: '87.6842',
                  topleft: ['87.6842', '208.4737'],
                  width: '154.7895',
                  height: '33.1053',
                  type: '姓名',
                  id: 'page1:1539316308000',
                  page: 0,
                },
                text: 'Font Awesome',
              },
            ],
            name: '姓名',
            label: 'Font Awesome',
          },
        ],
      },
    ],
  },
  fd99f7e18ae8cd35347e25ec20c7a5d3: {
    type: '数字',
    label: '年龄',
    schemaPath: ['测试环境来的Schema', '年龄'],
    md5: 'fd99f7e18ae8cd35347e25ec20c7a5d3',
    required: false,
    multiple: false,
    attributes: [
      { name: '年龄', multiple: false, required: false, type: '数字' },
    ],
    items: [],
  },
  c9a2646aadc21ee85eb7ec015689e893: {
    type: '日期',
    label: '生日',
    schemaPath: ['测试环境来的Schema', '生日'],
    md5: 'c9a2646aadc21ee85eb7ec015689e893',
    required: false,
    multiple: true,
    attributes: [
      { name: '生日', multiple: true, required: false, type: '日期' },
    ],
    items: [],
  },
  '5a52279484149052fd908a13e0ce6b7a': {
    type: '文本列表',
    label: '爱好',
    schemaPath: ['测试环境来的Schema', '爱好'],
    md5: '5a52279484149052fd908a13e0ce6b7a',
    required: false,
    multiple: true,
    attributes: [
      { name: '吃1', multiple: false, required: false, type: '文本' },
      { name: '喝1', multiple: false, required: false, type: '文本' },
      { name: '熟练度', multiple: true, required: false, type: '文本' },
    ],
    items: [
      {
        fields: [
          {
            components: [
              {
                frameData: {
                  left: '232.6316',
                  top: '144.9474',
                  topleft: ['144.9474', '232.6316'],
                  width: '55.4737',
                  height: '18.7895',
                  type: '吃1',
                  id: 'page1:1539316317000',
                  page: 0,
                },
                text: 'website',
              },
            ],
            label: 'website',
            name: '吃1',
            type: '文本',
          },
          {
            components: [
              {
                frameData: {
                  left: '293.4737',
                  top: '139.5789',
                  topleft: ['139.5789', '293.4737'],
                  width: '126.1579',
                  height: '25.0526',
                  type: '喝1',
                  id: 'page1:1539316325000',
                  page: 0,
                },
                text: 'favoritef ramework',
              },
            ],
            label: 'favoritef ramework',
            name: '喝1',
            type: '文本',
          },
          {
            components: [
              {
                frameData: {
                  left: '453.6316',
                  top: '144.9474',
                  topleft: ['144.9474', '453.6316'],
                  width: '72.4737',
                  height: '19.6842',
                  type: '熟练度',
                  id: 'page1:1539316330000',
                  page: 0,
                },
                text: 'photoshop',
              },
              {
                frameData: {
                  left: '34.0000',
                  top: '164.6316',
                  topleft: ['164.6316', '34.0000'],
                  width: '83.2105',
                  height: '23.2632',
                  type: '熟练度',
                  id: 'page1:1539316334000',
                  page: 0,
                },
                text: 'document.',
              },
              {
                frameData: {
                  left: '55.4737',
                  top: '370.4211',
                  topleft: ['370.4211', '55.4737'],
                  width: '121.6842',
                  height: '25.9474',
                  type: '熟练度',
                  id: 'page1:1539316346000',
                  page: 0,
                },
                text: 'Web Fonts with CSS',
              },
            ],
            label: 'photoshopdocument.|_|_|Web Fonts with CSS',
            name: '熟练度',
            type: '文本',
          },
        ],
        schemaMD5: '5a52279484149052fd908a13e0ce6b7a',
      },
    ],
  },
  '77533ea94e9ec08e26aad7a944a8773f': {
    type: '技能列表',
    label: '技能',
    schemaPath: ['测试环境来的Schema', '技能'],
    md5: '77533ea94e9ec08e26aad7a944a8773f',
    required: false,
    multiple: false,
    attributes: [],
    items: [],
  },
  c483b11a9c9d721fa3c72738b15c61e4: {
    type: '技能',
    label: '烹饪',
    schemaPath: ['测试环境来的Schema', '技能', '烹饪'],
    md5: 'c483b11a9c9d721fa3c72738b15c61e4',
    required: false,
    multiple: false,
    attributes: [
      { name: '难度', multiple: false, required: false, type: '文本' },
      { name: '操作者', multiple: true, required: true, type: '性别' },
      { name: '熟练度', multiple: true, required: false, type: '数字' },
    ],
    items: [],
  },
  '9c0ac27593d0dff5ee4e7b4616432d91': {
    type: '技能',
    label: '钓鱼',
    schemaPath: ['测试环境来的Schema', '技能', '钓鱼'],
    md5: '9c0ac27593d0dff5ee4e7b4616432d91',
    required: false,
    multiple: false,
    attributes: [
      { name: '难度', multiple: false, required: false, type: '文本' },
      { name: '操作者', multiple: true, required: true, type: '性别' },
      { name: '熟练度', multiple: true, required: false, type: '数字' },
    ],
    items: [],
  },
  '6035815c29fa5fe075fb2ac78e923b82': {
    type: '性别',
    label: '性别',
    schemaPath: ['测试环境来的Schema', '性别'],
    md5: '6035815c29fa5fe075fb2ac78e923b82',
    required: false,
    multiple: false,
    attributes: [
      { name: '性别', multiple: false, required: false, type: '性别' },
    ],
    items: [],
  },
};

export const answer2 = {
  '16dff6bd9a39924209a59eb1202e4247': {
    type: 'listing rules',
    label: 'listing rules',
    schemaPath: ['listing rules'],
    md5: '16dff6bd9a39924209a59eb1202e4247',
    attributes: [],
    items: [],
  },
  '589268311469aa650158ad46260939de': {
    type: '是/否',
    label: 'A1',
    schemaPath: ['listing rules', 'A1'],
    md5: '589268311469aa650158ad46260939de',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A1', multiple: true, required: false, type: '是/否' },
    ],
    items: [],
  },
  '377ee5586646f397be1c288b4e4b05f2': {
    type: '是/否',
    label: 'A2',
    schemaPath: ['listing rules', 'A2'],
    md5: '377ee5586646f397be1c288b4e4b05f2',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A2', multiple: true, required: false, type: '是/否' },
    ],
    items: [
      {
        fields: [],
        schemaMD5: '377ee5586646f397be1c288b4e4b05f2',
        enumLabel: '是',
      },
    ],
  },
  '3f95b5f91ae199c95ccdf8ee01d4dc11': {
    type: '文本',
    label: 'A3',
    schemaPath: ['listing rules', 'A3'],
    md5: '3f95b5f91ae199c95ccdf8ee01d4dc11',
    required: false,
    multiple: true,
    attributes: [{ name: 'A3', multiple: true, required: false, type: '文本' }],
    items: [
      {
        schemaMD5: '3f95b5f91ae199c95ccdf8ee01d4dc11',
        fields: [
          {
            components: [
              {
                frameData: {
                  left: '48.7360',
                  top: '57.4389',
                  topleft: ['57.4389', '48.7360'],
                  width: '88.7692',
                  height: '33.9412',
                  type: 'A3',
                  id: 'page4:1539311231000',
                  page: 3,
                },
                text: 'CONTENT',
              },
            ],
            name: 'A3',
            label: 'CONTENT',
          },
        ],
      },
      {
        schemaMD5: '3f95b5f91ae199c95ccdf8ee01d4dc11',
        fields: [
          {
            components: [
              {
                frameData: {
                  left: '40.2000',
                  top: '106.8000',
                  topleft: ['106.8000', '40.2000'],
                  width: '142.8000',
                  height: '18.6000',
                  type: 'A3',
                  id: 'page4:1539329636000',
                  page: 3,
                },
                text: '1.DEFINITION',
              },
            ],
            name: 'A3',
            label: '1.DEFINITION',
          },
        ],
      },
    ],
  },
  feff7b0dcb8a376bd74dcc8cda1d818b: {
    type: '文本',
    label: 'A4',
    schemaPath: ['listing rules', 'A4'],
    md5: 'feff7b0dcb8a376bd74dcc8cda1d818b',
    required: false,
    multiple: true,
    attributes: [{ name: 'A4', multiple: true, required: false, type: '文本' }],
    items: [],
  },
  '7900583a0b1f2d7cb8eeec58e8d8a288': {
    type: '文本',
    label: 'A5',
    schemaPath: ['listing rules', 'A5'],
    md5: '7900583a0b1f2d7cb8eeec58e8d8a288',
    required: false,
    multiple: true,
    attributes: [{ name: 'A5', multiple: true, required: false, type: '文本' }],
    items: [],
  },
  '4726a82e8b01936774df6425c35bad40': {
    type: '文本',
    label: 'A6',
    schemaPath: ['listing rules', 'A6'],
    md5: '4726a82e8b01936774df6425c35bad40',
    required: false,
    multiple: true,
    attributes: [{ name: 'A6', multiple: true, required: false, type: '文本' }],
    items: [],
  },
  '762862dc7af22a74a3a124c43819bf55': {
    type: 'A7',
    label: 'A7',
    schemaPath: ['listing rules', 'A7'],
    md5: '762862dc7af22a74a3a124c43819bf55',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A7.1', multiple: true, required: false, type: '文本' },
      { name: 'A7.2', multiple: true, required: false, type: '文本' },
      { name: 'A7.3', multiple: true, required: false, type: '文本' },
    ],
    items: [
      {
        fields: [
          { components: [], label: '', name: 'A7.1', type: '文本' },
          { components: [], label: '', name: 'A7.2', type: '文本' },
          { components: [], label: '', name: 'A7.3', type: '文本' },
        ],
        schemaMD5: '762862dc7af22a74a3a124c43819bf55',
      },
    ],
  },
};

export const answerA33 = {
  '4d0908fbffb3175d374b36f98f4cb1a2': {
    type: 'LRs',
    label: 'LRs',
    schemaPath: ['LRs'],
    md5: '4d0908fbffb3175d374b36f98f4cb1a2',
    attributes: [],
    items: [],
  },
  '55622a7fe414dbb873986be9ca331fe0': {
    type: 'D/NS/N',
    label: 'A1',
    schemaPath: ['LRs', 'A1'],
    md5: '55622a7fe414dbb873986be9ca331fe0',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A1', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  cbd73d3b857ae4d6907ec37b4502b6df: {
    type: 'D/NS/N',
    label: 'A2',
    schemaPath: ['LRs', 'A2'],
    md5: 'cbd73d3b857ae4d6907ec37b4502b6df',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A2', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [
      {
        schemaMD5: 'cbd73d3b857ae4d6907ec37b4502b6df',
        fields: [
          {
            components: [
              {
                frameData: {
                  left: '92.9687',
                  top: '72.8875',
                  topleft: ['72.8875', '92.9687'],
                  width: '418.7312',
                  height: '110.0750',
                  type: 'A2',
                  id: 'page1:1539654709000',
                  page: 0,
                },
                text:
                  '重要提示:发行人确认截至本募集说明书封面载明日期,本募集说明书不存在虚假记载、重大\n遗漏及误导性陈述投资者购买本期债券应当认真阅读本募集说明书及有关的信息披露文件,\n进行独立的投资判断。有关主管机关对本期债券发行的批准,并不表明其对本期债券的投资价\n值作出了任何评价,也不表明对本期债券的投资风险作出了任何判断',
              },
            ],
            name: 'A2',
            label:
              '重要提示:发行人确认截至本募集说明书封面载明日期,本募集说明书不存在虚假记载、重大\n遗漏及误导性陈述投资者购买本期债券应当认真阅读本募集说明书及有关的信息披露文件,\n进行独立的投资判断。有关主管机关对本期债券发行的批准,并不表明其对本期债券的投资价\n值作出了任何评价,也不表明对本期债券的投资风险作出了任何判断',
          },
        ],
      },
    ],
    conflictNum: 1,
  },
  '4fdd42289a3935ebf0dce1859102466d': {
    type: 'D/NS/N',
    label: 'A3',
    schemaPath: ['LRs', 'A3'],
    md5: '4fdd42289a3935ebf0dce1859102466d',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A3', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '852ddfd43c27f4041daf0d6343401b56': {
    type: 'D/NS/N',
    label: 'A4',
    schemaPath: ['LRs', 'A4'],
    md5: '852ddfd43c27f4041daf0d6343401b56',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A4', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  f6c1d5cbd96bfee2501b32415a564dda: {
    type: 'D/NS/N',
    label: 'A5',
    schemaPath: ['LRs', 'A5'],
    md5: 'f6c1d5cbd96bfee2501b32415a564dda',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A5', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  fb154e94b84d507b40ddf6bd137937dc: {
    type: 'D/NS/N',
    label: 'A6',
    schemaPath: ['LRs', 'A6'],
    md5: 'fb154e94b84d507b40ddf6bd137937dc',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A6', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
    conflictNum: 1,
  },
  '14f853960458d8582fa87d245c0ca158': {
    type: 'D/NS/N',
    label: 'A7',
    schemaPath: ['LRs', 'A7'],
    md5: '14f853960458d8582fa87d245c0ca158',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A7', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '1c2abe3ba78ef57dbd6437941e28b9a0': {
    type: 'D/NS/N',
    label: 'A8',
    schemaPath: ['LRs', 'A8'],
    md5: '1c2abe3ba78ef57dbd6437941e28b9a0',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A8', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '9de1725bc2bf09e94ccdef80d87e5bda': {
    type: 'D/NS/N',
    label: 'A9',
    schemaPath: ['LRs', 'A9'],
    md5: '9de1725bc2bf09e94ccdef80d87e5bda',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A9', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  ee6df835798bd6f92eb956f51b401800: {
    type: 'A10',
    label: 'A10',
    schemaPath: ['LRs', 'A10'],
    md5: 'ee6df835798bd6f92eb956f51b401800',
    required: false,
    multiple: true,
    attributes: [
      {
        name: 'Name of every subsidiary',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      {
        name: 'Country of operation',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      {
        name: 'Country of incorporation',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      {
        name: ' If incorporated in the PRC, the kind of legal entity',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      {
        name: 'Particulars of the issued share capital',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      {
        name: 'Debt securities of every subsidiary',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
    ],
    items: [
      {
        fields: [
          {
            components: [],
            label: '',
            name: 'Name of every subsidiary',
            type: 'D/NS/N',
          },
          {
            components: [],
            label: '',
            name: 'Country of operation',
            type: 'D/NS/N',
          },
          {
            components: [],
            label: '',
            name: 'Country of incorporation',
            type: 'D/NS/N',
          },
          {
            components: [],
            label: '',
            name: ' If incorporated in the PRC, the kind of legal entity',
            type: 'D/NS/N',
          },
          {
            components: [],
            label: '',
            name: 'Particulars of the issued share capital',
            type: 'D/NS/N',
          },
          {
            components: [],
            label: '',
            name: 'Debt securities of every subsidiary',
            type: 'D/NS/N',
          },
        ],
        schemaMD5: 'ee6df835798bd6f92eb956f51b401800',
      },
    ],
  },
  '0dac6231926962eacebc061b8e26c2ea': {
    type: 'A11',
    label: 'A11',
    schemaPath: ['LRs', 'A11'],
    md5: '0dac6231926962eacebc061b8e26c2ea',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A11.1', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A11.2', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A11.3', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [
      {
        fields: [
          { components: [], label: '', name: 'A11.1', type: 'D/NS/N' },
          { components: [], label: '', name: 'A11.2', type: 'D/NS/N' },
          { components: [], label: '', name: 'A11.3', type: 'D/NS/N' },
        ],
        schemaMD5: '0dac6231926962eacebc061b8e26c2ea',
      },
    ],
  },
  '5f1a10b42e2c2aee40c8fae2223540a0': {
    type: 'A12',
    label: 'A12',
    schemaPath: ['LRs', 'A12'],
    md5: '5f1a10b42e2c2aee40c8fae2223540a0',
    required: false,
    multiple: true,
    attributes: [
      {
        name: 'List of directors',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      { name: 'Biography', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [
      {
        fields: [
          {
            components: [],
            label: '',
            name: 'List of directors',
            type: 'D/NS/N',
          },
          { components: [], label: '', name: 'Biography', type: 'D/NS/N' },
        ],
        schemaMD5: '5f1a10b42e2c2aee40c8fae2223540a0',
      },
    ],
  },
  '276a3530e4308ad6f36dfc7810269a40': {
    type: 'D/NS/N',
    label: 'A13',
    schemaPath: ['LRs', 'A13'],
    md5: '276a3530e4308ad6f36dfc7810269a40',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A13', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  b7bcead16024b3ee5fba6f1091b2389f: {
    type: 'D/NS/N',
    label: 'A14',
    schemaPath: ['LRs', 'A14'],
    md5: 'b7bcead16024b3ee5fba6f1091b2389f',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A14', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  a234547b9489581e03fed3db1f3fa0a5: {
    type: 'D/NS/N',
    label: 'A15',
    schemaPath: ['LRs', 'A15'],
    md5: 'a234547b9489581e03fed3db1f3fa0a5',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A15', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  fbc22c13ad39f4d3c24dd2384400b9cc: {
    type: 'D/NS/N',
    label: 'A16',
    schemaPath: ['LRs', 'A16'],
    md5: 'fbc22c13ad39f4d3c24dd2384400b9cc',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A16', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '03b47234a87942e26ad5355a02dc85e9': {
    type: 'D/NS/N',
    label: 'A17',
    schemaPath: ['LRs', 'A17'],
    md5: '03b47234a87942e26ad5355a02dc85e9',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A17', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  e405bd7c51785bee36cc42d638e8cc88: {
    type: 'D/NS/N',
    label: 'A18',
    schemaPath: ['LRs', 'A18'],
    md5: 'e405bd7c51785bee36cc42d638e8cc88',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A18', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  b2b9c2e5ff83433b80cfcbbc0353dbdf: {
    type: 'A19',
    label: 'A19',
    schemaPath: ['LRs', 'A19'],
    md5: 'b2b9c2e5ff83433b80cfcbbc0353dbdf',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A19.1', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A19.2', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [
      {
        fields: [
          { components: [], label: '', name: 'A19.1', type: 'D/NS/N' },
          { components: [], label: '', name: 'A19.2', type: 'D/NS/N' },
        ],
        schemaMD5: 'b2b9c2e5ff83433b80cfcbbc0353dbdf',
      },
    ],
  },
  '48e7d13479b4795a1246fbfad1115763': {
    type: 'D/NS/N',
    label: 'A20',
    schemaPath: ['LRs', 'A20'],
    md5: '48e7d13479b4795a1246fbfad1115763',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A20', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '74f8a83d40a5f2b5a592833ca1394045': {
    type: 'A21',
    label: 'A21',
    schemaPath: ['LRs', 'A21'],
    md5: '74f8a83d40a5f2b5a592833ca1394045',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A21.1', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A21.2', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A21.3', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A21.4', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A21.5', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [
      {
        fields: [
          { components: [], label: '', name: 'A21.1', type: 'D/NS/N' },
          { components: [], label: '', name: 'A21.2', type: 'D/NS/N' },
          { components: [], label: '', name: 'A21.3', type: 'D/NS/N' },
          { components: [], label: '', name: 'A21.4', type: 'D/NS/N' },
          { components: [], label: '', name: 'A21.5', type: 'D/NS/N' },
        ],
        schemaMD5: '74f8a83d40a5f2b5a592833ca1394045',
      },
    ],
  },
  '6e6ed22156a145885dc528ab2fd109bd': {
    type: 'D/NS/N',
    label: 'A22',
    schemaPath: ['LRs', 'A22'],
    md5: '6e6ed22156a145885dc528ab2fd109bd',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A22', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  a1fc0713d58412148c94c9522bd11af4: {
    type: 'D/NS/N',
    label: 'A23',
    schemaPath: ['LRs', 'A23'],
    md5: 'a1fc0713d58412148c94c9522bd11af4',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A23', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  ce0c2bc50143e8e3f15ca93e19b26bcc: {
    type: 'A24',
    label: 'A24',
    schemaPath: ['LRs', 'A24'],
    md5: 'ce0c2bc50143e8e3f15ca93e19b26bcc',
    required: false,
    multiple: true,
    attributes: [
      {
        name: 'Table for related party transaction',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      { name: 'Details', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [
      {
        fields: [
          {
            components: [],
            label: '',
            name: 'Table for related party transaction',
            type: 'D/NS/N',
          },
          { components: [], label: '', name: 'Details', type: 'D/NS/N' },
        ],
        schemaMD5: 'ce0c2bc50143e8e3f15ca93e19b26bcc',
      },
    ],
  },
  '6cdbd2846df7034f6bf62f57dc117403': {
    type: 'D/NS/N',
    label: 'A25',
    schemaPath: ['LRs', 'A25'],
    md5: '6cdbd2846df7034f6bf62f57dc117403',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A25', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '4f078c2d7aa5df5ab81fee975e777d7e': {
    type: 'D/NS/N',
    label: 'A26',
    schemaPath: ['LRs', 'A26'],
    md5: '4f078c2d7aa5df5ab81fee975e777d7e',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A26', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '7cda96ae6f0d4c4b45aa412b39e81b05': {
    type: 'D/NS/N',
    label: 'A27',
    schemaPath: ['LRs', 'A27'],
    md5: '7cda96ae6f0d4c4b45aa412b39e81b05',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A27', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '14876b40d5252b081bc9d341a8e3c67c': {
    type: 'A28',
    label: 'A28',
    schemaPath: ['LRs', 'A28'],
    md5: '14876b40d5252b081bc9d341a8e3c67c',
    required: false,
    multiple: true,
    attributes: [
      {
        name:
          'whether the annual reports disclosed the fulfilment of profit guarantee',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      {
        name: ' Shortfall of the profit guarantee',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
      {
        name:
          '  disclosure of whether the counterparty compensates the shortfall of profit guarantee',
        multiple: true,
        required: false,
        type: 'D/NS/N',
      },
    ],
    items: [
      {
        fields: [
          {
            components: [],
            label: '',
            name:
              'whether the annual reports disclosed the fulfilment of profit guarantee',
            type: 'D/NS/N',
          },
          {
            components: [],
            label: '',
            name: ' Shortfall of the profit guarantee',
            type: 'D/NS/N',
          },
          {
            components: [],
            label: '',
            name:
              '  disclosure of whether the counterparty compensates the shortfall of profit guarantee',
            type: 'D/NS/N',
          },
        ],
        schemaMD5: '14876b40d5252b081bc9d341a8e3c67c',
      },
    ],
  },
  '5fed68f9a2bb9f6e73e724201186f377': {
    type: 'A29',
    label: 'A29',
    schemaPath: ['LRs', 'A29'],
    md5: '5fed68f9a2bb9f6e73e724201186f377',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A29.1', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A29.2', multiple: true, required: false, type: 'D/NS/N' },
      { name: 'A29.3', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [
      {
        fields: [
          { components: [], label: '', name: 'A29.1', type: 'D/NS/N' },
          { components: [], label: '', name: 'A29.2', type: 'D/NS/N' },
          { components: [], label: '', name: 'A29.3', type: 'D/NS/N' },
        ],
        schemaMD5: '5fed68f9a2bb9f6e73e724201186f377',
      },
    ],
  },
  '653fbb1322d34df21db22237f8b24ffa': {
    type: 'D/NS/N',
    label: 'A30',
    schemaPath: ['LRs', 'A30'],
    md5: '653fbb1322d34df21db22237f8b24ffa',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A30', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '57271076057cb476b14a8af6d75ed4ec': {
    type: 'D/NS/N',
    label: 'A31',
    schemaPath: ['LRs', 'A31'],
    md5: '57271076057cb476b14a8af6d75ed4ec',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A31', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  '908786b89c9d422a3236ec0ad3abe1b3': {
    type: 'D/NS/N',
    label: 'A32',
    schemaPath: ['LRs', 'A32'],
    md5: '908786b89c9d422a3236ec0ad3abe1b3',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A32', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
  fe1f96e934742fcd3f8c35c1035c29b1: {
    type: 'D/NS/N',
    label: 'A33',
    schemaPath: ['LRs', 'A33'],
    md5: 'fe1f96e934742fcd3f8c35c1035c29b1',
    required: false,
    multiple: true,
    attributes: [
      { name: 'A33', multiple: true, required: false, type: 'D/NS/N' },
    ],
    items: [],
  },
};

export const lrsAnswer = {
  items: [
    {
      key: '["LRs","A1"]',
      schema: {
        data: {
          label: 'A1',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: 'A1 description',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 204,
                box_top: 89.4737,
                box_right: 256.7895,
                box_bottom: 119.89479999999999,
              },
              page: 0,
              text: 'Font',
            },
          ],
          value: 'no disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A2"]',
      schema: {
        data: {
          label: 'A2',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 40.2632,
                box_top: 78.7368,
                box_right: 80.5264,
                box_bottom: 122.5789,
              },
              page: 0,
              text: 'Get',
            },
            {
              box: {
                box_left: 161.0526,
                box_top: 77.8421,
                box_right: 203.10520000000002,
                box_bottom: 123.47370000000001,
              },
              page: 0,
              text: 'w ith',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 159.2632,
                box_top: 142.2632,
                box_right: 175.3685,
                box_bottom: 168.2106,
              },
              page: 0,
              text: 'be',
            },
            {
              box: {
                box_left: 203.1053,
                box_top: 143.1579,
                box_right: 235.3158,
                box_bottom: 167.31580000000002,
              },
              page: 0,
              text: 'y our',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A3"]',
      schema: {
        data: {
          label: 'A3',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: 'A3 description',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 495.6,
                box_top: 121.8,
                box_right: 581.4,
                box_bottom: 151.2,
              },
              page: 0,
              text: 'our icons',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A4"]',
      schema: {
        data: {
          label: 'A4',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 469.2,
                box_top: 119.4,
                box_right: 574.8,
                box_bottom: 156.60000000000002,
              },
              page: 0,
              text: 'use our icons\notosho',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A5"]',
      schema: {
        data: {
          label: 'A5',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 460.8,
                box_top: 115.8,
                box_right: 569.4,
                box_bottom: 156.6,
              },
              page: 0,
              text: 'o use our icons\nhotosho',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 262.8,
                box_top: 84.6,
                box_right: 377.4,
                box_bottom: 119.39999999999999,
              },
              page: 0,
              text: 'Awesome',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 455.4,
                box_top: 250.2,
                box_right: 523.8,
                box_bottom: 277.8,
              },
              page: 0,
              text: 'dw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A6"]',
      schema: {
        data: {
          label: 'A6',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
    {
      key: '["LRs","A7"]',
      schema: {
        data: {
          label: 'A7',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
    {
      key: '["LRs","A8"]',
      schema: {
        data: {
          label: 'A8',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 458.4,
                box_top: 246,
                box_right: 522.6,
                box_bottom: 281.4,
              },
              page: 0,
              text: 'w ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 381,
                box_top: 241.2,
                box_right: 458.4,
                box_bottom: 279.59999999999997,
              },
              page: 0,
              text: 'deA PI. Get started',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A9"]',
      schema: {
        data: {
          label: 'A9',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
    {
      key: '["LRs","A10","Name of every subsidiary"]',
      schema: {
        data: {
          label: 'Name of every subsidiary',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 411.6,
                box_top: 253.2,
                box_right: 516.6,
                box_bottom: 273.59999999999997,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A10","Country of operation"]',
      schema: {
        data: {
          label: 'Country of operation',
          required: false,
          type: 'D/NS/N',
          words: 'country of operation description',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 412.8,
                box_top: 257.4,
                box_right: 526.8,
                box_bottom: 269.4,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key:
        '["LRs","A10"," If incorporated in the PRC, the kind of legal entity"]',
      schema: {
        data: {
          label: ' If incorporated in the PRC, the kind of legal entity',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 404.4,
                box_top: 250.8,
                box_right: 520.8,
                box_bottom: 276.6,
              },
              page: 0,
              text: 'I. Get startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A10","Debt securities of every subsidiary"]',
      schema: {
        data: {
          label: 'Debt securities of every subsidiary',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 419.4,
                box_top: 250.8,
                box_right: 527.4,
                box_bottom: 270,
              },
              page: 0,
              text: 'et startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A11","A11.1"]',
      schema: {
        data: { label: 'A11.1', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 408,
                box_top: 248.4,
                box_right: 531.6,
                box_bottom: 274.8,
              },
              page: 0,
              text: '. Get startedw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 286.2,
                box_top: 390,
                box_right: 415.2,
                box_bottom: 418.8,
              },
              page: 0,
              text: 'ie hards ando lder browsers',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A11","A11.2"]',
      schema: {
        data: { label: 'A11.2', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 338.4,
                box_top: 391.8,
                box_right: 415.79999999999995,
                box_bottom: 413.40000000000003,
              },
              page: 0,
              text: 'o lder browsers',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A11","A11.3"]',
      schema: {
        data: { label: 'A11.3', required: false, type: 'D/NS/N', words: '' },
      },
      data: [{ boxes: [], value: 'disclosure', handleType: 'wireframe' }],
    },
    {
      key: '["LRs","A12","List of directors"]',
      schema: {
        data: {
          label: 'List of directors',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 289.8,
                box_top: 501,
                box_right: 397.20000000000005,
                box_bottom: 528.6,
              },
              page: 0,
              text: 'g ligatures andv ectors',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A24","Table for related party transaction"]',
      schema: {
        data: {
          label: 'Table for related party transaction',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 458.4,
                box_top: 252,
                box_right: 528.6,
                box_bottom: 274.8,
              },
              page: 0,
              text: 'w ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A24","Details"]',
      schema: {
        data: { label: 'Details', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 465.6,
                box_top: 247.2,
                box_right: 525,
                box_bottom: 280.8,
              },
              page: 0,
              text: 'with $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A24","Table for related party transaction"]',
      schema: {
        data: {
          label: 'Table for related party transaction',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 457.2,
                box_top: 249,
                box_right: 523.8,
                box_bottom: 277.8,
              },
              page: 0,
              text: 'dw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 204.6,
                box_top: 95.4,
                box_right: 381,
                box_bottom: 121.80000000000001,
              },
              page: 0,
              text: 'Font Awesome',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A24","Details"]',
      schema: {
        data: { label: 'Details', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 409.8,
                box_top: 246,
                box_right: 522,
                box_bottom: 280.2,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A24","Table for related party transaction"]',
      schema: {
        data: {
          label: 'Table for related party transaction',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 414,
                box_top: 247.2,
                box_right: 547.2,
                box_bottom: 279.59999999999997,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 317.4,
                box_top: 249.6,
                box_right: 399,
                box_bottom: 277.2,
              },
              page: 0,
              text: 'dw itht he LinodeA',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs","A25"]',
      schema: {
        data: {
          label: 'A25',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        { boxes: [], handleType: 'wireframe', value: 'negative statement' },
      ],
    },
    {
      key: '["LRs","A26"]',
      schema: {
        data: {
          label: 'A26',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
  ],
};

export const lrsAnswerWithIndex = {
  items: [
    {
      key: '["LRs:0","A1:0"]',
      schema: {
        data: {
          label: 'A1',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: 'A1 description',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 204,
                box_top: 89.4737,
                box_right: 256.7895,
                box_bottom: 119.89479999999999,
              },
              page: 0,
              text: 'Font',
            },
          ],
          value: 'no disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A2:0"]',
      schema: {
        data: {
          label: 'A2',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 40.2632,
                box_top: 78.7368,
                box_right: 80.5264,
                box_bottom: 122.5789,
              },
              page: 0,
              text: 'Get',
            },
            {
              box: {
                box_left: 161.0526,
                box_top: 77.8421,
                box_right: 203.10520000000002,
                box_bottom: 123.47370000000001,
              },
              page: 0,
              text: 'w ith',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 159.2632,
                box_top: 142.2632,
                box_right: 175.3685,
                box_bottom: 168.2106,
              },
              page: 0,
              text: 'be',
            },
            {
              box: {
                box_left: 203.1053,
                box_top: 143.1579,
                box_right: 235.3158,
                box_bottom: 167.31580000000002,
              },
              page: 0,
              text: 'y our',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A3:0"]',
      schema: {
        data: {
          label: 'A3',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: 'A3 description',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 495.6,
                box_top: 121.8,
                box_right: 581.4,
                box_bottom: 151.2,
              },
              page: 0,
              text: 'our icons',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A4:0"]',
      schema: {
        data: {
          label: 'A4',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 469.2,
                box_top: 119.4,
                box_right: 574.8,
                box_bottom: 156.60000000000002,
              },
              page: 0,
              text: 'use our icons\notosho',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A5:0"]',
      schema: {
        data: {
          label: 'A5',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 460.8,
                box_top: 115.8,
                box_right: 569.4,
                box_bottom: 156.6,
              },
              page: 0,
              text: 'o use our icons\nhotosho',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 262.8,
                box_top: 84.6,
                box_right: 377.4,
                box_bottom: 119.39999999999999,
              },
              page: 0,
              text: 'Awesome',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 455.4,
                box_top: 250.2,
                box_right: 523.8,
                box_bottom: 277.8,
              },
              page: 0,
              text: 'dw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A6:0"]',
      schema: {
        data: {
          label: 'A6',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
    {
      key: '["LRs:0","A7:0"]',
      schema: {
        data: {
          label: 'A7',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
    {
      key: '["LRs:0","A8:0"]',
      schema: {
        data: {
          label: 'A8',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 458.4,
                box_top: 246,
                box_right: 522.6,
                box_bottom: 281.4,
              },
              page: 0,
              text: 'w ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 381,
                box_top: 241.2,
                box_right: 458.4,
                box_bottom: 279.59999999999997,
              },
              page: 0,
              text: 'deA PI. Get started',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A9:0"]',
      schema: {
        data: {
          label: 'A9',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
    {
      key: '["LRs:0","A10:0","Name of every subsidiary:0"]',
      schema: {
        data: {
          label: 'Name of every subsidiary',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 411.6,
                box_top: 253.2,
                box_right: 516.6,
                box_bottom: 273.59999999999997,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A10:0","Country of operation:0"]',
      schema: {
        data: {
          label: 'Country of operation',
          required: false,
          type: 'D/NS/N',
          words: 'country of operation description',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 412.8,
                box_top: 257.4,
                box_right: 526.8,
                box_bottom: 269.4,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key:
        '["LRs:0","A10:0"," If incorporated in the :0PRC, the kind of legal entity:0"]',
      schema: {
        data: {
          label: ' If incorporated in the PRC, the kind of legal entity',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 404.4,
                box_top: 250.8,
                box_right: 520.8,
                box_bottom: 276.6,
              },
              page: 0,
              text: 'I. Get startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A10:0","Debt securities of every subsidiary:0"]',
      schema: {
        data: {
          label: 'Debt securities of every subsidiary',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 419.4,
                box_top: 250.8,
                box_right: 527.4,
                box_bottom: 270,
              },
              page: 0,
              text: 'et startedw ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A11:0","A11.1:0"]',
      schema: {
        data: { label: 'A11.1', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 408,
                box_top: 248.4,
                box_right: 531.6,
                box_bottom: 274.8,
              },
              page: 0,
              text: '. Get startedw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 286.2,
                box_top: 390,
                box_right: 415.2,
                box_bottom: 418.8,
              },
              page: 0,
              text: 'ie hards ando lder browsers',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A11:0","A11.2:0"]',
      schema: {
        data: { label: 'A11.2', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 338.4,
                box_top: 391.8,
                box_right: 415.79999999999995,
                box_bottom: 413.40000000000003,
              },
              page: 0,
              text: 'o lder browsers',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A11:0","A11.3:0"]',
      schema: {
        data: { label: 'A11.3', required: false, type: 'D/NS/N', words: '' },
      },
      data: [{ boxes: [], value: 'disclosure', handleType: 'wireframe' }],
    },
    {
      key: '["LRs:0","A12:0","List of directors:0"]',
      schema: {
        data: {
          label: 'List of directors',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 289.8,
                box_top: 501,
                box_right: 397.20000000000005,
                box_bottom: 528.6,
              },
              page: 0,
              text: 'g ligatures andv ectors',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A24:0","Table for related party transaction:0"]',
      schema: {
        data: {
          label: 'Table for related party transaction',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 458.4,
                box_top: 252,
                box_right: 528.6,
                box_bottom: 274.8,
              },
              page: 0,
              text: 'w ith $20f ree',
            },
          ],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A24:0","Details:0"]',
      schema: {
        data: { label: 'Details', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 465.6,
                box_top: 247.2,
                box_right: 525,
                box_bottom: 280.8,
              },
              page: 0,
              text: 'with $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A24:0","Table for related party transaction:0"]',
      schema: {
        data: {
          label: 'Table for related party transaction',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 457.2,
                box_top: 249,
                box_right: 523.8,
                box_bottom: 277.8,
              },
              page: 0,
              text: 'dw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 204.6,
                box_top: 95.4,
                box_right: 381,
                box_bottom: 121.80000000000001,
              },
              page: 0,
              text: 'Font Awesome',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A24:0","Details:0"]',
      schema: {
        data: { label: 'Details', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 409.8,
                box_top: 246,
                box_right: 522,
                box_bottom: 280.2,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A24:0","Table for related party transaction:0"]',
      schema: {
        data: {
          label: 'Table for related party transaction',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [
            {
              box: {
                box_left: 414,
                box_top: 247.2,
                box_right: 547.2,
                box_bottom: 279.59999999999997,
              },
              page: 0,
              text: 'Get startedw ith $20f ree',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
        {
          boxes: [
            {
              box: {
                box_left: 317.4,
                box_top: 249.6,
                box_right: 399,
                box_bottom: 277.2,
              },
              page: 0,
              text: 'dw itht he LinodeA',
            },
          ],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A25:0"]',
      schema: {
        data: {
          label: 'A25',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        { boxes: [], handleType: 'wireframe', value: 'negative statement' },
      ],
    },
    {
      key: '["LRs:0","A26:0"]',
      schema: {
        data: {
          label: 'A26',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [{ boxes: [], handleType: 'wireframe', value: 'disclosure' }],
    },
  ],
};

export const lrsAnswerWithFakeIndex = {
  version: '2.2',
  items: [
    {
      key: '["LRs:0","A1:0"]',
      schema: {
        data: {
          label: 'A1',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: 'A1 description',
        },
      },
      data: [
        {
          boxes: [],
          value: 'no disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A1:1"]',
      schema: {
        data: {
          label: 'A1',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: 'A1 description',
        },
      },
      data: [
        {
          boxes: [],
          value: 'no disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A1:2"]',
      schema: {
        data: {
          label: 'A1',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: 'A1 description',
        },
      },
      data: [
        {
          boxes: [],
          value: 'no disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A2:0"]',
      schema: {
        data: {
          label: 'A2',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        {
          boxes: [],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A10:0","Name of every subsidiary:0"]',
      schema: {
        data: {
          label: 'Name of every subsidiary',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A10:0","Country of operation:0"]',
      schema: {
        data: {
          label: 'Country of operation',
          required: false,
          type: 'D/NS/N',
          words: 'country of operation description',
        },
      },
      data: [
        {
          boxes: [],
          value: '',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A24:0","Details:0"]',
      schema: {
        data: { label: 'Details', required: false, type: 'D/NS/N', words: '' },
      },
      data: [
        {
          boxes: [],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A24:0","Table for related party transaction:0"]',
      schema: {
        data: {
          label: 'Table for related party transaction',
          required: false,
          type: 'D/NS/N',
          words: '',
        },
      },
      data: [
        {
          boxes: [],
          value: 'disclosure',
          handleType: 'wireframe',
        },
      ],
    },
    {
      key: '["LRs:0","A25:0"]',
      schema: {
        data: {
          label: 'A25',
          type: 'D/NS/N',
          multiple: true,
          required: false,
          words: '',
        },
      },
      data: [
        { boxes: [], handleType: 'wireframe', value: 'negative statement' },
      ],
    },
  ],
};
