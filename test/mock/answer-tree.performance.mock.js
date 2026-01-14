export const schema = {
  schema_types: [
    {
      label: '是否已有简历',
      values: [
        { name: '是', isDefault: false },
        { name: '否', isDefault: false },
      ],
      type: 'enum',
    },
    {
      label: '有/无重大诉讼事项',
      values: [
        { name: '有', isDefault: false },
        { name: '无', isDefault: false },
      ],
      type: 'enum',
    },
    {
      label: '合同类型',
      values: [
        { name: '销售', isDefault: false },
        { name: '采购', isDefault: false },
        { name: '借款', isDefault: false },
        { name: '其他', isDefault: false },
      ],
      type: 'enum',
    },
  ],
  schemas: [
    {
      name: 'No.01',
      orders: [
        '招股说明书名称',
        '释义',
        '发行人-公司名称',
        '发行人-法定代表人姓名',
        '发行人-统一社会信用代码',
        '发行人-组织机构代码',
        '发行人-成立日期',
        '发行人-注册资本',
        '发行人-注册地址',
        '发行人-办公地址',
        '发行人-电话',
        '发行人-传真号码',
        '发行人-电子邮箱',
        '发行人-邮政编码',
        '控股股东-法人',
        '控股股东-自然人',
        '控股股东-其他',
        '实际控制人-国有控股主体',
        '实际控制人-自然人',
        '实际控制人-其他',
        '董事基本情况',
        '监事基本情况',
        '高管基本情况',
        '核心技术人员基本情况',
        '合并资产负债表-报表日期',
        '合并资产负债表-货币单位',
        '合并资产负债表',
        '合并利润表-报表日期',
        '合并利润表-货币单位',
        '合并利润表',
        '合并现金流量表-报表日期',
        '合并现金流量表-货币单位',
        '合并现金流量表',
        '主要财务指标',
        '重大诉讼事项',
        '募集资金与运用',
        '专利',
        '主要客户',
        '主要供应商',
        '重大合同',
        '发行人所处行业',
        '盈利能力-收入-产品构成-报表日期',
        '盈利能力-收入-产品构成-货币单位',
        '盈利能力-收入-产品构成',
        '盈利能力-收入-业务构成-报表日期',
        '盈利能力-收入-业务构成-货币单位',
        '盈利能力-收入-业务构成',
        '盈利能力-成本-产品构成-报表日期',
        '盈利能力-成本-产品构成-货币单位',
        '盈利能力-成本-产品构成',
        '盈利能力-成本-业务构成-报表日期',
        '盈利能力-成本-业务构成-货币单位',
        '盈利能力-成本-业务构成',
      ],
      schema: {
        招股说明书名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '招股说明书名称',
          _index: 4343,
        },
        释义: {
          type: '文本',
          required: false,
          multi: true,
          name: '释义',
          _index: 4344,
        },
        '发行人-公司名称': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-公司名称',
          _index: 4345,
        },
        '发行人-法定代表人姓名': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-法定代表人姓名',
          _index: 4346,
        },
        '发行人-统一社会信用代码': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-统一社会信用代码',
          _index: 4347,
        },
        '发行人-组织机构代码': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-组织机构代码',
          _index: 4348,
        },
        '发行人-成立日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '发行人-成立日期',
          _index: 4349,
        },
        '发行人-注册资本': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-注册资本',
          _index: 4350,
        },
        '发行人-注册地址': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-注册地址',
          _index: 4351,
        },
        '发行人-办公地址': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-办公地址',
          _index: 4352,
        },
        '发行人-电话': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-电话',
          _index: 4353,
        },
        '发行人-传真号码': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-传真号码',
          _index: 4354,
        },
        '发行人-电子邮箱': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-电子邮箱',
          _index: 4355,
        },
        '发行人-邮政编码': {
          type: '文本',
          required: false,
          multi: true,
          name: '发行人-邮政编码',
          _index: 4356,
        },
        '控股股东-法人': {
          type: '控股股东-法人',
          required: false,
          multi: true,
          name: '控股股东-法人',
          _index: 4357,
        },
        '控股股东-自然人': {
          type: '控股股东-自然人',
          required: false,
          multi: true,
          name: '控股股东-自然人',
          _index: 4358,
        },
        '控股股东-其他': {
          type: '控股股东-其他',
          required: false,
          multi: true,
          name: '控股股东-其他',
          _index: 4359,
        },
        '实际控制人-国有控股主体': {
          type: '实际控制人-国有控股主体',
          required: false,
          multi: true,
          name: '实际控制人-国有控股主体',
          _index: 4360,
        },
        '实际控制人-自然人': {
          type: '实际控制人-自然人',
          required: false,
          multi: true,
          name: '实际控制人-自然人',
          _index: 4361,
        },
        '实际控制人-其他': {
          type: '实际控制人-其他',
          required: false,
          multi: true,
          name: '实际控制人-其他',
          _index: 4362,
        },
        董事基本情况: {
          type: '董事基本情况',
          required: false,
          multi: true,
          name: '董事基本情况',
          _index: 4363,
        },
        监事基本情况: {
          type: '监事基本情况',
          required: false,
          multi: true,
          name: '监事基本情况',
          _index: 4364,
        },
        高管基本情况: {
          type: '高管基本情况',
          required: false,
          multi: true,
          name: '高管基本情况',
          _index: 4365,
        },
        核心技术人员基本情况: {
          type: '核心技术人员基本情况',
          required: false,
          multi: true,
          name: '核心技术人员基本情况',
          _index: 4366,
        },
        '合并资产负债表-报表日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '合并资产负债表-报表日期',
          _index: 4367,
        },
        '合并资产负债表-货币单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '合并资产负债表-货币单位',
          _index: 4368,
        },
        合并资产负债表: {
          type: '文本',
          required: false,
          multi: true,
          name: '合并资产负债表',
          _index: 4369,
        },
        '合并利润表-报表日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '合并利润表-报表日期',
          _index: 4370,
        },
        '合并利润表-货币单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '合并利润表-货币单位',
          _index: 4371,
        },
        合并利润表: {
          type: '文本',
          required: false,
          multi: true,
          name: '合并利润表',
          _index: 4372,
        },
        '合并现金流量表-报表日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '合并现金流量表-报表日期',
          _index: 4373,
        },
        '合并现金流量表-货币单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '合并现金流量表-货币单位',
          _index: 4374,
        },
        合并现金流量表: {
          type: '文本',
          required: false,
          multi: true,
          name: '合并现金流量表',
          _index: 4375,
        },
        主要财务指标: {
          type: '主要财务指标',
          required: false,
          multi: true,
          name: '主要财务指标',
          _index: 4376,
        },
        重大诉讼事项: {
          type: '重大诉讼事项',
          required: false,
          multi: true,
          name: '重大诉讼事项',
          _index: 4377,
        },
        募集资金与运用: {
          type: '募集资金与运用',
          required: false,
          multi: true,
          name: '募集资金与运用',
          _index: 4378,
        },
        专利: {
          type: '专利',
          required: false,
          multi: true,
          name: '专利',
          _index: 4379,
        },
        主要客户: {
          type: '主要客户',
          required: false,
          multi: true,
          name: '主要客户',
          _index: 4380,
        },
        主要供应商: {
          type: '主要供应商',
          required: false,
          multi: true,
          name: '主要供应商',
          _index: 4381,
        },
        重大合同: {
          type: '重大合同',
          required: false,
          multi: true,
          name: '重大合同',
          _index: 4382,
        },
        发行人所处行业: {
          type: '发行人所处行业',
          required: false,
          multi: true,
          name: '发行人所处行业',
          _index: 4383,
        },
        '盈利能力-收入-产品构成-报表日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '盈利能力-收入-产品构成-报表日期',
          _index: 4384,
        },
        '盈利能力-收入-产品构成-货币单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '盈利能力-收入-产品构成-货币单位',
          _index: 4385,
        },
        '盈利能力-收入-产品构成': {
          type: '盈利能力-主营业务收入按产品构成分析',
          required: false,
          multi: true,
          name: '盈利能力-收入-产品构成',
          _index: 4386,
        },
        '盈利能力-收入-业务构成-报表日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '盈利能力-收入-业务构成-报表日期',
          _index: 4387,
        },
        '盈利能力-收入-业务构成-货币单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '盈利能力-收入-业务构成-货币单位',
          _index: 4388,
        },
        '盈利能力-收入-业务构成': {
          type: '盈利能力-主营业务收入按业务构成分析',
          required: false,
          multi: true,
          name: '盈利能力-收入-业务构成',
          _index: 4389,
        },
        '盈利能力-成本-产品构成-报表日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '盈利能力-成本-产品构成-报表日期',
          _index: 4390,
        },
        '盈利能力-成本-产品构成-货币单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '盈利能力-成本-产品构成-货币单位',
          _index: 4391,
        },
        '盈利能力-成本-产品构成': {
          type: '盈利能力-主营业务成本按产品构成分析',
          required: false,
          multi: true,
          name: '盈利能力-成本-产品构成',
          _index: 4392,
        },
        '盈利能力-成本-业务构成-报表日期': {
          type: '日期',
          required: false,
          multi: true,
          name: '盈利能力-成本-业务构成-报表日期',
          _index: 4393,
        },
        '盈利能力-成本-业务构成-货币单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '盈利能力-成本-业务构成-货币单位',
          _index: 4394,
        },
        '盈利能力-成本-业务构成': {
          type: '盈利能力-主营业务成本按业务构成分析',
          required: false,
          multi: true,
          name: '盈利能力-成本-业务构成',
          _index: 4395,
        },
      },
    },
    { name: '其他', orders: [], schema: {} },
    {
      name: '控股股东-法人',
      orders: ['名称', '企业性质', '直接持股比例', '间接持股比例'],
      schema: {
        名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '名称',
          _index: 4398,
        },
        企业性质: {
          type: '文本',
          required: false,
          multi: true,
          name: '企业性质',
          _index: 4399,
        },
        直接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '直接持股比例',
          _index: 4400,
        },
        间接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '间接持股比例',
          _index: 4401,
        },
      },
    },
    {
      name: '控股股东-自然人',
      orders: ['姓名', '身份证号', '国籍', '直接持股比例', '间接持股比例'],
      schema: {
        姓名: {
          type: '文本',
          required: false,
          multi: true,
          name: '姓名',
          _index: 4403,
        },
        身份证号: {
          type: '文本',
          required: false,
          multi: true,
          name: '身份证号',
          _index: 4404,
        },
        国籍: {
          type: '文本',
          required: false,
          multi: true,
          name: '国籍',
          _index: 4405,
        },
        直接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '直接持股比例',
          _index: 4406,
        },
        间接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '间接持股比例',
          _index: 4407,
        },
      },
    },
    {
      name: '控股股东-其他',
      orders: ['名称', '性质', '直接持股比例', '间接持股比例'],
      schema: {
        名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '名称',
          _index: 4409,
        },
        性质: {
          type: '文本',
          required: false,
          multi: true,
          name: '性质',
          _index: 4410,
        },
        直接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '直接持股比例',
          _index: 4411,
        },
        间接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '间接持股比例',
          _index: 4412,
        },
      },
    },
    {
      name: '实际控制人-国有控股主体',
      orders: ['名称', '单位负责人', '直接持股比例', '间接持股比例'],
      schema: {
        名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '名称',
          _index: 4414,
        },
        单位负责人: {
          type: '文本',
          required: false,
          multi: true,
          name: '单位负责人',
          _index: 4415,
        },
        直接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '直接持股比例',
          _index: 4416,
        },
        间接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '间接持股比例',
          _index: 4417,
        },
      },
    },
    {
      name: '实际控制人-自然人',
      orders: ['姓名', '身份证号', '国籍', '直接持股比例', '间接持股比例'],
      schema: {
        姓名: {
          type: '文本',
          required: false,
          multi: true,
          name: '姓名',
          _index: 4419,
        },
        身份证号: {
          type: '文本',
          required: false,
          multi: true,
          name: '身份证号',
          _index: 4420,
        },
        国籍: {
          type: '文本',
          required: false,
          multi: true,
          name: '国籍',
          _index: 4421,
        },
        直接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '直接持股比例',
          _index: 4422,
        },
        间接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '间接持股比例',
          _index: 4423,
        },
      },
    },
    {
      name: '实际控制人-其他',
      orders: [
        '名称',
        '性质',
        '直接持股比例',
        '间接持股比例',
        '其中：质押股份数量',
      ],
      schema: {
        名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '名称',
          _index: 4425,
        },
        性质: {
          type: '文本',
          required: false,
          multi: true,
          name: '性质',
          _index: 4426,
        },
        直接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '直接持股比例',
          _index: 4427,
        },
        间接持股比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '间接持股比例',
          _index: 4428,
        },
        '其中：质押股份数量': {
          type: '数字',
          required: false,
          multi: true,
          name: '其中：质押股份数量',
          _index: 4429,
        },
      },
    },
    {
      name: '董事基本情况',
      orders: [
        '姓名',
        '国籍',
        '境外居留权',
        '性别',
        '出生年月',
        '学历',
        '职称',
        '现任职务',
        '起始日期',
        '终止日期',
        '是否已有简历',
      ],
      schema: {
        姓名: {
          type: '文本',
          required: false,
          multi: true,
          name: '姓名',
          _index: 4431,
        },
        国籍: {
          type: '文本',
          required: false,
          multi: true,
          name: '国籍',
          _index: 4432,
        },
        境外居留权: {
          type: '文本',
          required: false,
          multi: true,
          name: '境外居留权',
          _index: 4433,
        },
        性别: {
          type: '文本',
          required: false,
          multi: true,
          name: '性别',
          _index: 4434,
        },
        出生年月: {
          type: '日期',
          required: false,
          multi: true,
          name: '出生年月',
          _index: 4435,
        },
        学历: {
          type: '文本',
          required: false,
          multi: true,
          name: '学历',
          _index: 4436,
        },
        职称: {
          type: '文本',
          required: false,
          multi: true,
          name: '职称',
          _index: 4437,
        },
        现任职务: {
          type: '文本',
          required: false,
          multi: true,
          name: '现任职务',
          _index: 4438,
        },
        起始日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '起始日期',
          _index: 4439,
        },
        终止日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '终止日期',
          _index: 4440,
        },
        是否已有简历: {
          type: '是否已有简历',
          required: false,
          multi: true,
          name: '是否已有简历',
          _index: 4441,
        },
      },
    },
    {
      name: '监事基本情况',
      orders: [
        '姓名',
        '国籍',
        '境外居留权',
        '性别',
        '出生年月',
        '学历',
        '职称',
        '现任职务',
        '起始日期',
        '终止日期',
        '是否已有简历',
      ],
      schema: {
        姓名: {
          type: '文本',
          required: false,
          multi: true,
          name: '姓名',
          _index: 4443,
        },
        国籍: {
          type: '文本',
          required: false,
          multi: true,
          name: '国籍',
          _index: 4444,
        },
        境外居留权: {
          type: '文本',
          required: false,
          multi: true,
          name: '境外居留权',
          _index: 4445,
        },
        性别: {
          type: '文本',
          required: false,
          multi: true,
          name: '性别',
          _index: 4446,
        },
        出生年月: {
          type: '日期',
          required: false,
          multi: true,
          name: '出生年月',
          _index: 4447,
        },
        学历: {
          type: '文本',
          required: false,
          multi: true,
          name: '学历',
          _index: 4448,
        },
        职称: {
          type: '文本',
          required: false,
          multi: true,
          name: '职称',
          _index: 4449,
        },
        现任职务: {
          type: '文本',
          required: false,
          multi: true,
          name: '现任职务',
          _index: 4450,
        },
        起始日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '起始日期',
          _index: 4451,
        },
        终止日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '终止日期',
          _index: 4452,
        },
        是否已有简历: {
          type: '是否已有简历',
          required: false,
          multi: true,
          name: '是否已有简历',
          _index: 4453,
        },
      },
    },
    {
      name: '高管基本情况',
      orders: [
        '姓名',
        '国籍',
        '境外居留权',
        '性别',
        '出生年月',
        '学历',
        '职称',
        '现任职务',
        '起始日期',
        '终止日期',
        '是否已有简历',
      ],
      schema: {
        姓名: {
          type: '文本',
          required: false,
          multi: true,
          name: '姓名',
          _index: 4455,
        },
        国籍: {
          type: '文本',
          required: false,
          multi: true,
          name: '国籍',
          _index: 4456,
        },
        境外居留权: {
          type: '文本',
          required: false,
          multi: true,
          name: '境外居留权',
          _index: 4457,
        },
        性别: {
          type: '文本',
          required: false,
          multi: true,
          name: '性别',
          _index: 4458,
        },
        出生年月: {
          type: '日期',
          required: false,
          multi: true,
          name: '出生年月',
          _index: 4459,
        },
        学历: {
          type: '文本',
          required: false,
          multi: true,
          name: '学历',
          _index: 4460,
        },
        职称: {
          type: '文本',
          required: false,
          multi: true,
          name: '职称',
          _index: 4461,
        },
        现任职务: {
          type: '文本',
          required: false,
          multi: true,
          name: '现任职务',
          _index: 4462,
        },
        起始日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '起始日期',
          _index: 4463,
        },
        终止日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '终止日期',
          _index: 4464,
        },
        是否已有简历: {
          type: '是否已有简历',
          required: false,
          multi: true,
          name: '是否已有简历',
          _index: 4465,
        },
      },
    },
    {
      name: '核心技术人员基本情况',
      orders: [
        '姓名',
        '国籍',
        '境外居留权',
        '性别',
        '出生年月',
        '学历',
        '职称',
        '现任职务',
        '起始日期',
        '终止日期',
        '是否已有简历',
      ],
      schema: {
        姓名: {
          type: '文本',
          required: false,
          multi: true,
          name: '姓名',
          _index: 4467,
        },
        国籍: {
          type: '文本',
          required: false,
          multi: true,
          name: '国籍',
          _index: 4468,
        },
        境外居留权: {
          type: '文本',
          required: false,
          multi: true,
          name: '境外居留权',
          _index: 4469,
        },
        性别: {
          type: '文本',
          required: false,
          multi: true,
          name: '性别',
          _index: 4470,
        },
        出生年月: {
          type: '日期',
          required: false,
          multi: true,
          name: '出生年月',
          _index: 4471,
        },
        学历: {
          type: '文本',
          required: false,
          multi: true,
          name: '学历',
          _index: 4472,
        },
        职称: {
          type: '文本',
          required: false,
          multi: true,
          name: '职称',
          _index: 4473,
        },
        现任职务: {
          type: '文本',
          required: false,
          multi: true,
          name: '现任职务',
          _index: 4474,
        },
        起始日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '起始日期',
          _index: 4475,
        },
        终止日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '终止日期',
          _index: 4476,
        },
        是否已有简历: {
          type: '是否已有简历',
          required: false,
          multi: true,
          name: '是否已有简历',
          _index: 4477,
        },
      },
    },
    { name: 'text', orders: [], schema: {} },
    {
      name: '重大诉讼事项',
      orders: [
        '有/无重大诉讼事项',
        '事项',
        '起诉(申请)方',
        '应诉(被申请)方',
        '承担连带责任方',
        '诉讼仲裁类型',
        '诉讼涉及金额',
        '预计负债金额',
      ],
      schema: {
        '有/无重大诉讼事项': {
          type: '有/无重大诉讼事项',
          required: false,
          multi: true,
          name: '有/无重大诉讼事项',
          _index: 4480,
        },
        事项: {
          type: '文本',
          required: false,
          multi: true,
          name: '事项',
          _index: 4481,
        },
        '起诉(申请)方': {
          type: '文本',
          required: false,
          multi: true,
          name: '起诉(申请)方',
          _index: 4482,
        },
        '应诉(被申请)方': {
          type: '文本',
          required: false,
          multi: true,
          name: '应诉(被申请)方',
          _index: 4483,
        },
        承担连带责任方: {
          type: '文本',
          required: false,
          multi: true,
          name: '承担连带责任方',
          _index: 4484,
        },
        诉讼仲裁类型: {
          type: '文本',
          required: false,
          multi: true,
          name: '诉讼仲裁类型',
          _index: 4485,
        },
        诉讼涉及金额: {
          type: '数字',
          required: false,
          multi: true,
          name: '诉讼涉及金额',
          _index: 4486,
        },
        预计负债金额: {
          type: '数字',
          required: false,
          multi: true,
          name: '预计负债金额',
          _index: 4487,
        },
      },
    },
    {
      name: '募集资金与运用',
      orders: [
        '货币单位',
        '项目名称',
        '投资总额',
        '募集资金投资额',
        '募集资金投向',
      ],
      schema: {
        货币单位: {
          type: '文本',
          required: false,
          multi: true,
          name: '货币单位',
          _index: 4489,
        },
        项目名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '项目名称',
          _index: 4490,
        },
        投资总额: {
          type: '数字',
          required: false,
          multi: true,
          name: '投资总额',
          _index: 4491,
        },
        募集资金投资额: {
          type: '数字',
          required: false,
          multi: true,
          name: '募集资金投资额',
          _index: 4492,
        },
        募集资金投向: {
          type: '文本',
          required: false,
          multi: true,
          name: '募集资金投向',
          _index: 4493,
        },
      },
    },
    {
      name: '专利',
      orders: [
        '专利类型',
        '专利名称',
        '专利号',
        '专利权人',
        '取得成本',
        '最近一期末账面价值',
        '取得日期',
        '使用期限',
        '是否存在权属纠纷',
      ],
      schema: {
        专利类型: {
          type: '文本',
          required: false,
          multi: true,
          name: '专利类型',
          _index: 4495,
        },
        专利名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '专利名称',
          _index: 4496,
        },
        专利号: {
          type: '文本',
          required: false,
          multi: true,
          name: '专利号',
          _index: 4497,
        },
        专利权人: {
          type: '文本',
          required: false,
          multi: true,
          name: '专利权人',
          _index: 4498,
        },
        取得成本: {
          type: '数字',
          required: false,
          multi: true,
          name: '取得成本',
          _index: 4499,
        },
        最近一期末账面价值: {
          type: '数字',
          required: false,
          multi: true,
          name: '最近一期末账面价值',
          _index: 4500,
        },
        取得日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '取得日期',
          _index: 4501,
        },
        使用期限: {
          type: '文本',
          required: false,
          multi: true,
          name: '使用期限',
          _index: 4502,
        },
        是否存在权属纠纷: {
          type: '文本',
          required: false,
          multi: true,
          name: '是否存在权属纠纷',
          _index: 4503,
        },
      },
    },
    {
      name: '主要客户',
      orders: [
        '时间',
        '货币单位',
        '客户名称',
        '下属单位名称',
        '销售额',
        '占主营收入比例',
        '占营业收入比例',
      ],
      schema: {
        时间: {
          type: '日期',
          required: false,
          multi: true,
          name: '时间',
          _index: 4505,
        },
        货币单位: {
          type: '文本',
          required: false,
          multi: true,
          name: '货币单位',
          _index: 4506,
        },
        客户名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '客户名称',
          _index: 4507,
        },
        下属单位名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '下属单位名称',
          _index: 4508,
        },
        销售额: {
          type: '数字',
          required: false,
          multi: true,
          name: '销售额',
          _index: 4509,
        },
        占主营收入比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '占主营收入比例',
          _index: 4510,
        },
        占营业收入比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '占营业收入比例',
          _index: 4511,
        },
      },
    },
    {
      name: '主要供应商',
      orders: [
        '时间',
        '货币单位',
        '供应商名称',
        '采购内容',
        '采购额',
        '占总采购金额比例',
      ],
      schema: {
        时间: {
          type: '日期',
          required: false,
          multi: true,
          name: '时间',
          _index: 4513,
        },
        货币单位: {
          type: '文本',
          required: false,
          multi: true,
          name: '货币单位',
          _index: 4514,
        },
        供应商名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '供应商名称',
          _index: 4515,
        },
        采购内容: {
          type: '文本',
          required: false,
          multi: true,
          name: '采购内容',
          _index: 4516,
        },
        采购额: {
          type: '数字',
          required: false,
          multi: true,
          name: '采购额',
          _index: 4517,
        },
        占总采购金额比例: {
          type: '数字',
          required: false,
          multi: true,
          name: '占总采购金额比例',
          _index: 4518,
        },
      },
    },
    {
      name: '重大合同',
      orders: [
        '货币单位',
        '合同类型',
        '合同对手方名称',
        '标的',
        '合同金额',
        '需要计算的合同金额',
        '已履行金额',
        '履行期限',
        '备注',
      ],
      schema: {
        货币单位: {
          type: '文本',
          required: false,
          multi: true,
          name: '货币单位',
          _index: 4520,
        },
        合同类型: {
          type: '合同类型',
          required: false,
          multi: true,
          name: '合同类型',
          _index: 4521,
        },
        合同对手方名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '合同对手方名称',
          _index: 4522,
        },
        标的: {
          type: '文本',
          required: false,
          multi: true,
          name: '标的',
          _index: 4523,
        },
        合同金额: {
          type: '数字',
          required: false,
          multi: true,
          name: '合同金额',
          _index: 4524,
        },
        需要计算的合同金额: {
          type: '文本',
          required: false,
          multi: true,
          name: '需要计算的合同金额',
          _index: 4525,
        },
        已履行金额: {
          type: '数字',
          required: false,
          multi: true,
          name: '已履行金额',
          _index: 4526,
        },
        履行期限: {
          type: '日期',
          required: false,
          multi: true,
          name: '履行期限',
          _index: 4527,
        },
        备注: {
          type: '文本',
          required: false,
          multi: true,
          name: '备注',
          _index: 4528,
        },
      },
    },
    {
      name: '发行人所处行业',
      orders: ['行业分类标准', '行业分类代码', '行业分类名称'],
      schema: {
        行业分类标准: {
          type: '文本',
          required: false,
          multi: true,
          name: '行业分类标准',
          _index: 4530,
        },
        行业分类代码: {
          type: '文本',
          required: false,
          multi: true,
          name: '行业分类代码',
          _index: 4531,
        },
        行业分类名称: {
          type: '文本',
          required: false,
          multi: true,
          name: '行业分类名称',
          _index: 4532,
        },
      },
    },
    {
      name: '盈利能力-主营业务收入按产品构成分析',
      orders: [
        '产品类别',
        '金额(T-2年)',
        '金额(T-1年)',
        '金额(T年)',
        '金额(最近一期）',
        '占比(T-2年)',
        '占比(T-1年)',
        '占比(T年)',
        '占比(最近一期）',
        '变动比例(T-2年)',
        '变动比例(T-1年)',
        '变动比例(T年)',
        '变动比例(最近一期）',
      ],
      schema: {
        产品类别: {
          type: '文本',
          required: false,
          multi: true,
          name: '产品类别',
          _index: 4534,
        },
        '金额(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-2年)',
          _index: 4535,
        },
        '金额(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-1年)',
          _index: 4536,
        },
        '金额(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T年)',
          _index: 4537,
        },
        '金额(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(最近一期）',
          _index: 4538,
        },
        '占比(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-2年)',
          _index: 4539,
        },
        '占比(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-1年)',
          _index: 4540,
        },
        '占比(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T年)',
          _index: 4541,
        },
        '占比(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(最近一期）',
          _index: 4542,
        },
        '变动比例(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-2年)',
          _index: 4543,
        },
        '变动比例(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-1年)',
          _index: 4544,
        },
        '变动比例(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T年)',
          _index: 4545,
        },
        '变动比例(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(最近一期）',
          _index: 4546,
        },
      },
    },
    {
      name: '盈利能力-主营业务收入按业务构成分析',
      orders: [
        '业务类别',
        '金额(T-2年)',
        '金额(T-1年)',
        '金额(T年)',
        '金额(最近一期）',
        '占比(T-2年)',
        '占比(T-1年)',
        '占比(T年)',
        '占比(最近一期）',
        '变动比例(T-2年)',
        '变动比例(T-1年)',
        '变动比例(T年)',
        '变动比例(最近一期）',
      ],
      schema: {
        业务类别: {
          type: '文本',
          required: false,
          multi: true,
          name: '业务类别',
          _index: 4548,
        },
        '金额(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-2年)',
          _index: 4549,
        },
        '金额(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-1年)',
          _index: 4550,
        },
        '金额(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T年)',
          _index: 4551,
        },
        '金额(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(最近一期）',
          _index: 4552,
        },
        '占比(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-2年)',
          _index: 4553,
        },
        '占比(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-1年)',
          _index: 4554,
        },
        '占比(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T年)',
          _index: 4555,
        },
        '占比(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(最近一期）',
          _index: 4556,
        },
        '变动比例(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-2年)',
          _index: 4557,
        },
        '变动比例(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-1年)',
          _index: 4558,
        },
        '变动比例(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T年)',
          _index: 4559,
        },
        '变动比例(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(最近一期）',
          _index: 4560,
        },
      },
    },
    {
      name: '盈利能力-主营业务成本按产品构成分析',
      orders: [
        '产品类别',
        '金额(T-2年)',
        '金额(T-1年)',
        '金额(T年)',
        '金额(最近一期）',
        '占比(T-2年)',
        '占比(T-1年)',
        '占比(T年)',
        '占比(最近一期）',
        '变动比例(T-2年)',
        '变动比例(T-1年)',
        '变动比例(T年)',
        '变动比例(最近一期）',
      ],
      schema: {
        产品类别: {
          type: '文本',
          required: false,
          multi: true,
          name: '产品类别',
          _index: 4562,
        },
        '金额(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-2年)',
          _index: 4563,
        },
        '金额(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-1年)',
          _index: 4564,
        },
        '金额(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T年)',
          _index: 4565,
        },
        '金额(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(最近一期）',
          _index: 4566,
        },
        '占比(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-2年)',
          _index: 4567,
        },
        '占比(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-1年)',
          _index: 4568,
        },
        '占比(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T年)',
          _index: 4569,
        },
        '占比(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(最近一期）',
          _index: 4570,
        },
        '变动比例(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-2年)',
          _index: 4571,
        },
        '变动比例(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-1年)',
          _index: 4572,
        },
        '变动比例(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T年)',
          _index: 4573,
        },
        '变动比例(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(最近一期）',
          _index: 4574,
        },
      },
    },
    {
      name: '盈利能力-主营业务成本按业务构成分析',
      orders: [
        '业务类别',
        '金额(T-2年)',
        '金额(T-1年)',
        '金额(T年)',
        '金额(最近一期）',
        '占比(T-2年)',
        '占比(T-1年)',
        '占比(T年)',
        '占比(最近一期）',
        '变动比例(T-2年)',
        '变动比例(T-1年)',
        '变动比例(T年)',
        '变动比例(最近一期）',
      ],
      schema: {
        业务类别: {
          type: '文本',
          required: false,
          multi: true,
          name: '业务类别',
          _index: 4576,
        },
        '金额(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-2年)',
          _index: 4577,
        },
        '金额(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T-1年)',
          _index: 4578,
        },
        '金额(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(T年)',
          _index: 4579,
        },
        '金额(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '金额(最近一期）',
          _index: 4580,
        },
        '占比(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-2年)',
          _index: 4581,
        },
        '占比(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T-1年)',
          _index: 4582,
        },
        '占比(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(T年)',
          _index: 4583,
        },
        '占比(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '占比(最近一期）',
          _index: 4584,
        },
        '变动比例(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-2年)',
          _index: 4585,
        },
        '变动比例(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T-1年)',
          _index: 4586,
        },
        '变动比例(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(T年)',
          _index: 4587,
        },
        '变动比例(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '变动比例(最近一期）',
          _index: 4588,
        },
      },
    },
    {
      name: '主要财务指标',
      orders: [
        '报表日期',
        '流动比率(倍)(T-2年)',
        '流动比率(倍)(T-1年)',
        '流动比率(倍)(T年)',
        '流动比率(倍)(最近一期）',
        '速动比率(倍)(T-2年)',
        '速动比率(倍)(T-1年)',
        '速动比率(倍)(T年)',
        '速动比率(倍)(最近一期）',
        '资产负债率（合并）(T-2年)',
        '资产负债率（合并）(T-1年)',
        '资产负债率（合并）(T年)',
        '资产负债率（合并）(最近一期）',
        '资产负债率(母公司）(T-2年)',
        '资产负债率(母公司）(T-1年)',
        '资产负债率(母公司）(T年)',
        '资产负债率(母公司）(最近一期）',
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年)',
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年)',
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年)',
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）',
        '应收账款周转率(次/年)(T-2年)',
        '应收账款周转率(次/年)(T-1年)',
        '应收账款周转率(次/年)(T年)',
        '应收账款周转率(次/年)(最近一期）',
        '存货周转率(次/年)(T-2年)',
        '存货周转率(次/年)(T-1年)',
        '存货周转率(次/年)(T年)',
        '存货周转率(次/年)(最近一期）',
        '总资产周转率(次/年)(T-2年)',
        '总资产周转率(次/年)(T-1年)',
        '总资产周转率(次/年)(T年)',
        '总资产周转率(次/年)(最近一期）',
        '息税折旧摊销前利润-单位',
        '息税折旧摊销前利润(元)(T-2年)',
        '息税折旧摊销前利润(元)(T-1年)',
        '息税折旧摊销前利润(元)(T年)',
        '息税折旧摊销前利润(元)(最近一期）',
        '利息保障倍数(倍)(T-2年)',
        '利息保障倍数(倍)(T-1年)',
        '利息保障倍数(倍)(T年)',
        '利息保障倍数(倍)(最近一期）',
        '扣除非经常性损益后的每股基本收益-单位',
        '扣除非经常性损益后的每股基本收益（元）(T-2年)',
        '扣除非经常性损益后的每股基本收益（元）(T-1年)',
        '扣除非经常性损益后的每股基本收益（元）(T年)',
        '扣除非经常性损益后的每股基本收益（元）(最近一期）',
        '每股经营活动产生的现金流量-单位',
        '每股经营活动产生的现金流量(元)(T-2年)',
        '每股经营活动产生的现金流量(元)(T-1年)',
        '每股经营活动产生的现金流量(元)(T年)',
        '每股经营活动产生的现金流量(元)(最近一期）',
        '每股净现金流量-单位',
        '每股净现金流量(元)(T-2年)',
        '每股净现金流量(元)(T-1年)',
        '每股净现金流量(元)(T年)',
        '每股净现金流量(元)(最近一期）',
        '加权平均净资产收益率(T-2年)',
        '加权平均净资产收益率(T-1年)',
        '加权平均净资产收益率(T年)',
        '加权平均净资产收益率(最近一期）',
      ],
      schema: {
        报表日期: {
          type: '日期',
          required: false,
          multi: true,
          name: '报表日期',
          _index: 4590,
        },
        '流动比率(倍)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '流动比率(倍)(T-2年)',
          _index: 4591,
        },
        '流动比率(倍)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '流动比率(倍)(T-1年)',
          _index: 4592,
        },
        '流动比率(倍)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '流动比率(倍)(T年)',
          _index: 4593,
        },
        '流动比率(倍)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '流动比率(倍)(最近一期）',
          _index: 4594,
        },
        '速动比率(倍)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '速动比率(倍)(T-2年)',
          _index: 4595,
        },
        '速动比率(倍)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '速动比率(倍)(T-1年)',
          _index: 4596,
        },
        '速动比率(倍)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '速动比率(倍)(T年)',
          _index: 4597,
        },
        '速动比率(倍)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '速动比率(倍)(最近一期）',
          _index: 4598,
        },
        '资产负债率（合并）(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率（合并）(T-2年)',
          _index: 4599,
        },
        '资产负债率（合并）(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率（合并）(T-1年)',
          _index: 4600,
        },
        '资产负债率（合并）(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率（合并）(T年)',
          _index: 4601,
        },
        '资产负债率（合并）(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率（合并）(最近一期）',
          _index: 4602,
        },
        '资产负债率(母公司）(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率(母公司）(T-2年)',
          _index: 4603,
        },
        '资产负债率(母公司）(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率(母公司）(T-1年)',
          _index: 4604,
        },
        '资产负债率(母公司）(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率(母公司）(T年)',
          _index: 4605,
        },
        '资产负债率(母公司）(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '资产负债率(母公司）(最近一期）',
          _index: 4606,
        },
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name:
            '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年)',
          _index: 4607,
        },
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name:
            '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年)',
          _index: 4608,
        },
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name:
            '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年)',
          _index: 4609,
        },
        '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name:
            '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）',
          _index: 4610,
        },
        '应收账款周转率(次/年)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '应收账款周转率(次/年)(T-2年)',
          _index: 4611,
        },
        '应收账款周转率(次/年)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '应收账款周转率(次/年)(T-1年)',
          _index: 4612,
        },
        '应收账款周转率(次/年)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '应收账款周转率(次/年)(T年)',
          _index: 4613,
        },
        '应收账款周转率(次/年)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '应收账款周转率(次/年)(最近一期）',
          _index: 4614,
        },
        '存货周转率(次/年)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '存货周转率(次/年)(T-2年)',
          _index: 4615,
        },
        '存货周转率(次/年)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '存货周转率(次/年)(T-1年)',
          _index: 4616,
        },
        '存货周转率(次/年)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '存货周转率(次/年)(T年)',
          _index: 4617,
        },
        '存货周转率(次/年)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '存货周转率(次/年)(最近一期）',
          _index: 4618,
        },
        '总资产周转率(次/年)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '总资产周转率(次/年)(T-2年)',
          _index: 4619,
        },
        '总资产周转率(次/年)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '总资产周转率(次/年)(T-1年)',
          _index: 4620,
        },
        '总资产周转率(次/年)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '总资产周转率(次/年)(T年)',
          _index: 4621,
        },
        '总资产周转率(次/年)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '总资产周转率(次/年)(最近一期）',
          _index: 4622,
        },
        '息税折旧摊销前利润-单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '息税折旧摊销前利润-单位',
          _index: 4623,
        },
        '息税折旧摊销前利润(元)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '息税折旧摊销前利润(元)(T-2年)',
          _index: 4624,
        },
        '息税折旧摊销前利润(元)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '息税折旧摊销前利润(元)(T-1年)',
          _index: 4625,
        },
        '息税折旧摊销前利润(元)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '息税折旧摊销前利润(元)(T年)',
          _index: 4626,
        },
        '息税折旧摊销前利润(元)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '息税折旧摊销前利润(元)(最近一期）',
          _index: 4627,
        },
        '利息保障倍数(倍)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '利息保障倍数(倍)(T-2年)',
          _index: 4628,
        },
        '利息保障倍数(倍)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '利息保障倍数(倍)(T-1年)',
          _index: 4629,
        },
        '利息保障倍数(倍)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '利息保障倍数(倍)(T年)',
          _index: 4630,
        },
        '利息保障倍数(倍)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '利息保障倍数(倍)(最近一期）',
          _index: 4631,
        },
        '扣除非经常性损益后的每股基本收益-单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '扣除非经常性损益后的每股基本收益-单位',
          _index: 4632,
        },
        '扣除非经常性损益后的每股基本收益（元）(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '扣除非经常性损益后的每股基本收益（元）(T-2年)',
          _index: 4633,
        },
        '扣除非经常性损益后的每股基本收益（元）(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '扣除非经常性损益后的每股基本收益（元）(T-1年)',
          _index: 4634,
        },
        '扣除非经常性损益后的每股基本收益（元）(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '扣除非经常性损益后的每股基本收益（元）(T年)',
          _index: 4635,
        },
        '扣除非经常性损益后的每股基本收益（元）(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '扣除非经常性损益后的每股基本收益（元）(最近一期）',
          _index: 4636,
        },
        '每股经营活动产生的现金流量-单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '每股经营活动产生的现金流量-单位',
          _index: 4637,
        },
        '每股经营活动产生的现金流量(元)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股经营活动产生的现金流量(元)(T-2年)',
          _index: 4638,
        },
        '每股经营活动产生的现金流量(元)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股经营活动产生的现金流量(元)(T-1年)',
          _index: 4639,
        },
        '每股经营活动产生的现金流量(元)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股经营活动产生的现金流量(元)(T年)',
          _index: 4640,
        },
        '每股经营活动产生的现金流量(元)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股经营活动产生的现金流量(元)(最近一期）',
          _index: 4641,
        },
        '每股净现金流量-单位': {
          type: '文本',
          required: false,
          multi: true,
          name: '每股净现金流量-单位',
          _index: 4642,
        },
        '每股净现金流量(元)(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股净现金流量(元)(T-2年)',
          _index: 4643,
        },
        '每股净现金流量(元)(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股净现金流量(元)(T-1年)',
          _index: 4644,
        },
        '每股净现金流量(元)(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股净现金流量(元)(T年)',
          _index: 4645,
        },
        '每股净现金流量(元)(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '每股净现金流量(元)(最近一期）',
          _index: 4646,
        },
        '加权平均净资产收益率(T-2年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '加权平均净资产收益率(T-2年)',
          _index: 4647,
        },
        '加权平均净资产收益率(T-1年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '加权平均净资产收益率(T-1年)',
          _index: 4648,
        },
        '加权平均净资产收益率(T年)': {
          type: '数字',
          required: false,
          multi: true,
          name: '加权平均净资产收益率(T年)',
          _index: 4649,
        },
        '加权平均净资产收益率(最近一期）': {
          type: '数字',
          required: false,
          multi: true,
          name: '加权平均净资产收益率(最近一期）',
          _index: 4650,
        },
      },
    },
  ],
  version: '87fecdb59ecbb5de9326f6a8d6f40b91',
};
export const answers = {
  userAnswer: {
    items: [
      {
        key: '["No.01:0","招股说明书名称:0"]',
        schema: {
          data: {
            label: '招股说明书名称',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 105.9375,
                  box_top: 115.3125,
                  box_right: 498.75,
                  box_bottom: 150.9375,
                },
                page: 0,
                text:
                  'HES Technology Group Co., Ltd.\n（北京市海淀区中关村南大街 17 号 3 号 楼 1902 室 ）',
              },
              {
                box: {
                  box_left: 125.625,
                  box_top: 393.75,
                  box_right: 479.0625,
                  box_bottom: 481.875,
                },
                page: 0,
                text: '首次公开发行股票招股说明书\n(申报稿)',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","释义:0"]',
        schema: {
          data: {
            label: '释义',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 70.3125,
                  box_top: 135.9375,
                  box_right: 522.1875,
                  box_bottom: 763.125,
                },
                page: 27,
                text:
                  '一、普通术语\n公司、本公司、股份公\n司、发行人、豪尔赛 指豪尔赛科技集团股份有限公司\n豪尔赛有限 指公司前身豪尔赛照明技术集团有限公司，在特定意境下泛指\n豪尔赛科技集团股份有限公司有限公司阶段的统称\n豪尔赛技术 指豪尔赛有限前身北京豪尔赛照明技术有限公司\n豪尔赛照明 指豪尔赛技术前身北京豪尔赛灯饰照明工程有限公司\n豪尔赛灯饰 指豪尔赛照明前身北京豪尔赛灯饰照明器材有限公司\n豪尔赛贸易 指豪尔赛灯饰前身北京豪尔赛贸易有限公司\n上海分公司 指豪尔赛科技集团股份有限公司上海分公司\n天津分公司 指豪尔赛科技集团股份有限公司天津分公司\n重庆分公司 指豪尔赛科技集团股份有限公司重庆分公司\n湖北分公司 指豪尔赛科技集团股份有限公司湖北分公司\n河南分公司 指豪尔赛科技集团股份有限公司河南分公司\n宁波分公司 指豪尔赛科技集团股份有限公司宁波分公司\n浙江分公司 指豪尔赛照明技术集团有限公司浙江分公司\n唐山分公司 指豪尔赛照明技术集团有限公司唐山分公司\n成都分公司 指豪尔赛照明技术集团有限公司成都分公司\n大同分公司 指豪尔赛照明技术集团有限公司大同分公司\n海南分公司 指豪尔赛照明技术集团有限公司海南分公司\n安徽分公司 指豪尔赛照明技术集团有限公司安徽分公司\n昆明分公司 指豪尔赛照明技术集团有限公司昆明分公司\n豪尔赛科技 指北京豪尔赛科技服务有限公司\n天津豪尔赛 指天津豪尔赛照明技术有限公司\n上海豪尔赛 指上海豪尔赛照明技术有限公司\n豪尔赛文化 指北京豪尔赛文化发展有限公司\n重庆豪尔赛 指重庆豪尔赛照明技术有限公司\n对棋设计 指北京对棋照明设计有限公司\n高好投资 指上海高好投资合伙企业（有限合伙）\n龙玺投资 指杭州龙玺投资合伙企业（有限合伙）',
              },
              {
                box: {
                  box_left: 72.1875,
                  box_top: 79.6875,
                  box_right: 519.375,
                  box_bottom: 763.125,
                },
                page: 28,
                text:
                  '展勋投资 指杭州展勋投资合伙企业（有限合伙）\n弘信通 指深圳前海弘信通金融服务有限公司\n前海宏升 指深圳前海宏升优选六号投资合伙企业（有限合伙）\n楚之源 指深圳前海楚之源投资管理合伙企业（有限合伙）\n奥拓电子 指深圳市奥拓电子股份有限公司，A 股上市公司，股票代码：\n002587 \n利亚德 指利亚德光电股份有限公司，A 股上市公司，股票代码：300296\n名家汇 指深圳市名家汇科技股份有限公司，A 股上市公司，股票代码：\n300506 \n千百辉 指深圳市千百辉照明工程有限公司\n利亚德照明 指利亚德照明股份有限公司，前身为深圳市金达照明有限公司\n普瑞照明 指四川普瑞照明工程有限公司\n西安万科 指西安万科时代系统集成工程有限公司，后更名为利亚德（西\n安）智能系统有限责任公司\n中天照明 指上海中天照明成套有限公司\n君泽照明 指湖南君泽照明设计工程有限公司\n华彩信和 指天津华彩信和电子科技集团股份有限公司\n中筑天佑 指广东中筑天佑美学灯光有限公司\n罗曼照明 指上海罗曼照明科技股份有限公司\n达特照明 指深圳市达特照明股份有限公司\n新时空 指北京新时空科技股份有限公司\n发改委 指中华人民共和国国家发展和改革委员会\n住建部、住房和城乡建\n设部、建设部 指中华人民共和国住房和城乡建设部，其前身为国家建设部\n全国人大常委会 指全国人民代表大会常务委员会\n中国证监会 指中国证券监督管理委员会\n证券交易所、交易所 指深圳证券交易所\nAPEC 指Asia-Pacific Economic Cooperation，即亚洲太平洋经济合作\n组织（简称“亚太经合组织”）\n由 GE Lighting（美国通用电气照明公司）举办的以爱迪生\n爱迪生全球照明设计为名的照明设计奖，国际权威的照明设计奖项，以全球重要\n奖指且具备完善设计概念的照明专案为主，是表彰优秀商业空\n间、公共空间照明设计的奖项\n中照照明奖 指由中国照明学会设立，是经国家科技奖励办公室批准的全国\n照明行业奖项，是中国照明领域唯一的科技奖项\n中国建设工程鲁班奖 指简称“鲁班奖”，由中国建筑业协会设立，中国建筑行业工程\n质量荣誉奖项',
              },
              {
                box: {
                  box_left: 72.1875,
                  box_top: 75,
                  box_right: 522.1875,
                  box_bottom: 768.75,
                },
                page: 29,
                text:
                  '中国土木工程詹天佑简称“詹天佑奖”，由中国土木工程学会设立，系以弘扬科技\n奖指创新精神，以表彰奖励在科技创新与新技术应用中成绩显著\n的工程项目为宗旨的奖项\n由广州国际照明展览会推出的照明领域内的权威奖项，旨在\n阿拉丁神灯奖 指嘉奖对全球照明产业绿色、节能、新技术的创新产品，光技\n术与艺术完美结合的杰出工程作品，以及为照明产业的发展\n孜孜以求的卓越人士\nOA系统 指Office Automation System，即办公自动化系统\nEngineering Procurement Construction，指受业主委托，按照\nEPC 指合同约定对工程建设项目的设计、采购、施工、试运行等实\n行全过程或若干阶段的承包，即设计、采购、施工一体化\n《公司法》 指《中华人民共和国公司法》\n《证券法》 指《中华人民共和国证券法》\n公司章程 指豪尔赛科技集团股份有限公司章程\n公司章程（草案） 指豪尔赛科技集团股份有限公司章程（草案）\n股东大会 指豪尔赛科技集团股份有限公司股东大会\n董事会 指豪尔赛科技集团股份有限公司董事会\n监事会 指豪尔赛科技集团股份有限公司监事会\n保荐人、保荐机构、主\n承销商、长江保荐 指长江证券承销保荐有限公司\n正中珠江、发行人会计\n师指广东正中珠江会计师事务所（特殊普通合伙）\n发行人律师 指北京市金杜律师事务所\n元、万元 指人民币元、人民币万元\n报告期、近三年一期 指2015年度、2016年度、2017年度、2018年1-6月\n二、专业术语\n利用各种光源照亮工作和生活场所或个别物体的措施，其中：利\n照明 指用太阳和天空光的被称为“天然采光”，利用人工能源的被称为\n“人工照明” \n以人造光源产生的电磁波对照射目标产生功效，从而被人类眼睛\n功能照明 指所感知，以满足人类视觉基本作业的照明种类，是通用照明的一\n种，主要包括道路照明、隧道照明、轨道交通照明、室内照明等\n景观照明 指既有照明功能，又兼有艺术装饰、美化环境及提升人类美好感知\n的照明工程\n城市空间照明、城市在城市规划区内城市道路、隧道、广场、公园、公共绿地、名胜\n照明 指古迹以及其他建（构）筑物的功能照明或者景观照明\n绿色照明 指通过科学的照明设计、采用效率高、寿命长、安全、性能稳定的\n节能电器产品，包括高效节能光源、高效节能附件、高效节能灯',
              },
              {
                box: {
                  box_left: 76.875,
                  box_top: 75.9375,
                  box_right: 522.1875,
                  box_bottom: 757.5,
                },
                page: 30,
                text:
                  '具以达到高效、舒适、安全、经济、有益环境和提高人们工作和\n生活的质量以及有益人们身心健康并体现现代文明的照明系统，\n旨在节约能源、保护环境、提高人类的照明质量\n简称“地标”，基本特征是人们可以用最简单的形态和最少的笔画\n标志性建筑 指来唤起对于它的记忆，一看到就可以联想到其所在的城市乃至整\n个国家，标志性建筑系一个城市的名片和象征，如北京天安门、\n纽约自由女神像等\n超高层建筑 指 高度达到或超过200米的高层建筑\n文旅表演/艺术景观以旅游文化的地域差异性为诱因，以文化和艺术的碰撞与互动为\n照明 指过程，以文化与艺术的相互融洽为结果的景观照明体系，具有民\n族性、艺术性、神秘性、多样性、互动性等特征\n由政府主导、精心策划、将城市夜晚点亮、美不胜收、体现城市\n夜游经济 指文化的同时，增加旅游消费、夜间消费，从而促进城市经济发展\n的经济模式\n白炽灯 指Incandescent lamp，是指将灯丝通电加热到白炽状态，利用热辐\n射发出可见的电光源\n荧光灯 指Fluorescent lamp，也称为日光灯，是利用低气压的汞蒸汽在通电\n后释放紫外线，从而使荧光粉发出可见光的电光源\n气体放电灯 指Gas discharge lamp，是由气体、金属蒸汽或几种气体与金属蒸汽\n的混合放电而发光的电光源\nLED 指Light emitting diode，发光二级管，是一种能够将电能转化为可\n见光的固态半导体器件\nLED芯片 指LED发光芯片，即P-N结，主要功能是将电能转化成光能，主要\n材料为单晶硅\nLED panel，又称电子显示屏，是由LED点阵和面板组成，通过\nLED显示屏 指红色、蓝色、白色、绿色LED灯的亮灭来显示文字、图片、动画、\n视频，内容可以随时更换，各部分组件均是模块化结构的显示器\n件\n也称LED节能灯，是利用高亮度白色发光二极管发光源，光效高、\n耗电少，寿命长、易控制、免维护、安全环保；是新一代固体冷\nLED灯、LED照明、光源，光色柔和、艳丽、丰富多彩、低损耗、低能耗，绿色环保，\n半导体照明 指适用家庭、商场、银行、医院、宾馆、饭店及其他各种公共场所\n长时间照明。LED节能灯的特点是成本低、光效高、发光面积大、\n无眩光、无重影\nBIM 指 Building information modeling，建筑信息模型\n建筑信息模型技术，是一种应用于工程设计建造管理的数据化工\n具，通过参数模型整合各种项目的相关信息，在项目策划、运行\nBIM技术 指和维护的全生命周期过程中进行共享和传递，使工程技术人员对\n各种建筑信息作出正确理解和高效应对，为设计团队以及包括建\n筑运营单位在内的各方建设主体提供协同工作的基础，在提高生\n产效率、节约成本和缩短工期方面发挥重要作用',
              },
              {
                box: {
                  box_left: 70.3125,
                  box_top: 75,
                  box_right: 537.1875,
                  box_bottom: 270.9375,
                },
                page: 31,
                text:
                  '3D技术 指基于电脑、互联网的数字化/三维/立体技术，包括3D软件技术和\n3D硬件技术\nLPD 指Lighting power density，即照明功率密度，单位面积功率是指单\n位被照面积上灯的安装功率，单位为瓦/平方米\nCTBUH 指Council on Tall Buildings and Urban Habita，即美国高层建筑与城\n市住宅委员会\nISA 指Interneational SSL alliance，国际半导体照明联盟\nCAS Research 指 国家半导体照明工程研发及产业联盟产业研究院\nGLII 指高工LED产业研究院，是中国专注于LED产业经济和市场研究咨\n询的研究机构\nlm/w 指 每瓦的光通量',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-公司名称:0"]',
        schema: {
          data: {
            label: '发行人-公司名称',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 190.3125,
                  box_top: 155.625,
                  box_right: 375,
                  box_bottom: 169.6875,
                },
                page: 45,
                text: '豪尔赛科技集团股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-法定代表人姓名:0"]',
        schema: {
          data: {
            label: '发行人-法定代表人姓名',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 190,
                  box_top: 216.6667,
                  box_right: 241.6667,
                  box_bottom: 230.83339999999998,
                },
                page: 45,
                text: '戴宝林',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-统一社会信用代码:0"]',
        schema: {
          data: {
            label: '发行人-统一社会信用代码',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 312.5,
                  box_top: 190,
                  box_right: 423.3333,
                  box_bottom: 210,
                },
                page: 46,
                text: '91110108723950093X',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-成立日期:0"]',
        schema: {
          data: {
            label: '发行人-成立日期',
            type: '日期',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 190,
                  box_top: 240,
                  box_right: 298.3333,
                  box_bottom: 250.8333,
                },
                page: 45,
                text: '2000 年 06 月 07 日',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-注册资本:0"]',
        schema: {
          data: {
            label: '发行人-注册资本',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 191.6667,
                  box_top: 195.8333,
                  box_right: 280,
                  box_bottom: 210.8333,
                },
                page: 45,
                text: '11,276.99 万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-注册地址:0"]',
        schema: {
          data: {
            label: '发行人-注册地址',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 192.5,
                  box_top: 278.3333,
                  box_right: 459.1667,
                  box_bottom: 295,
                },
                page: 45,
                text: '北京市海淀区中关村南大街 17 号 3 号楼 1902 室',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-办公地址:0"]',
        schema: {
          data: {
            label: '发行人-办公地址',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 190.8333,
                  box_top: 297.5,
                  box_right: 460.8333,
                  box_bottom: 311.6667,
                },
                page: 45,
                text: '北京市丰台区南四环西路 128 号院诺德中心 3 号楼 22 层',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-电话:0"]',
        schema: {
          data: {
            label: '发行人-电话',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 189.1667,
                  box_top: 337.5,
                  box_right: 287.5,
                  box_bottom: 355,
                },
                page: 45,
                text: '010-8857 8857-966',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-传真号码:0"]',
        schema: {
          data: {
            label: '发行人-传真号码',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 192.5,
                  box_top: 362.5,
                  box_right: 286.6667,
                  box_bottom: 375,
                },
                page: 45,
                text: '010-8857 8858',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-电子邮箱:0"]',
        schema: {
          data: {
            label: '发行人-电子邮箱',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 190.8333,
                  box_top: 400.8333,
                  box_right: 315,
                  box_bottom: 417.5,
                },
                page: 45,
                text: 'haoersai@hes0501.com.cn',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人-邮政编码:0"]',
        schema: {
          data: {
            label: '发行人-邮政编码',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 191.6667,
                  box_top: 318.3333,
                  box_right: 247.5,
                  box_bottom: 335,
                },
                page: 45,
                text: '100070',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:0","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 183.3333,
                  box_top: 726.6667,
                  box_right: 217.5,
                  box_bottom: 742.5,
                },
                page: 32,
                text: '戴宝林',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:0","身份证号:0"]',
        schema: {
          data: {
            label: '身份证号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 120,
                  box_top: 285.8333,
                  box_right: 231.6667,
                  box_bottom: 303.3333,
                },
                page: 33,
                text: '35058319650501****',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:0","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 302.5,
                  box_top: 260.8333,
                  box_right: 325.8333,
                  box_bottom: 278.3333,
                },
                page: 33,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:0","间接持股比例:0"]',
        schema: {
          data: {
            label: '间接持股比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 99.1667,
                  box_right: 146.6667,
                  box_bottom: 116.6667,
                },
                page: 33,
                text: '0.12%',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 467.5,
                  box_top: 100.8333,
                  box_right: 499.1667,
                  box_bottom: 113.3333,
                },
                page: 33,
                text: '0.01%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:1","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 227.5,
                  box_top: 723.3333,
                  box_right: 266.6667,
                  box_bottom: 741.6666,
                },
                page: 32,
                text: '刘清梅',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:1","身份证号:0"]',
        schema: {
          data: {
            label: '身份证号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 121.6667,
                  box_top: 333.3333,
                  box_right: 233.3334,
                  box_bottom: 346.6666,
                },
                page: 33,
                text: '35058319650225****',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:1","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 297.5,
                  box_top: 307.5,
                  box_right: 322.5,
                  box_bottom: 326.6667,
                },
                page: 33,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","控股股东-自然人:1","间接持股比例:0"]',
        schema: {
          data: {
            label: '间接持股比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 330,
                  box_top: 146.6667,
                  box_right: 362.5,
                  box_bottom: 160.83339999999998,
                },
                page: 33,
                text: '1.03%',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 280,
                  box_top: 168.3333,
                  box_right: 313.3333,
                  box_bottom: 185.8333,
                },
                page: 33,
                text: '0.17%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:0","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 96.6667,
                  box_top: 262.5,
                  box_right: 148.3334,
                  box_bottom: 278.3333,
                },
                page: 33,
                text: '戴宝林',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:0","身份证号:0"]',
        schema: {
          data: {
            label: '身份证号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 120.8333,
                  box_top: 285,
                  box_right: 232.5,
                  box_bottom: 300.8333,
                },
                page: 33,
                text: '35058319650501****',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:0","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 299.1667,
                  box_top: 262.5,
                  box_right: 324.1667,
                  box_bottom: 279.1667,
                },
                page: 33,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:0","间接持股比例:0"]',
        schema: {
          data: {
            label: '间接持股比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 100,
                  box_right: 146.6667,
                  box_bottom: 115,
                },
                page: 33,
                text: '0.12%',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 465.8333,
                  box_top: 98.3333,
                  box_right: 499.1666,
                  box_bottom: 115.8333,
                },
                page: 33,
                text: '0.01%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:1","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 98.3333,
                  box_top: 307.5,
                  box_right: 147.5,
                  box_bottom: 329.1667,
                },
                page: 33,
                text: '刘清梅',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:1","身份证号:0"]',
        schema: {
          data: {
            label: '身份证号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 120.8333,
                  box_top: 330.8333,
                  box_right: 232.5,
                  box_bottom: 350.8333,
                },
                page: 33,
                text: '35058319650225****',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:1","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 301.6667,
                  box_top: 306.6667,
                  box_right: 325.8334,
                  box_bottom: 325.8334,
                },
                page: 33,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:1","间接持股比例:0"]',
        schema: {
          data: {
            label: '间接持股比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 329.1667,
                  box_top: 142.5,
                  box_right: 364.1667,
                  box_bottom: 164.1667,
                },
                page: 33,
                text: '1.03%',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 280,
                  box_top: 168.3333,
                  box_right: 312.5,
                  box_bottom: 185,
                },
                page: 33,
                text: '0.17%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:2","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 102.5,
                  box_top: 356.6667,
                  box_right: 148.3333,
                  box_bottom: 372.5,
                },
                page: 33,
                text: '戴聪棋',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:2","身份证号:0"]',
        schema: {
          data: {
            label: '身份证号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 120.8333,
                  box_top: 377.5,
                  box_right: 233.3333,
                  box_bottom: 398.3333,
                },
                page: 33,
                text: '35058319891123****',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:2","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 301.6667,
                  box_top: 355.8333,
                  box_right: 325.8334,
                  box_bottom: 372.5,
                },
                page: 33,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","实际控制人-自然人:2","直接持股比例:0"]',
        schema: {
          data: {
            label: '直接持股比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 173.3333,
                  box_top: 214.1667,
                  box_right: 206.66660000000002,
                  box_bottom: 229.1667,
                },
                page: 33,
                text: '1.21%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130.8333,
                  box_top: 198.3333,
                  box_right: 178.3333,
                  box_bottom: 215,
                },
                page: 257,
                text: '戴宝林',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 279.1667,
                  box_top: 215,
                  box_right: 305,
                  box_bottom: 235.8333,
                },
                page: 257,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345.8333,
                  box_top: 213.3333,
                  box_right: 438.3333,
                  box_bottom: 238.3333,
                },
                page: 257,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 158.3333,
                  box_top: 217.5,
                  box_right: 172.5,
                  box_bottom: 236.6667,
                },
                page: 257,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 180,
                  box_top: 218.3333,
                  box_right: 244.1667,
                  box_bottom: 234.16660000000002,
                },
                page: 257,
                text: '1965 年 5 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 450.8333,
                  box_top: 216.6667,
                  box_right: 472.5,
                  box_bottom: 238.33339999999998,
                },
                page: 257,
                text: '本科',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 80.8333,
                  box_top: 239.1667,
                  box_right: 171.6666,
                  box_bottom: 258.3334,
                },
                page: 257,
                text: '一级照明设计师',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 181.6667,
                  box_top: 313.3333,
                  box_right: 308.3334,
                  box_bottom: 331.6666,
                },
                page: 257,
                text: '发行人董事长兼总经理；',
              },
              {
                box: {
                  box_left: 433.3333,
                  box_top: 314.1667,
                  box_right: 548.3333,
                  box_bottom: 327.5,
                },
                page: 257,
                text: '高好投资执行',
              },
              {
                box: {
                  box_left: 80,
                  box_top: 335,
                  box_right: 152.5,
                  box_bottom: 353.3333,
                },
                page: 257,
                text: '事务合伙人；',
              },
              {
                box: {
                  box_left: 271.6667,
                  box_top: 338.3333,
                  box_right: 408.3334,
                  box_bottom: 351.6666,
                },
                page: 257,
                text: '龙玺投资执行事务合伙人；',
              },
              {
                box: {
                  box_left: 101.6667,
                  box_top: 360.8333,
                  box_right: 262.5,
                  box_bottom: 375,
                },
                page: 257,
                text: '中国照明学会第七届常务理事，',
              },
              {
                box: {
                  box_left: 295,
                  box_top: 361.6667,
                  box_right: 515.8333,
                  box_bottom: 375,
                },
                page: 257,
                text: '中国照明学会室外照明专业委员会、照明',
              },
              {
                box: {
                  box_left: 87.5,
                  box_top: 381.6667,
                  box_right: 531.6667,
                  box_bottom: 400.8334,
                },
                page: 257,
                text:
                  '设计师工作委员会、系统建设运营专业委员会、装饰照明专业委员会副主任及咨',
              },
              {
                box: {
                  box_left: 78.3333,
                  box_top: 407.5,
                  box_right: 190,
                  box_bottom: 424.1667,
                },
                page: 257,
                text: '询工作委员会委员；',
              },
              {
                box: {
                  box_left: 309.1667,
                  box_top: 406.6667,
                  box_right: 527.5,
                  box_bottom: 425.8334,
                },
                page: 257,
                text: '北京照明学会第九届理事会常务理事。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 290.8333,
                  box_right: 529.1667,
                  box_bottom: 304.1666,
                },
                page: 257,
                text: '2016',
              },
              {
                box: {
                  box_left: 78.3333,
                  box_top: 313.3333,
                  box_right: 130.8333,
                  box_bottom: 330,
                },
                page: 257,
                text: '年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 132.5,
                  box_top: 311.6667,
                  box_right: 156.6667,
                  box_bottom: 334.1667,
                },
                page: 257,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:0","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:1","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 128.3333,
                  box_top: 427.5,
                  box_right: 200,
                  box_bottom: 449.1667,
                },
                page: 257,
                text: '贺洪朝',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 284.1667,
                  box_top: 452.5,
                  box_right: 307.5,
                  box_bottom: 468.3333,
                },
                page: 257,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 343.3333,
                  box_top: 450.8333,
                  box_right: 437.5,
                  box_bottom: 468.3333,
                },
                page: 257,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 160.8333,
                  box_top: 453.3333,
                  box_right: 171.66660000000002,
                  box_bottom: 472.5,
                },
                page: 257,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 185,
                  box_top: 450.8333,
                  box_right: 245.8333,
                  box_bottom: 472.5,
                },
                page: 257,
                text: '1983 年 2 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 448.3333,
                  box_top: 450.8333,
                  box_right: 472.5,
                  box_bottom: 470,
                },
                page: 257,
                text: '大专',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 360.8333,
                  box_top: 498.3333,
                  box_right: 453.3333,
                  box_bottom: 517.5,
                },
                page: 257,
                text: '发行人副总经理；',
              },
              {
                box: {
                  box_left: 147.5,
                  box_top: 524.1667,
                  box_right: 218.3333,
                  box_bottom: 540.8334,
                },
                page: 257,
                text: '发行人董事。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 453.3333,
                  box_top: 500,
                  box_right: 525,
                  box_bottom: 517.5,
                },
                page: 257,
                text: '2017 年 9',
              },
              {
                box: {
                  box_left: 82.5,
                  box_top: 524.1667,
                  box_right: 98.3333,
                  box_bottom: 539.1667,
                },
                page: 257,
                text: '月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 104.1667,
                  box_top: 524.1667,
                  box_right: 124.1667,
                  box_bottom: 537.5,
                },
                page: 257,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:1","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:2","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 127.5,
                  box_top: 542.5,
                  box_right: 184.1667,
                  box_bottom: 565,
                },
                page: 257,
                text: '侯春辉',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 290,
                  box_top: 568.3333,
                  box_right: 310.8333,
                  box_bottom: 588.3333,
                },
                page: 257,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 343.3333,
                  box_top: 568.3333,
                  box_right: 440,
                  box_bottom: 588.3333,
                },
                page: 257,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 155.8333,
                  box_top: 570,
                  box_right: 170,
                  box_bottom: 589.1667,
                },
                page: 257,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 181.6667,
                  box_top: 570,
                  box_right: 251.6667,
                  box_bottom: 587.5,
                },
                page: 257,
                text: '1985 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 450.8333,
                  box_top: 564.1667,
                  box_right: 475.8333,
                  box_bottom: 590,
                },
                page: 257,
                text: '大专',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 251.6667,
                  box_top: 664.1667,
                  box_right: 317.5,
                  box_bottom: 680.8334,
                },
                page: 257,
                text: '发行人董事；',
              },
              {
                box: {
                  box_left: 432.5,
                  box_top: 662.5,
                  box_right: 538.3333,
                  box_bottom: 678.3333,
                },
                page: 257,
                text: '发行人董事会',
              },
              {
                box: {
                  box_left: 85,
                  box_top: 687.5,
                  box_right: 124.16669999999999,
                  box_bottom: 703.3333,
                },
                page: 257,
                text: '秘书。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 134.1667,
                  box_top: 663.3333,
                  box_right: 202.5,
                  box_bottom: 680.8333,
                },
                page: 257,
                text: '2016 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 205,
                  box_top: 663.3333,
                  box_right: 229.1667,
                  box_bottom: 683.3333,
                },
                page: 257,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:2","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:3","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130.8333,
                  box_top: 709.1667,
                  box_right: 210,
                  box_bottom: 727.5,
                },
                page: 257,
                text: '闻国平',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 283.3333,
                  box_top: 731.6667,
                  box_right: 310.8333,
                  box_bottom: 749.1667,
                },
                page: 257,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 344.1667,
                  box_top: 730,
                  box_right: 439.1667,
                  box_bottom: 750.8333,
                },
                page: 257,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 156.6667,
                  box_top: 730.8333,
                  box_right: 170.83339999999998,
                  box_bottom: 753.3333,
                },
                page: 257,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 180,
                  box_top: 730,
                  box_right: 250.8333,
                  box_bottom: 751.6667,
                },
                page: 257,
                text: '1975 年 12 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 451.6667,
                  box_top: 730.8333,
                  box_right: 473.3334,
                  box_bottom: 750.8333,
                },
                page: 257,
                text: '本科',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 75,
                  box_top: 79.1667,
                  box_right: 376.6667,
                  box_bottom: 90,
                },
                page: 258,
                text: '注册会计师（非执业会员）、注册税务师（非执业会员）',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 484.1667,
                  box_top: 145,
                  box_right: 521.6667,
                  box_bottom: 160.8333,
                },
                page: 258,
                text: '发行',
              },
              {
                box: {
                  box_left: 87.5,
                  box_top: 169.1667,
                  box_right: 213.3333,
                  box_bottom: 186.6667,
                },
                page: 258,
                text: '人副总经理兼财务总监；',
              },
              {
                box: {
                  box_left: 336.6667,
                  box_top: 170.8333,
                  box_right: 523.3334,
                  box_bottom: 184.16660000000002,
                },
                page: 258,
                text: '发行人董事兼副总经理、财务总',
              },
              {
                box: {
                  box_left: 80,
                  box_top: 190.8333,
                  box_right: 174.1667,
                  box_bottom: 208.3333,
                },
                page: 258,
                text: '监。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 215,
                  box_top: 167.5,
                  box_right: 286.6667,
                  box_bottom: 184.1667,
                },
                page: 258,
                text: '2017 年 9 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 288.3333,
                  box_top: 170,
                  box_right: 310.8333,
                  box_bottom: 184.1667,
                },
                page: 258,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:3","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:4","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 125,
                  box_top: 209.1667,
                  box_right: 206.6667,
                  box_bottom: 230.83339999999998,
                },
                page: 258,
                text: '戴聪棋',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 285,
                  box_top: 239.1667,
                  box_right: 310,
                  box_bottom: 255,
                },
                page: 258,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345,
                  box_top: 235,
                  box_right: 440.8333,
                  box_bottom: 255.8333,
                },
                page: 258,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 160,
                  box_top: 235.8333,
                  box_right: 170.8333,
                  box_bottom: 253.3333,
                },
                page: 258,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 180.8333,
                  box_top: 238.3333,
                  box_right: 250.8333,
                  box_bottom: 255,
                },
                page: 258,
                text: '1989 年 11 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 451.6667,
                  box_top: 234.1667,
                  box_right: 475,
                  box_bottom: 256.6667,
                },
                page: 258,
                text: '本科',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 251.6667,
                  box_top: 285,
                  box_right: 474.1667,
                  box_bottom: 302.5,
                },
                page: 258,
                text: '发行人工程助理、采购员、采购中心经理；',
              },
              {
                box: {
                  box_left: 173.3333,
                  box_top: 310.8333,
                  box_right: 245,
                  box_bottom: 325,
                },
                page: 258,
                text: '发行人董事。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 285,
                  box_right: 557.5,
                  box_bottom: 300.8333,
                },
                page: 258,
                text: '2017',
              },
              {
                box: {
                  box_left: 83.3333,
                  box_top: 309.1667,
                  box_right: 121.66659999999999,
                  box_bottom: 324.1667,
                },
                page: 258,
                text: '年 9 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 124.1667,
                  box_top: 309.1667,
                  box_right: 148.3334,
                  box_bottom: 326.6667,
                },
                page: 258,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:4","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:5","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 131.6667,
                  box_top: 332.5,
                  box_right: 182.5,
                  box_bottom: 350.8333,
                },
                page: 258,
                text: '付恩平',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 285,
                  box_top: 353.3333,
                  box_right: 311.6667,
                  box_bottom: 374.1666,
                },
                page: 258,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 349.1667,
                  box_top: 352.5,
                  box_right: 444.1667,
                  box_bottom: 374.1667,
                },
                page: 258,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 155.8333,
                  box_top: 353.3333,
                  box_right: 169.16660000000002,
                  box_bottom: 374.1666,
                },
                page: 258,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 185,
                  box_top: 355.8333,
                  box_right: 248.3333,
                  box_bottom: 374.1666,
                },
                page: 258,
                text: '1981 年 9 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 448.3333,
                  box_top: 355.8333,
                  box_right: 492.5,
                  box_bottom: 372.5,
                },
                page: 258,
                text: '研究生',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 379.1667,
                  box_right: 250.8333,
                  box_bottom: 396.6667,
                },
                page: 258,
                text: '注册会计师（非执业会员）',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 338.3333,
                  box_top: 496.6667,
                  box_right: 515.8333,
                  box_bottom: 513.3334,
                },
                page: 258,
                text: '江西江财宏升投资管理有限公司',
              },
              {
                box: {
                  box_left: 71.6667,
                  box_top: 520,
                  box_right: 122.5,
                  box_bottom: 540,
                },
                page: 258,
                text: '监事；',
              },
              {
                box: {
                  box_left: 252.5,
                  box_top: 520,
                  box_right: 473.3333,
                  box_bottom: 537.5,
                },
                page: 258,
                text: '广州粤泰金控投资有限公司董事、董事长；',
              },
              {
                box: {
                  box_left: 174.1667,
                  box_top: 544.1667,
                  box_right: 361.6667,
                  box_bottom: 560,
                },
                page: 258,
                text: '广州蓝莓荟信息科技有限公司董事；',
              },
              {
                box: {
                  box_left: 482.5,
                  box_top: 542.5,
                  box_right: 524.1667,
                  box_bottom: 565,
                },
                page: 258,
                text: '广州',
              },
              {
                box: {
                  box_left: 84.1667,
                  box_top: 568.3333,
                  box_right: 239.1667,
                  box_bottom: 584.1666,
                },
                page: 258,
                text: '盈泰盛隆贸易有限公司监事；',
              },
              {
                box: {
                  box_left: 361.6667,
                  box_top: 567.5,
                  box_right: 523.3334,
                  box_bottom: 581.6667,
                },
                page: 258,
                text: '云南沿边跨境股权投资基金',
              },
              {
                box: {
                  box_left: 79.1667,
                  box_top: 590,
                  box_right: 191.6667,
                  box_bottom: 606.6667,
                },
                page: 258,
                text: '管理有限公司董事；',
              },
              {
                box: {
                  box_left: 313.3333,
                  box_top: 590,
                  box_right: 561.6666,
                  box_bottom: 609.1667,
                },
                page: 258,
                text: '广州市金钟汽车零件股份有限公司董',
              },
              {
                box: {
                  box_left: 76.6667,
                  box_top: 615.8333,
                  box_right: 108.33340000000001,
                  box_bottom: 629.1666,
                },
                page: 258,
                text: '事；',
              },
              {
                box: {
                  box_left: 225,
                  box_top: 615,
                  box_right: 305.8333,
                  box_bottom: 627.5,
                },
                page: 258,
                text: '发行人董事。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 615,
                  box_right: 175.8333,
                  box_bottom: 627.5,
                },
                page: 258,
                text: '2017 年 1 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 177.5,
                  box_top: 615,
                  box_right: 199.1667,
                  box_bottom: 629.1667,
                },
                page: 258,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:5","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:6","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 125.8333,
                  box_top: 636.6667,
                  box_right: 186.6666,
                  box_bottom: 654.1667,
                },
                page: 258,
                text: '张天福',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 286.6667,
                  box_top: 658.3333,
                  box_right: 336.6667,
                  box_bottom: 679.1666,
                },
                page: 258,
                text: '中国国籍',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350,
                  box_top: 656.6667,
                  box_right: 444.1667,
                  box_bottom: 678.3334,
                },
                page: 258,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 159.1667,
                  box_top: 659.1667,
                  box_right: 172.5,
                  box_bottom: 676.6667,
                },
                page: 258,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 185.8333,
                  box_top: 658.3333,
                  box_right: 253.3333,
                  box_bottom: 676.6666,
                },
                page: 258,
                text: '1968 年 3 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 455.4,
                  box_top: 655.8,
                  box_right: 512.4,
                  box_bottom: 676.8,
                },
                page: 258,
                text: '硕士研究',
              },
              {
                box: {
                  box_left: 79.8,
                  box_top: 681.6,
                  box_right: 99.6,
                  box_bottom: 702,
                },
                page: 258,
                text: '生',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 135,
                  box_top: 681.6667,
                  box_right: 401.6667,
                  box_bottom: 699.1667,
                },
                page: 258,
                text: '注册会计师（执业会员）、中级会计师、中级审计师',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 100.8333,
                  box_right: 369.1666,
                  box_bottom: 115.8333,
                },
                page: 259,
                text: '北京心物裂帛电子商务股份有限公司独立董事；',
              },
              {
                box: {
                  box_left: 493.3333,
                  box_top: 98.3333,
                  box_right: 513.3333,
                  box_bottom: 113.3333,
                },
                page: 259,
                text: '发',
              },
              {
                box: {
                  box_left: 85.8333,
                  box_top: 125,
                  box_right: 163.3333,
                  box_bottom: 139.1667,
                },
                page: 259,
                text: '行人独立董事；',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 375.8333,
                  box_top: 100,
                  box_right: 441.6666,
                  box_bottom: 116.66669999999999,
                },
                page: 259,
                text: '2016 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 445.8333,
                  box_top: 99.1667,
                  box_right: 466.6666,
                  box_bottom: 117.5,
                },
                page: 259,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:6","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:7","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 128.3333,
                  box_top: 168.3333,
                  box_right: 192.5,
                  box_bottom: 186.66660000000002,
                },
                page: 259,
                text: '梁荣庆',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 287.5,
                  box_top: 190.8333,
                  box_right: 310,
                  box_bottom: 210,
                },
                page: 259,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 348.3333,
                  box_top: 189.1667,
                  box_right: 441.6666,
                  box_bottom: 207.5,
                },
                page: 259,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 157.5,
                  box_top: 191.6667,
                  box_right: 168.3333,
                  box_bottom: 208.33339999999998,
                },
                page: 259,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 181.6667,
                  box_top: 188.3333,
                  box_right: 248.33339999999998,
                  box_bottom: 210,
                },
                page: 259,
                text: '1954 年 8 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 455.4,
                  box_top: 191.4,
                  box_right: 507.59999999999997,
                  box_bottom: 213,
                },
                page: 259,
                text: '博士研究',
              },
              {
                box: {
                  box_left: 80.4,
                  box_top: 211.2,
                  box_right: 99,
                  box_bottom: 235.2,
                },
                page: 259,
                text: '生',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 140.8333,
                  box_top: 214.1667,
                  box_right: 163.3333,
                  box_bottom: 235,
                },
                page: 259,
                text: '教授。',
              },
              {
                box: {
                  box_left: 136.2,
                  box_top: 217.2,
                  box_right: 161.39999999999998,
                  box_bottom: 235.79999999999998,
                },
                page: 259,
                text: '教授',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 301.8,
                  box_top: 213.6,
                  box_right: 517.8,
                  box_bottom: 232.79999999999998,
                },
                page: 259,
                text: '复旦大学光源与照明工程系系主任、电',
              },
              {
                box: {
                  box_left: 74.4,
                  box_top: 235.8,
                  box_right: 323.4,
                  box_bottom: 258,
                },
                page: 259,
                text: '光源研究所所长、信息科学与工程学院教授；',
              },
              {
                box: {
                  box_left: 445.8,
                  box_top: 236.4,
                  box_right: 511.20000000000005,
                  box_bottom: 256.8,
                },
                page: 259,
                text: '上海飞乐音',
              },
              {
                box: {
                  box_left: 73.8,
                  box_top: 261.6,
                  box_right: 228,
                  box_bottom: 281.40000000000003,
                },
                page: 259,
                text: '响股份有限公司独立董事；',
              },
              {
                box: {
                  box_left: 349.8,
                  box_top: 259.8,
                  box_right: 474,
                  box_bottom: 279.6,
                },
                page: 259,
                text: '中国照明学会副理事长；',
              },
              {
                box: {
                  box_left: 177.6,
                  box_top: 283.8,
                  box_right: 267.6,
                  box_bottom: 303,
                },
                page: 259,
                text: '发行人独立董事；',
              },
              {
                box: {
                  box_left: 381,
                  box_top: 282.6,
                  box_right: 504.6,
                  box_bottom: 303,
                },
                page: 259,
                text: '上海市照明学会理事长。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 261.6667,
                  box_right: 520,
                  box_bottom: 275.8334,
                },
                page: 259,
                text: '2016',
              },
              {
                box: {
                  box_left: 82.5,
                  box_top: 288.3333,
                  box_right: 129.1667,
                  box_bottom: 303.3333,
                },
                page: 259,
                text: '年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130.8333,
                  box_top: 283.3333,
                  box_right: 153.3333,
                  box_bottom: 304.1666,
                },
                page: 259,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:7","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","董事基本情况:8","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130.8333,
                  box_top: 309.1667,
                  box_right: 190.8333,
                  box_bottom: 329.1667,
                },
                page: 259,
                text: '马更新',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 285.8333,
                  box_top: 328.3333,
                  box_right: 308.3333,
                  box_bottom: 349.1666,
                },
                page: 259,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350,
                  box_top: 328.3333,
                  box_right: 441.6667,
                  box_bottom: 347.5,
                },
                page: 259,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 160,
                  box_top: 330.8333,
                  box_right: 171.6667,
                  box_bottom: 349.1666,
                },
                page: 259,
                text: '女',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 183.3333,
                  box_top: 327.5,
                  box_right: 254.16660000000002,
                  box_bottom: 348.3333,
                },
                page: 259,
                text: '1974 年 1 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 456.6,
                  box_top: 326.4,
                  box_right: 520.2,
                  box_bottom: 353.4,
                },
                page: 259,
                text: '博士研究',
              },
              {
                box: {
                  box_left: 86.4,
                  box_top: 353.4,
                  box_right: 102,
                  box_bottom: 378.59999999999997,
                },
                page: 259,
                text: '生',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 134.1667,
                  box_top: 356.6667,
                  box_right: 160.83339999999998,
                  box_bottom: 372.5,
                },
                page: 259,
                text: '教授',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 310,
                  box_top: 355,
                  box_right: 509.1667,
                  box_bottom: 370.8333,
                },
                page: 259,
                text: '中国政法大学民商经济法学院，现任',
              },
              {
                box: {
                  box_left: 78.3333,
                  box_top: 378.3333,
                  box_right: 121.66659999999999,
                  box_bottom: 395.8333,
                },
                page: 259,
                text: '教授。',
              },
              {
                box: {
                  box_left: 239.1667,
                  box_top: 378.3333,
                  box_right: 436.6667,
                  box_bottom: 395.8333,
                },
                page: 259,
                text: '北京市汉鼎联合律师事务所兼职律师；',
              },
              {
                box: {
                  box_left: 138.3333,
                  box_top: 401.6667,
                  box_right: 275.8333,
                  box_bottom: 420,
                },
                page: 259,
                text: '中国保险法学研究会理事；',
              },
              {
                box: {
                  box_left: 399.1667,
                  box_top: 404.1667,
                  box_right: 520.8334,
                  box_bottom: 420,
                },
                page: 259,
                text: '北京市互联网金融法',
              },
              {
                box: {
                  box_left: 82.5,
                  box_top: 425,
                  box_right: 190.8333,
                  box_bottom: 446.6667,
                },
                page: 259,
                text: '治研究会常务理事；',
              },
              {
                box: {
                  box_left: 310.8333,
                  box_top: 426.6667,
                  box_right: 448.3333,
                  box_bottom: 444.1667,
                },
                page: 259,
                text: '中国证券法学研究会理事；',
              },
              {
                box: {
                  box_left: 150.8333,
                  box_top: 450.8333,
                  box_right: 258.3333,
                  box_bottom: 466.6666,
                },
                page: 259,
                text: '发行人独立董事。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 455.8333,
                  box_top: 428.3333,
                  box_right: 520,
                  box_bottom: 445,
                },
                page: 259,
                text: '2017 年 9',
              },
              {
                box: {
                  box_left: 82.5,
                  box_top: 450.8333,
                  box_right: 98.3333,
                  box_bottom: 468.3333,
                },
                page: 259,
                text: '月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 102.5,
                  box_top: 450.8333,
                  box_right: 124.16669999999999,
                  box_bottom: 465.8333,
                },
                page: 259,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","董事基本情况:8","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","监事基本情况:0","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 127.5,
                  box_top: 523.3333,
                  box_right: 189.1667,
                  box_bottom: 538.3333,
                },
                page: 259,
                text: '林境波',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 287.5,
                  box_top: 540.8333,
                  box_right: 312.5,
                  box_bottom: 559.1666,
                },
                page: 259,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 349.1667,
                  box_top: 540,
                  box_right: 445,
                  box_bottom: 558.3333,
                },
                page: 259,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 160.8333,
                  box_top: 545,
                  box_right: 171.66660000000002,
                  box_bottom: 559.1667,
                },
                page: 259,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 182.5,
                  box_top: 544.1667,
                  box_right: 252.5,
                  box_bottom: 562.5,
                },
                page: 259,
                text: '1986 年 11 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 374.1667,
                  box_top: 615,
                  box_right: 490,
                  box_bottom: 630.8333,
                },
                page: 259,
                text: '发行人监事会主席。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 253.3333,
                  box_top: 615,
                  box_right: 324.1666,
                  box_bottom: 627.5,
                },
                page: 259,
                text: '2016 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 329.1667,
                  box_top: 615.8333,
                  box_right: 348.3334,
                  box_bottom: 626.6666,
                },
                page: 259,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:0","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","监事基本情况:1","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 129.1667,
                  box_top: 635,
                  box_right: 179.1667,
                  box_bottom: 654.1667,
                },
                page: 259,
                text: '张志',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 272.5,
                  box_top: 655.8333,
                  box_right: 302.5,
                  box_bottom: 677.5,
                },
                page: 259,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 340,
                  box_top: 657.5,
                  box_right: 434.1667,
                  box_bottom: 675.8333,
                },
                page: 259,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 145.8333,
                  box_top: 660.8333,
                  box_right: 159.16660000000002,
                  box_bottom: 678.3333,
                },
                page: 259,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 171.6667,
                  box_top: 656.6667,
                  box_right: 240.83339999999998,
                  box_bottom: 677.5,
                },
                page: 259,
                text: '1983 年 12 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 446.6667,
                  box_top: 658.3333,
                  box_right: 469.1667,
                  box_bottom: 677.5,
                },
                page: 259,
                text: '本科',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 325.8333,
                  box_top: 706.6667,
                  box_right: 526.6666,
                  box_bottom: 720.8334,
                },
                page: 259,
                text: '豪尔赛采购员、采购中心副经理；',
              },
              {
                box: {
                  box_left: 205.8333,
                  box_top: 731.6667,
                  box_right: 314.1666,
                  box_bottom: 747.5,
                },
                page: 259,
                text: '发行人监事。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 77.5,
                  box_top: 730.8333,
                  box_right: 152.5,
                  box_bottom: 747.5,
                },
                page: 259,
                text: '2016 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 160,
                  box_top: 727.5,
                  box_right: 180,
                  box_bottom: 748.3333,
                },
                page: 259,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:1","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","监事基本情况:2","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 127.5,
                  box_top: 75.8333,
                  box_right: 208.3333,
                  box_bottom: 97.5,
                },
                page: 260,
                text: '周立圆',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 281.6667,
                  box_top: 96.6667,
                  box_right: 305,
                  box_bottom: 115.83340000000001,
                },
                page: 260,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 337.5,
                  box_top: 95.8333,
                  box_right: 438.3333,
                  box_bottom: 115.8333,
                },
                page: 260,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 156.6667,
                  box_top: 99.1667,
                  box_right: 170,
                  box_bottom: 114.1667,
                },
                page: 260,
                text: '女',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 182.5,
                  box_top: 96.6667,
                  box_right: 245,
                  box_bottom: 115.83340000000001,
                },
                page: 260,
                text: '1986 年 8 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 449.1667,
                  box_top: 97.5,
                  box_right: 475,
                  box_bottom: 117.5,
                },
                page: 260,
                text: '本科',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 81.6667,
                  box_top: 123.3333,
                  box_right: 173.3334,
                  box_bottom: 140.8333,
                },
                page: 260,
                text: '二级照明设计师',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 437.5,
                  box_top: 146.6667,
                  box_right: 570,
                  box_bottom: 162.5,
                },
                page: 260,
                text: '发行人职工代',
              },
              {
                box: {
                  box_left: 85,
                  box_top: 168.3333,
                  box_right: 130,
                  box_bottom: 184.16660000000002,
                },
                page: 260,
                text: '表监事。',
              },
              {
                box: {
                  box_left: 225,
                  box_top: 145.8333,
                  box_right: 315,
                  box_bottom: 161.66660000000002,
                },
                page: 260,
                text: '公司主案设计师。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 145.8333,
                  box_right: 380.8334,
                  box_bottom: 160,
                },
                page: 260,
                text: '2016 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 388.3333,
                  box_top: 144.1667,
                  box_right: 407.5,
                  box_bottom: 162.5,
                },
                page: 260,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","监事基本情况:2","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","高管基本情况:0","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 170,
                  box_top: 264.1667,
                  box_right: 209.1667,
                  box_bottom: 276.6667,
                },
                page: 260,
                text: '戴宝林',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:0","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '是',
      },
      {
        key: '["No.01:0","高管基本情况:1","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 222.5,
                  box_top: 260,
                  box_right: 256.6667,
                  box_bottom: 277.5,
                },
                page: 260,
                text: '贺洪朝',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:1","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '是',
      },
      {
        key: '["No.01:0","高管基本情况:2","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 271.6667,
                  box_top: 263.3333,
                  box_right: 305.8334,
                  box_bottom: 279.1666,
                },
                page: 260,
                text: '侯春辉',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:2","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '是',
      },
      {
        key: '["No.01:0","高管基本情况:3","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 318.3333,
                  box_top: 262.5,
                  box_right: 352.5,
                  box_bottom: 278.3333,
                },
                page: 260,
                text: '闻国平',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:3","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '是',
      },
      {
        key: '["No.01:0","高管基本情况:4","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 133.3333,
                  box_top: 332.5,
                  box_right: 182.5,
                  box_bottom: 350.8333,
                },
                page: 260,
                text: '包瑞',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 273.3333,
                  box_top: 354.1667,
                  box_right: 302.5,
                  box_bottom: 370.8334,
                },
                page: 260,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 339.1667,
                  box_top: 352.5,
                  box_right: 430,
                  box_bottom: 373.3333,
                },
                page: 260,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 145.8333,
                  box_top: 355.8333,
                  box_right: 159.16660000000002,
                  box_bottom: 372.5,
                },
                page: 260,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 170,
                  box_top: 350.8333,
                  box_right: 236.6667,
                  box_bottom: 372.5,
                },
                page: 260,
                text: '1982 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 439.2,
                  box_top: 354.6,
                  box_right: 524.4,
                  box_bottom: 373.8,
                },
                page: 260,
                text: '在读硕士研',
              },
              {
                box: {
                  box_left: 82.8,
                  box_top: 379.2,
                  box_right: 110.4,
                  box_bottom: 400.2,
                },
                page: 260,
                text: '究生',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 124.1667,
                  box_top: 378.3333,
                  box_right: 183.3334,
                  box_bottom: 394.1666,
                },
                page: 260,
                text: '电气工程师',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 182.5,
                  box_top: 427.5,
                  box_right: 456.6667,
                  box_bottom: 441.6667,
                },
                page: 260,
                text: '公司电气部经理、技术中心副经理、经理、副总经理',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 401.6667,
                  box_right: 515,
                  box_bottom: 418.3334,
                },
                page: 260,
                text: '2012',
              },
              {
                box: {
                  box_left: 86.6667,
                  box_top: 426.6667,
                  box_right: 121.6667,
                  box_bottom: 441.6667,
                },
                page: 260,
                text: '年 4 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 126.6667,
                  box_top: 425,
                  box_right: 148.3334,
                  box_bottom: 442.5,
                },
                page: 260,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:4","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","高管基本情况:5","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130,
                  box_top: 522.5,
                  box_right: 180.8333,
                  box_bottom: 534.1667,
                },
                page: 260,
                text: '张俊峰',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 281.6667,
                  box_top: 540,
                  box_right: 308.3334,
                  box_bottom: 559.1667,
                },
                page: 260,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 344.1667,
                  box_top: 539.1667,
                  box_right: 439.1667,
                  box_bottom: 560,
                },
                page: 260,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 155,
                  box_top: 540,
                  box_right: 170,
                  box_bottom: 562.5,
                },
                page: 260,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 182.5,
                  box_top: 543.3333,
                  box_right: 250,
                  box_bottom: 560,
                },
                page: 260,
                text: '1980 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 450.8333,
                  box_top: 540.8333,
                  box_right: 474.1666,
                  box_bottom: 560.8333,
                },
                page: 260,
                text: '大专',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 206.6667,
                  box_top: 587.5,
                  box_right: 395,
                  box_bottom: 607.5,
                },
                page: 260,
                text: '发行人营销中心经理、副总经理。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.3333,
                  box_top: 590.8333,
                  box_right: 155.8333,
                  box_bottom: 604.1666,
                },
                page: 260,
                text: '2009 年 12 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:5","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","高管基本情况:6","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 129.1667,
                  box_top: 615,
                  box_right: 192.5,
                  box_bottom: 626.6667,
                },
                page: 260,
                text: '刘墩煌',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 286.6667,
                  box_top: 632.5,
                  box_right: 309.1667,
                  box_bottom: 652.5,
                },
                page: 260,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345.8333,
                  box_top: 637.5,
                  box_right: 440,
                  box_bottom: 651.6667,
                },
                page: 260,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 158.3333,
                  box_top: 635,
                  box_right: 170.8333,
                  box_bottom: 652.5,
                },
                page: 260,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 182.5,
                  box_top: 633.3333,
                  box_right: 248.3333,
                  box_bottom: 655.8333,
                },
                page: 260,
                text: '1984 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 450,
                  box_top: 634.1667,
                  box_right: 471.6667,
                  box_bottom: 655.8334,
                },
                page: 260,
                text: '大专',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 291.6667,
                  box_top: 684.1667,
                  box_right: 382.5,
                  box_bottom: 700.8334,
                },
                page: 260,
                text: '发行人副总经理；',
              },
              {
                box: {
                  box_left: 75,
                  box_top: 705.8333,
                  box_right: 190.8333,
                  box_bottom: 725,
                },
                page: 260,
                text: '上海分公司负责人；',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 173.3333,
                  box_top: 683.3333,
                  box_right: 240.8333,
                  box_bottom: 700.8333,
                },
                page: 260,
                text: '2016 年 10 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 237.5,
                  box_top: 684.1667,
                  box_right: 265.8333,
                  box_bottom: 698.3334,
                },
                page: 260,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","高管基本情况:6","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","核心技术人员基本情况:0","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 233.3333,
                  box_top: 99.1667,
                  box_right: 266.6666,
                  box_bottom: 114.1667,
                },
                page: 261,
                text: '戴宝林',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:0","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '是',
      },
      {
        key: '["No.01:0","核心技术人员基本情况:1","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 280,
                  box_top: 101.6667,
                  box_right: 305.8333,
                  box_bottom: 115.83340000000001,
                },
                page: 261,
                text: '包瑞',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:1","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '是',
      },
      {
        key: '["No.01:0","核心技术人员基本情况:2","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 311.6667,
                  box_top: 97.5,
                  box_right: 351.6667,
                  box_bottom: 119.16669999999999,
                },
                page: 261,
                text: '周立圆',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:2","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '是',
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","姓名:0"]',
        schema: {
          data: {
            label: '姓名',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 99.1667,
                  box_top: 192.5,
                  box_right: 145.8334,
                  box_bottom: 211.6667,
                },
                page: 261,
                text: '王培星',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","国籍:0"]',
        schema: {
          data: {
            label: '国籍',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 282.5,
                  box_top: 191.6667,
                  box_right: 309.1667,
                  box_bottom: 207.5,
                },
                page: 261,
                text: '中国',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","境外居留权:0"]',
        schema: {
          data: {
            label: '境外居留权',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 344.1667,
                  box_top: 192.5,
                  box_right: 440,
                  box_bottom: 208.3333,
                },
                page: 261,
                text: '无境外永久居留权',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","性别:0"]',
        schema: {
          data: {
            label: '性别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 159.1667,
                  box_top: 192.5,
                  box_right: 170.83339999999998,
                  box_bottom: 210,
                },
                page: 261,
                text: '男',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","出生年月:0"]',
        schema: {
          data: {
            label: '出生年月',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 181.6667,
                  box_top: 194.1667,
                  box_right: 248.33339999999998,
                  box_bottom: 210.83339999999998,
                },
                page: 261,
                text: '1982 年 12 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","学历:0"]',
        schema: {
          data: {
            label: '学历',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 452.5,
                  box_top: 190.8333,
                  box_right: 472.5,
                  box_bottom: 210.8333,
                },
                page: 261,
                text: '大专',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","职称:0"]',
        schema: {
          data: {
            label: '职称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.1667,
                  box_top: 214.1667,
                  box_right: 173.3334,
                  box_bottom: 234.1667,
                },
                page: 261,
                text: '一级照明设计师',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","现任职务:0"]',
        schema: {
          data: {
            label: '现任职务',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 312.5,
                  box_top: 216.6667,
                  box_right: 517.5,
                  box_bottom: 231.6667,
                },
                page: 261,
                text: '发行人设计中心设计师、副经理、经',
              },
              {
                box: {
                  box_left: 83.3333,
                  box_top: 240.8333,
                  box_right: 106.66659999999999,
                  box_bottom: 255,
                },
                page: 261,
                text: '理。',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","起始日期:0"]',
        schema: {
          data: {
            label: '起始日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 180.8333,
                  box_top: 214.1667,
                  box_right: 250.8333,
                  box_bottom: 233.33339999999998,
                },
                page: 261,
                text: '2007 年 6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","终止日期:0"]',
        schema: {
          data: {
            label: '终止日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 255,
                  box_top: 215.8333,
                  box_right: 275,
                  box_bottom: 232.5,
                },
                page: 261,
                text: '至今',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","核心技术人员基本情况:3","是否已有简历:0"]',
        schema: {
          data: {
            label: '是否已有简历',
            required: false,
            multi: true,
            type: '是否已有简历',
            words: '',
          },
        },
        data: [],
        value: '否',
      },
      {
        key: '["No.01:0","合并资产负债表-报表日期:0"]',
        schema: {
          data: {
            label: '合并资产负债表-报表日期',
            type: '日期',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 189.1667,
                  box_top: 310.8333,
                  box_right: 245,
                  box_bottom: 326.6666,
                },
                page: 278,
                text: '2018.06.30',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 266.6667,
                  box_top: 309.1667,
                  box_right: 328.3334,
                  box_bottom: 328.3334,
                },
                page: 278,
                text: '2017.12.31',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 359.1667,
                  box_top: 305.8333,
                  box_right: 411.6667,
                  box_bottom: 326.6666,
                },
                page: 278,
                text: '2016.12.31',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 435,
                  box_top: 309.1667,
                  box_right: 497.5,
                  box_bottom: 332.5,
                },
                page: 278,
                text: '2015.12.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并资产负债表-货币单位:0"]',
        schema: {
          data: {
            label: '合并资产负债表-货币单位',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 492.5,
                  box_top: 280.8333,
                  box_right: 512.5,
                  box_bottom: 306.6666,
                },
                page: 278,
                text: '元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并资产负债表:0"]',
        schema: {
          data: {
            label: '合并资产负债表',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 80,
                  box_top: 306.6667,
                  box_right: 517.5,
                  box_bottom: 682.5,
                },
                page: 278,
                text:
                  '资 产 2018.06.30 2017.12.31 2016.12.31 2015.12.31 \n流动资产：\n货币资金 179,687,778.21 183,339,223.69 61,382,556.31 30,595,853.89\n应收票据 18,126,157.02 2,793,476.42 158,000.00 200,000.00\n应收账款 420,486,750.85 282,590,659.68 206,842,415.50 140,477,313.00\n预付款项 11,231,451.42 6,684,304.31 3,180,358.05 2,474,100.72\n其他应收款 12,589,730.08 17,902,086.56 12,240,114.03 7,885,457.73\n存货 165,329,968.64 158,720,124.04 76,576,100.92 46,014,918.05\n其他流动资产 12,072,947.17 1,836,288.93 2,964,295.27 463,167.73\n流动资产合计 819,524,783.39 653,866,163.63 363,343,840.08 228,110,811.12\n非流动资产：\n固定资产 15,862,051.23 15,508,973.40 16,281,627.59 16,616,580.77\n无形资产 432,748.37 279,145.13 196,374.50 173,090.00\n长期待摊费用 142,385.14 259,770.10 849,054.92 1,172,728.10\n递延所得税资产 9,503,515.27 6,841,803.20 4,184,671.94 3,085,660.44\n其他非流动资产 --9,496,287.52 4,081,972.00\n非流动资产合计 25,940,700.01 22,889,691.83 31,008,016.47 25,130,031.31\n资产总计 845,465,483.40 676,755,855.46 394,351,856.55 253,240,842.43',
              },
              {
                box: {
                  box_left: 77.5,
                  box_top: 118.3333,
                  box_right: 513.3333,
                  box_bottom: 675,
                },
                page: 279,
                text:
                  '负债和所有者权益 2018.06.30 2017.12.31 2016.12.31 2015.12.31 \n流动负债：\n短期借款 1,000,000.00 1,000,000.00 2,000,000.00 -\n应付票据 66,052,582.55 20,539,699.83 --\n应付账款 139,455,073.97 139,991,040.21 76,722,586.93 60,600,708.04\n预收款项 25,948,144.56 4,405,917.33 8,779,761.01 11,449,538.97\n应付职工薪酬 10,765,987.75 7,489,460.86 6,283,751.60 4,609,459.35\n应交税费 43,733,326.11 35,660,517.23 18,517,660.77 28,210,203.05\n应付股利 --7,000,000.00 -\n其他应付款 6,258,110.90 2,157,030.96 3,083,073.25 2,636,169.98\n其他流动负债 10,163,140.31 11,622,971.53 4,354,028.71 -\n流动负债合计 303,376,366.15 222,866,637.95 126,740,862.27 107,506,079.39\n非流动负债：\n预计负债 3,333,416.64 1,056,175.76 --\n递延所得税负债 3,444.43 5,078.51 8,634.99 12,925.25\n非流动负债合计 3,336,861.07 1,061,254.27 8,634.99 12,925.25\n负债总计 306,713,227.22 223,927,892.22 126,749,497.26 107,519,004.64\n所有者权益：\n股本 112,769,930.00 112,769,930.00 104,166,000.00 51,680,000.00\n资本公积 258,086,292.50 258,086,292.50 163,690,222.50 200.00\n盈余公积 8,521,101.54 8,521,101.54 90,404.86 9,323,633.92\n未分配利润 159,374,932.14 73,450,639.20 -344,268.07 84,718,003.87\n归属于母公司所有者权538\n益合计,752,256.18 452,827,963.24 267,602,359.29 145,721,837.79\n \n少数股东权益 ----\n所有者权益合计 538,752,256.18 452,827,963.24 267,602,359.29 145,721,837.79\n负债和所有者权益合计 845,465,483.40 676,755,855.46 394,351,856.55 253,240,842.43',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并利润表-报表日期:0"]',
        schema: {
          data: {
            label: '合并利润表-报表日期',
            type: '日期',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 208.3333,
                  box_top: 123.3333,
                  box_right: 276.6666,
                  box_bottom: 138.3333,
                },
                page: 280,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 299.1667,
                  box_top: 123.3333,
                  box_right: 345.8334,
                  box_bottom: 140.8333,
                },
                page: 280,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 365.8333,
                  box_top: 121.6667,
                  box_right: 417.5,
                  box_bottom: 141.6667,
                },
                page: 280,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 445,
                  box_top: 123.3333,
                  box_right: 502.5,
                  box_bottom: 141.6666,
                },
                page: 280,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并利润表-货币单位:0"]',
        schema: {
          data: {
            label: '合并利润表-货币单位',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 491.6667,
                  box_top: 96.6667,
                  box_right: 514.1667,
                  box_bottom: 118.33340000000001,
                },
                page: 280,
                text: '元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并利润表:0"]',
        schema: {
          data: {
            label: '合并利润表',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 71.6667,
                  box_top: 119.1667,
                  box_right: 517.5,
                  box_bottom: 752.5,
                },
                page: 280,
                text:
                  '项 目 2018 年 1-6 月 2017 年度 2016 年度 2015 年度\n一、营业总收入 442,205,669.34 485,757,670.53 280,844,993.48 239,724,754.85\n其中：营业收入 442,205,669.34 485,757,670.53 280,844,993.48 239,724,754.85\n二、营业总成本 336,892,013.30 388,130,883.79 257,476,191.72 214,505,551.84\n其中：营业成本 267,164,178.55 294,325,600.10 178,183,050.92 154,066,997.25\n税金及附加 1,466,652.84 1,347,667.54 1,014,318.86 7,448,805.79\n销售费用 18,396,289.66 22,742,028.87 12,188,187.86 10,843,291.24\n管理费用 33,921,830.31 52,535,772.43 58,006,669.55 36,762,837.38\n财务费用 -329,072.98 -190,844.30 189,073.43 379,687.56\n资产减值损失 16,272,134.92 17,370,659.15 7,894,891.10 5,003,932.62\n 加：资产处置收益 - 224,467.29 -5,849.80\n三、营业利润 105,313,656.04 97,851,254.03 23,368,801.76 25,225,052.81\n加：营业外收入 222,395.70 123,293.46 32,568.42 356,547.14\n减：营业外支出 4,010,450.00 124,092.19 888,474.04 223,087.55\n四、利润总额 101,525,601.74 97,850,455.30 22,512,896.14 25,358,512.40\n减：所得税费用 15,601,308.80 15,624,851.35 6,508,581.15 3,437,491.80\n五、净利润 85,924,292.94 82,225,603.95 16,004,314.99 21,921,020.60\n（一）按经营持续性分\n类85,924,292.94 82,225,603.95 16,004,314.99 21,921,020.60\n 1.持续经营净利润 85,924,292.94 82,225,603.95 16,004,314.99 21,921,020.60\n 2.终止经营净利润 ----\n（二）按所有权归属分\n类85,924,292.94 82,225,603.95 16,004,314.99 21,921,020.60\n1.归属于母公司所有\n者的净利润 85,924,292.94 82,225,603.95 16,004,314.99 21,921,020.60\n2.少数股东损益 ----\n六、其他综合收益的税\n后净额 ----\n（一）以后不能重分类\n进损益的其他综合收益 ----\n（二）以后将重分类进\n损益的其他综合收益 ----\n七、综合收益总额 85,924,292.94 82,225,603.95 16,004,314.99 21,921,020.60\n（一）归属于母公司所\n有者的综合收益总额 85,924,292.94 82,225,603.95 16,004,314.99 21,921,020.60',
              },
              {
                box: {
                  box_left: 70.8333,
                  box_top: 76.6667,
                  box_right: 520.8333,
                  box_bottom: 169.1667,
                },
                page: 281,
                text:
                  '（二）归属于少数股东\n的综合收益总额 ----\n八、每股收益\n（一）基本每股收益 0.76 0.78 0.20 -\n（二）稀释每股收益 0.76 0.78 0.20 -',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并现金流量表-报表日期:0"]',
        schema: {
          data: {
            label: '合并现金流量表-报表日期',
            type: '日期',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 205,
                  box_top: 214.1667,
                  box_right: 275,
                  box_bottom: 229.1667,
                },
                page: 281,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 293.3333,
                  box_top: 213.3333,
                  box_right: 343.3333,
                  box_bottom: 230,
                },
                page: 281,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 368.3333,
                  box_top: 216.6667,
                  box_right: 424.1666,
                  box_bottom: 230,
                },
                page: 281,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 438.3333,
                  box_top: 220,
                  box_right: 506.6666,
                  box_bottom: 232.5,
                },
                page: 281,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并现金流量表-货币单位:0"]',
        schema: {
          data: {
            label: '合并现金流量表-货币单位',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 493.3333,
                  box_top: 190.8333,
                  box_right: 517.5,
                  box_bottom: 206.66660000000002,
                },
                page: 281,
                text: '元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","合并现金流量表:0"]',
        schema: {
          data: {
            label: '合并现金流量表',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 75.8333,
                  box_top: 210.8333,
                  box_right: 519.1666,
                  box_bottom: 752.5,
                },
                page: 281,
                text:
                  '项 目 2018 年 1-6 月 2017 年度 2016 年度 2015 年度\n一、经营活动产生的现\n金流量\n销售商品、提供劳务收\n到的现金 332,056,031.21 346,255,199.91 190,993,193.46 214,225,354.54\n收到的税费返还 ----\n收到其他与经营活动有\n关的现金 7,231,064.70 919,892.95 1,371,264.02 5,528,889.31\n经营活动现金流入小计 339,287,095.91 347,175,092.86 192,364,457.48 219,754,243.85\n购买商品、接受劳务支\n付的现金 256,060,988.92 222,847,400.71 161,904,547.25 138,334,653.26\n支付给职工以及为职工\n支付的现金 28,583,611.91 45,509,724.65 38,337,383.52 36,606,937.13\n支付的各项税费 33,442,056.81 19,733,848.05 28,741,431.78 7,140,313.96\n支付其他与经营活动有\n关的现金 22,863,506.12 43,629,567.38 30,267,327.17 21,454,145.76\n经营活动现金流出小计 340,950,163.76 331,720,540.79 259,250,689.72 203,536,050.11\n经营活动产生的现金流\n量净额 -1,663,067.85 15,454,552.07 -66,886,232.24 16,218,193.74\n二、投资活动产生的现\n金流量\n收回投资收到的现金 ----\n取得投资收益收到的现\n金----\n处置固定资产、无形资\n产和其他长期资产所收-12,700,247.69 -8,000.00\n回的现金净额\n处置子公司及其他营业\n单位收回的现金净额 ----\n收到其他与投资活动有\n关的现金 ----\n投资活动现金流入小计 - 12,700,247.69 -8,000.00\n购建固定资产、无形资\n产和其他长期资产所支1,652,292.33 1,193,394.38 2,062,415.34 1,390,389.98\n付的现金',
              },
              {
                box: {
                  box_left: 65,
                  box_top: 73.3333,
                  box_right: 526.6667,
                  box_bottom: 652.5,
                },
                page: 282,
                text:
                  '投资支付的现金 ----\n取得子公司及其他营业\n单位支付的现金净额 ----\n支付其他与投资活动有\n关的现金 ----\n投资活动现金流出小计 1,652,292.33 1,193,394.38 2,062,415.34 1,390,389.98\n投资活动产生的现金流\n量净额 -1,652,292.33 11,506,853.31 -2,062,415.34 -1,382,389.98\n三、筹资活动产生的现\n金流量：\n吸收投资收到的现金 -103,000,000.00 125,460,000.00 -\n其中：子公司吸收少\n数股东权益性投资收到----\n的现金\n取得借款所收到的现金 -1,540,000.00 2,000,000.00 -\n发行债券收到的现金 ----\n收到其他与筹资活动有\n关的现金 --543,629.01 -\n筹资活动现金流入小计 - 104,540,000.00 128,003,629.01 -\n偿还债务所支付的现金 - 2,540,000.00 --\n分配股利、利润或偿付\n利息所支付的现金 26,245.00 7,014,578.30 28,024,650.00 57,427.48\n其中：子公司支付给\n少数股东的股利、利润 ----\n支付其他与筹资活动有\n关的现金 32,267,265.90 8,269,582.62 -212,131.71\n筹资活动现金流出小计 32,293,510.90 17,824,160.92 28,024,650.00 269,559.19\n筹资活动产生的现金流\n量净额 -32,293,510.90 86,715,839.08 99,978,979.01 -269,559.19\n四、汇率变动对现金及\n现金等价物的影响 ----\n五、现金及现金等价物\n净增加额 -35,608,871.08 113,677,244.46 31,030,331.43 14,566,244.57\n加：期初现金及现金等\n价物余额 174,259,800.77 60,582,556.31 29,552,224.88 14,985,980.31\n六、期末现金及现金等\n价物余额 138,650,929.69 174,259,800.77 60,582,556.31 29,552,224.88',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","报表日期:0"]',
        schema: {
          data: {
            label: '报表日期',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 257.5,
                  box_top: 555,
                  box_right: 324.1667,
                  box_bottom: 579.1667,
                },
                page: 321,
                text: '2018.06.30/ \n2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 332.5,
                  box_top: 556.6667,
                  box_right: 383.3333,
                  box_bottom: 580,
                },
                page: 321,
                text: '2017.12.31/\n2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 393.3333,
                  box_top: 554.1667,
                  box_right: 448.3333,
                  box_bottom: 580.8334,
                },
                page: 321,
                text: '2016.12.31/ \n2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 454.1667,
                  box_top: 550.8333,
                  box_right: 506.6667,
                  box_bottom: 580.8333,
                },
                page: 321,
                text: '2015.12.31/\n2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","流动比率(倍)(T-2年):0"]',
        schema: {
          data: {
            label: '流动比率(倍)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 473.3333,
                  box_top: 582.5,
                  box_right: 514.1666,
                  box_bottom: 595.8333,
                },
                page: 321,
                text: '2.12',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","流动比率(倍)(T-1年):0"]',
        schema: {
          data: {
            label: '流动比率(倍)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 419.1667,
                  box_top: 583.3333,
                  box_right: 446.6667,
                  box_bottom: 597.5,
                },
                page: 321,
                text: '2.87',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","流动比率(倍)(T年):0"]',
        schema: {
          data: {
            label: '流动比率(倍)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350,
                  box_top: 584.1667,
                  box_right: 382.5,
                  box_bottom: 595,
                },
                page: 321,
                text: '2.93',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","流动比率(倍)(最近一期）:0"]',
        schema: {
          data: {
            label: '流动比率(倍)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 292.5,
                  box_top: 586.6667,
                  box_right: 330.8333,
                  box_bottom: 597.5,
                },
                page: 321,
                text: '2.70',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","速动比率(倍)(T-2年):0"]',
        schema: {
          data: {
            label: '速动比率(倍)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 602.5,
                  box_right: 514.1667,
                  box_bottom: 617.5,
                },
                page: 321,
                text: '1.69',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","速动比率(倍)(T-1年):0"]',
        schema: {
          data: {
            label: '速动比率(倍)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 406.6667,
                  box_top: 597.5,
                  box_right: 445.8334,
                  box_bottom: 615,
                },
                page: 321,
                text: '2.26',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","速动比率(倍)(T年):0"]',
        schema: {
          data: {
            label: '速动比率(倍)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350.8333,
                  box_top: 601.6667,
                  box_right: 385,
                  box_bottom: 616.6667,
                },
                page: 321,
                text: '2.22',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","速动比率(倍)(最近一期）:0"]',
        schema: {
          data: {
            label: '速动比率(倍)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 286.6667,
                  box_top: 599.1667,
                  box_right: 324.1667,
                  box_bottom: 615.8334,
                },
                page: 321,
                text: '2.16',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","资产负债率(母公司）(T-2年):0"]',
        schema: {
          data: {
            label: '资产负债率(母公司）(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 468.3333,
                  box_top: 623.3333,
                  box_right: 515,
                  box_bottom: 633.3333,
                },
                page: 321,
                text: '42.33',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","资产负债率(母公司）(T-1年):0"]',
        schema: {
          data: {
            label: '资产负债率(母公司）(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 413.3333,
                  box_top: 620.8333,
                  box_right: 448.3333,
                  box_bottom: 635,
                },
                page: 321,
                text: '32.32',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","资产负债率(母公司）(T年):0"]',
        schema: {
          data: {
            label: '资产负债率(母公司）(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 347.5,
                  box_top: 621.6667,
                  box_right: 383.3333,
                  box_bottom: 635,
                },
                page: 321,
                text: '33.15',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","资产负债率(母公司）(最近一期）:0"]',
        schema: {
          data: {
            label: '资产负债率(母公司）(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 284.1667,
                  box_top: 620.8333,
                  box_right: 323.3334,
                  box_bottom: 636.6666,
                },
                page: 321,
                text: '36.44',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年):0"]',
        schema: {
          data: {
            label:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 478.3333,
                  box_top: 645.8333,
                  box_right: 520.8333,
                  box_bottom: 659.1666,
                },
                page: 321,
                text: '0.12',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年):0"]',
        schema: {
          data: {
            label:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 406.6667,
                  box_top: 638.3333,
                  box_right: 450,
                  box_bottom: 664.1666,
                },
                page: 321,
                text: '0.07',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年):0"]',
        schema: {
          data: {
            label:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 346.6667,
                  box_top: 642.5,
                  box_right: 385,
                  box_bottom: 660.8333,
                },
                page: 321,
                text: '0.06',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）:0"]',
        schema: {
          data: {
            label:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 288.3333,
                  box_top: 641.6667,
                  box_right: 325.8333,
                  box_bottom: 663.3334,
                },
                page: 321,
                text: '0.08',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","应收账款周转率(次/年)(T-2年):0"]',
        schema: {
          data: {
            label: '应收账款周转率(次/年)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 473.3333,
                  box_top: 690.8333,
                  box_right: 519.1666,
                  box_bottom: 703.3333,
                },
                page: 321,
                text: '1.67',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","应收账款周转率(次/年)(T-1年):0"]',
        schema: {
          data: {
            label: '应收账款周转率(次/年)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 415,
                  box_top: 685,
                  box_right: 447.5,
                  box_bottom: 702.5,
                },
                page: 321,
                text: '1.44',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","应收账款周转率(次/年)(T年):0"]',
        schema: {
          data: {
            label: '应收账款周转率(次/年)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350.8333,
                  box_top: 685.8333,
                  box_right: 386.6666,
                  box_bottom: 701.6666,
                },
                page: 321,
                text: '1.74',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","应收账款周转率(次/年)(最近一期）:0"]',
        schema: {
          data: {
            label: '应收账款周转率(次/年)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 293.3333,
                  box_top: 685.8333,
                  box_right: 326.6666,
                  box_bottom: 703.3333,
                },
                page: 321,
                text: '2.20',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","存货周转率(次/年)(T-2年):0"]',
        schema: {
          data: {
            label: '存货周转率(次/年)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 465.8333,
                  box_top: 708.3333,
                  box_right: 525,
                  box_bottom: 723.3333,
                },
                page: 321,
                text: '3.43',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","存货周转率(次/年)(T-1年):0"]',
        schema: {
          data: {
            label: '存货周转率(次/年)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 421.6667,
                  box_top: 707.5,
                  box_right: 445.8334,
                  box_bottom: 720.8333,
                },
                page: 321,
                text: '2.91',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","存货周转率(次/年)(T年):0"]',
        schema: {
          data: {
            label: '存货周转率(次/年)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 349.1667,
                  box_top: 708.3333,
                  box_right: 391.6667,
                  box_bottom: 720.8333,
                },
                page: 321,
                text: '2.50',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","存货周转率(次/年)(最近一期）:0"]',
        schema: {
          data: {
            label: '存货周转率(次/年)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 285,
                  box_top: 708.3333,
                  box_right: 329.1667,
                  box_bottom: 721.6666,
                },
                page: 321,
                text: '3.30',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","总资产周转率(次/年)(T-2年):0"]',
        schema: {
          data: {
            label: '总资产周转率(次/年)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 471.6667,
                  box_top: 189.1667,
                  box_right: 510,
                  box_bottom: 203.33339999999998,
                },
                page: 371,
                text: '1.02',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","总资产周转率(次/年)(T-1年):0"]',
        schema: {
          data: {
            label: '总资产周转率(次/年)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 404.1667,
                  box_top: 190,
                  box_right: 441.6667,
                  box_bottom: 205.8333,
                },
                page: 371,
                text: '0.87',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","总资产周转率(次/年)(T年):0"]',
        schema: {
          data: {
            label: '总资产周转率(次/年)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 330,
                  box_top: 189.1667,
                  box_right: 376.6667,
                  box_bottom: 203.33339999999998,
                },
                page: 371,
                text: '0.91',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","总资产周转率(次/年)(最近一期）:0"]',
        schema: {
          data: {
            label: '总资产周转率(次/年)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 267.5,
                  box_top: 190,
                  box_right: 312.5,
                  box_bottom: 204.1667,
                },
                page: 371,
                text: '1.16',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","息税折旧摊销前利润-单位:0"]',
        schema: {
          data: {
            label: '息税折旧摊销前利润-单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 194.1667,
                  box_top: 725.8333,
                  box_right: 212.5,
                  box_bottom: 740,
                },
                page: 321,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","息税折旧摊销前利润(元)(T-2年):0"]',
        schema: {
          data: {
            label: '息税折旧摊销前利润(元)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 459.1667,
                  box_top: 725.8333,
                  box_right: 520,
                  box_bottom: 740.8333,
                },
                page: 321,
                text: '2,791.96',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","息税折旧摊销前利润(元)(T-1年):0"]',
        schema: {
          data: {
            label: '息税折旧摊销前利润(元)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 400,
                  box_top: 725.8333,
                  box_right: 448.3333,
                  box_bottom: 740,
                },
                page: 321,
                text: '2,516.39',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","息税折旧摊销前利润(元)(T年):0"]',
        schema: {
          data: {
            label: '息税折旧摊销前利润(元)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 337.5,
                  box_top: 723.3333,
                  box_right: 387.5,
                  box_bottom: 741.6666,
                },
                page: 321,
                text: '10,021.63',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","息税折旧摊销前利润(元)(最近一期）:0"]',
        schema: {
          data: {
            label: '息税折旧摊销前利润(元)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 270.8333,
                  box_top: 726.6667,
                  box_right: 327.5,
                  box_bottom: 740.8334,
                },
                page: 321,
                text: '10,265.32',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","利息保障倍数(倍)(T-2年):0"]',
        schema: {
          data: {
            label: '利息保障倍数(倍)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 464.1667,
                  box_top: 745,
                  box_right: 518.3334,
                  box_bottom: 758.3333,
                },
                page: 321,
                text: '442.57',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","利息保障倍数(倍)(T-1年):0"]',
        schema: {
          data: {
            label: '利息保障倍数(倍)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 397.5,
                  box_top: 744.1667,
                  box_right: 449.1667,
                  box_bottom: 764.1667,
                },
                page: 321,
                text: '914.30',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","利息保障倍数(倍)(T年):0"]',
        schema: {
          data: {
            label: '利息保障倍数(倍)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 333.3333,
                  box_top: 744.1667,
                  box_right: 388.3333,
                  box_bottom: 760,
                },
                page: 321,
                text: '6,713.06',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","利息保障倍数(倍)(最近一期）:0"]',
        schema: {
          data: {
            label: '利息保障倍数(倍)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 270.8333,
                  box_top: 743.3333,
                  box_right: 325.8333,
                  box_bottom: 760.8333,
                },
                page: 321,
                text: '3,869.38',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","扣除非经常性损益后的每股基本收益-单位:0"]',
        schema: {
          data: {
            label: '扣除非经常性损益后的每股基本收益-单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 473.1818,
                  box_top: 569.3182,
                  box_right: 484.09090000000003,
                  box_bottom: 579.5455000000001,
                },
                page: 322,
                text: '元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","扣除非经常性损益后的每股基本收益（元）(T-2年):0"]',
        schema: {
          data: {
            label: '扣除非经常性损益后的每股基本收益（元）(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 440.8333,
                  box_top: 108.3333,
                  box_right: 460,
                  box_bottom: 118.3333,
                },
                page: 323,
                text: '-',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","扣除非经常性损益后的每股基本收益（元）(T-1年):0"]',
        schema: {
          data: {
            label: '扣除非经常性损益后的每股基本收益（元）(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.3333,
                  box_top: 736.6667,
                  box_right: 460.8333,
                  box_bottom: 751.6667,
                },
                page: 322,
                text: '0.40',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","扣除非经常性损益后的每股基本收益（元）(T年):0"]',
        schema: {
          data: {
            label: '扣除非经常性损益后的每股基本收益（元）(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 431.6667,
                  box_top: 688.3333,
                  box_right: 460,
                  box_bottom: 703.3333,
                },
                page: 322,
                text: '0.78',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","扣除非经常性损益后的每股基本收益（元）(最近一期）:0"]',
        schema: {
          data: {
            label: '扣除非经常性损益后的每股基本收益（元）(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.3333,
                  box_top: 640,
                  box_right: 458.3333,
                  box_bottom: 657.5,
                },
                page: 322,
                text: '0.79',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","每股经营活动产生的现金流量-单位:0"]',
        schema: {
          data: {
            label: '每股经营活动产生的现金流量-单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 100,
                  box_top: 149.1667,
                  box_right: 111.6667,
                  box_bottom: 164.1667,
                },
                page: 322,
                text: '元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","每股经营活动产生的现金流量(元)(T-2年):0"]',
        schema: {
          data: {
            label: '每股经营活动产生的现金流量(元)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 140,
                  box_right: 511.6667,
                  box_bottom: 158.3333,
                },
                page: 322,
                text: '-',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","每股经营活动产生的现金流量(元)(T-1年):0"]',
        schema: {
          data: {
            label: '每股经营活动产生的现金流量(元)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 414.1667,
                  box_top: 140,
                  box_right: 443.3334,
                  box_bottom: 156.6667,
                },
                page: 322,
                text: '-0.64',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","每股经营活动产生的现金流量(元)(T年):0"]',
        schema: {
          data: {
            label: '每股经营活动产生的现金流量(元)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 353.3333,
                  box_top: 142.5,
                  box_right: 388.3333,
                  box_bottom: 155,
                },
                page: 322,
                text: '0.14',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key:
          '["No.01:0","主要财务指标:0","每股经营活动产生的现金流量(元)(最近一期）:0"]',
        schema: {
          data: {
            label: '每股经营活动产生的现金流量(元)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 291.6667,
                  box_top: 144.1667,
                  box_right: 321.6667,
                  box_bottom: 158.33339999999998,
                },
                page: 322,
                text: '-0.01',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","每股净现金流量-单位:0"]',
        schema: {
          data: {
            label: '每股净现金流量-单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 172.5,
                  box_top: 163.3333,
                  box_right: 182.5,
                  box_bottom: 181.66660000000002,
                },
                page: 322,
                text: '元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","每股净现金流量(元)(T-2年):0"]',
        schema: {
          data: {
            label: '每股净现金流量(元)(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 170.8333,
                  box_right: 513.3334,
                  box_bottom: 179.16660000000002,
                },
                page: 322,
                text: '-',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","每股净现金流量(元)(T-1年):0"]',
        schema: {
          data: {
            label: '每股净现金流量(元)(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 415,
                  box_top: 169.1667,
                  box_right: 445.8333,
                  box_bottom: 180,
                },
                page: 322,
                text: '0.30',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","每股净现金流量(元)(T年):0"]',
        schema: {
          data: {
            label: '每股净现金流量(元)(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 356.6667,
                  box_top: 164.1667,
                  box_right: 385,
                  box_bottom: 180.83339999999998,
                },
                page: 322,
                text: '1.01',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","每股净现金流量(元)(最近一期）:0"]',
        schema: {
          data: {
            label: '每股净现金流量(元)(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 285.8333,
                  box_top: 165.8333,
                  box_right: 327.5,
                  box_bottom: 181.66660000000002,
                },
                page: 322,
                text: '-0.32',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","加权平均净资产收益率(T-2年):0"]',
        schema: {
          data: {
            label: '加权平均净资产收益率(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 375,
                  box_top: 104.1667,
                  box_right: 415.8333,
                  box_bottom: 120.83340000000001,
                },
                page: 323,
                text: '16.19',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","加权平均净资产收益率(T-1年):0"]',
        schema: {
          data: {
            label: '加权平均净资产收益率(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 376.6667,
                  box_top: 736.6667,
                  box_right: 410.8334,
                  box_bottom: 752.5,
                },
                page: 322,
                text: '21.36',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","加权平均净资产收益率(T年):0"]',
        schema: {
          data: {
            label: '加权平均净资产收益率(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 371.6667,
                  box_top: 689.1667,
                  box_right: 409.1667,
                  box_bottom: 705,
                },
                page: 322,
                text: '25.86',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要财务指标:0","加权平均净资产收益率(最近一期）:0"]',
        schema: {
          data: {
            label: '加权平均净资产收益率(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 377.5,
                  box_top: 640,
                  box_right: 413.3333,
                  box_bottom: 660,
                },
                page: 322,
                text: '17.98',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大诉讼事项:0","有/无重大诉讼事项:0"]',
        schema: {
          data: {
            label: '有/无重大诉讼事项',
            required: false,
            multi: true,
            type: '有/无重大诉讼事项',
            words: '',
          },
        },
        data: [],
        value: '无',
      },
      {
        key: '["No.01:0","募集资金与运用:0","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.8333,
                  box_top: 313.3333,
                  box_right: 530,
                  box_bottom: 327.5,
                },
                page: 447,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:0","项目名称:0"]',
        schema: {
          data: {
            label: '项目名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.6667,
                  box_top: 362.5,
                  box_right: 194.1667,
                  box_bottom: 390.8333,
                },
                page: 447,
                text: '补充工程施工项\n目营运资金',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:0","投资总额:0"]',
        schema: {
          data: {
            label: '投资总额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 202.5,
                  box_top: 366.6667,
                  box_right: 254.1667,
                  box_bottom: 387.5,
                },
                page: 447,
                text: '65,128.01',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:0","募集资金投资额:0"]',
        schema: {
          data: {
            label: '募集资金投资额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 270,
                  box_top: 368.3333,
                  box_right: 317.5,
                  box_bottom: 388.3333,
                },
                page: 447,
                text: '65,000.00',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:1","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 313.3333,
                  box_right: 515.8333,
                  box_bottom: 327.5,
                },
                page: 447,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:1","项目名称:0"]',
        schema: {
          data: {
            label: '项目名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.6667,
                  box_top: 391.6667,
                  box_right: 200.8334,
                  box_bottom: 419.1667,
                },
                page: 447,
                text: 'LED 照明研发和\n测试中心',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:1","投资总额:0"]',
        schema: {
          data: {
            label: '投资总额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 204.1667,
                  box_top: 397.5,
                  box_right: 251.6667,
                  box_bottom: 417.5,
                },
                page: 447,
                text: '5,552.37',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:1","募集资金投资额:0"]',
        schema: {
          data: {
            label: '募集资金投资额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 271.6667,
                  box_top: 394.1667,
                  box_right: 315,
                  box_bottom: 416.6667,
                },
                page: 447,
                text: '5,552.37',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:2","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 310,
                  box_right: 510,
                  box_bottom: 334.1667,
                },
                page: 447,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:2","项目名称:0"]',
        schema: {
          data: {
            label: '项目名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8333,
                  box_top: 420,
                  box_right: 198.3333,
                  box_bottom: 445.8333,
                },
                page: 447,
                text: '远程智能监控系\n统和展示中心',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:2","投资总额:0"]',
        schema: {
          data: {
            label: '投资总额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 208.3333,
                  box_top: 427.5,
                  box_right: 254.16660000000002,
                  box_bottom: 439.1667,
                },
                page: 447,
                text: '4,200.81',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:2","募集资金投资额:0"]',
        schema: {
          data: {
            label: '募集资金投资额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 271.6667,
                  box_top: 423.3333,
                  box_right: 315,
                  box_bottom: 443.3333,
                },
                page: 447,
                text: '4,200.81',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:3","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 309.1667,
                  box_right: 506.6667,
                  box_bottom: 334.1667,
                },
                page: 447,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:3","项目名称:0"]',
        schema: {
          data: {
            label: '项目名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.6667,
                  box_top: 448.3333,
                  box_right: 197.5,
                  box_bottom: 475,
                },
                page: 447,
                text: '营销及服务网络\n升级',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:3","投资总额:0"]',
        schema: {
          data: {
            label: '投资总额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 210,
                  box_top: 454.1667,
                  box_right: 252.5,
                  box_bottom: 470.8334,
                },
                page: 447,
                text: '5,326.82',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","募集资金与运用:3","募集资金投资额:0"]',
        schema: {
          data: {
            label: '募集资金投资额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 269.1667,
                  box_top: 453.3333,
                  box_right: 315.8334,
                  box_bottom: 472.5,
                },
                page: 447,
                text: '5,326.82',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:0","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 162.5,
                  box_right: 332.5,
                  box_bottom: 183.3333,
                },
                page: 217,
                text: '发明',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:0","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.6667,
                  box_top: 152.5,
                  box_right: 211.6667,
                  box_bottom: 192.5,
                },
                page: 217,
                text: '一种方位可调且防\n护性高的太阳能\nLED 路灯',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:0","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 214.1667,
                  box_top: 160,
                  box_right: 303.3334,
                  box_bottom: 186.6667,
                },
                page: 217,
                text: 'ZL201710097489.2',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:0","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345,
                  box_top: 160,
                  box_right: 382.5,
                  box_bottom: 186.6667,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:1","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 313.3333,
                  box_top: 196.6667,
                  box_right: 340.8333,
                  box_bottom: 220.83339999999998,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:1","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 195,
                  box_right: 205.8334,
                  box_bottom: 220,
                },
                page: 217,
                text: '一种用于脚手架的\n扣紧装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:1","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 212.5,
                  box_top: 196.6667,
                  box_right: 306.6667,
                  box_bottom: 219.1667,
                },
                page: 217,
                text: 'ZL201720471217.X',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:1","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345,
                  box_top: 197.5,
                  box_right: 384.1667,
                  box_bottom: 220.8333,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:2","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 310.8333,
                  box_top: 222.5,
                  box_right: 339.1666,
                  box_bottom: 249.1667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:2","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8333,
                  box_top: 225,
                  box_right: 203.3333,
                  box_bottom: 246.6667,
                },
                page: 217,
                text: '一种可调节的装修\n用脚手架',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:2","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 212.5,
                  box_top: 225.8333,
                  box_right: 302.5,
                  box_bottom: 245,
                },
                page: 217,
                text: 'ZL201720471776.0',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:2","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 347.5,
                  box_top: 226.6667,
                  box_right: 382.5,
                  box_bottom: 246.6667,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:3","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 311.6667,
                  box_top: 248.3333,
                  box_right: 341.6667,
                  box_bottom: 278.3333,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:3","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 110.8333,
                  box_top: 256.6667,
                  box_right: 192.5,
                  box_bottom: 273.3334,
                },
                page: 217,
                text: 'LED 照明装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:3","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 214.1667,
                  box_top: 253.3333,
                  box_right: 305,
                  box_bottom: 275.8333,
                },
                page: 217,
                text: 'ZL201720471771.8',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:3","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 349.1667,
                  box_top: 256.6667,
                  box_right: 381.6667,
                  box_bottom: 270,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:4","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 313.3333,
                  box_top: 278.3333,
                  box_right: 338.3333,
                  box_bottom: 305,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:4","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 284.1667,
                  box_right: 198.3333,
                  box_bottom: 301.6667,
                },
                page: 217,
                text: '壁挂照明装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:4","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 215,
                  box_top: 284.1667,
                  box_right: 298.3333,
                  box_bottom: 300.8334,
                },
                page: 217,
                text: 'ZL201720471774.1',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:4","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345.8333,
                  box_top: 285.8333,
                  box_right: 384.1666,
                  box_bottom: 300.8333,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:5","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 305.8333,
                  box_right: 340,
                  box_bottom: 332.5,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:5","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8333,
                  box_top: 305,
                  box_right: 205,
                  box_bottom: 335,
                },
                page: 217,
                text: '用于室内装修使用\n的脚手架',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:5","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 214.1667,
                  box_top: 309.1667,
                  box_right: 303.3334,
                  box_bottom: 330,
                },
                page: 217,
                text: 'ZL201720471775.6',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:5","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350,
                  box_top: 308.3333,
                  box_right: 384.1667,
                  box_bottom: 329.1666,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:6","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 336.6667,
                  box_right: 340.8334,
                  box_bottom: 359.1667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:6","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.6667,
                  box_top: 337.5,
                  box_right: 175.8334,
                  box_bottom: 356.6667,
                },
                page: 217,
                text: '照明系统',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:6","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 213.3333,
                  box_top: 341.6667,
                  box_right: 302.5,
                  box_bottom: 355,
                },
                page: 217,
                text: 'ZL201720471166.0',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:6","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 349.1667,
                  box_top: 337.5,
                  box_right: 381.6667,
                  box_bottom: 359.1667,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:7","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 364.1667,
                  box_right: 343.3334,
                  box_bottom: 388.3334,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:7","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 364.1667,
                  box_right: 177.5,
                  box_bottom: 385.8334,
                },
                page: 217,
                text: '照明组件',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:7","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 210,
                  box_top: 364.1667,
                  box_right: 305.8333,
                  box_bottom: 385.8334,
                },
                page: 217,
                text: 'ZL201720471780.7',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:7","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 348.3333,
                  box_top: 366.6667,
                  box_right: 381.6666,
                  box_bottom: 385.8334,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:8","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 311.6667,
                  box_top: 390,
                  box_right: 339.1667,
                  box_bottom: 419.1667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:8","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115,
                  box_top: 392.5,
                  box_right: 169.1667,
                  box_bottom: 414.1667,
                },
                page: 217,
                text: '照明灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:8","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 212.5,
                  box_top: 392.5,
                  box_right: 306.6667,
                  box_bottom: 415,
                },
                page: 217,
                text: 'ZL201720477447.7',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:8","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345,
                  box_top: 395.8333,
                  box_right: 385,
                  box_bottom: 420.8333,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:9","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 312.5,
                  box_top: 418.3333,
                  box_right: 338.3333,
                  box_bottom: 444.1666,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:9","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 417.5,
                  box_right: 207.5,
                  box_bottom: 445,
                },
                page: 217,
                text: '一种节能LED照明\n装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:9","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 213.3333,
                  box_top: 424.1667,
                  box_right: 296.6666,
                  box_bottom: 441.6667,
                },
                page: 217,
                text: 'ZL201621223856.6',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:9","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350.8333,
                  box_top: 427.5,
                  box_right: 382.5,
                  box_bottom: 440,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:10","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 441.6667,
                  box_right: 339.1667,
                  box_bottom: 476.6667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:10","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.5,
                  box_top: 444.1667,
                  box_right: 206.6667,
                  box_bottom: 473.3334,
                },
                page: 217,
                text: '一种LED照明节能\n控制器',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:10","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 214.1667,
                  box_top: 448.3333,
                  box_right: 310,
                  box_bottom: 470,
                },
                page: 217,
                text: 'ZL201621227570.5',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:10","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 346.6667,
                  box_top: 450,
                  box_right: 380.8334,
                  box_bottom: 468.3333,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:11","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 313.3333,
                  box_top: 475,
                  box_right: 337.5,
                  box_bottom: 500.8333,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:11","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.5,
                  box_top: 473.3333,
                  box_right: 205.8333,
                  box_bottom: 500.8333,
                },
                page: 217,
                text: '一种新型智能照明\n灯',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:11","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 211.6667,
                  box_top: 479.1667,
                  box_right: 304.1667,
                  box_bottom: 496.6667,
                },
                page: 217,
                text: 'ZL201621215119.1',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:11","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 351.6667,
                  box_top: 478.3333,
                  box_right: 382.5,
                  box_bottom: 497.5,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:12","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 317.5,
                  box_top: 501.6667,
                  box_right: 336.6667,
                  box_bottom: 529.1667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:12","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 111.6667,
                  box_top: 500.8333,
                  box_right: 208.3334,
                  box_bottom: 527.5,
                },
                page: 217,
                text: '一种红外感应 LED\n节能照明灯',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:12","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 211.6667,
                  box_top: 505.8333,
                  box_right: 299.1667,
                  box_bottom: 525,
                },
                page: 217,
                text: 'ZL201621215120.4',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:12","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 353.3333,
                  box_top: 507.5,
                  box_right: 378.3333,
                  box_bottom: 522.5,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:13","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 308.3333,
                  box_top: 529.1667,
                  box_right: 339.1666,
                  box_bottom: 558.3334,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:13","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 119.1667,
                  box_top: 530.8333,
                  box_right: 205,
                  box_bottom: 557.5,
                },
                page: 217,
                text: '一种太阳能道路照\n明装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:13","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 210,
                  box_top: 532.5,
                  box_right: 306.6667,
                  box_bottom: 555.8333,
                },
                page: 217,
                text: 'ZL201621215130.8',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:13","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 344.4,
                  box_top: 534.6,
                  box_right: 386.4,
                  box_bottom: 551.4,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:14","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 313.3333,
                  box_top: 557.5,
                  box_right: 337.5,
                  box_bottom: 584.1667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:14","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 559.1667,
                  box_right: 205,
                  box_bottom: 585.8334,
                },
                page: 217,
                text: '一种多功能节能照\n明灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:14","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 214.1667,
                  box_top: 560,
                  box_right: 303.3334,
                  box_bottom: 581.6667,
                },
                page: 217,
                text: 'ZL201621215132.7',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:14","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 347.5,
                  box_top: 562.5,
                  box_right: 383.3333,
                  box_bottom: 580.8333,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:15","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 584.1667,
                  box_right: 340.8334,
                  box_bottom: 610.8334,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:15","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8333,
                  box_top: 588.3333,
                  box_right: 207.5,
                  box_bottom: 612.5,
                },
                page: 217,
                text: '一种半导体照明节\n能灯',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:15","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 209.1667,
                  box_top: 588.3333,
                  box_right: 308.3334,
                  box_bottom: 611.6666,
                },
                page: 217,
                text: 'ZL201621215191.4',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:15","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345,
                  box_top: 591.6667,
                  box_right: 385.8333,
                  box_bottom: 610.8334,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:16","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 309.1667,
                  box_top: 615,
                  box_right: 343.3334,
                  box_bottom: 641.6667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:16","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 110,
                  box_top: 614.1667,
                  box_right: 209.1667,
                  box_bottom: 640,
                },
                page: 217,
                text: '一种LED道路照明\n装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:16","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 214.1667,
                  box_top: 619.1667,
                  box_right: 305.8334,
                  box_bottom: 635.8334,
                },
                page: 217,
                text: 'ZL201621219389.X',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:16","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 351.6667,
                  box_top: 615,
                  box_right: 381.6667,
                  box_bottom: 639.1667,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:17","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 307.5,
                  box_top: 642.5,
                  box_right: 343.3333,
                  box_bottom: 667.5,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:17","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 647.5,
                  box_right: 196.6666,
                  box_bottom: 667.5,
                },
                page: 217,
                text: '一种节能照明箱',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:17","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 212.5,
                  box_top: 646.6667,
                  box_right: 303.3333,
                  box_bottom: 667.5,
                },
                page: 217,
                text: 'ZL201621219390.2',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:17","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 347.5,
                  box_top: 647.5,
                  box_right: 376.6667,
                  box_bottom: 665,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:18","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 314.1667,
                  box_top: 672.5,
                  box_right: 339.1667,
                  box_bottom: 699.1667,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:18","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 675.8333,
                  box_right: 205,
                  box_bottom: 691.6666,
                },
                page: 217,
                text: '一种LED导光玻璃',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:18","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 213.3333,
                  box_top: 674.1667,
                  box_right: 301.6666,
                  box_bottom: 695.8334,
                },
                page: 217,
                text: 'ZL201621219988.1',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:18","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 347.5,
                  box_top: 670,
                  box_right: 383.3333,
                  box_bottom: 695.8333,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:19","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 310,
                  box_top: 698.3333,
                  box_right: 343.3333,
                  box_bottom: 725.8333,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:19","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 111.6667,
                  box_top: 700,
                  box_right: 208.3334,
                  box_bottom: 724.1667,
                },
                page: 217,
                text: '一种智能可控式\nLED 应急照明装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:19","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 212.5,
                  box_top: 698.3333,
                  box_right: 305,
                  box_bottom: 720,
                },
                page: 217,
                text: 'ZL201621206550.X',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:19","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 348.3333,
                  box_top: 701.6667,
                  box_right: 385,
                  box_bottom: 722.5,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:20","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 312.6,
                  box_top: 732.6,
                  box_right: 340.20000000000005,
                  box_bottom: 763.8000000000001,
                },
                page: 217,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:20","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 726.6667,
                  box_right: 210,
                  box_bottom: 765.8334,
                },
                page: 217,
                text: '一种用于照明节能\n自动控制装置的固\n定结构',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:20","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 215,
                  box_top: 736.6667,
                  box_right: 305,
                  box_bottom: 759.1667,
                },
                page: 217,
                text: 'ZL201621207800.1',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:20","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 350,
                  box_top: 732.5,
                  box_right: 380.8333,
                  box_bottom: 761.6667,
                },
                page: 217,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:21","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 310,
                  box_top: 75.8333,
                  box_right: 341.6667,
                  box_bottom: 104.16659999999999,
                },
                page: 218,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:21","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 110.8333,
                  box_top: 80,
                  box_right: 210,
                  box_bottom: 105.83330000000001,
                },
                page: 218,
                text: '一种LED灯具高空\n固定装置',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:21","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 216.6667,
                  box_top: 80,
                  box_right: 305.8334,
                  box_bottom: 100,
                },
                page: 218,
                text: 'ZL201621166984.1',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:21","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 347.5,
                  box_top: 82.5,
                  box_right: 382.5,
                  box_bottom: 101.66669999999999,
                },
                page: 218,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:22","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 315,
                  box_top: 107.5,
                  box_right: 339.1667,
                  box_bottom: 132.5,
                },
                page: 218,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:22","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.5,
                  box_top: 104.1667,
                  box_right: 208.3333,
                  box_bottom: 133.3334,
                },
                page: 218,
                text: '高折射率LED导光\n玻璃',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:22","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 214.1667,
                  box_top: 108.3333,
                  box_right: 304.1667,
                  box_bottom: 130,
                },
                page: 218,
                text: 'ZL201420482909.0',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:22","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 352.5,
                  box_top: 111.6667,
                  box_right: 382.5,
                  box_bottom: 128.3334,
                },
                page: 218,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:23","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 313.3333,
                  box_top: 132.5,
                  box_right: 338.3333,
                  box_bottom: 163.3333,
                },
                page: 218,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:23","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 132.5,
                  box_right: 208.3334,
                  box_bottom: 160.8333,
                },
                page: 218,
                text: '嵌设于建筑壁板的\n灯体结构',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:23","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 209.1667,
                  box_top: 138.3333,
                  box_right: 304.1667,
                  box_bottom: 158.3333,
                },
                page: 218,
                text: 'ZL201420483053.9',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:23","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 348.3333,
                  box_top: 140.8333,
                  box_right: 385,
                  box_bottom: 155,
                },
                page: 218,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:24","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 304.1667,
                  box_top: 162.5,
                  box_right: 338.3334,
                  box_bottom: 191.6667,
                },
                page: 218,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:24","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.5,
                  box_top: 161.6667,
                  box_right: 208.3333,
                  box_bottom: 190,
                },
                page: 218,
                text: '照明防潮显示板结\n构',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:24","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 210.8333,
                  box_top: 166.6667,
                  box_right: 305.8333,
                  box_bottom: 187.5,
                },
                page: 218,
                text: 'ZL201420483163.5',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:24","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 347.5,
                  box_top: 170,
                  box_right: 382.5,
                  box_bottom: 187.5,
                },
                page: 218,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:25","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 313.3333,
                  box_top: 190.8333,
                  box_right: 342.5,
                  box_bottom: 215.8333,
                },
                page: 218,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:25","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 195,
                  box_right: 186.6667,
                  box_bottom: 213.3333,
                },
                page: 218,
                text: 'LED 光纤接头',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:25","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 215.8333,
                  box_top: 195,
                  box_right: 305,
                  box_bottom: 211.6667,
                },
                page: 218,
                text: 'ZL201420483205.5',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:25","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 348.3333,
                  box_top: 195,
                  box_right: 381.6666,
                  box_bottom: 215,
                },
                page: 218,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:26","专利类型:0"]',
        schema: {
          data: {
            label: '专利类型',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 311.6667,
                  box_top: 216.6667,
                  box_right: 341.6667,
                  box_bottom: 245.83339999999998,
                },
                page: 218,
                text: '实用\n新型',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:26","专利名称:0"]',
        schema: {
          data: {
            label: '专利名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 223.3333,
                  box_right: 197.5,
                  box_bottom: 238.3333,
                },
                page: 218,
                text: 'LED 模压玻璃镜片',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:26","专利号:0"]',
        schema: {
          data: {
            label: '专利号',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 212.5,
                  box_top: 224.1667,
                  box_right: 306.6667,
                  box_bottom: 240.83339999999998,
                },
                page: 218,
                text: 'ZL201420483873.8',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","专利:26","专利权人:0"]',
        schema: {
          data: {
            label: '专利权人',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 348.3333,
                  box_top: 223.3333,
                  box_right: 381.6666,
                  box_bottom: 240.8333,
                },
                page: 218,
                text: '豪尔赛',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:0","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 86.6667,
                  box_top: 409.1667,
                  box_right: 150,
                  box_bottom: 423.3334,
                },
                page: 181,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:0","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 349.1667,
                  box_right: 519.1667,
                  box_bottom: 371.6667,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:0","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.6667,
                  box_top: 427.5,
                  box_right: 264.1667,
                  box_bottom: 443.3333,
                },
                page: 181,
                text: '青岛市市政建设发展有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:0","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 366.6667,
                  box_top: 428.3333,
                  box_right: 417.5,
                  box_bottom: 443.3333,
                },
                page: 181,
                text: '26,651.83',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:0","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 425.8333,
                  box_top: 427.5,
                  box_right: 460.8333,
                  box_bottom: 444.1667,
                },
                page: 181,
                text: '60.27',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:1","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8333,
                  box_top: 409.1667,
                  box_right: 155,
                  box_bottom: 420.8334,
                },
                page: 181,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:1","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 353.3333,
                  box_right: 509.1667,
                  box_bottom: 370,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:1","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 449.1667,
                  box_right: 250.8333,
                  box_bottom: 463.3334,
                },
                page: 181,
                text: '琼海市城市管理局',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:1","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 370,
                  box_top: 448.3333,
                  box_right: 417.5,
                  box_bottom: 462.5,
                },
                page: 181,
                text: '5,093.32',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:1","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 426.6667,
                  box_top: 450,
                  box_right: 455.8334,
                  box_bottom: 463.3333,
                },
                page: 181,
                text: '11.52',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:2","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 88.3333,
                  box_top: 408.3333,
                  box_right: 151.6666,
                  box_bottom: 421.6666,
                },
                page: 181,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:2","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 483.3333,
                  box_top: 347.5,
                  box_right: 520.8333,
                  box_bottom: 369.1667,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:2","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 118.3333,
                  box_top: 470,
                  box_right: 251.66660000000002,
                  box_bottom: 485,
                },
                page: 181,
                text: '济南文旅发展集团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:2","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 370,
                  box_top: 468.3333,
                  box_right: 420,
                  box_bottom: 486.6666,
                },
                page: 181,
                text: '2,642.57',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:2","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 425,
                  box_top: 470,
                  box_right: 463.3333,
                  box_bottom: 487.5,
                },
                page: 181,
                text: '5.98',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:3","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.3333,
                  box_top: 409.1667,
                  box_right: 154.1666,
                  box_bottom: 422.5,
                },
                page: 181,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:3","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 350,
                  box_right: 507.5,
                  box_bottom: 372.5,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:3","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 120,
                  box_top: 490,
                  box_right: 279.1667,
                  box_bottom: 506.6667,
                },
                page: 181,
                text: '武汉旅游发展投资集团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:3","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 367.5,
                  box_top: 490,
                  box_right: 420,
                  box_bottom: 505.8333,
                },
                page: 181,
                text: '2,538.55',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:3","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 430,
                  box_top: 489.1667,
                  box_right: 463.3333,
                  box_bottom: 507.5,
                },
                page: 181,
                text: '5.74',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:4","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 87.5,
                  box_top: 404.1667,
                  box_right: 155,
                  box_bottom: 424.1667,
                },
                page: 181,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:4","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 348.3333,
                  box_right: 518.3333,
                  box_bottom: 371.6666,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:4","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 508.3333,
                  box_right: 260,
                  box_bottom: 524.1666,
                },
                page: 181,
                text: '中国建筑股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:4","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 370,
                  box_top: 510,
                  box_right: 420.8333,
                  box_bottom: 525,
                },
                page: 181,
                text: '1,563.44',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:4","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 434.1667,
                  box_top: 510,
                  box_right: 459.1667,
                  box_bottom: 525.8333,
                },
                page: 181,
                text: '3.54',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:5","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 90,
                  box_top: 552.5,
                  box_right: 130.8333,
                  box_bottom: 567.5,
                },
                page: 181,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:5","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 349.1667,
                  box_right: 526.6667,
                  box_bottom: 370.8334,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:5","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115,
                  box_top: 572.5,
                  box_right: 220,
                  box_bottom: 590.8333,
                },
                page: 181,
                text: '天津市体育局',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:5","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 367.5,
                  box_top: 570.8333,
                  box_right: 420,
                  box_bottom: 590,
                },
                page: 181,
                text: '6,538.95',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:5","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 426.6667,
                  box_top: 569.1667,
                  box_right: 462.5,
                  box_bottom: 586.6667,
                },
                page: 181,
                text: '13.46',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:6","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 82.5,
                  box_top: 549.1667,
                  box_right: 135,
                  box_bottom: 568.3334,
                },
                page: 181,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:6","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 477.5,
                  box_top: 353.3333,
                  box_right: 517.5,
                  box_bottom: 375.8333,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:6","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.5,
                  box_top: 591.6667,
                  box_right: 264.1667,
                  box_bottom: 608.3334,
                },
                page: 181,
                text: '济南文旅发展集团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:6","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 374.1667,
                  box_top: 590,
                  box_right: 420,
                  box_bottom: 607.5,
                },
                page: 181,
                text: '6,190.11',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:6","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 428.3333,
                  box_top: 595,
                  box_right: 459.1666,
                  box_bottom: 610,
                },
                page: 181,
                text: '12.74',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:7","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 79.1667,
                  box_top: 549.1667,
                  box_right: 134.1667,
                  box_bottom: 570,
                },
                page: 181,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:7","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 355,
                  box_right: 509.1667,
                  box_bottom: 370.8333,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:7","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 612.5,
                  box_right: 290.8333,
                  box_bottom: 629.1667,
                },
                page: 181,
                text: '武汉旅游发展投资集团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:7","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 374.1667,
                  box_top: 612.5,
                  box_right: 425.8334,
                  box_bottom: 628.3333,
                },
                page: 181,
                text: '5,026.90',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:7","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 419.1667,
                  box_top: 613.3333,
                  box_right: 461.6667,
                  box_bottom: 635,
                },
                page: 181,
                text: '10.35',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:8","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 90.8333,
                  box_top: 552.5,
                  box_right: 135.8333,
                  box_bottom: 567.5,
                },
                page: 181,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:8","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 355,
                  box_right: 499.1667,
                  box_bottom: 371.6667,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:8","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 632.5,
                  box_right: 275,
                  box_bottom: 651.6667,
                },
                page: 181,
                text: '张家界市城市管理和综合执法局',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:8","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 375.8333,
                  box_top: 632.5,
                  box_right: 419.1666,
                  box_bottom: 650,
                },
                page: 181,
                text: '4,437.60',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:8","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 430,
                  box_top: 633.3333,
                  box_right: 464.1667,
                  box_bottom: 650.8333,
                },
                page: 181,
                text: '9.14',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:9","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 88.3333,
                  box_top: 550.8333,
                  box_right: 132.5,
                  box_bottom: 559.1666,
                },
                page: 181,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:9","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 478.3333,
                  box_top: 347.5,
                  box_right: 514.1666,
                  box_bottom: 372.5,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:9","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 120,
                  box_top: 655,
                  box_right: 240.8333,
                  box_bottom: 669.1667,
                },
                page: 181,
                text: '中国建筑股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:9","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 377.5,
                  box_top: 657.5,
                  box_right: 420,
                  box_bottom: 669.1667,
                },
                page: 181,
                text: '3,983.54',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:9","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 434.1667,
                  box_top: 656.6667,
                  box_right: 458.3334,
                  box_bottom: 670,
                },
                page: 181,
                text: '8.20',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:10","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.3333,
                  box_top: 695.8333,
                  box_right: 132.5,
                  box_bottom: 713.3333,
                },
                page: 181,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:10","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 476.6667,
                  box_top: 345,
                  box_right: 520,
                  box_bottom: 370.8333,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:10","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 715.8333,
                  box_right: 287.5,
                  box_bottom: 731.6666,
                },
                page: 181,
                text: '重庆市丽丰市政园林绿化有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:10","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 377.5,
                  box_top: 715.8333,
                  box_right: 421.6667,
                  box_bottom: 734.1666,
                },
                page: 181,
                text: '4,353.41',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:10","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 421.6667,
                  box_top: 714.1667,
                  box_right: 461.6667,
                  box_bottom: 732.5,
                },
                page: 181,
                text: '15.50',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:11","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 87.5,
                  box_top: 694.1667,
                  box_right: 135.8333,
                  box_bottom: 713.3334,
                },
                page: 181,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:11","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485.8333,
                  box_top: 347.5,
                  box_right: 500.8333,
                  box_bottom: 372.5,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:11","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 113.3333,
                  box_top: 735.8333,
                  box_right: 253.3333,
                  box_bottom: 753.3333,
                },
                page: 181,
                text: '上海建工集团股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:11","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 374.1667,
                  box_top: 736.6667,
                  box_right: 420,
                  box_bottom: 753.3334,
                },
                page: 181,
                text: '2,325.77',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:11","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 429.1667,
                  box_top: 738.3333,
                  box_right: 459.1667,
                  box_bottom: 752.5,
                },
                page: 181,
                text: '8.28',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:12","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85,
                  box_top: 693.3333,
                  box_right: 135.8333,
                  box_bottom: 710.8333,
                },
                page: 181,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:12","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 350,
                  box_right: 510.8333,
                  box_bottom: 370.8333,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:12","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8333,
                  box_top: 79.1667,
                  box_right: 291.6666,
                  box_bottom: 95,
                },
                page: 182,
                text: '厦门海投国际航运中心开发有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:12","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 373.3333,
                  box_top: 77.5,
                  box_right: 418.3333,
                  box_bottom: 97.5,
                },
                page: 182,
                text: '1,815.80',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:12","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 429.1667,
                  box_top: 78.3333,
                  box_right: 460,
                  box_bottom: 95,
                },
                page: 182,
                text: '6.47',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:13","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.1667,
                  box_top: 698.3333,
                  box_right: 130,
                  box_bottom: 713.3333,
                },
                page: 181,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:13","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 347.5,
                  box_right: 512.5,
                  box_bottom: 373.3333,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:13","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115,
                  box_top: 100,
                  box_right: 281.6667,
                  box_bottom: 118.33330000000001,
                },
                page: 182,
                text: '张家界市城市管理和综合执法局',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:13","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 377.25,
                  box_top: 102,
                  box_right: 420.75,
                  box_bottom: 114,
                },
                page: 182,
                text: '1,725.57',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:13","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 431.25,
                  box_top: 101.25,
                  box_right: 459,
                  box_bottom: 116.25,
                },
                page: 182,
                text: '6.14',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:14","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 86.6667,
                  box_top: 694.1667,
                  box_right: 133.3334,
                  box_bottom: 713.3334,
                },
                page: 181,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:14","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 348.3333,
                  box_right: 510.8333,
                  box_bottom: 370.8333,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:14","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 118.3333,
                  box_right: 280.8334,
                  box_bottom: 136.6666,
                },
                page: 182,
                text: '彭水九黎文化旅游投资有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:14","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 375.8333,
                  box_top: 120.8333,
                  box_right: 422.5,
                  box_bottom: 135,
                },
                page: 182,
                text: '1,655.26',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:14","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 432.5,
                  box_top: 120,
                  box_right: 458.3333,
                  box_bottom: 135,
                },
                page: 182,
                text: '5.89',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:15","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 91.6667,
                  box_top: 165,
                  box_right: 134.1667,
                  box_bottom: 175,
                },
                page: 182,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:15","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 345,
                  box_right: 522.5,
                  box_bottom: 369.1667,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:15","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 183.3333,
                  box_right: 260,
                  box_bottom: 197.5,
                },
                page: 182,
                text: '上海建工集团股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:15","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 373.3333,
                  box_top: 185,
                  box_right: 422.5,
                  box_bottom: 199.1667,
                },
                page: 182,
                text: '5,524.70',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:15","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 429.1667,
                  box_top: 182.5,
                  box_right: 455.8334,
                  box_bottom: 198.3333,
                },
                page: 182,
                text: '23.05',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:16","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85,
                  box_top: 162.5,
                  box_right: 133.3333,
                  box_bottom: 180,
                },
                page: 182,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:16","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485.8333,
                  box_top: 352.5,
                  box_right: 512.5,
                  box_bottom: 374.1667,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:16","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8333,
                  box_top: 203.3333,
                  box_right: 258.3333,
                  box_bottom: 218.3333,
                },
                page: 182,
                text: '中国建筑股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:16","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 369.1667,
                  box_top: 202.5,
                  box_right: 420,
                  box_bottom: 220.8333,
                },
                page: 182,
                text: '2,699.90',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:16","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 429,
                  box_top: 205.8,
                  box_right: 460.2,
                  box_bottom: 220.8,
                },
                page: 182,
                text: '11.26',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:17","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8333,
                  box_top: 159.1667,
                  box_right: 133.3333,
                  box_bottom: 179.1667,
                },
                page: 182,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:17","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 352.5,
                  box_right: 528.3333,
                  box_bottom: 370,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:17","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117.5,
                  box_top: 225,
                  box_right: 296.6667,
                  box_bottom: 240,
                },
                page: 182,
                text: '厦门海投国际航运中心开发有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:17","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 369.1667,
                  box_top: 224.1667,
                  box_right: 421.6667,
                  box_bottom: 242.5,
                },
                page: 182,
                text: '1,254.46',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:17","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.3333,
                  box_top: 222.5,
                  box_right: 458.3333,
                  box_bottom: 239.1667,
                },
                page: 182,
                text: '5.23',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:18","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8333,
                  box_top: 163.3333,
                  box_right: 131.6666,
                  box_bottom: 178.3333,
                },
                page: 182,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:18","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 351.6667,
                  box_right: 517.5,
                  box_bottom: 373.3334,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:18","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8333,
                  box_top: 242.5,
                  box_right: 269.1666,
                  box_bottom: 262.5,
                },
                page: 182,
                text: '北京通盈房地产开发有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:18","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 370.8333,
                  box_top: 245.8333,
                  box_right: 419.1666,
                  box_bottom: 260.8333,
                },
                page: 182,
                text: '1,132.33',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:18","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 432.5,
                  box_top: 244.1667,
                  box_right: 460.8333,
                  box_bottom: 260.8334,
                },
                page: 182,
                text: '4.72',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:19","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85,
                  box_top: 165,
                  box_right: 135,
                  box_bottom: 178.3333,
                },
                page: 182,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:19","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 356.6667,
                  box_right: 505,
                  box_bottom: 371.6667,
                },
                page: 181,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:19","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.6667,
                  box_top: 265,
                  box_right: 260.8334,
                  box_bottom: 280,
                },
                page: 182,
                text: '江河创建集团股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:19","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 367.5,
                  box_top: 263.3333,
                  box_right: 420,
                  box_bottom: 282.5,
                },
                page: 182,
                text: '1,091.45',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:19","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 430,
                  box_top: 264.1667,
                  box_right: 459.1667,
                  box_bottom: 282.5,
                },
                page: 182,
                text: '4.55',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:20","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.2,
                  box_top: 149.4,
                  box_right: 153.60000000000002,
                  box_bottom: 168.6,
                },
                page: 189,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:20","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.4,
                  box_top: 96,
                  box_right: 519,
                  box_bottom: 117.6,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:20","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.4,
                  box_top: 172.2,
                  box_right: 275.4,
                  box_bottom: 190.2,
                },
                page: 189,
                text: '青岛市市政建设发展有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:20","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 387,
                  box_top: 174,
                  box_right: 424.2,
                  box_bottom: 186.6,
                },
                page: 189,
                text: '491.14',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:20","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 436.8,
                  box_top: 171.6,
                  box_right: 465,
                  box_bottom: 188.4,
                },
                page: 189,
                text: '1.11',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:21","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 88.2,
                  box_top: 151.8,
                  box_right: 153.60000000000002,
                  box_bottom: 169.8,
                },
                page: 189,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:21","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 94.8,
                  box_right: 525,
                  box_bottom: 117.6,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:21","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 111.6,
                  box_top: 190.2,
                  box_right: 214.8,
                  box_bottom: 208.79999999999998,
                },
                page: 189,
                text: '琼海市城市管理局',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:21","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 384.6,
                  box_top: 193.2,
                  box_right: 424.20000000000005,
                  box_bottom: 208.2,
                },
                page: 189,
                text: '130.42',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:21","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 432,
                  box_top: 194.4,
                  box_right: 464.4,
                  box_bottom: 209.4,
                },
                page: 189,
                text: '0.29',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:22","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 86.4,
                  box_top: 151.8,
                  box_right: 153,
                  box_bottom: 167.4,
                },
                page: 189,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:22","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 478.8,
                  box_top: 93.6,
                  box_right: 517.2,
                  box_bottom: 116.39999999999999,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:22","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.2,
                  box_top: 213,
                  box_right: 269.4,
                  box_bottom: 228,
                },
                page: 189,
                text: '建德市新安旅游投资有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:22","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390.6,
                  box_top: 216,
                  box_right: 425.40000000000003,
                  box_bottom: 228,
                },
                page: 189,
                text: '76.67',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:22","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 434.4,
                  box_top: 213,
                  box_right: 461.4,
                  box_bottom: 228,
                },
                page: 189,
                text: '0.17',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:23","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 88.2,
                  box_top: 150.6,
                  box_right: 154.8,
                  box_bottom: 170.4,
                },
                page: 189,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:23","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.8,
                  box_top: 93.6,
                  box_right: 516,
                  box_bottom: 115.19999999999999,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:23","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.2,
                  box_top: 232.8,
                  box_right: 250.2,
                  box_bottom: 251.4,
                },
                page: 189,
                text: '中国建筑股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:23","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 392.4,
                  box_top: 238.2,
                  box_right: 425.4,
                  box_bottom: 252,
                },
                page: 189,
                text: '65.40',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:23","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.8,
                  box_top: 235.8,
                  box_right: 466.2,
                  box_bottom: 250.8,
                },
                page: 189,
                text: '0.15',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:24","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 87,
                  box_top: 152.4,
                  box_right: 154.8,
                  box_bottom: 169.20000000000002,
                },
                page: 189,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:24","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.2,
                  box_top: 97.8,
                  box_right: 513.6,
                  box_bottom: 117.6,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:24","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 111,
                  box_top: 252.6,
                  box_right: 277.2,
                  box_bottom: 270,
                },
                page: 189,
                text: '山东黄金地产旅游集团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:24","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 391.2,
                  box_top: 255,
                  box_right: 424.2,
                  box_bottom: 270.6,
                },
                page: 189,
                text: '58.43',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:24","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 431.4,
                  box_top: 253.2,
                  box_right: 465,
                  box_bottom: 270,
                },
                page: 189,
                text: '0.13',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:25","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 87,
                  box_top: 295.8,
                  box_right: 134.4,
                  box_bottom: 310.8,
                },
                page: 189,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:25","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 483,
                  box_top: 93,
                  box_right: 510,
                  box_bottom: 112.8,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:25","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 110.4,
                  box_top: 315,
                  box_right: 285,
                  box_bottom: 330.6,
                },
                page: 189,
                text: '上海海昌极地海洋世界有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:25","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390,
                  box_top: 315,
                  box_right: 424.8,
                  box_bottom: 333.6,
                },
                page: 189,
                text: '164.53',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:25","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.2,
                  box_top: 315.6,
                  box_right: 463.2,
                  box_bottom: 331.20000000000005,
                },
                page: 189,
                text: '0.34',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:26","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.2,
                  box_top: 294.6,
                  box_right: 132.6,
                  box_bottom: 310.8,
                },
                page: 189,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:26","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.2,
                  box_top: 95.4,
                  box_right: 525,
                  box_bottom: 120,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:26","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.8,
                  box_top: 334.2,
                  box_right: 301.2,
                  box_bottom: 352.2,
                },
                page: 189,
                text: '三门峡市商务中心区建设指挥部办公室',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:26","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 394.2,
                  box_top: 337.8,
                  box_right: 424.2,
                  box_bottom: 351,
                },
                page: 189,
                text: '55.19',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:26","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 429,
                  box_top: 337.2,
                  box_right: 462.6,
                  box_bottom: 349.2,
                },
                page: 189,
                text: '0.11',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:27","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 89.4,
                  box_top: 293.4,
                  box_right: 132,
                  box_bottom: 311.4,
                },
                page: 189,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:27","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.2,
                  box_top: 97.8,
                  box_right: 515.4,
                  box_bottom: 116.4,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:27","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8,
                  box_top: 355.8,
                  box_right: 313.8,
                  box_bottom: 373.2,
                },
                page: 189,
                text: '重庆市得森建筑规划设计研究院有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:27","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 386.4,
                  box_top: 357,
                  box_right: 426.59999999999997,
                  box_bottom: 370.8,
                },
                page: 189,
                text: '45.30',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:27","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 427.8,
                  box_top: 357,
                  box_right: 462.6,
                  box_bottom: 373.2,
                },
                page: 189,
                text: '0.09',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:28","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.6,
                  box_top: 293.4,
                  box_right: 133.8,
                  box_bottom: 310.79999999999995,
                },
                page: 189,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:28","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 483.6,
                  box_top: 94.2,
                  box_right: 522.6,
                  box_bottom: 120,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:28","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.4,
                  box_top: 378,
                  box_right: 274.8,
                  box_bottom: 394.2,
                },
                page: 189,
                text: '厦门海晟房地产开发有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:28","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 388.8,
                  box_top: 377.4,
                  box_right: 424.8,
                  box_bottom: 393.59999999999997,
                },
                page: 189,
                text: '43.58',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:28","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.8,
                  box_top: 379.2,
                  box_right: 461.40000000000003,
                  box_bottom: 393.59999999999997,
                },
                page: 189,
                text: '0.09',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:29","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.2,
                  box_top: 292.2,
                  box_right: 135,
                  box_bottom: 310.2,
                },
                page: 189,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:29","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.6,
                  box_top: 97.2,
                  box_right: 514.2,
                  box_bottom: 116.4,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:29","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.6,
                  box_top: 399,
                  box_right: 283.2,
                  box_bottom: 416.4,
                },
                page: 189,
                text: '中国铁路物资股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:29","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 391.8,
                  box_top: 397.2,
                  box_right: 423.6,
                  box_bottom: 413.4,
                },
                page: 189,
                text: '41.03',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:29","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.2,
                  box_top: 401.4,
                  box_right: 463.8,
                  box_bottom: 413.4,
                },
                page: 189,
                text: '0.08',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:30","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8,
                  box_top: 438,
                  box_right: 135,
                  box_bottom: 453,
                },
                page: 189,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:30","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.8,
                  box_top: 93,
                  box_right: 519.6,
                  box_bottom: 116.4,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:30","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.8,
                  box_top: 459,
                  box_right: 256.2,
                  box_bottom: 475.8,
                },
                page: 189,
                text: '中国建筑股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:30","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 389.4,
                  box_top: 461.4,
                  box_right: 423.59999999999997,
                  box_bottom: 478.79999999999995,
                },
                page: 189,
                text: '154.72',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:30","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 432,
                  box_top: 461.4,
                  box_right: 463.2,
                  box_bottom: 475.2,
                },
                page: 189,
                text: '0.55',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:31","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84,
                  box_top: 435.6,
                  box_right: 134.4,
                  box_bottom: 456,
                },
                page: 189,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:31","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.2,
                  box_top: 98.4,
                  box_right: 510,
                  box_bottom: 117.60000000000001,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:31","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.8,
                  box_top: 479.4,
                  box_right: 297,
                  box_bottom: 496.79999999999995,
                },
                page: 189,
                text: '彭水九黎文化旅游投资有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:31","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 386.4,
                  box_top: 482.4,
                  box_right: 424.79999999999995,
                  box_bottom: 496.2,
                },
                page: 189,
                text: '123.53',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:31","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.2,
                  box_top: 483,
                  box_right: 465,
                  box_bottom: 498,
                },
                page: 189,
                text: '0.44',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:32","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.4,
                  box_top: 440.4,
                  box_right: 134.4,
                  box_bottom: 454.2,
                },
                page: 189,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:32","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.4,
                  box_top: 94.8,
                  box_right: 523.1999999999999,
                  box_bottom: 114.6,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:32","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.4,
                  box_top: 499.2,
                  box_right: 267.6,
                  box_bottom: 516.6,
                },
                page: 189,
                text: '海南金海湾投资开发有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:32","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 394.2,
                  box_top: 500.4,
                  box_right: 426.59999999999997,
                  box_bottom: 517.1999999999999,
                },
                page: 189,
                text: '76.18',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:32","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 435.6,
                  box_top: 503.4,
                  box_right: 465,
                  box_bottom: 516,
                },
                page: 189,
                text: '0.27',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:33","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.6,
                  box_top: 436.8,
                  box_right: 135.6,
                  box_bottom: 454.8,
                },
                page: 189,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:33","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.6,
                  box_top: 96.6,
                  box_right: 510,
                  box_bottom: 115.19999999999999,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:33","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 111,
                  box_top: 519.6,
                  box_right: 222,
                  box_bottom: 540.6,
                },
                page: 189,
                text: '丰泰置业有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:33","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 392.4,
                  box_top: 524.4,
                  box_right: 424.2,
                  box_bottom: 535.8,
                },
                page: 189,
                text: '50.94',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:33","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 430.8,
                  box_top: 524.4,
                  box_right: 462,
                  box_bottom: 535.1999999999999,
                },
                page: 189,
                text: '0.18',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:34","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 81,
                  box_top: 439.2,
                  box_right: 135,
                  box_bottom: 455.4,
                },
                page: 189,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:34","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 94.2,
                  box_right: 523.2,
                  box_bottom: 120,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:34","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 115.2,
                  box_top: 541.2,
                  box_right: 250.8,
                  box_bottom: 559.2,
                },
                page: 189,
                text: '陕西万众地产有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:34","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 385.2,
                  box_top: 541.8,
                  box_right: 425.4,
                  box_bottom: 556.8,
                },
                page: 189,
                text: '50.94',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:34","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 432,
                  box_top: 544.2,
                  box_right: 465,
                  box_bottom: 559.8000000000001,
                },
                page: 189,
                text: '0.18',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:35","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8,
                  box_top: 586.2,
                  box_right: 134.4,
                  box_bottom: 599.4000000000001,
                },
                page: 189,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:35","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 484.2,
                  box_top: 94.2,
                  box_right: 525.6,
                  box_bottom: 118.80000000000001,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:35","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.6,
                  box_top: 603,
                  box_right: 295.2,
                  box_bottom: 620.4,
                },
                page: 189,
                text: '哈尔滨市城市建设投资集团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:35","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 387.6,
                  box_top: 603,
                  box_right: 424.20000000000005,
                  box_bottom: 619.2,
                },
                page: 189,
                text: '266.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:35","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.2,
                  box_top: 606.6,
                  box_right: 465,
                  box_bottom: 619.8000000000001,
                },
                page: 189,
                text: '1.11',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:36","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.6,
                  box_top: 585,
                  box_right: 133.8,
                  box_bottom: 598.8,
                },
                page: 189,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:36","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.6,
                  box_top: 91.8,
                  box_right: 520.2,
                  box_bottom: 115.8,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:36","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.4,
                  box_top: 624.6,
                  box_right: 237,
                  box_bottom: 639.6,
                },
                page: 189,
                text: '汕头花园集团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:36","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 387,
                  box_top: 627,
                  box_right: 422.4,
                  box_bottom: 642.6,
                },
                page: 189,
                text: '191.01',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:36","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 434.4,
                  box_top: 627,
                  box_right: 463.79999999999995,
                  box_bottom: 642.6,
                },
                page: 189,
                text: '0.80',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:37","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.4,
                  box_top: 583.8,
                  box_right: 135.60000000000002,
                  box_bottom: 600,
                },
                page: 189,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:37","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 483,
                  box_top: 96,
                  box_right: 517.8,
                  box_bottom: 120,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:37","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 110.4,
                  box_top: 645,
                  box_right: 258,
                  box_bottom: 660.6,
                },
                page: 189,
                text: '重庆中渝物业发展有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:37","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390,
                  box_top: 646.8,
                  box_right: 424.8,
                  box_bottom: 661.1999999999999,
                },
                page: 189,
                text: '113.21',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:37","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 430.2,
                  box_top: 645.6,
                  box_right: 463.2,
                  box_bottom: 660,
                },
                page: 189,
                text: '0.47',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:38","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 81.6,
                  box_top: 582.6,
                  box_right: 134.39999999999998,
                  box_bottom: 599.4,
                },
                page: 189,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:38","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.8,
                  box_top: 96,
                  box_right: 516.6,
                  box_bottom: 117.6,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:38","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 112.2,
                  box_top: 666.6,
                  box_right: 217.8,
                  box_bottom: 680.4,
                },
                page: 189,
                text: '天津天狮学院',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:38","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390,
                  box_top: 669,
                  box_right: 424.2,
                  box_bottom: 681.6,
                },
                page: 189,
                text: '99.01',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:38","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 434.4,
                  box_top: 666,
                  box_right: 460.79999999999995,
                  box_bottom: 680.4,
                },
                page: 189,
                text: '0.41',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:39","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 86.4,
                  box_top: 584.4,
                  box_right: 134.4,
                  box_bottom: 597,
                },
                page: 189,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:39","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.2,
                  box_top: 94.8,
                  box_right: 516,
                  box_bottom: 118.8,
                },
                page: 189,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:39","客户名称:0"]',
        schema: {
          data: {
            label: '客户名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 116.4,
                  box_top: 690,
                  box_right: 277.8,
                  box_bottom: 710.4,
                },
                page: 189,
                text: '天津湖滨广场置业发展有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:39","销售额:0"]',
        schema: {
          data: {
            label: '销售额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 395.4,
                  box_top: 690.6,
                  box_right: 423,
                  box_bottom: 706.2,
                },
                page: 189,
                text: '87.47',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要客户:39","占营业收入比例:0"]',
        schema: {
          data: {
            label: '占营业收入比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 431.4,
                  box_top: 689.4,
                  box_right: 465.59999999999997,
                  box_bottom: 708,
                },
                page: 189,
                text: '0.36',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:0","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8333,
                  box_top: 267.5,
                  box_right: 154.1666,
                  box_bottom: 283.3333,
                },
                page: 202,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:0","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485,
                  box_top: 208.3333,
                  box_right: 507.5,
                  box_bottom: 231.66660000000002,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:0","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 124.1667,
                  box_top: 286.6667,
                  box_right: 302.5,
                  box_bottom: 308.3334,
                },
                page: 202,
                text: '深圳爱克莱特科技股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:0","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 336.6667,
                  box_top: 286.6667,
                  box_right: 364.1667,
                  box_bottom: 303.3334,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:0","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 383.3333,
                  box_top: 287.5,
                  box_right: 427.5,
                  box_bottom: 304.1667,
                },
                page: 202,
                text: '5,513.79',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:0","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 458.3333,
                  box_top: 285,
                  box_right: 510.8333,
                  box_bottom: 301.6667,
                },
                page: 202,
                text: '27.47%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:1","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.1667,
                  box_top: 265.8333,
                  box_right: 150.8334,
                  box_bottom: 284.1666,
                },
                page: 202,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:1","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 207.5,
                  box_right: 503.3334,
                  box_bottom: 234.1667,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:1","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 305.8333,
                  box_right: 285.8333,
                  box_bottom: 325,
                },
                page: 202,
                text: '欧司朗（中国）照明有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:1","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 336.6667,
                  box_top: 307.5,
                  box_right: 365,
                  box_bottom: 323.3333,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:1","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 385,
                  box_top: 310,
                  box_right: 428.3333,
                  box_bottom: 320.8333,
                },
                page: 202,
                text: '1,666.38',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:1","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 460.8333,
                  box_top: 309.1667,
                  box_right: 527.5,
                  box_bottom: 325.8334,
                },
                page: 202,
                text: '8.30%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:2","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8333,
                  box_top: 265,
                  box_right: 153.3333,
                  box_bottom: 284.1667,
                },
                page: 202,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:2","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485,
                  box_top: 212.5,
                  box_right: 503.3333,
                  box_bottom: 235,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:2","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 120.8333,
                  box_top: 330,
                  box_right: 285,
                  box_bottom: 350.8333,
                },
                page: 202,
                text: '深圳市联嘉祥科技股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:2","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 336.6667,
                  box_top: 325,
                  box_right: 366.6667,
                  box_bottom: 353.3333,
                },
                page: 202,
                text: '电线\n电缆',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:2","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 378.3333,
                  box_top: 330,
                  box_right: 430,
                  box_bottom: 351.6667,
                },
                page: 202,
                text: '1,541.43',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:2","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 456.6667,
                  box_top: 330.8333,
                  box_right: 510,
                  box_bottom: 350,
                },
                page: 202,
                text: '7.68%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:3","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8333,
                  box_top: 262.5,
                  box_right: 154.1666,
                  box_bottom: 284.1667,
                },
                page: 202,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:3","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 211.6667,
                  box_right: 522.5,
                  box_bottom: 238.33339999999998,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:3","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 353.3333,
                  box_right: 289.1666,
                  box_bottom: 371.6666,
                },
                page: 202,
                text: '广州市雅江光电设备有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:3","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 335.8333,
                  box_top: 355,
                  box_right: 367.5,
                  box_bottom: 373.3333,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:3","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 383.3333,
                  box_top: 357.5,
                  box_right: 430,
                  box_bottom: 371.6667,
                },
                page: 202,
                text: '1,447.79',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:3","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 463.3333,
                  box_top: 358.3333,
                  box_right: 510,
                  box_bottom: 374.1666,
                },
                page: 202,
                text: '7.21%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:4","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 86.6667,
                  box_top: 266.6667,
                  box_right: 152.5,
                  box_bottom: 283.3334,
                },
                page: 202,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:4","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485,
                  box_top: 211.6667,
                  box_right: 520.8333,
                  box_bottom: 235,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:4","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 125,
                  box_top: 376.6667,
                  box_right: 301.6667,
                  box_bottom: 393.3334,
                },
                page: 202,
                text: '杭州柏年智能光电子股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:4","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 340.8333,
                  box_top: 379.1667,
                  box_right: 375.8333,
                  box_bottom: 392.5,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:4","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 382.5,
                  box_top: 380,
                  box_right: 430.8333,
                  box_bottom: 392.5,
                },
                page: 202,
                text: '1,075.25',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:4","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 464.1667,
                  box_top: 377.5,
                  box_right: 506.6667,
                  box_bottom: 393.3333,
                },
                page: 202,
                text: '5.43%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:5","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.3333,
                  box_top: 418.3333,
                  box_right: 130.8333,
                  box_bottom: 438.3333,
                },
                page: 202,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:5","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 484.1667,
                  box_top: 207.5,
                  box_right: 512.5,
                  box_bottom: 230.8333,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:5","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 121.6667,
                  box_top: 438.3333,
                  box_right: 272.5,
                  box_bottom: 458.3333,
                },
                page: 202,
                text: '湖州普菲特科技有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:5","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 337.5,
                  box_top: 440,
                  box_right: 370,
                  box_bottom: 456.6667,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:5","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 379.1667,
                  box_top: 436.6667,
                  box_right: 428.3334,
                  box_bottom: 456.6667,
                },
                page: 202,
                text: '1,960.43',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:5","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 469.1667,
                  box_top: 440.8333,
                  box_right: 509.1667,
                  box_bottom: 455,
                },
                page: 202,
                text: '9.48%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:6","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 88.3333,
                  box_top: 420.8333,
                  box_right: 132.5,
                  box_bottom: 434.1666,
                },
                page: 202,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:6","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 210.8333,
                  box_right: 513.3334,
                  box_bottom: 235.8333,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:6","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 124.1667,
                  box_top: 461.6667,
                  box_right: 277.5,
                  box_bottom: 479.1667,
                },
                page: 202,
                text: '广州名至照明发展有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:6","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 341.6667,
                  box_top: 460,
                  box_right: 369.1667,
                  box_bottom: 477.5,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:6","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 381.6667,
                  box_top: 460,
                  box_right: 426.6667,
                  box_bottom: 477.5,
                },
                page: 202,
                text: '1,431.47',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:6","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 466.6667,
                  box_top: 459.1667,
                  box_right: 508.3334,
                  box_bottom: 475.8334,
                },
                page: 202,
                text: '6.92%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:7","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 82.5,
                  box_top: 413.3333,
                  box_right: 133.3333,
                  box_bottom: 434.1666,
                },
                page: 202,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:7","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 211.6667,
                  box_right: 505,
                  box_bottom: 233.33339999999998,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:7","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 474.1667,
                  box_right: 288.3333,
                  box_bottom: 498.3334,
                },
                page: 202,
                text: '欧司朗（中国）照明有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:7","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 340.8333,
                  box_top: 479.1667,
                  box_right: 365,
                  box_bottom: 497.5,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:7","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 380.8333,
                  box_top: 480.8333,
                  box_right: 428.3333,
                  box_bottom: 495.8333,
                },
                page: 202,
                text: '1,155.11',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:7","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 467.5,
                  box_top: 482.5,
                  box_right: 508.3333,
                  box_bottom: 496.6667,
                },
                page: 202,
                text: '5.59%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:8","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85.8333,
                  box_top: 412.5,
                  box_right: 133.3333,
                  box_bottom: 435.8333,
                },
                page: 202,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:8","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 483.3333,
                  box_top: 213.3333,
                  box_right: 509.1666,
                  box_bottom: 233.3333,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:8","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 502.5,
                  box_right: 271.6666,
                  box_bottom: 522.5,
                },
                page: 202,
                text: '泰兴市泰宏建材贸易有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:8","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 339.1667,
                  box_top: 499.1667,
                  box_right: 365,
                  box_bottom: 528.3334,
                },
                page: 202,
                text: '电线\n电缆',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:8","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390.8333,
                  box_top: 508.3333,
                  box_right: 427.5,
                  box_bottom: 521.6666,
                },
                page: 202,
                text: '774.21',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:8","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 471.6667,
                  box_top: 502.5,
                  box_right: 505.8334,
                  box_bottom: 524.1667,
                },
                page: 202,
                text: '3.74%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:9","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 87.5,
                  box_top: 416.6667,
                  box_right: 132.5,
                  box_bottom: 434.1667,
                },
                page: 202,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:9","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.8333,
                  box_top: 211.6667,
                  box_right: 511.6666,
                  box_bottom: 235,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:9","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 525.8333,
                  box_right: 300,
                  box_bottom: 546.6666,
                },
                page: 202,
                text: '玛斯柯照明设备（上海）有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:9","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 340.8333,
                  box_top: 528.3333,
                  box_right: 359.1666,
                  box_bottom: 546.6666,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:9","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390,
                  box_top: 528.3333,
                  box_right: 426.6667,
                  box_bottom: 544.1666,
                },
                page: 202,
                text: '764.63',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:9","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 466.6667,
                  box_top: 527.5,
                  box_right: 508.3334,
                  box_bottom: 547.5,
                },
                page: 202,
                text: '3.75%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:10","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 89.1667,
                  box_top: 566.6667,
                  box_right: 131.6667,
                  box_bottom: 588.3334,
                },
                page: 202,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:10","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 483.3333,
                  box_top: 210,
                  box_right: 517.5,
                  box_bottom: 230.8333,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:10","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 121.6667,
                  box_top: 590.8333,
                  box_right: 279.1667,
                  box_bottom: 609.1666,
                },
                page: 202,
                text: '乐雷光电技术（上海）有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:10","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 337.5,
                  box_top: 590.8333,
                  box_right: 367.5,
                  box_bottom: 607.5,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:10","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 381.6667,
                  box_top: 589.1667,
                  box_right: 430.8334,
                  box_bottom: 608.3334,
                },
                page: 202,
                text: '1,166.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:10","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 468.3333,
                  box_top: 591.6667,
                  box_right: 507.5,
                  box_bottom: 605,
                },
                page: 202,
                text: '9.36%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:11","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.1667,
                  box_top: 567.5,
                  box_right: 133.3334,
                  box_bottom: 586.6667,
                },
                page: 202,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:11","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 488.3333,
                  box_top: 214.1667,
                  box_right: 512.5,
                  box_bottom: 235.83339999999998,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:11","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 118.3333,
                  box_top: 610,
                  box_right: 274.1666,
                  box_bottom: 629.1667,
                },
                page: 202,
                text: '广东亮美集照明科技有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:11","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 335.8333,
                  box_top: 611.6667,
                  box_right: 362.5,
                  box_bottom: 628.3334,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:11","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 381.6667,
                  box_top: 610,
                  box_right: 430,
                  box_bottom: 629.1667,
                },
                page: 202,
                text: '635.79',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:11","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 459.1667,
                  box_top: 610,
                  box_right: 505.8334,
                  box_bottom: 627.5,
                },
                page: 202,
                text: '5.10%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:12","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 84.1667,
                  box_top: 567.5,
                  box_right: 134.1667,
                  box_bottom: 589.1667,
                },
                page: 202,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:12","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485,
                  box_top: 211.6667,
                  box_right: 515.8333,
                  box_bottom: 234.1667,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:12","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 631.6667,
                  box_right: 311.6666,
                  box_bottom: 648.3334,
                },
                page: 202,
                text: '飞利浦照明（中国）投资有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:12","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 335,
                  box_top: 632.5,
                  box_right: 369.1667,
                  box_bottom: 649.1667,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:12","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 377.5,
                  box_top: 632.5,
                  box_right: 425.8333,
                  box_bottom: 650,
                },
                page: 202,
                text: '550.15',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:12","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 460.8333,
                  box_top: 631.6667,
                  box_right: 509.1666,
                  box_bottom: 650,
                },
                page: 202,
                text: '4.42%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:13","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.3333,
                  box_top: 568.3333,
                  box_right: 135.8333,
                  box_bottom: 585.8333,
                },
                page: 202,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:13","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 210.8333,
                  box_right: 515.8334,
                  box_bottom: 236.66660000000002,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:13","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 124.1667,
                  box_top: 647.5,
                  box_right: 292.5,
                  box_bottom: 670.8333,
                },
                page: 202,
                text: '欧司朗（中国）照明有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:13","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 342.5,
                  box_top: 652.5,
                  box_right: 368.3333,
                  box_bottom: 665.8333,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:13","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 380,
                  box_top: 651.6667,
                  box_right: 426.6667,
                  box_bottom: 669.1667,
                },
                page: 202,
                text: '465.34',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:13","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 451.6667,
                  box_top: 650,
                  box_right: 511.6667,
                  box_bottom: 669.1667,
                },
                page: 202,
                text: '3.74%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:14","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85,
                  box_top: 567.5,
                  box_right: 134.1667,
                  box_bottom: 587.5,
                },
                page: 202,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:14","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485,
                  box_top: 212.5,
                  box_right: 505,
                  box_bottom: 227.5,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:14","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 673.3333,
                  box_right: 265,
                  box_bottom: 686.6666,
                },
                page: 202,
                text: '珠海华而美照明有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:14","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 333.3333,
                  box_top: 670,
                  box_right: 363.3333,
                  box_bottom: 690,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:14","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390.8333,
                  box_top: 670.8333,
                  box_right: 426.6666,
                  box_bottom: 688.3333,
                },
                page: 202,
                text: '412.52',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:14","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 466.6667,
                  box_top: 674.1667,
                  box_right: 509.1667,
                  box_bottom: 686.6667,
                },
                page: 202,
                text: '3.31%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:15","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 82.5,
                  box_top: 716.6667,
                  box_right: 135,
                  box_bottom: 730,
                },
                page: 202,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:15","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.8333,
                  box_top: 210.8333,
                  box_right: 521.6666,
                  box_bottom: 235.8333,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:15","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 127.5,
                  box_top: 731.6667,
                  box_right: 312.5,
                  box_bottom: 755,
                },
                page: 202,
                text: '大峡谷照明系统（苏州）股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:15","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 330.8333,
                  box_top: 734.1667,
                  box_right: 367.5,
                  box_bottom: 751.6667,
                },
                page: 202,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:15","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 378.3333,
                  box_top: 731.6667,
                  box_right: 428.3333,
                  box_bottom: 751.6667,
                },
                page: 202,
                text: '2,696.54',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:15","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 458.3333,
                  box_top: 734.1667,
                  box_right: 508.3333,
                  box_bottom: 751.6667,
                },
                page: 202,
                text: '23.97%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:16","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 87.5,
                  box_top: 710.8333,
                  box_right: 133.3333,
                  box_bottom: 730.8333,
                },
                page: 202,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:16","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 210.8333,
                  box_right: 523.3334,
                  box_bottom: 234.16660000000002,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:16","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 121.6667,
                  box_top: 105.8333,
                  box_right: 272.5,
                  box_bottom: 120.8333,
                },
                page: 203,
                text: '广东亮美集照明科技有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:16","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 335.8333,
                  box_top: 105,
                  box_right: 357.5,
                  box_bottom: 118.3333,
                },
                page: 203,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:16","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 393.3333,
                  box_top: 109.1667,
                  box_right: 429.1666,
                  box_bottom: 121.6667,
                },
                page: 203,
                text: '603.97',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:16","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 460.8333,
                  box_top: 107.5,
                  box_right: 505,
                  box_bottom: 121.6667,
                },
                page: 203,
                text: '5.37%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:17","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85,
                  box_top: 712.5,
                  box_right: 136.6667,
                  box_bottom: 731.6667,
                },
                page: 202,
                text: '2015 年度：',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:17","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.8333,
                  box_top: 211.6667,
                  box_right: 515.8333,
                  box_bottom: 230.83339999999998,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:17","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 121.6667,
                  box_top: 125.8333,
                  box_right: 270.8334,
                  box_bottom: 145,
                },
                page: 203,
                text: '上海光联照明有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:17","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 336.6667,
                  box_top: 126.6667,
                  box_right: 364.1667,
                  box_bottom: 145,
                },
                page: 203,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:17","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 384.1667,
                  box_top: 128.3333,
                  box_right: 426.6667,
                  box_bottom: 142.5,
                },
                page: 203,
                text: '521.56',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:17","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 460.8333,
                  box_top: 126.6667,
                  box_right: 507.5,
                  box_bottom: 146.6667,
                },
                page: 203,
                text: '4.64%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:18","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 87.5,
                  box_top: 710.8333,
                  box_right: 134.1667,
                  box_bottom: 732.5,
                },
                page: 202,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:18","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 214.1667,
                  box_right: 525.8334,
                  box_bottom: 230.83339999999998,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:18","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 123.3333,
                  box_top: 147.5,
                  box_right: 310.8333,
                  box_bottom: 165.8333,
                },
                page: 203,
                text: '北京市飞利浦电子产品服务有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:18","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 333.3333,
                  box_top: 147.5,
                  box_right: 368.3333,
                  box_bottom: 165.8333,
                },
                page: 203,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:18","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 382.5,
                  box_top: 143.3333,
                  box_right: 429.1667,
                  box_bottom: 164.16660000000002,
                },
                page: 203,
                text: '455.33',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:18","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 470.8333,
                  box_top: 149.1667,
                  box_right: 512.5,
                  box_bottom: 165.83339999999998,
                },
                page: 203,
                text: '4.05%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:19","时间:0"]',
        schema: {
          data: {
            label: '时间',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 86.6667,
                  box_top: 713.3333,
                  box_right: 132.5,
                  box_bottom: 727.5,
                },
                page: 202,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:19","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 210,
                  box_right: 510.8334,
                  box_bottom: 231.6667,
                },
                page: 202,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:19","供应商名称:0"]',
        schema: {
          data: {
            label: '供应商名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130,
                  box_top: 168.3333,
                  box_right: 271.6667,
                  box_bottom: 185,
                },
                page: 203,
                text: '上海普哲实业发展有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:19","采购内容:0"]',
        schema: {
          data: {
            label: '采购内容',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 338.3333,
                  box_top: 164.1667,
                  box_right: 367.5,
                  box_bottom: 185,
                },
                page: 203,
                text: '灯具',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:19","采购额:0"]',
        schema: {
          data: {
            label: '采购额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 376.6667,
                  box_top: 167.5,
                  box_right: 430,
                  box_bottom: 184.1667,
                },
                page: 203,
                text: '410.89',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","主要供应商:19","占总采购金额比例:0"]',
        schema: {
          data: {
            label: '占总采购金额比例',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 455,
                  box_top: 170.8333,
                  box_right: 506.6667,
                  box_bottom: 183.3333,
                },
                page: 203,
                text: '3.65%',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:0","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 487.5,
                  box_top: 533.3333,
                  box_right: 529.1667,
                  box_bottom: 553.3333,
                },
                page: 480,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:0","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 150.8333,
                  box_top: 469.1667,
                  box_right: 265.8333,
                  box_bottom: 485,
                },
                page: 480,
                text: '工程施工合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '其他',
      },
      {
        key: '["No.01:0","重大合同:0","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 267.5,
                  box_top: 597.5,
                  box_right: 335,
                  box_bottom: 648.3333,
                },
                page: 480,
                text: '郑州报业多\n媒体信息港\n有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:0","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345,
                  box_top: 588.3333,
                  box_right: 449.1667,
                  box_bottom: 655.8333,
                },
                page: 480,
                text:
                  '北起渠南路、南至文博\n大道、西临西四环、东\n接凯旋路，场地面积\n153ha 的中央文化区进\n行整体照明建设',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:0","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 466.6667,
                  box_top: 610.8333,
                  box_right: 511.6667,
                  box_bottom: 635.8333,
                },
                page: 480,
                text: '31,676.14',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:1","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 530.8333,
                  box_right: 529.1667,
                  box_bottom: 554.1666,
                },
                page: 480,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:1","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 151.6667,
                  box_top: 466.6667,
                  box_right: 245,
                  box_bottom: 485,
                },
                page: 480,
                text: '工程施工合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '其他',
      },
      {
        key: '["No.01:0","重大合同:1","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 268.3333,
                  box_top: 660.8333,
                  box_right: 335.8333,
                  box_bottom: 745.8333,
                },
                page: 480,
                text:
                  '长春市富源\n晟和房地产\n开发有限公\n司、上海宝冶\n集团有限公\n司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:1","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 341.6667,
                  box_top: 658.3333,
                  box_right: 450,
                  box_bottom: 752.5,
                },
                page: 480,
                text:
                  '长春龙翔国际商务中\n心项目新区邻里中心、\n研发用房、产业孵化用\n房、双创中心、新区人\n才公寓楼体外夜景照\n明灯具安装等全部工\n程的深化设计及施工',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:1","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 465,
                  box_top: 691.6667,
                  box_right: 513.3333,
                  box_bottom: 725,
                },
                page: 480,
                text: '22,356.14',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:2","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 534.1667,
                  box_right: 512.5,
                  box_bottom: 555,
                },
                page: 480,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:2","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 154.1667,
                  box_top: 465.8333,
                  box_right: 221.6667,
                  box_bottom: 486.6666,
                },
                page: 480,
                text: '工程施工合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '其他',
      },
      {
        key: '["No.01:0","重大合同:2","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 273.3333,
                  box_top: 105,
                  box_right: 334.1666,
                  box_bottom: 161.6667,
                },
                page: 481,
                text: '武汉旅游发\n展投资集团\n有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:2","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345.8333,
                  box_top: 79.1667,
                  box_right: 447.5,
                  box_bottom: 185,
                },
                page: 481,
                text:
                  '武汉两江四岸景观亮\n化建设区域扩大到鹦\n鹉洲大桥至二七长江\n大桥沿线汉口中山大\n道至武昌中北路沿线\n范围内的部分建筑及\n趸船码头景观亮化提\n升',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:2","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 461.6667,
                  box_top: 116.6667,
                  box_right: 514.1667,
                  box_bottom: 147.5,
                },
                page: 481,
                text: '13,339.82',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:3","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 479.1667,
                  box_top: 528.3333,
                  box_right: 525,
                  box_bottom: 552.5,
                },
                page: 480,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:3","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 145.8333,
                  box_top: 465.8333,
                  box_right: 246.66660000000002,
                  box_bottom: 487.5,
                },
                page: 480,
                text: '工程施工合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '其他',
      },
      {
        key: '["No.01:0","重大合同:3","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 270,
                  box_top: 199.1667,
                  box_right: 337.5,
                  box_bottom: 260.8334,
                },
                page: 481,
                text: '中建安装工\n程有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:3","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 340.8333,
                  box_top: 191.6667,
                  box_right: 450.8333,
                  box_bottom: 265.8334,
                },
                page: 481,
                text:
                  'CBD 核心区 Z15 地块\n项目地下部分、CBD\n核心区 Z15 地块项目\n地上部分等 5 项夜景\n照明子项工程',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:3","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 468.3333,
                  box_top: 220,
                  box_right: 512.5,
                  box_bottom: 246.6667,
                },
                page: 481,
                text: '13,338.20',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:4","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 476.6667,
                  box_top: 535,
                  box_right: 512.5,
                  box_bottom: 556.6667,
                },
                page: 480,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:4","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 150.8333,
                  box_top: 462.5,
                  box_right: 236.66660000000002,
                  box_bottom: 484.1667,
                },
                page: 480,
                text: '工程施工合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '其他',
      },
      {
        key: '["No.01:0","重大合同:4","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 270,
                  box_top: 275.8333,
                  box_right: 338.3333,
                  box_bottom: 322.5,
                },
                page: 481,
                text: '中建三局集\n团有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:4","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 343.3333,
                  box_top: 270,
                  box_right: 450.8333,
                  box_bottom: 323.3333,
                },
                page: 481,
                text:
                  '中国北京市 CBD 核心\n区 Z14 地块商业金融\n项目泛光照明分包工\n程',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:4","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 465.8333,
                  box_top: 285.8333,
                  box_right: 510,
                  box_bottom: 309.1666,
                },
                page: 481,
                text: '5,356.65',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:5","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 476.6667,
                  box_top: 431.6667,
                  box_right: 502.5,
                  box_bottom: 455.8334,
                },
                page: 481,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:5","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 143.3333,
                  box_top: 365.8333,
                  box_right: 243.3333,
                  box_bottom: 388.3333,
                },
                page: 481,
                text: '工程设计合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '其他',
      },
      {
        key: '["No.01:0","重大合同:5","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 257.5,
                  box_top: 490.8333,
                  box_right: 315,
                  box_bottom: 538.3333,
                },
                page: 481,
                text: '上海海昌极\n地海洋世界\n有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:5","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 319.1667,
                  box_top: 486.6667,
                  box_right: 464.1667,
                  box_bottom: 545,
                },
                page: 481,
                text:
                  '上海海昌海洋公园项目夜景照\n明工程方案至施工图设计，设\n计内容包含照明效果设计、电\n气设计、安装构造设计',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:5","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 472.5,
                  box_top: 505,
                  box_right: 505.8333,
                  box_bottom: 530.8333,
                },
                page: 481,
                text: '218.00',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:6","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 484.1667,
                  box_top: 613.3333,
                  box_right: 518.3334,
                  box_bottom: 630,
                },
                page: 481,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:6","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 146.6667,
                  box_top: 549.1667,
                  box_right: 200,
                  box_bottom: 563.3334,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:6","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 125,
                  box_top: 670,
                  box_right: 291.6667,
                  box_bottom: 687.5,
                },
                page: 481,
                text: '深圳市爱克莱特科技股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:6","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 362.5,
                  box_top: 666.6667,
                  box_right: 418.3333,
                  box_bottom: 691.6667,
                },
                page: 481,
                text: '2017.12.01-\n2018.12.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:7","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 613.3333,
                  box_right: 520.8333,
                  box_bottom: 633.3333,
                },
                page: 481,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:7","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 146.6667,
                  box_top: 546.6667,
                  box_right: 200,
                  box_bottom: 561.6667,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:7","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130,
                  box_top: 696.6667,
                  box_right: 231.6667,
                  box_bottom: 713.3334,
                },
                page: 481,
                text: '上海光联照明有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:7","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 360.8333,
                  box_top: 693.3333,
                  box_right: 416.6666,
                  box_bottom: 715.8333,
                },
                page: 481,
                text: '2017.12.01-\n2018.12.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:8","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485.8333,
                  box_top: 614.1667,
                  box_right: 518.3333,
                  box_bottom: 635.8334,
                },
                page: 481,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:8","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 145.8333,
                  box_top: 550,
                  box_right: 234.16660000000002,
                  box_bottom: 565,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:8","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 127.5,
                  box_top: 720,
                  box_right: 277.5,
                  box_bottom: 736.6667,
                },
                page: 481,
                text: '广东徳洛斯照明工业有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:8","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 358.3333,
                  box_top: 715,
                  box_right: 420,
                  box_bottom: 739.1667,
                },
                page: 481,
                text: '2017.12.01-\n2018.12.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:9","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 482.5,
                  box_top: 608.3333,
                  box_right: 514.1667,
                  box_bottom: 630,
                },
                page: 481,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:9","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 144.1667,
                  box_top: 549.1667,
                  box_right: 218.33339999999998,
                  box_bottom: 562.5,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:9","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 122.5,
                  box_top: 742.5,
                  box_right: 259.1667,
                  box_bottom: 766.6667,
                },
                page: 481,
                text: '广州凯图电气股份有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:9","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 360.8333,
                  box_top: 740.8333,
                  box_right: 423.3333,
                  box_bottom: 765.8333,
                },
                page: 481,
                text: '2017.12.01-\n2018.12.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:10","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.8333,
                  box_top: 606.6667,
                  box_right: 527.5,
                  box_bottom: 635,
                },
                page: 481,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:10","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 148.3333,
                  box_top: 546.6667,
                  box_right: 228.3333,
                  box_bottom: 560,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:10","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 127.5,
                  box_top: 79.1667,
                  box_right: 280.8333,
                  box_bottom: 100,
                },
                page: 482,
                text: '北京勇电欧格照明灯具有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:10","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 360.8333,
                  box_top: 76.6667,
                  box_right: 419.1666,
                  box_bottom: 102.5,
                },
                page: 482,
                text: '2018.01.01-\n2018.12.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:11","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.8333,
                  box_top: 610,
                  box_right: 515,
                  box_bottom: 631.6667,
                },
                page: 481,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:11","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 146.6667,
                  box_top: 546.6667,
                  box_right: 224.1667,
                  box_bottom: 565,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:11","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 125,
                  box_top: 106.6667,
                  box_right: 263.3333,
                  box_bottom: 126.6667,
                },
                page: 482,
                text: '浙江晶日照明科技有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:11","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 361.6667,
                  box_top: 104.1667,
                  box_right: 423.3334,
                  box_bottom: 125.83340000000001,
                },
                page: 482,
                text: '2018.01.01-\n2018.12.31',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:12","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 485,
                  box_top: 175,
                  box_right: 510.8333,
                  box_bottom: 191.6667,
                },
                page: 482,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:12","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 142.5,
                  box_top: 550,
                  box_right: 210.8333,
                  box_bottom: 564.1667,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:12","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 122.5,
                  box_top: 227.5,
                  box_right: 261.6667,
                  box_bottom: 244.1667,
                },
                page: 482,
                text: '欧司朗（中国）照明有限公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:12","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 373.3333,
                  box_top: 227.5,
                  box_right: 504.1666,
                  box_bottom: 245,
                },
                page: 482,
                text: '欧司朗各型号灯具及控制器',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:12","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 324.1667,
                  box_top: 229.1667,
                  box_right: 367.5,
                  box_bottom: 244.1667,
                },
                page: 482,
                text: '2,700.00',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:13","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 293.3333,
                  box_right: 520,
                  box_bottom: 310,
                },
                page: 482,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:13","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 144.1667,
                  box_top: 547.5,
                  box_right: 229.1667,
                  box_bottom: 562.5,
                },
                page: 481,
                text: '采购合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '采购',
      },
      {
        key: '["No.01:0","重大合同:13","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 114.1667,
                  box_top: 345,
                  box_right: 233.3334,
                  box_bottom: 370,
                },
                page: 482,
                text: '重庆大伦建筑劳务有限\n公司',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:13","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 342.5,
                  box_top: 345,
                  box_right: 508.3333,
                  box_bottom: 370.8333,
                },
                page: 482,
                text: '武汉两江四岸景观亮化提升项目二\n期工程劳务安装、调试等',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:13","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 298.3333,
                  box_top: 350.8333,
                  box_right: 335.8333,
                  box_bottom: 368.3333,
                },
                page: 482,
                text: '1,036.76',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:14","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 242.5,
                  box_top: 510.8333,
                  box_right: 265.8333,
                  box_bottom: 532.5,
                },
                page: 482,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:14","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 146.6667,
                  box_top: 374.1667,
                  box_right: 301.6667,
                  box_bottom: 391.6667,
                },
                page: 482,
                text: '借款及借款授信、担保合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '借款',
      },
      {
        key: '["No.01:0","重大合同:14","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130,
                  box_top: 440.8333,
                  box_right: 309.1667,
                  box_bottom: 460,
                },
                page: 482,
                text: '北京银行股份有限公司西四支行',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:14","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 208.3333,
                  box_top: 511.6667,
                  box_right: 239.16660000000002,
                  box_bottom: 530.8334,
                },
                page: 482,
                text: '3,000',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:14","已履行金额:0"]',
        schema: {
          data: {
            label: '已履行金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 73.2,
                  box_top: 607.8,
                  box_right: 132.6,
                  box_bottom: 627.5999999999999,
                },
                page: 482,
                text: '2,536.73',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:14","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 223.3333,
                  box_top: 561.6667,
                  box_right: 261.6666,
                  box_bottom: 575,
                },
                page: 482,
                text: '12 个月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:15","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 240,
                  box_top: 675.8333,
                  box_right: 265,
                  box_bottom: 694.1666,
                },
                page: 482,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:15","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 147.5,
                  box_top: 376.6667,
                  box_right: 304.1667,
                  box_bottom: 391.6667,
                },
                page: 482,
                text: '借款及借款授信、担保合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '借款',
      },
      {
        key: '["No.01:0","重大合同:15","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 128.3333,
                  box_top: 440.8333,
                  box_right: 319.1666,
                  box_bottom: 462.5,
                },
                page: 482,
                text: '北京银行股份有限公司西四支行',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:15","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 210.8333,
                  box_top: 675,
                  box_right: 240,
                  box_bottom: 695,
                },
                page: 482,
                text: '3,000',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:15","已履行金额:0"]',
        schema: {
          data: {
            label: '已履行金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 453,
                  box_top: 722.4,
                  box_right: 472.8,
                  box_bottom: 745.1999999999999,
                },
                page: 482,
                text: '100',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:15","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 209.1667,
                  box_top: 697.5,
                  box_right: 250,
                  box_bottom: 720,
                },
                page: 482,
                text: '12 个月',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:16","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 277.5,
                  box_top: 120.8333,
                  box_right: 301.6667,
                  box_bottom: 141.6666,
                },
                page: 483,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:16","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 147.5,
                  box_top: 375,
                  box_right: 300,
                  box_bottom: 391.6667,
                },
                page: 482,
                text: '借款及借款授信、担保合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '借款',
      },
      {
        key: '["No.01:0","重大合同:16","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130,
                  box_top: 746.6667,
                  box_right: 356.6667,
                  box_bottom: 765,
                },
                page: 482,
                text: '杭州银行股份有限公司北京中关村支行',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:16","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 298.3333,
                  box_top: 145,
                  box_right: 510,
                  box_bottom: 162.5,
                },
                page: 483,
                text: '北京市丰台区南四环西路 128 号院 3 号',
              },
              {
                box: {
                  box_left: 75,
                  box_top: 169.1667,
                  box_right: 348.3333,
                  box_bottom: 185.83339999999998,
                },
                page: 483,
                text: '楼 19 层 2201、2202、2203、2205、2206 号的房产',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:16","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 246.6667,
                  box_top: 122.5,
                  box_right: 277.5,
                  box_bottom: 141.6667,
                },
                page: 483,
                text: '3,000',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:17","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 467.5,
                  box_top: 356.6667,
                  box_right: 490,
                  box_bottom: 373.3334,
                },
                page: 483,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:17","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 144.1667,
                  box_top: 375,
                  box_right: 310,
                  box_bottom: 387.5,
                },
                page: 482,
                text: '借款及借款授信、担保合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '借款',
      },
      {
        key: '["No.01:0","重大合同:17","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 128.3333,
                  box_top: 746.6667,
                  box_right: 349.1666,
                  box_bottom: 765,
                },
                page: 482,
                text: '杭州银行股份有限公司北京中关村支行',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:17","标的:0"]',
        schema: {
          data: {
            label: '标的',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 75,
                  box_top: 281.6667,
                  box_right: 512.5,
                  box_bottom: 305,
                },
                page: 483,
                text:
                  '北京市丰台区南四环西路 128 号院 3 号楼 19 层 2201、2202、2203、2205、2206',
              },
              {
                box: {
                  box_left: 81.6667,
                  box_top: 314.1667,
                  box_right: 520,
                  box_bottom: 330,
                },
                page: 483,
                text:
                  '号的房产（不动产权证号分别为“京（2017）丰不动产权第 0041296 号、第 0041302',
              },
              {
                box: {
                  box_left: 80,
                  box_top: 332.5,
                  box_right: 355.8333,
                  box_bottom: 349.1667,
                },
                page: 483,
                text: '号、第 0041289 号、第 0041301 号、第 0041312 号”）',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:17","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 420,
                  box_top: 354.1667,
                  box_right: 465.8333,
                  box_bottom: 372.5,
                },
                page: 483,
                text: '2,975.18',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:17","已履行金额:0"]',
        schema: {
          data: {
            label: '已履行金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 72.6,
                  box_top: 424.8,
                  box_right: 123,
                  box_bottom: 444,
                },
                page: 483,
                text: '829.90',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:18","货币单位:0"]',
        schema: {
          data: {
            label: '货币单位',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 385.8333,
                  box_top: 542.5,
                  box_right: 411.6666,
                  box_bottom: 561.6667,
                },
                page: 483,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:18","合同类型:0"]',
        schema: {
          data: {
            label: '合同类型',
            required: false,
            multi: true,
            type: '合同类型',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 145,
                  box_top: 374.1667,
                  box_right: 312.5,
                  box_bottom: 393.3334,
                },
                page: 482,
                text: '借款及借款授信、担保合同',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: '借款',
      },
      {
        key: '["No.01:0","重大合同:18","合同对手方名称:0"]',
        schema: {
          data: {
            label: '合同对手方名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 130,
                  box_top: 473.3333,
                  box_right: 358.3333,
                  box_bottom: 491.6666,
                },
                page: 483,
                text: '中信银行股份有限公司总行营业部',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:18","合同金额:0"]',
        schema: {
          data: {
            label: '合同金额',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 355.2,
                  box_top: 540.6,
                  box_right: 386.4,
                  box_bottom: 562.2,
                },
                page: 483,
                text: '6,000',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","重大合同:18","履行期限:0"]',
        schema: {
          data: {
            label: '履行期限',
            required: false,
            multi: true,
            type: '日期',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 174.1667,
                  box_top: 610.8333,
                  box_right: 375.8334,
                  box_bottom: 630.8333,
                },
                page: 483,
                text: '2018 年 4 月 11 日至 2019 年 3 月 20 日',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人所处行业:0","行业分类标准:0"]',
        schema: {
          data: {
            label: '行业分类标准',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 289.8,
                  box_top: 670.2,
                  box_right: 499.20000000000005,
                  box_bottom: 689.4000000000001,
                },
                page: 134,
                text: '《上市公司行业分类指引》（2012 年修订）',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人所处行业:0","行业分类代码:0"]',
        schema: {
          data: {
            label: '行业分类代码',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 360,
                  box_top: 696.6,
                  box_right: 380.4,
                  box_bottom: 713.4,
                },
                page: 134,
                text: 'E50',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人所处行业:0","行业分类名称:0"]',
        schema: {
          data: {
            label: '行业分类名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 204,
                  box_top: 694.2,
                  box_right: 321.6,
                  box_bottom: 714.6,
                },
                page: 134,
                text: '建筑装饰和其他建筑业',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人所处行业:1","行业分类标准:0"]',
        schema: {
          data: {
            label: '行业分类标准',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 117,
                  box_top: 721.2,
                  box_right: 325.2,
                  box_bottom: 736.8000000000001,
                },
                page: 134,
                text: '《国民经济行业分类》（GB/T4754-2017）',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人所处行业:1","行业分类代码:0"]',
        schema: {
          data: {
            label: '行业分类代码',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 325.8,
                  box_top: 741,
                  box_right: 351,
                  box_bottom: 762.6,
                },
                page: 134,
                text: 'E501',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","发行人所处行业:1","行业分类名称:0"]',
        schema: {
          data: {
            label: '行业分类名称',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 192.6,
                  box_top: 741,
                  box_right: 286.2,
                  box_bottom: 763.2,
                },
                page: 134,
                text: '建筑装饰和装修业',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成-报表日期:0"]',
        schema: {
          data: {
            label: '盈利能力-收入-业务构成-报表日期',
            type: '日期',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 181.6667,
                  box_top: 459.1667,
                  box_right: 245,
                  box_bottom: 473.3334,
                },
                page: 375,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 268.3333,
                  box_top: 460.8333,
                  box_right: 328.3333,
                  box_bottom: 476.6666,
                },
                page: 375,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 364.1667,
                  box_top: 458.3333,
                  box_right: 410.8334,
                  box_bottom: 479.1666,
                },
                page: 375,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 443.3333,
                  box_top: 459.1667,
                  box_right: 495.8333,
                  box_bottom: 477.5,
                },
                page: 375,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成-货币单位:0"]',
        schema: {
          data: {
            label: '盈利能力-收入-业务构成-货币单位',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 430.8333,
                  box_right: 522.5,
                  box_bottom: 452.5,
                },
                page: 375,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","业务类别:0"]',
        schema: {
          data: {
            label: '业务类别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 88.3333,
                  box_top: 509.1667,
                  box_right: 170,
                  box_bottom: 524.1667,
                },
                page: 375,
                text: '照明工程施工业务',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","金额(T-2年):0"]',
        schema: {
          data: {
            label: '金额(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 431.6667,
                  box_top: 507.5,
                  box_right: 466.6667,
                  box_bottom: 525,
                },
                page: 375,
                text: '22,427.69',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","金额(T-1年):0"]',
        schema: {
          data: {
            label: '金额(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 343.3333,
                  box_top: 506.6667,
                  box_right: 385,
                  box_bottom: 525,
                },
                page: 375,
                text: '26,630.86',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","金额(T年):0"]',
        schema: {
          data: {
            label: '金额(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 259.1667,
                  box_top: 508.3333,
                  box_right: 302.5,
                  box_bottom: 525,
                },
                page: 375,
                text: '46,868.73',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","金额(最近一期）:0"]',
        schema: {
          data: {
            label: '金额(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 171.6667,
                  box_top: 506.6667,
                  box_right: 214.1667,
                  box_bottom: 525.8334,
                },
                page: 375,
                text: '42,580.89',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","占比(T-2年):0"]',
        schema: {
          data: {
            label: '占比(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480.8333,
                  box_top: 509.1667,
                  box_right: 508.3333,
                  box_bottom: 523.3334,
                },
                page: 375,
                text: '93.56',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","占比(T-1年):0"]',
        schema: {
          data: {
            label: '占比(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 390.8333,
                  box_top: 508.3333,
                  box_right: 421.6666,
                  box_bottom: 526.6666,
                },
                page: 375,
                text: '94.82',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","占比(T年):0"]',
        schema: {
          data: {
            label: '占比(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 308.3333,
                  box_top: 506.6667,
                  box_right: 335.8333,
                  box_bottom: 525,
                },
                page: 375,
                text: '96.49',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:0","占比(最近一期）:0"]',
        schema: {
          data: {
            label: '占比(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 229.1667,
                  box_top: 509.1667,
                  box_right: 253.33339999999998,
                  box_bottom: 525,
                },
                page: 375,
                text: '96.29',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","业务类别:0"]',
        schema: {
          data: {
            label: '业务类别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 80,
                  box_top: 635,
                  box_right: 165.8333,
                  box_bottom: 655,
                },
                page: 375,
                text: '照明工程设计业务',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","金额(T-2年):0"]',
        schema: {
          data: {
            label: '金额(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 429.1667,
                  box_top: 639.1667,
                  box_right: 467.5,
                  box_bottom: 655,
                },
                page: 375,
                text: '1,544.79',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","金额(T-1年):0"]',
        schema: {
          data: {
            label: '金额(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 346.6667,
                  box_top: 639.1667,
                  box_right: 383.3334,
                  box_bottom: 655,
                },
                page: 375,
                text: '1,405.52',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","金额(T年):0"]',
        schema: {
          data: {
            label: '金额(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 261.6667,
                  box_top: 637.5,
                  box_right: 300,
                  box_bottom: 657.5,
                },
                page: 375,
                text: '1,084.63',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","金额(最近一期）:0"]',
        schema: {
          data: {
            label: '金额(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 175.8333,
                  box_top: 638.3333,
                  box_right: 211.66660000000002,
                  box_bottom: 652.5,
                },
                page: 375,
                text: '1,337.54',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","占比(T-2年):0"]',
        schema: {
          data: {
            label: '占比(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 481.6667,
                  box_top: 640,
                  box_right: 509.1667,
                  box_bottom: 655,
                },
                page: 375,
                text: '6.44',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","占比(T-1年):0"]',
        schema: {
          data: {
            label: '占比(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 397.5,
                  box_top: 640,
                  box_right: 422.5,
                  box_bottom: 655.8333,
                },
                page: 375,
                text: '5.00',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","占比(T年):0"]',
        schema: {
          data: {
            label: '占比(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 310,
                  box_top: 638.3333,
                  box_right: 337.5,
                  box_bottom: 654.1666,
                },
                page: 375,
                text: '2.23',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:1","占比(最近一期）:0"]',
        schema: {
          data: {
            label: '占比(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 230,
                  box_top: 638.3333,
                  box_right: 254.1667,
                  box_bottom: 655.8333,
                },
                page: 375,
                text: '3.02',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","业务类别:0"]',
        schema: {
          data: {
            label: '业务类别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85,
                  box_top: 656.6667,
                  box_right: 162.5,
                  box_bottom: 674.1667,
                },
                page: 375,
                text: '照明产品销售业务',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","金额(T-2年):0"]',
        schema: {
          data: {
            label: '金额(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 451.6667,
                  box_top: 661.6667,
                  box_right: 470.8334,
                  box_bottom: 675,
                },
                page: 375,
                text: '-',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","金额(T-1年):0"]',
        schema: {
          data: {
            label: '金额(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 354.1667,
                  box_top: 658.3333,
                  box_right: 385.8334,
                  box_bottom: 676.6666,
                },
                page: 375,
                text: '48.12',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","金额(T年):0"]',
        schema: {
          data: {
            label: '金额(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 265.8333,
                  box_top: 660.8333,
                  box_right: 302.5,
                  box_bottom: 675.8333,
                },
                page: 375,
                text: '622.41',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","金额(最近一期）:0"]',
        schema: {
          data: {
            label: '金额(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 177.5,
                  box_top: 661.6667,
                  box_right: 212.5,
                  box_bottom: 674.1667,
                },
                page: 375,
                text: '302.14',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","占比(T-2年):0"]',
        schema: {
          data: {
            label: '占比(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 486.6667,
                  box_top: 660,
                  box_right: 506.6667,
                  box_bottom: 676.6667,
                },
                page: 375,
                text: '-',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","占比(T-1年):0"]',
        schema: {
          data: {
            label: '占比(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 394.1667,
                  box_top: 654.1667,
                  box_right: 424.1667,
                  box_bottom: 673.3334,
                },
                page: 375,
                text: '0.18',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","占比(T年):0"]',
        schema: {
          data: {
            label: '占比(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 315.8333,
                  box_top: 658.3333,
                  box_right: 340,
                  box_bottom: 676.6666,
                },
                page: 375,
                text: '1.28',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-收入-业务构成:2","占比(最近一期）:0"]',
        schema: {
          data: {
            label: '占比(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 220.8333,
                  box_top: 659.1667,
                  box_right: 249.16660000000002,
                  box_bottom: 675.8334,
                },
                page: 375,
                text: '0.69',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成-报表日期:0"]',
        schema: {
          data: {
            label: '盈利能力-成本-业务构成-报表日期',
            type: '日期',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 175.8333,
                  box_top: 472.5,
                  box_right: 254.16660000000002,
                  box_bottom: 490,
                },
                page: 391,
                text: '2018 年 1-6 月',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 268.3333,
                  box_top: 472.5,
                  box_right: 325,
                  box_bottom: 490.8333,
                },
                page: 391,
                text: '2017 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 362.5,
                  box_top: 473.3333,
                  box_right: 410,
                  box_bottom: 490.8333,
                },
                page: 391,
                text: '2016 年度',
              },
            ],
            handleType: 'wireframe',
          },
          {
            boxes: [
              {
                box: {
                  box_left: 447.5,
                  box_top: 471.6667,
                  box_right: 502.5,
                  box_bottom: 488.3334,
                },
                page: 391,
                text: '2015 年度',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成-货币单位:0"]',
        schema: {
          data: {
            label: '盈利能力-成本-业务构成-货币单位',
            type: '文本',
            required: false,
            multi: true,
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 483.3333,
                  box_top: 440.8333,
                  box_right: 525,
                  box_bottom: 466.6666,
                },
                page: 391,
                text: '万元',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","业务类别:0"]',
        schema: {
          data: {
            label: '业务类别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 83.3333,
                  box_top: 520,
                  box_right: 163.3333,
                  box_bottom: 535.8333,
                },
                page: 391,
                text: '照明工程施工业务',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","金额(T-2年):0"]',
        schema: {
          data: {
            label: '金额(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 433.3333,
                  box_top: 523.3333,
                  box_right: 466.6666,
                  box_bottom: 536.6666,
                },
                page: 391,
                text: '14,571.94',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","金额(T-1年):0"]',
        schema: {
          data: {
            label: '金额(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 345,
                  box_top: 517.5,
                  box_right: 388.3333,
                  box_bottom: 537.5,
                },
                page: 391,
                text: '17,247.16',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","金额(T年):0"]',
        schema: {
          data: {
            label: '金额(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 259.1667,
                  box_top: 522.5,
                  box_right: 300.8334,
                  box_bottom: 535.8333,
                },
                page: 391,
                text: '28,643.05',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","金额(最近一期）:0"]',
        schema: {
          data: {
            label: '金额(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 175,
                  box_top: 519.1667,
                  box_right: 213.3333,
                  box_bottom: 537.5,
                },
                page: 391,
                text: '26,033.62',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","占比(T-2年):0"]',
        schema: {
          data: {
            label: '占比(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 478.3333,
                  box_top: 524.1667,
                  box_right: 505.8333,
                  box_bottom: 536.6667,
                },
                page: 391,
                text: '94.58',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","占比(T-1年):0"]',
        schema: {
          data: {
            label: '占比(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 393.3333,
                  box_top: 520.8333,
                  box_right: 418.3333,
                  box_bottom: 536.6666,
                },
                page: 391,
                text: '96.79',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","占比(T年):0"]',
        schema: {
          data: {
            label: '占比(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 312.5,
                  box_top: 523.3333,
                  box_right: 337.5,
                  box_bottom: 537.5,
                },
                page: 391,
                text: '97.32',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:0","占比(最近一期）:0"]',
        schema: {
          data: {
            label: '占比(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 222.5,
                  box_top: 524.1667,
                  box_right: 253.3333,
                  box_bottom: 534.1667,
                },
                page: 391,
                text: '97.44',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","业务类别:0"]',
        schema: {
          data: {
            label: '业务类别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 86.6667,
                  box_top: 652.5,
                  box_right: 165,
                  box_bottom: 667.5,
                },
                page: 391,
                text: '照明工程设计业务',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","金额(T-2年):0"]',
        schema: {
          data: {
            label: '金额(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 430.8333,
                  box_top: 651.6667,
                  box_right: 470.8333,
                  box_bottom: 667.5,
                },
                page: 391,
                text: '834.76',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","金额(T-1年):0"]',
        schema: {
          data: {
            label: '金额(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 353.3333,
                  box_top: 652.5,
                  box_right: 385.8333,
                  box_bottom: 667.5,
                },
                page: 391,
                text: '548.80',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","金额(T年):0"]',
        schema: {
          data: {
            label: '金额(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 265.8333,
                  box_top: 653.3333,
                  box_right: 302.5,
                  box_bottom: 668.3333,
                },
                page: 391,
                text: '501.33',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","金额(最近一期）:0"]',
        schema: {
          data: {
            label: '金额(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 177.5,
                  box_top: 653.3333,
                  box_right: 214.1667,
                  box_bottom: 667.5,
                },
                page: 391,
                text: '424.69',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","占比(T-2年):0"]',
        schema: {
          data: {
            label: '占比(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 480,
                  box_top: 650.8333,
                  box_right: 507.5,
                  box_bottom: 665,
                },
                page: 391,
                text: '5.42',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","占比(T-1年):0"]',
        schema: {
          data: {
            label: '占比(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 399.1667,
                  box_top: 650.8333,
                  box_right: 423.3334,
                  box_bottom: 668.3333,
                },
                page: 391,
                text: '3.08',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","占比(T年):0"]',
        schema: {
          data: {
            label: '占比(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 310.8333,
                  box_top: 650,
                  box_right: 336.6666,
                  box_bottom: 670,
                },
                page: 391,
                text: '1.70',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:1","占比(最近一期）:0"]',
        schema: {
          data: {
            label: '占比(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 230,
                  box_top: 652.5,
                  box_right: 252.5,
                  box_bottom: 667.5,
                },
                page: 391,
                text: '1.59',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","业务类别:0"]',
        schema: {
          data: {
            label: '业务类别',
            required: false,
            multi: true,
            type: '文本',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 85,
                  box_top: 671.6667,
                  box_right: 164.1667,
                  box_bottom: 689.1667,
                },
                page: 391,
                text: '照明产品销售业务',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","金额(T-2年):0"]',
        schema: {
          data: {
            label: '金额(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 444.1667,
                  box_top: 675,
                  box_right: 467.5,
                  box_bottom: 688.3333,
                },
                page: 391,
                text: '-',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","金额(T-1年):0"]',
        schema: {
          data: {
            label: '金额(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 351.6667,
                  box_top: 673.3333,
                  box_right: 385,
                  box_bottom: 688.3333,
                },
                page: 391,
                text: '22.35',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","金额(T年):0"]',
        schema: {
          data: {
            label: '金额(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 260.8333,
                  box_top: 675,
                  box_right: 300,
                  box_bottom: 689.1667,
                },
                page: 391,
                text: '288.18',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","金额(最近一期）:0"]',
        schema: {
          data: {
            label: '金额(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 170.8333,
                  box_top: 673.3333,
                  box_right: 218.3333,
                  box_bottom: 686.6666,
                },
                page: 391,
                text: '258.11',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","占比(T-2年):0"]',
        schema: {
          data: {
            label: '占比(T-2年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 486.6667,
                  box_top: 675.8333,
                  box_right: 510.8334,
                  box_bottom: 689.1666,
                },
                page: 391,
                text: '-',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","占比(T-1年):0"]',
        schema: {
          data: {
            label: '占比(T-1年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 396.6667,
                  box_top: 671.6667,
                  box_right: 422.5,
                  box_bottom: 691.6667,
                },
                page: 391,
                text: '0.13',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","占比(T年):0"]',
        schema: {
          data: {
            label: '占比(T年)',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 310,
                  box_top: 672.5,
                  box_right: 338.3333,
                  box_bottom: 686.6667,
                },
                page: 391,
                text: '0.98',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
      {
        key: '["No.01:0","盈利能力-成本-业务构成:2","占比(最近一期）:0"]',
        schema: {
          data: {
            label: '占比(最近一期）',
            required: false,
            multi: true,
            type: '数字',
            words: '',
          },
        },
        data: [
          {
            boxes: [
              {
                box: {
                  box_left: 226.6667,
                  box_top: 670.8333,
                  box_right: 251.6667,
                  box_bottom: 689.1666,
                },
                page: 391,
                text: '0.97',
              },
            ],
            handleType: 'wireframe',
          },
        ],
        value: null,
      },
    ],
    version: '2.2',
  },
  schema: {
    schema_types: [
      {
        label: '是否已有简历',
        values: [
          { name: '是', isDefault: false },
          { name: '否', isDefault: false },
        ],
        type: 'enum',
      },
      {
        label: '有/无重大诉讼事项',
        values: [
          { name: '有', isDefault: false },
          { name: '无', isDefault: false },
        ],
        type: 'enum',
      },
      {
        label: '合同类型',
        values: [
          { name: '销售', isDefault: false },
          { name: '采购', isDefault: false },
          { name: '借款', isDefault: false },
          { name: '其他', isDefault: false },
        ],
        type: 'enum',
      },
    ],
    schemas: [
      {
        name: 'No.01',
        orders: [
          '招股说明书名称',
          '释义',
          '发行人-公司名称',
          '发行人-法定代表人姓名',
          '发行人-统一社会信用代码',
          '发行人-组织机构代码',
          '发行人-成立日期',
          '发行人-注册资本',
          '发行人-注册地址',
          '发行人-办公地址',
          '发行人-电话',
          '发行人-传真号码',
          '发行人-电子邮箱',
          '发行人-邮政编码',
          '控股股东-法人',
          '控股股东-自然人',
          '控股股东-其他',
          '实际控制人-国有控股主体',
          '实际控制人-自然人',
          '实际控制人-其他',
          '董事基本情况',
          '监事基本情况',
          '高管基本情况',
          '核心技术人员基本情况',
          '合并资产负债表-报表日期',
          '合并资产负债表-货币单位',
          '合并资产负债表',
          '合并利润表-报表日期',
          '合并利润表-货币单位',
          '合并利润表',
          '合并现金流量表-报表日期',
          '合并现金流量表-货币单位',
          '合并现金流量表',
          '主要财务指标',
          '重大诉讼事项',
          '募集资金与运用',
          '专利',
          '主要客户',
          '主要供应商',
          '重大合同',
          '发行人所处行业',
          '盈利能力-收入-产品构成-报表日期',
          '盈利能力-收入-产品构成-货币单位',
          '盈利能力-收入-产品构成',
          '盈利能力-收入-业务构成-报表日期',
          '盈利能力-收入-业务构成-货币单位',
          '盈利能力-收入-业务构成',
          '盈利能力-成本-产品构成-报表日期',
          '盈利能力-成本-产品构成-货币单位',
          '盈利能力-成本-产品构成',
          '盈利能力-成本-业务构成-报表日期',
          '盈利能力-成本-业务构成-货币单位',
          '盈利能力-成本-业务构成',
        ],
        schema: {
          招股说明书名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '招股说明书名称',
            _index: 4343,
          },
          释义: {
            type: '文本',
            required: false,
            multi: true,
            name: '释义',
            _index: 4344,
          },
          '发行人-公司名称': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-公司名称',
            _index: 4345,
          },
          '发行人-法定代表人姓名': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-法定代表人姓名',
            _index: 4346,
          },
          '发行人-统一社会信用代码': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-统一社会信用代码',
            _index: 4347,
          },
          '发行人-组织机构代码': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-组织机构代码',
            _index: 4348,
          },
          '发行人-成立日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '发行人-成立日期',
            _index: 4349,
          },
          '发行人-注册资本': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-注册资本',
            _index: 4350,
          },
          '发行人-注册地址': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-注册地址',
            _index: 4351,
          },
          '发行人-办公地址': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-办公地址',
            _index: 4352,
          },
          '发行人-电话': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-电话',
            _index: 4353,
          },
          '发行人-传真号码': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-传真号码',
            _index: 4354,
          },
          '发行人-电子邮箱': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-电子邮箱',
            _index: 4355,
          },
          '发行人-邮政编码': {
            type: '文本',
            required: false,
            multi: true,
            name: '发行人-邮政编码',
            _index: 4356,
          },
          '控股股东-法人': {
            type: '控股股东-法人',
            required: false,
            multi: true,
            name: '控股股东-法人',
            _index: 4357,
          },
          '控股股东-自然人': {
            type: '控股股东-自然人',
            required: false,
            multi: true,
            name: '控股股东-自然人',
            _index: 4358,
          },
          '控股股东-其他': {
            type: '控股股东-其他',
            required: false,
            multi: true,
            name: '控股股东-其他',
            _index: 4359,
          },
          '实际控制人-国有控股主体': {
            type: '实际控制人-国有控股主体',
            required: false,
            multi: true,
            name: '实际控制人-国有控股主体',
            _index: 4360,
          },
          '实际控制人-自然人': {
            type: '实际控制人-自然人',
            required: false,
            multi: true,
            name: '实际控制人-自然人',
            _index: 4361,
          },
          '实际控制人-其他': {
            type: '实际控制人-其他',
            required: false,
            multi: true,
            name: '实际控制人-其他',
            _index: 4362,
          },
          董事基本情况: {
            type: '董事基本情况',
            required: false,
            multi: true,
            name: '董事基本情况',
            _index: 4363,
          },
          监事基本情况: {
            type: '监事基本情况',
            required: false,
            multi: true,
            name: '监事基本情况',
            _index: 4364,
          },
          高管基本情况: {
            type: '高管基本情况',
            required: false,
            multi: true,
            name: '高管基本情况',
            _index: 4365,
          },
          核心技术人员基本情况: {
            type: '核心技术人员基本情况',
            required: false,
            multi: true,
            name: '核心技术人员基本情况',
            _index: 4366,
          },
          '合并资产负债表-报表日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '合并资产负债表-报表日期',
            _index: 4367,
          },
          '合并资产负债表-货币单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '合并资产负债表-货币单位',
            _index: 4368,
          },
          合并资产负债表: {
            type: '文本',
            required: false,
            multi: true,
            name: '合并资产负债表',
            _index: 4369,
          },
          '合并利润表-报表日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '合并利润表-报表日期',
            _index: 4370,
          },
          '合并利润表-货币单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '合并利润表-货币单位',
            _index: 4371,
          },
          合并利润表: {
            type: '文本',
            required: false,
            multi: true,
            name: '合并利润表',
            _index: 4372,
          },
          '合并现金流量表-报表日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '合并现金流量表-报表日期',
            _index: 4373,
          },
          '合并现金流量表-货币单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '合并现金流量表-货币单位',
            _index: 4374,
          },
          合并现金流量表: {
            type: '文本',
            required: false,
            multi: true,
            name: '合并现金流量表',
            _index: 4375,
          },
          主要财务指标: {
            type: '主要财务指标',
            required: false,
            multi: true,
            name: '主要财务指标',
            _index: 4376,
          },
          重大诉讼事项: {
            type: '重大诉讼事项',
            required: false,
            multi: true,
            name: '重大诉讼事项',
            _index: 4377,
          },
          募集资金与运用: {
            type: '募集资金与运用',
            required: false,
            multi: true,
            name: '募集资金与运用',
            _index: 4378,
          },
          专利: {
            type: '专利',
            required: false,
            multi: true,
            name: '专利',
            _index: 4379,
          },
          主要客户: {
            type: '主要客户',
            required: false,
            multi: true,
            name: '主要客户',
            _index: 4380,
          },
          主要供应商: {
            type: '主要供应商',
            required: false,
            multi: true,
            name: '主要供应商',
            _index: 4381,
          },
          重大合同: {
            type: '重大合同',
            required: false,
            multi: true,
            name: '重大合同',
            _index: 4382,
          },
          发行人所处行业: {
            type: '发行人所处行业',
            required: false,
            multi: true,
            name: '发行人所处行业',
            _index: 4383,
          },
          '盈利能力-收入-产品构成-报表日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '盈利能力-收入-产品构成-报表日期',
            _index: 4384,
          },
          '盈利能力-收入-产品构成-货币单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '盈利能力-收入-产品构成-货币单位',
            _index: 4385,
          },
          '盈利能力-收入-产品构成': {
            type: '盈利能力-主营业务收入按产品构成分析',
            required: false,
            multi: true,
            name: '盈利能力-收入-产品构成',
            _index: 4386,
          },
          '盈利能力-收入-业务构成-报表日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '盈利能力-收入-业务构成-报表日期',
            _index: 4387,
          },
          '盈利能力-收入-业务构成-货币单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '盈利能力-收入-业务构成-货币单位',
            _index: 4388,
          },
          '盈利能力-收入-业务构成': {
            type: '盈利能力-主营业务收入按业务构成分析',
            required: false,
            multi: true,
            name: '盈利能力-收入-业务构成',
            _index: 4389,
          },
          '盈利能力-成本-产品构成-报表日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '盈利能力-成本-产品构成-报表日期',
            _index: 4390,
          },
          '盈利能力-成本-产品构成-货币单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '盈利能力-成本-产品构成-货币单位',
            _index: 4391,
          },
          '盈利能力-成本-产品构成': {
            type: '盈利能力-主营业务成本按产品构成分析',
            required: false,
            multi: true,
            name: '盈利能力-成本-产品构成',
            _index: 4392,
          },
          '盈利能力-成本-业务构成-报表日期': {
            type: '日期',
            required: false,
            multi: true,
            name: '盈利能力-成本-业务构成-报表日期',
            _index: 4393,
          },
          '盈利能力-成本-业务构成-货币单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '盈利能力-成本-业务构成-货币单位',
            _index: 4394,
          },
          '盈利能力-成本-业务构成': {
            type: '盈利能力-主营业务成本按业务构成分析',
            required: false,
            multi: true,
            name: '盈利能力-成本-业务构成',
            _index: 4395,
          },
        },
      },
      { name: '其他', orders: [], schema: {} },
      {
        name: '控股股东-法人',
        orders: ['名称', '企业性质', '直接持股比例', '间接持股比例'],
        schema: {
          名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '名称',
            _index: 4398,
          },
          企业性质: {
            type: '文本',
            required: false,
            multi: true,
            name: '企业性质',
            _index: 4399,
          },
          直接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '直接持股比例',
            _index: 4400,
          },
          间接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '间接持股比例',
            _index: 4401,
          },
        },
      },
      {
        name: '控股股东-自然人',
        orders: ['姓名', '身份证号', '国籍', '直接持股比例', '间接持股比例'],
        schema: {
          姓名: {
            type: '文本',
            required: false,
            multi: true,
            name: '姓名',
            _index: 4403,
          },
          身份证号: {
            type: '文本',
            required: false,
            multi: true,
            name: '身份证号',
            _index: 4404,
          },
          国籍: {
            type: '文本',
            required: false,
            multi: true,
            name: '国籍',
            _index: 4405,
          },
          直接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '直接持股比例',
            _index: 4406,
          },
          间接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '间接持股比例',
            _index: 4407,
          },
        },
      },
      {
        name: '控股股东-其他',
        orders: ['名称', '性质', '直接持股比例', '间接持股比例'],
        schema: {
          名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '名称',
            _index: 4409,
          },
          性质: {
            type: '文本',
            required: false,
            multi: true,
            name: '性质',
            _index: 4410,
          },
          直接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '直接持股比例',
            _index: 4411,
          },
          间接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '间接持股比例',
            _index: 4412,
          },
        },
      },
      {
        name: '实际控制人-国有控股主体',
        orders: ['名称', '单位负责人', '直接持股比例', '间接持股比例'],
        schema: {
          名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '名称',
            _index: 4414,
          },
          单位负责人: {
            type: '文本',
            required: false,
            multi: true,
            name: '单位负责人',
            _index: 4415,
          },
          直接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '直接持股比例',
            _index: 4416,
          },
          间接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '间接持股比例',
            _index: 4417,
          },
        },
      },
      {
        name: '实际控制人-自然人',
        orders: ['姓名', '身份证号', '国籍', '直接持股比例', '间接持股比例'],
        schema: {
          姓名: {
            type: '文本',
            required: false,
            multi: true,
            name: '姓名',
            _index: 4419,
          },
          身份证号: {
            type: '文本',
            required: false,
            multi: true,
            name: '身份证号',
            _index: 4420,
          },
          国籍: {
            type: '文本',
            required: false,
            multi: true,
            name: '国籍',
            _index: 4421,
          },
          直接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '直接持股比例',
            _index: 4422,
          },
          间接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '间接持股比例',
            _index: 4423,
          },
        },
      },
      {
        name: '实际控制人-其他',
        orders: [
          '名称',
          '性质',
          '直接持股比例',
          '间接持股比例',
          '其中：质押股份数量',
        ],
        schema: {
          名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '名称',
            _index: 4425,
          },
          性质: {
            type: '文本',
            required: false,
            multi: true,
            name: '性质',
            _index: 4426,
          },
          直接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '直接持股比例',
            _index: 4427,
          },
          间接持股比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '间接持股比例',
            _index: 4428,
          },
          '其中：质押股份数量': {
            type: '数字',
            required: false,
            multi: true,
            name: '其中：质押股份数量',
            _index: 4429,
          },
        },
      },
      {
        name: '董事基本情况',
        orders: [
          '姓名',
          '国籍',
          '境外居留权',
          '性别',
          '出生年月',
          '学历',
          '职称',
          '现任职务',
          '起始日期',
          '终止日期',
          '是否已有简历',
        ],
        schema: {
          姓名: {
            type: '文本',
            required: false,
            multi: true,
            name: '姓名',
            _index: 4431,
          },
          国籍: {
            type: '文本',
            required: false,
            multi: true,
            name: '国籍',
            _index: 4432,
          },
          境外居留权: {
            type: '文本',
            required: false,
            multi: true,
            name: '境外居留权',
            _index: 4433,
          },
          性别: {
            type: '文本',
            required: false,
            multi: true,
            name: '性别',
            _index: 4434,
          },
          出生年月: {
            type: '日期',
            required: false,
            multi: true,
            name: '出生年月',
            _index: 4435,
          },
          学历: {
            type: '文本',
            required: false,
            multi: true,
            name: '学历',
            _index: 4436,
          },
          职称: {
            type: '文本',
            required: false,
            multi: true,
            name: '职称',
            _index: 4437,
          },
          现任职务: {
            type: '文本',
            required: false,
            multi: true,
            name: '现任职务',
            _index: 4438,
          },
          起始日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '起始日期',
            _index: 4439,
          },
          终止日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '终止日期',
            _index: 4440,
          },
          是否已有简历: {
            type: '是否已有简历',
            required: false,
            multi: true,
            name: '是否已有简历',
            _index: 4441,
          },
        },
      },
      {
        name: '监事基本情况',
        orders: [
          '姓名',
          '国籍',
          '境外居留权',
          '性别',
          '出生年月',
          '学历',
          '职称',
          '现任职务',
          '起始日期',
          '终止日期',
          '是否已有简历',
        ],
        schema: {
          姓名: {
            type: '文本',
            required: false,
            multi: true,
            name: '姓名',
            _index: 4443,
          },
          国籍: {
            type: '文本',
            required: false,
            multi: true,
            name: '国籍',
            _index: 4444,
          },
          境外居留权: {
            type: '文本',
            required: false,
            multi: true,
            name: '境外居留权',
            _index: 4445,
          },
          性别: {
            type: '文本',
            required: false,
            multi: true,
            name: '性别',
            _index: 4446,
          },
          出生年月: {
            type: '日期',
            required: false,
            multi: true,
            name: '出生年月',
            _index: 4447,
          },
          学历: {
            type: '文本',
            required: false,
            multi: true,
            name: '学历',
            _index: 4448,
          },
          职称: {
            type: '文本',
            required: false,
            multi: true,
            name: '职称',
            _index: 4449,
          },
          现任职务: {
            type: '文本',
            required: false,
            multi: true,
            name: '现任职务',
            _index: 4450,
          },
          起始日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '起始日期',
            _index: 4451,
          },
          终止日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '终止日期',
            _index: 4452,
          },
          是否已有简历: {
            type: '是否已有简历',
            required: false,
            multi: true,
            name: '是否已有简历',
            _index: 4453,
          },
        },
      },
      {
        name: '高管基本情况',
        orders: [
          '姓名',
          '国籍',
          '境外居留权',
          '性别',
          '出生年月',
          '学历',
          '职称',
          '现任职务',
          '起始日期',
          '终止日期',
          '是否已有简历',
        ],
        schema: {
          姓名: {
            type: '文本',
            required: false,
            multi: true,
            name: '姓名',
            _index: 4455,
          },
          国籍: {
            type: '文本',
            required: false,
            multi: true,
            name: '国籍',
            _index: 4456,
          },
          境外居留权: {
            type: '文本',
            required: false,
            multi: true,
            name: '境外居留权',
            _index: 4457,
          },
          性别: {
            type: '文本',
            required: false,
            multi: true,
            name: '性别',
            _index: 4458,
          },
          出生年月: {
            type: '日期',
            required: false,
            multi: true,
            name: '出生年月',
            _index: 4459,
          },
          学历: {
            type: '文本',
            required: false,
            multi: true,
            name: '学历',
            _index: 4460,
          },
          职称: {
            type: '文本',
            required: false,
            multi: true,
            name: '职称',
            _index: 4461,
          },
          现任职务: {
            type: '文本',
            required: false,
            multi: true,
            name: '现任职务',
            _index: 4462,
          },
          起始日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '起始日期',
            _index: 4463,
          },
          终止日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '终止日期',
            _index: 4464,
          },
          是否已有简历: {
            type: '是否已有简历',
            required: false,
            multi: true,
            name: '是否已有简历',
            _index: 4465,
          },
        },
      },
      {
        name: '核心技术人员基本情况',
        orders: [
          '姓名',
          '国籍',
          '境外居留权',
          '性别',
          '出生年月',
          '学历',
          '职称',
          '现任职务',
          '起始日期',
          '终止日期',
          '是否已有简历',
        ],
        schema: {
          姓名: {
            type: '文本',
            required: false,
            multi: true,
            name: '姓名',
            _index: 4467,
          },
          国籍: {
            type: '文本',
            required: false,
            multi: true,
            name: '国籍',
            _index: 4468,
          },
          境外居留权: {
            type: '文本',
            required: false,
            multi: true,
            name: '境外居留权',
            _index: 4469,
          },
          性别: {
            type: '文本',
            required: false,
            multi: true,
            name: '性别',
            _index: 4470,
          },
          出生年月: {
            type: '日期',
            required: false,
            multi: true,
            name: '出生年月',
            _index: 4471,
          },
          学历: {
            type: '文本',
            required: false,
            multi: true,
            name: '学历',
            _index: 4472,
          },
          职称: {
            type: '文本',
            required: false,
            multi: true,
            name: '职称',
            _index: 4473,
          },
          现任职务: {
            type: '文本',
            required: false,
            multi: true,
            name: '现任职务',
            _index: 4474,
          },
          起始日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '起始日期',
            _index: 4475,
          },
          终止日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '终止日期',
            _index: 4476,
          },
          是否已有简历: {
            type: '是否已有简历',
            required: false,
            multi: true,
            name: '是否已有简历',
            _index: 4477,
          },
        },
      },
      { name: 'text', orders: [], schema: {} },
      {
        name: '重大诉讼事项',
        orders: [
          '有/无重大诉讼事项',
          '事项',
          '起诉(申请)方',
          '应诉(被申请)方',
          '承担连带责任方',
          '诉讼仲裁类型',
          '诉讼涉及金额',
          '预计负债金额',
        ],
        schema: {
          '有/无重大诉讼事项': {
            type: '有/无重大诉讼事项',
            required: false,
            multi: true,
            name: '有/无重大诉讼事项',
            _index: 4480,
          },
          事项: {
            type: '文本',
            required: false,
            multi: true,
            name: '事项',
            _index: 4481,
          },
          '起诉(申请)方': {
            type: '文本',
            required: false,
            multi: true,
            name: '起诉(申请)方',
            _index: 4482,
          },
          '应诉(被申请)方': {
            type: '文本',
            required: false,
            multi: true,
            name: '应诉(被申请)方',
            _index: 4483,
          },
          承担连带责任方: {
            type: '文本',
            required: false,
            multi: true,
            name: '承担连带责任方',
            _index: 4484,
          },
          诉讼仲裁类型: {
            type: '文本',
            required: false,
            multi: true,
            name: '诉讼仲裁类型',
            _index: 4485,
          },
          诉讼涉及金额: {
            type: '数字',
            required: false,
            multi: true,
            name: '诉讼涉及金额',
            _index: 4486,
          },
          预计负债金额: {
            type: '数字',
            required: false,
            multi: true,
            name: '预计负债金额',
            _index: 4487,
          },
        },
      },
      {
        name: '募集资金与运用',
        orders: [
          '货币单位',
          '项目名称',
          '投资总额',
          '募集资金投资额',
          '募集资金投向',
        ],
        schema: {
          货币单位: {
            type: '文本',
            required: false,
            multi: true,
            name: '货币单位',
            _index: 4489,
          },
          项目名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '项目名称',
            _index: 4490,
          },
          投资总额: {
            type: '数字',
            required: false,
            multi: true,
            name: '投资总额',
            _index: 4491,
          },
          募集资金投资额: {
            type: '数字',
            required: false,
            multi: true,
            name: '募集资金投资额',
            _index: 4492,
          },
          募集资金投向: {
            type: '文本',
            required: false,
            multi: true,
            name: '募集资金投向',
            _index: 4493,
          },
        },
      },
      {
        name: '专利',
        orders: [
          '专利类型',
          '专利名称',
          '专利号',
          '专利权人',
          '取得成本',
          '最近一期末账面价值',
          '取得日期',
          '使用期限',
          '是否存在权属纠纷',
        ],
        schema: {
          专利类型: {
            type: '文本',
            required: false,
            multi: true,
            name: '专利类型',
            _index: 4495,
          },
          专利名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '专利名称',
            _index: 4496,
          },
          专利号: {
            type: '文本',
            required: false,
            multi: true,
            name: '专利号',
            _index: 4497,
          },
          专利权人: {
            type: '文本',
            required: false,
            multi: true,
            name: '专利权人',
            _index: 4498,
          },
          取得成本: {
            type: '数字',
            required: false,
            multi: true,
            name: '取得成本',
            _index: 4499,
          },
          最近一期末账面价值: {
            type: '数字',
            required: false,
            multi: true,
            name: '最近一期末账面价值',
            _index: 4500,
          },
          取得日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '取得日期',
            _index: 4501,
          },
          使用期限: {
            type: '文本',
            required: false,
            multi: true,
            name: '使用期限',
            _index: 4502,
          },
          是否存在权属纠纷: {
            type: '文本',
            required: false,
            multi: true,
            name: '是否存在权属纠纷',
            _index: 4503,
          },
        },
      },
      {
        name: '主要客户',
        orders: [
          '时间',
          '货币单位',
          '客户名称',
          '下属单位名称',
          '销售额',
          '占主营收入比例',
          '占营业收入比例',
        ],
        schema: {
          时间: {
            type: '日期',
            required: false,
            multi: true,
            name: '时间',
            _index: 4505,
          },
          货币单位: {
            type: '文本',
            required: false,
            multi: true,
            name: '货币单位',
            _index: 4506,
          },
          客户名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '客户名称',
            _index: 4507,
          },
          下属单位名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '下属单位名称',
            _index: 4508,
          },
          销售额: {
            type: '数字',
            required: false,
            multi: true,
            name: '销售额',
            _index: 4509,
          },
          占主营收入比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '占主营收入比例',
            _index: 4510,
          },
          占营业收入比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '占营业收入比例',
            _index: 4511,
          },
        },
      },
      {
        name: '主要供应商',
        orders: [
          '时间',
          '货币单位',
          '供应商名称',
          '采购内容',
          '采购额',
          '占总采购金额比例',
        ],
        schema: {
          时间: {
            type: '日期',
            required: false,
            multi: true,
            name: '时间',
            _index: 4513,
          },
          货币单位: {
            type: '文本',
            required: false,
            multi: true,
            name: '货币单位',
            _index: 4514,
          },
          供应商名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '供应商名称',
            _index: 4515,
          },
          采购内容: {
            type: '文本',
            required: false,
            multi: true,
            name: '采购内容',
            _index: 4516,
          },
          采购额: {
            type: '数字',
            required: false,
            multi: true,
            name: '采购额',
            _index: 4517,
          },
          占总采购金额比例: {
            type: '数字',
            required: false,
            multi: true,
            name: '占总采购金额比例',
            _index: 4518,
          },
        },
      },
      {
        name: '重大合同',
        orders: [
          '货币单位',
          '合同类型',
          '合同对手方名称',
          '标的',
          '合同金额',
          '需要计算的合同金额',
          '已履行金额',
          '履行期限',
          '备注',
        ],
        schema: {
          货币单位: {
            type: '文本',
            required: false,
            multi: true,
            name: '货币单位',
            _index: 4520,
          },
          合同类型: {
            type: '合同类型',
            required: false,
            multi: true,
            name: '合同类型',
            _index: 4521,
          },
          合同对手方名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '合同对手方名称',
            _index: 4522,
          },
          标的: {
            type: '文本',
            required: false,
            multi: true,
            name: '标的',
            _index: 4523,
          },
          合同金额: {
            type: '数字',
            required: false,
            multi: true,
            name: '合同金额',
            _index: 4524,
          },
          需要计算的合同金额: {
            type: '文本',
            required: false,
            multi: true,
            name: '需要计算的合同金额',
            _index: 4525,
          },
          已履行金额: {
            type: '数字',
            required: false,
            multi: true,
            name: '已履行金额',
            _index: 4526,
          },
          履行期限: {
            type: '日期',
            required: false,
            multi: true,
            name: '履行期限',
            _index: 4527,
          },
          备注: {
            type: '文本',
            required: false,
            multi: true,
            name: '备注',
            _index: 4528,
          },
        },
      },
      {
        name: '发行人所处行业',
        orders: ['行业分类标准', '行业分类代码', '行业分类名称'],
        schema: {
          行业分类标准: {
            type: '文本',
            required: false,
            multi: true,
            name: '行业分类标准',
            _index: 4530,
          },
          行业分类代码: {
            type: '文本',
            required: false,
            multi: true,
            name: '行业分类代码',
            _index: 4531,
          },
          行业分类名称: {
            type: '文本',
            required: false,
            multi: true,
            name: '行业分类名称',
            _index: 4532,
          },
        },
      },
      {
        name: '盈利能力-主营业务收入按产品构成分析',
        orders: [
          '产品类别',
          '金额(T-2年)',
          '金额(T-1年)',
          '金额(T年)',
          '金额(最近一期）',
          '占比(T-2年)',
          '占比(T-1年)',
          '占比(T年)',
          '占比(最近一期）',
          '变动比例(T-2年)',
          '变动比例(T-1年)',
          '变动比例(T年)',
          '变动比例(最近一期）',
        ],
        schema: {
          产品类别: {
            type: '文本',
            required: false,
            multi: true,
            name: '产品类别',
            _index: 4534,
          },
          '金额(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-2年)',
            _index: 4535,
          },
          '金额(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-1年)',
            _index: 4536,
          },
          '金额(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T年)',
            _index: 4537,
          },
          '金额(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(最近一期）',
            _index: 4538,
          },
          '占比(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-2年)',
            _index: 4539,
          },
          '占比(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-1年)',
            _index: 4540,
          },
          '占比(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T年)',
            _index: 4541,
          },
          '占比(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(最近一期）',
            _index: 4542,
          },
          '变动比例(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-2年)',
            _index: 4543,
          },
          '变动比例(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-1年)',
            _index: 4544,
          },
          '变动比例(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T年)',
            _index: 4545,
          },
          '变动比例(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(最近一期）',
            _index: 4546,
          },
        },
      },
      {
        name: '盈利能力-主营业务收入按业务构成分析',
        orders: [
          '业务类别',
          '金额(T-2年)',
          '金额(T-1年)',
          '金额(T年)',
          '金额(最近一期）',
          '占比(T-2年)',
          '占比(T-1年)',
          '占比(T年)',
          '占比(最近一期）',
          '变动比例(T-2年)',
          '变动比例(T-1年)',
          '变动比例(T年)',
          '变动比例(最近一期）',
        ],
        schema: {
          业务类别: {
            type: '文本',
            required: false,
            multi: true,
            name: '业务类别',
            _index: 4548,
          },
          '金额(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-2年)',
            _index: 4549,
          },
          '金额(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-1年)',
            _index: 4550,
          },
          '金额(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T年)',
            _index: 4551,
          },
          '金额(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(最近一期）',
            _index: 4552,
          },
          '占比(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-2年)',
            _index: 4553,
          },
          '占比(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-1年)',
            _index: 4554,
          },
          '占比(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T年)',
            _index: 4555,
          },
          '占比(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(最近一期）',
            _index: 4556,
          },
          '变动比例(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-2年)',
            _index: 4557,
          },
          '变动比例(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-1年)',
            _index: 4558,
          },
          '变动比例(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T年)',
            _index: 4559,
          },
          '变动比例(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(最近一期）',
            _index: 4560,
          },
        },
      },
      {
        name: '盈利能力-主营业务成本按产品构成分析',
        orders: [
          '产品类别',
          '金额(T-2年)',
          '金额(T-1年)',
          '金额(T年)',
          '金额(最近一期）',
          '占比(T-2年)',
          '占比(T-1年)',
          '占比(T年)',
          '占比(最近一期）',
          '变动比例(T-2年)',
          '变动比例(T-1年)',
          '变动比例(T年)',
          '变动比例(最近一期）',
        ],
        schema: {
          产品类别: {
            type: '文本',
            required: false,
            multi: true,
            name: '产品类别',
            _index: 4562,
          },
          '金额(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-2年)',
            _index: 4563,
          },
          '金额(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-1年)',
            _index: 4564,
          },
          '金额(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T年)',
            _index: 4565,
          },
          '金额(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(最近一期）',
            _index: 4566,
          },
          '占比(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-2年)',
            _index: 4567,
          },
          '占比(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-1年)',
            _index: 4568,
          },
          '占比(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T年)',
            _index: 4569,
          },
          '占比(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(最近一期）',
            _index: 4570,
          },
          '变动比例(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-2年)',
            _index: 4571,
          },
          '变动比例(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-1年)',
            _index: 4572,
          },
          '变动比例(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T年)',
            _index: 4573,
          },
          '变动比例(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(最近一期）',
            _index: 4574,
          },
        },
      },
      {
        name: '盈利能力-主营业务成本按业务构成分析',
        orders: [
          '业务类别',
          '金额(T-2年)',
          '金额(T-1年)',
          '金额(T年)',
          '金额(最近一期）',
          '占比(T-2年)',
          '占比(T-1年)',
          '占比(T年)',
          '占比(最近一期）',
          '变动比例(T-2年)',
          '变动比例(T-1年)',
          '变动比例(T年)',
          '变动比例(最近一期）',
        ],
        schema: {
          业务类别: {
            type: '文本',
            required: false,
            multi: true,
            name: '业务类别',
            _index: 4576,
          },
          '金额(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-2年)',
            _index: 4577,
          },
          '金额(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T-1年)',
            _index: 4578,
          },
          '金额(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(T年)',
            _index: 4579,
          },
          '金额(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '金额(最近一期）',
            _index: 4580,
          },
          '占比(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-2年)',
            _index: 4581,
          },
          '占比(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T-1年)',
            _index: 4582,
          },
          '占比(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(T年)',
            _index: 4583,
          },
          '占比(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '占比(最近一期）',
            _index: 4584,
          },
          '变动比例(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-2年)',
            _index: 4585,
          },
          '变动比例(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T-1年)',
            _index: 4586,
          },
          '变动比例(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(T年)',
            _index: 4587,
          },
          '变动比例(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '变动比例(最近一期）',
            _index: 4588,
          },
        },
      },
      {
        name: '主要财务指标',
        orders: [
          '报表日期',
          '流动比率(倍)(T-2年)',
          '流动比率(倍)(T-1年)',
          '流动比率(倍)(T年)',
          '流动比率(倍)(最近一期）',
          '速动比率(倍)(T-2年)',
          '速动比率(倍)(T-1年)',
          '速动比率(倍)(T年)',
          '速动比率(倍)(最近一期）',
          '资产负债率（合并）(T-2年)',
          '资产负债率（合并）(T-1年)',
          '资产负债率（合并）(T年)',
          '资产负债率（合并）(最近一期）',
          '资产负债率(母公司）(T-2年)',
          '资产负债率(母公司）(T-1年)',
          '资产负债率(母公司）(T年)',
          '资产负债率(母公司）(最近一期）',
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年)',
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年)',
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年)',
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）',
          '应收账款周转率(次/年)(T-2年)',
          '应收账款周转率(次/年)(T-1年)',
          '应收账款周转率(次/年)(T年)',
          '应收账款周转率(次/年)(最近一期）',
          '存货周转率(次/年)(T-2年)',
          '存货周转率(次/年)(T-1年)',
          '存货周转率(次/年)(T年)',
          '存货周转率(次/年)(最近一期）',
          '总资产周转率(次/年)(T-2年)',
          '总资产周转率(次/年)(T-1年)',
          '总资产周转率(次/年)(T年)',
          '总资产周转率(次/年)(最近一期）',
          '息税折旧摊销前利润-单位',
          '息税折旧摊销前利润(元)(T-2年)',
          '息税折旧摊销前利润(元)(T-1年)',
          '息税折旧摊销前利润(元)(T年)',
          '息税折旧摊销前利润(元)(最近一期）',
          '利息保障倍数(倍)(T-2年)',
          '利息保障倍数(倍)(T-1年)',
          '利息保障倍数(倍)(T年)',
          '利息保障倍数(倍)(最近一期）',
          '扣除非经常性损益后的每股基本收益-单位',
          '扣除非经常性损益后的每股基本收益（元）(T-2年)',
          '扣除非经常性损益后的每股基本收益（元）(T-1年)',
          '扣除非经常性损益后的每股基本收益（元）(T年)',
          '扣除非经常性损益后的每股基本收益（元）(最近一期）',
          '每股经营活动产生的现金流量-单位',
          '每股经营活动产生的现金流量(元)(T-2年)',
          '每股经营活动产生的现金流量(元)(T-1年)',
          '每股经营活动产生的现金流量(元)(T年)',
          '每股经营活动产生的现金流量(元)(最近一期）',
          '每股净现金流量-单位',
          '每股净现金流量(元)(T-2年)',
          '每股净现金流量(元)(T-1年)',
          '每股净现金流量(元)(T年)',
          '每股净现金流量(元)(最近一期）',
          '加权平均净资产收益率(T-2年)',
          '加权平均净资产收益率(T-1年)',
          '加权平均净资产收益率(T年)',
          '加权平均净资产收益率(最近一期）',
        ],
        schema: {
          报表日期: {
            type: '日期',
            required: false,
            multi: true,
            name: '报表日期',
            _index: 4590,
          },
          '流动比率(倍)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '流动比率(倍)(T-2年)',
            _index: 4591,
          },
          '流动比率(倍)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '流动比率(倍)(T-1年)',
            _index: 4592,
          },
          '流动比率(倍)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '流动比率(倍)(T年)',
            _index: 4593,
          },
          '流动比率(倍)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '流动比率(倍)(最近一期）',
            _index: 4594,
          },
          '速动比率(倍)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '速动比率(倍)(T-2年)',
            _index: 4595,
          },
          '速动比率(倍)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '速动比率(倍)(T-1年)',
            _index: 4596,
          },
          '速动比率(倍)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '速动比率(倍)(T年)',
            _index: 4597,
          },
          '速动比率(倍)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '速动比率(倍)(最近一期）',
            _index: 4598,
          },
          '资产负债率（合并）(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率（合并）(T-2年)',
            _index: 4599,
          },
          '资产负债率（合并）(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率（合并）(T-1年)',
            _index: 4600,
          },
          '资产负债率（合并）(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率（合并）(T年)',
            _index: 4601,
          },
          '资产负债率（合并）(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率（合并）(最近一期）',
            _index: 4602,
          },
          '资产负债率(母公司）(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率(母公司）(T-2年)',
            _index: 4603,
          },
          '资产负债率(母公司）(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率(母公司）(T-1年)',
            _index: 4604,
          },
          '资产负债率(母公司）(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率(母公司）(T年)',
            _index: 4605,
          },
          '资产负债率(母公司）(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '资产负债率(母公司）(最近一期）',
            _index: 4606,
          },
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-2年)',
            _index: 4607,
          },
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T-1年)',
            _index: 4608,
          },
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(T年)',
            _index: 4609,
          },
          '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name:
              '无形资产（扣除土地使用权、水面养殖权和采矿权等后）占净资产的比例（%）(最近一期）',
            _index: 4610,
          },
          '应收账款周转率(次/年)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '应收账款周转率(次/年)(T-2年)',
            _index: 4611,
          },
          '应收账款周转率(次/年)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '应收账款周转率(次/年)(T-1年)',
            _index: 4612,
          },
          '应收账款周转率(次/年)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '应收账款周转率(次/年)(T年)',
            _index: 4613,
          },
          '应收账款周转率(次/年)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '应收账款周转率(次/年)(最近一期）',
            _index: 4614,
          },
          '存货周转率(次/年)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '存货周转率(次/年)(T-2年)',
            _index: 4615,
          },
          '存货周转率(次/年)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '存货周转率(次/年)(T-1年)',
            _index: 4616,
          },
          '存货周转率(次/年)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '存货周转率(次/年)(T年)',
            _index: 4617,
          },
          '存货周转率(次/年)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '存货周转率(次/年)(最近一期）',
            _index: 4618,
          },
          '总资产周转率(次/年)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '总资产周转率(次/年)(T-2年)',
            _index: 4619,
          },
          '总资产周转率(次/年)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '总资产周转率(次/年)(T-1年)',
            _index: 4620,
          },
          '总资产周转率(次/年)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '总资产周转率(次/年)(T年)',
            _index: 4621,
          },
          '总资产周转率(次/年)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '总资产周转率(次/年)(最近一期）',
            _index: 4622,
          },
          '息税折旧摊销前利润-单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '息税折旧摊销前利润-单位',
            _index: 4623,
          },
          '息税折旧摊销前利润(元)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '息税折旧摊销前利润(元)(T-2年)',
            _index: 4624,
          },
          '息税折旧摊销前利润(元)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '息税折旧摊销前利润(元)(T-1年)',
            _index: 4625,
          },
          '息税折旧摊销前利润(元)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '息税折旧摊销前利润(元)(T年)',
            _index: 4626,
          },
          '息税折旧摊销前利润(元)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '息税折旧摊销前利润(元)(最近一期）',
            _index: 4627,
          },
          '利息保障倍数(倍)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '利息保障倍数(倍)(T-2年)',
            _index: 4628,
          },
          '利息保障倍数(倍)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '利息保障倍数(倍)(T-1年)',
            _index: 4629,
          },
          '利息保障倍数(倍)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '利息保障倍数(倍)(T年)',
            _index: 4630,
          },
          '利息保障倍数(倍)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '利息保障倍数(倍)(最近一期）',
            _index: 4631,
          },
          '扣除非经常性损益后的每股基本收益-单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '扣除非经常性损益后的每股基本收益-单位',
            _index: 4632,
          },
          '扣除非经常性损益后的每股基本收益（元）(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '扣除非经常性损益后的每股基本收益（元）(T-2年)',
            _index: 4633,
          },
          '扣除非经常性损益后的每股基本收益（元）(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '扣除非经常性损益后的每股基本收益（元）(T-1年)',
            _index: 4634,
          },
          '扣除非经常性损益后的每股基本收益（元）(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '扣除非经常性损益后的每股基本收益（元）(T年)',
            _index: 4635,
          },
          '扣除非经常性损益后的每股基本收益（元）(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '扣除非经常性损益后的每股基本收益（元）(最近一期）',
            _index: 4636,
          },
          '每股经营活动产生的现金流量-单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '每股经营活动产生的现金流量-单位',
            _index: 4637,
          },
          '每股经营活动产生的现金流量(元)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股经营活动产生的现金流量(元)(T-2年)',
            _index: 4638,
          },
          '每股经营活动产生的现金流量(元)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股经营活动产生的现金流量(元)(T-1年)',
            _index: 4639,
          },
          '每股经营活动产生的现金流量(元)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股经营活动产生的现金流量(元)(T年)',
            _index: 4640,
          },
          '每股经营活动产生的现金流量(元)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股经营活动产生的现金流量(元)(最近一期）',
            _index: 4641,
          },
          '每股净现金流量-单位': {
            type: '文本',
            required: false,
            multi: true,
            name: '每股净现金流量-单位',
            _index: 4642,
          },
          '每股净现金流量(元)(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股净现金流量(元)(T-2年)',
            _index: 4643,
          },
          '每股净现金流量(元)(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股净现金流量(元)(T-1年)',
            _index: 4644,
          },
          '每股净现金流量(元)(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股净现金流量(元)(T年)',
            _index: 4645,
          },
          '每股净现金流量(元)(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '每股净现金流量(元)(最近一期）',
            _index: 4646,
          },
          '加权平均净资产收益率(T-2年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '加权平均净资产收益率(T-2年)',
            _index: 4647,
          },
          '加权平均净资产收益率(T-1年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '加权平均净资产收益率(T-1年)',
            _index: 4648,
          },
          '加权平均净资产收益率(T年)': {
            type: '数字',
            required: false,
            multi: true,
            name: '加权平均净资产收益率(T年)',
            _index: 4649,
          },
          '加权平均净资产收益率(最近一期）': {
            type: '数字',
            required: false,
            multi: true,
            name: '加权平均净资产收益率(最近一期）',
            _index: 4650,
          },
        },
      },
    ],
    version: '87fecdb59ecbb5de9326f6a8d6f40b91',
  },
};
