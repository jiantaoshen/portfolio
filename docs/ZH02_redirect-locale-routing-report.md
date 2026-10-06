# `(redirect)` Locale Routing 设计报告

## 1. 背景

当前项目是一个基于 Next.js App Router 和 `next-intl` 的多语言 Portfolio。

支持的语言：

```ts
export const routing = defineRouting({
  locales: ["en", "sv", "zh"],
  defaultLocale: "sv",
});
```

主要路由：

```text
/en
/sv
/zh

/en/dashboard
/sv/dashboard
/zh/dashboard
```

当用户直接访问：

```text
/
```

项目不会把 `/` 当作实际内容页面，而是根据浏览器发送的 `Accept-Language` 请求头决定最合适的语言，然后重定向到对应的 locale route。

例如：

```text
中文浏览器
/
→ /zh

英文浏览器
/
→ /en

瑞典语浏览器
/
→ /sv
```

如果无法匹配支持的语言，则回退到默认语言：

```text
defaultLocale = sv
```

---

## 2. 当前目录设计

当前使用一个 Next.js Route Group：

```text
app/
├─ (redirect)/
│  ├─ layout.tsx
│  └─ page.tsx
│
└─ [locale]/
   ├─ layout.tsx
   ├─ (portfolio)/
   │  └─ page.tsx
   └─ dashboard/
      └─ page.tsx
```

`(redirect)` 不会出现在 URL 中。

因此：

```text
app/(redirect)/page.tsx
```

对应的仍然是：

```text
/
```

而不是：

```text
/redirect
```

---

## 3. `(redirect)` 的职责

`(redirect)` 本身不是重定向机制。

它只是一个用于组织代码的 Route Group。

真正的职责可以拆成三层：

```text
routing.ts
→ 定义支持语言和默认语言

(redirect)/page.tsx
→ 读取请求语言并决定 redirect

[locale]
→ 承载真正的 Portfolio / Dashboard 页面
```

也就是说：

```text
Route Group
→ organize

redirect()
→ redirect

routing.ts
→ locale configuration
```

---

## 4. 当前请求流程

用户访问：

```text
/
```

请求流程：

```text
Browser
  ↓
GET /
  ↓
app/(redirect)/page.tsx
  ↓
读取 Accept-Language
  ↓
getPreferredLocaleFromAcceptLanguage(...)
  ↓
得到 en / sv / zh
  ↓
redirect(`/${locale}`)
  ↓
/[locale]
  ↓
Portfolio
```

例如浏览器发送：

```text
Accept-Language:
zh-CN,zh;q=0.9,en;q=0.8
```

应用将其解析为：

```text
zh
```

然后：

```text
GET /
→ 307 Temporary Redirect
→ Location: /zh
```

浏览器接着请求：

```text
GET /zh
→ 200 OK
```

---

## 5. 为什么这样设计

### 5.1 URL 是语言状态的唯一来源

实际内容页面全部要求 locale 出现在 URL：

```text
/en
/sv
/zh
```

Dashboard 也是：

```text
/en/dashboard
/sv/dashboard
/zh/dashboard
```

这样可以避免同时维护：

```text
URL locale
cookie locale
React locale state
browser locale
```

对于页面语言来说：

```text
URL
→ source of truth
```

例如：

```text
/zh/dashboard
```

已经明确说明当前 Dashboard UI locale 是：

```text
zh
```

---

### 5.2 `/` 只是入口，不是内容页面

项目真正的页面都在：

```text
/[locale]
```

所以：

```text
/
```

只需要负责：

```text
选择 locale
→ redirect
```

它不需要拥有 Portfolio 页面内容。

这样职责比较明确：

```text
/
→ language negotiation

/[locale]
→ actual application
```

---

### 5.3 Route Group 不污染 URL

如果使用普通目录：

```text
app/redirect/page.tsx
```

URL 会变成：

```text
/redirect
```

但：

```text
app/(redirect)/page.tsx
```

不会生成额外 URL segment。

因此 `(redirect)` 很适合表达：

> 这是内部路由组织结构，不是产品 URL。

---

### 5.4 当前实现容易理解和调试

对于目前这个 Portfolio，真正需要自动 locale negotiation 的入口主要就是：

```text
/
```

因此使用一个显式 `page.tsx`：

```text
/
→ redirect
```

非常直观。

查看 `app` 目录时就能发现根入口在哪里处理。

---

## 6. 为什么没有立即使用 middleware / proxy

`next-intl` 可以通过 middleware / Proxy 在进入 App Router 页面之前处理 locale routing。

请求流程会变成：

```text
Browser
  ↓
Request
  ↓
middleware / proxy
  ↓
locale negotiation
  ↓
redirect / rewrite
  ↓
App Router
```

而当前方案是：

```text
Browser
  ↓
Request
  ↓
App Router
  ↓
(redirect)/page.tsx
  ↓
locale negotiation
  ↓
redirect
```

两种方式都可以根据浏览器语言选择 locale。

区别主要在：

```text
处理发生在哪一层
```

而不是：

```text
有没有 browser-language detection
```

当前项目已经具备浏览器语言检测。

---

## 7. 当前方案适合什么情况

当前 `(redirect)` 方案适合：

```text
只有少量无 locale 入口
```

例如主要只有：

```text
/
```

需要自动语言判断。

也适合：

```text
小型项目
个人 Portfolio
路由简单
希望行为显式
希望容易 debug
```

当前项目满足这些条件，因此这种实现是合理的。

---

## 8. 什么时候不应该继续这样写

### 8.1 大量无 locale 路由需要统一处理

如果未来出现：

```text
/dashboard
/projects/123
/blog
/contact
/settings
```

并且都希望自动变成：

```text
/zh/dashboard
/zh/projects/123
/zh/blog
/zh/contact
/zh/settings
```

继续为每个 route 建 redirect page 会产生重复代码。

这时候更适合：

```text
middleware / proxy
```

统一处理。

---

### 8.2 Locale negotiation 变复杂

例如以后规则变成：

```text
1. URL locale
2. 用户账户偏好
3. locale cookie
4. Accept-Language
5. defaultLocale
```

如果这些逻辑全部写在：

```text
(redirect)/page.tsx
```

中，会逐渐变成复杂的请求路由逻辑。

这种逻辑更适合迁移到：

```text
middleware / proxy
```

或独立的：

```ts
resolveLocale(...)
```

函数。

---

### 8.3 Middleware / Proxy 已经接管 locale routing

如果未来加入：

```text
next-intl middleware / proxy
```

并且它已经负责：

```text
/
→ /sv | /en | /zh
```

那么 `(redirect)` 就不应该继续做同一件事。

否则会出现两个 owner：

```text
middleware
+
(redirect)/page.tsx
```

同时决定 locale。

好的架构原则是：

> 一个路由决策尽量只有一个 owner。

因此迁移到 middleware / proxy 后，应该删除：

```text
app/(redirect)/
```

---

## 9. Debugging：出问题后如何证明哪里错了

高级工程实践的重点不是猜，而是逐层证明。

### 9.1 先定义预期 Contract

当前系统应该满足：

```text
GET /
→ redirect

GET /en
→ 200

GET /sv
→ 200

GET /zh
→ 200
```

如果浏览器语言是中文：

```text
GET /
→ Location: /zh
```

### 9.2 证明 `/` 是否执行了 redirect

开发服务器日志：

```text
GET / 307 in 59ms
```

这里：

```text
307
```

不是错误。

它证明：

```text
根 route 已经执行了 redirect
```

### 9.3 检查 `Location`

不要只看浏览器最后停在哪。

可以直接：

```powershell
curl.exe -I http://localhost:3000/
```

预期：

```text
HTTP/1.1 307 Temporary Redirect
Location: /zh
```

或者：

```text
Location: /en
```

或：

```text
Location: /sv
```

这可以直接证明：

```text
redirect layer 决定了什么
```

如果这里已经错误：

```text
Location: /en
```

但浏览器应该选择中文，那么问题就在：

```text
Accept-Language parsing
或
locale resolution
```

不是 Portfolio UI。

### 9.4 证明目标 route 是否正常

继续：

```powershell
curl.exe -I http://localhost:3000/zh
```

预期：

```text
HTTP/1.1 200 OK
```

完整链路：

```text
/
307
↓
/zh
200
```

这样可以证明：

```text
redirect layer ✅
localized route ✅
```

### 9.5 URL 正确但语言显示错误

如果：

```text
URL = /zh
```

但页面显示 English：

```text
redirect layer 已经正确
```

应该检查：

```text
[locale]/layout.tsx
NextIntlClientProvider
request config
message loading
```

而不是继续修改 `(redirect)`。

可以用这个判断：

```text
URL 错
→ routing problem

URL 对，translation 错
→ i18n/provider problem
```

### 9.6 Navbar 切换语言错误

例如当前：

```text
/en/dashboard
```

点击 Swedish 后去了：

```text
/sv
```

而不是：

```text
/sv/dashboard
```

这个问题与：

```text
(redirect)
```

无关。

应该检查：

```text
LanguageSwitcher
usePathname()
stripLocalePrefix()
language href generation
```

因为请求根本没有经过 `/`。

---

## 10. 系统职责边界

可以把当前架构画成：

```text
Request /
   │
   ▼
(redirect)/page.tsx
   │
   │ resolve locale
   ▼
/[locale]
   │
   ▼
[locale]/layout.tsx
   │
   │ provide i18n
   ▼
Portfolio / Dashboard
   │
   ▼
LanguageSwitcher
   │
   │ replace URL locale
   ▼
/[other-locale]/same-path
```

对应职责：

```text
/ 去哪里？
→ redirect layer

/zh 显示什么语言？
→ i18n layer

/en/dashboard → /sv/dashboard
→ LanguageSwitcher

Dashboard 编辑哪个 about.json？
→ CMS LocaleSwitcher
```

---

## 11. 当前方案与 Proxy 的比较

| 项目 | `(redirect)` Route | Middleware / Proxy |
|---|---|---|
| Browser language detection | ✅ | ✅ |
| 根路径 `/` locale redirect | ✅ | ✅ |
| 实现简单 | ✅ | 中等 |
| 行为显式 | ✅ | 较隐式 |
| 小项目维护成本 | 低 | 较高 |
| 全站 locale routing | 一般 | ✅ |
| 大量无 locale route | 不理想 | ✅ |
| Cookie / auth / tenant 组合 | 不理想 | ✅ |
| 后期扩展能力 | 中等 | 高 |

---

## 12. 当前结论

目前这个 Portfolio：

```text
语言数量少
路由结构简单
主要只有 / 需要 locale negotiation
实际页面全部位于 /[locale]
```

因此：

```text
app/(redirect)/page.tsx
```

是合理的设计。

它不是临时 hack，而是当前需求下一个：

```text
简单
显式
容易测试
容易删除
```

的解决方案。

真正需要迁移到 middleware / proxy 的信号是：

```text
无 locale route 开始大量增加
locale negotiation 规则变复杂
cookie / auth / tenant 进入请求层
next-intl middleware 已经接管 routing
```

到那时可以把：

```text
app/(redirect)/
```

整个删除，而：

```text
/[locale]
/[locale]/dashboard
Portfolio
Navbar
LanguageSwitcher
```

基本不需要重写。

---

## 13. 设计原则总结

当前设计体现的核心工程原则：

```text
URL 作为 locale source of truth
```

```text
请求入口和实际页面分离
```

```text
一个行为只有一个 owner
```

```text
简单需求使用简单方案
```

```text
架构允许未来低成本替换
```

因此当前 `(redirect)` 的价值并不是它比 middleware 更高级，而是：

> 它与当前项目复杂度匹配，同时为未来迁移到 middleware / proxy 保留了清晰边界。
