## 概述

这是一个多语言个人作品集和轻量级、基于 Git 的内容管理系统，使用 Next.js 16、TypeScript、Tailwind CSS v4、shadcn/ui 和 next-intl 构建。

公开网站通过不同语言的路由和内容支持英语、瑞典语和中文。“关于我”“项目”“技能”和“教育经历”等结构化个人资料内容使用多语言 JSON 维护。

项目提供两种内容编辑方式：

- 一个公开的 Trial 模式，用于体验 CMS 界面，但不会永久保存修改
- 一个本地 Dashboard，用于在开发过程中直接编辑仓库中的实际 JSON 源文件

当前架构继续以 Git 作为唯一事实来源，不使用生产环境内容数据库，并由同一个 Next.js 应用负责公开页面渲染、CMS 界面、本地化以及仅用于开发环境的内容 API。

Portfolio 本身不再承担完整项目文档的职责。每个项目只保留简短介绍、技术栈、GitHub 和 Live Demo 等核心信息，更详细和变化更频繁的技术内容则由对应项目自己的 GitHub repository 维护。

## 问题

一个多语言作品集包含多种类型的内容，需要保持良好的组织结构并且易于维护。

这个项目包含：

- 关于我和简历信息
- 技能和教育经历
- 项目信息
- 英语、瑞典语和中文内容
- 公开 UI 的翻译
- CMS 界面的翻译

早期版本还包含长篇 Project Case Study。每个 Case Study 会记录项目的架构、功能、技术选择和开发过程。

这种方式在项目数量较少、项目变化不频繁时可以工作，但随着项目持续开发，一个新的问题逐渐出现：

同一份项目信息开始同时存在于多个地方。

例如，当一个项目新增功能或改变架构时，我可能需要同时更新：

```text
实际项目
↓
GitHub README
↓
Portfolio Project 信息
↓
Portfolio Case Study
↓
不同语言版本
```

Case Study 因此逐渐从“展示项目设计过程”变成了另一份需要同步维护的项目文档。

对于持续开发中的项目来说，这会产生明显的维护成本。如果每次增加一个 feature、修改技术栈或改变架构，都需要同步修改 Portfolio 中的长篇 Case Study，那么维护 Portfolio 本身就开始占用原本可以用于开发项目的时间。

与此同时，这个作品集并不需要传统的生产环境 CMS。内容更新频率相对较低，而且这些内容本来就适合与应用代码放在一起。

引入数据库、身份验证系统、托管 CMS 和永久写入 API 会增加额外基础设施，而带来的价值有限，成本却较高。

因此，我的目标逐渐从：

> 在 Portfolio 中保存完整的项目文档

变成：

> 让 Portfolio 快速说明我是谁、做过什么，并把用户引导到最适合查看详细信息的地方。

## 结果

现在，作品集使用一个统一的 Next.js App Router 应用。

核心内容流程有意保持简单：

```text
JSON
 ↓
Next.js
 ↓
公开作品集
 ↓
Vercel
```

“关于我”“项目”“技能”和“教育经历”等内容统一保存在多语言 JSON 中。

项目本身只保存相对稳定的信息，例如：

```text
Title
Description
Status
Technologies
GitHub URL
Live Demo URL
```

Portfolio 不再保存单独的长篇 Project Case Study。

在本地开发时，Dashboard 会直接操作这些相同的 JSON 源文件：

```text
本地 Dashboard
      ↓
Next.js Route Handlers
      ↓
     JSON
      ↓
   Git diff
      ↓
 Git commit
      ↓
   Vercel
```

公开的 `/trial` 路由使用相同的编辑界面，但所有修改只保存在浏览器或应用 state 中。

Trial 模式不会执行任何永久写入操作。

这样既能保持 Git 作为唯一事实来源，也能提供可视化的内容管理流程。

## 权衡与取舍

这里我会说明我在项目中做出这些选择的原因。

### 多语言作品集

我创建多语言作品集的原因，是希望同时提高自己的语言能力和文档编写能力。

缺点是所有需要翻译的内容都会增加维护成本。

如果一段内容同时存在英语、瑞典语和中文三个版本，那么每增加一段长期维护的内容，实际维护量接近增加三份。

这也是后来移除长篇 Case Study 的重要原因之一。

目前作品集保留的内容相对简短，而且变化频率较低，因此多语言结构仍然可以接受。

如果未来 Portfolio 的内容规模再次明显扩大，我可能会重新评估是否仍然需要所有内容都提供三种语言。

### 为什么我选择 Next.js

> HTML/CSS -> React -> Astro -> Astro + C# -> Astro + React -> Next.js（现在）

我的作品集项目最初只使用 HTML 和 CSS。

在学习期间接触 React 之后，我把网站迁移到了 React。

后来我遇到了一个与 JavaScript 有关的问题：当浏览器禁用 JavaScript 时，网站无法正常显示。因此，我最终把项目迁移到了 Astro。

大约在同一时期，我还加入了博客功能，用来发布和分享自己的文章。

不过，随着博客内容增加，我发现手动管理这些内容越来越困难。为了解决这个问题，我使用 C# 开发了自己的 CMS。

随着项目继续发展，我希望简化整体架构，因此用基于 React 的方案替换了 C# CMS，并移除了博客功能。

我还发现了另一个性能问题：网站有时会先渲染 HTML，然后再加载 CSS。在较慢的网络连接下尤其明显，因为用户会短暂看到没有样式的页面。

我尝试把 CSS 直接放进 HTML 中，让两者可以一起发送，但这并没有解决问题。

后来我了解到，Next.js 支持服务端渲染，即使浏览器禁用了 JavaScript，也仍然可以发送已经渲染好的 HTML。

因此，我决定把网站从 Astro 迁移到 Next.js。

Lighthouse 测试结果比 Astro 差一些，而且使用 `.vercelignore` 也无法减少部署中使用的 JavaScript 代码。不过，用户体验更好。

对我来说，更好的用户体验比单纯追求速度更重要。

#### Lighthouse 结果 — Astro（移动端）

**First Contentful Paint:** 0.8 s

**Largest Contentful Paint:** 0.8 s

**Total Blocking Time:** 0 ms

**Cumulative Layout Shift:** 0

**Speed Index:** 0.8 s

**Performance:** 100

**Accessibility:** 94

- 背景色与前景色之间的对比度不足。

**Best Practices:** 100

**SEO:** 100

**Agentic Browsing:** 2/2

我没有列出桌面端结果，因为桌面端的性能本来就优于移动端。

#### Lighthouse 结果 — Next.js（移动端）

**First Contentful Paint:** 1.2 s

**Largest Contentful Paint:** 1.5 s

**Total Blocking Time:** 270 ms

**Cumulative Layout Shift:** 0

**Speed Index:** 1.9 s

**Performance:** 95

- 有一部分 JavaScript 没有被使用。

**Accessibility:** 96

- 背景色与前景色之间的对比度不足。

**Best Practices:** 100

**SEO:** 100

**Agentic Browsing:** 2/2

### 为什么使用 JSON

当前 Portfolio 中的大部分数据都是规模较小的结构化内容，而且数据之间没有复杂关系。

例如：

```text
About
Projects
Skills
Education
```

这些数据通常只需要读取一次，然后直接用于页面渲染。

我们不需要：

- 复杂查询
- 数据之间的关系管理
- 实时数据同步
- 多用户并发编辑

因此，对于目前的数据规模来说，JSON 足够简单，也更容易与 next-intl 的多语言内容结构配合。

早期版本中，较长的 Project Case Study 使用 Markdown。

Markdown 很适合长篇文档，因为它比大型 JSON 字符串更容易阅读和编写。

但是，在移除 Case Study 后，Portfolio 已经没有大量需要单独使用 Markdown 管理的长篇内容，因此继续维护一套 Markdown loader、schema、dynamic route 和 editor 已经没有太大价值。

删除这部分后，内容模型也变得更加统一：

```text
Portfolio content
      ↓
     JSON
```

### 为什么删除 Project Case Study 和 blog
Portfolio 的早期版本曾经包含一个多语言技术博客和为每个项目提供独立的 Case Study。

它们主要用于记录：

- 项目背景
- 技术选择
- 系统架构
- 实现过程
- 遇到的问题
- 后续改进

这个设计最初的目标，是让 Portfolio 不只是展示最终结果，也可以展示项目是如何设计和演进的。

但随着项目持续开发，我发现 博客和 Case Study 并不完全相同，但它们最终遇到了相似的问题：

```text
更多长篇内容
↓
更多翻译
↓
更多同步
↓
更多长期维护
```





#### 1. 与 GitHub README 重复

项目本身通常已经有 README。

README 更接近实际代码，而且可以随着代码一起更新。

例如：

```text
Architecture
Setup
Features
Technology stack
Deployment
Known limitations
```
如果这些内容同时出现在 GitHub README， blog 和 Portfolio Case Study 中，就会形成三个内容来源。没有同时更新时，它们还有可能描述不同版本的项目。因此，对技术细节来说，让项目自己的 repository 成为主要文档来源更加合理。

#### 2. Feature 更新导致额外维护

持续开发中的项目会不断变化。

例如：

```text
增加新的 authentication flow
增加新的 API
改变 database schema
增加新的 UI feature
改变 deployment architecture
```

这些变化本来只需要修改代码以及必要的 README。

但如果 Portfolio 中还有一份完整 Case Study，那么同样的信息还需要再更新一次。

在多语言 Portfolio 中，这个问题会进一步放大。

理论上的一次修改可能变成：

```text
Code
↓
README
↓
English Case Study
↓
Swedish Case Study
↓
Chinese Case Study
```

最终，我开始为了保持 Portfolio 文档同步，而额外维护多份描述同一个系统的内容。Blog也是同样道理。

这不符合我希望降低 Portfolio 维护成本的目标。

#### 3. Live Demo 已经可以展示产品结果

如果用户想知道项目实际是什么样子，Live Demo 是最直接的信息来源。

它展示的是当前正在运行的版本，而不是一个文字描述的历史快照。

因此：

```text
Portfolio
→ 项目的简短介绍

Live Demo
→ 项目现在是什么样子

GitHub
→ 项目是如何实现的
```

这三个入口已经可以承担不同职责。

继续加入 Case Study 会让 Portfolio 与 GitHub 之间出现越来越多重叠。

#### 4. Portfolio 的主要职责是筛选，而不是保存全部文档

维护多种语言的长篇文章会带来大量翻译和维护工作，但对作品集主要目的的帮助相对有限。如果技术文章的目标是提高职业曝光度，那么 LinkedIn 这类平台更加合适，因为它本身已经具备内容分发能力和职业场景。它不需要保存关于我的所有信息。它更重要的作用是，让第一次访问的人可以快速回答：

```text
这个人是谁？
↓
他主要使用什么技术？
↓
他做过什么项目？
↓
哪些项目值得进一步查看？
```

因此，Portfolio 更接近一个经过筛选的入口，而不是项目文档平台。

项目 Card 只保留足够帮助用户理解项目的信息：

```text
Title
Description
Technologies
Status
Live Demo
GitHub
```

如果用户对某个项目感兴趣，可以继续进入 GitHub 或 Live Demo。

这也让 Portfolio 的内容更加稳定。

只要项目的核心定位没有变化，即使内部增加了一些 feature，也通常不需要修改 Portfolio。

#### 5. 删除 Blog 和 Case Study 也简化了代码

Blog 和 Case Study 不只是内容成本，它们本身也各自需要一整套实现架构。移除它们后，这些代码都不再需要维护。

项目内容可以直接变成：

```text
projects[]
├── title
├── description
├── status
├── technologies
├── githubUrl
└── liveUrl
```

这样减少的不只是文档数量，也包括应用自身的复杂度。

因此，删除 Blog 和 Case Study 并不是因为它们完全没有价值，而是因为在这个 Portfolio 当前的规模和目标下：

> **它带来的额外信息价值已经低于长期维护它所需要的成本。**

更详细、变化更频繁的内容交给 GitHub；实际产品体验交给 Live Demo；Portfolio 则负责提供简洁、稳定和经过筛选的项目入口。

因此，现在 Portfolio 主要围绕以下内容展开：

```text
关于我
→ 我是谁

技能
→ 我使用和学习什么技术

项目
→ 我构建了什么

Live Demo
→ 项目现在是什么样子

GitHub
→ 源代码、技术文档和开发历史

LinkedIn
→ 职业写作和沟通
```

这样可以减少重复内容和翻译工作，同时让不同平台承担更明确的职责。



### 公开 Trial 模式

Trial 模式用于展示我开发的轻量级内容编辑界面。

在 Astro 版本中，这个功能相对容易创建和维护。不过，当前端和后端使用相同的编程语言和框架时，我需要重新考虑哪些编辑能力是真正有必要保留的。

目前 Trial 模式使用和本地 Dashboard 相同的 UI，但修改只存在于应用 state 中，不会写入仓库。

这个功能未来仍然可能根据项目的发展进行调整或移除。

### 本地内容 Dashboard

本地内容 Dashboard 可以让我更方便地编辑 JSON 内容，而不需要直接打开和修改原始 `.json` 文件。

目前它负责的内容包括：

```text
About
Projects
Skills
Education
```

把 Projects 合并到同一个内容编辑流程后，我不再需要独立的 Project CMS。

这减少了不同编辑页面、数据模型和 API 之间的重复逻辑。

### 仅用于开发环境的内容 API

本地 Dashboard 仍然需要一种方式把编辑结果写回仓库中的 JSON 文件。

因此，Next.js Route Handlers 负责开发环境中的文件读写。

这些 API 不用于生产环境中的实时内容管理。

整个流程仍然是：

```text
Dashboard
↓
Route Handler
↓
JSON
↓
Git
```

因为 Case Study 和 Project Markdown 已经被移除，API 所需要处理的数据类型也比之前更少。

如果未来 Dashboard 本身带来的维护成本也超过它的价值，我可能会进一步简化这一部分。

### 共享 UI 系统

共享 UI 系统让项目中的主题、CSS 样式和可复用 UI 元素更容易统一维护。

项目中的 UI 样式遵循明确的职责划分：

```text
shadcn/ui
└── UI primitives

Tailwind CSS
├── Component styling
├── Page layout
├── Responsive behavior
└── Local visual adjustments

CSS variables
├── Design tokens
├── Colors
├── Typography scale
├── Spacing
└── Responsive sizing

普通 CSS
├── Tailwind 不适合处理的特殊 CSS 能力
└── 需要 selector 的特殊情况
```

简单来说：

> **shadcn/ui 管 UI primitives；Tailwind CSS 管 component 和 layout；CSS variables 管 design tokens；普通 CSS 只处理 Tailwind 不擅长的特殊情况。**

这样可以避免把页面布局、设计系统和基础 UI 组件的职责混在一起。

例如，Button、Input、Card、Badge 和 Checkbox 等基础 UI 元素由 shadcn/ui primitive 负责；具体页面中的 Grid、Flex、Spacing 和 Responsive Layout 则使用 Tailwind；颜色、字体大小、间距尺度和响应式尺寸等设计规则通过 CSS variables 统一维护。

项目同时遵循 **DRY（Don't Repeat Yourself）** 原则，将真正共享的知识和行为保持在单一事实来源中。

这里的 **Knowledge** 和 **Behavior** 分别表示：

- **Knowledge（知识）**：系统需要知道的规则、定义、配置和事实。
- **Behavior（行为）**：系统执行某项操作时需要复用的逻辑或处理过程。

例如，项目支持哪些语言属于 Knowledge：

```ts
export const locales = ["en", "sv", "zh"] as const;

export type Locale = (typeof locales)[number];
```

如果在多个文件中分别写：

```ts
["en", "sv", "zh"]
```

以及：

```ts
type Locale = "en" | "sv" | "zh";
```

那么“系统支持哪些语言”这一份知识就出现了多个来源。

通过让 `Locale` 类型直接从 `locales` 推导，可以让支持语言的定义保持为单一事实来源。

Behavior 则更偏向可复用逻辑。

例如，把逗号分隔的字符串转换成数组：

```ts
export function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
```

如果不同 editor 都需要相同的处理逻辑，它们会共享这个 utility，而不是分别实现相同的代码。

项目中的 DRY 主要应用于这些真正共享的 Knowledge 和 Behavior，例如：

- Locale metadata 和 Locale type 集中维护
- Dashboard 中共享的表单 Field 结构
- 逗号分隔内容的共享解析逻辑
- Technology Badge 的共享语义组件
- Dashboard navigation 的共享 active/inactive variants
- Design tokens 的统一定义
- shadcn/ui primitive 中共享的 control styles 和 variants

不过，DRY 并不意味着必须消除所有看起来重复的代码。

例如两个不同组件可能都包含：

```tsx
<div className="flex flex-wrap gap-2">
```

如果它们表达的是不同的业务或设计概念，而且未来可能独立变化，那么没有必要仅仅因为 Tailwind class 相同就抽成一个共享组件。

因此，这个项目对 DRY 的理解是：

> **避免重复维护相同的知识和行为，而不是机械地消除所有重复代码。**

这样既能保持单一事实来源，也可以避免为了追求 DRY 而产生过度抽象。

### 将内容保存在 Git 中

JSON 仍然是 Portfolio 内容的唯一事实来源。

这样可以让作品集内容与应用代码一起进行版本控制。

因此，每一次永久性的内容修改都可以通过以下命令进行检查：

```text
git diff
```

确认后再提交。

整个流程保持为：

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

这种方式可以提供：

- 完整历史记录
- 方便回滚
- 可审查的内容修改
- 不需要 CMS 数据库
- 不需要单独的内容备份方案
- 内容与应用代码保持在同一个 repository

## 当前架构

```text
                    Git 仓库
                       │
                       ↓
                    JSON 内容
                       │
                       ↓
                    Next.js
                       │
       ┌───────────────┼────────────────┐
       │               │                │
   公开作品集        Trial CMS       本地 Dashboard
       │               │                │
       │          Browser state          ↓
       │                            Route Handlers
       │                                 │
       │                                JSON
       │                                 │
       └────────────────┬────────────────┘
                        ↓
                       Git
                        ↓
                     Vercel
```

在整个工作流程中，Git 仓库始终是唯一事实来源。

公开 Portfolio 负责展示经过筛选的信息，而不是复制完整的项目文档：

```text
Portfolio
   │
   ├── About
   ├── Skills
   ├── Education
   │
   └── Projects
        │
        ├── Live Demo
        │    └── 当前产品体验
        │
        └── GitHub
             ├── Source Code
             ├── README
             └── Development History
```

这种结构让 Portfolio 自身保持简单，同时避免为了展示项目而重复维护另一套不断变化的技术文档。