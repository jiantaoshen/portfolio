---
lang: zh

title: "LightManager"

description: "一个使用 React、TypeScript、ASP.NET Core 和 PostgreSQL 构建的个人任务管理应用，支持日常规划、基于日历的任务安排、JWT 身份验证、安全的 Trial 模式以及独立的云端部署。"

status: "Live"

order: 1
technologies:
  - "C#"
  - ".NET"
  - "ASP.NET Core"
  - "Entity Framework Core"
  - "PostgreSQL"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "React Router"
  - "Microsoft Azure"
  - "Vercel"
  - "Neon"

links:
  github: "https://github.com/jiantaoshen/LightManager"
  live: "https://lightmanager.jiantao.dev"

draft: false
---

## 项目概览

LightManager 是一个围绕简单日常工作流设计的个人任务管理应用。

用户可以快速创建任务、根据需要设置日期、指定优先级、查看当天任务，并通过日历规划未来的工作。

当前版本主要包括：

- Today
- 未安排日期的任务
- 基于日历的规划
- All Tasks
- 可选的截止日期
- 简单的任务优先级
- 响应式桌面和移动端布局
- 安全的公开 Trial 模式

前端使用 React、TypeScript、Tailwind CSS 和 shadcn/ui 构建。

后端使用 ASP.NET Core、Entity Framework Core 和 ASP.NET Identity，PostgreSQL 数据库托管在 Neon。

---

## 为什么改变产品方向

LightManager 最初是一个面向中小型团队的轻量级项目管理应用。

第一版包含：

- Projects
- Project members
- 基于角色的权限控制
- Task assignment
- Kanban 工作流
- 拖放式任务管理

虽然这些功能在技术上可以正常运行，但我发现自己实际上并不需要大部分团队协作流程。

这带来了一个重要的产品问题：我可以不断实现新功能，但无法真正判断这些功能在日常使用中是否有价值。

因此，我将项目方向从：

```text
Team Project Management
```

调整为：

```text
Personal Task Management
```

现在的应用围绕我自己实际使用的工作流构建，因此我可以持续使用、评估，并根据真实使用中的问题进行改进。

---

## 当前工作流

当前的 LightManager 以“可选日期安排”为核心。

```text
Create Task
    |
    +-- No due date
    |      |
    |      v
    |   Unscheduled
    |
    +-- Due today
    |      |
    |      v
    |    Today
    |
    +-- Future date
           |
           v
        Calendar
```

Today 页面是主要的日常工作区域：

```text
Today
├── Today's Tasks
└── Unscheduled
```

创建任务时不强制要求设置日期。

这样既可以快速记录任务，也可以在之后再决定什么时候完成。

---

## 优先级系统

LightManager 使用三个简单、直观的优先级：

```text
Must
Priority
Non-priority
```

后端目前仍保留原来的 enum 值：

```text
High   -> Must
Medium -> Priority
Low    -> Non-priority
```

任务会自动按照以下顺序排序：

```text
Must
  ↓
Priority
  ↓
Non-priority
```

相同优先级的任务按照创建时间排序，较早创建的任务显示在前面。

这一排序规则在应用中的各个任务视图中保持一致。

---

## Today

Today 页面是主要的日常任务工作区。

它显示：

- 今天安排的任务
- 未安排日期的任务
- 未完成任务
- 已完成任务

用户可以直接在 Today 页面创建有日期或无日期的任务。

这样可以把快速记录任务和每天的任务规划集中在同一个页面中完成。

---

## Calendar

Calendar 同时用于任务安排和快速查看每天任务的重要程度。

如果某一天存在未完成任务，该日期会显示一个颜色指示点，颜色由当天**最高优先级的未完成任务**决定。

```text
Green  -> Non-priority
Yellow -> Priority
Red    -> Must
```

例如：

```text
Only Non-priority tasks
        ↓
      Green

Includes Priority
        ↓
      Yellow

Includes Must
        ↓
       Red
```

已完成任务不会影响 Calendar 的颜色指示。

如果某一天的所有任务都已经完成，该日期的指示点会消失。

Calendar 页面还包含一个 **Unscheduled** 任务卡片，使没有日期的任务在规划未来工作时仍然可见。

---

## 导航

主导航有意保持精简。

### 桌面端

```text
LightManager

Today
Calendar

[Account]
```

### 移动端

底部导航只包含：

```text
Today     Calendar
```

其他操作通过头像菜单访问。

### Account Menu

点击头像后会打开：

```text
Account
├── Settings
├── All Tasks
└── Sign Out
```

All Tasks 被移出主导航，使 Today 和 Calendar 保持为两个主要工作区域。

手机端同样使用这个菜单，因此用户也可以方便地进行 Sign Out。

Trial 用户看到的是：

```text
Trial mode
├── All Tasks
└── Exit Trial
```

---

## Trial 模式

LightManager 提供一个公开的 Trial 模式，让访问者无需注册即可体验应用。

后端通过一个只读 endpoint 从专门的 demo 账号读取任务。

```text
Visitor
   |
   v
Enter Trial
   |
   v
Read Demo Tasks
   |
   v
Create Local Copy
   |
   v
Browser Storage
```

初始数据加载完成后，Trial 用户只操作本地副本。

Trial 用户可以：

- 创建任务
- 修改任务
- 完成和重新打开任务
- 删除任务
- 修改优先级
- 添加或删除截止日期
- 使用 Today
- 使用 Calendar
- 使用 All Tasks

Trial 中的所有修改只保存在浏览器本地。

```text
Trial Tasks
    |
    +-- Create
    +-- Update
    +-- Complete
    +-- Delete
    |
    v
Local Browser Storage

    X

PostgreSQL
```

Trial 用户不会获得 demo 账号的密码或 JWT token。

这样可以防止访问者通过已认证的任务 API 修改原始 demo 数据。

---

## 架构重构

当 LightManager 转向个人任务管理后，后端数据模型也进行了明显简化。

原来的结构基于项目和团队协作：

```text
User
 └── Project
      ├── Members
      ├── Roles
      └── Tasks
           └── Assignees
```

当前结构为：

```text
User
 ├── Task
 ├── Task
 └── Task
```

Task 直接属于用户。

Projects、project memberships、task assignments 和 project-level roles 已经不再属于当前核心数据模型。

这让系统更容易维护，同时也为未来客户端提供了更简洁的 API。

---

## 后端

后端使用 ASP.NET Core Web API 构建。

主要的已认证任务 API 为：

```text
/api/tasks
```

受保护的任务 endpoint 会从 JWT token 中读取当前用户身份，并限制任务查询和修改范围。

当前 Task model 包含：

- Title
- Description
- Status
- Priority
- 可选 Due date
- Created timestamp
- Updated timestamp
- Completed timestamp
- User ownership

Task status 和 priority 使用 enum，并以可读字符串形式保存在 PostgreSQL 中。

Trial 模式使用单独的匿名只读 endpoint 来读取 demo task 数据。

---

## 身份验证与授权

身份验证使用 ASP.NET Identity 和 JWT。

```text
User Login
    |
    v
ASP.NET Identity Validation
    |
    v
PostgreSQL
    |
    v
JWT Generated
    |
    v
Token Stored by Client
    |
    v
Authenticated API Requests
    |
    v
User-Specific Task Data
```

Identity model 将登录身份和显示名称分开：

```text
UserName = Email
DisplayName = FullName
```

这样可以避免多个用户使用相同显示名称时出现冲突。

授权主要围绕**用户数据隔离**设计。

所有受保护的任务查询、更新和删除操作都会确认任务属于当前已认证用户。

Trial 用户不会获得已认证的写入权限。

---

## 前端

前端使用：

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui

界面按照可复用组件和共享工具模块进行组织。

任务排序、priority 处理、API 请求、日期处理和导航组件等重复逻辑都被提取到共享文件中，而不是在不同页面重复实现。

---

## UI 主题

前端使用语义化主题变量，并集中定义在：

```text
src/index.css
```

主题统一控制：

- Background
- Foreground text
- Primary action color
- Non-priority color
- Priority color
- Must color

当前语义颜色为：

```text
Primary actions -> Blue
Non-priority    -> Green
Priority        -> Yellow
Must            -> Red
```

组件通过语义化样式引用这些颜色，而不是在各个 TSX 文件中单独定义颜色。

因此可以从一个统一位置修改整个应用的视觉主题。

---

## 数据库

PostgreSQL 用于持久化应用数据，并托管在 Neon。

Entity Framework Core 负责数据库访问和 migrations。

当前 `Tasks` table 包含：

```text
Id
Title
Description
Status
Priority
DueDate
CreatedAt
UpdatedAt
CompletedAt
UserId
```

索引包括：

```text
(UserId, DueDate)

(UserId, Status)
```

这些索引用于支持常见的日期和状态过滤查询。

---

## 部署

当前生产环境架构为：

```text
React + TypeScript
        |
        v
      Vercel
        |
        v
https://lightmanager.jiantao.dev
        |
        | HTTPS
        v
ASP.NET Core Web API
        |
        v
Microsoft Azure App Service
        |
        v
PostgreSQL / Neon
```

### 前端

React 前端部署在 Vercel。

生产地址：

**https://lightmanager.jiantao.dev**

### 后端

ASP.NET Core Web API 部署在 Microsoft Azure App Service。

### 数据库

PostgreSQL 托管在 Neon。

生产环境中的 JWT secrets、允许的前端 origins、数据库 connection strings 和 Trial 配置都通过环境变量提供，不会提交到源代码仓库。

---

## 挑战与设计决策

### 简化 Domain Model

最大的架构决策是移除原来的 project、membership 和 role model。

相比为了展示更多功能而保留不再需要的复杂结构，我选择围绕真实的个人任务需求重新设计数据模型。

### 用户数据隔离

转向个人任务管理后，Task ownership 成为了主要的授权边界。

受保护的 task endpoint 会在访问或修改任务前验证当前用户身份。

### 可选任务安排

任务不强制要求设置 due date。

这样可以快速记录任务，并在之后再决定具体安排时间。

### 安全的公开 Trial 模式

我希望访问者可以真正体验应用，但又不希望提供一个共享的已认证账号。

因此 Trial 模式只从后端读取初始 demo 数据，之后所有修改都保存在浏览器本地。

这样既可以提供完整体验，又可以保护原始数据库数据。

### Web First, Mobile Later

我决定先稳定 Web 应用，再开始开发移动客户端。

当前主要稳定：

- 产品工作流
- API design
- Authentication
- Database structure
- Task behavior
- Responsive UI

这些部分稳定后，未来的 React Native 客户端可以直接复用同一个 backend。

### 前后端独立部署

前端和后端独立部署。

这样可以保持 client 和 API 解耦，也让后端可以被未来的其他客户端复用。

---

## 项目演进

### Version 1 — Team Project Management

最初的 LightManager 包含：

- Projects
- Project members
- Role-based permissions
- Task assignment
- Kanban boards
- Drag-and-drop task workflows

### Version 2 — Personal Task Management

当前版本主要包含：

- Personal task ownership
- Today
- Unscheduled tasks
- Calendar planning
- Optional due dates
- Simple priorities
- Priority-based sorting
- All Tasks
- Responsive navigation
- Trial mode

因此，这个项目已经从一个主要用于展示技术能力的团队项目管理系统，演变成一个我自己真正会使用、并可以根据真实使用经验持续改进的个人工具。

---

## 开发目标

LightManager 并不是为了和大型任务管理平台竞争。

这个项目主要是一个用于构建、使用和持续改进真实 full-stack 应用的实践环境。

我的目标包括：

- 根据真实使用需求设计软件，而不是假设需求
- 随着功能发展仍然保持产品和数据模型简单
- 构建可复用、易维护的架构
- 改进响应式和 mobile-first 产品设计
- 探索安全的公开 demo 和 authentication 方案
- 为未来跨平台开发准备架构

重点不是尽可能增加更多功能，而是根据实际使用进行有目的的改进。

---

## 未来改进

未来可能加入：

- React Native mobile client
- Persistent mobile authentication
- Recurring tasks
- Task notes
- Notifications and reminders
- Offline support
- Local mobile storage
- Cross-device synchronization
- Improved task editing
- Search and filtering
- Optional productivity statistics

---

## Legacy Azure Static Web Apps Deployment — Abandoned

早期版本的前端曾部署在 Azure Static Web Apps：

```text
https://thankful-beach-0211add0f.7.azurestaticapps.net
```

目前前端已经迁移到 Vercel，并使用：

**https://lightmanager.jiantao.dev**

旧 Azure Static Web Apps 资源仅用于保留原来的 URL。经过多次恢复尝试仍无法正常部署后，我决定停止维护该旧资源，并把开发重点放在当前生产架构上。

### Recovery Attempts

| Method | Result |
| --- | --- |
| Azure Static Web Apps CLI | Azure 返回 `No matching static site found.` |
| Deployment token reset | 相同的部署问题仍然存在。 |
| GitHub Actions | Azure 无法将 deployment 与原来的 Static Web App 匹配。 |
| Azure Portal configuration | 相关 deployment settings 不可用或为只读。 |
| Azure CLI | 直接管理资源未能解决问题。 |
| Azure Cloud Shell | 相同的资源问题仍然存在。 |
| Source-control reconnect | 原有集成无法成功重新建立。 |

该旧部署已经不再属于 LightManager 当前的活动架构。