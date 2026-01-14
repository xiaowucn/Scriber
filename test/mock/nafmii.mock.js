// 数据知识列表
export const DATA_KNOWLEDGE_LIST = {
  status: 'ok',
  data: {
    page: 1,
    size: 20,
    total: 2,
    items: [
      {
        id: 1,
        name: '信托实业',
        type: {
          id: 1,
          name: '金融',
        },
        user: {
          id: 1,
          name: 'admin',
        },
        created_utc: 1741580367,
      },
      {
        id: 2,
        name: '基金债券',
        type: {
          id: 2,
          name: '会计',
        },
        user: {
          id: 1,
          name: 'admin',
        },
        created_utc: 1741580367,
      },
    ],
  },
};

// 数据知识类型
export const DATA_KNOWLEDGE_TYPES = {
  status: 'ok',
  data: [
    {
      id: 1,
      name: '金融',
    },
    {
      id: 2,
      name: '会计',
    },
    {
      id: 3,
      name: '法律法规',
    },
    {
      id: 3,
      name: '存续期服务',
    },
  ],
};

export const SYSTEM_LOG_LIST = {
  "status": "ok",
  "data": {
    "page": 1,
    "size": 20,
    "total": 3,
    "items": [
      {
        "id": 3,
        "user_name": "admin",
        "user_id": 1,
        "feature": "",
        "type": 3,
        "target": "",
        "status": 2,
        "created_utc": 1741580367,
        "ip_address": "192.168.50.104",
        "browser_version": "Chrome134.11.11.11",
        "detail": "",
        "error_info": "",
      },
      {
        "id": 2,
        "user_name": "admin",
        "user_id": 1,
        "feature": "识别文件管理",
        "type": 2,
        "target": "文件列表",
        "status": 2,
        "created_utc": 1741580367,
        "ip_address": "112.23.00.255",
        "browser_version": "Chrome101",
        "detail": "文件列表页面查看成功",
        "error_info": "",
      },
      {
        "id": 1,
        "user_name": "admin",
        "user_id": 1,
        "feature": "算法模型管理",
        "type": 3,
        "target": "文件模型版本",
        "status": 3,
        "created_utc": 1741580367,
        "ip_address": "112.23.00.255",
        "browser_version": "Chrome101",
        "detail": "",
        "error_info": "网络异常",
      },
    ]
  }
}