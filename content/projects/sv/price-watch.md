---
lang: sv
title: "Price Watch"
description: "En lokal applikation för produktprisbevakning och AI-baserat upphandlingsanalys, med stöd för automatiserade körningar och e-postnotiser."
status: "v.1.2.0"
order: 2
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

## Projektöversikt

Price Watch är en lokal applikation för produktprisbevakning och stöd vid köpbeslut. Applikationen består av en frontend i React och TypeScript, ett lokalt ASP.NET Core API, en Python Playwright-modul för prisinsamling, en FastAPI-baserad AI-tjänst, en lokal Ollama-modell och ett lokalt JSON-datalager.

Användaren kan hantera bevakade produkter och flera butikskällor, uppdatera priser automatiskt eller manuellt, jämföra faktiska priser, enhetspriser och normaliserade priser mellan olika förpackningsstorlekar, se prishistorik, körstatus och målpriser samt använda en lokal AI-shoppingrådgivare för att bedöma om det aktuella priset är värt att betala.

## Problemet som ska lösas

Olika e-handelsbutiker kan sälja samma produkt i olika förpackningsstorlekar. Att endast jämföra det totala priset som visas på produktsidan ger därför inte alltid en rättvis jämförelse. Systemet behöver hantera förpackningsmängd, enhetspris och en gemensam jämförelsemängd för att kunna avgöra vilken källa som faktiskt är billigast.

Prisinsamling från webben påverkas också av dynamiska sidor, strukturförändringar, avsaknad av strukturerad prisdata och avvikande priser. För att minska den långsiktiga underhållskostnaden behöver systemet undvika separata CSS Selectors och specialbyggd scrapinglogik för varje webbplats.

Ett komplett system för prisbevakning behöver dessutom hantera produktkonfiguration, prishistorik, målpriser, avvikelsedetektering, automatisk schemaläggning, e-postnotiser och körstatus, inte bara genomföra en enstaka webbscraping.

Utöver prisbevakningen behöver projektet även låta en lokal AI använda verkliga priser och historiska data från systemet för att hjälpa till med köpbeslut, samtidigt som frontend inte direkt kan ange eller ändra de prisuppgifter som används som faktakälla.

## Lösning

Projektet delar upp frontend, applikations-API, prisinsamling, databehandling och AI-tjänst i separata ansvarsområden.

React-frontenden hämtar endast applikationsdata genom ASP.NET Core-endpoints under `/api/`. ASP.NET Core ansvarar för produktkonfiguration, kördata, historiska data, automation, e-postinställningar, scraper-orkestrering och AI-kontext för produkter.

Python använder Playwright för att ladda produktsidor och extraherar priser från Product JSON-LD. Systemet underhåller inte butiksspecifika scrapers. För källor som inte på ett tillförlitligt sätt tillhandahåller Product JSON-LD kan automatisk scraping stängas av och ett manuellt pris konfigureras.

Systemet beräknar enhetspriset utifrån varje källas förpackningsmängd och använder produktens `comparison_quantity` för att normalisera olika förpackningsstorlekar till samma mängd före jämförelsen.

AI-funktionen ansluter till den lokala Ollama-tjänsten genom en separat FastAPI-tjänst. React skickar endast Advisor, produkt-ID och chattmeddelanden. ASP.NET Core bygger ett verkligt Product Context från lokal konfiguration, senaste priser och historiska data baserat på produkt-ID innan informationen skickas vidare till FastAPI och Ollama för analys.

## Kärnfunktioner

### Produktprisbevakning

Varje produkt kan konfigureras med flera butikskällor. Automatiska källor laddar sidan genom Playwright och läser Product JSON-LD, medan manuella källor använder det konfigurerade `manual_price` direkt.

Automatisk scraping kan styras separat både på produktnivå och källnivå. När scraping stängs av på produktnivå använder samtliga källor för produkten manuella priser och butikssidorna öppnas inte.

Om en sida inte tillhandahåller användbar Product JSON-LD betraktas källan som ett scrapingfel och behöver användare skriva själv. Detta minskar komplexiteten i att underhålla CSS Selectors och separata scrapers för olika webbplatser.

### Produkthantering

Genom React-gränssnittet och ASP.NET Core API kan användaren lägga till, ändra och ta bort bevakade produkter samt hantera flera butikskällor, scrapinglägen, manuella priser, förpackningsmängder, målpriser och jämförelsemängder.

### Prisjämförelse mellan flera butiker

Varje källa kan konfigurera `unit_quantity`. Systemet beräknar enhetspriset genom att dividera det faktiska priset med förpackningsmängden.

En produkt kan även konfigurera `comparison_quantity`, vilket gör det möjligt att konvertera olika förpackningsstorlekar till en gemensam mängd för jämförelse.

Om en källa till exempel säljer ett 2-pack och en annan ett 1-pack kan systemet normalisera båda till ett Comparable Total för 2 enheter. På så sätt undviks felaktiga slutsatser som uppstår när endast förpackningarnas totalpris jämförs.

### Prishistorik

Lyckade prisresultat sparas som lokal historisk data och visas på Dashboard och produktens detaljsida tillsammans med aktuella priser, historiska priser, prisstatistik och historiska trender.

Misslyckade eller Suspicious-priser skrivs inte till prishistoriken som normala lyckade resultat.

### Målpriser

Varje produkt kan ha ett målpris för totalpriset och ett målpris per enhet. Systemet kan identifiera om det aktuella priset har nått målet och använda målstatusen på Dashboard, i notiser och i AI-analysen.

### Detektering av avvikande priser

Systemet validerar ovanligt stora prisförändringar och markerar tveksamma resultat som `Suspicious`, vilket minskar risken för att felaktiga priser, onormal strukturerad data eller andra opålitliga resultat accepteras.

### Körstatus

Systemet registrerar resultatet från varje scraper-körning och visar den senaste körstatusen i applikationen.

Produkter kan ha statusen `Not run yet`, `Success`, `Failed` eller `Suspicious`.

Användaren kan manuellt köra en priskontroll genom Run Now.

### E-postnotiser

Price Watch kan skicka e-postnotiser när en produkt når sitt målpris, när ett avvikande pris upptäcks eller när en scraper-körning misslyckas.

Notisstatus sparas lokalt för att minska upprepade notifieringar för samma tillstånd.

### Automatisk schemaläggning

ASP.NET Core kan hantera automatiska priskontroller genom Windows Task Scheduler samtidigt som den manuella Run Now-funktionen finns kvar.

### Lokal AI Shopping Advisor

Price Watch integrerar FastAPI och Ollama för att erbjuda en lokalt körd AI Shopping Advisor.

Olika Advisors använder olika köpstrategier, exempelvis ett mer försiktigt beteende, balans mellan pris och värde eller större fokus på historiska lägstanivåer. Alla Advisors använder dock samma verkliga prisdata från Price Watch.

### Product-Aware AI Chat

AI Chat kan välja en eller flera produkter som redan bevakas av Price Watch.

React skickar endast `advisorId`, `productIds` och chattmeddelanden. ASP.NET Core bygger AI Product Context från produktkonfiguration, senaste priser och historiska data baserat på produkt-ID.

AI:n kan använda aktuellt pris, målpris, föregående pris, historiskt lägsta pris, historiskt högsta pris, historiskt genomsnitt och senaste prisposter som underlag för analysen.

### Ask AI

Produktens detaljsida innehåller funktionen Ask AI.

När användaren klickar på den öppnas AI Chat och den aktuella produkten läggs automatiskt till i Considering-listan. Användaren kan därefter direkt fråga om produkten är värd att köpa till det aktuella priset.

AI:n kan utifrån tillgänglig prisdata ge rekommendationer som `BUY`, `WAIT` eller `NEUTRAL` och svarar på samma språk som användarens senaste meddelande.

## Utmaningar och beslut

### Olika prisstrukturer på olika webbplatser

Sidstrukturen på olika e-handelswebbplatser förändras ofta. Projektet valde därför slutligen att använda generell Product JSON-LD i stället för att underhålla ett stort antal butiksspecifika scrapers.

För webbplatser som inte på ett tillförlitligt sätt erbjuder Product JSON-LD kan Price Watch fortfarande använda manuella priser.

### Rättvis jämförelse mellan olika förpackningsstorlekar

Olika butiker kan sälja samma produkt i olika mängder, vilket gör att en direkt jämförelse av totalpriser lätt leder till felaktiga slutsatser.

Systemet använder `unit_quantity`, enhetspris och `comparison_quantity` för att konvertera olika källor till en gemensam mängd och beräkna ett Comparable Total.

### Undvika felaktiga priser

Automatiskt insamlade priser är inte alltid tillförlitliga. Därför validerar systemet priser innan historiska poster sparas.

Avvikande resultat markeras som `Suspicious` i stället för att direkt lagras som normala historiska priser.

### Separering av produktkonfiguration och kördata

Produktkonfigurationen sparas i `products.json`, medan senaste körresultat och historiska poster använder separata datafiler.

Dashboard kombinerar produktkonfigurationen med de senaste körresultaten. Därför kan en ny produkt som ännu inte har körts visas direkt som `Not run yet`.

### Förtroendegräns för AI-data

Frontend skickar inte aktuella priser eller prishistorik direkt till AI:n som auktoritativa fakta.

React skickar endast produkt-ID. ASP.NET Core genererar Product Context från lokal Price Watch-data och skickar därefter informationen till FastAPI och Ollama.

Det gör att olika Advisors använder samma prisfakta, kontrollerade av backend.

### Tydlig ansvarsfördelning i en lokal applikation

Projektet behåller tydliga gränser mellan React, ASP.NET Core, Python-scrapern, FastAPI, Ollama och lokal JSON-data.

React ansvarar för UI, ASP.NET Core för applikations-API och tjänsteorkestrering, Python för prisinsamling och databehandling, FastAPI för AI Prompt och modellkommunikation, Ollama för lokal modellinferens och lokal JSON för lättviktig persistens.

## Användning

Price Watch använder en local-first-arkitektur.

Projektet använder ett PowerShell-startskript för att kontrollera Node.js-, npm-, .NET- och Python-miljöerna och vid behov installera frontend-beroenden, skapa virtuella Python-miljöer, installera scraper- och AI-beroenden, installera Playwright Firefox, återställa ASP.NET Core-beroenden och starta FastAPI, ASP.NET Core och Vite.

Python-scrapern och AI-tjänsten använder separata virtual environments.

Ollama körs som en fristående lokal runtime.

Kördata, historiska data, produktkonfiguration, inställningar och scraper-status lagras i lokala JSON-filer, medan Windows Task Scheduler används för automatiserad schemaläggning.

## Framtida uppdateringar

Nästa steg är att slå samman ett tidigare utvecklat projekt för tillgångshantering med detta projekt. Därefter kommer jag, beroende på storleken på den sammanslagna tillgångsdatan, att avgöra om fler projekt ska integreras, om databasen behöver flyttas till PostgreSQL eller om AI-delen behöver optimeras.

## Extra

Mer detaljerade artiklar om projektet, som inte är lika viktiga för den huvudsakliga projektöversikten, finns här.

### Användningen av FastAPI

FastAPI är ett Python Web API-ramverk. Det ansvarar för att ta emot och vidarebefordra `advisorId`, `products` och `messages` mellan ASP.NET Core och Ollama.

Den främsta anledningen till att jag använder FastAPI är att AI-lagret redan är skrivet i Python och att FastAPI lämpar sig väl för att snabbt paketera Python-baserad AI-logik som ett HTTP API. Filer som `prompt_builder.py`, `advisor.py` och Pydantic-datamodeller kan därför ligga kvar direkt i Python.

> Går det att ersätta FastAPI med ASP.NET Core?

Ja, det går, men jag rekommenderar inte att göra det ännu. Om projektet senare använder stora mängder Python-baserade AI-bibliotek, till exempel LlamaIndex eller FAISS, blir det smidigare att behålla AI-lagret i Python än att flytta det till ASP.NET Core. Jag planerar dessutom att lägga till ett RAG-system i projektet senare.

### Projektets bakgrund

Mitt mål är att bli senior fullstackutvecklare. Enligt AI:s bedömning behöver en senior fullstackutvecklare kunna hantera stora projekt och legacy code. Det är en av anledningarna till att detta projekt skapades.

När jag studerade webbutveckling på Lexicon byggde jag många olika projekt med fokus på hanteringssystem. Därför bestämde jag mig för att behandla koden från mina äldre GitHub-projekt som legacy code och försöka slå samman så mycket som möjligt i ett större projekt.

Det är också därför en del kod har försvunnit från mina GitHub-repositories. När projekten har integrerats i detta projekt har jag tagit bort de flesta av dem, förutom projekt som fortfarande underhålls eller behöver finnas kvar för att kunna visas upp.

Det här projektet har redan integrerat vissa tidigare AI-projekt och projekt som hämtar data från webben. Fler projekt kommer att slås samman i framtiden, med målet att förvandla denna produktbevakare till en AI-assistent för hantering av tillgångar och abonnemang.

I framtiden ska den kunna berätta vilka produkter som har gått ner i pris, vilka produkter som är värda att köpa och hjälpa till att hantera redan köpta produkter och abonnemang. Jag planerar också att lägga till ett RAG-system för hantering av signerade avtal samt information och omdömen om specifika produkter.

> Varför bygga en produktprisbevakare?

För att testa en projekt är bra eller dåligt behöver alltid användare. Jag är användare när det gäller prisbevakning. Jag använder redan prisbevakning regelbundet för att avgöra vilka produkter jag ska köpa. Om jag märker att någon funktion saknas kan jag lägga till den själv. På så sätt skapas en enkel men verklig användarupplevelse, samtidigt som projektet naturligt får fortsatta uppdateringar och långsiktigt underhåll.

Det hjälper mig att förbättra mina projektlednings- och förvaltningskunskaper och ger projektet en längre livscykel än projekt som endast byggs för att uppfylla ett krav och sedan blir liggande oanvända i ett repository.

### Varför är artiklarna skrivna på olika sätt på olika språk?

Processen för att skapa artiklarna är:

> AI-generering -> egen granskning av innehållet -> AI-översättning -> egen granskning av innehållet

Skillnaderna finns eftersom jag fortfarande försöker hitta en skrivstil som passar mig. Men innehållet är detsamma.

Om du ser en artikel som känns som en direktöversättning befinner den sig sannolikt fortfarande i AI-översättningsstadiet.
