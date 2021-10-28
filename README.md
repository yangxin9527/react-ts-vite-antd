//参考 https://heavenru.com/post/Vite-with-React-%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5

```
├── app.tsx
├── assets // 静态资源，会被打包优化
│   ├── favicon.svg
│   └── logo.svg
├── common // 公共配置，比如统一请求封装，session 封装
│   ├── http-client
│   └── session
├── components // 全局组件，分业务组件或 UI 组件
│   ├── Icon
├── config // 配置文件目录
│   ├── index.ts
├── hooks // 自定义 hook
│   └── index.ts
├── layouts // 模板，不同的路由，可以配置不同的模板
│   └── index.tsx
├── lib // 通常这里防止第三方库，比如 jweixin.js、jsBridge.js
│   ├── README.md
│   ├── jsBridge.js
│   └── jweixin.js
├── pages // 页面存放位置
│   ├── components // 就近原则页面级别的组件
│   ├── home
├── routes // 路由配置
│   └── index.ts
├── store // 全局状态管理
│   ├── common.ts
│   ├── index.ts
│   └── session.ts
├── styles // 全局样式
│   ├── global.less
│   └── reset.less
└── utils // 工具方法
└── index.ts
```

## 已完成

- Iconfont 配置
- mobx useStore
- antd 自定义主题色
- 环境变量 ENV 注入
- axios 封装

## 需要完成功能

- husky
- mock json server
- tools utils 补全

  // "husky": {
  //   "hooks": {
  //     "pre-commit": "lint-staged"
  //   }
  // },
  // "lint-staged": {
  //   "src/**/*.{ts,tsx}": [
  //     "eslint --cache --fix",
  //     "git add"
  //   ],
  //   "src/**/*.{js,jsx}": [
  //     "eslint --cache --fix",
  //     "git add"
  //   ]
  // },
