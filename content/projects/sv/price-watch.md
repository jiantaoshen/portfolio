---
lang: sv
title: "Price Watch"
description: "Ett personligt prisbevakningssystem för produkter och abonnemang med stöd för flera källor, normaliserade prisjämförelser, prishistorik, granskningsflöden och lokal automatiserad insamling."
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

## Projektöversikt

Price Watch är ett personligt prisbevakningssystem för produkter och abonnemang. Systemet kombinerar en molnbaserad webbapplikation med en lokal och privat scraper.

Webbappen används för att hantera bevakade objekt, granska prisändringar och visa prishistorik. Automatisk prisinsamling körs lokalt med Python och Playwright.

## Problem att lösa

Samma produkt kan säljas i olika förpackningsstorlekar hos olika butiker, vilket gör att en jämförelse av enbart totalpriset kan bli missvisande.

Price Watch normaliserar priser efter kvantitet, sparar historiska förändringar och stöder manuella, automatiska och hybrida priskällor. Misstänkta scraper-resultat påverkar inte den accepterade prishistoriken förrän de har granskats.

## Lösning

Systemet separerar den publika applikationen från lokal webbläsarautomation.

Next.js kommunicerar med ett autentiserat ASP.NET Core API. API:t använder EF Core och Npgsql för att läsa och skriva data i Neon PostgreSQL. Den lokala tjänsten `PriceWatch.Private` startar Python Playwright-scrapern och skriver tillbaka godkända resultat till databasen.

Produktion och utveckling använder separata Neon-brancher.

## Kärnfunktioner

### Produkt- och abonnemangsbevakning

Bevaka produkter och abonnemang med målpris, köpinformation, arkivering och konfigurerbara uppdateringslägen.

### Prisjämförelse från flera källor

Varje objekt kan ha flera butiker eller leverantörer. Priser normaliseras efter kvantitet så att olika förpackningsstorlekar kan jämföras rättvist.

### Prishistorik

Endast accepterade förändringar i normaliserat pris sparas i prishistoriken.

### Manuella, automatiska och hybrida uppdateringar

Priskällor kan använda manuella priser, automatisk scraping eller en kombination av båda.

### Granskningsflöde

Misstänkta scraper-resultat kan godkännas, avvisas eller korrigeras manuellt innan de påverkar det aktuella priset.

### Lokal scraper

Python och Playwright körs endast lokalt. Det molnbaserade Web API:t styr inte webbläsare och exponerar inte scraper-konfiguration.

## Utmaningar och beslut

### Separera moln och privata komponenter

Det publika API:t är stateless och körs i molnet, medan webbläsarautomation stannar på en betrodd lokal dator.

### Konsekvent prisjämförelse

Systemet lagrar både råpris och kvantitet och jämför objekt med hjälp av normaliserat enhetspris.

### Separata databasmiljöer

Produktionstjänster använder Neon production-branch, medan lokal utveckling använder en separat dev-branch så att testdata inte påverkar riktig data.

## Driftsättning

Next.js-frontend körs på Vercel.

ASP.NET Core Web API körs på Azure App Service.

PostgreSQL hostas på Neon.

`PriceWatch.Private` och Python Playwright-scrapern körs lokalt och ansluter till produktionsdatabasen vid riktig prisinsamling.

## Framtida uppdateringar

Fortsatt arbete fokuserar på bättre scraper-stabilitet, granskningsflöden, notifieringar och långsiktig prisanalys.

## Ytterligare information

### Projektbakgrund

Price Watch är ett personligt projekt som underhålls löpande. Det löser ett verkligt behov av prisbevakning och ger samtidigt praktisk erfarenhet av molndrift, autentisering, PostgreSQL, automation och underhåll av ett system med flera runtimes.
