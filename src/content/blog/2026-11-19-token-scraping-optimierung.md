---
title: "Wo die Tokens verschwinden: LLMs beim Web-Scraping optimieren, gemessen statt geraten"
description: "17'776 Schweizer Freizeitorte automatisch prüfen lassen: ob man sie besuchen kann, mit Beleg, Bild und Kurztext. Der erste Lauf kostete rund 95'000 Tokens pro Ort. Dieser Post zeigt, wo das Geld hinfiel: beim Browsen, bei den Urteilen, bei den Bildern. Und was am Ende übrig blieb: rund ein Viertel."
pubDate: 2026-11-19
readTime: 17
category: "Machine Learning"
tags: ["Scraping", "LLM", "Tokens", "Kostenoptimierung", "Crawl4AI", "Firecrawl", "Claude Code", "Laya"]
cover: "../../assets/blog/token-scraping-cover.png"
draft: false
---


**Stand:** November 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 17 Minuten

Der Ablauf pro Ort: Recherche (welche Seite beschreibt genau dieses Angebot?), Crawl, Navigation durch die Links, Urteil mit Beleg, Kurztext, Bild, Familien-Steckbrief.

## Das Projekt, damit du die Zahlen einordnen kannst

Die Freizeitkarte Schweiz hat **17'776 Orte**: Bäder, Burgen, Bibliotheken, Spielplätze, Kinos. Die Rohdaten stammen von September 2025, das heisst über ein Jahr alt. Die Frage pro Ort lautet: **Kann man da tatsächlich hin?** Nicht laut Karte, sondern laut Wirklichkeit. Die Antwort braucht einen Status (in Betrieb, Saisonpause, nur auf Anfrage, dauerhaft geschlossen, unklar), ein wörtliches Zitat als Beleg von einer lebenden Seite, ein Bild, einen deutschen Kurztext und seit dieser Woche einen Steckbrief für Familien (Mindestalter, Preise, Kinderwagen, Öffnungszeiten am Wochenende).

Vorab läuft eine billige Vorsortierung: 1'245 Orte fallen raus (Dauerbaustellen, reine Büro-Addresses, Dubletten), 400 Orte bekommen eine korrekte Kategorie («Bibliothekshof» ist eine historische Stätte, kein Bücherladen). Übrig bleiben rund 16'500 Orte, gezogen in Blöcken von 2'000, proportional über die 35 Kategorien. Block 1 ist fertig, Block 2 läuft.

Der Stack, alles auf einem MacBook und einem LM-Studio-Rechner im LAN:

- **Claude Code CLI** über das Abo als Text-Modell (`claude -p`, Sonnet für Recherche und Urteil, Opus als Schiedsrichter bei «unklar»)
- **Crawl4AI** mit Playwright für das eigentliche Crawlen
- **Firecrawl** als zweiter Crawler und für die Suche, wenn Claudes Websuche im Kontingent-Limit hängt
- **Laya** (lokal, 322M Parameter) für die Link-Navigation
- **Google Places API** für Fotos, **LM Studio mit Qwen** für die Bildbewertung

Und weil das Abo-Fenster eine harte Grenze ist, läuft alles nachts zwischen 0 und 7 Uhr. Die Pipeline hält sich selbst an das Fenster und wartet bei Limit bis zum gemessenen Reset-Zeitpunkt.

## Erst Crawl4AI: der Archivar

Crawl4AI rendert Seiten über einen echten Browser und ist damit die Grundlage von allem. Bei uns läuft es als Dauerprozess (`c4a-worker.py`), dem die Node-Pipeline Aufträge pusht. Konfiguration, die sich nach den ersten Fehlschlägen ergeben hat:

- `scan_full_page`: scrollt die Seite, damit Lazy-Load-Bilder erscheinen
- `PruningContentFilter` mit Schwelle 0.45: schneidet Menüs aus dem **Text**, lässt aber alle Links stehen, weil der Navigations-Schritt die Linktexte braucht
- `remove_consent_popups` plus eine Selektor-Liste für Cookiebot, OneTrust, Usercentrics und Konsorten (dazu gleich mehr)
- **Alles wird archiviert**: HTML, Markdown roh und gefiltert, alle Links mit Linktext, alle Bilder mit Alt-Text. Nach gut einer Woche sind das 15'001 Abrufe, 918 MB, mit einem Index als JSONL. Der Beleg-Zitat-Check und die Steckbrief-Nachträge für bereits geprüfte Orte laufen später ausschliesslich über dieses Archiv, es wird also kein einziges Mal neu gecrawlt.

Warum das Archiv so wichtig ist, sieht man am Beispiel der Amphitheater-Seite von Augusta Raurica: 174'295 Zeichen HTML, 9'117 Zeichen Markdown roh, 2'410 Zeichen gefiltert, ein Bild, 13 Links. Aus diesen 2'410 Zeichen stammen Beleg («Freilichtgelände 24 Stunden / 365 Tage offen») und Kurztext. Das beste Bild (`Augusta-Raurica_Amphitheater1_Foto_Susanne-Schenker.jpg`) lag genau auf dieser Detailseite, wurde aber nie bewertet, weil meine Bild-Logik die Startseite zuerst befragt hat und deren 8 Slots längst voll waren. Die Reihenfolge ist inzwischen umgekehrt: Das Places-Foto kommt zuerst, dann Beleg-Seiten, dann die Startseite.

## Dann Firecrawl: der Rückfall, der zum Standard wurde

Crawl4AI scheitert an JavaScript-Wänden, Bot-Schutz und Consent-Seiten, die den Browser-Render blockieren. Für die habe ich Firecrawl dazugenommen: ein Monatskontingent an Credits, 1 Credit pro Seite, Ergebnisse gecacht, Rückfall-Regel war: nur wenn Crawl4AI nichts liefert.

Zwei Lektionen daraus:

1. **Firecrawl hat eine eigene Such-API.** Claudes Websuche hat ein Kontingent, und als das erschöpft war, kam trotzdem ein valides JSON zurück: «keine URL gefunden». 412 Orte gingen als falsche «keine Quelle» durch, weil ein Ausfall aussah wie ein Ergebnis. Seitdem meldet sich die Suche bei Ausfall explizit mit `suche_fehler: true`, solche Antworten landen nie im Cache, und die Treffer kommen dann aus `firecrawl.dev/v1/search`.
2. **Die Rollen haben sich getauscht.** Seit Mitte der Woche crawlt Firecrawl zuerst (`onlyMainContent`: Hauptinhalt ohne Menüs und Banner), Crawl4AI ist Rückfall. Das spart Tokens, weil kürzeres Material in jeden späteren Call fliesst. Der Preis: Firecrawl liefert kein HTML-Archiv, sondern Markdown, Links und Bildliste. Fürs Urteil reicht das, für das Archiv wäre es ein Verlust. Wie schnell das die Credits frisst, habe ich unterschätzt, dazu weiter unten mehr.

Die Cookie-Banner haben beide Crawler erwischt. Bei j3l.ch standen **20'768 Zeichen Banner-Text vor dem Inhalt**, meine Kürzung greift von vorne, das heisst die Prüfer haben den Banner gelesen und nichts sonst. 71 Orte standen deshalb falsch auf «unklar». Die Diagnose war lehrreich: `remove_overlay_elements` räumt den Banner weg, aber eben auch die Menüs, die Links fielen von 122 auf 19, und genau die braucht das Browsing. Die Lösung war `remove_consent_popups` plus eine explizite Selektor-Liste: Banner weg, 122 Links bleiben, und als Firecrawl-Rückfall schlägt eine Cookie-Wand-Erkennung zu, wenn der Text trotzdem nur aus Banner-Zeilen besteht.

## Das Browsing: wo die Tokens tatsächlich hinfallen

Der teuerste Teil war nie das Urteil. Es war das Durchwühlen. Der Ablauf war: Das Modell sieht das Material, kriegt 30 unbesuchte Links und sagt, welchen es folgen will. Der nächste Schritt schickt **das ganze Material plus die neue Seite** wieder mit. Das heisst, die Kosten wachsen mit jedem Schritt, und mein Prüfer war ein eifriger Klicker.

Gemessen am alten Ablauf (zwei Prüfer, jeder browst selbst, Opus als Schiedsrichter):

| Zweck | Anteil |
|---|---|
| Browsen (Navigationsschritte) | ~35 % |
| Urteile (2 Prüfer + Schiedsrichter) | ~25 % |
| Bildbewertung | ~24 % |
| Recherche, Nachrecherche, Rest | ~16 % |

Ein Ort kostete so **rund 95'000 Tokens**. Für 16'500 Orte sind das 1.6 Milliarden Tokens, und der Grossteil davon floss durch die Suchleisten von Websites, die man im Grunde nie gebraucht hätte.

Vier Hebel haben das gedrückt, alle vier gegen dieselben 20 Testorte gemessen:

**1. Die Navigation muss kein grosses Modell machen.** Die Frage pro Schritt ist eine Multiple-Choice-Entscheidung: Welcher dieser Links führt zu Öffnungszeiten, Saison oder Betriebsstatus? Drei Varianten:

| Navigation | Tokens pro Ort | Urteile gleich wie Referenz |
|---|---|---|
| Stichwort-Wertung, ganz ohne Modell | 17'400 | 12/20 |
| Qwen 27B, lokal über LM Studio (~7 s/Schritt) | 23'700 | 13/20 |
| **Laya, lokal (~20 ms/Schritt)** | **21'800** | **11/20** |
| Jev über die OpenRouter-Decisions-API (~0.2 s, $0.00002) | nicht sauber gemessen | – |

[Laya](https://huggingface.co/convaiinnovations/laya) ist eine Open-Source-Alternative zu TypeSafes Entscheidungsmodell Jev: kein Textmodell, sondern ein «System One»-Klassifikator, der Optionen in einem Forward-Pass mit Wahrscheinlichkeiten bewertet. 322 Millionen Parameter, mehrsprachig, Apache 2.0, `pip install laya`, ein Gigabyte venv, das Modell lädt in 7 Sekunden und antwortet danach in 20 Millisekunden. Ich habe einen kleinen Wrapper als HTTP-Dienst auf 127.0.0.1 gebaut, die Pipeline schickt ihm Ort, Ziel und die Linkliste, und bekommt einen gewählten Link mit Wahrscheinlichkeiten zurück. Jev (das Original) ist über [OpenRouter](https://openrouter.ai/docs/guides/community/jev-tutorial) erreichbar, kostet einen Bruchteil eines Cents pro Entscheidung, braucht aber einen Key mit Guthaben.

Der Clou ist die Kombination: **vorsortieren mit Stichworten und Ortsnamen, dann Laya aus den Top-20 wählen lassen**. Laya fällt bei zu vielen Optionen klar ab, bei 20 ist es gut.

**2. Ein Prüfer reicht, wenn der Beleg geprüft wird.** Der Zweitprüfer hatte dasselbe Modell und dasselbe Material wie der Erstprüfer, das heisst er hat nur sich selbst bestätigt, zum vollen Preis. Ersetzt wird er durch eine harte Regel: Das Beleg-Zitat muss (normalisiert: Leerraum, Interpunktion, Tabellen-Pipes und Bindestriche raus) wörtlich im Material stehen. Tut es das nicht, wird das Urteil automatisch auf «unklar» zurückgestuft, und erst dann darf Opus ran. Bei 62 von 280 «unklar» im letzten Block war genau das der Grund, das heisst die Prüfung findet echte Lücken statt nur Uneinigkeit.

**3. Ein Call statt drei.** Urteil, Kurztext und Steckbrief lesen alle dasselbe Material, also liefern sie in einem kombinierten JSON. Und das Material wird vorher entrümpelt: Menüzeilen raus, Zeilen, die sich über Seiten wiederholen, raus. Bei Augusta Raurica schrumpfte das Material von 12'105 auf 10'540 Zeichen, und die Öffnungszeiten rückten von Position 6'557 auf 4'693 vor, das heisst sie lagen vor der Kürzungsgrenze statt hinter ihr.

**4. Bilder billiger bewerten.** Das Google-Places-Foto (per place_id, zeigt garantiert diesen Ort) wird zuerst allein bewertet, und reicht es, fallen die Website-Bilder ganz weg. Sonst: 512 Pixel statt 768, Viererpakete, Abbruch beim ersten Foto über 7 Punkten.

In Summe: von 95'000 auf **17'000 bis 24'000 Tokens pro Ort**, also etwa ein Viertel. Auf den 20 Testorten lag die Qualität auf Referenzniveau, mit zwei bis drei Orten mehr auf «unklar». So weit die Theorie.

## Was der echte Betrieb gezeigt hat

Dann lief der Sparmodus eine Woche lang nachts über die Blöcke, und ein paar Annahmen haben das nicht überlebt.

**Die 20 Testorte haben den Qualitätsverlust unterschätzt.** Block 2 ist inzwischen durch, 1'999 von 2'002 Orten. Die ersten 1'154 liefen noch im alten Ablauf, die restlichen 845 im Sparmodus. Im alten Ablauf landeten 11 % auf «unklar», im Sparmodus 25 %. Auf den Testorten waren das zwei, drei Orte Unterschied, im Betrieb ist es mehr als das Doppelte. Das heisst: 20 Orte reichen, um grobe Fehler zu finden, aber nicht, um einen Qualitätsunterschied von ein paar Prozentpunkten zu messen. Fürs Golden Dataset würde ich heute mindestens 100 Orte nehmen.

**Mehr Seiten helfen nicht, wenn es die Information nicht gibt.** Meine Vermutung war: Opus bekommt bei «unklar» dasselbe dünne Material wie Sonnet und kann deshalb nichts klären. Also darf Opus jetzt bis zu drei weitere Seiten holen, Laya wählt sie aus. Ergebnis auf den Testorten: Opus hat bei sechs Orten zwei bis fünf zusätzliche Seiten geladen und blieb bei fünf davon trotzdem bei «unklar». Bei einer Burgstelle, die nur auf Wikipedia vorkommt, oder einer Brücke, die eine Gemeinde nur nebenbei erwähnt, steht die Antwort schlicht auf keiner Seite derselben Website. Ehrlich gesagt war das Weiterbrowsen eine Lösung für das falsche Problem.

**Die Suche war der grösste Posten, und zwar doppelt bezahlt.** In einer typischen Nacht liefen 18.4 Millionen Tokens über 2'759 Calls, für 656 Orte und 313 Steckbrief-Nachträge. So verteilte sich das:

| Zweck | Anteil |
|---|---|
| Recherche (welche Seite?) | 27 % |
| Bildbewertung | 26 % |
| Urteil + Kurztext + Steckbrief | 19 % |
| Nachrecherche (keine lebende Seite) | 14 % |
| Steckbrief-Nachträge | 9 % |
| Opus bei «unklar» | 5 % |

Recherche und Nachrecherche zusammen: 41 %. Lustigerweise lag das an einem Werkzeug, das gar nicht mehr funktionierte. Claudes eingebaute Websuche lieferte seit Tagen keine einzige Anfrage mehr (`web_search_requests: 0`). Jeder Suchversuch kostete trotzdem einen vollen Call, kam leer zurück, dann holte die Pipeline Treffer über Firecrawl und ein zweiter Call wählte daraus aus. Das ist doch verrückt, oder? Ein kaputtes Werkzeug, das brav weiter Tokens frisst, ohne je einen Fehler zu werfen.

Der Umbau ist simpel: Hat ein Ort eine bekannte Website, gibt es gar keine Suche mehr. Bei einer Stichprobe stand die eigene Website bei 8 von 12 Orten ohnehin auf Platz 1, und das Sammeln startet sowieso von ihr aus. Orte ohne Website werden direkt über Firecrawl gesucht, und steht ein eindeutiger Treffer da, wird er ganz ohne Modell genommen. Der Preis: Bei Betreibern mit vielen Angeboten, einer Bahn oder einer Gemeinde, sucht die Pipeline die Detailseite nicht mehr gezielt, die muss jetzt Laya beim Navigieren finden.

**Managed APIs haben ihr eigenes Budget.** Firecrawl zuerst zu crawlen hat Tokens gespart, aber pro Ort zwei bis fünf Credits gekostet. Nach ein paar Tagen waren noch 728 Credits übrig, das reicht für rund 150 Orte. Jetzt crawlt Crawl4AI wieder zuerst, und Firecrawl-Credits gibt es nur noch für die Suche. Das heisst: Wer Tokens gegen Credits tauscht, verschiebt die Kosten, er spart sie nicht.

**Und ein Laptop ist kein Server.** In einer Nacht kamen genau 14 Orte zustande, in einer anderen 81. Beide Male war der Mac eingeschlafen, einmal am Akku, einmal mit zugeklapptem Deckel um 00:12 Uhr bei 18 % Akku. `caffeinate` hält den Rechner nur wach, wenn er am Strom hängt und der Deckel offen ist. Das stand in keiner meiner Logdateien, sondern nur in `pmset -g log`.

## Wie gross das Fenster ist (und warum das die eigentliche Währung ist)

Über die API zahlt man Tokens, über das Abo kauft man **Fenster**. Ich protokolliere die Abo-Prozente alle drei Minuten (die Statuszeile von Claude Code legt sie ohnehin in einem Cache-File ab) und rechne sie gegen die per Call geloggten Tokens. Kalibriert bei unserer Arbeitslast:

- **Session-Fenster (5 h): voll bei rund 14 bis 15 Millionen Tokens** in der ersten Messnacht (etwa 146'000 geloggte Tokens je Prozentpunkt)
- **Wochenfenster: rund 59 Millionen**, das heisst die Woche erlaubt etwa vier volle Session-Fenster
- Ein $20-Plan hat davon ein Fünftel, das heisst alles durch fünf teilen

Eine spätere Nacht hat das relativiert: Da waren zwei volle Fenster schon bei rund 18 Millionen Tokens zu, also etwa 9 Millionen pro Fenster. Der Unterschied war vor allem der Anteil Output, der war in dieser Nacht deutlich höher. Ich vermute, Output zählt im Abo stärker als Cache-Input. Das heisst: Die Fenstergrösse in Tokens ist keine Konstante, sondern hängt davon ab, wie dein Mix aus Input, Cache und Output aussieht. Die verlässlichere Einheit ist am Ende «Orte pro Fenster», und die liegt bei uns bei rund 300 bis 370.

Praktisch heisst das: 2'000er-Blöcke laufen nachts im 0-7-Uhr-Fenster, jeder Call wird in eine JSONL geschrieben (Zeit, Modell, Zweck, Input, Cache, Output), und die Notbremse bricht den Lauf ab, wenn mehr als 15 % der Recherchen scheitern, statt einen unbrauchbaren Block zu produzieren.

## Was nehme ich mit?

1. **Crawle zuerst den Hauptinhalt, nicht die Website.** `onlyMainContent` bzw. ein guter Inhaltsfilter ist die billigste Token-Optimierung überhaupt, weil kürzeres Material in jeden späteren Call fliesst. Und archiviere trotzdem alles: Der Beleg-Check und die Nachträge laufen ohne das Roh-Archiv nicht.
2. **Multiple-Choice-Entscheidungen gehören nicht in grosse Modelle.** Link-Navigation ist eine Klassifikation, kein Text: Stichworte vorsortieren, ein 322M-Entscheidungsmodell wählen lassen, 20 Millisekunden lokal, null Kosten. Das hat den grössten Einzelblock gedrückt.
3. **Fehler brauchen ein eigenes Format, und Fehlschläge werden nie gecacht.** Der teuerste Fehler des Projekts war ein Cache voller leerer Recherchen: 1'543 ausgefallene Suchen, als Ergebnis gespeichert, vom nächsten Lauf wiederverwendet. Folge: 46 % der Orte falsch auf «unklar». Ein Teil davon geht auf meine Kappe.
4. **Misst pro Zweck, nicht insgesamt, und zwar immer wieder.** «Der Lauf kostet X» ist eine Zahl ohne Hebel. «Das Browsen kostet 35 %» ist eine Anweisung. Und eine Woche später war es plötzlich die Suche mit 41 %, weil ein Werkzeug still ausgefallen war.
5. **Ein Testset findet Fehler, aber keine kleinen Qualitätsunterschiede.** 20 Orte haben aus 25 % «unklar» zwei, drei Orte Unterschied gemacht. Wer Varianten vergleichen will, braucht deutlich mehr Fälle.

## Ausblick, und eine Wette

Noch offen ist der saubere Vergleich mit Jev und mit Z.AI als Text-Anbieter, beide scheiterten bisher daran, dass Z.AI nachts überlastet war. Und offen ist die Frage, was mit den 25 % «unklar» passiert, die offenbar nicht an zu wenig Material liegen, sondern an Orten, über die schlicht niemand etwas Aktuelles schreibt. Meine Vermutung: Für die braucht es andere Quellen, Rezensionen oder Gemeindeblätter, und keine weiteren Seiten derselben Website. Meine Wette: Jev trifft bei 40 Link-Optionen besser, Laya reicht bei 20 und ist gratis. Und ich würde mein Geld darauf wetten, dass in einem Jahr das Standard-Rezept für Scraping-Agenten genau so aussieht: Firecrawl-artiger Hauptinhalt-Crawl, ein kleines Entscheidungsmodell für die Navigation, ein grosses Modell nur für Urteil und Text, Belegprüfung im Code statt durch Zweitmeinung. Die Werkzeuge stehen alle schon da, die meisten sogar kostenlos auf dem eigenen Rechner. Was fehlt, ist die Rechnung, die dir zeigt, wo du gerade unter der Laterne suchst.

Ich freue mich auf eure Kommentare und Anregungen!
