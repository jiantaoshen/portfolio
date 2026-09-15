---
lang: sv
title: "Utvecklarportfolio"
description: "En flerspråkig utvecklarportfolio byggd med Astro, React, TypeScript och Tailwind CSS, med statisk innehållsrendering, projektstudier, ett publikt Dashboard i Trial-läge och ett lokalt Content Editor-arbetsflöde som körs i en enda utvecklingsprocess."
status: "Live"
order: 3
technologies:
  - "Astro"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "Astro Content Collections"
  - "Markdown"
  - "Vercel"
links:
  github: "https://github.com/jiantaoshen/portfolio-dev"
  live: "https://www.jiantao.dev"
draft: false
---

## Översikt

Developer Portfolio är en flerspråkig utvecklarportfolio byggd med Astro, React, TypeScript och Tailwind CSS.

Den publika webbplatsen använder Astro för att generera statiska sidor från Markdown- och JSON-innehåll. De engelska, svenska och kinesiska versionerna delar samma applikationsstruktur men använder språkspecifika routes och separat innehåll.

Projektstudier lagras som Markdown genom Astro Content Collections, medan strukturerat profilinnehåll som About, Skills och Education hanteras som flerspråkig JSON.

Projektet innehåller även två Dashboard-lägen: ett publikt Trial-gränssnitt för att utforska Content Editor och ett lokalt Dashboard som är integrerat i Astro/Vite dev server för att hantera portfolions källfiler.

Resultatet är en statisk produktionswebbplats med ett lättviktigt och Git-baserat innehållsflöde i stället för en produktionsdatabas eller ett CMS.

## Problemet

En flerspråkig portfolio innehåller flera typer av innehåll som behöver vara organiserade och enkla att uppdatera.

Projektet innehåller:

- About- och CV-information
- Skills och Education
- Projektstudier
- Innehåll på engelska, svenska och kinesiska

Att redigera allt detta innehåll direkt i källfiler fungerar bra i liten skala, men blir mindre praktiskt när mängden strukturerat innehåll och längre projektbeskrivningar växer.

Samtidigt är den publika portfolion huvudsakligen statisk. Att införa en produktionsdatabas och en permanent backend skulle skapa ytterligare infrastruktur som inte är nödvändig för innehåll som endast ändras när webbplatsen byggs om.

Målet blev därför att behålla den publika webbplatsen statisk samtidigt som det skapades ett mer praktiskt sätt att hantera Markdown- och JSON-innehållet.

## Lösning

Portfolion använder en content-to-code-arkitektur.

Projektstudier lagras som Markdown och valideras med Astro Content Collections. About, Skills och Education lagras som flerspråkig JSON.

```text
JSON / Markdown
       ↓
     Astro
       ↓
 Static Build
       ↓
    Vercel
```

Astro använder dessa källfiler under build-processen för att generera den publika portfolion.

För innehållshantering lägger projektet till ett React-baserat Dashboard ovanpå samma filer.

Den publika routen `/trial` erbjuder en sandbox-version av Content Editor där ändringar endast finns i browser state.

Den lokala routen `/dashboard` använder development-only middleware i Astro/Vite dev server för att direkt uppdatera portfolions JSON- och Markdown-filer.

```text
Dashboard
   ↓
Astro / Vite dev middleware
   ↓
JSON / Markdown
   ↓
Git commit
   ↓
Vercel rebuild
```

Detta gör att Git kan fortsätta vara den enda källan till sanning samtidigt som innehållet kan hanteras genom ett visuellt redigeringsflöde.

Det förenklar även den lokala utvecklingsmiljön eftersom portfolion, Dashboard och Content Editor middleware körs genom samma `npm run dev`-process.

## Funktioner

### Statisk HTML-first-portfolio

Den publika portfolion är byggd med Astro och genereras som statiskt innehåll.

Markdown och JSON omvandlas till sidor under build-processen, vilket håller den driftsatta webbplatsen lättviktig och väl anpassad för en portfolio med fokus på utvecklarinformation och tekniska projektstudier.

### Flerspråkigt stöd

Portfolion stöder engelska, svenska och kinesiska.

Varje språk använder statiska routes under:

```text
/en/
/sv/
/zh/
```

Samma struktur används för språkspecifikt projektinnehåll.

```text
/en/projects/
/sv/projects/
/zh/projects/
```

Det gör att webbplatsen kan dela templates och komponenter samtidigt som innehållet hålls separerat mellan språken.

### Project Content Collections

Projektstudier lagras i språkspecifika Markdown-mappar.

```text
src/
└── content/
    └── projects/
        ├── en/
        ├── sv/
        └── zh/
```

Astro Content Collections används för att validera och hantera Markdown-innehållet.

Frontmatter innehåller strukturerad metadata som projektstatus, technologies och links, medan Markdown innehåller själva projektstudien.

### Flerspråkigt JSON-innehåll

About, Skills och Education lagras som flerspråkig JSON.

Språkfilerna organiseras under:

```text
src/i18n/locales/
├── en/
├── sv/
└── zh/
```

Detta separerar strukturerad profilinformation från längre projektinnehåll samtidigt som båda formaten finns kvar i samma repository.

### Publikt Trial-läge

Portfolion innehåller ett publikt Dashboard sandbox på:

```text
/trial
```

Besökare kan utforska Content Editor-gränssnittet och ändra innehåll direkt i browsern.

Ändringarna finns endast i browser state och skrivs aldrig till källfilerna.

När sidan laddas om återställs Trial-innehållet.

### Lokalt Content Dashboard

Ett separat lokalt Dashboard finns på:

```text
/dashboard
```

Det erbjuder ett React-baserat gränssnitt för att hantera portfolions innehåll under development.

Dashboard stöder flerspråkig innehållshantering och projektredigering.

Project Editor har separata vyer för `Edit` och `Preview`, vilket gör det möjligt att kontrollera Markdown-innehållet innan källfilerna uppdateras.

### Development-Only Content Editor Middleware

Det lokala Dashboard kommunicerar med development-only middleware som registreras i Astro/Vite dev server.

I stället för att lagra innehåll i en databas redigerar middleware direkt de JSON- och Markdown-filer som Astro använder.

Middleware används endast under local development.

Content Editor API körs i samma process som Astro/Vite dev server, vilket innebär att ingen separat backend service, port eller proxy behövs.

Production build exponerar inga API:er som kan skriva permanent till portfolions källfiler.

### Responsivt gränssnitt

Tailwind CSS används för layouten i både portfolion och Dashboard.

Gränssnittet är utformat för att fungera på både desktop och mindre skärmar samtidigt som återanvändbara stylingmönster delas mellan sidor och komponenter.

## Arkitektur

Projektet separerar publik rendering från lokal innehållshantering.

### Publik webbplats

```text
Markdown / JSON
      ↓
    Astro
      ↓
 Static HTML
      ↓
   Vercel
```

Den driftsatta portfolion läser innehållet under build-processen och producerar en statisk webbplats.

Det publika Trial-läget ingår också i den statiska deploymenten, men ändringar stannar i browser state och skrivs inte tillbaka till repository-filerna.

### Lokal innehållshantering

```text
React Dashboard
       ↓
Astro / Vite dev middleware
       ↓
Markdown / JSON
       ↓
      Git
       ↓
 Astro Build
       ↓
    Vercel
```

Dashboard fungerar som ett visuellt redigeringslager ovanpå samma källfiler som används av den publika portfolion.

Content Editor middleware körs endast under `astro dev` och är inte en del av production architecture.

## Viktiga beslut

### Behålla innehållet i Git

Markdown och JSON fortsätter att vara portfolions enda källa till sanning.

Det håller innehållet tillsammans med applikationskoden och gör att innehållsändringar kan följa samma Git-workflow som resten av projektet.

Det innebär också att Astro kan generera hela webbplatsen direkt från innehållet i repository vid varje build.

### Använda Astro/Vite Development Middleware

Content Editor behöver endast kunna skriva till filer under local development.

I stället för att behålla en separat backend application implementeras Editor API som development-only middleware i den befintliga Astro/Vite-processen.

Det minskar den lokala utvecklingsmiljön från två processer till en:

```text
Tidigare

Astro / Vite
+
ASP.NET Core
```

```text
Nu

Astro / Vite
├── Portfolio
├── Dashboard
└── Content Editor middleware
```

Detta behåller den statiska production architecture samtidigt som en onödig lokal runtime, extra port och proxy-konfiguration tas bort.

Middleware behåller fortfarande de viktiga beteendena från den tidigare implementationen, inklusive validation, safe path handling, atomic writes, project rename, locale move, collision protection och file deletion.

### Separera Trial och lokalt Dashboard

Projektet erbjuder två versioner av redigeringsupplevelsen för olika syften.

```text
/trial
```

är publik och non-persistent.

```text
/dashboard
```

är avsedd för local development och kan uppdatera det faktiska källinnehållet genom development-only Content Editor middleware.

Det gör det möjligt att demonstrera Dashboard publikt utan att exponera funktionalitet som kan skriva permanent till källfilerna.

### Använda Markdown och JSON för olika typer av innehåll

Projektstudier lagras i Markdown, medan strukturerad profilinformation som About, Skills och Education lagras i JSON.

På så sätt kan varje innehållstyp använda ett format som passar hur den redigeras och renderas.

### Ta bort bloggen

En tidigare version av portfolion innehöll en flerspråkig teknisk blogg.

Att underhålla längre artiklar på flera språk skapade en betydande innehållskostnad samtidigt som bloggen bidrog relativt lite till portfolions huvudsakliga syfte: att presentera mjukvaruprojekt och teknisk kompetens.

Därför togs bloggen bort i stället för att utvecklas vidare till ett större publiceringssystem.

Tekniskt skrivande som syftar till professionell synlighet passar bättre på plattformar som LinkedIn, där det redan finns ett professionellt nätverk och etablerade mekanismer för innehållsdistribution.

Projektspecifika tekniska beslut, arkitekturförändringar och avvägningar finns fortfarande kvar i Project Case Studies, där de direkt stödjer och förklarar arbetet som presenteras.

Det gör att portfolion kan fokusera på sina viktigaste ansvarsområden:

```text
About
→ Vem jag är

Skills
→ Vad jag arbetar med

Projects
→ Vad jag har byggt

Project Case Studies
→ Hur systemen har designats och utvecklats

GitHub
→ Källkod och utvecklingshistorik

LinkedIn
→ Professionellt skrivande och offentlig kommunikation
```

Att ta bort bloggen minskar dessutom duplicerat innehåll, översättningsarbete och långsiktigt underhåll utan att ta bort de tekniska bevis som är viktigast för portfolion.

## Utveckling

Installera frontend dependencies:

```bash
npm install
```

Starta portfolion och den lokala Content Editor:

```bash
npm run dev
```

Development environment körs nu som en enda Astro/Vite-process:

```text
Astro / Vite
├── Portfolio
├── Dashboard
└── Content Editor middleware
```

Standardadressen lokalt är:

```text
http://localhost:4321
```

Ingen separat backend process behöver startas.

## Deployment

Den publika portfolion är deployad på Vercel.

Astro bygger Markdown- och JSON-innehållet till en statisk webbplats.

Development-only Content Editor middleware ingår inte i production deployment, så den deployade portfolion exponerar inga API:er som kan skriva till repository-filerna.

Det publika Trial-läget är fortfarande tillgängligt i production, men alla ändringar lagras endast i browser state.

Innehållsuppdateringar följer ett Git-baserat workflow:

```text
Edit content locally
     ↓
Git commit
     ↓
Vercel rebuild
```

Det gör att den deployade webbplatsen kan förbli statisk samtidigt som portfolions innehåll versionshanteras i repository.

## Framtida förbättringar

- Förbättra redigering och validation i Dashboard
- Fortsätta utveckla Project Case Studies i takt med att systemen utvecklas
- Förbättra architecture diagrams och project visualizations
- Lägga till rikare structured SEO metadata
- Fortsätta förbättra accessibility
- Fortsätta förbättra performance
- Fortsätta förenkla content workflow när maintenance cost överstiger det praktiska värdet