## 概述

这是一个多语言个人作品集，同时也是一个轻量级、基于 Git 的内容管理系统。项目通过本地化路由和多语言内容支持英语、瑞典语和中文。About、Projects、Skills 和 Education 等结构化个人资料内容都维护在多语言 JSON 文件中，这些文件存储在 GitHub 上，并作为唯一事实来源（Single Source of Truth）[^1]。

项目还提供了一个本地 Dashboard，用于直接编辑底层 JSON 源文件。

## 问题

一个多语言作品集包含多种需要保持清晰组织并方便维护的内容。在这个项目中，CV 内容和 UI/CMS 界面文本都支持英语、瑞典语和中文。

这个项目的目标是：

> 让作品集能够快速说明我是谁、我做过什么，以及用户应该去哪里获取更详细的信息。

## 权衡

### 移除技术博客和项目 Case Study

早期版本的作品集包含多语言技术博客，并且每个项目还有独立的 Case Study。随着项目持续演进，我发现自己需要同时维护过多的文档。

每次更新项目时，我都需要编写和修改 README、Case Study，以及对应的技术博客文章。即使有 ChatGPT 的帮助，这依然很繁琐，也违背了这个项目本身希望降低维护成本的目标。

因此，我移除了技术博客和项目 Case Study。

现在作品集主要围绕以下内容：

- About -> 我是谁
- Skills -> 我正在使用和学习哪些技术
- Projects -> 我做过什么
- Live Demo -> 项目当前实际效果
- GitHub -> 源代码、技术文档和开发历史
- LinkedIn -> 职业写作和沟通

## 为什么使用 JSON

大多数作品集数据都是规模较小、结构化并且关系较少的内容，例如 About、Projects、Skills 和 Education。这些内容通常只需要加载一次，然后直接用于页面渲染。

当前项目并不需要复杂查询、关系型数据建模、实时同步或多人并发编辑。

在这种规模下，JSON 提供了一个简单直接的内容模型，同时也能很好地配合 next-intl 使用的多语言目录结构。

## 为什么使用 Next.js

这个项目的早期版本也使用过 Astro，并且 Astro 版本在性能上略快于当前的 Next.js 版本。

不过，由于我计划未来继续使用 Next.js，因此最终选择使用 Next.js 来构建这个项目。

| Lighthouse 测试（Mobile） | Astro | Next.js（React） |
| --- | ---: | ---: |
| First Contentful Paint | 0.8 s | 1.2 s |
| Largest Contentful Paint | 0.8 s | 1.5 s |
| Total Blocking Time | 0 ms | 270 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 0.8 s | 1.9 s |

## 共享 UI 系统

UI 架构将职责划分为三个层次：

- shadcn/ui 提供 UI primitives
- Tailwind CSS 负责组件样式和页面布局
- CSS variables 定义设计令牌（design tokens），并处理不适合直接用 Tailwind 表达的情况

共享 UI 逻辑遵循 DRY（Don't Repeat Yourself）原则，将真正共享的知识[^2]和行为[^3]集中在单一事实来源中。

## 响应式设计

作品集使用一个由共享 CSS 设计令牌驱动的 media-query-driven responsive system。

组件直接消费响应式尺寸 token，而不需要自己依赖具体 viewport breakpoint。

在较大的 breakpoint 下，系统会有针对性地增强大屏布局，而不是对整个界面进行统一缩放。

页面不会依赖全局 `zoom`、`scale` 或其他整页变换。相反，各个元素会通过 CSS variables 和 media-query overrides 独立适配。

这种方式可以在手机、平板、笔记本、Full HD、QHD 以及更大尺寸的显示器上保持良好的可读性和视觉平衡。

[^1]: Single source of truth（单一事实来源）指的是：系统中存在一个权威位置，用来维护最准确、最新的信息。
[^2]: Knowledge（知识）：系统需要知道的规则、定义、配置和事实。
[^3]: Behavior（行为）：系统执行的可复用逻辑或处理过程。
