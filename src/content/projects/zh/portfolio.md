---
lang: zh
title: "开发者作品集"
description: "一个使用 Astro、React、TypeScript 和 Tailwind CSS 构建的多语言开发者作品集，采用静态内容渲染、项目案例展示、公开 Dashboard 试用模式和单进程本地内容管理工作流。"
status: "Live"
order: 3
technologies:
  - "Astro"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "Astro Content Collections"
  - "Markdown"
  - "Vercel"
links:
  github: "https://github.com/jiantaoshen/portfolio-dev"
  live: "https://www.jiantao.dev"
draft: false
---

## 概述

Developer Portfolio 是一个使用 Astro、React、TypeScript 和 Tailwind CSS 构建的多语言开发者作品集。

公开网站使用 Astro 根据 Markdown 和 JSON 内容生成静态页面。英语、瑞典语和中文版本共享同一套应用结构，同时使用各自独立的语言路由和内容。

项目案例通过 Astro Content Collections 以 Markdown 形式存储，而 About、Skills 和 Education 等结构化个人资料内容则使用多语言 JSON 维护。

该项目还包含两种 Dashboard 模式：一个用于体验编辑器的公开 Trial 界面，以及一个集成到 Astro 开发服务器中、用于管理作品集源文件的本地 Dashboard。

最终形成的是一个静态生产网站，通过轻量级、基于 Git 的内容工作流进行管理，而不需要生产环境数据库或 CMS。

## 问题

一个多语言作品集包含多种需要保持有序并易于更新的内容。

项目包括：

- About 和 CV 信息
- Skills 和 Education
- 项目案例
- 英语、瑞典语和中文内容

当内容规模较小时，直接编辑源文件是可行的。但随着结构化内容和较长的项目案例不断增加，直接维护这些文件会逐渐变得不够方便。

与此同时，公开作品集本质上是一个静态网站。为了只在网站重新构建时才发生变化的内容，引入生产数据库和长期运行的后端服务会增加没有必要的基础设施复杂度。

因此，该项目的目标是在保持公开网站静态化的同时，提供一种更方便的方式来管理 Markdown 和 JSON 内容。

## 解决方案

作品集采用 content-to-code 架构。

项目案例以 Markdown 形式存储，并通过 Astro Content Collections 进行验证。About、Skills 和 Education 内容则存储为多语言 JSON。

```text
JSON / Markdown
       ↓
     Astro
       ↓
 Static Build
       ↓
    Vercel
```

Astro 在构建过程中读取这些源文件，并生成公开作品集。

为了进行内容管理，项目在这些相同的源文件之上增加了一个基于 React 的 Dashboard。

公开的 `/trial` 路由提供一个沙盒版本的编辑器，其中的修改只存在于浏览器状态中。

本地的 `/dashboard` 路由通过 Astro/Vite 开发服务器中的 development-only middleware 直接更新作品集中的 JSON 和 Markdown 文件。

```text
Dashboard
   ↓
Astro / Vite dev middleware
   ↓
JSON / Markdown
   ↓
Git commit
   ↓
Vercel rebuild
```

这种方式让 Git 继续作为内容的唯一事实来源，同时提供可视化的内容编辑工作流。

它也简化了本地开发环境：作品集、Dashboard 和内容编辑 middleware 都通过同一个 `npm run dev` 进程运行。

## 功能

### 静态 HTML 优先的作品集

公开作品集使用 Astro 构建，并以静态内容形式生成。

Markdown 和 JSON 在构建过程中被转换为页面，使部署后的网站保持轻量，同时非常适合作为展示开发者信息和工程项目案例的平台。

### 多语言支持

作品集支持英语、瑞典语和中文。

每种语言使用独立的静态路由：

```text
/en/
/sv/
/zh/
```

项目内容也使用相同的语言路由结构：

```text
/en/projects/
/sv/projects/
/zh/projects/
```

这样可以让网站共享模板和组件，同时保持不同语言内容彼此独立。

### Project Content Collections

项目案例存储在按语言划分的 Markdown 目录中。

```text
src/
└── content/
    └── projects/
        ├── en/
        ├── sv/
        └── zh/
```

Astro Content Collections 用于验证和管理这些 Markdown 内容。

Frontmatter 保存项目状态、技术栈和链接等结构化元数据，而 Markdown 正文则包含完整的项目案例内容。

### 多语言 JSON 内容

About、Skills 和 Education 内容使用多语言 JSON 存储。

语言文件组织在：

```text
src/i18n/locales/
├── en/
├── sv/
└── zh/
```

这种方式将结构化个人资料信息与较长的项目内容分开，同时让两种内容形式都保留在同一个代码仓库中。

### Public Trial 模式

作品集提供一个公开的 Dashboard 沙盒：

```text
/trial
```

访问者可以体验编辑界面，并直接在浏览器中修改内容。

这些修改只存在于浏览器状态中，不会写入任何源文件。

刷新页面后，Trial 内容会恢复到初始状态。

### 本地 Content Dashboard

本地开发环境还提供一个独立的 Dashboard：

```text
/dashboard
```

它提供一个基于 React 的界面，用于在开发过程中管理作品集内容。

Dashboard 支持多语言内容管理和项目编辑。

Project 编辑器提供独立的 `Edit` 和 `Preview` 视图，因此可以在更新源文件之前先检查 Markdown 的最终显示效果。

### Development-Only 内容编辑 Middleware

本地 Dashboard 与注册在 Astro/Vite 开发服务器中的 development-only middleware 通信。

它不使用数据库，而是直接编辑 Astro 所使用的 JSON 和 Markdown 文件。

该 middleware 只在本地开发环境中运行。

内容编辑 API 与 Astro 开发服务器运行在同一个进程中，因此不再需要单独的后端服务、端口或代理配置。

生产构建不会暴露能够持久化写入源文件的 API。

### 响应式界面

作品集和 Dashboard 布局使用 Tailwind CSS 构建。

界面针对桌面设备和较小屏幕进行了适配，同时在页面和组件之间复用统一的样式模式。

## 架构

该项目将公开网站渲染与本地内容管理分离。

### 公开网站

```text
Markdown / JSON
      ↓
    Astro
      ↓
 Static HTML
      ↓
   Vercel
```

部署后的作品集在构建过程中读取内容，并生成完全静态的网站。

公开 Trial 同样包含在静态部署中，但其中的修改只保留在浏览器状态中，不会写回仓库文件。

### 本地内容管理

```text
React Dashboard
       ↓
Astro / Vite dev middleware
       ↓
Markdown / JSON
       ↓
      Git
       ↓
 Astro Build
       ↓
    Vercel
```

Dashboard 作为公开网站所使用的相同源文件之上的可视化编辑层。

内容编辑 middleware 只在 `astro dev` 期间运行，不属于生产环境的服务器架构。

## 关键决策

### 将内容保留在 Git 中

Markdown 和 JSON 继续作为作品集内容的唯一事实来源。

这样可以让内容与应用代码保存在同一个仓库中，并让内容变更遵循与项目其他部分相同的 Git 工作流。

同时，Astro 可以在每次构建时直接根据仓库中的内容生成完整网站。

### 使用 Astro/Vite Development Middleware

内容编辑器只需要在本地开发时拥有文件写入能力。

因此，与其继续维护一个独立的后端应用，编辑器 API 被实现为现有 Astro/Vite 进程中的 development-only middleware。

这将本地开发环境从两个进程减少为一个：

```text
迁移前

Astro / Vite
+
ASP.NET Core
```

```text
迁移后

Astro / Vite
├── Portfolio
├── Dashboard
└── Local content editor middleware
```

这样既保持了生产环境的静态架构，也移除了不再需要的本地运行时、额外端口和代理配置。

新的 middleware 仍然保留了旧实现中的重要内容管理行为，包括内容验证、安全路径处理、原子写入、项目重命名、语言移动、目标文件冲突保护和文件删除。

### 分离 Trial 和本地 Dashboard 模式

项目针对不同用途提供了两个版本的编辑体验。

```text
/trial
```

是公开且非持久化的。

```text
/dashboard
```

则用于本地开发，并且可以通过 development-only content editor middleware 更新真实的源内容。

这样既可以公开展示 Dashboard，又不需要暴露任何能够持久化写入源文件的功能。

### 为不同内容类型使用 Markdown 和 JSON

项目案例使用 Markdown，而 About、Skills 和 Education 等结构化个人资料内容使用 JSON。

这样可以让每种内容使用更符合其编辑和渲染方式的数据格式。

### 删除 Blog

作品集的早期版本包含一个多语言技术 Blog。

长期维护多语言文章带来了较高的内容维护成本，但对作品集最核心的目标——展示软件项目和工程能力——实际贡献有限。

因此，与其继续扩展 Blog 并将其发展成一个更复杂的发布系统，我选择将其删除。

如果技术写作的目的是获得职业曝光，那么 LinkedIn 等已经拥有专业网络和内容分发机制的平台更加合适。

与具体项目相关的工程决策、架构变化和技术取舍则继续保留在 Project Case Studies 中，因为这些内容能够直接支持和解释所展示的项目。

因此，作品集可以更加专注于它最重要的职责：

```text
About
→ 我是谁

Skills
→ 我使用什么技术

Projects
→ 我构建过什么

Project case studies
→ 系统是如何设计和演进的

GitHub
→ 源代码和开发历史

LinkedIn
→ 专业技术写作和公开交流
```

删除 Blog 同时减少了重复内容、翻译工作和长期维护成本，而不会失去作品集中真正重要的工程能力证据。

## 开发

安装前端依赖：

```bash
npm install
```

启动作品集和本地内容编辑器：

```bash
npm run dev
```

开发环境现在只运行一个 Astro/Vite 进程：

```text
Astro / Vite
├── Portfolio
├── Dashboard
└── Local content editor middleware
```

默认本地地址：

```text
http://localhost:4321
```

不再需要启动单独的后端进程。

## 部署

公开作品集部署在 Vercel。

Astro 将 Markdown 和 JSON 内容构建为静态网站。

development-only content editor middleware 不属于生产部署，因此部署后的作品集不会暴露能够写入仓库源文件的 API。

公开 Trial 仍然可以在生产环境中使用，但所有修改都只保留在浏览器状态中。

内容更新遵循基于 Git 的流程：

```text
本地编辑内容
     ↓
Git commit
     ↓
Vercel rebuild
```

这样可以让部署后的网站保持完全静态，同时让所有作品集内容继续通过 Git 进行版本管理。

## 未来改进

- 改进 Dashboard 的编辑体验和内容验证
- 随着项目持续演进，继续完善 Project Case Studies
- 改进架构图和项目可视化
- 增加更丰富的结构化 SEO 元数据
- 持续改善无障碍访问
- 持续改善性能
- 在维护成本超过实际价值时，继续简化内容工作流