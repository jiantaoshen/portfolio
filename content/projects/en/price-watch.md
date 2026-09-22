---
lang: en
title: "Price Watch"
description: "A personal price-tracking system for products and subscriptions with multi-source comparison, price history, review workflows, and automated scraping."
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

## Project Overview

Price Watch is a personal price-tracking system for products and subscriptions. It combines a cloud web application with a local/private scraper workflow.

The cloud app manages tracked items, review workflows, and price history. A separate local/private app is used for scraper operations and scheduling. Both frontends remain separate applications while sharing common UI, design, formatting, and HTTP infrastructure through workspace packages.

## Problem to Solve

The same product may be sold by different stores in different package sizes, so comparing only the displayed total price can be misleading.

Price Watch normalizes prices by quantity, tracks historical changes, supports manual and automatic sources, and keeps suspicious scraper results out of accepted price history until reviewed.

## Solution

The system separates the public cloud application from local browser automation while sharing common frontend foundations.

The cloud Next.js app communicates with the authenticated ASP.NET Core API. The API uses EF Core and Npgsql to read and write Neon PostgreSQL.

A separate local `private-web` app communicates with `PriceWatch.Private`, which runs the Python Playwright scraper and writes accepted results to the same production database.

The two frontend applications share reusable packages for the design system, UI components, formatting helpers, and HTTP transport.

## Core Features

### Product and Subscription Tracking

Track products and subscriptions with target prices, purchase information, archive state, and configurable update modes.

### Multi-Source Price Comparison

Each item can contain multiple stores or providers. Prices are normalized by quantity so different package sizes can be compared fairly.

### Price History

Only accepted normalized price changes are stored in price history.

### Manual, Automatic, and Hybrid Updates

Sources can use manual prices, automatic scraping, or a combination of both.

### Review Workflow

Suspicious scrape results can be accepted, rejected, or manually corrected before they affect the current price.

### Local Scraper

Python and Playwright run only on the local machine. The cloud Web API does not control browsers or expose scraper configuration.

## Challenges and Decisions

### Separating Cloud and Private Components

The cloud application remains independently deployable, while scraper orchestration and browser automation stay on a trusted local machine.

### Shared Frontend Foundations

The cloud and private frontends remain separate applications, but they share the same design system, reusable UI components, formatting helpers, and HTTP transport through npm workspaces.

### Consistent Price Comparison

The system stores raw price and quantity together and compares items using normalized unit prices.

### Single Production Database

Cloud and local production services use the same Neon production database. Local development is intentionally kept simple and uses the same source of truth.

## Deployment

The cloud Next.js frontend is deployed to Vercel.

The ASP.NET Core Web API runs on Azure App Service.

PostgreSQL is hosted on Neon.

`private-web`, `PriceWatch.Private`, and the Python Playwright scraper run locally and connect to the production database.

## Future Updates

Future work will focus on improving scraper reliability, review workflows, notifications, and long-term price analysis.

## Additional Notes

### Project Background

Price Watch is a personal-use project and an ongoing full-stack engineering project. It is designed to solve a real recurring need while providing practical experience with cloud deployment, authentication, PostgreSQL, browser automation, shared frontend architecture, and maintaining a system across multiple runtimes.
