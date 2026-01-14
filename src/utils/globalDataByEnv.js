import i18n from '@/i18n';

const locale = import.meta.env.VITE_LANG === 'EN' ? 'en' : 'cn';
const t = i18n[locale];

const textData = {
  default: {
    project: {
      ID: t.message['ID'],
      名称: t.message['名称'],
      项目权限: '项目权限',
      新建项目: t.message['新建项目'],
      编辑项目: t.message['编辑项目'],
      项目新建成功: t.message['项目新建成功'],
      项目修改成功: t.message['项目修改成功'],
      项目删除成功: t.message['项目删除成功'],
      项目名称不能为空: t.message['项目名称不能为空'],
      '是否删除该项目?': t.message['是否删除该项目?'],
      '（提示：设为公共后，将不支持更改为私密项目）':
        '（提示：设为公共后，将不支持更改为私密项目）',
      Schema: t.message['Schema'],
      Schema名称: t.message['Schema名称'],
      请选择Schema: t.message['请选择Schema'],
      未找到匹配的Schema: t.message['未找到匹配的Schema'],
    },
    file: {
      ID: t.message['ID'],
      文件: t.message['文件'],
      项目: t.message['项目'],
      Schema: t.message['Schema'],
      请选择Schema: t.message['请选择Schema'],
      未找到匹配的Schema: t.message['未找到匹配的Schema'],
      Schema不能为空: 'Schema不能为空',
      总览: t.message['总览'],
      总文档: t.message['总文档'],
      在项目中查看: t.message['在项目中查看'],
      重新预测: t.message['重新预测'],
      批量预测: t.message['批量预测'],

      '确定要重新预测选中的文件吗？': t.message['确定要重新预测选中的文件吗？'],
    },
    fileExpand: {
      Schema名称: t.message['Schema名称'],
      修改时间: t.message['修改时间'],
    },
    schema: {
      Schema: t.message['Schema'],
      Schema树: t.message['Schema树'],
      Schema名称: t.message['Schema名称'],
      Schema别名: t.message['Schema别名'],
      Schema类型: t.message['Schema类型'],
      Schema字段: 'Schema字段',
      新增Schema: t.message['新增Schema'],
      编辑Schema: t.message['编辑Schema'],
      关联Schema: '关联Schema',
      模型管理: t.message['模型管理'],
      类型管理: t.message['类型管理'],
      ID: t.message['ID'],
      名称: t.message['名称'],
      Schema管理: t.menu['Schema管理'],
      请选择Schema: t.message['请选择Schema'],
      未找到匹配的Schema: t.message['未找到匹配的Schema'],
      'Schema 新增成功': t.message['Schema 新增成功'],
      'Schema 修改成功': t.message['Schema 修改成功'],
      'Schema 删除成功': t.message['Schema 删除成功'],
      Schema暂无具体字段: t.message['Schema暂无具体字段'],
      '尚未选择Schema节点，请勿标注': t.message['尚未选择Schema节点，请勿标注'],
      '当前schema为组合类型，请勿直接标注':
        t.message['当前schema为组合类型，请勿直接标注'],
      '不选择范围，将引用该schema的所有文件标注答案进行训练':
        t.message['不选择范围，将引用该schema的所有文件标注答案进行训练'],
    },
  },
  CMFCHINA: {
    project: {
      Schema: '场景',
      请选择Schema: '请选择场景',
      未找到匹配的Schema: '未找到匹配的场景',
    },
    file: {
      Schema: '场景',
      请选择Schema: '请选择场景',
      未找到匹配的Schema: '未找到匹配的场景',
      批量预测: '批量预测和审核',
      '确定要重新预测选中的文件吗？': '确定要重新预测和审核选中的文件吗？',
    },
    schema: {
      Schema: '场景',
      Schema树: '场景要素',
      Schema名称: '场景名称',
      Schema别名: '场景别名',
      Schema类型: '场景类型',
      Schema字段: '场景字段',
      新增Schema: '新增场景',
      编辑Schema: '编辑场景',
      关联Schema: '关联场景',
      Schema管理: '场景管理',
      请选择Schema: '请选择场景',
      未找到匹配的Schema: '未找到匹配的场景',
      'Schema 新增成功': '场景新增成功',
      'Schema 修改成功': '场景修改成功',
      'Schema 删除成功': '场景删除成功',
      Schema暂无具体字段: '场景暂无具体字段',
      '尚未选择Schema节点，请勿标注': '尚未选择场景节点，请勿标注',
      '当前schema为组合类型，请勿直接标注':
        '当前场景节点为组合类型，请勿直接标注',
      模型管理: '模型路由',
    },
  },
  NAFMII: {
    project: {
      ID: '识别文件集ID',
      名称: '识别文件集名称',
      项目权限: '识别文件集权限',
      新建项目: '新建识别文件集',
      编辑项目: '编辑识别文件集',
      项目新建成功: '识别文件集新建成功',
      项目修改成功: '识别文件集修改成功',
      项目删除成功: '识别文件集删除成功',
      项目名称不能为空: '识别文件集名称不能为空',
      '是否删除该项目?': '是否删除该识别文件集?',
      '（提示：设为公共后，将不支持更改为私密项目）':
        '注：识别文件集权限公开后无法更改为私密',
      Schema: '关联算法模型',
      Schema名称: '关联算法模型',
      请选择Schema: '请选择关联算法模型',
      未找到匹配的Schema: '未找到匹配的关联算法模型',
    },
    file: {
      ID: '任务ID',
      文件: '文件名称',
      项目: '所有任务',
      Schema: '文件类型',
      请选择Schema: '请选择文件类型',
      未找到匹配的Schema: '未找到匹配的文件类型',
      Schema不能为空: '文件类型不能为空',
      总览: '识别文件管理',
      总文档: '总文件',
      在项目中查看: '在文件集查看',
      重新预测: '重新识别',
      批量预测: '批量识别',
      '确定要重新预测选中的文件吗？': '确定要重新识别选中的文件吗？',
    },
    fileExpand: {
      Schema名称: '关联算法模型',
      修改时间: '标注时间',
    },
    schema: {
      Schema: '算法模型',
      Schema树: '模型要素',
      Schema名称: '算法模型名称',
      Schema别名: '算法模型别名',
      Schema类型: '算法模型类型',
      Schema字段: '算法模型字段',
      新增Schema: '新建算法模型',
      编辑Schema: '编辑算法模型',
      Schema管理: '算法模型管理',
      请选择Schema: '请选择算法模型',
      未找到匹配的Schema: '未找到匹配的算法模型',
      'Schema 新增成功': '算法模型新增成功',
      'Schema 修改成功': '算法模型修改成功',
      'Schema 删除成功': '算法模型删除成功',
      模型管理: '模型版本',
      类型管理: '要素类型',
      ID: '算法模型ID',
      名称: '算法模型名称',
      Schema暂无具体字段: '算法模型暂无具体字段',
      '尚未选择Schema节点，请勿标注': '尚未选择算法模型节点，请勿标注',
      '当前schema为组合类型，请勿直接标注':
        '当前算法模型节点为组合类型，请勿直接标注',
      '不选择范围，将引用该schema的所有文件标注答案进行训练':
        '不选择范围，将引用该算法模型的所有文件标注答案进行训练',
    },
  },
};

const styleData = {
  default: {
    project: {
      idWidth: '100',
      nameWidth: '',
      schemaWidth: '',
      fileCountWidth: '',
      permissionWidth: '',
      commentWidth: '',
      timeWidth: '',
      popupLabelWidth: '70px',
    },
    file: {
      idWidth: '60',
      nameWidth: '',
      timeWidth: '',
      parseStatusWidth: '',
      popupLabelWidth: '',
    },
    schema: {
      idWidth: '80',
      nameWidth: '',
      timeWidth: '',
    },
    schemaType: {
      nameMinWidth: '',
      typeMinWidth: '',
      typeWidth: '180',
    },
    schemaModel: {
      fileCountWidth: '',
      precisionWidth: '',
    },
    rule: {},
    user: {},
  },
  CITICS_DCM: {
    schema: {
      idWidth: '150',
    },
  },
  NAFMII: {
    project: {
      tableHeight: 'auto',
      idWidth: '120',
      nameWidth: '160',
      schemaWidth: '140',
      fileCountWidth: '110',
      permissionWidth: '110',
      commentWidth: '140',
      timeWidth: '120',
      popupLabelWidth: '125px',
    },
    file: {
      tableHeight: 'auto',
      idWidth: '100',
      nameWidth: '180',
      timeWidth: '120',
      parseStatusWidth: '120',
      popupLabelWidth: '100px',
    },
    schema: {
      tableHeight: 'auto',
      idWidth: '120',
      nameWidth: '150',
      timeWidth: '120',
    },
    schemaType: {
      nameMinWidth: '180',
      typeMinWidth: '180',
      typeWidth: '',
    },
    schemaModel: {
      fileCountWidth: '120',
      precisionWidth: '120',
    },
    user: {
      tableHeight: 'auto',
    },
  },
  CMFCHINA: {
    project: {
      tableHeight: 'auto',
    },
    file: {
      tableHeight: 'auto',
    },
    schema: {
      tableHeight: 'auto',
    },
    rule: {
      tableHeight: 'auto',
    },
  },
};

function getCurrentDataByEnv(data) {
  const env = import.meta.env.VITE_DIST;
  let currentData = data.default;
  Object.keys(currentData).forEach((key) => {
    if (data[env]) {
      currentData[key] = {
        ...currentData[key],
        ...data[env][key],
      };
    }
  });
  return currentData;
}

export const text = getCurrentDataByEnv(textData);
export const style = getCurrentDataByEnv(styleData);
