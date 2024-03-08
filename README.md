> vue3基本框架结构
## 简介

版本：

vue3 + vite + pinia + typescript 

### 目录结构

```
vue
├─ .env.development    # 开发环境
├─ .env.test           # 测试环境
├─ .env.production     # 生产环境
├─ README.md          
├─ build              # 全局参数配置
├─ dist               # 打包dist
├─ public             # 静态资源
├─ src                # 源码
│  ├─ api             # 接口api
      ├─ xx.ts      # 按模块区分
      ├─ xxx.ts 
      ├─ xxxx.ts     
│  ├─ plugin          # 插件
│  ├─ assets          # 需要打包的资源
│  ├─ components      # 公共组件
│  ├─ router          # 路由
│  ├─ pinia           # 状态管理
      ├─ xx.ts      # 按模块区分
      ├─ xxx.ts 
      ├─ xxxx.ts    
│  ├─ utils           # 全局公共方法
│  └─ views           # 所有业务页面
├─ types
   └─ auto-import.d.ts    # 全局引入的文件
├─ env.d.ts             # env
└─ tsconfig.json        # TS 编译器的配置文件
└─ prettierrc.json      # 代码格式化
└─ vite.config.ts       # vite 配置


```
### 打包命令

npm run dev          # 本地运行

npm run build:test   # 打包测试环境 

npm run build:prod   # 打包生产环境 

npm run lint         # 自动修复警告
