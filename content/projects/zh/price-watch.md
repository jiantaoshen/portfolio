---
lang: zh
title: "Price Watch"
description: "一个面向商品与订阅的个人价格追踪系统，支持多来源价格比较、标准化价格、价格历史、审核流程和本地自动抓取。"
status: "Current"
order: 1
technologies:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"
  - "shadcn UI"
  - "ASP.NET Core"
  - ".NET 10"
  - "PostgreSQL"
  - "Neon"
  - "EF Core"
  - "Npgsql"
  - "Microsoft Entra"
  - "MSAL"
  - "Python"
  - "Playwright"
  - "Azure App Service"
  - "Vercel"
links:
  github: "https://github.com/jiantaoshen/PriceWatch"
  live: "https://pricewatch.jiantao.dev"
draft: false
---

## 项目概述

Price Watch 是一个用于商品和订阅的个人价格追踪系统，由云端 Web 应用和本地私有抓取服务组成。

主应用负责管理追踪项目、审核价格变化和查看价格历史；自动抓取则通过本地 Python + Playwright 完成。

## 要解决的问题

同一商品在不同商店可能有不同包装数量，只比较页面上的总价并不公平。

Price Watch 会按数量标准化价格、记录历史变化，并支持手动、自动和混合价格来源。可疑抓取结果在审核前不会进入正式价格历史。

## 解决方案

系统将公开应用与本地浏览器自动化分离。

Next.js 前端通过经过认证的 ASP.NET Core API 访问数据。API 使用 EF Core 和 Npgsql 连接 Neon PostgreSQL。本地 `PriceWatch.Private` 服务负责启动 Python Playwright 抓取器，并把有效结果写回数据库。

生产环境和开发环境使用不同的 Neon branch。

## 核心功能

### 商品与订阅追踪

追踪商品和订阅，并管理目标价格、购买信息、归档状态和更新模式。

### 多来源价格比较

每个项目可以配置多个商店或服务来源，并通过标准化单价公平比较不同包装规格。

### 价格历史

只有被接受的标准化价格变化才会写入价格历史。

### 手动、自动与混合更新

价格来源可以使用手动价格、自动抓取，或两者混合。

### 审核流程

可疑抓取结果可以在影响当前价格前被接受、拒绝或手动修正。

### 本地抓取

Python 和 Playwright 只在本地设备运行。云端 Web API 不控制浏览器，也不暴露抓取配置。

## 挑战与决策

### 分离云端与私有组件

公开 API 保持无状态并部署在云端，而浏览器自动化保留在可信的本地设备上。

### 保持价格比较一致

系统同时保存原始价格和数量，并使用标准化单价进行比较。

### 数据库环境隔离

生产服务连接 Neon production branch，本地开发使用独立 dev branch，避免测试数据影响真实数据。

## 部署

Next.js 前端部署在 Vercel。

ASP.NET Core Web API 运行在 Azure App Service。

PostgreSQL 托管在 Neon。

`PriceWatch.Private` 与 Python Playwright 抓取器在本地运行，并在正式抓取时连接 production 数据库。

## 后续更新

后续将继续改进抓取稳定性、审核流程、通知和长期价格分析。

## 补充说明

### 项目背景

Price Watch 是一个个人使用并持续维护的全栈项目，用于解决真实的价格追踪需求，同时实践云部署、身份认证、PostgreSQL、自动化任务和多运行时系统维护。
