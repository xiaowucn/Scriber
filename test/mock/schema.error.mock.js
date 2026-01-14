export default {
  schema_types: [
    {
      label: '\u5355\u5229\uff0c\u590d\u5229',
      type: 'enum',
      values: [
        { isDefault: false, name: '\u5355\u5229' },
        { isDefault: false, name: '\u590d\u5229' },
      ],
    },
    {
      label:
        '\u6309\u6708\u4ed8\u606f\uff0c\u6309\u5b63\u4ed8\u606f\uff0c\u534a\u5e74\u4ed8\u606f\uff0c\u6309\u5e74\u4ed8\u606f',
      type: 'enum',
      values: [
        { isDefault: false, name: '\u6309\u6708\u4ed8\u606f' },
        { isDefault: false, name: '\u6309\u5b63\u4ed8\u606f' },
        { isDefault: false, name: '\u534a\u5e74\u4ed8\u606f' },
        { isDefault: false, name: '\u6309\u5e74\u4ed8\u606f' },
      ],
    },
    {
      label:
        '\u8bb0\u8d26\u5f0f\uff0c\u51ed\u8bc1\u5f0f\uff0c\u5b9e\u7269\u5238',
      type: 'enum',
      values: [],
    },
    {
      label:
        '\u4e3b\u627f\u9500\u5546\uff0c\u4fdd\u8350\u4eba\uff0c\u5206\u9500\u5546\uff0c\u6258\u7ba1\u4eba\uff0c\u7c3f\u8bb0\u573a\u6240\uff0c\u914d\u552e\u627f\u9500\u5546',
      type: 'enum',
      values: [
        { isDefault: false, name: '\u4e3b\u627f\u9500\u5546' },
        { isDefault: false, name: '\u4fdd\u8350\u4eba' },
        { isDefault: false, name: '\u5206\u9500\u5546' },
        { isDefault: false, name: '\u6258\u7ba1\u4eba' },
        { isDefault: false, name: '\u7c3f\u8bb0\u573a\u6240' },
        { isDefault: false, name: '\u914d\u552e\u627f\u9500\u5546' },
      ],
    },
  ],
  schemas: [
    {
      orders: [
        '\u4e2d\u56fd\u503a\u5238\u57fa\u672c\u8d44\u6599',
        '\u4e2d\u56fd\u503a\u5238\u8d4e\u56de\u548c\u56de\u552e\u6761\u6b3e',
        '\u4e2d\u56fd\u503a\u5238\u6d6e\u606f\u503a\u5238\u57fa\u7840\u5229\u7387\u5c5e\u6027',
        '\u4e2d\u56fd\u503a\u5238\u7279\u6b8a\u6761\u6b3e',
        '\u4e2d\u56fd\u503a\u5238\u4e2d\u4ecb\u673a\u6784',
        '\u4e2d\u56fd\u53ef\u8f6c\u503a\u6709\u6761\u4ef6\u56de\u552e\u4ef7\u683c\u548c\u89e6\u53d1\u6bd4\u4f8b',
      ],
      schema: {
        中国债券特殊条款: {
          type: '\u4e2d\u56fd\u503a\u5238\u7279\u6b8a\u6761\u6b3e',
          required: false,
          multi: true,
        },
        中国债券浮息债券基础利率属性: {
          type:
            '\u4e2d\u56fd\u503a\u5238\u6d6e\u606f\u503a\u5238\u57fa\u7840\u5229\u7387\u5c5e\u6027',
          required: false,
          multi: true,
        },
        中国债券赎回和回售条款: {
          type:
            '\u4e2d\u56fd\u503a\u5238\u8d4e\u56de\u548c\u56de\u552e\u6761\u6b3e',
          required: false,
          multi: true,
        },
        中国可转债有条件回售价格和触发比例: {
          type:
            '\u4e2d\u56fd\u53ef\u8f6c\u503a\u6709\u6761\u4ef6\u56de\u552e\u4ef7\u683c\u548c\u89e6\u53d1\u6bd4\u4f8b',
          required: false,
          multi: true,
        },
        中国债券基本资料: {
          type: '\u4e2d\u56fd\u503a\u5238\u57fa\u672c\u8d44\u6599',
          required: false,
          multi: true,
        },
        中国债券中介机构: {
          type: '\u4e2d\u56fd\u503a\u5238\u4e2d\u4ecb\u673a\u6784',
          required: false,
          multi: true,
        },
      },
      name: '\u4e2d\u56fd\u503a\u5238\u4fe1\u606f\u62bd\u53d6',
    },
    { orders: [], schema: {}, name: 'text' },
    {
      orders: [
        '\u503a\u5238\u540d\u79f0',
        '\u53d1\u884c\u4eba',
        '\u53d1\u884c\u516c\u544a\u65e5',
        '\u53d1\u884c\u8d77\u59cb\u65e5',
        '\u53d1\u884c\u622a\u6b62\u65e5',
        '\u8ba1\u5212\u53d1\u884c\u603b\u91cf',
        '\u5b9e\u9645\u53d1\u884c\u603b\u91cf',
        '\u53d1\u884c\u4ef7\u683c',
        '\u9762\u503c',
        '\u53d1\u884c\u7968\u9762\u5229\u7387',
        '\u5229\u5dee',
        '\u8ba1\u606f\u8d77\u59cb\u65e5',
        '\u8ba1\u606f\u622a\u6b62\u65e5',
        '\u5230\u671f\u65e5',
        '\u503a\u5238\u671f\u9650\uff08\u5929\uff09',
        '\u503a\u5238\u671f\u9650\uff08\u5e74\uff09',
        '\u5151\u4ed8\u65e5',
        '\u8ba1\u606f\u65b9\u5f0f',
        '\u4ed8\u606f\u9891\u7387',
        '\u503a\u5238\u5f62\u5f0f',
      ],
      schema: {
        计息起始日: { type: '\u65e5\u671f', required: false, multi: true },
        债券形式: {
          type:
            '\u8bb0\u8d26\u5f0f\uff0c\u51ed\u8bc1\u5f0f\uff0c\u5b9e\u7269\u5238',
          required: false,
          multi: true,
        },
        实际发行总量: { type: '\u6570\u5b57', required: false, multi: true },
        计息截止日: { type: '\u65e5\u671f', required: false, multi: true },
        计息方式: {
          type: '\u5355\u5229\uff0c\u590d\u5229',
          required: false,
          multi: true,
        },
        发行价格: { type: '\u6570\u5b57', required: false, multi: true },
        发行截止日: { type: '\u65e5\u671f', required: false, multi: true },
        发行起始日: { type: '\u65e5\u671f', required: false, multi: true },
        计划发行总量: { type: '\u6570\u5b57', required: false, multi: true },
        发行公告日: { type: '\u65e5\u671f', required: false, multi: true },
        '\u503a\u5238\u671f\u9650\uff08\u5929\uff09': {
          type: '\u65e5\u671f',
          required: false,
          multi: true,
        },
        兑付日: { type: '\u65e5\u671f', required: false, multi: true },
        发行票面利率: { type: '\u6570\u5b57', required: false, multi: true },
        到期日: { type: '\u65e5\u671f', required: false, multi: true },
        发行人: { type: '\u6587\u672c', required: false, multi: true },
        付息频率: {
          type:
            '\u6309\u6708\u4ed8\u606f\uff0c\u6309\u5b63\u4ed8\u606f\uff0c\u534a\u5e74\u4ed8\u606f\uff0c\u6309\u5e74\u4ed8\u606f',
          required: false,
          multi: true,
        },
        利差: { type: '\u6570\u5b57', required: false, multi: true },
        面值: { type: '\u6570\u5b57', required: false, multi: true },
        债券名称: { type: '\u6587\u672c', required: false, multi: true },
        '\u503a\u5238\u671f\u9650\uff08\u5e74\uff09': {
          type: '\u65e5\u671f',
          required: false,
          multi: true,
        },
      },
      name: '\u4e2d\u56fd\u503a\u5238\u57fa\u672c\u8d44\u6599',
    },
    {
      orders: [
        '\u4e2d\u56fd\u503a\u5238\u8d4e\u56de\u6761\u6b3e',
        '\u4e2d\u56fd\u503a\u5238\u56de\u552e\u6761\u6b3e',
      ],
      schema: {
        中国债券回售条款: {
          type: '\u4e2d\u56fd\u503a\u5238\u56de\u552e\u6761\u6b3e',
          required: false,
          multi: true,
        },
        中国债券赎回条款: {
          type: '\u4e2d\u56fd\u503a\u5238\u8d4e\u56de\u6761\u6b3e',
          required: false,
          multi: true,
        },
      },
      name:
        '\u4e2d\u56fd\u503a\u5238\u8d4e\u56de\u548c\u56de\u552e\u6761\u6b3e',
    },
    {
      orders: [
        '\u8d4e\u56de\u65e5',
        '\u6bcf\u767e\u5143\u9762\u503c\u8d4e\u56de\u4ef7\u683c\uff08\u5143\uff09',
        '\u8d4e\u56de\u516c\u544a\u65e5',
        '\u8d4e\u56de\u5c65\u884c\u7ed3\u679c\u516c\u544a\u65e5',
        '\u8d4e\u56de\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09',
        '\u7ee7\u7eed\u6258\u7ba1\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09',
      ],
      schema: {
        赎回公告日: { type: '\u65e5\u671f', required: false, multi: true },
        '\u7ee7\u7eed\u6258\u7ba1\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09': {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        赎回日: { type: '\u65e5\u671f', required: false, multi: true },
        '\u6bcf\u767e\u5143\u9762\u503c\u8d4e\u56de\u4ef7\u683c\uff08\u5143\uff09': {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        '\u8d4e\u56de\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09': {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        赎回履行结果公告日: {
          type: '\u65e5\u671f',
          required: false,
          multi: true,
        },
      },
      name: '\u4e2d\u56fd\u503a\u5238\u8d4e\u56de\u6761\u6b3e',
    },
    {
      orders: [
        '\u56de\u552e\u65e5',
        '\u6bcf\u767e\u5143\u9762\u503c\u56de\u552e\u4ef7\u683c\uff08\u5143\uff09',
        '\u56de\u552e\u516c\u544a\u65e5',
        '\u56de\u552e\u5c65\u884c\u7ed3\u679c\u516c\u544a\u65e5',
        '\u56de\u552e\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09',
        '\u7ee7\u7eed\u6258\u7ba1\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09',
        '\u56de\u552e\u884c\u4f7f\u5f00\u59cb\u65e5',
        '\u56de\u552e\u884c\u4f7f\u622a\u6b62\u65e5',
      ],
      schema: {
        '\u7ee7\u7eed\u6258\u7ba1\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09': {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        '\u6bcf\u767e\u5143\u9762\u503c\u56de\u552e\u4ef7\u683c\uff08\u5143\uff09': {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        回售日: { type: '\u65e5\u671f', required: false, multi: true },
        回售行使截止日: { type: '\u65e5\u671f', required: false, multi: true },
        回售履行结果公告日: {
          type: '\u65e5\u671f',
          required: false,
          multi: true,
        },
        '\u56de\u552e\u603b\u9762\u989d\uff08\u4ebf\u5143\uff09': {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        回售公告日: { type: '\u65e5\u671f', required: false, multi: true },
        回售行使开始日: { type: '\u65e5\u671f', required: false, multi: true },
      },
      name: '\u4e2d\u56fd\u503a\u5238\u56de\u552e\u6761\u6b3e',
    },
    {
      orders: [],
      schema: {},
      name:
        '\u4e2d\u56fd\u503a\u5238\u6d6e\u606f\u503a\u5238\u57fa\u7840\u5229\u7387\u5c5e\u6027',
    },
    {
      orders: [
        '\u6761\u6b3e\u7c7b\u578b',
        '\u8d4e\u56de\u4ef7/\u56de\u552e\u4ef7',
        '\u8d4e\u56de/\u56de\u552e\u65e5\u671f',
        '\u8d4e\u56de/\u56de\u552e\u544a\u77e5\u622a\u6b62\u65e5\u671f',
        '\u542b\u6743\u671f\u9650\u8bf4\u660e',
        '\u884c\u6743\u671f\u9650',
        '\u7968\u9762\u5229\u7387\u8c03\u6574\u4e0a\u9650',
        '\u7968\u9762\u5229\u7387\u8c03\u6574\u4e0b\u9650',
        '\u6761\u6b3e\u5185\u5bb9',
      ],
      schema: {
        票面利率调整下限: {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        行权期限: { type: '\u65e5\u671f', required: false, multi: true },
        '\u8d4e\u56de/\u56de\u552e\u544a\u77e5\u622a\u6b62\u65e5\u671f': {
          type: '\u65e5\u671f',
          required: false,
          multi: true,
        },
        含权期限说明: { type: '\u6587\u672c', required: false, multi: true },
        '\u8d4e\u56de/\u56de\u552e\u65e5\u671f': {
          type: '\u65e5\u671f',
          required: false,
          multi: true,
        },
        条款类型: { type: '\u6587\u672c', required: false, multi: true },
        票面利率调整上限: {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
        条款内容: { type: '\u6587\u672c', required: false, multi: true },
        '\u8d4e\u56de\u4ef7/\u56de\u552e\u4ef7': {
          type: '\u6570\u5b57',
          required: false,
          multi: true,
        },
      },
      name: '\u4e2d\u56fd\u503a\u5238\u7279\u6b8a\u6761\u6b3e',
    },
    {
      orders: ['\u673a\u6784\u540d\u79f0', '\u5173\u7cfb\u7c7b\u578b'],
      schema: {
        机构名称: { type: '\u6587\u672c', required: false, multi: true },
        关系类型: {
          type:
            '\u4e3b\u627f\u9500\u5546\uff0c\u4fdd\u8350\u4eba\uff0c\u5206\u9500\u5546\uff0c\u6258\u7ba1\u4eba\uff0c\u7c3f\u8bb0\u573a\u6240\uff0c\u914d\u552e\u627f\u9500\u5546',
          required: false,
          multi: true,
        },
      },
      name: '\u4e2d\u56fd\u503a\u5238\u4e2d\u4ecb\u673a\u6784',
    },
    {
      orders: [
        '\u4e2d\u56fd\u53ef\u8f6c\u503a\u6709\u6761\u4ef6\u56de\u552e\u4ef7\u683c\u548c\u89e6\u53d1\u6bd4\u4f8b',
      ],
      schema: {
        中国可转债有条件回售价格和触发比例: {
          type:
            '\u4e2d\u56fd\u53ef\u8f6c\u503a\u6709\u6761\u4ef6\u56de\u552e\u4ef7\u683c\u548c\u89e6\u53d1\u6bd4\u4f8b',
          required: false,
          multi: true,
        },
      },
      name:
        '\u4e2d\u56fd\u53ef\u8f6c\u503a\u6709\u6761\u4ef6\u56de\u552e\u4ef7\u683c\u548c\u89e6\u53d1\u6bd4\u4f8b',
    },
  ],
};
