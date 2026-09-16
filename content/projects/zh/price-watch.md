---
lang: zh
title: "Price Watch"
description: "一个本地优先的商品价格监控与 AI 购物辅助应用，使用 React、TypeScript、ASP.NET Core、Python、Playwright、FastAPI 和 Ollama 构建，支持多店铺价格追踪、价格历史、规格归一化、自动化运行、邮件通知和本地 AI 价格分析。"
status: "v.1.2.0"
order: 2
technologies:
 - "React"
 - "TypeScript"
 - "Vite"
 - "Tailwind CSS"
 - "shadcn UI"
 - "ASP.NET Core"
 - ".NET 10"
 - "Python"
 - "Playwright"
 - "Pydantic"
 - "FastAPI"
 - "Ollama"
 - "Windows Task Scheduler"

links:
  github: "https://github.com/jiantaoshen/PriceWatch"

draft: false

---

## 项目概览

Price Watch 是一个本地优先的商品价格监控与购物决策辅助系统。应用由 React 和 TypeScript 前端、ASP.NET Core 本地 API、Python Playwright 价格抓取模块、FastAPI AI 服务、Ollama 本地模型以及本地 JSON 数据层组成。

用户可以管理监控商品和多个商店来源，自动或手动维护价格，比较不同包装规格的实际价格、单位价格和归一化价格，查看价格历史、运行状态和目标价格，并通过本地 AI 购物顾问分析当前价格是否值得购买。

## 要解决的问题

不同电商网站可能以不同包装数量销售同一商品，仅比较页面上的商品总价无法得到公平结果。系统需要同时处理包装数量、单位价格和统一比较数量，才能正确判断哪个来源更便宜。

网页价格抓取还会受到动态页面、结构变化、缺少结构化价格数据以及异常价格等因素影响。为了降低长期维护成本，系统需要避免为每个网站维护独立的 CSS Selector 和专用抓取逻辑。

完整的价格监控系统还需要处理商品配置、价格历史、目标价格、异常检测、自动调度、邮件通知和运行状态，而不仅仅是执行一次网页抓取。

在价格监控基础上，项目还需要让本地 AI 能够使用系统中的真实价格和历史数据辅助购买决策，同时避免由前端直接提供或修改价格事实。

## 解决方案

项目将前端界面、应用 API、价格抓取、数据处理和 AI 服务拆分为独立职责。

React 前端只通过 ASP.NET Core 的 `/api/ -` 接口访问应用数据。ASP.NET Core 负责商品配置、运行数据、历史数据、自动化、邮件设置、scraper 调度以及 AI 商品上下文。

Python 使用 Playwright 加载商品页面，并从 Product JSON-LD 中提取价格。系统不维护商店专用 scraper。对于无法可靠提供 Product JSON-LD 的来源，可以关闭自动抓取并配置手动价格。

系统根据来源的包装数量计算单位价格，并通过商品级 `comparison_quantity` 将不同包装规格转换到相同数量后进行比较。

AI 功能通过独立的 FastAPI 服务连接本地 Ollama。React 只发送 Advisor、商品 ID 和聊天消息，ASP.NET Core 根据商品 ID 从本地配置、最新价格和历史数据中构建真实的 Product Context，再交给 FastAPI 和 Ollama 分析。

## 核心功能

### 商品价格监控

每个商品可以配置多个商店来源。自动来源通过 Playwright 加载页面并读取 Product JSON-LD，手动来源直接使用配置的 `manual_price`。

商品和来源都可以独立控制是否启用自动抓取。商品级抓取关闭后，该商品的所有来源都会使用手动价格，并且不会打开商店页面。

### JSON-LD 价格提取

自动抓取只使用 Schema.org Product JSON-LD。

如果页面没有提供可用的 Product JSON-LD，该来源会被视为抓取失败，而不会进入 DOM fallback 或商店专用提取逻辑。

这种设计减少了针对不同网站维护 CSS Selector 和专用 scraper 的复杂度。

### 商品管理

通过 React 界面和 ASP.NET Core API 可以新增、修改和删除监控商品，并管理多个商店来源、抓取模式、手动价格、包装数量、目标价格和比较数量。

### 多店铺价格比较

每个来源可以配置 `unit_quantity`。系统通过实际价格除以包装数量计算单位价格。

商品可以进一步配置 `comparison_quantity`，将不同包装规格转换到统一数量进行比较。

例如一个来源销售 2 件装，另一个来源销售 1 件装，系统可以将两者统一换算成 2 件商品的 Comparable Total，从而避免直接比较包装总价造成误判。

### 价格历史

成功的价格结果会保存为本地历史数据，并在 Dashboard 和商品详情页面展示当前价格、历史价格、价格统计和历史趋势。

失败或 Suspicious 的价格不会作为正常成功价格写入历史记录。

### 目标价格

每个商品可以设置目标总价和目标单位价格。系统可以识别当前价格是否达到目标，并将目标状态用于 Dashboard、通知和 AI 分析。

### 异常价格检测

系统会对异常幅度的价格变化进行验证，并将可疑结果标记为 `Suspicious`，降低错误价格、异常结构化数据或其他不可靠结果被接受的风险。

### 运行状态

系统记录每次 scraper 的运行结果，并在应用中显示最新运行状态。

商品可以处于 `Not run yet`、`Success`、`Failed` 或 `Suspicious` 状态。

用户可以通过 Run Now 手动执行价格检查。

### 邮件通知

Price Watch 可以在商品达到目标价格、出现异常价格或 scraper 运行失败时发送邮件通知。

通知状态保存在本地，用于减少同一状态下的重复提醒。

### 自动化调度

ASP.NET Core 可以通过 Windows Task Scheduler 管理自动价格检查任务，同时保留手动 Run Now 功能。

### 本地 AI Shopping Advisor

Price Watch 集成 FastAPI 和 Ollama，提供本地运行的 AI Shopping Advisor。

不同 Advisor 使用不同的购买策略，例如更谨慎、平衡价值或更关注历史低价，但所有 Advisor 使用相同的 Price Watch 真实价格数据。

### Product-Aware AI Chat

AI Chat 可以选择一个或多个已经由 Price Watch 监控的商品。

React 只发送 `advisorId`、`productIds` 和聊天消息。ASP.NET Core 根据商品 ID 从商品配置、最新价格和历史数据中构建 AI Product Context。

AI 可以使用当前价格、目标价格、上一价格、历史最低价、历史最高价、历史平均价和近期价格记录辅助判断。

### Ask AI

商品详情页面提供 Ask AI 功能。

点击后会进入 AI Chat，并自动将当前商品加入 Considering 列表。用户可以直接询问当前商品是否值得购买。

AI 可以根据现有价格数据给出 `BUY`、`WAIT` 或 `NEUTRAL` 等建议，并使用与用户最新消息相同的语言回复。

## 挑战与决策

### 不同网站的价格结构

不同电商网站的页面结构变化频繁。项目最终选择使用通用的 Product JSON-LD，而不是维护大量针对单个网站的 scraper、CSS Selector 或 DOM fallback。

对于无法可靠提供 Product JSON-LD 的网站，则通过手动价格继续参与 Price Watch。

### 不同包装规格的公平比较

不同商店可能销售不同包装数量的同一商品，因此直接比较商品总价容易产生错误结论。

系统引入 `unit_quantity`、单位价格和 `comparison_quantity`，将不同来源转换到统一数量后计算 Comparable Total。

### 避免错误价格

自动抓取到的价格不一定可靠，因此系统在保存历史记录前执行价格验证。

异常结果会被标记为 `Suspicious`，而不是直接作为正常价格进入历史数据。

### 商品配置与运行数据分离

商品配置保存在 `products.json`，最新运行结果和历史记录使用独立的数据文件。

Dashboard 将商品配置与最新运行结果合并，因此新创建但尚未运行的商品也可以立即显示为 `Not run yet`。

### AI 数据可信边界

前端不直接向 AI 提供当前价格或历史价格作为权威事实。

React 只发送商品 ID，ASP.NET Core 根据本地 Price Watch 数据生成 Product Context，再传递给 FastAPI 和 Ollama。

这样可以让不同 Advisor 使用统一且受后端控制的价格事实。

### 本地应用职责分离

项目在 React、ASP.NET Core、Python scraper、FastAPI、Ollama 和本地 JSON 数据之间保持清晰边界。

React 负责 UI，ASP.NET Core 负责应用 API 和服务调度，Python 负责价格抓取与处理，FastAPI 负责 AI Prompt 和模型通信，Ollama 负责本地模型推理，本地 JSON 负责轻量级持久化。

## 部署

Price Watch 采用本地优先架构。

项目通过 PowerShell 启动脚本检查 Node.js、npm、.NET 和 Python 环境，并根据需要安装前端依赖、创建 Python virtual environment、安装 scraper 和 AI dependencies、安装 Playwright Firefox、恢复 ASP.NET Core dependencies，并启动 FastAPI、ASP.NET Core 和 Vite。

Python scraper 和 AI 服务使用独立的 virtual environment。

Ollama 作为独立的本地运行时运行。

运行数据、历史数据、商品配置、设置和 scraper 状态均保存在本地 JSON 文件中，并通过 Windows Task Scheduler 实现自动化调度。

## 未来更新

接下来会把以前做的资产管理项目也合并到这个项目中。之后根据合并后的资产数据的大小决定是否继续合并其他项目，还是需要换到PostgreSQL还是优化AI。

## 额外

关于这个项目，但又没那么重要的详细文章写在这里。

### FAST API 的使用
FastAPI 是一个 Python Web API 框架。它负责接收和发送来自ASP.NET Core到Ollama的advisorId，products，messages。我用 FastAPI 的主要原因，是因为 AI 这一层本来就是 Python，而 FastAPI 很适合把 Python AI 逻辑快速包装成 HTTP API。像 prompt_builder.py、advisor.py、Pydantic 数据模型都可以直接留在 Python 里。

> 能不能用 ASP.NET Core 代替？

当然可以，但是暂时不推荐。因为如果项目在后期大量使用 Python AI 库，比如：LlamaIndex，FAISS。那么使用 Python AI 库会比ASP.NET Core 更好。而后期这个项目也会追加RAG。

### 项目背景
我的目标是成为高级全栈工程师。根据AI的判断，高级全栈工程师需要会管理大型项目和遗留代码。这个项目因此诞生。因为在Lexicon学习网页开发时做了很多管理类的项目，因此，我把Github的旧项目的代码当成遗留代码，把它们尽可能地合并成一个项目。这也是为什么Github有一些代码消失了。当它们合并到这个项目之后，除了一些还在维护或需要展示的项目外，我把它们全删了。这个项目暂时合并了一些ai和从网上fetch数据的项目。未来会合并更多的项目，让这个商品追踪最终成为一个管理资产和订阅的AI管家。它会告诉你什么商品减价，什么商品值得买，和管理已经购买了的商品和订阅。后期也会加入RAG系统管理已经签了的协议和对某个商品的评价。

> 为什么做商品价格追踪？

因为如果是价格追踪的话，我也是用户。我现在也经常使用价格追踪来判断哪些商品要买。如果我觉得缺少哪个功能的话，我可以添加上去。这样就形成了一个简单的用户使用体验。同时也形成了一个更新和维护的后期管理。这能提高我的管理技能。比其他按要求制作，然后在仓库里吃灰的项目好很多。

### 为什么各个语言的文章写法都不一样？
文章的生成流程为：

> AI 生成 -> 自己检查内容 -> AI 翻译 -> 自己检查内容

同时因为现在还在摸索期，所以我自己修改过的文章会有各种语言会有不同的写法。但内容是一样的。会有不同写法是因为我在找适合我的写法。如果你看到一些文章很像直译的文章，那么，那篇文章还在 AI 翻译阶段。



