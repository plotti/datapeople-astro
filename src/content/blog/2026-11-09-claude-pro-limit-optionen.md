---
title: "Claude Pro reicht nicht: was ich zahle und was dieselbe Arbeit woanders kostet"
description: "Claude Pro läuft mitten in der Session ins Limit, Max kostet 100 oder 200 Dollar im Monat. Was ich heute zahle, warum das Kontingent nicht reicht, was ein zusätzliches Flat-Rate-Abo bringt und was dasselbe Arbeitsvolumen per Token kostet. Mit einer Bewertung der Tarife nach Kontingentierung, Tokenpreis und Community-Erfahrung, einer Empfehlung für 20 bis 40 Dollar Zusatzbudget und der Frage, warum eine Million Token bei zwei Modellen nicht dieselbe Arbeit ist, belegt mit einem kontrollierten Benchmark."
pubDate: 2026-11-09T09:00:00+01:00
readTime: 30
category: "KI Tools"
tags: ["Claude Code","Z.ai","OpenRouter","DeepSeek","Kostenoptimierung"]
cover: "../../assets/blog/claude-pro-optionen.svg"
---

**Stand:** November 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 30 Minuten

Über Geld in der eigenen Werkzeugkette redet niemand gern. Ich habe es lange vermieden und einfach weitergezahlt. Inzwischen interessiert mich weniger der Preis als die Frage, ob mein Setup für die Art, wie ich arbeite, überhaupt reicht. Also habe ich aufgeschrieben, was ich zahle, was ich dafür bekomme und was dieselbe Arbeit woanders kosten würde.

## 1. Was bezahle ich jetzt

Ich bezahle 20 USD im Monat für [Claude Pro](https://claude.com/pricing) und 18 USD für den GLM Coding Plan von [Z.ai](https://z.ai). Dazu kommt [OpenRouter](https://openrouter.ai) als Reserve, über das ich [DeepSeek](https://www.deepseek.com) nutze. Meine festen Kosten liegen damit bei 38 Dollar. Die OpenRouter-Rechnung hängt davon ab, wie oft ich ausweichen muss.

Dafür bekomme ich zwei Modellzugänge für meine Arbeit in Claude Code: Claude über das Pro-Abo und GLM über Z.ai. OpenRouter ist ein Vermittler, über den ich Modelle bei verschiedenen Anbietern pro Nutzung bezahlen kann. Dort kaufe ich zusätzliche Kapazität, wenn die Abos nicht reichen.

Gegenüber Claude Max 5x für 100 Dollar spare ich mit den beiden Abos zunächst 62 Dollar im Monat, gegenüber Max 20x für 200 Dollar sind es 162. Solange OpenRouter unter 20 Dollar bleibt, liegen meine Gesamtkosten unter 60 Dollar. Ich hatte das als weniger als die Hälfte des kleineren Max-Tarifs eingeordnet. Das war falsch: Unter 60 ist nicht automatisch unter der Hälfte von 100.

Vor zwei Monaten habe ich beschrieben, [wie ich Claude Pro mit Z.ai ergänze und bei 30 Dollar im Monat lande](/blog/2026-09-17-claude-code-zai-zed-setup/). Dort steht das Handwerk: zwei Konfigurationen, ein Umschalt-Skript und Zed statt Cursor. Hier geht es um die heutige Rechnung mit 38 Dollar Grundkosten und um die Frage, wo zusätzliches Geld tatsächlich mehr Coding-Kapazität kauft.

## 2. Was ist das Problem

Was bringt mir ein günstiges Abo, wenn es mitten in der Arbeit stehen bleibt?

Es ist 15 Uhr an einem Dienstag. Ich habe drei Claude-Code-Fenster offen: In einem läuft eine Testsuite, im zweiten arbeitet der Agent an einem Refactoring, im dritten prüfe ich, was er in der letzten halben Stunde gebaut hat. Dann ist das Kontingent für dieses Fünf-Stunden-Fenster aufgebraucht.

Das passiert mir regelmässig. Ich kann warten oder zahlen. Claude Max für 100 oder 200 Dollar wäre der einfache Weg, und Preis und Leistung sind klar. Die 200 Dollar will ich trotzdem nicht ausgeben: Ich brauche die Kapazität an drei Tagen pro Woche für vier Stunden, nicht an sieben Tagen für vierundzwanzig Stunden. Mit dem grösseren Tarif kaufe ich Kapazität für den ganzen Monat, die ich an ungefähr zwei Dritteln der Tage nicht abrufe.

Dazu kommt eine zweite Grenze. [Anthropic](https://www.anthropic.com) nennt für Claude Pro kein festes Tokenkontingent. Token sind die Textbausteine, in denen Modelle Eingaben und Ausgaben verarbeiten. Dokumentiert sind ein Fünf-Stunden-Fenster und ein Wochenfenster, die sich Claude und Claude Code teilen. Ein eigenes Monatslimit gibt es nicht.

In meiner Grössenordnung passen zwei bis drei harte Coding-Tage in eine Woche. Will ich vier von sieben Tagen so arbeiten, ist spätestens am vierten Tag das Wochenkontingent weg und für die restlichen drei bleibt Warten. Ein Abo für 20 Dollar wird dadurch noch kein Abo für vier volle Arbeitstage.

### Wie viel ich in einem Monat verbrauche

Weil Claude Pro keine feste Tokenmenge veröffentlicht, nehme ich meinen eigenen Verbrauch als Vergleichsmassstab: Ein harter Tag umfasst 20 Millionen Input-Token und 2 Millionen Output-Token. Input ist der Kontext, den ich dem Modell schicke, etwa Dateien und Werkzeugausgaben. Output ist das, was das Modell erzeugt, einschliesslich der für meinen Verbrauch relevanten Denkausgaben.

Vier solche Tage pro Woche ergeben 88 Millionen Token, sechzehn Tage im Monat 352 Millionen. Das ist ein Rechenszenario für einen vollen Monat, nicht die Behauptung, dass Claude Pro diese Menge garantiert oder dass ich plötzlich an vier statt drei Tagen Kapazität brauche.

Die Möglichkeiten lassen sich zunächst so zusammenfassen:

| Option | Preis pro Monat | Abrechnung | Was du bekommst |
|---|---|---|---|
| 1. Warten | 0 | nichts | Nach fünf Stunden läuft es weiter |
| 2. Claude Max | 100 oder 200 USD | Flat | 5x oder 20x Claude |
| 3. Z.ai GLM Coding Plan | 18, 80 oder 168 USD | Credits pro 5 h und Woche | GLM-5.3 in Claude Code |
| 4. Flat-Rate-Anbieter | 10 bis 200 USD | Flat, Token unbegrenzt | DevPass, Cerebras, Nano-GPT |
| 5. Pay per Token | ab 0.10 USD pro Mio. | Token | OpenRouter, DeepSeek, alles |

Die Übersicht braucht zwei Einschränkungen: Warten hilft beim Fünf-Stunden-Limit, aber nicht bei einer ausgeschöpften Woche. Und „Flat-Rate“ bedeutet bei diesen Anbietern keineswegs durchgehend unbegrenzte Token.

Mein heutiges Setup lohnt sich, solange Claude Pro plus GLM die Arbeit abdecken. Muss ich trotzdem regelmässig warten, habe ich im Grunde zwei Wanduhren statt einer: Beide Abos sagen mir, wann ich weiterarbeiten darf. Der zusätzliche Modellblick auf meinen Code ist nützlich, ersetzt aber keine verfügbare Kapazität.

## 3. Wonach ich bewerte

Bevor ich Anbieter vergleiche, brauche ich zwei Dinge: eine Vorstellung davon, wie belastbar ein Tokenvergleich überhaupt ist, und eine kurze Liste von Kriterien, an denen ich die Tarife messe.

### Modelle verbrauchen unterschiedlich viele Token

Ein Token ist keine Arbeitseinheit. Zwei Modelle können für dieselbe Aufgabe sehr unterschiedliche Mengen davon brauchen, und ein günstigeres Modell kann deshalb am Ende mehr kosten als ein teureres. Meine 352 Millionen Token im Monat gelten für ein Modell und nicht für eine Aufgabe.

Einen Beleg dafür gibt es, und es ist der einzige in diesem Text, der aus einem kontrollierten Lauf stammt und nicht aus einer Preisseite. SWE-bench Verified stellt 500 echte Fehlerberichte aus offenen Python-Projekten, und gewertet wird, ob ein Agent sie ohne Hilfe behebt. Vals AI hat das für alle Modelle mit demselben, bewusst einfachen Agenten gemessen, Bash als einziges Werkzeug, und dazu aufgeschrieben, was ein Durchlauf gekostet hat ([Vals AI, Benchmark am 1. September 2026 archiviert](https://www.vals.ai/benchmarks/swebench)). Der Lauf umfasst 88 Modelle, ich zeige daraus nur die, die in diesem Text vorkommen, und Claude als Referenz.

| Modell | Stufe | Gelöst | Kosten pro Aufgabe | Token pro Aufgabe | Dauer pro Aufgabe |
|---|---|---|---|---|---|
| [Claude Opus 5](https://claude.com/pricing) | 2x | 97.0 % | 1.29 USD | 1.09 Mio. | 9m37s |
| [DeepSeek V4 Pro 0813](https://www.deepseek.com) | 1x | 96.4 % | 0.10 USD | 764k | 4m00s |
| [GLM-5.3](https://z.ai) | 1x | 95.4 % | 0.34 USD | 958k | 14m01s |
| [Kimi K3](https://www.moonshot.ai) | 1x | 93.4 % | 0.76 USD | 884k | 10m19s |
| [GLM-5.3-Flash](https://z.ai) | 1x | 92.0 % | 0.02 USD | 793k | 1h 04m |
| [Qwen 3.8 27B](https://qwen.ai) | 3x | 86.0 % | 1.08 USD | 1.99 Mio. | 10m00s |
| [GLM-4.7](https://z.ai) | 2x | 69.4 % | 0.20 USD | 1.50 Mio. | 6m06s |

Zwei Modelle aus meinen Tabellen fehlen, und beide Lücken sind wichtig. DeepSeek V4.1-Flash, das Modell aus meiner Rechnung, ist nach der Archivierung erschienen und hat keinen Wert, die nächstliegende Zahl ist V4 Pro. Für Qwen3.8-Flash, das Modell im Nano-GPT-Tarif, gibt es ebenfalls keinen Eintrag. Ich nehme stattdessen die 27B-Variante derselben Familie, weil ElectronHub sie in seiner Modellliste führt.

Vier Dinge liest man an der Tabelle ab.

**Der Tokenbedarf schwankt um den Faktor zweieinhalb, und klein heisst nicht sparsam.** DeepSeek V4 Pro kommt mit 764'000 Token pro Aufgabe aus, Qwen 3.8 27B braucht 1.99 Millionen. Das 27B-Modell ist das kleinste in dieser Liste und kostet mit 1.08 Dollar pro Aufgabe fast so viel wie Claude Opus 5, bei elf Punkten weniger. Meine 352 Millionen Token sind damit nur eine Aussage für das Modell, für das ich sie gerechnet habe.

**Die Punktzahlen liegen oben eng zusammen.** Zwischen Claude Opus 5 und GLM-5.3 liegen 1.6 Punkte, zwischen Opus 5 und Kimi K3 vier. Das ist der Grund, warum Vals den Benchmark archiviert hat: Er unterscheidet oben nicht mehr. Wer heute einen Anbieter nach Benchmarkpunkten auswählt, wählt zwischen Modellen, die auf dieser Skala gleich gut sind.

**Der Preis pro Aufgabe unterscheidet sich trotzdem um den Faktor dreizehn.** DeepSeek V4 Pro löst 96.4 Prozent für 10 Cent, Claude Opus 5 löst 97.0 Prozent für 1.29 Dollar. Für sechs Zehntelpunkte zahlt man das Dreizehnfache.

**GLM-4.7 fällt ab, und dieser Abfall hat einen Preis.** 69.4 Prozent sind 26 Punkte weniger als GLM-5.3. Genau dieses Modell steckt hinter dem 50-Dollar-Plan von Cerebras. Wer dort nach dem Anbieternamen auswählt, bekommt eine ältere Modellgeneration als die, die ich sonst vergleiche.

Dazu kommt die Zeit, und sie steht neben dem Geld. GLM-5.3-Flash kostet 2 Cent pro Aufgabe und löst 92 Prozent, braucht dafür aber eine Stunde und vier Minuten, wo DeepSeek vier Minuten braucht. GLM-5.3 löst 3.4 Punkte mehr als die Flash-Variante, kostet siebzehnmal so viel und ist viereinhalbmal schneller.

Die Spalte Stufe in der Tabelle leite ich aus dem Tokenbedarf pro Aufgabe ab: bis knapp eine Million Token ist es **1x**, bis anderthalb Millionen **2x**, darüber **3x**. Ich runde dabei grosszügig auf, 1.09 Millionen zählen schon als 2x. Wer ein sparsames Modell wählt, kommt mit dem Volumen aus, das ich oben gerechnet habe. Wer ein verschwenderisches wählt, braucht für dieselbe Arbeit das Doppelte oder Dreifache und plant entsprechend mehr Kapazität ein.

Die drei Stufen sind bewusst grob und decken die Spanne, die ich gerade gemessen habe, mit Luft nach oben ab. Ich bleibe trotzdem bei dreien, weil mehr Genauigkeit bei dieser Datenlage vorgetäuscht wäre. Der Benchmark deckt Python-Fehlerberichte mit einem einfachen Agenten ab, und mein Alltag sieht anders aus.

Welche Stufe für dich gilt, kann ich dir nicht sagen. Die Tabelle oben zeigt den Unterschied zwischen Modellen, aber ob dein Modell auf deinen Aufgaben in die erste oder in die dritte Stufe fällt, hängt an deinem Code, deinen Werkzeugketten und daran, wie oft du nachfassen musst. Das entscheidet jeder für sich. Meine Kostenrechnung in diesem Text gilt für die erste Stufe, und wer sich in der dritten wiederfindet, multipliziert die Zahlen entsprechend.

Damit verschiebt sich die Frage. Sie lautet nicht, was eine Million Token kostet. Sie lautet, was eine fertige, funktionierende Änderung kostet. Ein Modell, das die Hälfte kostet und doppelt so viele Nachbesserungen braucht, ist am Ende teurer.

### Die drei Kriterien

Der Preis pro Million Token ist das einfachste Mass und das unvollständigste. Ich bewerte die Tarife deshalb nach drei Kriterien und gebe jedem eine Bewertung von einem bis drei Sternen.

**Kontingentierung.** Nach wie vielen Stunden wird wieder aufgefüllt, und wie viel Volumen steht pro Tag, Woche oder Monat bereit? Ein täglicher Rhythmus mit veröffentlichter Menge ist etwas anderes als ein Fünf-Stunden-Fenster mit einer Credits-Formel, und beides ist etwas anderes als ein Wochenkontingent, das am Mittwoch leer ist. Drei Sterne für kurze Auffüllzyklen mit bezifferter Menge, ein Stern für kurze Fenster ohne belastbare Zahl.

**Tokens und Preis pro Token.** Wie viele Token bekomme ich für mein Geld, und was kostet einer? Bei den Tarifen, die mit unbegrenzten Token werben, gibt es keine Menge zu vergleichen. Dort ist das Drosselungslimit das entscheidende Mass: die Grenze, ab der es langsamer wird statt abzuschalten. Ein unbegrenzter Tarif mit dreissig Sekunden zwischen zwei Anfragen ist für einen Agenten keine unbegrenzte Menge, sondern eine Warteschlange. Drei Sterne für eine öffentlich bezifferte, nachrechenbare Menge, ein Stern für „unbegrenzt“ ohne Zahl.

**Vibe-Check.** Was schreiben Leute, die den Tarif tatsächlich benutzt haben? Ich habe für jeden Anbieter in Reddit-Threads und Hacker-News-Diskussionen gesucht und die Funde jeweils an das Ende des Anbieter-Abschnitts gestellt. Drei Sterne für eine belegte, aktuelle Diskussion aus der Coding-Community, ein Stern für gar keine Belege. Das ist das weichste der drei Kriterien, und ich sage jeweils dazu, woher die Zweifel kommen.

Die Bewertung steht in der Übersicht am Ende des nächsten Abschnitts. Für die Tokenroute weiter unten gelten nur zwei der drei Kriterien, weil sie kein Kontingent hat.

## 4. Was ein zusätzliches Flat-Rate-Abo bringt

Die Annahme für den Vergleich ist einfach: Ich kaufe zusätzlich zu Claude Pro ein weiteres Abo und möchte dort noch einmal dasselbe Arbeitsvolumen erledigen, nur mit anderen Modellen. Dafür kommen etwa GLM, DeepSeek und Qwen infrage.

### Claude Code behalten, Modell austauschen

Das funktioniert, weil Arbeitsumgebung und Modell zwei getrennte Entscheidungen sind. Die Arbeitsumgebung wird auch Harness genannt: Sie organisiert den Agenten, seine Werkzeuge und den Ablauf der Arbeit.

Für meine Serie Agenten 2026 habe ich denselben Bewerbungs-Agenten in einem Dutzend Harnesses nachgebaut, darunter n8n, Kestra, Windmill, DBOS, CrewAI und das Microsoft Agent Framework. Den [Vergleich der drei grossen Plattformen](/blog/2026-10-29-bewerbungs-agent-vergleich/) und die [Übersicht über die acht Frameworks davor](/blog/ki-agenten-vergleich/) findest du in den früheren Beiträgen.

Bei mir bleibt Claude Code der Harness, weil ich darin schnell bin. Das Modell dahinter lässt sich wie ein Motor mit passendem Anschluss austauschen: Ich brauche einen Anthropic-kompatiblen API-Endpunkt, also eine passende Programmierschnittstelle, die Umgebungsvariable `ANTHROPIC_BASE_URL` und einen API-Schlüssel.

Der Anschluss passt, die Abstimmung muss ich trotzdem prüfen. Die Systemanweisungen von Claude Code sind für Claude geschrieben. Andere Modelle verstehen sie meistens, aber nicht immer gleich gut. Die Nacharbeit daraus steht in keiner Preistabelle.

Vier Anbieter kommen für ein zweites Abo infrage. Ich stelle sie einzeln vor, jeweils mit dem, was sie verkaufen, was sie kosten und was die Community darüber schreibt. Die Bewertung nach meinen drei Kriterien steht am Ende des Abschnitts in einer Tabelle.

### ElectronHub DevPass

[ElectronHub](https://www.electronhub.ai/pricing) verkauft mit dem DevPass Zugang ohne Tokenzähler. Statt einer Menge begrenzt der Tarif, wie viele Anfragen gleichzeitig und pro Minute laufen. Die Modellliste enthält [GLM-5.3](https://z.ai), [GLM-5.3-Flash](https://z.ai), [DeepSeek V4.1-Flash](https://www.deepseek.com), [MiMo V2.6-Flash](https://mimo.xiaomi.com), [MiniMax M2.7](https://www.minimax.io) und [Qwen3.8-27B](https://qwen.ai).

Lite kostet 10 Dollar im Monat und erlaubt zwei gleichzeitige Anfragen sowie acht pro Minute. Turbo kostet 40 Dollar, erlaubt fünf gleichzeitige Anfragen und zwanzig pro Minute, und sein Volllast-Budget ist laut Anbieter sechsmal so gross wie das von Lite. Schwere Modelle belegen zwei Slots pro Anfrage, auf Lite läuft also genau eine schwere Anfrage gleichzeitig.

Und jetzt der Teil, den ich beim ersten Lesen überlesen habe, weil er nicht auf der Preisseite steht. Er steht in der Dokumentation. Der Tarif hat einen Volllast-Vorbehalt, und der ist genau beschrieben. Jeder Plan hat ein Tagesbudget für volle Geschwindigkeit, das um 21 Uhr UTC zurückgesetzt wird, und darüber ein rollierendes Wochenbudget. Wer darüber kommt, wird nicht blockiert. Die Anfragen laufen weiter, aber mit weniger Parallelität und gedehntem Einlass, und die Dokumentation nennt die Zahl: bis zu dreissig Sekunden Abstand zwischen zwei Anfragen, wenn man weit über dem Budget liegt. Die Anfragerate fällt im langsamen Gang von acht auf drei pro Minute bei Lite und von zwanzig auf drei bei Turbo. Dazu kommt ein Modus für niedrige Interaktivität, der rund vierundzwanzig Stunden gilt, sobald das Nutzungsmuster weit über normaler interaktiver Arbeit liegt. Dann werden Anfragen hinter interaktiven Sitzungen eingereiht.

Rechne das einmal durch. Ein Agent, der für eine Aufgabe zwanzig Werkzeugaufrufe braucht, wartet bei dreissig Sekunden Abstand zehn Minuten nur auf den Einlass. Da ist der Tarif nicht mehr langsam, da ist er unbrauchbar. Und wer den Parallelitätspuffer oft reisst, ungefähr hundertmal an einem Nutzungstag, bekommt eine Einlasssperre von fünf Stunden und den Statuscode 403. Der Schlüssel bleibt gültig, neu erzeugen hebt die Sperre auf.

Auf der Preisseite steht dazu ein Satz: volle Geschwindigkeit bei normaler Nutzung, anhaltende Schwerlast läuft mit reduzierter Geschwindigkeit weiter, aber nie ein harter Stopp. Das ist freundlich formuliert und beschreibt denselben Sachverhalt. Wer den DevPass kauft, kauft keine Menge. Er kauft eine Priorität, und die gilt bis zu einer Grenze, die der Anbieter nicht beziffert.

Der DevPass unterstützt ausdrücklich Claude Code, ausserdem Codex CLI, Cursor, Cline, OpenCode, Windsurf und etwa zwanzig weitere Werkzeuge. Daneben gibt es normale ElectronHub-Abos mit wöchentlichen Credits von 0.25 bis 200 Dollar pro Woche. Sie werden sonntags um 21 Uhr UTC aufgefüllt. Ungenutztes Guthaben wandert in eine Restkasse, begrenzt auf 20 Prozent einer Woche. Beim verbrauchsabhängigen Angebot bekommst du für einen Dollar zwei Credits, die nie verfallen.

**Vibe-Check.** Die Stimmung ist skeptisch. Im [Thread in r/vibecoding](https://reddit.com/r/vibecoding/comments/1v8i2rn/dont_buy_electronhub_subscription/) fühlt sich ein Käufer nach einem Tag „scammed“, weil sein Konto gesperrt wurde. Der Antwortende aus dem Infrastruktur-Team räumt ein, dass „unlimited tokens“ nur keine Abrechnung pro Token heisst, und nennt die Zahl, die auf keiner Preisseite steht: Lite gibt 20 Millionen Token pro Tag in voller Geschwindigkeit. Dass dieselbe Firma im [SillyTavern-Thread](https://reddit.com/r/SillyTavernAI/comments/1rpjdaa/how_does_a_proxy_like_electron_hub_make_profit_is/) von rund 500'000 Dollar Verlust spricht, macht den Tarif zum Zeitgeschäft.

### Cerebras Code

[Cerebras Code](https://www.cerebras.ai/code) verkauft vor allem Geschwindigkeit: GLM-4.7 mit laut Anbieter über 1'000 Token pro Sekunde. Cerebras Code läuft laut Anbieter mit jedem Werkzeug, das einen API-Schlüssel akzeptiert, Cline, OpenCode und Crush sind ausdrücklich genannt.

Pro kostet 50 Dollar für 24 Millionen Token pro Tag, Max 200 Dollar für 120 Millionen. Max kostet damit gleich viel wie Claude Max 20x, verwendet aber ein Modell eine Generation hinter GLM-5.3, im Benchmark oben 69.4 gegen 95.4 Prozent, und eine Tagesgrenze statt eines Fünf-Stunden-Fensters. Die praktische Einschränkung: Beide Tarife sind derzeit ausverkauft.

**Vibe-Check.** Wenig Diskussion, und was es gibt, ist skeptisch. Der [Thread „Deceptive Limits“](https://reddit.com/r/LocalLLaMA/comments/1mfeazc/cerebras_pro_coder_deceptive_limits/) warnt, das beworbene Anfragenlimit sei in Wahrheit ein Tokenbudget gewesen, erreicht nach wenigen Stunden leichten Codens. Einzelne Stimmen verteidigen den Preis dennoch als gutes Geschäft. Die Zahlen sind von 2025 und überholt, das Muster nicht: Anfragen in der Werbung, Token in der FAQ.

### Nano-GPT VALUE

[Nano-GPT VALUE](https://nano-gpt.com) kostet 12 Dollar für 60 Millionen Input-Token pro Woche. Der Output auf den enthaltenen Modellen ist frei. Nicht enthalten sind Websuche, andere bezahlte Werkzeuge und die Wahl eines bestimmten Inferenzanbieters, also des Dienstes, der das Modell tatsächlich ausführt. Einzelne Varianten wie GLM 5.3 Uncensored fallen ebenfalls heraus.

Das heisst, du kaufst die Modellauswahl, kannst aber die Route zum ausführenden Anbieter nicht selbst bestimmen. Für einen Coding-Agenten beeinflusst genau diese Route die Geschwindigkeit.

**Vibe-Check.** Reich, aber gespalten. Der [Thread vom Oktober 2026](https://reddit.com/r/SillyTavernAI/comments/1x7jjb2/i_just_bought_a_nanogpt_sub_is_it_really_worse/) stellt genau meine Frage, und der Widerspruch ist die Antwort: Für die einen ist die Qualität identisch, weil dieselben Anbieter dahinterstecken, für die anderen ist das Routing „questionable“ und der Grund zu kündigen. Der [Betreiber-Thread](https://reddit.com/r/SillyTavernAI/comments/1wax4yx/why_doesnt_nanogpt_usage_show_the_provider_used/) erklärt, warum der ausführende Anbieter nicht sichtbar ist: geheime Rabatte.

### Z.ai GLM Coding Plan

Z.ai kostet 18, 80 oder 168 Dollar im Monat, und inzwischen ist dokumentiert, wie Credits in Tokenverbrauch übersetzt werden. Zwei Monate habe ich damit gearbeitet, ohne diese Formel zu lesen, und meine Einschätzung des Lite-Plans war zu optimistisch.

Input, gecachter Input und Output werden gewichtet, für GLM-5.3 mit 6.9, 1.7 und 24. Ein Cache-Treffer zählt damit vierzehnmal weniger als neue Ausgabe, und daran hängt, wie weit das Kontingent reicht.

Z.ai gibt für Lite 208 bis 420 Millionen Token im Monat an, gerechnet mit einem Output-Anteil unter einem Prozent. Bei mir liegt der Output wegen des Denkmodus bei neun Prozent, damit reicht Lite für 109 bis 219 Millionen und deckt nur die Hälfte bis zwei Drittel meines Vergleichsmonats. Eine [Messung auf dem Max-Plan](https://news.ycombinator.com/item?id=49300713) bestätigt die Richtung mit 97.9 Prozent Cache-Treffern.

**Vibe-Check.** r/ZaiGLM ist das aktivste Anbieter-Subreddit, und die Stimmung spaltet sich am Tarif. Kunden zum heutigen Preis klagen über die Limits – [„The daily and weekly limits are ***way*** too small“](https://reddit.com/r/ZaiGLM/comments/1uqmy76/stay_away_from_glm_coding_lite_plan/) – und über das Tempo. Mehrere Langzeitnutzer mit den [alten Preisen](https://reddit.com/r/ZaiGLM/comments/1w0qlyh/is_the_coding_plan_that_bad/) reissen die Fünf-Stunden-Grenze dagegen selten. Das deckt sich mit meiner Rechnung oben.

### Wie die Tarife abschneiden

| Route | Preis pro Monat | Verfügbarkeit | Deckt 352 Mio. Token? | Kontingentierung | Token und Preis | Vibe-Check |
|---|---|---|---|---|---|---|
| ElectronHub DevPass Lite | 10 USD | offen, gedrosselt | unbegrenzt, gedrosselt | ★★ | ★ | ★★ |
| Nano-GPT VALUE | 12 USD | offen | 81 Prozent | ★★ | ★★ | ★★ |
| Z.ai Lite, GLM-5.3-Flash | 18 USD | offen | 93 Prozent | ★★ | ★★ | ★★★ |
| ElectronHub DevPass Turbo | 40 USD | offen, gedrosselt | unbegrenzt, gedrosselt | ★★★ | ★★ | ★★ |
| Cerebras Code Pro | 50 USD | ausverkauft | ja, mit GLM-4.7 | ★★★ | ★★★ | ★★ |
| Z.ai Pro, GLM-5.3 | 80 USD | offen | ja | ★★ | ★★ | ★★★ |
| Z.ai Max, GLM-5.3 | 168 USD | offen | ja | ★★★ | ★★ | ★★★ |
| Cerebras Code Max | 200 USD | ausverkauft | ja | ★★★ | ★★★ | ★★ |

Das sind Mengenvergleiche unter den jeweiligen Grenzen, und die Sterne sind meine Bewertung nach den drei Kriterien aus Abschnitt 3. Ein „ja“ hebt weder ein Tageslimit noch ein Fünf-Stunden-Fenster auf.

Die Spalte Verfügbarkeit beantwortet eine Frage, die keine der anderen beantwortet: Kann ich den Tarif heute überhaupt abschliessen, und bleibt er im Betrieb erreichbar? Bei Cerebras heisst die Antwort nein, beide Pläne sind ausverkauft und die Warteliste hat keinen Termin. Bei ElectronHub heisst sie ja, mit der Einschränkung, die im Vibe-Check steht: Wer das Volllast-Budget reisst, landet in einer gedehnten Warteschlange und bei häufigem Reissen in einer Sperre. Die übrigen Anbieter nehmen jeden auf.

Wie ich bei den Sternen vergebe, an zwei Beispielen. Cerebras bekommt drei Sterne bei der Kontingentierung, weil das Tagesbudget beziffert ist und jeden Tag neu beginnt, und zwei beim Vibe-Check, weil der einzige aussagekräftige Thread aus dem August 2025 stammt. ElectronHub bekommt einen Stern beim Tokenpreis, weil auf der Preisseite keine Menge steht und die Drossel bei dreissig Sekunden Abstand zwischen zwei Anfragen liegt. Bei der Kontingentierung reicht es für zwei Sterne, weil täglich aufgefüllt wird, die Menge aber nicht im Angebot steht. Der Vibe-Check bleibt bei zwei Sternen, weil die Diskussion reich ist, überwiegend ablehnend ausfällt und teils ein anderes Produkt desselben Anbieters betrifft.

Was die Tabelle nicht sagt, ist die zweite Hälfte der Verfügbarkeit: ob der Anbieter in einem Jahr noch dieselben Konditionen hat. Das steht weiter unten.

Für 352 Millionen Token mit GLM-5.3 brauche ich in meinem Mix den Pro-Plan für 80 Dollar. Lite für 18 Dollar kommt mit GLM-5.3-Flash auf 93 Prozent und damit nahe heran, deckt das Volumen aber nicht vollständig. Mein bisheriger Vergleich mit dem blossen Einstiegspreis war deshalb zu optimistisch.

Beim DevPass weist die Tabelle unbegrenzt aus, und genau da ist Vorsicht angebracht. Die Grenze steckt nicht in der Menge, sie steckt in der Drossel. Mit einem einzelnen Agenten kann Lite für 10 Dollar passen. Mit meinen drei gleichzeitig arbeitenden Fenstern ist Turbo für 40 Dollar der relevante Vergleich. Bei schweren Modellen muss ich zusätzlich die doppelte Slotbelegung beachten.

## 5. Was dasselbe per Token kostet

Beim zweiten Weg kaufe ich kein zusätzliches Abo. Ich bezahle genau die Token, die ich verbrauche. Das vermeidet die Kontingentwand, gibt mir aber auch keine feste Obergrenze für die Rechnung.

### Die Preise pro Million Token

Alle folgenden Werte sind US-Dollar pro Million Token, jeweils Input und Output, Stand November 2026.

| Modell | Listenpreis | Günstigste Route | Route in der EU |
|---|---|---|---|
| [GLM-5.3](https://z.ai) | 1.40 / 4.40 | [DeepInfra](https://deepinfra.com) 0.56 / 2.50 | [Sference](https://sference.com) 1.20 / 4.20 |
| [GLM-5.3-Flash](https://z.ai) | 0.15 / 0.50 | [Pareto](https://paretoinference.com) 0.06 / 0.20 | [TensorX](https://tensorx.ai) 0.20 / 0.50 |
| [DeepSeek V4.1-Flash](https://www.deepseek.com) | 0.15 / 0.60, Nebenzeit | [Pareto](https://paretoinference.com) 0.105 / 0.42 | [Sference](https://sference.com) 0.50 / 1.50 |
| [Kimi K3](https://www.moonshot.ai) | 3.00 / 15.00 | [Nano-GPT](https://nano-gpt.com) 0.45 / 9.60 | [Sference](https://sference.com) 3.00 / 15.00 |
| [Kimi K3.1 Pro](https://www.moonshot.ai) | 2.00 / 10.00 | [DeepInfra](https://deepinfra.com) 1.90 / 9.50 | [Nebius](https://nebius.com) 2.00 / 10.00 |
| [Qwen3.8-Flash](https://qwen.ai) | 0.15 / 0.47 | [Nano-GPT](https://nano-gpt.com) 0.14 / 0.42 | keine |

Kimi K3.1 Pro ist vier Tage alt. [Moonshot](https://www.moonshot.ai) hat die Gewichte am 4. November veröffentlicht, und das Modell ist billiger als sein Vorgänger: 2.00 / 10.00 gegen 3.00 / 15.00. Ein neueres Modell, das weniger kostet als das alte, ist bei offenen Gewichten inzwischen der Normalfall, und genau das macht diese Tabelle so kurzlebig.

Zur Einordnung, was Moonshot selbst veröffentlicht: 69.4 Punkte auf Mercor APEX-Agents. Mercor listet das Modell mit 65.5 Prozent und damit auf Platz zwei hinter DeepSeek V4.1-Flash. Unabhängige Messungen auf den offenen Gewichten gab es zu diesem Zeitpunkt noch nicht. Die verbreitete Behauptung, K3.1 Pro führe die Open-Weight-Ranglisten an, lässt sich mit diesen Zahlen nicht belegen.

In der Tabelle fehlen die grossen westlichen Hoster. Ich habe sie mitgeprüft, und sie liegen fast durchweg auf Listenpreis. GLM-5.3 kostet bei [Together AI](https://www.together.ai), [Fireworks](https://fireworks.ai) und [SiliconFlow](https://siliconflow.com) 1.40 / 4.40, bei DeepSeek V4.1-Flash sind es 0.30 / 1.20. Die einzige Ausnahme ist Kimi K3, das SiliconFlow mit 2.70 / 13.50 unter dem Hersteller anbietet. Der Rabatt in dieser Liste kommt damit nicht von den grossen Namen, sondern von [Pareto](https://paretoinference.com), [Nano-GPT](https://nano-gpt.com) und den Promo-Routen von [Relace](https://relace.ai) und [Wafer](https://wafer.ai).

[Groq](https://groq.com) ist ein eigener Fall. Die LPU-Hardware hostet kein GLM, kein Kimi und kein DeepSeek, von meinen Modellen bleibt Qwen3.8-27B. Das kostet dort 0.80 / 4.00 bei rund 450 Token pro Sekunde, also ein Vielfaches von DeepInfra und Cerebras. Wer Geschwindigkeit für genau dieses Modell braucht, findet sie dort. Für alles andere ist es die teuerste Route im Vergleich.

### Ein Schlüssel, alle Anbieter

Der eigentliche Grund, warum ich überhaupt über OpenRouter gehe: Ich kaufe dort nicht bei einem Anbieter, sondern bei allen, die dasselbe Modell hosten. Ein Schlüssel, eine Rechnung, und ich kann pro Anfrage entscheiden, ob ich den günstigsten, den schnellsten oder einen bestimmten Anbieter will. Wie viele das sind, hat mich selbst überrascht:

| Modell | Anbieter bei OpenRouter | günstigster | teuerster |
|---|---|---|---|
| GLM-5.3 | 47 | Wafer 0.07 | Alibaba 2.80 |
| GLM-5.3-Flash | 41 | Relace 0.04 | Parasail 0.19 |
| DeepSeek V4.1-Flash | 37 | Relace 0.01 | Fireworks 0.45 |
| Kimi K3 | 28 | Wafer 0.15 | Fireworks 4.50 |
| Qwen3.8-27B | 25 | Darkbloom 0.04 | Cerebras 0.99 |
| Kimi K3.1 Pro | 23 | Relace 0.26 | Moonshot 4.00 |
| DeepSeek V4-Pro | 13 | Relace 0.90 | Azure 1.91 |
| MiMo V2.6-Flash | 7 | Darkbloom 0.10 | Venice 0.17 |
| GLM-4.7 | 6 | DeepInfra 0.32 | Mancer 0.70 |
| Qwen3.8-Flash | 2 | Alibaba 0.15 | Alibaba 0.15 |
| Qwen3.8-Max | 2 | Alibaba 2.00 | Alibaba 2.00 |

Alle Werte sind Input-Preise in Dollar pro Million Token, Stand 10. November 2026, direkt aus der OpenRouter-API. Bei GLM-5.3 sind das 47 Anbieter für dasselbe Modell, und der günstigste kostet ein Vierzigstel des teuersten. Ohne Router müsste ich für jede dieser Routen einen eigenen Vertrag abschliessen. Mit Router ist es eine Zeile in der Anfrage.

Genau deshalb steht in meiner Monatstabelle unten jeder Anbieter mit allen Modellen, die er führt, und nicht nur mit dem einen, das ich gerade vergleiche.

Über OpenRouter kommen rund 5 Prozent Aufschlag auf die Credits dazu. Bei kleinen Beträgen gilt eine Mindestgebühr von 0.80 Dollar. Für diesen Aufschlag gibt es inzwischen Alternativen. [OrcaRouter](https://orcarouter.ai) verlangt seit Mai 2026 keinen Aufschlag auf den Tokenpreis und finanziert sich über Team-Abos ab 499 Dollar im Monat, [Requesty](https://requesty.ai/pricing) nimmt 5 Prozent und bietet dafür EU-Datenresidenz und ein kostenloses Kontingent von 200 Anfragen pro Tag. Der Aufschlag verschwindet damit nicht, er wandert an eine andere Stelle. Bei OrcaRouter zahle ich ihn erst im Team-Tarif, und der Anbieter schreibt selbst, dass sich ein Wechsel unter 50 Dollar Monatsverbrauch nicht lohnt.

Bei [OpenRouter](https://openrouter.ai/docs/features/provider-routing) entscheidet eine Einstellung über den Durchsatz: ob ich den ausführenden Anbieter festnagle oder OpenRouter wählen lasse. Für einen Stapellauf von 2'222 Aufgaben durch dasselbe Modell:

| Einstellung | Antwortzeit pro Aufruf | Durchsatz |
|---|---|---|
| Anbieter festgelegt ([Relace](https://relace.ai), [DeepInfra](https://deepinfra.com)) | 92 s, bis ans Token-Limit | 106 Aufgaben pro Minute |
| OpenRouter wählt selbst | 22 s | 1'525 Aufgaben pro Minute |

Der Unterschied ist der Faktor vierzehn, und er kommt nicht von der Parallelität. Mit Festlegung brachten 24 statt 8 gleichzeitige Arbeiter nichts: 20.3 gegen 21.6 Haufen pro Minute, weil der eine Anbieter drosselte. Ohne Festlegung verteilt OpenRouter die Anfragen selbst und skaliert: 32 Arbeiter, 12 Minuten statt 70.

Wer das systematisch vergleichen will, findet bei [benchlm.ai](https://benchlm.ai/openrouter-alternatives) einen kostenpflichtigen Audit, der OpenRouter, DeepInfra, Together, Requesty, Fireworks, Groq und Cerebras mit demselben Arbeitsvolumen gemessen hat, bewertet nach Rechnungskosten, Latenz, Abdeckung und Zuverlässigkeit. Der Stand ist September 2026, die Zahlen sind also nicht mehr frisch. Es ist trotzdem die einzige mir bekannte Messung, die Router und Direktanbieter auf dieselbe Skala stellt.

**Vibe-Check.** Zu DeepSeek ist die Diskussion gross und unruhig. Im August 2026 hat DeepSeek die API-Preise massiv erhöht, laut dem [meistgewählten Thread dazu](https://reddit.com/r/DeepSeek/comments/1vn81do/deepseek_just_massively_increased_their_api/) um bis zu 1'114 Prozent bei den Cache-Treffern, und die Reaktionen reichten von „1500% price hike at peak hours“ bis zu Threads über die Gründe. Im September 2026 kam eine Preissenkung für Flash zurück. Die Zahlen in meiner Tabelle sind eine Momentaufnahme vom November 2026, und diese Preishistorie sagt mir, dass sie das nicht lange bleiben. Auf der Habenseite stehen konkrete Nutzungsberichte: „2.1B tokens in a single day for $16“, schreibt jemand im [Thread vom Oktober 2026](https://reddit.com/r/DeepSeek/comments/1xe9mw9/21b_tokens_in_a_single_day_for_16_v41_flash_1017/). Für mein Volumen ist das die relevante Grössenordnung.

### Derselbe Monat per Token

Jetzt wird aus dem Preis pro Million eine Monatsrechnung, und zwar für jede Route einzeln. Mein Vergleichsvolumen sind 352 Millionen Token, also 320 Millionen Input und 32 Millionen Output.

<details class="anb">
<summary><a href="https://www.darkbloom.dev">Darkbloom</a> <span class="meta">3 Modelle · ab 10 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>fp4</em></td><td>0.07 / 0.18</td><td>10 USD</td><td>27 USD</td></tr><tr><td>MiMo V2.6-Flash <em>fp4</em></td><td>0.10 / 0.28</td><td>26 USD</td><td>41 USD</td></tr><tr><td>Qwen3.8-27B <em>fp4</em></td><td>0.04 / 1.50</td><td>54 USD</td><td>59 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://paretoinference.com">Pareto</a> <span class="meta">3 Modelle · ab 11 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>MiMo V2.6-Flash</td><td>0.13 / 0.25</td><td>11 USD</td><td>48 USD</td></tr><tr><td>GLM-5.3-Flash</td><td>0.06 / 0.20</td><td>11 USD</td><td>26 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>off-peak</em></td><td>0.10 / 0.42</td><td>16 USD</td><td>47 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.primeintellect.ai">PrimeIntellect</a> <span class="meta">4 Modelle · ab 12 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>unknown</em></td><td>0.05 / 0.25</td><td>12 USD</td><td>25 USD</td></tr><tr><td>Qwen3.8-27B <em>fp8</em></td><td>0.05 / 0.33</td><td>13 USD</td><td>25 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>unknown</em></td><td>0.04 / 1.20</td><td>39 USD</td><td>51 USD</td></tr><tr><td>GLM-5.3 <em>unknown</em></td><td>0.40 / 2.46</td><td>108 USD</td><td>207 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://deepinfra.com">DeepInfra</a> <span class="meta">9 Modelle · ab 12 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>MiMo V2.6-Flash <em>fp8</em></td><td>0.14 / 0.28</td><td>12 USD</td><td>54 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>fp8</em></td><td>0.11 / 0.34</td><td>14 USD</td><td>47 USD</td></tr><tr><td>GLM-5.3-Flash <em>fp4</em></td><td>0.15 / 0.50</td><td>28 USD</td><td>64 USD</td></tr><tr><td>GLM-4.7 <em>fp4</em></td><td>0.32 / 1.40</td><td>69 USD</td><td>147 USD</td></tr><tr><td>Qwen3.8-27B <em>bf16</em></td><td>0.15 / 1.88</td><td>74 USD</td><td>108 USD</td></tr><tr><td>GLM-5.3 <em>fp4</em></td><td>0.56 / 2.50</td><td>127 USD</td><td>260 USD</td></tr><tr><td>DeepSeek V4-Pro <em>fp8</em></td><td>1.30 / 2.60</td><td>134 USD</td><td>499 USD</td></tr><tr><td>Kimi K3.1 Pro <em>bf16</em></td><td>1.90 / 9.50</td><td>392 USD</td><td>912 USD</td></tr><tr><td>Kimi K3 <em>mxfp4</em></td><td>2.85 / 14.25</td><td>588 USD</td><td>1368 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.relace.ai">Relace</a> <span class="meta">6 Modelle · ab 12 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>fp4</em></td><td>0.04 / 0.08</td><td>12 USD</td><td>15 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>fp4</em></td><td>0.01 / 0.50</td><td>18 USD</td><td>18 USD</td></tr><tr><td>DeepSeek V4-Pro <em>fp4</em></td><td>0.90 / 1.50</td><td>138 USD</td><td>336 USD</td></tr><tr><td>GLM-5.3 <em>fp4</em></td><td>0.07 / 4.38</td><td>163 USD</td><td>163 USD</td></tr><tr><td>Kimi K3.1 Pro <em>fp4</em></td><td>0.26 / 8.38</td><td>333 USD</td><td>350 USD</td></tr><tr><td>Kimi K3 <em>fp4</em></td><td>0.18 / 9.34</td><td>356 USD</td><td>357 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://novita.ai">Novita</a> <span class="meta">6 Modelle · ab 15 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>fp8</em></td><td>0.08 / 0.28</td><td>15 USD</td><td>36 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>fp8</em></td><td>0.20 / 0.78</td><td>29 USD</td><td>87 USD</td></tr><tr><td>GLM-5.3 <em>fp8</em></td><td>0.63 / 1.98</td><td>109 USD</td><td>265 USD</td></tr><tr><td>GLM-4.7 <em>fp8</em></td><td>0.60 / 2.20</td><td>113 USD</td><td>262 USD</td></tr><tr><td>Qwen3.8-27B <em>unknown</em></td><td>0.42 / 3.00</td><td>129 USD</td><td>230 USD</td></tr><tr><td>DeepSeek V4-Pro <em>fp8</em></td><td>1.60 / 3.20</td><td>169 USD</td><td>614 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.alibabacloud.com/en/product/modelstudio">Alibaba</a> <span class="meta">8 Modelle · ab 18 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>DeepSeek V4.1-Flash <em>unknown</em></td><td>0.10 / 0.42</td><td>18 USD</td><td>47 USD</td></tr><tr><td>Qwen3.8-Flash <em>unknown</em></td><td>0.15 / 0.47</td><td>22 USD</td><td>63 USD</td></tr><tr><td>Qwen3.8-27B <em>unknown</em></td><td>0.42 / 2.55</td><td>114 USD</td><td>218 USD</td></tr><tr><td>DeepSeek V4-Pro <em>fp8</em></td><td>1.42 / 2.83</td><td>149 USD</td><td>544 USD</td></tr><tr><td>GLM-5.3 <em>unknown</em></td><td>1.19 / 3.74</td><td>211 USD</td><td>500 USD</td></tr><tr><td>Qwen3.8-Max <em>unknown</em></td><td>2.00 / 6.00</td><td>300 USD</td><td>832 USD</td></tr><tr><td>Kimi K3.1 Pro <em>unknown</em></td><td>2.30 / 11.50</td><td>475 USD</td><td>1104 USD</td></tr><tr><td>Kimi K3 <em>unknown</em></td><td>3.45 / 17.25</td><td>712 USD</td><td>1656 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.wafer.ai">Wafer</a> <span class="meta">6 Modelle · ab 19 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>nvfp4</em></td><td>0.04 / 0.18</td><td>19 USD</td><td>19 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>mxfp4</em></td><td>0.05 / 0.57</td><td>24 USD</td><td>34 USD</td></tr><tr><td>GLM-5.3 <em>fp4</em></td><td>0.07 / 1.40</td><td>67 USD</td><td>67 USD</td></tr><tr><td>Qwen3.8-27B <em>fp8</em></td><td>0.06 / 2.30</td><td>92 USD</td><td>93 USD</td></tr><tr><td>Kimi K3 <em>mxfp4</em></td><td>0.28 / 9.60</td><td>351 USD</td><td>396 USD</td></tr><tr><td>Kimi K3.1 Pro <em>mxfp4</em></td><td>1.80 / 9.00</td><td>372 USD</td><td>864 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.openinference.ai">OpenInference</a> <span class="meta">2 Modelle · ab 20 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>fp4</em></td><td>0.06 / 0.30</td><td>20 USD</td><td>29 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>fp4</em></td><td>0.05 / 0.80</td><td>28 USD</td><td>42 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.deepseek.com">DeepSeek</a> <span class="meta">2 Modelle · ab 23 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>DeepSeek V4.1-Flash <em>off-peak</em></td><td>0.15 / 0.60</td><td>23 USD</td><td>67 USD</td></tr><tr><td>DeepSeek V4-Pro <em>off-peak</em></td><td>0.66 / 1.98</td><td>81 USD</td><td>275 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://siliconflow.com">SiliconFlow</a> <span class="meta">4 Modelle · ab 28 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>fp8</em></td><td>0.15 / 0.50</td><td>28 USD</td><td>64 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>fp8</em></td><td>0.30 / 1.20</td><td>45 USD</td><td>134 USD</td></tr><tr><td>DeepSeek V4-Pro <em>fp8</em></td><td>1.00 / 1.50</td><td>105 USD</td><td>368 USD</td></tr><tr><td>GLM-5.3 <em>fp8</em></td><td>0.70 / 2.20</td><td>121 USD</td><td>294 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://fireworks.ai">Fireworks</a> <span class="meta">5 Modelle · ab 28 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>unknown</em></td><td>0.15 / 0.50</td><td>28 USD</td><td>64 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>unknown</em></td><td>0.21 / 0.84</td><td>32 USD</td><td>94 USD</td></tr><tr><td>GLM-5.3 <em>unknown</em></td><td>0.98 / 3.08</td><td>170 USD</td><td>412 USD</td></tr><tr><td>Kimi K3.1 Pro <em>unknown</em></td><td>2.00 / 10.00</td><td>413 USD</td><td>960 USD</td></tr><tr><td>Kimi K3 <em>unknown</em></td><td>3.00 / 15.00</td><td>619 USD</td><td>1440 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://nebius.com">Nebius</a> <span class="meta">4 Modelle · ab 28 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>fp4</em></td><td>0.15 / 0.50</td><td>28 USD</td><td>64 USD</td></tr><tr><td>Qwen3.8-27B <em>fp4</em></td><td>0.45 / 3.00</td><td>134 USD</td><td>240 USD</td></tr><tr><td>GLM-5.3 <em>fp4</em></td><td>1.40 / 4.40</td><td>242 USD</td><td>589 USD</td></tr><tr><td>Kimi K3.1 Pro <em>fp4</em></td><td>2.00 / 10.00</td><td>413 USD</td><td>960 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.together.ai">Together AI</a> <span class="meta">5 Modelle · ab 28 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>unknown</em></td><td>0.15 / 0.50</td><td>28 USD</td><td>64 USD</td></tr><tr><td>DeepSeek V4.1-Flash <em>unknown</em></td><td>0.30 / 1.20</td><td>45 USD</td><td>134 USD</td></tr><tr><td>GLM-5.3 <em>unknown</em></td><td>1.40 / 4.40</td><td>242 USD</td><td>589 USD</td></tr><tr><td>Kimi K3.1 Pro <em>unknown</em></td><td>2.00 / 10.00</td><td>413 USD</td><td>960 USD</td></tr><tr><td>Kimi K3 <em>unknown</em></td><td>3.00 / 15.00</td><td>619 USD</td><td>1440 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://z.ai">Z.ai</a> <span class="meta">3 Modelle · ab 28 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>fp8</em></td><td>0.15 / 0.50</td><td>28 USD</td><td>64 USD</td></tr><tr><td>GLM-4.7 <em>fp4</em></td><td>0.60 / 2.20</td><td>113 USD</td><td>262 USD</td></tr><tr><td>GLM-5.3 <em>fp8</em></td><td>1.40 / 4.40</td><td>242 USD</td><td>589 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://tensorx.ai">TensorX</a> <span class="meta">5 Modelle · ab 34 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>EU</em></td><td>0.20 / 0.50</td><td>34 USD</td><td>80 USD</td></tr><tr><td>GLM-5.3 <em>EU</em></td><td>1.75 / 4.50</td><td>306 USD</td><td>704 USD</td></tr><tr><td>Qwen3.8-Max <em>EU</em></td><td>2.50 / 6.00</td><td>424 USD</td><td>992 USD</td></tr><tr><td>Kimi K3 <em>EU</em></td><td>3.00 / 15.00</td><td>756 USD</td><td>1440 USD</td></tr><tr><td>Kimi K3.1 Pro <em>EU</em></td><td>3.00 / 15.00</td><td>756 USD</td><td>1440 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://nano-gpt.com">Nano-GPT</a> <span class="meta">6 Modelle · ab 42 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash</td><td>0.10 / 0.30</td><td>wie Input</td><td>42 USD</td></tr><tr><td>Qwen3.8-Flash</td><td>0.14 / 0.42</td><td>wie Input</td><td>58 USD</td></tr><tr><td>GLM-5.3</td><td>0.60 / 1.10</td><td>wie Input</td><td>227 USD</td></tr><tr><td>Kimi K3</td><td>0.45 / 9.60</td><td>wie Input</td><td>451 USD</td></tr><tr><td>Qwen3.8-Max</td><td>2.00 / 6.00</td><td>wie Input</td><td>832 USD</td></tr><tr><td>Kimi K3.1 Pro</td><td>2.00 / 10.00</td><td>wie Input</td><td>960 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://chutes.ai">Chutes</a> <span class="meta">2 Modelle · ab 42 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>Qwen3.8-27B <em>fp8</em></td><td>0.04 / 1.25</td><td>42 USD</td><td>52 USD</td></tr><tr><td>Kimi K3 <em>mxfp4</em></td><td>1.85 / 9.50</td><td>390 USD</td><td>896 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://sference.com">Sference</a> <span class="meta">3 Modelle · ab 44 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>GLM-5.3-Flash <em>EU</em></td><td>0.20 / 0.60</td><td>44 USD</td><td>83 USD</td></tr><tr><td>GLM-5.3 <em>EU</em></td><td>1.20 / 4.20</td><td>233 USD</td><td>518 USD</td></tr><tr><td>Kimi K3 <em>EU</em></td><td>3.00 / 15.00</td><td>665 USD</td><td>1440 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.cerebras.ai">Cerebras</a> <span class="meta">1 Modell · ab 364 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>Qwen3.8-27B <em>fp16</em></td><td>0.99 / 1.49</td><td>364 USD</td><td>364 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://www.moonshot.ai">Moonshot</a> <span class="meta">2 Modelle · ab 413 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>Kimi K3.1 Pro <em>mxfp4</em></td><td>2.00 / 10.00</td><td>413 USD</td><td>960 USD</td></tr><tr><td>Kimi K3 <em>unknown</em></td><td>3.00 / 15.00</td><td>619 USD</td><td>1440 USD</td></tr></tbody>
</table>
</details>
<details class="anb">
<summary><a href="https://paretoalphainference.com">Pareto Alpha</a> <span class="meta">1 Modell · ab 444 USD</span></summary>
<table>
<thead><tr><th>Modell</th><th>USD / Mio. In / Out</th><th>352 Mio. mit Cache</th><th>352 Mio. ohne Cache</th></tr></thead>
<tbody><tr><td>Kimi K3 <em>unknown</em></td><td>1.00 / 11.25</td><td>444 USD</td><td>680 USD</td></tr></tbody>
</table>
</details>



Der tiefere Wert verwendet 95 Prozent Cache-Treffer, der höhere keinen Cache. Der Cache-Preis liegt je nach Anbieter zwischen einem Zehntel und einem Fünftel des Input-Preises, bei DeepSeek sogar bei einem Fünfzigstel. Bei Nano-GPT rechne ich ohne Cache-Rabatt, weil Cache-Treffer dort voll gegen das Wochenkontingent zählen, wie der Vibe-Check oben zeigt.

Bei Kimi K3 siehst du zudem, warum der Input-Preis allein wenig hilft: 3 Dollar Input stehen 15 Dollar Output gegenüber. Über die Anbieter hinweg reicht der Output-Preis von 9.60 bis 17.25 Dollar, während der Input zwischen 0.45 und 3.45 schwankt. Bei Aufgaben mit viel Ausgabe entscheidet dieser Teil der Rechnung. Der Nachfolger K3.1 Pro landet mit 413 bis 960 Dollar deutlich darunter, obwohl er neuer ist.

Lustigerweise liegt Pay per Token damit nicht automatisch über einem Abo. Der Monat mit 352 Millionen Token kostet beim DevPass Lite 10 Dollar, bei Pareto mit GLM-5.3-Flash 11 bis 26 Dollar und auf meinem heutigen Weg über OpenRouter mit DeepSeek 24 bis 71 Dollar. Beim GLM-5.3-Listenpreis sind es 248 bis 589 Dollar.

Auf das Volumen umgelegt sind das 2.8 Cent pro Million Token beim DevPass, 3.1 bis 7.3 Cent bei Pareto mit GLM-5.3-Flash, 6.4 bis 19 Cent bei DeepSeek und 23 Cent beim GLM-Pro-Plan.

Mit gehaltenem Cache liegt die preiswerte Tokenroute fast gleichauf mit dem 10-Dollar-Abo. Ohne Cache kostet sie das Zweieinhalbfache. Über die gesamte Spanne vom 10-Dollar-Abo bis Kimi K3 ohne Cache liegt der Faktor 144. Gemeint ist dieselbe Tokenmenge, nicht nachgewiesen dieselbe Qualität des fertigen Codes.

## 6. Wenn ich 20 bis 40 USD zusätzlich ausgebe

Wenn ausschliesslich die erwarteten Kosten zählen, würde ich für meinen normalen Vergleichsmonat zuerst **GLM-5.3-Flash bei Pareto pro Token** prüfen. Die Rechnung liegt bei 11 bis 26 Dollar für 352 Millionen Token. Mit gehaltenem Cache passt das in ein Zusatzbudget von 20 Dollar, ohne Cache brauche ich mehr.

Ich würde die 20 Dollar deshalb nicht blind in ein weiteres kleines Kontingent-Abo stecken. Nano-GPT für 12 Dollar deckt in der Rechnung 81 Prozent, Z.ai Lite mit Flash für 18 Dollar 93 Prozent. Beide können ergänzen, keines ersetzt unter diesen Annahmen das volle Vergleichsvolumen.

Bei **40 Dollar** würde ich den **ElectronHub DevPass Turbo** prüfen, und zwar weniger wegen der Menge als wegen der Parallelität. Pareto kostet für denselben Monat 11 bis 26 Dollar und bleibt damit die günstigere Route. Turbo kauft mir für 40 Dollar eine bekannte Monatsrechnung ohne Tokenzähler und dazu fünf gleichzeitige Anfragen. Der Vorbehalt steht weiter unten: Sobald ich über das Volllast-Budget komme, wird der Einlass gedehnt, und aus einer bekannten Rechnung wird eine bekannte Rechnung mit unbekannter Geschwindigkeit.

Für einen einzelnen, sequenziell arbeitenden Agenten reicht möglicherweise schon DevPass Lite für 10 Dollar. Ich muss mein Zusatzbudget nicht ausgeben, nur weil es da ist. Für meine drei Fenster wäre es aber unehrlich, mit zwei parallelen Anfragen zu rechnen. Turbo erlaubt fünf, wobei schwere Modelle jeweils zwei Slots belegen und auch dort die Parallelität begrenzen können.

Meine Kostenentscheidung sieht damit so aus:

- **Mein Vergleichsvolumen und stabiler Cache:** Pareto mit GLM-5.3-Flash für 11 bis 26 Dollar. DeepSeek liegt mit gehaltenem Cache bei 23 Dollar, über OpenRouter entsprechend höher.
- **Feste Monatsrechnung und mehr Parallelität:** DevPass Turbo für 40 Dollar, sofern die Drossel im Volllastfall zu meinen Agenten passt.
- **Ein Agent und wenig Parallelität:** DevPass Lite für 10 Dollar.

Die Rechnung hat meine bisherige Sicht verändert. Ich habe vor allem auf den Preis pro Million Token geschaut. Dabei verkauft der DevPass gar keine Tokenmenge, während mein GLM-Lite-Abo weniger von meinem Arbeitsmix abdeckt, als die Beispieltabellen vermuten lassen.

Die 38 Dollar für mein heutiges Setup sind nicht falsch ausgegeben. Sie kaufen mir nur weniger zusätzliche Kapazität, als ich zunächst dachte. Noch ein kleines Abo löst das Problem nicht automatisch.

## 7. Was sonst noch zählt

Die Kostenempfehlung gilt nur, wenn die Route schnell genug ist, die Modelle brauchbare Arbeit liefern und ich den Anbieter einsetzen darf. Genau hier kann sich die Reihenfolge wieder ändern.

### Geschwindigkeit: unbegrenzt hilft bei langsamer Ausgabe wenig

Mein Mindestwert für ein Backend, also den ausführenden Dienst hinter Claude Code, liegt bei 50 Token pro Sekunde. Darunter verbringe ich zu viel Zeit mit Zuschauen.

Pareto Inference veröffentlicht Live-Messwerte. Beim Stand von heute Morgen liefert GLM-5.3-Flash dort 59 Token pro Sekunde und DeepSeek V4.1-Flash 138. Cerebras nennt über 1'000 Token pro Sekunde. Diese Unterschiede können für meinen Arbeitstag mehr ausmachen als der Tokenpreis.

Die Community-Messung für Z.ai fällt dagegen unter meine Grenze: Ein Nutzer misst für GLM-5.3 etwa 40 Token pro Sekunde und für Flash 30. Den Denkmodus beschreibt er so, dass er bei einem Drittel bis einem Zehntel der Geschwindigkeit doppelt so viel Arbeit liefert. Das passt zum höheren Output-Anteil in meiner Rechnung.

Ich hatte die Modelle untereinander als ungefähr gleich schnell eingeordnet und die Unterschiede vor allem den Anbietern zugeschrieben. Das ist als pauschale Aussage zu grob. Modell, Denkmodus und Route beeinflussen gemeinsam, wie lange ich warte. Für den gemessenen Z.ai-Zugang bleibt die praktische Konsequenz: Meine Grenze von 50 Token pro Sekunde wird nicht erreicht.

Eine Gegenmessung in einem anderen Thread kommt auf über 75 Token pro Sekunde mit Kimi K3. Die Leitung ist also nicht überall gleich eng.

Bei einem Angebot ohne Tokenzähler rückt der Durchsatz in den Mittelpunkt. Ein unbegrenzter Wasseranschluss hilft wenig, wenn aus dem Hahn nur ein dünner Strahl kommt. Ich darf beliebig viel beziehen, bekomme meine Arbeit aber trotzdem nicht rechtzeitig fertig.

### Zeitfenster: Welche Grenze passt zu meiner Arbeit?

Die Anbieter verkaufen unterschiedliche Einheiten:

- ElectronHub begrenzt gleichzeitige Anfragen und Anfragen pro Minute.
- Nano-GPT zählt Input-Token pro Woche.
- Z.ai zählt Credits pro Fünf-Stunden-Fenster und Woche.
- Cerebras verwendet Tagesbudgets.

Das heisst, ich muss zuerst entscheiden, welche Grenze mich stört. Will ich die Fünf-Stunden-Fenster loswerden, kaufe ich mit Z.ai wieder denselben Grenztyp. ElectronHub ersetzt ihn durch eine Drossel für Parallelität und Anfragerate. Cerebras verschiebt die Grenze auf den Tag, Nano-GPT auf die Woche.

Ein Kontingent-Abo ist günstig, bis es leer ist. Danach ist es eine Wand ohne Tür. Pay per Token hat diese Kontingentwand nicht, dafür wächst die Rechnung mit jeder weiteren Anfrage. Für meine unregelmässige Reserve ist das sinnvoll, für dauerhaft hohe Last kann das feste Abo besser passen.

### Modellqualität: Derselbe Name garantiert nicht dieselbe Ausführung

Die preiswerten Routen rechnen mit vier statt acht Bit Genauigkeit. Gemeint ist, dass die Modellgewichte mit weniger Stellen gespeichert werden. Das spart Speicher und Bandbreite, kann aber die Ergebnisse verändern. Belegen lässt sich der Zusammenhang bei OpenRouter, das bei jedem Endpunkt die Genauigkeit mitführt: Bei GLM-5.3 liegt der Median der fp4-Routen bei 0.56 Dollar pro Million Input, der der fp8-Routen bei 1.40, und die drei billigsten Routen sind alle fp4. Bei Kimi K3 liegt der Median der fp4-Routen bei 0.45 Dollar, der der fp8-Route bei 3.00. Hinzu kommen ausgelastete GPUs als mögliche Ursache für langsame Routen.

GLM-5.3 für 0.56 Dollar Input bei DeepInfra ist deshalb nicht zwingend dieselbe Ausführung wie GLM-5.3 für 1.40 Dollar bei Z.ai. Wenn ich dadurch mehr korrigieren muss, verschwindet ein Teil der Ersparnis.

Dass derselbe Modellname je nach Route zwischen 0.07 und 2.80 Dollar pro Million Input auftaucht, ist schon verrückt. Bei GLM-5.3 sind die billigsten Routen Wafer und Relace mit rund sieben Cent, die teuerste ist [Alibaba](https://www.alibabacloud.com/en/product/modelstudio) mit 2.80 Dollar – alles unter demselben Modellnamen. Ein Teil davon ist die Genauigkeit der Gewichte, der Rest sind Aktionen. Der Name allein reicht nicht für den Vergleich.

### Europa: Der Backend-Wechsel ändert den Empfänger

Wenn du fremden Code bearbeitest, ändert ein Backend-Wechsel auch, wer deine Prompts erhält. Bei internen Experimenten mag das unkritisch sein. Bei Kundendaten gehört es vor den Preisvergleich.

Für GLM, Kimi und Qwen gibt es EU-Routen bei kleineren Anbietern wie [Sference](https://sference.com), [TensorX](https://tensorx.ai) und [Nebius](https://nebius.com). Die Modelle liegen dafür nicht bei den grossen europäischen Clouds.

Sference ist bei GLM-5.3 mit 1.20 / 4.20 günstiger als der Listenpreis von 1.40 / 4.40. Bei DeepSeek-Flash ist die EU-Route dagegen ungefähr dreimal teurer. Für Qwen3.8-Flash selbst habe ich keine EU-Route gefunden, obwohl dieselben Anbieter andere Qwen-Modelle in Europa führen.

[Requesty](https://requesty.ai/pricing) bietet einen Router mit EU-Datenresidenz und 5 Prozent Aufschlag. Das ist eine Ortsangabe, kein Datenschutzversprechen. Ebenso ersetzt eine EU-Adresse allein keine Prüfung der konkreten Datenverarbeitung.

### Wem gehört der Anbieter?

Bei einem Tarif für 10 oder 12 Dollar im Monat lohnt die Frage, wer ihn eigentlich verkauft. Ich habe für jeden Anbieter in diesem Text nachgesehen, ob überhaupt eine Firma dahintersteht und wo sie sitzt.

| Anbieter | Firma und Sitz | Was dahintersteht |
|---|---|---|
| [ElectronHub](https://www.electronhub.ai/pricing) | keine Firma angegeben | Kleinstbetrieb, keine Registernummer |
| [Nano-GPT](https://nano-gpt.com) | NanoGPT LLC, Dover, Delaware | zwei Gründer, keine VC-Runde |
| [Pareto](https://paretoinference.com) | Pareto Inference, New York | vier Gründer, 4 Mio. USD Seed |
| [Sference](https://sference.com) | Neural Compute Ltd, London | klein, im Mai 2026 eingetragen |
| [Z.ai](https://z.ai) | Knowledge Atlas Technology, Peking | Tsinghua-Ausgründung, börsennotiert |
| [Cerebras](https://www.cerebras.ai/code) | Cerebras Systems, Sunnyvale | börsennotiert, 56 Mrd. USD Bewertung |

Die Spanne reicht von einer Firma ohne Registernummer bis zu einem Börsenkonzern, und sie sagt weniger über die Qualität der Modelle als über das Risiko, das ich damit eingehe.

ElectronHub ist der auffälligste Fall. In den Nutzungsbedingungen und in der Datenschutzerklärung steht nur der Markenname. Keine Rechtsform, keine Registernummer, keine Adresse, keine Gerichtsbarkeit. Als Kontakt gibt es eine E-Mail-Adresse und eine Discord-Einladung, und die Datenschutzerklärung sagt immerhin, dass die Daten im Europäischen Wirtschaftsraum liegen. Das ist kein Beweis für ein unseriöses Geschäft. Es heisst aber, dass ich im Streitfall keine Rechtsperson habe, an die ich mich wenden kann.

Nano-GPT und Pareto sind kleine Teams mit zwei bis vier Gründern. Nano-GPT hat keine bekannte Finanzierungsrunde, Pareto hat vier Millionen Dollar Seed-Kapital eingesammelt und vermietet eigene GPUs mit einer Verfügbarkeitszusage. Sference heisst im Handelsregister Neural Compute Ltd, ist in London eingetragen und existiert erst seit Mai 2026. Wer dort Kundencode bearbeiten lässt, setzt auf ein Unternehmen, das ein halbes Jahr alt ist.

Z.ai ist das andere Ende. Eine Ausgründung der Tsinghua-Universität von 2019, heute Knowledge Atlas Technology mit Sitz in Peking und seit dem 8. Januar 2026 an der Hongkonger Börse unter der Nummer 2513. Dahinter stehen Alibaba, Tencent und Xiaomi, dazu staatliche Fonds aus Peking und mehreren Provinzstädten. Seit Januar 2025 führt das US-Handelsministerium Zhipu AI und mehrere Tochterfirmen auf der Entity List, mit der Begründung, das Unternehmen unterstütze die militärische Modernisierung Chinas. Das ist eine amerikanische Exportkontrollfrage und kein Urteil über die Modelle, aber es gehört zur Kenntnisnahme, wenn ich fremden Code durch eine gehostete API schicke.

Cerebras ist der Gegensatz in jeder Hinsicht: ein amerikanisches Chipunternehmen aus Sunnyvale, seit Mai 2026 an der Nasdaq, mit rund 56 Milliarden Dollar Bewertung der grösste Börsengang des Jahres in den USA. Eine Firma, die es nächste Woche noch gibt.

### Verlässlichkeit: Kann ich den Tarif morgen noch nutzen?

Lustigerweise ist gerade das Geschwindigkeitsangebot von Cerebras derzeit nicht kaufbar: Beide Code-Tarife sind ausverkauft, die Warteliste hat keinen Termin. Auf Hacker News berichtet jemand, seit über einem Jahr Zugang zu suchen. Verfügbar sei er nur über einen Discord-Drop, der in Sekunden vergriffen sei. Das spricht für Nachfrage, hilft mir aber bei der nächsten Coding-Sitzung nicht.

Bei Z.ai gibt es eine andere Unsicherheit: Im April 2026 wurden die Preise der Coding-Pläne verdoppelt, ohne die Limits zu erhöhen. Die [Diskussion zur Preisänderung von April 2026](https://news.ycombinator.com/item?id=47756002) gehört deshalb zur Kaufentscheidung. Der heutige Preis sagt mir nicht, was ich in einem Jahr zahle.

Bei ElectronHub gibt es doch Diskussion, nur nicht dort, wo ich zuerst gesucht habe. In der Rollenspiel-Community auf Reddit läuft seit Juni 2026 ein [Thread, in dem ausdrücklich vor dem Anbieter gewarnt wird](https://reddit.com/r/SillyTavernAI/comments/1uipm2b/openrouter_vs_electron_hub/): Die Modelle verhielten sich nicht wie die offiziellen, die Qualität sei schlecht, und nach einem Sicherheitsvorfall traue man dem Anbieter nicht mehr. Auslöser ist ein Vorfall, bei dem Zugangsschlüssel abgeflossen sind.

Für meine reine Kostenempfehlung bedeutet das: Pareto, ElectronHub und Nano-GPT sind Kandidaten zum Ausprobieren, keine von mir belegte Zusage für einen verlässlichen Dauerbetrieb. Ein günstiger Tarif, den ich nicht kaufen kann oder dessen Route im entscheidenden Moment ausfällt oder einbricht, löst mein Problem nicht.

### Der Cache gehört zur Route

Der Cache funktioniert nur beim Anbieter, der die Anfrage tatsächlich ausführt. Landen aufeinanderfolgende Anfragen über einen Router bei unterschiedlichen Anbietern, geht der Vorteil verloren: Das Modell heisst gleich, der gespeicherte Kontext liegt woanders. Bei DeepSeek kostet ein Cache-Treffer 0.003 Dollar pro Million statt 0.15 Dollar, der Faktor 50 auf denselben Input. Eine Messung im OpenRouter-Subreddit zeigt [denselben Auftrag bei zwei Anbietern mit 60 und 97 Prozent Cache-Treffern](https://reddit.com/r/openrouter/comments/1wqwk4d/same_v41_flash_job_different_provider_60_vs_97/).

Die Gegenposition kommt von jemandem, der es wissen muss. Im OpenRouter-Subreddit schreibt jemand, der sich als CEO von Parasail vorstellt, OpenRouter rechne Cache-Lesevorgänge in die Kosten ein und route korrekt, das eigentliche Problem sei die Kapazität: „If you target just the lowest cost provider you may get a lot of 429s. Demand for openweight models can best be described as a near vertical line right now.“ Der Betriebschef von OpenRouter nennt diese Ziele selbst „sometimes at odds with one another“ ([Kommentar des COO](https://news.ycombinator.com/item?id=49658386)).

Deshalb stehen in meiner Monatstabelle Spannen. Der Cache kann bei diesen Rechnungen ungefähr den Faktor drei ausmachen, ohne dass ich am eigentlichen Arbeitsvolumen etwas ändere.

## Was nehme ich mit?

1. **Rechne mit deinem Arbeitsmix.** Mein GLM-Lite-Plan für 18 Dollar liefert mit Denkmodus 109 bis 219 Millionen Token im Monat statt der ausgewiesenen 208 bis 420 Millionen im Beispielmix. Output-Anteil und Cache bestimmen, was das Abo tatsächlich abdeckt.

2. **Bei unbegrenzten Tarifen entscheidet die Drossel, nicht die Menge.** DevPass Lite kostet 10 Dollar ohne Tokenzähler, bremst aber im Volllastfall auf dreissig Sekunden zwischen zwei Anfragen und begrenzt die Parallelität. Für meine drei Fenster ist Turbo für 40 Dollar der sinnvollere Vergleich. Ein weiteres Fünf-Stunden-Abo kann mir dagegen einfach eine zweite Warteuhr kaufen.

3. **Pay per Token kann günstiger bleiben.** Für 352 Millionen Token liegt Pareto mit GLM-5.3-Flash bei 11 bis 26 Dollar, DeepSeek in der ausgewiesenen Nebenzeit bei 23 bis 67 Dollar. Der Cache hängt an der Route. Geschwindigkeit, Qualität und Datenstandort entscheiden mit, ob die Ersparnis im Alltag bleibt.

## Die Anbieter im Überblick

Alle Anbieter aus diesem Text, mit dem, was sie verkaufen und wo sie sitzen. Die Region bezieht sich auf den Firmensitz; wo ein Anbieter EU-Rechenzentren betreibt, steht das dabei.

| Anbieter | Abrechnung | Sitz |
|---|---|---|
| [OpenRouter](https://openrouter.ai) | Pay per Token, rund 5 Prozent Aufschlag | USA |
| [Requesty](https://requesty.ai/pricing) | Pay per Token, 5 Prozent Aufschlag | EU-Datenresidenz |
| [ElectronHub](https://www.electronhub.ai/pricing) | Abo in Wochencredits und DevPass ohne Tokenzähler | keine Firma angegeben |
| [Nano-GPT](https://nano-gpt.com) | Abo (12 USD/Monat) und Pay per Token | NanoGPT LLC, Dover (USA) |
| [Pareto Inference](https://paretoinference.com) | Pay per Token, Mindestumsatz | New York (USA) |
| [Sference](https://sference.com) | Pay per Token | London, GPUs in der EU |
| [TensorX](https://tensorx.ai) | Pay per Token | Irland (EU) |
| [Nebius AI Studio](https://nebius.com) | Pay per Token | Niederlande (EU) |
| [Helmcode](https://helmcode.com) | Abo pro API-Schlüssel | EU |
| [Chutes](https://chutes.ai) | Pay per Token und GPU pro Stunde, kein Abo | USA |
| [Hyper](https://hyper.charm.land) | Abo in Credits, Prepaid möglich | – |
| [Z.ai](https://z.ai) | Abo (Coding Plan) und Pay per Token | Knowledge Atlas Technology, Peking |
| [Moonshot](https://platform.moonshot.ai) | Pay per Token, kein Abo | Peking |
| [DeepSeek](https://platform.deepseek.com) | Pay per Token, Peak und Nebenzeit | Hangzhou |
| [Alibaba Model Studio](https://www.alibabacloud.com/en/product/modelstudio) | Pay per Token, Token- und Coding-Plan | Hangzhou |
| [SiliconFlow](https://siliconflow.com) | Pay per Token | Peking |
| [DeepInfra](https://deepinfra.com) | Pay per Token | USA |
| [Together AI](https://www.together.ai) | Pay per Token | USA |
| [Fireworks AI](https://fireworks.ai) | Pay per Token | USA |
| [Novita](https://novita.ai) | Pay per Token | USA |
| [Groq](https://groq.com) | Pay per Token | USA |
| [Cerebras](https://www.cerebras.ai/code) | Abo (Code) | Sunnyvale (USA) |
| [OVHcloud AI Endpoints](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/) | Pay per Token | Frankreich (EU) |

[Relace](https://openrouter.ai) und Wafer sind keine eigenen Anbieter, sondern Promo-Routen, die über OpenRouter laufen.

Ich freue mich auf eure Kommentare und Anregungen!
