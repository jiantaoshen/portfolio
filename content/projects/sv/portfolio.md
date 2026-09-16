---

lang: sv
title: "Utvecklarportfolio"
description: "En flerspråkig portfolio och ett lättviktigt Git-baserat innehållshanteringssystem (CMS) med en publik CMS-demo och lokal redigering av källinnehåll."
status: "Live"
order: 3
technologies:
   - "Next.js 16"
   - "TypeScript"
   - "Tailwind CSS v4"
   - "shadcn/ui"
   - "next-intl"
   - "GitHub"
   - "Vercel"
links:
  github: "https://github.com/jiantaoshen/portfolio-dev"
  live: "https://www.jiantao.dev"
  draft: false

---

## Översikt

Detta är en flerspråkig portfolio och ett lättviktigt Git-baserat innehållshanteringssystem byggt med Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui och next-intl. Den publika webbplatsen stöder engelska, svenska och kinesiska genom lokalanpassade routes och innehåll. Projektstudier lagras som Markdown, medan strukturerat profilinnehåll som Om, Kompetenser och Utbildning hanteras som flerspråkig JSON.

Projektet innehåller också två sätt att redigera innehåll:

-Ett publikt Trial-läge där CMS-gränssnittet kan utforskas utan bestående ändringar
-En lokal Dashboard för redigering av repositoryts faktiska JSON- och Markdown-filer under utveckling

Den nuvarande arkitekturen behåller Git som källa till sanningen, undviker en produktionsdatabas för innehåll och använder samma Next.js-applikation för publik rendering, CMS-gränssnitt, lokalisering och utvecklingsspecifika innehålls-API:er.

---

## Problemet

En flerspråkig portfolio innehåller flera typer av innehåll som behöver hållas organiserade och enkla att underhålla.

Projektet innehåller:

-Om- och CV-information
-Kompetenser och utbildning
-Projektmetadata
-Längre projektstudier
-Innehåll på engelska, svenska och kinesiska
-Översättningar för det publika gränssnittet
-Översättningar för CMS-gränssnittet

Att redigera allt detta direkt i JSON- och Markdown-filer fungerar i liten skala, men blir allt mindre praktiskt när mängden innehåll växer.

Samtidigt behöver portfolion inte ett traditionellt produktions-CMS. Innehållet förändras relativt sällan och passar naturligt tillsammans med applikationskoden. Att införa en databas, autentiseringssystem, hostat CMS och permanent skriv-API skulle innebära mycket infrastruktur i förhållande till nyttan.

Målet var därför att behålla fördelarna med att lagra innehållet i GitHub samtidigt som redigeringsflödet blev enklare.

---

## Lösning

Portfolion använder nu en enda Next.js App Router-applikation.

Det grundläggande innehållsflödet är medvetet enkelt:

```text
JSON / Markdown
      ↓
   Next.js
      ↓
Publik portfolio
      ↓
    Vercel
```

Projektstudier lagras i Markdown. Om, Kompetenser och Utbildning lagras som flerspråkig JSON.

CMS:et arbetar direkt mot samma källfiler under lokal utveckling.

```text
Lokal Dashboard
      ↓
Next.js Route Handlers
      ↓
JSON / Markdown
      ↓
    Git diff
      ↓
   Git commit
      ↓
     Vercel
```

Den publika `/trial`-routen använder samma redigeringsgränssnitt men behåller alla ändringar i webbläsarens/applikationens tillstånd.

Inga bestående skrivoperationer utförs i Trial-läget.

Detta gör att Git fortsatt kan vara källan till sanningen samtidigt som ett visuellt redigeringsflöde kan erbjudas.

---

## Funktioner

### Flerspråkig portfolio

Portfolion stöder:

```text
Engelska
Svenska
Kinesiska
```

De publika routsen har språkprefix:

```text
/en
/sv
/zh
```

Rotrouten omdirigerar till svenska:

```text
/
↓
/sv
```

Lokaliserade projektsidor följer samma struktur:

```text
/en/projects/...
/sv/projects/...
/zh/projects/...
```

Varje språk kan ha en självständig version av samma projekt.

---

### Next.js App Router

Applikationen använder Next.js App Router.

Den publika portfolion är organiserad under:

```text
app/[locale]/
```

Projektsidor använder en catch-all-route:

```text
app/[locale]/projects/[...slug]/
```

Detta stöder både enkla och nästlade projektsökvägar.

Exempel:

```text
/en/projects/light-manager
/sv/projects/light-manager
/zh/projects/light-manager
```

och:

```text
/en/projects/backend/example-project
```

---

### Flera Root Layouts

Den publika webbplatsen och CMS:et använder separata root layouts.

```text
app/[locale]/layout.tsx
```

hanterar den lokaliserade portfolion.

```text
app/(career)/layout.tsx
```

hanterar Trial- och Dashboard-upplevelserna.

Segmentet `(career)` är en Next.js Route Group och visas därför inte i URL:en.

Det gör att följande routes kan exponeras:

```text
/dashboard
/trial
```

utan att `/career` läggs till i den publika URL-strukturen.

Separationen gör det också möjligt för den publika portfolion och CMS:et att använda olika strategier för request-baserad lokalisering samtidigt som de delar globala stilar och UI-komponenter.

---

### Lokalisering med next-intl

Internationalisering hanteras med `next-intl`.

Grundkonfigurationen finns under:

```text
i18n/
├── request.ts
├── routing.ts
└── locales/
```

Lokaliserade meddelanden organiseras efter språk:

```text
i18n/locales/
├── en/
├── sv/
└── zh/
```

Varje språk innehåller meddelandefiler som:

```text
about.json
common.json
dashboard.json
home.json
project.json
```

Server Components använder serverbaserade översättningshjälpare.

Client Components använder översättningshooks.

Detta ersatte projektets tidigare egenbyggda översättningsloader och minskade mängden specialkod för internationalisering.

---

### Separata gränssnitts- och innehållsspråk

CMS:et skiljer mellan två olika typer av språk:

```text
CMS-gränssnittets språk
≠
Portfolions innehållsspråk
```

Gränssnittsspråket styr etiketter som:

```text
Spara
Ta bort
Förhandsgranska
Projekt
Utbildning
Kompetenser
```

Innehållsspråket styr vilket portfolioinnehåll som redigeras.

Exempel:

```text
CMS-gränssnitt
→ 中文

Innehåll som redigeras
→ Svenska
```

CMS-gränssnittets locale lagras oberoende av valt innehållsspråk.

Det förhindrar att språket i själva redigeringsverktyget kopplas ihop med språket för innehållet som redigeras.

---

### Projektinnehåll i Markdown

Projektstudier lagras under:

```text
content/
└── projects/
    ├── en/
    ├── sv/
    └── zh/
```

Varje projekt är en Markdown-fil med strukturerad frontmatter.

Exempel:

```yaml
---
lang: en
title: Example Project
description: Example project description
status: Live
order: 1
technologies:
  - Next.js
  - TypeScript
links:
  github: https://github.com/example/project
  live: https://example.com
draft: false
---
```

Markdown-innehållet innehåller den längre projektstudien.

```markdown
## Översikt

Projektbeskrivning...

## Arkitektur

Tekniska detaljer...
```

Den publika projektsidan extraherar även rubriker från Markdown för att generera en innehållsförteckning.

---

### Flerspråkigt JSON-innehåll

Strukturerat profilinnehåll som Om, Kompetenser och Utbildning lagras som JSON.

```text
i18n/locales/
├── en/
│   └── about.json
├── sv/
│   └── about.json
└── zh/
    └── about.json
```

Varje språk har sitt eget innehåll.

Det håller strukturerad profilinformation separerad från längre projektstudier samtidigt som båda formaten finns kvar i repositoryt.

---

### Publikt Trial-läge

Portfolion innehåller en publik CMS-sandlåda på:

```text
/trial
```

Ytterligare routes:

```text
/trial/cv
/trial/projects
```

Besökare kan utforska redigeringsgränssnittet och ändra innehåll utan att påverka repositoryts filer.

Ändringarna finns endast i tillfälligt applikationstillstånd.

```text
Besökare
   ↓
Trial CMS
   ↓
Tillfälligt webbläsartillstånd
```

Ingen bestående innehållsförfrågan skickas till de lokala skriv-API:erna.

Det gör att CMS:et kan demonstreras offentligt utan att ge tillgång till att ändra repositoryt.

---

### Lokal innehålls-Dashboard

Den lokala Dashboarden finns på:

```text
/dashboard
```

med sektioner som:

```text
/dashboard/cv
/dashboard/projects
```

Dashboarden fungerar som ett visuellt redigeringslager ovanpå samma JSON- och Markdown-filer som används av den publika portfolion.

CV-redigeraren stöder:

-Introduktion
-Kompetenser
-Kompetenskategorier
-Tekniker
-Utbildning
-Lärandeaktiviteter
-Utbildningsbeskrivningar
-Examensarbete
-Länkar till examensarbete

Projektredigeraren stöder:

-Titel
-Slug
-Projektstatus
-Språk
-Beskrivning
-Tekniker
-GitHub-URL
-Live-URL
-Visningsordning
-Publiceringsstatus
-Markdown-innehåll

Projektredigeraren har även separata lägen:

```text
Redigera
Förhandsgranska
```

Det gör att Markdown-ändringar kan granskas innan de skrivs till disk.

---

### Innehålls-API:er endast för utveckling

Bestående lokal redigering implementeras med Next.js Route Handlers.

Nuvarande endpoints:

```text
PUT /api/local/about/[locale]

PUT /api/local/projects
DELETE /api/local/projects
```

About-endpointen skriver till:

```text
i18n/locales/{locale}/about.json
```

Projekt-endpointen hanterar filer under:

```text
content/projects/{locale}/
```

Projektredigeringen stöder:

-Skapande av projekt
-Uppdatering av befintliga projekt
-Ändring av slug
-Ändring av innehållsspråk
-Flytt av projekt mellan språkmappar
-Markdown-källfiler
-Upptäckt av befintliga MDX-källfiler
-Borttagning av projekt

När slug eller språk ändras skrivs den nya filen innan den tidigare källfilen tas bort.

---

### Skrivoperationer endast under utveckling

Det lokala innehålls-API:et är avsiktligt otillgängligt i produktion.

Skrivhandlers kontrollerar miljön innan någon filoperation utförs.

```text
NODE_ENV === "development"
```

Förfrågningar utanför utvecklingsmiljön får:

```text
403 Forbidden
```

Säkerhetsmodellen blir därför:

```text
Publik portfolio
→ Skrivskyddad

Publik Trial
→ Tillfälligt webbläsartillstånd

Lokal Dashboard
→ Filskrivning endast under utveckling
```

Inget bestående API för repositoryredigering exponeras avsiktligt i produktion.

---

### Gemensamt UI-system

Projektet använder:

```text
Tailwind CSS v4
+
shadcn/ui
+
semantiska designtokens
```

Återanvändbara UI-primitiver finns under:

```text
components/ui/
```

Exempel:

```text
Button
Badge
Card
Input
Label
Textarea
Sheet
Alert
```

Den publika portfolion och CMS:et delar samma komponentsystem.

Detta minskade duplicerade UI-mönster och gör att Dashboarden känns som en del av samma produkt istället för ett separat internt verktyg.

---

### Semantisk styling

Designsystemet använder semantiska Tailwind-klasser istället för utspridda hårdkodade färger.

Exempel:

```text
bg-background
bg-muted
bg-primary

text-foreground
text-muted-foreground
text-primary

border-border
```

Den underliggande färgpaletten definieras centralt genom CSS-variabler.

Det gör visuella förändringar enklare att underhålla och håller den publika portfolion och CMS:et visuellt konsekventa.

---

## Arkitektur

### Publik webbplats

```text
Lokaliserad JSON
      +
Lokaliserad Markdown
      ↓
   Next.js
      ↓
Server Components
      ↓
Genererade sidor
      ↓
    Vercel
```

Lokaliserade routes och projektsidor genereras från innehåll i repositoryt.

Git förblir källan till sanningen.

---

### Lokal innehållshantering

```text
Dashboard
   ↓
Career Workspace
   ↓
Next.js Route Handlers
   ↓
Markdown / JSON
   ↓
Git
   ↓
Vercel
```

Ingen separat backend-process krävs.

Next.js utvecklingsserver tillhandahåller:

```text
Next.js
├── Publik portfolio
├── Trial CMS
├── Lokal Dashboard
└── Route Handlers endast för utveckling
```

---

## Migrering från Astro till Next.js

Den tidigare versionen av portfolion byggdes med Astro.

Den arkitekturen passade bra när projektet huvudsakligen var en statiskt genererad portfolio.

Den ursprungliga strukturen:

```text
Markdown / JSON
      ↓
    Astro
      ↓
 Statisk HTML
      ↓
   Vercel
```

CMS:et lades senare till som ett React-gränssnitt.

Bestående lokal innehållsredigering implementerades genom utvecklingsspecifik middleware registrerad i Astro/Vite-utvecklingsservern.

```text
React Dashboard
      ↓
Astro / Vite middleware
      ↓
Markdown / JSON
```

Detta gjorde det möjligt att undvika en separat backend-tjänst.

---

### Före

```text
Astro
├── Publik portfolio
├── Statiska routes
├── Markdown Content Collections
│
├── React CMS
│   ├── Trial-läge
│   └── Lokal Dashboard
│
└── Astro / Vite middleware
    └── Skrivoperationer endast för utveckling
```

---

### Efter

```text
Next.js
├── Lokaliserad portfolio
├── Projektsidor
├── Trial CMS
├── Lokal Dashboard
├── Server Components
├── Client Components
├── next-intl
└── Route Handlers
    └── Skrivoperationer endast för utveckling
```

Migreringen samlade publik rendering, CMS-routing, lokalisering och serverside-funktionalitet i ett enda ramverk.

---

### Migrering av routing

Astros språkbaserade routes ersattes med ett dynamiskt locale-segment i App Router:

```text
app/[locale]/
```

Portfolion exponerar fortfarande:

```text
/en
/sv
/zh
```

men routinglogiken är nu centraliserad kring locale-segmentet.

Projektsidorna flyttades till:

```text
app/[locale]/projects/[...slug]/
```

CMS-routsen placerades i:

```text
app/(career)/
```

vilket håller URL:erna rena samtidigt som CMS:et kan använda en separat layout.

---

### Migrering av internationalisering

Det ursprungliga projektet använde en egen översättningsloader.

Next.js-versionen ersatte detta lager med `next-intl`.

Det gav separata mönster för Server och Client Components och tog bort behovet av att manuellt skicka stora översättningsobjekt genom applikationen.

Migreringen utökade även lokaliseringen till själva CMS:et.

Det ledde till en uttrycklig separation mellan:

```text
interface locale
```

och:

```text
content locale
```

vilket nu är en del av CMS-arkitekturen.

---

### Migrering av projektinnehåll

Astro Content Collections togs bort.

Markdown-filerna behölls.

Projekt läses nu direkt från:

```text
content/projects/
```

Frontmatter fortsätter innehålla strukturerad projektmetadata medan Markdown innehåller själva projektstudien.

Det viktiga arkitekturbeslutet förblev oförändrat:

```text
Innehållet stannar i Git.
```

Endast den ramverksspecifika innehållsladdningen ändrades.

---

### Migrering av det lokala editor-API:et

Astro-versionen använde egen Vite-middleware för innehållsskrivning.

Next.js-versionen ersatte denna middleware med vanliga Route Handlers.

```text
Före

Dashboard
   ↓
Astro / Vite middleware
   ↓
Filer
```

```text
Efter

Dashboard
   ↓
Next.js Route Handlers
   ↓
Filer
```

Detta tog bort ramverksspecifik servermiddleware samtidigt som samma utvecklingsspecifika säkerhetsgräns behölls.

---

### Migrering av UI-lagret

Migreringen innehöll även en upprensning av UI-lagret.

Äldre egna komponent- och stylingmönster ersattes med:

```text
shadcn/ui
+
Tailwind CSS v4
+
semantiska designtokens
```

Gemensamma komponenter används nu både i den publika portfolion och i CMS:et.

Det minskade duplicerad styling och förenklade framtida designförändringar.

---

### Resultatet av migreringen

Migreringen förändrade ramverksarkitekturen utan att ändra projektets grundläggande innehållsfilosofi.

Den ursprungliga principen var:

```text
Innehåll
→ Git
→ Statisk/publik webbplats
```

Den nuvarande principen är fortfarande:

```text
Innehåll
→ Git
→ Next.js
→ Vercel
```

Den största förbättringen är konsolidering.

Istället för att underhålla:

```text
Astro
+
React
+
Egen dev-middleware
+
Egen i18n
```

förlitar sig projektet nu huvudsakligen på:

```text
Next.js
+
next-intl
+
Route Handlers
+
gemensamma React-komponenter
```

Resultatet är en enklare applikationsgräns samtidigt som det lättviktiga Git-baserade arbetsflödet bevaras.

---

## Viktiga beslut

### Behålla innehållet i Git

Markdown och JSON förblir källan till sanningen.

Det håller portfolioinnehållet versionshanterat tillsammans med applikationskoden.

Varje bestående innehållsändring kan därför granskas med:

```text
git diff
```

innan den committas.

Arbetsflödet är:

```text
Redigera
   ↓
Granska diff
   ↓
Commit
   ↓
Push
   ↓
Vercel deployment
```

Detta ger:

-Full historik
-Enkel rollback
-Granskningsbara innehållsändringar
-Ingen CMS-databas
-Ingen separat backupstrategi för innehåll
-Portabel Markdown och JSON

---

### Undvika en CMS-databas i produktion

Portfolion kräver inte frekvent gemensam publicering eller realtidsredigering i produktion.

En produktionsdatabas för CMS skulle därför innebära:

-Ytterligare infrastruktur
-Autentiseringskrav
-API-hantering
-Databashosting
-Problem kring innehållssynkronisering
-Högre operativ komplexitet

utan att ge tillräckligt värde för det nuvarande användningsfallet.

Repositorybaserat innehåll är enklare och passar projektets uppdateringsfrekvens.

---

### Redigering endast under utveckling

Bestående redigering är avsiktligt en lokal utvecklingsfunktion.

Det gör att produktionsapplikationen kan fokusera på att presentera portfolioinnehållet istället för att administrera det.

Dashboarden ger bekvämlighet utan att göra portfolion till ett permanent skrivbart produktions-CMS.

---

### Separera Trial och lokalt läge

Samma grundläggande editor stöder två olika syften.

```text
/trial
```

är publik och icke-bestående.

```text
/dashboard
```

är avsedd för lokal utveckling och kan ändra källfiler.

Det gör att själva CMS:et kan demonstreras som en del av portfolion utan att exponera skrivbehörighet.

---

### Markdown och JSON för olika innehållstyper

Olika typer av innehåll använder olika lagringsformat.

Projektstudier använder Markdown eftersom de innehåller längre tekniska texter.

Strukturerad profilinformation använder JSON eftersom den består av förutsägbara fält och upprepade strukturerade objekt.

```text
Markdown
→ Projektstudier

JSON
→ Om
→ Kompetenser
→ Utbildning
```

Det undviker att tvinga allt innehåll till samma datamodell.

---

### Separera UI-översättning från redigerbart innehåll

Alla lokaliserade värden har inte samma ansvar.

UI-meddelanden som:

```text
Spara
Ta bort
Projekt
Förhandsgranska
Tillbaka till projekt
```

hör hemma i översättningslagret.

Faktiskt portfolioinnehåll som:

```text
Om-beskrivning
Utbildning
Kompetenser
Projektsammanfattning
Projektstudie
```

är redigerbart innehåll.

Projektet håller gradvis dessa ansvarsområden separerade så att internationaliseringsinfrastrukturen inte blir själva innehållsmodellen.

---

### Ta bort bloggen

En tidigare version av portfolion innehöll en flerspråkig teknisk blogg.

Att underhålla längre artiklar på flera språk innebar betydande översättnings- och underhållsarbete samtidigt som det bidrog relativt lite till portfolions huvudsakliga syfte.

Bloggen togs därför bort istället för att utvecklas till en större publiceringsplattform.

Tekniskt skrivande för professionell synlighet passar bättre på plattformar som LinkedIn, där distribution och professionell kontext redan finns.

Projektspecifika tekniska beslut finns istället kvar i projektstudierna där de direkt stödjer systemen som presenteras.

Portfolion fokuserar därför på:

```text
Om
→ Vem jag är

Kompetenser
→ Vad jag arbetar med

Projekt
→ Vad jag har byggt

Projektstudier
→ Hur systemen designades och utvecklades

GitHub
→ Källkod och utvecklingshistorik

LinkedIn
→ Professionellt skrivande och kommunikation
```

Det minskar duplicerat innehåll och översättningsarbete samtidigt som den tekniska evidens som är mest relevant för portfolion behålls.

---

## Projektstruktur

En förenklad vy av nuvarande repository:

```text
.
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects/
│   │       └── [...slug]/
│   │
│   ├── (career)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   └── trial/
│   │
│   ├── api/
│   │   └── local/
│   │
│   └── globals.css
│
├── career/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── server/
│   └── workspace.tsx
│
├── components/
│   ├── content/
│   ├── page/
│   └── ui/
│
├── content/
│   └── projects/
│       ├── en/
│       ├── sv/
│       └── zh/
│
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── locales/
│       ├── en/
│       ├── sv/
│       └── zh/
│
├── lib/
│   └── content/
│
├── next.config.ts
└── package.json
```

---

## Utveckling

Installera beroenden:

```bash
npm install
```

Starta utvecklingsservern:

```bash
npm run dev
```

Standardadressen lokalt är:

```text
http://localhost:3000
```

Publik portfolio:

```text
http://localhost:3000/sv
http://localhost:3000/en
http://localhost:3000/zh
```

Lokal Dashboard:

```text
http://localhost:3000/dashboard
```

Trial:

```text
http://localhost:3000/trial
```

Ingen separat backend-process krävs.

Utvecklingsmiljön körs genom Next.js:

```text
Next.js
├── Publik portfolio
├── Trial CMS
├── Lokal Dashboard
└── Route Handlers endast för utveckling
```

---

## Build

Skapa en produktionsbuild:

```bash
npm run build
```

Build-processen validerar Next.js-applikationen, lokaliserade routes, TypeScript-koden och gränserna mellan Server och Client Components.

---

## Deployment

Portfolion deployas genom Vercel.

Innehållsändringar följer ett Git-baserat arbetsflöde:

```text
Redigera lokalt
     ↓
Granska Git diff
     ↓
Git commit
     ↓
Git push
     ↓
Vercel rebuild
```

Bestående innehållsskrivning är begränsad till lokal utveckling.

Den publika Trial-versionen finns kvar i produktion men sparar inte ändringar.

---

## Nuvarande arkitektur

```text
                  Git Repository
                        │
             ┌──────────┴──────────┐
             │                     │
       JSON-innehåll         Markdown-innehåll
             │                     │
             └──────────┬──────────┘
                        ↓
                     Next.js
                        │
        ┌───────────────┼────────────────┐
        │               │                │
Publik portfolio     Trial CMS      Lokal Dashboard
        │               │                │
        │       Webbläsartillstånd       ↓
        │                         Route Handlers
        │                                │
        │                         JSON / Markdown
        │                                │
        └────────────────┬───────────────┘
                         ↓
                        Git
                         ↓
                       Vercel
```

Repositoryt förblir källan till sanningen genom hela arbetsflödet.

## Portfolions historia

Mitt portfolioprojekt började ursprungligen med endast HTML och CSS. Efter att jag hade lärt mig React under mina studier migrerade jag webbplatsen till React.

Senare stötte jag på ett problem kopplat till JavaScript. När JavaScript var avstängt i webbläsaren visades webbplatsen inte korrekt. På grund av detta migrerade jag så småningom projektet till Astro.

Ungefär samtidigt lade jag även till en blogg så att jag kunde publicera och dela texter. När bloggen växte blev det dock svårt att hantera innehållet manuellt. För att lösa detta skapade jag ett eget CMS med C#.

När projektet fortsatte att utvecklas ville jag förenkla den övergripande arkitekturen. Jag ersatte därför C#-CMS:et med en React-baserad lösning och tog bort bloggfunktionen.

Jag märkte också ett annat prestandaproblem. Webbplatsen kunde ibland rendera HTML först och ladda CSS därefter. Detta märktes särskilt på långsammare internetanslutningar eftersom användaren kort kunde se en ostylad version av sidan.

Jag testade att placera CSS direkt i HTML så att båda kunde levereras tillsammans, men det löste inte problemet.

Senare lärde jag mig att Next.js stöder server-side rendering och fortfarande kan leverera renderad HTML när JavaScript är avstängt i webbläsaren.

Därför bestämde jag mig för att migrera webbplatsen från Astro till Next.js.

## Lighthouse-resultat — Astro (mobil)

**First Contentful Paint:*-0.8 s

**Largest Contentful Paint:*-0.8 s

**Total Blocking Time:*-0 ms

**Cumulative Layout Shift:*-0

**Speed Index:*-0.8 s

**Performance:*-100

**Accessibility:*-94

-Bakgrunds- och förgrundsfärger har inte tillräcklig kontrast.

**Best Practices:*-100

**SEO:*-100

**Agentic Browsing:*-2/2

Jag inkluderar inte desktop-resultaten eftersom desktop-prestandan redan är bättre än mobilprestandan.

## Lighthouse-resultat — Next.js (mobil)

**First Contentful Paint:*-1.2 s

**Largest Contentful Paint:*-2.1 s

**Total Blocking Time:*-40 ms

**Cumulative Layout Shift:*-0

**Speed Index:*-3.9 s

**Performance:*-97

-En del JavaScript används inte.

**Accessibility:*-96

-Bakgrunds- och förgrundsfärger har inte tillräcklig kontrast.

**Best Practices:*-100

**SEO:*-100

**Agentic Browsing:*-2/2

## Framtida förbättringar

Mitt nästa mål är att förbättra Next.js-versionen så att prestandan ligger så nära Astro-versionen som möjligt, samtidigt som fördelarna med den nya arkitekturen behålls.

---

## Framtida förbättringar
- Förbättra prestandan
- Förbättra SEO
