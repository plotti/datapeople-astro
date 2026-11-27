---
title: "Vom Think Tank zur One-Man-Show: wie ich mit einem Claude-Skill faktenbasierte YouTube-Videos mache"
description: "Für ein recherchiertes Erklärvideo hätte man früher ein ganzes Team gebraucht: Leute, die Studien lesen und verdichten, Grafiker, Faktenchecker, eine Autorin fürs Skript, jemanden für die O-Töne, einen Cutter für den Rohschnitt. Am Beispiel meines Videos «Krise der liberalen Demokratie?» zeige ich Schritt für Schritt, was Claude besorgt, geprüft, gebaut und mit mir iteriert hat, und wie daraus ein generischer, frei verfügbarer Skill wurde."
pubDate: 2026-11-17T21:30:00+01:00
readTime: 14
category: "KI Tools"
tags: ["Claude","Claude Code","Skills","Video","Faktencheck","Zukunft der Arbeit"]
cover: "../../assets/blog/studien-video-cover.png"
---

**Stand:** November 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 14 Minuten

Ich mache nebenbei YouTube-Videos zu Politik und Demokratie. Das Format: Ich rede, neben mir läuft eine Folie mit der Studie, die meine Aussage belegt, dazwischen kommen O-Töne von Politikerinnen, Forschern oder Bürgern. Jede Behauptung soll belegt sein. Keine gefühlten Wahrheiten.

Mein letztes Video heisst «Krise der liberalen Demokratie?». Es hat 26 Folien, stützt sich auf 20 Originalquellen, enthält 19 O-Töne und dauert im Preview 12 Minuten 42. Gemacht habe ich es allein, im Gespräch mit Claude. Als ich danach zurückgeschaut habe, ist mir erst klar geworden, wie viele Leute man dafür vor ein paar Jahren gebraucht hätte.

## Früher: ein ganzer Think Tank

Spielen wir durch, wie so ein Video klassisch entstanden wäre.

- **Recherche.** Leute, die das Thema kennen, suchen die relevanten Studien zusammen, lesen die Papers, verdichten sie auf Kernaussagen und bereiten einzelne Grafiken daraus neu auf. Das ist schon eine ganze Mannschaft, im Grunde ein kleiner Think Tank.
- **Die Idee fürs Video.** Dann kommt jemand und sagt: Mit diesen Beobachtungen will ich ein Video machen. Eine andere Person mit einem anderen Blick, die nicht in Studien denkt, sondern in einer Geschichte.
- **Faktencheck.** Die nächste Person prüft alles noch einmal. Steht die Zahl wirklich so im Paper oder nur in der Pressemitteilung? Gilt sie auch für Deutschland? Das dauert wieder ewig.
- **Skript.** Jemand schreibt den Teleprompter-Text und muss das Material aus der Recherche mit der Story verheiraten, die er erzählen will. Welche Folie kommt bei welchem Satz?
- **O-Töne.** Die nächste Person sucht Soundbytes. Wo gibt es den Politiker, der genau das sagt? Stundenlang Videos schauen, Zeitstempel notieren, schneiden.
- **Review und Rohschnitt.** Jemand baut ein Mockup, man schaut es an, iteriert, rendert es nochmals raus und schaut, wie lang das Video wird. Erst dann geht man vor die Kamera.
- **Rechte und Schnitt.** Zum Schluss klärt jemand, ob man die Ausschnitte zeigen darf, und bereitet das Material für den Cutter auf.

Sechs, sieben Rollen und Wochen an Arbeit, für ein YouTube-Video. Wie das heute aussieht, zeige ich jetzt nicht abstrakt, sondern an dem, was in diesem Projekt konkret passiert ist.

## 1. Recherche: 20 Originalquellen statt Links in einer Notiz

Mein Startpunkt war eine Ideensammlung: Thesen zu sechs Problemen der Demokratie (wenig Vertrauen, teuer und blockiert, Spaltung, Selbstdarsteller, keine echte Auswahl, Kurzfristdenken), dazu Links und Zahlen, die ich irgendwo gelesen hatte. Daraus hat Claude als Erstes einen Ordner mit den Originalen gebaut, nummeriert wie die Folien, mit einer `LIESMICH.txt`, die pro Datei die Fundstelle nennt und sagt, was fehlt.

Ein Auszug aus dem Ordner:

| Nr. | Quelle | Was drin ist |
|---|---|---|
| 02 | Edelman Trust Barometer 2026, Germany Report | S. 5–7. edelman.com blockiert automatische Downloads, geprüft wurde die identische Kopie beim DZI |
| 03 | Klasen et al. (2026), DZA aktuell 01/2026 | S. 10–11, Abb. 1 |
| 04 | Bundestag: hib 610/2025, Glossar Diäten, Drucksache 21/5980 | Etat, Entschädigung, Parteienfinanzierung 2026 |
| 06 | Iyengar, Sood & Lelkes (2012), Public Opinion Quarterly | S. 13–14 |
| 07 | Rathje, Van Bavel & van der Linden (2021), PNAS | Volltext über PMC |
| 08 | van de Wardt et al. (2025), EJPR | Open Access, S. 318, Abb. 3 |
| 11 | Healy & Malhotra (2009), APSR | nur Abstract-Seite (Paywall), die Zahl steht im Abstract |
| 13 | Brennan (2016), Against Democracy | Buch, nur Inhaltsverzeichnis als Beleg für Kapitel 6 |
| 15 | Fishkin et al. (2021), APSR, «America in One Room» | Open Access, Tabelle 7 |
| 17 | Citizens' Assembly Ireland (2018), Third Report | Fragen 1 und 3, dazu die Mitgliederauswahl |

Die letzte Spalte ist der Punkt. Wo ein Volltext hinter einer Paywall liegt, steht das da, mit DOI. Webseiten ohne PDF hat Claude als PDF gedruckt, damit auch die im Ordner liegen. So sehe ich bei jeder Folie sofort, wie belastbar der Beleg ist.

## 2. Faktencheck: was in meinen Notizen nicht stimmte

Die Regel im Skill lautet: Jede Zahl aus meinen Notizen gilt als ungeprüft, bis sie wörtlich im Original steht. Claude wandelt dafür jedes PDF in Text um und sucht die exakte Zahl. Am Ende stand im Recherche-Teil des Teleprompters eine Tabelle «Korrekturen gegenüber der Ideensammlung». Ein Auszug:

| In meinen Notizen | Was das Original sagt | Im Skript |
|---|---|---|
| «Sinkendes Vertrauen», Edelman Deutschland 44 % | 44 ist ein Indexwert, kein Prozentwert, und gegenüber 2025 (41) gestiegen. Gewachsen ist die Lücke zwischen hohen und tiefen Einkommen, von 6 Punkten (2012) auf 18 (2026). | «niedrig» plus Einkommensschere, nicht «sinkend» |
| DZA: Ausgegrenzte vertrauen politischen Institutionen «um bis zu 28 Punkte» weniger | Die 28 Punkte gelten für die Wissenschaft, bei Parteien sind es 12. Befragt wurden nur Personen ab 40. | weggelassen, stattdessen Abb. 1 mit Hinweis «über 40-Jährige» |
| Bürgerrat Stuttgart: Kontrollgruppe vertraut dem Bürgerrat mehr | Der Evaluationsbericht hat weder eine Kontrollgruppe noch diese Aussage. | ersetzt durch «America in One Room», das eine Kontrollgruppe hat |
| Bertelsmann: Angriffe bringen rund 40 % mehr Interaktion | Steht so nicht in der Studie, die misst etwas anderes. | ersetzt durch Rathje et al. 2021: +67 % pro Wort über die Gegenseite |
| Deliberative Polls «in über 150 Ländern» | Nicht belegt, vermutlich Anzahl Polls mit Anzahl Ländern verwechselt. | weggelassen |
| 1960 4 %, heute «etwa 50 %» | 2010 waren es 49 % bei den Republikanern und 33 % bei den Demokraten. | beide Werte genannt |
| Healy & Malhotra: 1 $ Vorsorge spart 15 $ | Stimmt wörtlich, steht im Abstract. | übernommen |

Dazu kamen Zusatzthemen aus meinen Notizen, die Claude geprüft und teilweise verworfen hat. Ein Artikel, der angeblich belegt, dass Narzissten in der Politik überrepräsentiert sind, erwähnt das Thema gar nicht. Eine Peer-Review-Studie zeigt eher das Gegenteil. Ersetzt wurde das durch zwei Studien, die man nachlesen kann. Ein Zitat, das ich Parkinson & Mansbridge zugeschrieben hatte, stammte aus einem ganz anderen Artikel, und das Wort «drastisch» darin war durch nichts gedeckt.

Und es gibt eine eigene Liste **Schwachstellen und offene Punkte**. Darin steht zum Beispiel, dass bei Iyengar die Frage 1960 anders formuliert war als 2010 (das steht deshalb in der Caption der Folie), dass «+67 %» bei Rathje eine Odds-Angabe ist und keine Wahrscheinlichkeit, und dass die 1,28 Milliarden Euro den ganzen Bundestag inklusive Verwaltung meinen. Ob das «zu teuer» ist, belegt keine Studie, also sagt das Skript nur die Zahl.

## 3. Grafiken: welche Stelle aus welchem Paper zur Folie wurde

Für jede Kernaussage hat Claude die Grafik oder Tabelle aus dem Original als editierbares Diagramm in meinem Design nachgebaut, mit Studientitel oben rechts, Caption zur Methode und einer Callout-Box mit der Kernzahl. Ein paar Beispiele:

| Folie | Aus dem Original | Auf der Folie |
|---|---|---|
| Vertrauen hängt am Einkommen | Edelman 2026, S. 6, Datenlabels der Grafik: hohe Einkommen 36 / 58 / 53, tiefe 30 / 36 / 35 | Balken 2012, 2022, 2026, Callout «Lücke wuchs von 6 auf 18 Punkte», dazu das wörtliche Zitat von S. 7 |
| Dem Bundestag vertrauen nur 40 % | DZA 2026, Abb. 1: Polizei 86,3 %, Bundestag 39,7 %, Regierung 35,1 %, Parteien 21,7 % | horizontale Balken, Hinweis «Personen ab 40» in der Caption |
| Demokratie hat ihren Preis | Bundestag: Etat 1,28 Mrd. €, Entschädigung 11'833 € pro Monat, Parteienfinanzierung 232 Mio. € | drei Kennzahl-Kacheln, ohne Wertung |
| Die Gräben werden tiefer | Iyengar et al. 2012, S. 13–14: 5 % / 27 % / 49 % (R), 4 % / 20 % / 33 % (D) | Balken 1960, 2008, 2010, Caption zur geänderten Frageformulierung |
| Wer in die Politik drängt | van de Wardt et al. 2025, S. 318, Abb. 3: kandidiert 21 % vs. 2 % | gruppierte Balken nach Ehrlichkeit und Bescheidenheit |
| Viele Stimmen, wenig Sitze | UK-Wahl 2024: Labour 34,6 % der Stimmen, 411 Sitze | Stimmen- vs. Sitzanteil, Sitzanteile als «eigene Berechnung» markiert |
| Belohnt wird die Hilfe, nicht die Vorsorge | Healy & Malhotra 2009, Abstract: 1 $ Vorsorge ≈ 15 $ weniger Schaden | flächentreue Grafik: ein Quadrat gegen fünfzehn |
| Wer miteinander redet, hasst sich weniger | Fishkin et al. 2021, Tabelle 7: Thermometer zur Gegenpartei D 19,5 → 32,6, R 20,2 → 34,6, Kontrollgruppe unverändert | Vorher-nachher-Balken mit Kontrollgruppe |
| Ausgeloste denken langfristiger | Irland, Third Report, Fragen 1 und 3: 97 % (73 von 75), 80 % (60 von 75) | zwei Kennzahlen, Caption: Presseseite nennt 98 %, der Bericht 97 % |

![Drei Folien aus dem Deck: Edelman Trust Barometer, Iyengar et al. zur Polarisierung, Healy & Malhotra zur Katastrophenvorsorge](../../assets/blog/studien-video-slides.jpg)

Jede Folie hat ausserdem Sprechernotizen mit der Fundstelle, dem Originalzitat und Warnhinweisen wie «nicht ‹sinkend› sagen». Dazu kamen Kapitelkarten für die sechs Probleme, eine Übersicht im Intro und Trennfolien vor dem Lösungsteil.

## 4. Skript und Iteration: wie wir das Video zusammen gebaut haben

Der Teleprompter ist ein Dokument mit zwei Teilen: der Drehfassung mit rund 1100 Wörtern Sprechtext, in der bei jedem Satz steht, welche Folie gerade läuft und wo ein O-Ton kommt, und dem Recherche-Teil mit Quellentabelle, Korrekturen und Schwachstellen. Ich lese, schreibe selbst hinein und gebe Claude im Chat Anweisungen, so wie ich mit einem Redaktor reden würde. Ein paar echte Beispiele aus dem Verlauf:

- **Kritik einholen.** «Geh den Teleprompter durch und sag mir, welches die schwächste Stelle ist.» Claude hat Stellen gefunden, an denen die Logik hakte, und Umformulierungen vorgeschlagen. Meine Antwort: «Gefällt mir gut, setz alles so um, nimm das Wording ‹Pest und Cholera› raus.»
- **Eigene Sätze einbauen.** Ich habe Sätze diktiert wie «Man einigt sich auf den kleinsten gemeinsamen Nenner und blockiert sich so gegenseitig» oder «Und wer will überhaupt in so einen Politikbetrieb, der so auf Konfrontation getrimmt ist?». Claude hat sie an der richtigen Stelle eingepasst.
- **Struktur.** «Ich will Zwischenüberschriften für die einzelnen Probleme.» Daraus wurden die Kapitelkarten «Problem 1 von 6» bis «Problem 6 von 6».
- **Ton.** «Nimm die 52 % bei der UK raus, das ist zu polemisch.»
- **Schwache Stellen streichen.** Zur Rente habe ich gesagt: «Das wirkt schwach. Falls wir nichts finden, lieber rausnehmen.» Die Folie ist rausgeflogen.
- **Material nachfordern.** «Such mir Archivmaterial, wo Politiker in Überschwemmungsgebieten dastehen und helfen.» Gefunden wurden Merkel im Flutgebiet 2021 und Scholz am Deich 2024. Nach Folie 9 wollte ich Trump-Videos und fragte, ob es so etwas auch aus Deutschland oder der Schweiz gibt. Dazu kamen Schröder in der Elefantenrunde 2005.
- **Umstellen und parken.** «Nach Folie 18 zeig erst die O-Töne aus Deutschland, dann den Text dazu.» «Lass nur OT 9 drin, OT 10 bis 13 parken wir erstmal.» Geparkte O-Töne landen in einem eigenen Abschnitt am Ende und bleiben verfügbar.
- **Neue Folie, neuer Schluss.** «Nach Folie 24 so etwas sagen wie: Sollten wir vielleicht einmal ernsthaft über das Losverfahren nachdenken?» Dazu ein O-Ton von Philipp Amthor und danach eine neue Folie «Zeit für neue Lösungen?».
- **Fehler finden.** «Im Teleprompter ist die Folie 6 noch drin.» Stimmte, beim Ersetzen war alter Text stehen geblieben. Claude hat den Tab bereinigt und geprüft, dass nichts doppelt steht.

Zwischendurch kam auch eine juristische Frage: «Gibt es das Zitatrecht?» Claude hat die Rechtslage in der Schweiz und in Deutschland recherchiert und daraus später die Rechte-Ampel gebaut.

## 5. O-Töne: gesucht, geschnitten, auf dem Mac geladen

Insgesamt hat Claude 23 O-Töne an die richtigen Stellen gesetzt, 19 sind im Video, 4 geparkt. Gesucht habe ich mit meinem eigenen Archiv, das Transkripte vieler Videos zu Demokratie und Politik durchsuchbar macht. Claude stellt pro Folie mehrere Suchanfragen, liest das Transkript rund um die Treffer und schlägt mir eine Tabelle mit Sprecher, Zitat und Zeitstempel vor. Dazu kamen gezielte Suchen nach bestimmten Personen.

Die Quellen sind entsprechend gemischt: NDR, die Mediathek des Bundestags, ZDF (Philipp Blom bei Precht), DER STANDARD, ARTE, WELT, ein Vortrag des Policy Institute am King's College London mit deutschen Untertiteln, die Organisation Mehr Demokratie und vier Ausschnitte aus dem Dokumentarfilm «Goodbye Politicians, Hello Democracy». Geschnitten wird auf die Zehntelsekunde, zum Beispiel `2:50,6–3:00,6`.

YouTube blockiert Downloads aus Rechenzentren. Claude hat die Clips deshalb nicht in der Cloud geladen, sondern über die Desktop-App direkt auf meinem Mac. Der Film ist auf seiner Website als Vimeo-Stream eingebettet. Dessen signierte URL lief nach ein paar Stunden ab, Claude hat sie neu geholt und weitergemacht.

## 6. Review vor dem Dreh: Mockup und Preview

Aus der Drehfassung baut der Skill einen klickbaren Schnitt-Mockup. Jeder Satz wird mit [Piper](https://github.com/rhasspy/piper) vorgelesen, einer freien Sprachausgabe mit der deutschen Stimme «Thorsten». Links läuft die Folie, rechts ein Platzhalter für mich, die O-Töne laufen im Vollbild mit Bauchbinde. Ändere ich einen Satz, wird nur dieser neu vertont.

![Der Schnitt-Mockup: Folie links, Sprecher rechts, darunter Zeitleiste und Skript](../../assets/blog/studien-video-mockup.png)

Auf meinen Wunsch «Render mir mal ein Preview als MP4» kam das ganze Video als Datei: 12 Minuten 42, bevor ich eine einzige Aufnahme gemacht hatte.

![Ein Bild aus dem Preview-Video, das vor dem Dreh entstanden ist](../../assets/blog/studien-video-preview.jpg)

## 7. Schnitt-Material und Rechte

Zum Schluss: «Render mir jetzt alle Videos, die im Video benutzt werden, in einen Ordner, 1080p, vorne und hinten 5 Sekunden mehr Padding.» Das Ergebnis sind 19 Dateien von `OT01` bis `OT19` und eine `Schnittliste.csv` mit Ein- und Ausstieg in jeder Datei und der Originalquelle.

Und die Rechte-Ampel nach Schweizer und deutschem Zitatrecht: **0 grün, 13 gelb, 6 rot.** Gelb heisst: Das Zitatrecht trägt wahrscheinlich, wenn der Sprechtext sich mit dem Zitat auseinandersetzt. Rot sind die vier Filmausschnitte (Freigabe beim Produzenten anfragen) und die zwei Flut-Schnittbilder, weil sie nur bebildern und nicht zitiert werden. Das ist keine Rechtsberatung, aber eine Liste, mit der ich weiss, wen ich anschreiben muss.

## Was sich dabei wirklich verändert

**Die Übergaben fallen weg.** In einem Team geht bei jeder Übergabe Wissen verloren. Die Rechercheurin weiss, dass die DZA-Zahlen nur für Leute ab 40 gelten, im Skript steht es dann nicht mehr. Hier stehen Fundstelle, Einschränkung und Satz im selben Dokument.

**Die mühsamen Rollen werden plötzlich gemacht.** Als Einzelperson hätte ich nie jede Zahl im Original-PDF nachgeschlagen und nie vor dem Dreh einen Rohschnitt gebaut. Das waren genau die Rollen, die man sich in kleinen Projekten spart. Jetzt sind sie so billig, dass ich sie immer mache. Das Video ist dadurch schneller fertig, und es wird besser.

**Meine Rolle ist die des Chefredakteurs.** Ich entscheide, was zu polemisch ist, welcher O-Ton bleibt, welche schwache Folie fliegt und wo die Geschichte hängt. Die Verantwortung für das, was im Video gesagt wird, bleibt bei mir.

## Der Skill: generisch und für jedes Thema

Den ganzen Ablauf habe ich in einen **Claude-Skill** gepackt und [auf GitHub veröffentlicht](https://github.com/plotti/ai-video-toolkit). Er ist nicht an mein Thema und nicht an mein Archiv gebunden. Er funktioniert für jedes YouTube-Video, das auf Belegen aufbaut, ob es um Klimapolitik, Ernährung oder Wirtschaftsgeschichte geht, und in jeder Sprache. Die O-Töne kommen standardmässig von YouTube; wer ein eigenes Video-Archiv hat, kann es anbinden.

Ein Skill ist im Kern eine Anleitung, die Claude liest, wenn sie zur Aufgabe passt, plus die Skripte, die Claude dafür braucht: Faktencheck-Regeln, Ablauf, Sprachausgabe, Mockup, Preview, Clip-Export und Rechte-Ampel. Bedient wird er nicht über Befehle, sondern indem man mit Claude redet. Das komplette Demokratie-Projekt mit allen O-Ton-Zeitmarken und Rechte-Einträgen liegt als Beispiel bei, ohne das Videomaterial selbst.

**In Claude Code:**

```
/plugin marketplace add plotti/ai-video-toolkit
/plugin install ai-video-toolkit@ai-video-toolkit
```

**In der Claude-App:** die ZIP-Datei aus dem Ordner `dist/` im [Repository](https://github.com/plotti/ai-video-toolkit) unter *Customize → Skills* hochladen. Dafür muss in den Einstellungen die Code-Ausführung aktiviert sein.

Danach reicht ein Satz wie: «Mach mir ein Video von acht Minuten darüber, warum das Vertrauen in Parlamente sinkt. Meine Notizen hängen an.»

## Was nehme ich mit?

1. **Aus einem Team wird ein Gespräch.** Recherche, Faktencheck, Grafik, Skript, O-Töne, Rohschnitt und Rechte waren früher sechs, sieben Rollen. In diesem Projekt waren es Abschnitte in einem Chat.
2. **Meine Notizen waren schlechter, als ich dachte.** Mehrere Zahlen hätte ich so in die Kamera gesagt, obwohl sie im Original anders stehen. Der Faktencheck ist der eigentliche Gewinn.
3. **Billig heisst nicht schlechter.** Weil Faktencheck und Rohschnitt fast nichts mehr kosten, mache ich sie immer.
4. **Die Arbeit verschiebt sich zum Urteil.** Was bleibt, ist die Frage, was man erzählen will und was man verantworten kann. Das ist der Teil, den ich nicht abgeben will.

Der Code steht unter MIT-Lizenz auf [GitHub](https://github.com/plotti/ai-video-toolkit). Ich freue mich auf eure Kommentare, und vor allem auf Erfahrungen, falls jemand den Skill für ein ganz anderes Thema ausprobiert.
