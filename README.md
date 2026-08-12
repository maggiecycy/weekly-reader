# Weekly Reader

阮一峰「[科技爱好者周刊](https://github.com/ruanyf/weekly)」个人阅读器：现代排版、全站搜索、自动同步。

**Demo：** [https://weekly-reader-sandy.vercel.app](https://weekly-reader-sandy.vercel.app)

> 内容版权归阮一峰所有。本站仅供个人阅读，非官方镜像；每期保留原文链接与署名。

## 功能

- 首页最新 4 期 + 加载更多
- 详情页重排版（TOC / 上期下期 / 原文链接）
- 全站搜索、归档、Light/Dark
- **UI 中英切换**（正文仍为中文原文）

## 本地运行

```bash
npm install
npm run sync:all   # 首次拉全部期号（已有 content/ 可跳过）
npm run dev        # http://localhost:3000
```

日常增量：`npm run sync`

## 版权

代码可自由使用；**周刊正文版权归原作者**，请勿无来源转载或做 SEO 镜像。
