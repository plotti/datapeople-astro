---
title: "Agenten-Dashboards mit MotherDuck Dives: React + SQL statt BI-GUI"
description: "Mein Evidence-Setup hat eine ehrliche Schwäche: Die Zahlen sind so alt wie der letzte Build. MotherDuck Dives drehen das Prinzip um – die Queries laufen beim Öffnen live gegen die Datenbank, die Facettierung danach im Browser. Dieser Beitrag erklärt den Unterschied zwischen Build-Zeit und Lauf-Zeit am konkreten Beispiel, rechnet die Kosten durch (Spoiler: ein Abo braucht es, aber kein Per-Seat-Modell) und zeigt einen eigenbau Dive, der dieselben Zahlen liefert wie meine Evidence-Version."
pubDate: 2026-09-24
readTime: 14
category: "AI Integration"
tags: ["MotherDuck", "DuckDB", "Dashboards", "LLM", "Embedded Analytics"]
cover: "../../assets/blog/motherduck-dives-cover.png"
---

**Stand:** September 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 14 Minuten

## TL;DR

In meinem [letzten Beitrag](/blog/agentic-dashboards-mit-evidence/) habe ich gezeigt, wie Sie mit Evidence, DuckDB und Claude Dashboards als Code bauen – open source, Hosting nahe null, versioniert wie Software. Und ich habe dort eine Schwäche eingeräumt, die ich heute zum Hauptthema mache: **Ein Evidence-Dashboard ist so aktuell wie sein letzter Build.** Dazwischen ist es ein Foto.

Genau hier setzen [MotherDuck Dives](https://motherduck.com/product/dives/) an: Dashboards, deren Queries beim Öffnen **live** gegen die Datenbank laufen und deren Facettierung dann im Browser des Anwenders in Millisekunden rechnet. Ich habe das Prinzip selbst nachgebaut und mit meiner Evidence-Version gegen denselben Datensatz laufen lassen – identische Zahlen, 15 Millisekunden Abfragezeit. Dieser Beitrag erklärt den Architektur-Unterschied ohne Marketing-Ton, rechnet durch, was Dives kosten (ja, ein Abo braucht es – aber kein Per-Seat-Modell), und sagt ehrlich, wann ich welches Werkzeug einsetzen würde.

## Die eine Schwäche, die mein Evidence-Setup hat

Zur Erinnerung, wie das Evidence-Setup aus dem letzten Beitrag funktioniert: Ein Dashboard ist eine Markdown-Datei mit SQL-Blöcken. Beim `npm run build` läuft jede Query **einmalig** gegen die Datenquelle, die Resultate landen als Parquet-Dateien in der statischen Site, und der Browser zeigt diese vorkompilierten Daten an. Die [Deployment-Doku von Evidence](https://docs.evidence.dev/deployment/overview) sagt es unausweichlich: Daten werden aktuell, indem Sie **neu bauen**. Der Evidence-Mitgründer formuliert es auf Hacker News noch knapper: Queries laufen zur Build-Zeit und werden als Parquet gespeichert – Evidence ist ein Static-Site-Generator.

In meiner PulsCheck-Fallstudie war das eine bewusste Entscheidung: Die Seed-Daten enden am 30. April 2026, fixe Stichtage machen die Dashboards **reproduzierbar** – in der Vorstandssitzung will niemand die Zahl, die sich zwischen Folie 3 und Folie 7 ändert. Und mit Build-Crons (nightly, wöchentlich) ist der Datenstand praktisch gut genug.

Aber ehrlich bleibt ehrlich: Das Dashboard ist ein Foto. Schön belichtet, sauber gerahmt – aber ein Foto. Drei Dinge kann ein Foto nicht:

- **Alt sein vermeiden.** Zwischen Build und Öffnen liegen Stunden bis Tage. Wer um 16:47 wissen will, was heute Morgen verkauft wurde, schaut in die Röhre.
- **Frei drillen.** Die Filter, die ich eingebaut habe, funktionieren – aber sie rechnen nur auf der eingefrorenen Datenmenge umher. Eine neue Schnitt-Dimension (etwa «Umsatz nach Kanton statt Land») ist ein Code-Change plus Build, kein Klick.
- **Wachsen mit der Frage.** Jede neue Frage der Geschäftsleitung landet erst im Chat-Verlauf (bei uns: der [nao-Agent](/blog/agentic-bi-für-kmu-in-der-praxis_-ein-schweizer-saas-fall-mit-nao/)) und wird erst beim nächsten Build zum Dashboard.

Wie gesagt: Reproduzierbar ist auch eine Tugend. Aber wenn ich ehrlich bin, habe ich beim Bau der Evidence-Dashboards immer wieder den Moment vermisst, in dem das Dashboard **mitgeht**, wenn man eine Frage stellen will, die man beim Build noch nicht kannte.

## Was Dives anders machen: Build-Zeit vs. Lauf-Zeit

Und genau das ist der Unterschied, der wirklich zählt – nicht Charts, nicht Styling, nicht die Agent-Geschichte. Die Architektur:

**Evidence (Build-Zeit):** Query läuft beim Build. Resultat wird eingefroren. Jeder Seitenaufruf zeigt dasselbe eingefrorene Resultat. Die Daten sind so frisch wie der letzte Deploy.

**Dive (Lauf-Zeit):** Beim Öffnen des Dives laufen die Queries **live** auf dem MotherDuck-Compute gegen den aktuellen Stand des Warehouse. Die Resultate werden in eine DuckDB-Instanz im Browser gestreamt – DuckDB als WebAssembly, dieselbe Engine, die wir lokal lieben, nur eben in der Browser-Sandbox. Und jetzt der entscheidende Trick: **Die Facettierung läuft danach lokal.** Zeitfenster wechseln, Land filtern, in einen Bereich hineinzoomen – alles rechnet gegen den frisch geladenen Datensatz im eigenen Browser, in einstelligen Millisekunden, ohne einen einzigen Roundtrip zur Datenbank.

Das Ergebnis dieser Zweiteilung ist bemerkenswert: Das Dashboard ist beim Öffnen **nie stale** (Datenabruf live), aber die Interaktion kostet **trotzdem kein Warehouse-Compute pro Klick** (Facettierung lokal). MotherDuck nennt das [Dual Execution](https://motherduck.com/product/dives/), und in meinen eigenen Tests mit rund 200'000 Zeilen bleibt ein kompletter Filter-Durchlauf unter 20 Millisekunden – dazu unten mehr. Praktisch bedeutet es auch: Neue Schnitt-Dimensionen sind kein Rebuild, sondern ein Klick. Wer tiefer drillen will, als ich beim Bauen geplant habe, kann das einfach tun.

Nun die Gegenrechnung, denn Live hat einen Preis, und der ist nicht nur der Abo-Betrag:

- **Compute bei jedem Öffnen.** Ein statisches Evidence-Dashboard kostet pro View exakt nichts. Ein Dive verbraucht Warehouse-Compute, sobald jemand es öffnet. Im Gratis-Plan sind das 10 Compute-Stunden pro Monat – für ein internes Dashboard reicht das, für 500 Kunden-Embeddings natürlich nicht (dazu gleich).
- **Die Zahlen verändern sich unter Ihren Füssen.** Der Vorstand sieht 09:00 einen Wert, um 11:00 einen anderen. Reproduzierbarkeit muss man sich bei Live-Daten anders sichern – etwa mit fixen Stichtagen *in* den Queries.
- **Daten liegen in der Cloud.** Ein Dive zeigt nur, was im MotherDuck-Warehouse liegt. Wer On-Prem-Pflicht hat, für den ist die Diskussion hier zu Ende – Evidence auf eigener Infrastruktur bleibt die Antwort.

Und weil es fair ist: Auch Evidence selbst hat die Konvergenz Richtung Live längst vollzogen. Auf der [Homepage](https://evidence.dev) verkauft die Firma inzwischen einen Analytics Agent (live im Chat, per Slack und MCP) und eine Embedded-Analytics-API – live queryt auch dort. Der Unterschied ist feiner geworden: Evidence setzt Live **neben** das statische Dashboard (Agent und API), MotherDuck setzt Live **in** das Dashboard selbst. Das Foto wird in beiden Häusern zum Video – sie packen es nur in verschiedene Rahmen.

## Was ein Dive überhaupt ist

Kurz zum Produkt selbst, weil die Bedeutung im Hype untergeht: Ein Dive ist eine interaktive Data App, bestehend aus – halten Sie sich fest – **React und SQL**. Kein proprietäres JSON-Chart-Format wie bei klassischem BI, sondern ein React-File mit eingebetteten, auditierbaren SQL-Queries. Versionierbar in Git, reviewbar per Pull Request, deploybar mit CI. Das ist exakt die «BI-as-Code»-Philosophie aus meinem Evidence-Beitrag, nur mit mehr Interaktivität unter der Haube.

Der Bauablauf ist agentenbasiert: Über den MotherDuck MCP Server sagt man dem Agenten der Wahl (Claude Code, ChatGPT, Cursor), was man sehen will, iteriert in natürlicher Sprache («Ersetze die Pie-Charts durch Sparklines») und publiziert den Dive in den Workspace. Wichtig für Skeptiker: Der Agent generiert den Code **einmalig** – was dann läuft, ist deterministische Web-App-Software mit nachvollziehbaren Queries, kein LLM, das bei jedem Seitenaufruf neu fantasiiert. Die Charts laufen standardmässig auf Recharts, D3 ist inklusive, und Libraries werden ins Sandbox-Bundle gepackt statt live aus dem Internet nachgeladen – verständlich, wenn die App mit einer Warehouse-Verbindung im Browser hantiert.

Zwei Einordnungspunkte noch:

- **Embedding ist der eigentliche Hebel.** Dives lassen sich als gesandboxtes iframe in die eigene App einbetten. Das eigene Backend hält den Admin-Token und stellt pro Session einen kurzlebigen Token aus – danach redet der Browser direkt mit MotherDuck, ohne Middleware-Server dazwischen. Kein eigenes Charting-Frontend, das man pflegt, und (siehe unten) keine Per-Viewer-Lizenz.
- **Die Grenzen sind auch React.** In der [Dive Gallery](https://motherduck.com/dive-gallery/) finden Sie Beispiele, die kein Click-and-Drag-BI-Tool abbilden würde: ein Pivot-Explorer mit einem im Dive generierten Semantic Model in Malloy, oder ein interaktiver Globus, über den man Erdbeben zeitlich scrubt und Regionen cross-filtert. Das schöne daran: keine Werkzeug-Grenze, nur eine Aufwandsgrenze. Das weniger schöne: Der Aufwand, ein eigenes React-App-Design zu pflegen, ist eben auch nicht null – wobei sich der Agent darum kümmern soll, nicht Sie.

## Was es kostet: ja, ein Abo braucht es – aber kein Per-Seat-Modell

Dives sind kein Open Source. Das Feature hängt an MotherDucks Infrastruktur (serverseitigem Compute und Storage); mit reinem OSS-DuckDB ist es nicht abbildbar – das WASM-Teil schon, dazu unten. Die aktuelle [Preisliste](https://motherduck.com/pricing/):

| Plan | Preis | Was drin ist |
|---|---|---|
| **Lite** | **0 CHF** | 10 GB Storage, 10 Compute-Stunden/Monat, 3 interne User. **Dives für interne Dashboards inklusive.** |
| **Business** | **ab USD 250/Org./Monat + Usage** | 10 interne User, Storage 0.04 USD/GB, Compute ab 0.60 USD/Stunde. **Embedded Dives** (für Ihre eigene App) laufen ab hier bzw. Enterprise. |
| **Enterprise** | individuell | Unbeschränkte User, PrivateLink, Fixpreis-Kapazität. |

Das Wichtigste ist das Modell, nicht die Zahl: **keine Per-Seat-Lizenzen.** Klassisches Embedded-BI rechnet pro Viewer – wenn Ihre App wächst oder Sie viele Kleinkunden haben, explodiert die Rechnung. Bei MotherDuck zahlen Sie Compute und Storage, und der Browser des Anwenders erledigt die Interaktion auf eigener Hardware, gratis. MotherDuck berichtet von einem Kunden, der einen eingebetteten Proof-of-Concept in 20 Minuten gebaut hat – derselbe PoC in einem klassischen Click-and-Drag-Embedded-BI-Tool hätte über 10 Stunden eingeplant.

Für den Einstieg reicht die Gratis-Testphase (ohne Kreditkarte), Startups kriegen über [motherduck.com/startups](https://motherduck.com/startups/) Credits. Und für alle, die Dives für mehrere Kunden bauen: pro Kunde einen eigenen MotherDuck-User mit gleich benannter Database – serverseitig wird pro User isoliert gerechnet, und da die Plattform serverless ist, kostet ein stiller Kunden-Account nichts.

## Selbst ausprobieren: ein Dive im Eigenbau

Theorie ist schön – aber funktioniert das auch? Ich wollte es wissen und habe das Dive-Prinzip lokal nachgebaut: dieselben PulsCheck-Demodaten wie im Evidence-Beitrag (rund 207'000 Zeilen über 6 Tabellen), diesmal als React-App mit DuckDB-WASM im Browser. Die Architektur entspricht dem Dual-Execution-Muster, nur ohne MotherDuck-Server: Die 6 Tabellen werden als Parquet exportiert (rund 10 MB), einmal in den Browser geladen und als Views unter den gewohnten Namen registriert – danach läuft jedes SQL lokal.

Das Herzstück ist eine einzige Datei mit sämtlichen Queries – auditierbar, versionierbar, exakt die Dive-Philosophie:

```sql
-- src/queries.js (Auszug): KPIs im gewählten Zeitfenster
select
  (select round(sum(p.price_chf), 2)
     from pulscheck.response_packages p
     join pulscheck.customers c on c.id = p.customer_id
     where cast(p.purchased_at as timestamp)
             >= timestamp '2026-05-01' - to_days(${days})
       and ${ownerCountry(country)}) as window_revenue_chf,
  ...
```

Das UI: Zeitfenster-Umschalter (7/30/90/365 Tage), Länder-Filter, fünf KPI-Kacheln, Zeitreihen-Charts (Recharts, wie bei Dives üblich), klickbare Paketgrössen-Chips als Cross-Filter, Geo- und Top-Kunden-Sichten. Und das grüne Badge oben rechts, das ich aus reiner Eitelkeit eingebaut habe, weil es den ganzen Punkt beweist:

![Animierter Rundgang durch den selbstgebauten PulsCheck-Dive: Zeitfenster von 30 auf 90 Tage und 12 Monate umgeschaltet, Land auf Schweiz gefiltert, Paketgrösse M als Cross-Filter angeklickt – jede Änderung rechnet in wenigen Millisekunden lokal im Browser](../../assets/blog/motherduck-dives-demo.gif)

**Alle 9 Queries in 15 Millisekunden.** Bei rund 207'000 Zeilen, auf einem Laptop, ohne Server-Roundtrip. Zeitfenster umschalten, Land filtern, Chip klicken – alles fühlt sich so an wie MotherDucks Demo-Versprechen: Dashboard anschauen wird zu Daten erkunden.

**Und eine ehrliche Abgrenzung, damit der Eigenbau nicht mehr verspricht, als er hält:** Die Live-Komponente fehlt hier bewusst. Meine App lädt einen Parquet-Snapshot – die Daten sind also genau so alt wie beim Evidence-Dashboard, nur das Flüssigkeits-Gefühl der Facettierung ist identisch (das kommt vom WASM, nicht vom Warehouse). Der Eigenbau zeigt, dass die Interaktions-Architektur keine Magie ist, sondern rund 300 Zeilen eigener Code. Was fehlt, ist der Teil, für den man MotherDuck bezahlt: die frischen Daten beim Öffnen, das Embedding mit Token-Management, der Workspace. 

**Und weil man ja nie ohne Stolperstein davonkommt:** Der erste Render crashte mit `TypeError: can't convert BigInt to number`. Ursache: DuckDB liefert `count(*)`-Resultate über Apache Arrow als BigInt, und mein Zahlenformatter rief `isNaN()` darauf an – was bei BigInt eine Exception wirft. Zwei Zeilen Normalisierung an der Arrow-Grenze später lief alles. (Stellt sich übrigens die Frage, warum ein 14-Minuten-Beitrag über Dashboards-als-Code nicht auf den 15-Milliardsten-Bug in der Numerik-Serialisierung hinweisen kann. Nun – jetzt tut er es. :))

Der für mich wichtigste Befund: **Die Zahlen sind deckungsgleich mit der Evidence-Version.** 26'927 abgeschlossene Antworten im April, 16'875 CHF Paket-Umsatz, 57'331 CHF MRR zum Stichtag – beide Implementierungen, dieselben Queries in der Logik, identisches Resultat. Das ist die eigentliche Message: Es ist egal, ob Evidence, Dive oder eigenes React-Frontend – wer ein sauberes Query-Set und klare Geschäftsregeln hat (bei uns die RULES.md), kann das Frontend austauschen wie eine Jacke.

## Dives vs. Evidence: die ehrliche Matrix

| | **Evidence** (Open Source) | **MotherDuck Dives** |
|---|---|---|
| **Datenstand beim Öffnen** | Build-Zeit – stale bis zum nächsten Build | Live beim Öffnen; Facettierung danach lokal im Browser |
| Lizenzkosten | 0 CHF | Lite gratis, für Embedded USD 250+/Monat |
| Compute pro View | keiner | Warehouse-Compute bei jedem Öffnen |
| Daten liegen | bei Ihnen (z. B. DuckDB-File) | bei MotherDuck (Cloud-Warehouse) |
| Reproduzierbarkeit | fixer Snapshot pro Build (Feature!) | muss in den Queries gesichert werden (fixe Stichtage) |
| Interaktivität | gebaute Filter auf eingefrorenen Daten | freie Exploration, einstellige Millisekunden |
| Embedded Analytics | Eigenbau bzw. Evidence-Embedded-API | iframe mit kurzlebigem Token, Backend hält nur den Admin-Token |
| Vendor Lock-in | keins | vorhanden (Feature an MotherDuck gebunden) |
| Baustil | Markdown + SQL, Agent generiert | React + SQL, Agent generiert |

Aus meiner Sicht ist die erste Zeile die einzige, die eine Kaufentscheidung wirklich trägt. Alle anderen Zeilen sind entweder Folgen der ersten (Compute pro View gibt es nur, weil live geöffnet wird) oder Details, die beide Werkzeuge ähnlich gut lösen.

## Wann was?

Meine Arbeitshypothese nach dem zweiten Bau-Durchlauf:

- **Kuratierte interne Reports mit fixen Stichtagen, Kosten nahe null, Daten bleiben im Haus:** Evidence. Bleibt meine Open-Source-Antwort für das klassische Reporting-KMU – die Reproduzierbarkeit ist dort ein Feature, kein Bug.
- **Interne Exploration, wenn die Frage beim Build noch nicht bekannt war:** Dives im Lite-Plan ausprobieren – gratis, und das WASM-Gefühl muss man einmal erlebt haben, um zu verstehen, was ich meine.
- **Kunden-facing Analytics im eigenen Produkt:** Hier hat Dives für mich das beste Gesamtkonzept – iframe-Embed mit kurzlebigen Tokens, kein Per-Seat, keine eigene Charting-Wartung. Voraussetzungen: Die Daten dürfen ins MotherDuck-Warehouse, und ein Business-Abo ist eingeplant. Die Alternative aus dem Evidence-Lager (Embedded-API) ist einen Blick wert, relativ jung ebenfalls.
- **Regulatorisch kritische Daten, die die Firma nicht verlassen dürfen:** Beide Cloud-Optionen fallen aus. Evidence on-prem bleibt die entspannteste Antwort.

## Fazit: Das Foto und der Live-Stream

Drei Erkenntnisse zum Mitnehmen:

Erstens: **Die Datentabelle ist nicht das Dashboard.** Meine Evidence-Dashboards und mein Eigenbau-Dive teilen sich dasselbe SQL, dieselben Geschäftsregeln, dieselben Zahlen – was sie unterscheidet, ist ausschliesslich, *wann* die Queries laufen. Build-Zeit heisst reproduzierbar und gratis, Lauf-Zeit heisst aktuell und interaktiv. Wählen Sie bewusst, nicht aus Gewohnheit.

Zweitens: **React + SQL ist das Markdown des Dashboards.** Beide Tools bestätigen denselben Trend: Dashboards sind Code, Agenten schreiben den Code, Menschen reviewen ihn. Was sich ändert, ist nur das Ausführungsmodell – statischer Build hier, Browser-WASM mit Live-Datenabruf dort.

Drittens: **Der Context Stack bleibt der eigentliche Hebel.** Ob Evidence oder Dive – die Qualität des Resultats hing bei uns nie vom Charting-Tool ab, sondern von der RULES.md, dem Datenmodell und dem Realitätscheck gegen die echte Datenbank. Der kann in eine Dive genauso einziehen wie in eine Evidence-Pipeline.

Was kommt als Nächstes? Ich vermute, dass die Foto-gegen-Live-Stream-Frage sich in zwölf Monaten erledigt haben wird – in beide Richtungen. Statische Generatoren lernen Live-Komponenten, Live-Tools lernen Snapshots, und wir diskutieren dann über andere Dinge. Bis dahin: Probieren Sie den Lite-Plan aus (ohne Kreditkarte), und wenn Sie es ganz ohne Abo wollen – das Eigenbau-Muster oben passt in einen Nachmittag.

Ich freue mich auf Ihre Kommentare und Anregungen!

---

## Quellen und weiterführende Ressourcen

**Diese Blog-Serie:**

- [Agentic BI für KMU in der Praxis: Ein Schweizer SaaS-Fall mit nao](/blog/agentic-bi-für-kmu-in-der-praxis_-ein-schweizer-saas-fall-mit-nao/) – der Context-Stack-Anfang
- [The unreasonable effectiveness of Agentic Dashboards](/blog/agentic-dashboards-mit-evidence/) – Evidence, DuckDB und Claude, der Vorgänger-Beitrag

**MotherDuck Dives:**

- [Dives Product Page](https://motherduck.com/product/dives/) – Überblick, Live-Dive, Dual-Execution-Beschreibung, FAQ
- [Dive Gallery](https://motherduck.com/dive-gallery/) – Community-Dives zum Hineinkopieren
- [MotherDuck Pricing](https://motherduck.com/pricing/) – Pläne, Limits, Compute-Preise (Stand September 2026)
- [MotherDuck for Startups](https://motherduck.com/startups/) – Credits-Programm

**Evidence:**

- [evidence.dev](https://evidence.dev) – Product-Überblick (inkl. Analytics Agent und Embedded-API)
- [Evidence Deployment-Doku](https://docs.evidence.dev/deployment/overview) – Datenaktualisierung via Build

**Technischer Hintergrund:**

- [DuckDB](https://duckdb.org/) und [DuckDB-WASM](https://duckdb.org/2021/10/29/duckdb-wasm.html) – die in-process Engine, auch als WebAssembly im Browser
- [Recharts](https://recharts.org/) – die React-Charting-Library, die auch Dives defaultmässig nutzen

---

*Dieser Beitrag basiert auf einem eigenständigen Nachbau mit synthetischen Demodaten (die PulsCheck AG ist – wie im [Vorgänger-Beitrag](/blog/agentic-dashboards-mit-evidence/) beschrieben – ein zusammengesetztes Beispiel). Die Datapeople-Datenredaktion arbeitet mit Schweizer KMU an Datenarchitektur und Analytics. Feedback an [hello@datapeople.ch](mailto:hello@datapeople.ch).*
