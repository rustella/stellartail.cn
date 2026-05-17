export const zhCN = {
  seo: {
    title: 'StellarTrail / 寻径星野｜户外装备与绳结技能助手',
    description: '寻径星野帮助你在出发前整理装备清单、学习关键绳结技能，并在 Web 端、Android 端和微信小程序端使用。'
  },
  nav: {
    product: '产品介绍',
    gear: '装备管理',
    skills: '户外技能',
    screenshots: '产品截图',
    entry: '下载入口',
    web: 'Web端',
    docs: '接口文档',
    language: '语言'
  },
  jump: {
    label: '页面快捷跳转',
    trigger: '展开页面快捷跳转',
    title: '本页跳转',
    home: '首页'
  },
  hero: {
    eyebrow: 'StellarTrail / 寻径星野',
    title: '出发前，把装备和绳结技能准备好',
    subtitle: '面向户外准备阶段的轻量助手：整理装备清单，学习可立即上手的绳结技能，并在 Web、Android、微信小程序之间选择顺手的使用方式。',
    primaryCta: '查看多端入口',
    secondaryCta: '了解产品能力',
    note: '已支持 Web 端、Android 端、微信小程序端。',
    platformLabel: '支持平台',
    platforms: ['Web 端', 'Android 端', '微信小程序端'],
    statGear: '装备清单',
    statSkill: '绳结技能',
    statMode: '支持平台'
  },
  product: {
    eyebrow: '产品定位',
    title: '为户外出发前的准备工作而设计',
    body: '寻径星野专注于把分散的装备准备、技能学习和入口信息收束到一个清爽界面里，让你在出发前更快确认该带什么、该复习哪些关键技能。',
    cards: {
      fast: { title: '装备库', body: '按出行场景整理装备分类、准备模板和检查清单，帮助你更快确认该带什么。' },
      bilingual: { title: '绳结技能', body: '从可调节帐绳结等常用绳结开始，展示适用场景、步骤和使用提醒。' },
      polished: { title: '多端使用', body: 'Web 端适合桌面整理，Android 端适合随身使用，微信小程序端适合在微信内快速打开查看。' }
    }
  },
  gear: {
    eyebrow: '装备库',
    title: '把出发前的装备准备变成清单',
    body: '装备库用于展示基础徒步装备模板、分类与准备思路。重点是帮助用户理解「如何准备」，适合作为第一次了解产品的入口。',
    bullets: ['按用途理解装备分类', '以模板方式快速建立准备清单', 'Web、Android、微信小程序端都能清楚浏览']
  },
  skills: {
    eyebrow: '户外技能',
    title: '从绳结开始，学习真正用得上的技能',
    body: '当前户外技能聚焦绳结。「可调节帐绳结」适用于帐篷、天幕和风绳张力调节，可在受力后微调长度。',
    bullets: ['当前能力：绳结教程', '示例技能：可调节帐绳结', '适合出发前快速复习']
  },
  screenshots: {
    eyebrow: '产品截图',
    title: 'Web 与微信小程序画面，Android 端同步支持',
    body: '当前截图展示 Web 端和微信小程序端的装备、绳结画面；Android 端同样支持装备库与户外技能使用。',
    wechatTitle: '微信小程序端',
    wechatBody: '在微信里快速查看装备管理和绳结技能。',
    webTitle: 'Web 端',
    webBody: '在大屏上管理装备列表和添加装备信息。',
    wechatGearAlt: '微信小程序端装备管理界面',
    wechatKnotsAlt: '微信小程序端绳结技能界面',
    webGearAlt: 'Web 端装备管理界面',
    webGearFormAlt: 'Web 端添加装备表单界面'
  },
  entry: {
    eyebrow: '下载 / 小程序入口',
    title: 'Web、Android、微信小程序都可使用',
    body: 'Web 端已上线，可以先在浏览器打开整理装备；Android 安装方式和小程序码准备好后也会放在这里。',
    badge: 'Multi-platform',
    hint: 'Web 端适合桌面整理，Android 端适合随身使用，微信小程序端适合在微信内快速打开。',
    channelsLabel: '支持平台入口',
    channels: [
      {
        title: 'Web 访问',
        body: 'Web 端已上线，适合在桌面大屏整理装备清单。',
        href: 'https://app.stellartrail.cn/',
        action: '打开 Web 端'
      },
      {
        title: 'Android 安装',
        body: '适合随身保存和查看准备内容，安装方式准备好后补上。',
        href: null,
        action: null
      },
      {
        title: '微信小程序',
        body: '适合在微信内快速打开，小程序码准备好后补上。',
        href: null,
        action: null
      }
    ]
  },
  docs: {
    seo: {
      title: 'StellarTrail 开发文档｜API Reference',
      description: 'StellarTrail 服务接口的静态参考文档，按当前后端源码列出已注册的请求路径、请求体、响应体和错误结构。'
    },
    nav: {
      label: '开发文档导航',
      brand: 'StellarTrail Docs',
      backHome: '返回官网'
    },
    hero: {
      eyebrow: '开发文档',
      title: '开发文档',
      body: '这里基于当前后端源码整理已注册的服务接口。示例只使用路径和占位值，不在页面中展示生产访问地址。'
    },
    toc: {
      label: '文档目录'
    },
    source: {
      title: '来源信息',
      repository: '来源仓库',
      inspectedHead: '检查版本',
      inspectedAt: '检查日期',
      endpointCount: '接口数量'
    },
    sections: {
      overview: {
        title: '概览',
        body: '本文档从后端源码中的 Axum 注册表、请求 DTO、响应 DTO 和统一错误模型同步而来，覆盖系统状态、登录账号、公开内容、绳结技能、装备库、上传与反馈。',
        count: '当前列出 {count} 个已注册接口。',
        note: '页面加载时不会请求服务；只有你填写服务地址并点击发送请求时才会发起请求。'
      },
      authentication: {
        title: '认证',
        body: '公开接口不需要登录；用户私有数据接口使用 Authorization Bearer；管理员接口在 Bearer 登录基础上校验管理员权限。技能内容可通过 X-StellarTrail-Locale 或 Accept-Language 选择 zh-CN / en。'
      },
      endpoints: {
        title: '接口',
        body: '下面按功能分组展示当前源码中已注册的请求路径。'
      },
      errors: {
        title: '错误响应',
        body: '服务错误使用统一 JSON 结构：code、message，并按场景附带 fields、captcha 或 parameter。'
      },
      config: {
        title: '访问配置',
        body: '生产访问地址保存在部署侧或本地忽略配置中，不写入公开源码、页面内容或构建产物。调用示例应使用自己的环境变量拼接路径。'
      }
    },
    groupTitles: {
      system: '系统状态',
      auth: '登录与账号',
      content: '公开内容',
      skills: '绳结技能',
      admin: '管理员内容',
      gear: '装备库',
      uploads: '图片上传',
      feedback: '用户反馈'
    },
    authLabels: {
      public: '公开',
      bearer: '需要 Bearer 登录',
      admin: '需要管理员权限'
    },
    endpointSummaries: {
      healthz: '服务状态',
      meta: '服务信息',
      authWechatLogin: '微信小程序登录',
      authEmailVerificationCode: '发送注册邮箱验证码',
      authEmailLoginCode: '发送邮箱登录验证码',
      authEmailLogin: '邮箱验证码登录',
      authPasswordResetCode: '发送重置密码验证码',
      authPasswordReset: '重置密码',
      authRegister: '注册账号',
      authPasswordLogin: '账号密码登录',
      authRefresh: '刷新登录态',
      authCaptcha: '创建图形验证码',
      gearTemplatesList: '装备准备模板列表',
      gearTemplatesDetail: '装备准备模板详情',
      skillsCategories: '户外技能分类',
      skillsKnotsList: '绳结列表',
      skillsKnotsDetail: '绳结详情',
      adminKnotMediaUpload: '上传绳结媒体素材',
      gearsCategories: '我的装备分类统计',
      gearsStats: '我的装备统计',
      gearsExport: '导出装备 CSV',
      gearsImport: '导入装备 JSON',
      gearsList: '我的装备列表',
      gearsCreate: '新增装备',
      gearsDetail: '装备详情',
      gearsUpdate: '更新装备',
      gearsArchive: '归档装备',
      gearsRestore: '恢复装备',
      uploadsCreate: '上传反馈图片',
      uploadsDownload: '读取已上传图片',
      feedbackCreate: '提交反馈'
    },
    labels: {
      group: '分组',
      auth: '权限',
      responseStatus: '响应状态',
      contentType: '请求类型',
      responseType: '响应类型',
      query: '查询参数',
      headers: '请求头',
      requestBody: '请求体',
      responseBody: '响应体',
      noBody: '无响应体',
      tryRequest: '调试请求',
      tryRequestNote: '仅在点击发送后请求你填写的服务地址；页面不会保存地址、请求头或响应。',
      serviceOrigin: '服务地址',
      serviceOriginPlaceholder: 'https://your-api.example.com',
      serviceOriginHelp: '输入 http(s) 服务地址，页面会把接口路径拼接在后面。',
      pathParams: '路径参数',
      pathParamLabel: '{name} 路径参数',
      queryParams: '查询参数输入',
      queryParamLabel: '{name} 查询参数',
      extraQuery: '附加查询参数',
      extraQueryPlaceholder: 'foo=bar&limit=20',
      headersInput: '请求头输入',
      headersPlaceholder: 'Authorization: Bearer ...\nX-StellarTrail-Locale: zh-CN',
      requestBodyInput: '请求体输入',
      fileInput: '文件',
      sendRequest: '发送请求',
      sending: '发送中…',
      requestUrl: '请求地址',
      response: '响应',
      responseHeaders: '响应头',
      responseBodyResult: '响应内容',
      fillServiceOrigin: '请先填写服务地址',
      invalidServiceOrigin: '服务地址必须是 http(s) URL，且不能包含查询串或片段。',
      fillPathParam: '请填写 {name} 路径参数',
      invalidHeader: '请求头格式应为 Name: value',
      invalidJson: '请求体必须是合法 JSON',
      networkError: '请求失败：{message}',
      noResponseBody: '无响应内容'
    }
  },
  footer: {
    tagline: 'StellarTrail / 寻径星野',
    caption: '户外准备，从清单和绳结开始',
    rights: '保留所有权利。'
  },
  language: {
    current: '中文',
    switchTo: 'Switch to English'
  }
} as const;
