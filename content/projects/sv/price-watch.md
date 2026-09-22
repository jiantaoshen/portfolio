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

Price Watch är ett personligt prisbevakningssystem för produkter och abonnemang. Systemet kombinerar en molnbaserad webbapplikation med ett lokalt och privat scraper-flöde.

Molnappen används för att hantera bevakade objekt, granskningsflöden och prishistorik. En separat lokal/private webbapp används för scraper-körningar och schemaläggning. De två frontend-apparna är separata men delar gemensam UI, design, formattering och HTTP-infrastruktur genom workspace-paket.

## Problem att lösa

Samma produkt kan säljas i olika förpackningsstorlekar hos olika butiker, vilket gör att en jämförelse av enbart totalpriset kan bli missvisande.

Price Watch normaliserar priser efter kvantitet, sparar historiska förändringar och stöder manuella, automatiska och hybrida priskällor. Misstänkta scraper-resultat påverkar inte den accepterade prishistoriken förrän de har granskats.

## Lösning

Systemet separerar den publika molnapplikationen från lokal webbläsarautomation, samtidigt som gemensamma frontend-grunder delas.

Molnappen i Next.js kommunicerar med ett autentiserat ASP.NET Core API. API:t använder EF Core och Npgsql för att läsa och skriva data i Neon PostgreSQL.

En separat lokal `private-web`-app kommunicerar med `PriceWatch.Private`, som startar Python Playwright-scrapern och skriver tillbaka godkända resultat till samma produktionsdatabas.

De två frontend-apparna delar återanvändbara paket för designsystem, UI-komponenter, formatteringshjälpare och HTTP-transport.

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

Molnapplikationen kan driftsättas oberoende, medan scraper-orkestrering och webbläsarautomation stannar på en betrodd lokal dator.

### Delade frontend-grunder

Moln- och private-frontend är separata applikationer, men de delar samma designsystem, återanvändbara UI-komponenter, formatteringshjälpare och HTTP-transport genom npm workspaces.

### Konsekvent prisjämförelse

Systemet lagrar både råpris och kvantitet och jämför objekt med hjälp av normaliserat enhetspris.

### En gemensam produktionsdatabas

Molntjänster och lokala produktionskomponenter använder samma Neon production-databas. Lokal utveckling hålls medvetet enkel och använder samma datakälla.

## Driftsättning

Molnfrontend i Next.js körs på Vercel.

ASP.NET Core Web API körs på Azure App Service.

PostgreSQL hostas på Neon.

`private-web`, `PriceWatch.Private` och Python Playwright-scrapern körs lokalt och ansluter till produktionsdatabasen.

## Framtida uppdateringar

Fortsatt arbete fokuserar på bättre scraper-stabilitet, granskningsflöden, notifieringar och långsiktig prisanalys.

## Ytterligare information

### Projektbakgrund

Price Watch är ett personligt projekt som underhålls löpande. Det löser ett verkligt behov av prisbevakning och ger samtidigt praktisk erfarenhet av molndrift, autentisering, PostgreSQL, webbläsarautomation, delad frontend-arkitektur och underhåll av ett system med flera runtimes.
