---
lang: en
title: "Price Watch"
description: "A local-first product price monitoring and AI shopping assistance application built with React, TypeScript, ASP.NET Core, Python, Playwright, FastAPI, and Ollama, supporting multi-store price tracking, price history, package normalization, automated runs, email notifications, and local AI price analysis."
status: "v.1.2.0"
order: 1
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

## Project Overview

Price Watch is a local-first product price monitoring and shopping decision support system. The application consists of a React and TypeScript frontend, a local ASP.NET Core API, a Python Playwright price scraping module, a FastAPI AI service, a local Ollama model, and a local JSON data layer.

Users can manage tracked products and multiple store sources, maintain prices automatically or manually, compare actual prices, unit prices, and normalized prices across different package sizes, review price history, run status, and target prices, and use a local AI shopping advisor to analyze whether the current price is worth paying.

## Problem to Solve

Different e-commerce websites may sell the same product in different package quantities, so simply comparing the total product price shown on the page does not provide a fair comparison. The system needs to handle package quantities, unit prices, and a normalized comparison quantity in order to determine which source is actually cheaper.

Web price scraping is also affected by dynamic pages, structural changes, missing structured price data, and abnormal prices. To reduce long-term maintenance costs, the system needs to avoid maintaining separate CSS Selectors and dedicated scraping logic for every website.

A complete price monitoring system also needs to handle product configuration, price history, target prices, anomaly detection, automated scheduling, email notifications, and run status rather than simply performing a one-time web scrape.

On top of price monitoring, the project also needs to allow a local AI model to use real prices and historical data from the system to assist with purchasing decisions, while preventing the frontend from directly supplying or modifying authoritative price facts.

## Solution

The project separates the frontend interface, application API, price scraping, data processing, and AI service into independent responsibilities.

The React frontend accesses application data only through the ASP.NET Core `/api/` endpoints. ASP.NET Core is responsible for product configuration, runtime data, historical data, automation, email settings, scraper orchestration, and AI product context.

Python uses Playwright to load product pages and extracts prices from Product JSON-LD. The system does not maintain store-specific scrapers. For sources that cannot reliably provide Product JSON-LD, automatic scraping can be disabled and a manual price can be configured instead.

The system calculates unit prices based on each source's package quantity and uses the product-level `comparison_quantity` to normalize different package sizes to the same quantity before comparison.

The AI functionality connects to the local Ollama service through an independent FastAPI service. React sends only the Advisor, product ID, and chat messages. ASP.NET Core builds the real Product Context from local configuration, latest prices, and historical data based on the product ID before passing it to FastAPI and Ollama for analysis.

## Core Features

### Product Price Monitoring

Each product can be configured with multiple store sources. Automatic sources load the page through Playwright and read Product JSON-LD, while manual sources directly use the configured `manual_price`.

Automatic scraping can be controlled independently at both the product level and source level. When product-level scraping is disabled, all sources for that product use manual prices and store pages are not opened.

### JSON-LD Price Extraction

Automatic scraping uses only Schema.org Product JSON-LD.

If a page does not provide usable Product JSON-LD, the source is treated as a scraping failure instead of falling back to DOM extraction or store-specific extraction logic.

This design reduces the complexity of maintaining CSS Selectors and dedicated scrapers for different websites.

### Product Management

Products can be added, modified, and deleted through the React interface and ASP.NET Core API. Users can also manage multiple store sources, scraping modes, manual prices, package quantities, target prices, and comparison quantities.

### Multi-Store Price Comparison

Each source can configure `unit_quantity`. The system calculates the unit price by dividing the actual price by the package quantity.

A product can also configure `comparison_quantity`, allowing different package sizes to be converted to a common quantity for comparison.

For example, if one source sells a 2-pack and another source sells a 1-pack, the system can normalize both to a Comparable Total for 2 units, avoiding incorrect conclusions caused by comparing package totals directly.

### Price History

Successful price results are stored as local historical data and displayed on the Dashboard and product detail pages together with current prices, historical prices, price statistics, and historical trends.

Failed or Suspicious prices are not written into price history as normal successful results.

### Target Prices

Each product can define a target total price and target unit price. The system can identify whether the current price has reached the target and use the target state in the Dashboard, notifications, and AI analysis.

### Suspicious Price Detection

The system validates unusually large price changes and marks questionable results as `Suspicious`, reducing the risk of accepting incorrect prices, abnormal structured data, or other unreliable results.

### Run Status

The system records the result of each scraper run and displays the latest run status in the application.

Products can have a status of `Not run yet`, `Success`, `Failed`, or `Suspicious`.

Users can manually run a price check through Run Now.

### Email Notifications

Price Watch can send email notifications when a product reaches its target price, when an abnormal price is detected, or when a scraper run fails.

Notification state is stored locally to reduce duplicate alerts for the same state.

### Automated Scheduling

ASP.NET Core can manage automatic price checking tasks through Windows Task Scheduler while keeping the manual Run Now feature available.

### Local AI Shopping Advisor

Price Watch integrates FastAPI and Ollama to provide a locally running AI Shopping Advisor.

Different Advisors use different purchasing strategies, such as being more cautious, balancing overall value, or focusing more heavily on historical low prices, while all Advisors use the same real Price Watch price data.

### Product-Aware AI Chat

AI Chat can select one or more products already tracked by Price Watch.

React sends only `advisorId`, `productIds`, and chat messages. ASP.NET Core builds the AI Product Context from product configuration, latest prices, and historical data based on the product ID.

The AI can use the current price, target price, previous price, historical low, historical high, historical average, and recent price records to support its analysis.

### Ask AI

The product detail page provides an Ask AI feature.

After clicking it, the user enters AI Chat and the current product is automatically added to the Considering list. The user can then directly ask whether the product is worth buying at its current price.

Based on the available price data, the AI can provide recommendations such as `BUY`, `WAIT`, or `NEUTRAL`, and replies in the same language as the user's latest message.

## Challenges and Decisions

### Different Website Price Structures

The page structures of different e-commerce websites change frequently. The project ultimately chose to use generic Product JSON-LD instead of maintaining a large number of store-specific scrapers, CSS Selectors, or DOM fallbacks.

For websites that cannot reliably provide Product JSON-LD, Price Watch continues to support them through manual prices.

### Fair Comparison Across Different Package Sizes

Different stores may sell the same product in different package quantities, so directly comparing product totals can easily lead to incorrect conclusions.

The system introduces `unit_quantity`, unit prices, and `comparison_quantity` to convert different sources to a common quantity and calculate a Comparable Total.

### Avoiding Incorrect Prices

Automatically scraped prices are not always reliable, so the system performs price validation before saving historical records.

Abnormal results are marked as `Suspicious` instead of being stored directly as normal historical prices.

### Separating Product Configuration and Runtime Data

Product configuration is stored in `products.json`, while the latest runtime results and historical records use separate data files.

The Dashboard merges product configuration with the latest runtime results, allowing newly created products that have not yet been run to immediately appear as `Not run yet`.

### AI Data Trust Boundary

The frontend does not directly provide current prices or price history to the AI as authoritative facts.

React sends only the product ID. ASP.NET Core generates the Product Context from local Price Watch data and then passes it to FastAPI and Ollama.

This ensures that different Advisors use consistent price facts controlled by the backend.

### Separation of Responsibilities in a Local Application

The project maintains clear boundaries between React, ASP.NET Core, the Python scraper, FastAPI, Ollama, and local JSON data.

React handles the UI, ASP.NET Core handles the application API and service orchestration, Python handles price scraping and processing, FastAPI handles AI Prompts and model communication, Ollama handles local model inference, and local JSON provides lightweight persistence.

## Deployment

Price Watch uses a local-first architecture.

The project uses a PowerShell startup script to check the Node.js, npm, .NET, and Python environments and, when necessary, install frontend dependencies, create Python virtual environments, install scraper and AI dependencies, install Playwright Firefox, restore ASP.NET Core dependencies, and start FastAPI, ASP.NET Core, and Vite.

The Python scraper and AI service use separate virtual environments.

Ollama runs as an independent local runtime.

Runtime data, historical data, product configuration, settings, and scraper state are stored in local JSON files, while Windows Task Scheduler is used for automated scheduling.

## Future Updates

The next step is to merge a previously developed asset management project into this project. After that, depending on the size of the merged asset data, I will decide whether to continue merging additional projects, migrate to PostgreSQL, or optimize the AI layer.

## Additional Notes

More detailed articles about this project that are less important to the main project overview are included here.

### Using FastAPI

FastAPI is a Python Web API framework. It is responsible for receiving and forwarding `advisorId`, `products`, and `messages` between ASP.NET Core and Ollama.

The main reason I use FastAPI is that the AI layer is already written in Python, and FastAPI is well suited for quickly wrapping Python AI logic in an HTTP API. Files such as `prompt_builder.py`, `advisor.py`, and Pydantic data models can remain directly in Python.

> Can ASP.NET Core replace it?

Yes, it can, but I do not recommend doing that yet. If the project later makes extensive use of Python AI libraries such as LlamaIndex or FAISS, keeping the AI layer in Python will be more convenient than moving it into ASP.NET Core. I also plan to add a RAG system to this project later.

### Project Background

My goal is to become a senior full-stack engineer. Based on AI's assessment, a senior full-stack engineer needs experience managing large projects and legacy code. That is one of the reasons this project was created.

While studying web development at Lexicon, I built many management-oriented projects. I therefore decided to treat code from my older GitHub projects as legacy code and merge as much of it as possible into one larger project.

This is also why some code has disappeared from my GitHub repositories. After those projects were merged into this project, I deleted most of them except for projects that are still maintained or need to remain available for demonstration purposes.

This project has already merged some previous AI-related projects and projects that fetch data from the web. More projects will be merged in the future, with the goal of turning this product tracker into an AI assistant for managing assets and subscriptions.

It should eventually be able to tell the user which products have dropped in price, which products are worth buying, and help manage products and subscriptions that have already been purchased. A RAG system is also planned for managing signed agreements and information or reviews related to specific products.

> Why build a product price tracker?

Because with price tracking, I am also one of the users.

I already use price tracking regularly to decide which products to buy. If I notice that a useful feature is missing, I can add it myself. This creates a simple but real user experience and naturally leads to continued updates and long-term maintenance.

That helps improve my project management skills and gives the project a longer lifecycle compared with projects that are built only to satisfy a requirement and then remain unused in a repository.

### Why Are the Articles Written Differently in Different Languages?

The article generation process is:

> AI generation -> manual content review -> AI translation -> manual content review

Because I am still experimenting with the writing style, articles that I have manually edited may use different phrasing in different languages, even though the content is the same.

The differences exist because I am still finding a writing style that suits me.

If you see an article that reads like a direct translation, that article is probably still at the AI translation stage.
