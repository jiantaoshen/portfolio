---
lang: sv

title: "Utvecklarportfolio"

description: "En flerspråkig utvecklarportfolio byggd med Astro, TypeScript, Tailwind CSS och ASP.NET Core, med statisk innehållsrendering, projektstudier, ett publikt dashboard i Trial-läge och ett lokalt arbetsflöde för innehållshantering."

status: "Live"

order: 3

technologies:
  - "Astro"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "ASP.NET Core"
  - "Astro Content Collections"
  - "Markdown"
  - "Vercel"

links:
  github: "https://github.com/jiantaoshen/portfolio-dev"
  live: "https://www.jiantao.dev"

draft: false
---

## Översikt

Developer Portfolio är en flerspråkig utvecklarportfolio byggd med Astro, TypeScript, Tailwind CSS och ASP.NET Core.

Den publika webbplatsen använder Astro för att generera statiska sidor från Markdown- och JSON-innehåll. De engelska, svenska och kinesiska versionerna delar samma applikationsstruktur men använder språkspecifika routes och separat innehåll.

Projektstudier lagras som Markdown genom Astro Content Collections, medan strukturerat profilinnehåll som About, Skills och Education hanteras som flerspråkig JSON.

Projektet innehåller även två dashboard-lägen: ett publikt Trial-gränssnitt för att utforska redigeraren och ett lokalt dashboard med en ASP.NET Core-backend för att hantera portfolions källfiler.

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

Astro använder dessa källfiler under byggprocessen för att generera den publika portfolion.

För innehållshantering lägger projektet till ett React-baserat dashboard ovanpå samma filer.

Den publika routen `/trial` erbjuder en sandbox-version av redigeraren där ändringar endast finns i webbläsarens state.

Den lokala routen `/dashboard` ansluter till en ASP.NET Core-backend som direkt kan uppdatera portfolions JSON- och Markdown-filer.

```text
Dashboard
   ↓
ASP.NET Core
   ↓
JSON / Markdown
   ↓
Git commit
   ↓
Vercel rebuild
```

Detta gör att Git kan fortsätta vara den enda källan till sanning samtidigt som innehållet kan hanteras genom ett visuellt redigeringsflöde.

## Funktioner

### Statisk HTML-first-portfolio

Den publika portfolion är byggd med Astro och genereras som statiskt innehåll.

Markdown och JSON omvandlas till sidor under byggprocessen, vilket håller den driftsatta webbplatsen lättviktig och väl anpassad för en portfolio med fokus på utvecklarinformation och tekniska projektstudier.

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

Frontmatter innehåller strukturerad metadata som projektstatus, tekniker och länkar, medan Markdown innehåller själva projektstudien.

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

Portfolion innehåller ett publikt dashboard-sandbox på:

```text
/trial
```

Besökare kan utforska redigeringsgränssnittet och ändra innehåll direkt i webbläsaren.

Ändringarna finns endast i webbläsarens state och skrivs aldrig till källfilerna.

När sidan laddas om återställs Trial-innehållet.

### Lokalt Content Dashboard

Ett separat lokalt dashboard finns på:

```text
/dashboard
```

Det erbjuder ett React-baserat gränssnitt för att hantera portfolions innehåll under utveckling.

Dashboardet stöder flerspråkig innehållshantering och projektredigering.

Projektredigeraren har separata vyer för `Edit` och `Preview`, vilket gör det möjligt att kontrollera Markdown-innehållet innan källfilerna uppdateras.

### ASP.NET Core-backend för innehåll

Det lokala dashboardet kommunicerar med en mindre ASP.NET Core-backend.

I stället för att lagra innehåll i en databas redigerar backend-tjänsten direkt de JSON- och Markdown-filer som Astro använder.

Backend-tjänsten används endast under lokal utveckling.

Det innebär att produktionsportfolion inte är beroende av en applikationsserver för att leverera innehåll.

### Responsivt gränssnitt

Tailwind CSS används för layouten i både portfolion och dashboardet.

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

Den driftsatta portfolion läser innehållet under byggprocessen och producerar en statisk webbplats.

### Lokal innehållshantering

```text
React Dashboard
       ↓
ASP.NET Core
       ↓
Markdown / JSON
       ↓
      Git
       ↓
 Astro Build
       ↓
    Vercel
```

Dashboardet fungerar som ett visuellt redigeringslager ovanpå samma källfiler som används av den publika portfolion.

Det finns ingen separat produktionsdatabas för innehåll.

## Viktiga beslut

### Behålla innehållet i Git

Markdown och JSON fortsätter att vara portfolions enda källa till sanning.

Det håller innehållet tillsammans med applikationskoden och gör att innehållsändringar kan följa samma Git-arbetsflöde som resten av projektet.

Det innebär också att Astro kan generera hela webbplatsen direkt från innehållet i repositoryt vid varje build.

### Använda en lokal backend

ASP.NET Core-backenden behövs endast när lokala källfiler ska redigeras.

Den behöver inte köras som en del av den driftsatta portfolion.

Detta håller produktionsarkitekturen enklare samtidigt som dashboardet kan erbjuda filbaserad innehållshantering under utveckling.

### Separera Trial och lokalt Dashboard

Projektet erbjuder två versioner av redigeringsupplevelsen för olika syften.

```text
/trial
```

är publik och icke-persistent.

```text
/dashboard
```

är avsedd för lokal utveckling och kan uppdatera det faktiska källinnehållet genom ASP.NET Core.

Det gör det möjligt att demonstrera dashboardet publikt utan att exponera funktionalitet som kan skriva till källfilerna.

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

Project case studies
→ Hur systemen har designats och utvecklats

GitHub
→ Källkod och utvecklingshistorik

LinkedIn
→ Professionellt skrivande och offentlig kommunikation
```

Att ta bort bloggen minskar dessutom duplicerat innehåll, översättningsarbete och långsiktigt underhåll utan att ta bort de tekniska bevis som är viktigast för portfolion.

## Utveckling

Installera frontend-beroenden:

```bash
npm install
```

Starta Astro:

```bash
npm run dev
```

Starta den lokala ASP.NET Core-backenden för innehåll:

```bash
cd backend/Career.Api
dotnet run
```

Standardadresserna lokalt är:

```text
Astro:   http://localhost:4321
Backend: http://127.0.0.1:5080
```

## Driftsättning

Den publika portfolion är driftsatt på Vercel.

Astro bygger Markdown- och JSON-innehållet till den statiska webbplatsen, medan ASP.NET Core-tjänsten förblir en del av det lokala utvecklingsflödet.

Innehållsuppdateringar följer ett Git-baserat arbetsflöde:

```text
Edit content
     ↓
Git commit
     ↓
Vercel rebuild
```

Det gör att den driftsatta webbplatsen kan förbli statisk samtidigt som portfolions innehåll versionshanteras i repositoryt.

## Framtida förbättringar

- Förbättra redigering och validering i dashboardet
- Fortsätta utveckla Project Case Studies i takt med att systemen utvecklas
- Förbättra arkitekturdiagram och projektvisualiseringar
- Lägga till rikare strukturerad SEO-metadata
- Fortsätta förbättra tillgängligheten
- Fortsätta förbättra prestandan
- Fortsätta förenkla innehållsflödet när underhållskostnaden överstiger det praktiska värdet