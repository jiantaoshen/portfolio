---
lang: sv
title: Portfölj
description: >-
  En flerspråkig portfölj och ett lättviktigt Git-baserat
  innehållshanteringssystem (CMS) med ett offentligt CMS-testläge och lokal
  redigering av källinnehåll.
status: Live
order: 3
technologies:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - next-intl
  - GitHub
  - Vercel
links:
  github: 'https://github.com/jiantaoshen/portfolio-dev'
  live: 'https://www.jiantao.dev'
draft: false
---

## Översikt

Det här är en flerspråkig portfölj och ett lättviktigt Git-baserat innehållshanteringssystem byggt med Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui och next-intl. Den publika webbplatsen stöder engelska, svenska och kinesiska genom språkspecifika routes och innehåll. Projektens fallstudier lagras i Markdown, medan strukturerat profilinnehåll som Om mig, Färdigheter och Utbildning hanteras som flerspråkig JSON.

Projektet innehåller också två olika sätt att redigera innehåll:

- Ett offentligt testläge där man kan utforska CMS-gränssnittet utan att ändringarna sparas permanent
- En lokal Dashboard för att redigera repositoryts faktiska JSON- och Markdown-källfiler under utveckling

Den nuvarande arkitekturen använder Git som den enda källan till sanning, undviker en innehållsdatabas i produktion och använder samma Next.js-applikation för publik rendering, CMS-gränssnitt, lokalisering och innehålls-API:er som endast används under utveckling.

## Problemet

En flerspråkig portfölj innehåller flera typer av innehåll som behöver hållas organiserade och enkla att underhålla.

Det här projektet innehåller:

- Information om mig och mitt CV
- Färdigheter och utbildning
- Projektmetadata
- Längre projektfallstudier
- Innehåll på engelska, svenska och kinesiska
- Översättningar för det publika användargränssnittet
- Översättningar för CMS-gränssnittet

Att redigera allt detta direkt i JSON- och Markdown-filer fungerar bra i liten skala, men blir allt mer opraktiskt när mängden innehåll växer. Samtidigt behöver portföljen inte ett traditionellt CMS för produktion. Innehållet ändras relativt sällan och passar naturligt tillsammans med applikationskoden. Att införa en databas, ett autentiseringssystem, ett hostat CMS och ett permanent skriv-API skulle skapa mer infrastruktur med begränsat värde och höga kostnader. Målet blev därför att behålla fördelarna med att lagra innehållet i GitHub och samtidigt skapa ett mer praktiskt redigeringsflöde.

## Resultat

Portföljen använder nu en enda Next.js App Router-applikation. Det grundläggande innehållsflödet är medvetet enkelt:

```text
JSON / Markdown
      ↓
   Next.js
      ↓
Publik portfölj
      ↓
    Vercel
```

Projektfallstudier lagras i Markdown. Innehåll för Om mig, Färdigheter och Utbildning lagras som flerspråkig JSON. Under lokal utveckling arbetar CMS:et direkt mot samma källfiler.

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

Den publika routen `/trial` använder samma redigeringsgränssnitt, men alla ändringar hålls i webbläsarens/applikationens state. Inga permanenta skrivoperationer utförs i testläget. På så sätt förblir Git den enda källan till sanning samtidigt som projektet fortfarande erbjuder ett visuellt arbetsflöde för innehållshantering.

## Avvägningar

Här beskriver jag mina val och överväganden.

### Flerspråkig portfölj

Anledningen till att jag skapade en flerspråkig portfölj är att jag vill förbättra både mina språkkunskaper och min förmåga att skriva dokumentation. Nackdelen är att jag behöver hantera mycket dokumentation, vilket innebär att jag inte kan arbeta med alltför många projekt samtidigt.

Just nu har jag inte så många projekt att hantera, så det fungerar bra. Om antalet projekt ökar i framtiden kan jag byta från en flerspråkig portfölj till en portfölj på ett enda språk för att hålla den enkel och lättare att underhålla.

### Varför jag valde Next.js

> HTML/CSS -> React -> Astro -> Astro + C# -> Astro + React -> Next.js (nu)

Mitt portföljprojekt började ursprungligen med enbart HTML och CSS. Efter att jag lärde mig React under mina studier migrerade jag webbplatsen till React. Senare stötte jag på ett problem kopplat till JavaScript. När JavaScript var avstängt i webbläsaren visades webbplatsen inte korrekt. Därför migrerade jag så småningom projektet till Astro.

Ungefär samtidigt lade jag också till en bloggfunktion för att kunna publicera och dela det jag skrev. När bloggen växte blev det dock svårt att hantera innehållet manuellt. För att lösa det problemet byggde jag ett eget CMS med C#. När projektet fortsatte att utvecklas ville jag förenkla den övergripande arkitekturen. Därför ersatte jag CMS:et i C# med en React-baserad lösning och tog bort bloggfunktionen. Jag upptäckte också ett annat prestandaproblem. Webbplatsen kunde ibland rendera HTML först och läsa in CSS efteråt. Det märktes särskilt på långsammare internetanslutningar, eftersom användaren kort kunde se en ostylad version av sidan. Jag försökte lägga CSS direkt i HTML-filen så att båda kunde levereras tillsammans, men det löste inte problemet.

Senare lärde jag mig att Next.js stöder server-side rendering och fortfarande kan leverera renderad HTML även när JavaScript är avstängt i webbläsaren. Därför bestämde jag mig för att migrera webbplatsen från Astro till Next.js. Resultatet är sämre än Astro i Lighthouse-testet. Det gick inte heller att minska mängden JavaScript som används i deploymenten med hjälp av `.vercelignore`. Däremot är användarupplevelsen bättre. Jag tycker att en bättre användarupplevelse är viktigare än maximal hastighet.

#### Lighthouse-resultat — Astro (mobil)

**First Contentful Paint:** 0.8 s

**Largest Contentful Paint:** 0.8 s

**Total Blocking Time:** 0 ms

**Cumulative Layout Shift:** 0

**Speed Index:** 0.8 s

**Performance:** 100

**Accessibility:** 94

- Bakgrunds- och förgrundsfärgerna har inte tillräckligt hög kontrast.

**Best Practices:** 100

**SEO:** 100

**Agentic Browsing:** 2/2

Jag tar inte med resultaten för desktop eftersom prestandan där redan är bättre än på mobil.

#### Lighthouse-resultat — Next.js (mobil)

**First Contentful Paint:** 1.2 s

**Largest Contentful Paint:** 2.1 s

**Total Blocking Time:** 40 ms

**Cumulative Layout Shift:** 0

**Speed Index:** 3.9 s

**Performance:** 97

- En del JavaScript används inte.

**Accessibility:** 96

- Bakgrunds- och förgrundsfärgerna har inte tillräckligt hög kontrast.

**Best Practices:** 100

**SEO:** 100

**Agentic Browsing:** 2/2

### JSON och Markdown

Det mesta av mina data består av dokumentationsliknande innehåll, och det finns inga komplexa relationer mellan datan. I det här projektet läser vi ofta in datan en gång och använder den direkt. Vi behöver inte göra komplexa queries eller hantera relationer mellan olika delar av datan. JSON-filer är enkla att sätta upp när de innehåller en mindre mängd dokumentationsliknande innehåll, så de fungerar bra för flerspråkigt innehåll som texten på en landningssida. När dokumentationen växer blir JSON-filer däremot svårare att läsa och underhålla.

För längre dokumentation är Markdown-filer ett bättre val. De kan kräva mer arbete i början, men jag tycker att den extra insatsen är värd det. Jag började använda Markdown för projektdokumentation när jag började arbeta med Astro. Sedan dess har jag fortsatt använda det eftersom Markdown gör dokumentationen enklare att skriva, läsa och underhålla.

### Offentligt testläge

Testläget används för att demonstrera det CMS jag har byggt. I Astro-versionen är det relativt enkelt att skapa och underhålla. Det blir däremot mer komplext när frontend och backend använder samma programmeringsspråk och ramverk.

Den här funktionen kan ändras eller tas bort i framtiden beroende på hur projektet utvecklas.

### Lokal innehållspanel

Den lokala innehållspanelen gör det enklare att redigera JSON- och Markdown-dokumentation utan att behöva öppna och ändra de råa `.json`- och `.md`-filerna direkt.

### Innehålls-API:er endast för utveckling

Innehålls-API:er som endast används under utveckling fungerar bra när frontend och backend använder olika programmeringsspråk, eftersom de två delarna då kan separeras tydligare. Nu när allt hanteras i Next.js känns den här lösningen mer komplex och kostsam att underhålla. Därför kan dessa API:er ändras eller tas bort i framtiden.

### Gemensamt UI-system

Det gemensamma UI-systemet gör det enklare att underhålla teman, CSS-stilar och återanvändbara UI-element i hela projektet.

En viktig princip i projektet är att varje lager har ett tydligt ansvar:

```text
shadcn/ui
└── UI-primitives

Tailwind CSS
└── Komponentstilar
└── Sidlayout
└── Responsivt beteende
└── Lokala visuella justeringar

CSS-variabler
└── Design tokens
└── Färger
└── Typografisk skala
└── Spacing
└── Responsiv storlek

Vanlig CSS
└── Sådant som Tailwind inte lämpar sig för
└── Dynamiskt innehåll som kräver selectors
└── Markdown-typografi
```

Kort sagt:

> **shadcn/ui hanterar UI-primitives; Tailwind CSS hanterar komponenter och layout; CSS-variabler hanterar design tokens; vanlig CSS används endast för sådant som Tailwind inte lämpar sig för eller när dynamiskt innehåll kräver selectors.**

Projektet följer också principen **DRY (Don't Repeat Yourself)** genom att hålla delad kunskap och delat beteende i en enda källa till sanning.

I det här sammanhanget betyder:

- **Knowledge** regler, definitioner, konfiguration och fakta som systemet behöver känna till. Exempel är vilka locales som stöds, deras labels, design tokens, responsiva storleksregler och gemensamma navigationsstates.
- **Behavior** återanvändbar logik eller operationer som beskriver hur systemet gör något. Exempel är att tolka kommaseparerade värden, rendera gemensamma technology badges eller använda samma fältstruktur i flera CMS-editorer.

Exempelvis ska stödda locales inte definieras separat i flera filer:

```ts
export const locales = ["en", "sv", "zh"] as const;

export type Locale = (typeof locales)[number];
```

På så sätt finns definitionen av vilka språk projektet stöder på ett enda ställe.

Samma princip gäller återanvändbar logik. I stället för att upprepa samma parsingkod i flera editorer används en gemensam funktion:

```ts
export function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
```

DRY används därför för gemensam **knowledge och behavior**, inte för att mekaniskt ta bort varje upprepad Tailwind-klass.

Två komponenter kan till exempel båda använda:

```tsx
<div className="flex flex-wrap gap-2">
```

utan att det behöver bli en gemensam abstraktion, om komponenterna representerar olika koncept och kan utvecklas oberoende av varandra.

Det minskar onödig duplicering utan att skapa överdriven abstraktion.

### Behålla innehållet i Git

Markdown och JSON förblir den enda källan till sanning.

Det innebär att portföljens innehåll versionshanteras tillsammans med applikationskoden.

Varje permanent innehållsändring kan därför granskas med:

```text
git diff
```

innan den committas.

Arbetsflödet är fortfarande:

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

- Full historik
- Enkel rollback
- Innehållsändringar som kan granskas
- Ingen CMS-databas
- Ingen separat strategi för backup av innehåll
- Portabel Markdown och JSON

### Undvika en CMS-databas i produktion

Portföljen behöver inte frekvent samarbetsbaserad publicering eller redigering i produktion i realtid.

En CMS-databas i produktion skulle därför innebära:

- Ytterligare infrastruktur
- Krav på autentisering
- API-hantering
- Databashosting
- Frågor kring synkronisering av innehåll
- Mer operativ komplexitet

utan att ge tillräckligt mycket värde för det nuvarande användningsfallet.

Innehåll direkt i repositoryt är enklare och passar bättre för hur ofta projektet uppdateras.

### Ta bort bloggen

En tidigare version av portföljen innehöll en flerspråkig teknisk blogg.

Att underhålla längre artiklar på flera språk skapade mycket arbete med översättning och underhåll, samtidigt som det bidrog relativt lite till portföljens huvudsakliga syfte.

Därför togs bloggen bort i stället för att byggas ut till en större publiceringsplattform.

Tekniskt skrivande som är avsett för professionell synlighet passar bättre på plattformar som LinkedIn, där både distribution och professionellt sammanhang redan finns.

Projektspecifika tekniska beslut finns kvar i projektens fallstudier, där de direkt stöder de system som presenteras.

Portföljen fokuserar därför på:

```text
Om mig
→ Vem jag är

Färdigheter
→ Vad jag arbetar med

Projekt
→ Vad jag har byggt

Projektfallstudier
→ Hur systemen designades och utvecklades

GitHub
→ Källkod och utvecklingshistorik

LinkedIn
→ Professionellt skrivande och kommunikation
```

Detta minskar duplicerat innehåll och översättningsarbete samtidigt som den tekniska dokumentation som är mest relevant för portföljen behålls.

## Nuvarande arkitektur

```text
                 Git-repository
                       │
            ┌──────────┴──────────┐
            │                     │
      JSON-innehåll        Markdown-innehåll
            │                     │
            └──────────┬──────────┘
                       ↓
                    Next.js
                       │
       ┌───────────────┼────────────────┐
       │               │                │
Publik portfölj    Trial CMS      Lokal Dashboard
       │               │                │
       │          Browser state         ↓
       │                          Route Handlers
       │                                │
       │                          JSON / Markdown
       │                                │
       └────────────────┬───────────────┘
                        ↓
                       Git
                        ↓
                      Vercel
```

Repositoryt förblir den enda källan till sanning genom hela arbetsflödet.
