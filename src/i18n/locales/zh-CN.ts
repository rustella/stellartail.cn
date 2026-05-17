export const zhCN = {
  seo: {
    title: 'StellarTrail / 寻径星野｜户外装备与绳结技能助手',
    description: '寻径星野帮助你在出发前整理装备清单、学习关键绳结技能，并在 Web 端、Android 端和微信小程序端使用。'
  },
  nav: {
    product: '产品',
    gear: '装备',
    skills: '技能',
    screenshots: '截图',
    entry: '入口',
    docs: 'Docs',
    language: '语言'
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
    body: '你可以根据场景选择 Web 端、Android 端或微信小程序端。正式访问链接、Android 安装入口和小程序二维码发布后会集中放在这里。',
    badge: 'Multi-platform',
    hint: 'Web 端适合桌面整理，Android 端适合随身使用，微信小程序端适合在微信内快速打开。',
    channelsLabel: '支持平台入口',
    channels: [
      { title: 'Web 访问', body: '适合在桌面大屏整理装备清单。' },
      { title: 'Android 安装', body: '适合随身保存和查看准备内容。' },
      { title: '微信小程序', body: '适合在微信内快速打开。' }
    ]
  },
  docs: {
    seo: {
      title: 'StellarTrail 开发文档｜API Reference',
      description: 'StellarTrail 后端 API 的静态参考文档，说明当前可用的服务状态和服务信息读取方式。'
    },
    nav: {
      label: '开发文档导航',
      brand: 'StellarTrail Docs',
      backHome: '返回官网'
    },
    hero: {
      eyebrow: '开发文档',
      title: '开发文档',
      body: '这里记录当前后端已经存在并可确认的读取类能力。示例只使用路径和环境变量占位，不在页面中展示生产访问地址。'
    },
    toc: {
      label: '文档目录'
    },
    source: {
      title: '来源信息',
      repository: '来源仓库',
      inspectedHead: '检查版本',
      inspectedAt: '检查日期'
    },
    sections: {
      overview: {
        title: '概览',
        body: '首版文档覆盖服务健康检查、服务信息读取和统一的未找到响应。后端新增能力后，应先从真实服务源码和响应结构同步到这里。',
        note: '本文档是静态说明页，不会从浏览器直接请求后端服务。'
      },
      authentication: {
        title: '认证',
        body: '当前列出的读取项不需要登录态。后续如果加入需要用户身份的能力，应单独标记认证方式、权限边界和错误响应。'
      },
      endpoints: {
        title: '接口',
        body: '当前可确认的读取项。'
      },
      errors: {
        title: '错误响应',
        body: '未匹配到资源时返回统一的 JSON 错误结构。'
      },
      config: {
        title: '访问配置',
        body: '生产访问地址保存在部署侧或本地忽略配置中，不写入公开源码、页面内容或构建产物。调用示例应使用自己的环境变量拼接路径。'
      }
    },
    endpointSummaries: {
      health: '服务状态',
      meta: '服务信息'
    },
    labels: {
      responseStatus: '响应状态'
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
