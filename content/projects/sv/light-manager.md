---
lang: sv

title: "LightManager"

description: "En personlig uppgiftshanteringsapplikation byggd med React, TypeScript, ASP.NET Core och PostgreSQL, med daglig planering, kalenderbaserad schemaläggning, JWT-autentisering, ett säkert Trial-läge och oberoende molndistribution."

status: "Live"

order: 1

technologies:
  - "C#"
  - ".NET"
  - "ASP.NET Core"
  - "Entity Framework Core"
  - "PostgreSQL"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "React Router"
  - "Microsoft Azure"
  - "Vercel"
  - "Neon"

links:
  github: "https://github.com/jiantaoshen/LightManager"
  live: "https://lightmanager.jiantao.dev"

draft: false
---

## Översikt

LightManager är en personlig uppgiftshanteringsapplikation som är utformad kring ett enkelt dagligt arbetsflöde.

Applikationen gör det möjligt att snabbt skapa uppgifter, välja om de ska schemaläggas med datum, ange prioritet, granska dagens arbete och planera framåt via en kalender.

Den nuvarande versionen fokuserar på:

- Today
- Oschemalagda uppgifter
- Kalenderbaserad planering
- All Tasks
- Valfria förfallodatum
- Ett enkelt prioritetssystem
- Responsiv layout för dator och mobil
- Ett säkert offentligt Trial-läge

Frontend är byggd med React, TypeScript, Tailwind CSS och shadcn/ui.

Backend är byggd med ASP.NET Core, Entity Framework Core och ASP.NET Identity, medan PostgreSQL-databasen hostas hos Neon.

---

## Varför jag ändrade produktens riktning

LightManager började ursprungligen som en lättviktig projektledningsapplikation för små och medelstora team.

Den första versionen innehöll:

- Projects
- Project members
- Rollbaserad behörighet
- Task assignment
- Kanban-arbetsflöden
- Drag-and-drop-hantering av uppgifter

Även om funktionerna fungerade tekniskt märkte jag att jag själv hade väldigt liten användning för större delen av det teambaserade arbetsflödet.

Det skapade ett viktigt produktproblem: jag kunde fortsätta implementera funktioner, men jag kunde inte på ett meningsfullt sätt avgöra om de faktiskt var användbara i vardagen.

Därför ändrade jag projektets riktning från:

```text
Team Project Management
```

till:

```text
Personal Task Management
```

Den nuvarande applikationen bygger på ett arbetsflöde som jag själv kan använda, utvärdera kontinuerligt och förbättra utifrån verkliga problem och faktisk användning.

---

## Nuvarande arbetsflöde

Det nuvarande LightManager bygger på valfri schemaläggning.

```text
Create Task
    |
    +-- No due date
    |      |
    |      v
    |   Unscheduled
    |
    +-- Due today
    |      |
    |      v
    |    Today
    |
    +-- Future date
           |
           v
        Calendar
```

Today fungerar som den huvudsakliga dagliga arbetsytan:

```text
Today
├── Today's Tasks
└── Unscheduled
```

En uppgift behöver inte ha ett förfallodatum när den skapas.

Det gör det möjligt att snabbt fånga en uppgift och bestämma tidpunkt senare.

---

## Prioritetssystem

LightManager använder tre enkla prioriteringsnivåer som visas för användaren:

```text
Must
Priority
Non-priority
```

Backend behåller för närvarande de ursprungliga enum-värdena:

```text
High   -> Must
Medium -> Priority
Low    -> Non-priority
```

Uppgifter sorteras automatiskt i följande ordning:

```text
Must
  ↓
Priority
  ↓
Non-priority
```

Uppgifter med samma prioritet sorteras efter när de skapades, med äldre uppgifter först.

Samma sorteringsregel används konsekvent i applikationens olika uppgiftsvyer.

---

## Today

Today är den huvudsakliga arbetsytan för dagens uppgifter.

Den visar:

- Uppgifter schemalagda för idag
- Oschemalagda uppgifter
- Öppna uppgifter
- Slutförda uppgifter

Uppgifter kan skapas direkt från Today med eller utan datum.

Det gör att snabb registrering av uppgifter och daglig planering kan ske på samma plats.

---

## Calendar

Calendar används både för schemaläggning och för att snabbt få en visuell överblick över hur viktiga dagens uppgifter är.

Varje datum med oavslutade uppgifter visar en färgad indikator baserad på den **högst prioriterade oavslutade uppgiften för dagen**.

```text
Green  -> Non-priority
Yellow -> Priority
Red    -> Must
```

Exempel:

```text
Only Non-priority tasks
        ↓
      Green

Includes Priority
        ↓
      Yellow

Includes Must
        ↓
       Red
```

Slutförda uppgifter påverkar inte kalenderindikatorn.

Om alla uppgifter för ett datum är slutförda försvinner indikatorn.

Calendar innehåller också ett **Unscheduled**-kort så att uppgifter utan datum fortfarande är synliga när framtida arbete planeras.

---

## Navigation

Huvudnavigationen hålls avsiktligt enkel.

### Desktop

```text
LightManager

Today
Calendar

[Account]
```

### Mobil

Den nedre navigationen innehåller endast:

```text
Today     Calendar
```

Ytterligare funktioner nås via avatarmenyn.

### Account Menu

När användaren klickar eller trycker på avataren öppnas:

```text
Account
├── Settings
├── All Tasks
└── Sign Out
```

All Tasks har flyttats bort från huvudnavigationen för att hålla Today och Calendar som de två viktigaste arbetsvyerna.

Samma konto-meny finns på mobil och gör det även enkelt att logga ut därifrån.

Trial-användare ser:

```text
Trial mode
├── All Tasks
└── Exit Trial
```

---

## Trial-läge

LightManager innehåller ett offentligt Trial-läge som gör det möjligt för besökare att prova applikationen utan att registrera sig.

Backend exponerar en skrivskyddad endpoint som läser uppgifter från ett särskilt demo-konto.

```text
Visitor
   |
   v
Enter Trial
   |
   v
Read Demo Tasks
   |
   v
Create Local Copy
   |
   v
Browser Storage
```

Efter den första inläsningen arbetar Trial-användaren endast med en lokal kopia.

Trial-användare kan:

- Skapa uppgifter
- Redigera uppgifter
- Slutföra och återöppna uppgifter
- Ta bort uppgifter
- Ändra prioritet
- Lägga till eller ta bort förfallodatum
- Använda Today
- Använda Calendar
- Använda All Tasks

Alla förändringar i Trial-läget sparas endast lokalt i webbläsaren.

```text
Trial Tasks
    |
    +-- Create
    +-- Update
    +-- Complete
    +-- Delete
    |
    v
Local Browser Storage

    X

PostgreSQL
```

Trial-användare får inte tillgång till demo-kontots lösenord eller JWT-token.

Det förhindrar att besökare ändrar den ursprungliga demo-datan genom det autentiserade uppgifts-API:t.

---

## Arkitekturförändring

När LightManager ändrades till personlig uppgiftshantering förenklades backend-modellen betydligt.

Den ursprungliga strukturen byggde på projekt och teamsamarbete:

```text
User
 └── Project
      ├── Members
      ├── Roles
      └── Tasks
           └── Assignees
```

Den nuvarande strukturen är:

```text
User
 ├── Task
 ├── Task
 └── Task
```

Uppgifter ägs direkt av användare.

Projects, project memberships, task assignments och project-level roles ingår inte längre i den nuvarande kärnmodellen.

Det gör systemet enklare att underhålla och ger samtidigt ett renare API för framtida klienter.

---

## Backend

Backend är byggd som ett ASP.NET Core Web API.

Det huvudsakliga autentiserade uppgifts-API:t är:

```text
/api/tasks
```

Skyddade task-endpoints använder användaridentiteten från JWT-token för att begränsa vilka uppgifter som får läsas och ändras.

Task-modellen innehåller:

- Title
- Description
- Status
- Priority
- Valfritt Due date
- Created timestamp
- Updated timestamp
- Completed timestamp
- User ownership

Task status och priority representeras som enums och lagras som läsbara strängar i PostgreSQL.

Trial-läget använder en separat anonym skrivskyddad endpoint för att läsa demo-data.

---

## Autentisering och auktorisering

Autentisering implementeras med ASP.NET Identity och JWT.

```text
User Login
    |
    v
ASP.NET Identity Validation
    |
    v
PostgreSQL
    |
    v
JWT Generated
    |
    v
Token Stored by Client
    |
    v
Authenticated API Requests
    |
    v
User-Specific Task Data
```

Identity-modellen skiljer på inloggningsidentitet och visningsnamn:

```text
UserName = Email
DisplayName = FullName
```

Det undviker konflikter när flera användare har samma visningsnamn.

Auktorisering fokuserar på **isolering av användardata**.

Varje skyddad task query, update och delete-operation verifierar att uppgiften tillhör den autentiserade användaren.

Trial-användare får inte autentiserad skrivåtkomst.

---

## Frontend

Frontend använder:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui

Gränssnittet är organiserat kring återanvändbara komponenter och gemensamma utility-moduler.

Återkommande logik för exempelvis task sorting, priority-hantering, API-anrop, datumhantering och navigation ligger i gemensamma filer i stället för att dupliceras mellan olika sidor.

---

## UI-tema

Frontend använder semantiska temavariabler som definieras centralt i:

```text
src/index.css
```

Temat styr bland annat:

- Background
- Foreground text
- Primary action color
- Non-priority color
- Priority color
- Must color

De nuvarande semantiska färgerna är:

```text
Primary actions -> Blue
Non-priority    -> Green
Priority        -> Yellow
Must            -> Red
```

Komponenterna använder semantiska styles i stället för att definiera individuella färger direkt i TSX-filer.

Det gör det möjligt att ändra hela applikationens visuella tema från en central plats.

---

## Databas

PostgreSQL används för persistent applikationsdata och hostas hos Neon.

Entity Framework Core hanterar databasåtkomst och migrations.

Den nuvarande `Tasks`-tabellen innehåller:

```text
Id
Title
Description
Status
Priority
DueDate
CreatedAt
UpdatedAt
CompletedAt
UserId
```

Index inkluderar:

```text
(UserId, DueDate)

(UserId, Status)
```

Dessa stödjer vanliga filtreringar efter datum och status.

---

## Deployment

Den nuvarande produktionsarkitekturen är:

```text
React + TypeScript
        |
        v
      Vercel
        |
        v
https://lightmanager.jiantao.dev
        |
        | HTTPS
        v
ASP.NET Core Web API
        |
        v
Microsoft Azure App Service
        |
        v
PostgreSQL / Neon
```

### Frontend

React-frontend är distribuerad via Vercel.

Produktion:

**https://lightmanager.jiantao.dev**

### Backend

ASP.NET Core Web API är distribuerat på Microsoft Azure App Service.

### Databas

PostgreSQL hostas hos Neon.

Produktionskonfiguration såsom JWT secrets, tillåtna frontend origins, database connection strings och Trial-konfiguration tillhandahålls via miljövariabler och sparas inte i källkoden.

---

## Utmaningar och beslut

### Förenkling av Domain Model

Det största arkitekturbeslutet var att ta bort den ursprungliga project-, membership- och role-modellen.

I stället för att behålla onödig komplexitet enbart för att demonstrera fler funktioner designades datamodellen om utifrån de faktiska kraven för personlig uppgiftshantering.

### Isolering av användardata

Efter övergången till personlig uppgiftshantering blev direkt ägarskap av tasks den huvudsakliga säkerhetsgränsen.

Skyddade task-endpoints verifierar den autentiserade användaren innan data läses eller ändras.

### Valfri schemaläggning

Uppgifter behöver inte ha ett due date.

Det gör det möjligt att snabbt registrera uppgifter och bestämma schemaläggningen senare.

### Säkert offentligt Trial-läge

Jag ville att besökare skulle kunna prova den verkliga applikationen utan att få tillgång till ett gemensamt autentiserat konto.

Trial-läget läser därför endast initial demo-data från backend och sparar därefter alla ändringar lokalt.

Det ger en fullständig demo samtidigt som den ursprungliga databasen skyddas.

### Web First, Mobile Later

Jag valde att stabilisera webbapplikationen innan utvecklingen av en mobil klient börjar.

Det nuvarande fokuset är att stabilisera:

- Produktens arbetsflöde
- API design
- Authentication
- Database structure
- Task behavior
- Responsive UI

När dessa delar är stabila kan en framtida React Native-klient återanvända samma backend.

### Oberoende deployment av frontend och backend

Frontend och backend distribueras separat.

Det håller klienten och API:t separerade och gör backend återanvändbar för framtida applikationer.

---

## Projektets utveckling

### Version 1 — Team Project Management

Den ursprungliga LightManager innehöll:

- Projects
- Project members
- Role-based permissions
- Task assignment
- Kanban boards
- Drag-and-drop task workflows

### Version 2 — Personal Task Management

Den nuvarande versionen fokuserar på:

- Personal task ownership
- Today
- Unscheduled tasks
- Calendar planning
- Optional due dates
- Simple priorities
- Priority-based sorting
- All Tasks
- Responsive navigation
- Trial mode

Projektet har därmed utvecklats från ett demonstrationsinriktat teamhanteringssystem till en mindre applikation som jag faktiskt kan använda och förbättra utifrån verklig erfarenhet.

---

## Utvecklingsmål

LightManager är inte avsett att konkurrera med stora plattformar för uppgiftshantering.

Projektet fungerar främst som en praktisk miljö för att bygga, använda och kontinuerligt förbättra en riktig fullstack-applikation.

Mina mål är att:

- Designa mjukvara utifrån verklig användning i stället för hypotetiska krav
- Hålla produkten och datamodellen enkla även när funktionaliteten växer
- Bygga återanvändbar och underhållbar arkitektur
- Förbättra responsiv och mobile-first produktdesign
- Utforska säkra offentliga demo- och authentication-mönster
- Förbereda arkitekturen för framtida plattformsoberoende utveckling

Fokus ligger inte på att lägga till så många funktioner som möjligt, utan på att göra genomtänkta förbättringar baserat på faktisk användning.

---

## Framtida förbättringar

Möjliga framtida funktioner inkluderar:

- React Native mobile client
- Persistent mobile authentication
- Recurring tasks
- Task notes
- Notifications and reminders
- Offline support
- Local mobile storage
- Cross-device synchronization
- Improved task editing
- Search and filtering
- Optional productivity statistics

---

## Legacy Azure Static Web Apps Deployment — Abandoned

En tidigare version av frontend hostades på Azure Static Web Apps:

```text
https://thankful-beach-0211add0f.7.azurestaticapps.net
```

Frontend har sedan dess flyttats till Vercel och använder nu:

**https://lightmanager.jiantao.dev**

Den gamla Azure Static Web Apps-resursen behövdes endast för att bevara den tidigare URL:en. Efter flera misslyckade återställningsförsök valde jag att överge den äldre deploymenten och fokusera på den nuvarande produktionsarkitekturen.

### Recovery Attempts

| Method | Result |
| --- | --- |
| Azure Static Web Apps CLI | Azure returnerade `No matching static site found.` |
| Deployment token reset | Samma deployment-problem kvarstod. |
| GitHub Actions | Azure kunde inte matcha deploymenten med den ursprungliga Static Web App-resursen. |
| Azure Portal configuration | Relevanta deployment-inställningar var otillgängliga eller skrivskyddade. |
| Azure CLI | Direkt resurshantering löste inte problemet. |
| Azure Cloud Shell | Samma resursproblem kvarstod. |
| Source-control reconnect | Den befintliga integrationen kunde inte återställas. |

Den äldre deploymenten är inte längre en del av LightManagers aktiva arkitektur.