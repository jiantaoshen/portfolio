---

lang: zh
title: "开发者作品集"
description: "一个多语言开发者作品集和轻量级 Git 内容管理系统（CMS），包含公开 CMS 体验模式以及仅限本地开发环境的源内容编辑功能。"
status: "已上线"
order: 3
technologies:
   - "Next.js 16"
   - "TypeScript"
   - "Tailwind CSS v4"
   - "shadcn/ui"
   - "next-intl"
   - "GitHub"
   - "Vercel"
links:
  github: "https://github.com/jiantaoshen/portfolio-dev"
  live: "https://www.jiantao.dev"
  draft: false

---

## 概述

这是一个使用 Next.js 16、TypeScript、Tailwind CSS v4、shadcn/ui 和 next-intl 构建的多语言开发者作品集，同时也是一个轻量级的 Git 内容管理系统。

公开网站支持英语、瑞典语和中文，并通过不同的语言路由和本地化内容提供对应版本。项目案例使用 Markdown 保存，而“关于我”、技能和教育经历等结构化资料则以多语言 JSON 的形式维护。

项目还包含两种内容编辑体验：

- 一个公开的 Trial 体验模式，可以探索 CMS 界面，但修改不会持久化
- 一个本地 Dashboard，可在开发环境中直接编辑仓库中的 JSON 和 Markdown 源文件

当前架构继续以 Git 作为唯一内容来源，不引入生产环境内容数据库，同时使用同一个 Next.js 应用处理公开页面渲染、CMS 界面、国际化以及仅限开发环境的内容 API。

---

## 问题

一个多语言作品集包含多种不同类型的内容，需要保持清晰的组织结构并易于维护。

项目包括：

- About 和 CV 信息
- 技能和教育经历
- 项目元数据
- 长篇项目案例
- 英语、瑞典语和中文内容
- 公开网站 UI 翻译
- CMS 界面翻译

在内容规模较小时，直接编辑 JSON 和 Markdown 文件是可行的，但随着内容越来越多，这种方式会逐渐变得不方便。

与此同时，这个作品集并不需要传统的生产环境 CMS。

内容更新频率相对较低，而且这些内容天然适合与应用代码一起保存在仓库中。如果为了这些内容引入数据库、身份验证系统、托管 CMS 和永久写入 API，会增加大量基础设施和维护成本，但实际收益有限。

因此，我的目标是继续保留 GitHub 存储内容所带来的优势，同时提供一个更加方便的可视化编辑流程。

---

## 解决方案

作品集现在统一使用一个 Next.js App Router 应用。

核心内容流程刻意保持简单：

```text
JSON / Markdown
      ↓
   Next.js
      ↓
  公开作品集
      ↓
    Vercel
```

项目案例存储在 Markdown 中。

About、技能和教育经历则以多语言 JSON 存储。

在本地开发环境中，CMS 直接操作这些相同的源文件。

```text
本地 Dashboard
      ↓
Next.js Route Handlers
      ↓
JSON / Markdown
      ↓
    Git diff
      ↓
   Git commit
      ↓
     Vercel
```

公开的 `/trial` 路由使用相同的编辑界面，但所有修改都只保存在浏览器或应用状态中。

Trial 模式不会执行任何持久化写入操作。

这样既可以继续让 Git 作为唯一内容来源，又可以提供一个可视化的内容编辑流程。

---

## 功能

### 多语言作品集

作品集支持：

```text
英语
瑞典语
中文
```

公开路由使用语言前缀：

```text
/en
/sv
/zh
```

根路由默认重定向到瑞典语：

```text
/
↓
/sv
```

本地化项目页面采用相同结构：

```text
/en/projects/...
/sv/projects/...
/zh/projects/...
```

每种语言都可以维护同一项目的独立内容版本。

---

### Next.js App Router

应用使用 Next.js App Router。

公开作品集位于：

```text
app/[locale]/
```

项目页面使用 catch-all 路由：

```text
app/[locale]/projects/[...slug]/
```

这样既支持普通项目路径，也支持多层嵌套路径。

例如：

```text
/en/projects/light-manager
/sv/projects/light-manager
/zh/projects/light-manager
```

以及：

```text
/en/projects/backend/example-project
```

---

### 多个 Root Layout

公开网站和 CMS 使用独立的 root layout。

```text
app/[locale]/layout.tsx
```

负责本地化公开作品集。

```text
app/(career)/layout.tsx
```

负责 Trial 和 Dashboard。

`(career)` 是 Next.js Route Group，因此不会出现在 URL 中。

所以可以直接提供：

```text
/dashboard
/trial
```

而不需要让 URL 变成 `/career/dashboard`。

这种分离方式还使公开作品集和 CMS 可以采用不同的请求级国际化策略，同时继续共享全局样式和 UI 基础组件。

---

### next-intl 国际化

国际化由 `next-intl` 负责。

核心配置位于：

```text
i18n/
├── request.ts
├── routing.ts
└── locales/
```

翻译消息按语言组织：

```text
i18n/locales/
├── en/
├── sv/
└── zh/
```

每种语言目前包含：

```text
about.json
common.json
dashboard.json
home.json
project.json
```

Server Components 使用服务端翻译 API。

Client Components 使用翻译 hooks。

这套方案替代了项目之前自定义的翻译加载器，减少了大量国际化相关的胶水代码。

---

### 界面语言与内容语言分离

CMS 明确区分两种不同的语言概念：

```text
CMS 界面语言
≠
作品集内容语言
```

界面语言控制：

```text
保存
删除
预览
项目
教育经历
技能
```

等编辑器 UI。

内容语言则决定当前正在编辑哪一种语言的作品集内容。

例如：

```text
CMS 界面
→ 中文

正在编辑的内容
→ Svenska
```

CMS 界面 locale 与当前内容 locale 独立保存。

这样就不会把编辑器本身的语言和正在编辑的内容语言强制绑定在一起。

---

### Markdown 项目内容

项目案例保存在：

```text
content/
└── projects/
    ├── en/
    ├── sv/
    └── zh/
```

每个项目都是带有结构化 frontmatter 的 Markdown 文件。

例如：

```yaml
---
lang: en
title: Example Project
description: Example project description
status: Live
order: 1
technologies:
  - Next.js
  - TypeScript
links:
  github: https://github.com/example/project
  live: https://example.com
draft: false
---
```

Markdown 正文保存完整项目案例。

```markdown
## 概述

项目介绍……

## 架构

技术细节……
```

公开项目页面还会从 Markdown 中提取标题，并自动生成目录。

---

### 多语言 JSON 内容

About、技能和教育经历等结构化资料以 JSON 保存。

```text
i18n/locales/
├── en/
│   └── about.json
├── sv/
│   └── about.json
└── zh/
    └── about.json
```

每种语言都有独立内容。

这样可以把结构化个人资料与较长的项目案例分开，同时让两种内容格式都保存在同一个 Git 仓库中。

---

### 公开 Trial 模式

作品集包含一个公开 CMS 沙盒：

```text
/trial
```

其他路由包括：

```text
/trial/cv
/trial/projects
```

访问者可以体验编辑器并修改内容，但不会影响仓库文件。

修改仅存在于临时应用状态中。

```text
访问者
   ↓
Trial CMS
   ↓
临时浏览器状态
```

不会向本地写入 API 发送持久化内容请求。

因此 CMS 本身也可以作为作品集的一部分公开展示，而无需暴露仓库写入权限。

---

### 本地内容 Dashboard

本地 Dashboard 位于：

```text
/dashboard
```

包括：

```text
/dashboard/cv
/dashboard/projects
```

Dashboard 是公开作品集所使用 JSON 和 Markdown 文件之上的可视化编辑层。

CV 编辑器支持：

- 个人简介
- 技能
- 技能分类
- 技术
- 教育经历
- 学习经历
- 教育描述
- 论文信息
- 论文链接

项目编辑器支持：

- 标题
- Slug
- 项目状态
- 语言
- 描述
- 技术栈
- GitHub URL
- Live URL
- 显示顺序
- 发布状态
- Markdown 内容

项目编辑器还包含独立的：

```text
编辑
预览
```

视图。

因此可以在真正写入文件之前先预览 Markdown 的效果。

---

### 仅限开发环境的内容 API

持久化的本地编辑通过 Next.js Route Handlers 实现。

目前包括：

```text
PUT /api/local/about/[locale]

PUT /api/local/projects
DELETE /api/local/projects
```

About endpoint 写入：

```text
i18n/locales/{locale}/about.json
```

Project endpoint 管理：

```text
content/projects/{locale}/
```

项目编辑支持：

- 创建项目
- 更新现有项目
- 修改 slug
- 修改内容语言
- 在不同语言目录之间移动项目
- Markdown 源文件
- 查找已有 MDX 源文件
- 删除项目

当 slug 或语言发生变化时，会先成功写入新文件，再删除旧源文件。

---

### 仅开发环境允许写入

本地内容 API 被刻意限制为无法在生产环境使用。

所有写入 handler 在执行文件操作前都会检查环境。

```text
NODE_ENV === "development"
```

非开发环境请求会得到：

```text
403 Forbidden
```

因此整体安全模型是：

```text
公开作品集
→ 只读

公开 Trial
→ 临时浏览器状态

本地 Dashboard
→ 仅开发环境允许写入文件
```

生产环境不会主动暴露可持久化修改仓库内容的 API。

---

### 共享 UI 系统

项目使用：

```text
Tailwind CSS v4
+
shadcn/ui
+
语义化 design tokens
```

可复用 UI 基础组件位于：

```text
components/ui/
```

例如：

```text
Button
Badge
Card
Input
Label
Textarea
Sheet
Alert
```

公开作品集与 CMS 共用同一套组件系统。

这样减少了重复 UI，并让 Dashboard 更像整个产品的一部分，而不是一个完全独立的内部工具。

---

### 语义化样式

设计系统使用语义化 Tailwind class，而不是在各个组件中散落硬编码颜色。

例如：

```text
bg-background
bg-muted
bg-primary

text-foreground
text-muted-foreground
text-primary

border-border
```

底层配色统一通过 CSS variables 定义。

这样可以更容易地维护视觉风格，同时让公开作品集和 CMS 保持一致。

---

## 架构

### 公开网站

```text
本地化 JSON
      +
本地化 Markdown
      ↓
   Next.js
      ↓
Server Components
      ↓
生成页面
      ↓
    Vercel
```

本地化路由和项目页面都根据仓库内容生成。

Git 始终是唯一内容来源。

---

### 本地内容管理

```text
Dashboard
   ↓
Career Workspace
   ↓
Next.js Route Handlers
   ↓
Markdown / JSON
   ↓
Git
   ↓
Vercel
```

不需要运行单独的后端服务。

Next.js 开发服务器同时提供：

```text
Next.js
├── 公开作品集
├── Trial CMS
├── 本地 Dashboard
└── 仅开发环境 Route Handlers
```

---

## 从 Astro 迁移到 Next.js

之前的作品集版本使用 Astro 构建。

当项目主要还是一个静态生成的作品集时，这种架构非常合适。

原始结构大致为：

```text
Markdown / JSON
      ↓
    Astro
      ↓
   静态 HTML
      ↓
    Vercel
```

后来 CMS 作为 React 界面加入项目。

持久化的本地内容编辑则通过注册在 Astro/Vite 开发服务器中的开发环境 middleware 实现。

```text
React Dashboard
      ↓
Astro / Vite middleware
      ↓
Markdown / JSON
```

这样成功避免了额外引入一个独立后端服务。

---

### 迁移前

```text
Astro
├── 公开作品集
├── 静态路由
├── Markdown Content Collections
│
├── React CMS
│   ├── Trial 模式
│   └── 本地 Dashboard
│
└── Astro / Vite middleware
    └── 仅开发环境写入
```

---

### 迁移后

```text
Next.js
├── 多语言作品集
├── 项目页面
├── Trial CMS
├── 本地 Dashboard
├── Server Components
├── Client Components
├── next-intl
└── Route Handlers
    └── 仅开发环境写入
```

这次迁移把公开页面渲染、CMS routing、国际化和服务端功能统一到了同一个框架中。

---

### Routing 迁移

Astro 中按语言组织的路由被替换为 App Router 的动态 locale segment：

```text
app/[locale]/
```

作品集仍然提供：

```text
/en
/sv
/zh
```

但路由逻辑现在统一围绕 locale segment 管理。

项目页面迁移到：

```text
app/[locale]/projects/[...slug]/
```

CMS routes 则放在：

```text
app/(career)/
```

这样既保持了简洁 URL，也允许 CMS 使用独立 layout。

---

### 国际化迁移

原始项目使用自定义翻译加载器。

Next.js 版本使用 `next-intl` 替代了这一层。

Server Components 和 Client Components 分别使用适合各自运行环境的翻译方式，也不再需要手动向大量组件传递大型翻译对象。

迁移过程中，国际化还扩展到了 CMS 本身。

最终形成了明确的：

```text
interface locale
```

与：

```text
content locale
```

分离。

这现在已经成为 CMS 架构中的明确设计。

---

### 项目内容迁移

Astro Content Collections 被移除。

Markdown 文件本身则继续保留。

项目现在直接从：

```text
content/projects/
```

加载。

Frontmatter 继续保存结构化项目元数据，而 Markdown 保存项目案例正文。

最重要的架构原则没有变化：

```text
内容继续保存在 Git 中。
```

变化的只是与框架绑定的内容加载方式。

---

### 本地编辑 API 迁移

Astro 版本使用自定义 Vite middleware 来处理内容写入。

Next.js 版本则使用标准 Route Handlers 替代。

```text
迁移前

Dashboard
   ↓
Astro / Vite middleware
   ↓
文件
```

```text
迁移后

Dashboard
   ↓
Next.js Route Handlers
   ↓
文件
```

这样去掉了框架特定的服务器 middleware，同时保留了原有仅限开发环境的安全边界。

---

### UI 层迁移

迁移过程中也重新整理了 UI 层。

旧的自定义组件和样式模式逐步替换为：

```text
shadcn/ui
+
Tailwind CSS v4
+
语义化 design tokens
```

公开作品集和 CMS 现在共用组件。

这减少了重复样式，也让以后调整设计更加简单。

---

### 迁移结果

迁移改变了应用的框架架构，但没有改变项目最核心的内容理念。

最初的设计原则是：

```text
内容
→ Git
→ 静态 / 公开网站
```

当前仍然是：

```text
内容
→ Git
→ Next.js
→ Vercel
```

最大的变化是统一。

以前需要同时维护：

```text
Astro
+
React
+
自定义开发 middleware
+
自定义 i18n
```

现在主要依赖：

```text
Next.js
+
next-intl
+
Route Handlers
+
共享 React 组件
```

因此应用边界更简单，同时继续保留原本轻量的 Git 工作流。

---

## 关键设计决策

### 内容继续保存在 Git

Markdown 和 JSON 始终是唯一内容来源。

这样作品集内容和应用代码可以一起进行版本控制。

每一次持久化内容修改都可以先通过：

```text
git diff
```

检查，再提交。

整体工作流为：

```text
编辑
  ↓
检查 diff
  ↓
Commit
  ↓
Push
  ↓
Vercel 部署
```

这样可以获得：

- 完整历史记录
- 简单回滚
- 可审查的内容修改
- 不需要 CMS 数据库
- 不需要独立内容备份方案
- 可移植的 Markdown 和 JSON

---

### 避免生产环境 CMS 数据库

作品集不需要频繁的多人协作发布，也不需要生产环境实时编辑。

因此加入 CMS 数据库会额外引入：

- 更多基础设施
- 身份验证需求
- API 管理
- 数据库托管
- 内容同步问题
- 更高的运维复杂度

但对于当前使用场景并不能带来足够收益。

基于仓库的内容方案更加简单，也更符合项目的更新频率。

---

### 仅开发环境编辑

持久化编辑被刻意设计为本地开发功能。

这样生产应用可以专注于展示作品集内容，而不是管理内容。

Dashboard 提供了编辑便利，但不会让作品集变成一个永久可写的生产 CMS。

---

### 分离 Trial 与本地模式

同一个核心编辑器支持两个不同用途。

```text
/trial
```

是公开且不持久化的。

```text
/dashboard
```

则用于本地开发，可以修改源文件。

因此 CMS 本身可以作为作品集项目的一部分公开展示，同时不暴露写入权限。

---

### Markdown 与 JSON 用于不同内容类型

不同类型的内容使用不同存储格式。

项目案例采用 Markdown，因为它们主要是长篇技术内容。

结构化个人资料使用 JSON，因为它们由固定字段和重复结构对象构成。

```text
Markdown
→ 项目案例

JSON
→ About
→ 技能
→ 教育经历
```

这样不需要强迫所有内容使用同一种数据模型。

---

### UI 翻译与可编辑内容分离

不同的本地化内容承担不同责任。

例如：

```text
保存
删除
项目
预览
返回项目
```

属于 UI 翻译层。

而：

```text
About 描述
教育经历
技能
项目摘要
项目案例
```

属于真正可编辑的作品集内容。

项目正在逐步让两者的职责更加清晰，避免国际化基础设施本身变成内容模型。

---

### 移除 Blog

早期版本的作品集包含一个多语言技术 Blog。

维护多种语言的长篇文章需要大量翻译和长期维护工作，但对于作品集的核心目标贡献相对有限。

因此我最终选择移除 Blog，而不是继续把它扩展成更大型的发布系统。

面向职业曝光的技术写作更适合 LinkedIn 等已经拥有传播渠道和职业社交环境的平台。

与具体项目相关的技术决策则继续保留在项目案例中，因为这些内容能够直接支持所展示的项目。

现在作品集主要聚焦于：

```text
About
→ 我是谁

Skills
→ 我使用什么技术

Projects
→ 我构建过什么

Project case studies
→ 这些系统是如何设计和演进的

GitHub
→ 源代码和开发历史

LinkedIn
→ 专业写作和公开交流
```

这样既减少了重复内容和翻译工作，也保留了对开发者作品集最重要的工程证据。

---

## 项目结构

当前仓库的简化结构：

```text
.
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects/
│   │       └── [...slug]/
│   │
│   ├── (career)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   └── trial/
│   │
│   ├── api/
│   │   └── local/
│   │
│   └── globals.css
│
├── career/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── server/
│   └── workspace.tsx
│
├── components/
│   ├── content/
│   ├── page/
│   └── ui/
│
├── content/
│   └── projects/
│       ├── en/
│       ├── sv/
│       └── zh/
│
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── locales/
│       ├── en/
│       ├── sv/
│       └── zh/
│
├── lib/
│   └── content/
│
├── next.config.ts
└── package.json
```

---

## 开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认本地地址：

```text
http://localhost:3000
```

公开作品集：

```text
http://localhost:3000/sv
http://localhost:3000/en
http://localhost:3000/zh
```

本地 Dashboard：

```text
http://localhost:3000/dashboard
```

Trial：

```text
http://localhost:3000/trial
```

不需要单独启动后端服务。

开发环境统一运行在 Next.js 中：

```text
Next.js
├── 公开作品集
├── Trial CMS
├── 本地 Dashboard
└── 仅开发环境 Route Handlers
```

---

## Build

创建 production build：

```bash
npm run build
```

Build 会验证 Next.js 应用、本地化 routes、TypeScript 代码以及 Server / Client Component 边界。

---

## 部署

作品集通过 Vercel 部署。

内容更新使用 Git 工作流：

```text
本地编辑
     ↓
检查 Git diff
     ↓
Git commit
     ↓
Git push
     ↓
Vercel rebuild
```

持久化内容写入仅限本地开发环境。

公开 Trial 在生产环境仍然可用，但不会保存修改。

---

## 当前架构

```text
                  Git Repository
                        │
             ┌──────────┴──────────┐
             │                     │
        JSON 内容             Markdown 内容
             │                     │
             └──────────┬──────────┘
                        ↓
                     Next.js
                        │
        ┌───────────────┼────────────────┐
        │               │                │
    公开作品集        Trial CMS       本地 Dashboard
        │               │                │
        │          浏览器状态             ↓
        │                         Route Handlers
        │                                │
        │                         JSON / Markdown
        │                                │
        └────────────────┬───────────────┘
                         ↓
                        Git
                         ↓
                       Vercel
```

整个工作流程中，仓库始终是唯一内容来源。

## 作品集的发展历史

我的作品集项目最开始只有 HTML 和 CSS。

在学习期间掌握 React 后，我把网站迁移到了 React。

后来我遇到了一个与 JavaScript 有关的问题：当浏览器禁用 JavaScript 时，网站无法正常显示。

因此，我后来又把项目迁移到了 Astro。

差不多在同一时期，我加入了 Blog 功能，用于发布和分享文章。

但随着 Blog 内容越来越多，我发现手动管理这些内容非常麻烦。

为了解决这个问题，我使用 C# 开发了自己的 CMS。

随着项目继续演进，我希望进一步简化整体架构，因此后来用基于 React 的方案替代了 C# CMS，并移除了 Blog 功能。

与此同时，我还发现了另一个性能方面的问题。

网站有时会先渲染 HTML，然后才加载 CSS。

在较慢的网络环境中这一点尤其明显，因为用户可能会短暂看到一个没有样式的页面。

我尝试过把 CSS 直接放入 HTML，让两者一起传输，但这并没有解决问题。

后来我了解到 Next.js 支持 server-side rendering，并且即使浏览器禁用了 JavaScript，也仍然可以向用户返回已经渲染好的 HTML。

因此，我最终决定把网站从 Astro 迁移到 Next.js。

## Lighthouse 结果 — Astro（移动端）

**First Contentful Paint:*- 0.8 s

**Largest Contentful Paint:*- 0.8 s

**Total Blocking Time:*- 0 ms

**Cumulative Layout Shift:*- 0

**Speed Index:*- 0.8 s

**Performance:*- 100

**Accessibility:*- 94

- 背景色和前景色的对比度不足。

**Best Practices:*- 100

**SEO:*- 100

**Agentic Browsing:*- 2/2

这里没有列出桌面端结果，因为桌面端性能本身已经优于移动端。

## Lighthouse 结果 — Next.js（移动端）

**First Contentful Paint:*- 1.2 s

**Largest Contentful Paint:*- 2.1 s

**Total Blocking Time:*- 40 ms

**Cumulative Layout Shift:*- 0

**Speed Index:*- 3.9 s

**Performance:*- 97

- 存在部分未使用的 JavaScript。

**Accessibility:*- 96

- 背景色和前景色的对比度不足。

**Best Practices:*- 100

**SEO:*- 100

**Agentic Browsing:*- 2/2

## 后续改进

我的下一个目标是在继续保留新架构优势的同时，尽可能将 Next.js 版本的性能优化到接近 Astro 版本。

---

## 后续改进

- 提升性能
- 改进 SEO
