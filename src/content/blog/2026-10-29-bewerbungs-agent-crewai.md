---
title: "Der Schwarm zum Selberbauen: CrewAI Flows mit offenen Modellen"
description: "Derselbe Bewerbungs-Schwarm mit CrewAI und offenen Modellen: mit eigenem Lead, als Flow mit Python als Gerüst und als Crew mit CrewAIs eingebautem Manager. Warum der Lead die wichtigste Design-Entscheidung ist, was es kostet und wie es im Vergleich zu Claude, Gemini und OpenAI abschneidet."
pubDate: 2026-10-29T11:00:00+01:00
readTime: 28
category: "AI Integration"
tags: ["CrewAI", "Flows", "Open Source", "DeepSeek", "Qwen", "Multi-Agent", "Agenten", "Kosten"]
cover: "../../assets/blog/serie-cover-bewerbungs-agent-crewai.png"
thumb: "../../assets/blog/serie-karte-bewerbungs-agent-crewai.png"
---

**Stand:** Oktober 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 28 Minuten

<!-- serie:start -->
> **Serie „Agenten 2026“** · Teil 2: Agenten, die selbst planen
>
> - [Braucht es überhaupt noch einen Workflow? (geplante Aufgabe)](/blog/2026-10-28-bewerbungs-agent-geplante-aufgabe/)
> - [Was kann ein Schwarm? (Claude Managed Agents)](/blog/2026-10-28-bewerbungs-agent-schwarm/)
> - [Wie machen es Google und OpenAI?](/blog/2026-10-29-bewerbungs-agent-vergleich/)
> - **Den Schwarm selbst programmieren? (CrewAI)** ← du bist hier
> - [Der Schwarm zieht nach Hause? (Pi, Hermes)](/blog/2026-10-29-bewerbungs-agent-pi-hermes/)
> - [Ich bau mir meinen Schwarm komplett selbst (Microsoft Agent Framework)](/blog/2026-10-30-bewerbungs-agent-microsoft/)
>
> Teil 1, Bewerbungs-Agenten mit festem Ablauf: [von n8n](/blog/2026-09-29-bewerbungs-agent-n8n/) bis [DBOS](/blog/2026-10-27-bewerbungs-agent-dbos/)
<!-- serie:end -->

In den letzten zwei Beiträgen hat mein Bewerbungs-Schwarm immer auf der Plattform eines grossen Anbieters gelebt: zuerst auf [Claude Managed Agents](/blog/2026-10-28-bewerbungs-agent-schwarm/), danach im [Vergleich mit Gemini und OpenAI](/blog/2026-10-29-bewerbungs-agent-vergleich/). Jedes Mal hat mir jemand die Sandbox, den Tresor für die Zugangsdaten, das Gedächtnis und den Zeitplan fix und fertig hingestellt. Bequem, aber man ist dabei immer auch Gast im Haus eines anderen.

Heute drehe ich den Spiess um. Derselbe Schwarm, dieselben Rollen, dieselben Regeln, aber diesmal mit **CrewAI**, also Open Source, und mit **offenen Modellen**. Die spannende Frage: Wie viel von dem, was die Plattformen mir abgenommen haben, vermisse ich wirklich? Und was kostet es, wenn man alles selbst macht?

Vorweg, damit du weisst, wohin die Reise geht: Mein erster Versuch ist ziemlich holprig geworden, und zwar weil ich CrewAI genau so benutzt habe wie Claude. Erst als ich nachgelesen habe, wie CrewAI eigentlich gedacht ist, wurde es richtig gut. Am Ende habe ich den Schwarm dreimal gebaut: mit einem eigenen Lead, als Flow und als Crew, wie CrewAI sie meint. So gut, dass es am Ende die günstigste Variante der ganzen Serie ist. Und unterwegs bin ich bei der Frage gelandet, die ich inzwischen für die wichtigste Design-Entscheidung bei solchen Systemen halte: Braucht es überhaupt einen Lead?

## Was ist CrewAI?

CrewAI ist ein Python-Framework für Teams aus Agenten. Jeder Agent hat eine Rolle, ein Ziel, eine Hintergrundgeschichte (bei uns: der Systemprompt aus dem Claude-Schwarm) und eine Liste von Werkzeugen. Das Team heisst, wenig überraschend, eine Crew. Matcher, Researcher, Writer und Skeptiker sind also sozusagen schon eingebaut.

Daneben gibt es bei CrewAI aber noch ein zweites Konzept, das ich anfangs völlig übersehen habe: **Flows**. Ein Flow ist das feste Gerüst einer Anwendung, in ganz normalem Python, mit Schritten, die aufeinander folgen, einem typisierten Zustand, Verzweigungen und parallelen Ästen. Agenten kommen nur dort hinein, wo es wirklich Urteilsvermögen braucht. Die Doku ist da erstaunlich deutlich: „For any production-ready application, start with a Flow.“

Was CrewAI nicht mitbringt, ist alles, was bei den Plattformen um die Agenten herum passiert: keine Sandbox, kein Tresor, kein Zeitplan. Das muss ich selbst bauen.

## Welches Modell?

Mein Plan war eigentlich, ein offenes Modell lokal laufen zu lassen, etwa Qwen 3.8 mit 27 Milliarden Parametern. Der Haken: In der üblichen 4-Bit-Fassung ist das Modell 18 GB gross und braucht für einen flüssigen Betrieb einen Mac mit mindestens 32 GB Speicher. Mein MacBook hat 16 GB :)

Ich habe es deshalb pragmatisch gelöst: Die Modelle sind offen, laufen aber gehostet bei OpenRouter, das für sehr viele offene Modelle eine einheitliche API anbietet. Es ist dasselbe Modell, das ich auch selbst betreiben könnte, und im Code steckt es in einer einzigen Umgebungsvariable. Wer einen Server mit einer grossen Grafikkarte hat, tauscht die Adresse aus, und der Schwarm läuft komplett auf eigener Hardware.

Ausprobiert habe ich drei offene Modelle:

| Modell | Input pro Mio. Tokens | Output pro Mio. Tokens |
| --- | --- | --- |
| Qwen 3.8 27B | 0,039 $ | 1,25 $ |
| Qwen 3.8 Flash | 0,15 $ | 0,47 $ |
| DeepSeek V4.1 Flash | 0,045 $ | 0,50 $ |
| *zum Vergleich: Claude Sonnet 5.5* | *2,00 $* | *10,00 $* |

Sonnet ist das Modell, mit dem der Claude-Schwarm hauptsächlich arbeitet, und es kostet beim Input rund 44-mal und beim Output 20-mal so viel wie DeepSeek. Da wird man schon mal neugierig.

## Erster Versuch: ein Lead wie bei Claude

Mein erster Schwarm war ein Nachbau eins zu eins. Ein Lead bekommt die Regeln aus dem Claude-Schwarm, also höchstens 15 neue Stellen pro Tag, Vorfilter, höchstens drei Anschreiben, Prüfsummen und Protokoll, und verteilt die Arbeit an seine Spezialisten. Weil CrewAI-Agenten keine Shell haben, habe ich ihnen Werkzeuge gebaut: Dateien lesen, Dateien schreiben (jede Rolle nur ihre eigenen), Anzeigen laden, Websuche.

Das ging ziemlich holprig los. CrewAIs eingebaute Delegation hat der Lead schon beim allerersten Schritt benutzt, nämlich um die Inbox aufzulisten, und zwar ausgerechnet über den Researcher, der dafür gar kein Werkzeug hatte. Der hat brav geraten und mir dann erklärt, warum er die Liste leider nicht liefern kann :) Also habe ich die Delegation durch ein eigenes Werkzeug ersetzt, das pro Stelle einen frischen Spezialisten startet.

Und dann kam Qwen. Ich gebe es gleich zu: Mit Qwen bin ich nicht wirklich weitergekommen. Es hat fleissig gearbeitet, sich aber bei jedem Lauf an eine andere Regel nicht gehalten. Das grosse Modell hat 18 statt 15 Stellen angelegt und im einzigen fertigen Brief die Anrede vergessen, das schnellere Flash-Modell hat Schlüssel abgekürzt, einen eigenen Status erfunden und keinen einzigen Brief geschafft. Erst der Wechsel auf DeepSeek brachte den Durchbruch: derselbe Schwarm, dieselben Prompts, und auf einmal hat fast alles gestimmt.

| Erster Versuch, mit Lead | Qwen 3.8 27B | Qwen 3.8 Flash | DeepSeek V4.1 Flash |
| --- | --- | --- | --- |
| Dauer | 22 min 13 s | 12 min 23 s | 9 min 30 s |
| Kosten | 17–26 Rappen | 8–9 Rappen | 8–11 Rappen |
| Tageslimit von 15 Stellen | 18 angelegt | gehalten | gehalten |
| Anschreiben | 1, ohne Anrede | 0 | 3 |

Warum stehen bei den Kosten Spannen? Weil OpenRouter die letzten Aufrufe eines Laufs mit Verzögerung verbucht. Ich messe einmal über das Guthaben vor und nach dem Lauf und einmal über die gezählten Tokens mal den Preis, und die beiden Werte liegen nicht ganz beieinander. Für die Grössenordnung reicht es allemal.

Funktioniert hat es also, mit DeepSeek sogar richtig gut. Aber beim Aufschreiben hat mich eine Frage nicht mehr losgelassen: Wieso musste ich so viel um CrewAI herumbauen? Schreibwerkzeuge pro Rolle, ein eigenes Werkzeug statt der Delegation, Prüfsummen, eine Abschlussprüfung. Die Antwort steht in dem Satz aus der Doku oben. Ich hatte dem Lead die ganze Buchhaltung überlassen, also das Tageslimit, die Status und die Prüfsummen, und genau dort ist Qwen gescheitert. Das ist keine Aufgabe für ein Sprachmodell, das ist eine Aufgabe für drei Zeilen Python.

## Der Schwarm als Flow

Also habe ich den Schwarm noch einmal gebaut, diesmal so, wie CrewAI es vorsieht:

![Der Schwarm als CrewAI Flow: sieben Schritte von den Mails bis zur Ablage, Code-Schritte grau, Agenten-Schritte blau, mit Router und der Abkürzung, wenn nichts passt](../../assets/blog/bewerbungs-agent-crewai-flow.png)

Mails holen, Stellen anlegen, Dubletten erkennen, das Limit von 15, die Auswahl, Google Docs, Push und Protokoll sind jetzt Code. Agenten gibt es nur noch für sechs Aufgaben, bei denen es tatsächlich Urteilsvermögen braucht: die Stellen aus den Mails lesen, der Vorfilter, der Matcher, der Researcher, der Writer und der Skeptiker. Den Lead gibt es nicht mehr.

Drei Dinge machen den Unterschied:

**Feste Ausgaben statt Dateien.** Jeder Agent liefert ein Objekt mit festem Schema zurück, bei CrewAI heisst das `output_pydantic`. Der Matcher gibt also keinen Text zurück, der hoffentlich gültiges JSON ist, sondern ein `Match` mit Score, den vier Kriterien als Wahrheitswerten und allen anderen Feldern. Ist etwas falsch, merkt CrewAI das, bevor es weitergeht. Die Dateien im Ordner der Stelle schreibt dann Python, nicht der Agent.

**Guardrails statt Bitten im Prompt.** Ein Guardrail ist eine kleine Python-Funktion, die die Antwort eines Agenten prüft und ihn bei einem Fehler bis zu dreimal nachbessern lässt. Beim Writer prüft sie, ob der Brief mit einer Anrede beginnt, vier bis fünf Absätze und 250 bis 450 Wörter hat, meine Webseite erwähnt und keine Grussformel enthält. Beim Auslesen der Mails prüft sie, ob jeder Link wörtlich in der Mail steht. Im ersten Versuch waren das Regeln, um die ich das Modell gebeten habe. Jetzt sind es Regeln, die es nicht übergehen kann.

So sieht der Guardrail des Writers aus, ganz normales Python:

```python
GRUSS = re.compile(r"(?i)(grüsse|grüße|gruessen|regards|sincerely)[^\n]{0,30}\s*$")

def brief_pruefen(out):
    text = out.raw.strip()
    absaetze = [a for a in re.split(r"\n\s*\n", text) if a.strip()]
    fehler = []
    if not absaetze or not absaetze[0].lower().startswith(("sehr geehrte", "guten tag", "dear", "liebe")):
        fehler.append("Der Brief muss mit der Anrede in einer eigenen Zeile beginnen.")
    if not 4 <= len(absaetze) - 1 <= 5:
        fehler.append(f"Nach der Anrede braucht es 4–5 Absätze, es sind {len(absaetze) - 1}.")
    if not 250 <= len(text.split()) <= 450:
        fehler.append(f"Der Brief hat {len(text.split())} Wörter, erlaubt sind 250–450.")
    if "thomas.ebermann.ch" not in text:
        fehler.append("Der Hinweis auf die Webseite thomas.ebermann.ch fehlt.")
    if GRUSS.search(text) or "**" in text or re.search(r"(?m)^#", text):
        fehler.append("Keine Grussformel, keine fetten Einleitungen, keine Überschriften.")
    return (False, " ".join(fehler)) if fehler else (True, text)
```

Und so hängt er am Task des Writers:

```python
Task(description=auftrag, expected_output="Der Text", agent=writer,
     guardrails=[brief_pruefen], guardrail_max_retries=3)
```

Gibt die Funktion `False` zurück, schickt CrewAI die Fehlermeldung als Rückmeldung an den Writer, also etwa „Der Brief hat 512 Wörter, erlaubt sind 250–450“, und lässt ihn nachbessern. Nach drei vergeblichen Versuchen bricht der Task ab, und der Flow markiert die Stelle als Fehler, statt mir einen falschen Brief hinzulegen. Was sich nicht so einfach prüfen lässt, etwa ob eine Behauptung im Lebenslauf belegt ist, bleibt die Aufgabe des Skeptikers.

**Ein Router statt eines Leads.** Nach dem Matchen entscheidet ein Router in Python, wie es weitergeht: Score ab 7 und alle vier Kriterien erfüllt heisst Empfehlung, eine frühere Bewerbung bei derselben Firma macht daraus einen Hinweis, höchstens drei gehen ins Schreiben, und passt gar nichts, springt der Flow direkt zur Ablage. Die Regel zu früheren Bewerbungen habe ich dabei gleich geschärft: Der Matcher liefert Firma, Rolle und Alter der früheren Bewerbung als eigene Felder, und Python wendet die Regel an. Im ersten Versuch hat DeepSeek dieselbe Lage einmal als Hinweis und einmal als Empfehlung behandelt.

Ganz ehrlich: Kürzer ist der Code dadurch nicht geworden, beide Varianten haben etwa gleich viel. Der Unterschied liegt woanders. Die Prompts sind von rund 1700 auf 700 Wörter geschrumpft, weil die Regeln jetzt im Code stehen.

## Was dabei herauskommt

Getestet habe ich wieder mit denselben vier Job-Alerts wie in den letzten Beiträgen, plus der Testmail mit einer Stelle, die gut passt:

| CrewAI Flow | Zeit | Kosten | Anschreiben |
| --- | --- | --- | --- |
| DeepSeek V4.1 Flash, zwei Läufe | 3 min 10 s + 2 min 4 s | rund 5 Rappen | 2, beide in der ersten Runde ohne Befund |
| Qwen 3.8 27B, zwei Läufe | 3 min 41 s + 5 min 54 s | rund 23 Rappen | 1 |

Warum zwei Läufe? Weil der Flow das Tageslimit jetzt garantiert einhält. In der Inbox lagen 18 Stellen, drei kamen erst am „nächsten Tag“ dran, und ausgerechnet meine Teststelle war dabei, genau wie bei OpenAI im letzten Beitrag. Regelkonform, aber für einen Test ein bisschen ärgerlich :)

Mit **DeepSeek** ist der Flow damit der günstigste Weg in dieser ganzen Serie, und mit gut drei Minuten pro Lauf fast so schnell wie OpenAI. Beide Briefe haben die erste Prüfrunde ohne Befund bestanden, beide liegen fertig in meiner Google-Docs-Vorlage. Bei der Teststelle hat der Researcher sogar dieselbe Kontaktperson gefunden wie Claude und OpenAI. Einziger Schönheitsfehler: Er schreibt „Sehr geehrte Frau …“, rät das Geschlecht also aus dem Vornamen, was Claude bewusst vermieden hatte.

Und **Qwen**? Da wird es interessant. Das Tageslimit und die Status kann es jetzt gar nicht mehr verletzen, und jeder Brief hat garantiert eine Anrede. Eine Stelle, die Qwen im ersten Versuch wegen des Orts verworfen hatte, hat im Flow einen fertigen Brief bekommen. Am Urteilsvermögen ändert das Gerüst aber nichts: Im zweiten Lauf hat der Qwen-Skeptiker ausgerechnet die Anrede bemängelt, weil sie angeblich schon in der Vorlage stehe, und den Brief damit zweimal durchfallen lassen. Ein gutes Gerüst macht ein schwächeres Modell zuverlässiger, aber nicht klüger.

## Gegenprobe: dasselbe als Crew

Moment, wirst du vielleicht einwenden: CrewAI kann doch Crews *und* Flows. War der erste Versuch nicht einfach eine schlechte Crew? Gute Frage, und ganz ehrlich: ja. Mein erster Versuch war ein Lead mit einer einzigen Aufgabe („bearbeite die Inbox“) und selbst gebauten Werkzeugen, also der Claude-Lead in CrewAI-Kleidern. Eine Crew, wie CrewAI sie meint, sieht anders aus. Also habe ich den Schwarm ein drittes Mal gebaut, diesmal genau so, wie es `crewai create crew` anlegt.

Die Agenten und ihre Aufgaben stehen in zwei YAML-Dateien: Vorfilter, Matchen, Auswahl, Recherche, Schreiben, Prüfen, Überarbeiten und Nachprüfen. Jede Aufgabe bekommt über `context` die Ergebnisse der vorherigen, liefert ein festes Schema zurück, und die beiden Schreib-Aufgaben haben dieselben Guardrails wie im Flow. Die Regeln für die Auswahl stehen in der Beschreibung der Aufgabe. Code gibt es nur noch als Klebstoff drumherum: die Eingaben vorbereiten, die Ergebnisse in die Ordner schreiben und ablegen.

Ein Ausschnitt aus `agents.yaml`, zwei der sechs Agenten. Die langen Rollenbeschreibungen aus dem Flow hängt der Code an die `backstory` an, damit alle Varianten denselben Wortlaut haben:

```yaml
matcher:
  role: Matcher
  goal: Jede Stelle streng gegen Thomas' Kriterien und Profil bewerten
  backstory: Du bist ein strenger Recruiter.

skeptic:
  role: Skeptiker
  goal: Anschreiben auf unbelegte Behauptungen prüfen, bevor ein Mensch sie sieht
  backstory: Du prüfst Anschreiben, bevor ein Mensch sie sieht.
```

Und die Auswahl aus `tasks.yaml`. Hier sieht man schön den Unterschied zum Flow: Dieselben Regeln, die dort im Router als Python stehen, sind hier eine Bitte an den Koordinator. Über `context` bekommt er die Bewertungen des Matchers:

```yaml
auswahl_task:
  description: |
    Entscheide nach diesen Regeln, welche bewerteten Stellen ein Anschreiben bekommen:
    1. Eine Empfehlung hat score ab 7 und alle vier Kriterien erfüllt. Alle anderen: uebersprungen, mit Score
       und verletztem Kriterium als Grund.
    2. Hat Thomas sich schon bei derselben Firma beworben, wird eine Empfehlung zu hinweis, ausser es war
       nachweislich eine andere Rolle und vor mindestens drei Monaten.
    3. Höchstens drei Empfehlungen bekommen schreiben, die mit dem höchsten Score zuerst. Weitere Empfehlungen:
       warteliste.
    Gib jeden bewerteten job_key genau einmal zurück.
  expected_output: Für jeden bewerteten job_key einen Status (schreiben, hinweis, warteliste, uebersprungen) mit Grund.
  agent: koordinator
  context: [matchen_task]
```

In der hierarchischen Crew fällt die Zeile `agent: koordinator` weg, dann entscheidet der Manager, wer die Aufgabe übernimmt.

Und dann gibt es zwei Arten, eine Crew laufen zu lassen. **Sequentiell** arbeitet jede Aufgabe ihr fester Agent ab, eine nach der anderen. **Hierarchisch** gibt es keine feste Zuordnung, sondern einen eingebauten Manager, der für jede Aufgabe selbst entscheidet, wen er damit beauftragt. Das ist nichts anderes als der Lead, diesmal von CrewAI selbst gebaut. Ich habe beides laufen lassen, mit denselben Daten wie immer:

| DeepSeek V4.1 Flash | Zeit (zwei Läufe) | Kosten | Anschreiben |
| --- | --- | --- | --- |
| Flow | 5 min 14 s | 4–5 Rappen | 2 |
| Crew, sequentiell | 8 min 42 s | 2–12 Rappen | 2 |
| Crew, hierarchisch mit Manager | 19 min 30 s | 12–17 Rappen | 0 |

| Qwen 3.8 27B | Zeit (zwei Läufe) | Kosten | Anschreiben |
| --- | --- | --- | --- |
| Flow | 9 min 35 s | 10–23 Rappen | 1 |
| Crew, sequentiell | 11 min, dann Absturz | 7–31 Rappen | 1 |
| Crew, hierarchisch mit Manager | 22 min, dann nach einer Stunde abgebrochen | über 19–36 Rappen | 1 |

Die Kosten sind diesmal breite Spannen, und das ist ehrlich gesagt mein Fehler: Die Läufe liefen in der Nacht direkt hintereinander, und weil OpenRouter verzögert verbucht, sind beim Guthaben Beträge beim falschen Lauf gelandet. Die Rechnung über die Tokens ist auch nicht exakt, weil CrewAI die Input-Tokens nur schätzt. Für die Reihenfolge reicht es trotzdem.

**Die sequentielle Crew** kommt mit DeepSeek zum selben Ergebnis wie der Flow, braucht aber deutlich länger. Bei den Kosten liegen die beiden etwa gleichauf. Der Grund steckt im Aufbau: Eine Crew-Aufgabe bearbeitet alle Stellen des Tages auf einmal, ein Matcher für alle statt einer pro Stelle. Das macht jede Aufgabe länger und nimmt dem Ganzen die Parallelität. Und es hat einen Nebeneffekt, den ich unterschätzt hatte. Im zweiten Qwen-Lauf hat sich der Matcher an einer Webseite festgebissen, und weil alle Stellen in derselben Aufgabe steckten, ist der ganze Lauf ohne ein einziges Ergebnis abgestürzt. Im Flow wäre nur diese eine Stelle gescheitert.

**Die hierarchische Crew** war der eigentliche Test, und sie hat ihn nicht bestanden. Mit DeepSeek kam in drei Läufen kein einziges Anschreiben heraus. Warum, zeigt das Protokoll eines Laufs: Der Manager hat den Matcher, den Researcher und den Writer beauftragt, die Auswahl und **beide Prüfungen aber selbst gemacht**. Den Skeptiker hat er kein einziges Mal eingesetzt. Er hat also die Briefe, die er selbst in Auftrag gegeben hatte, auch selbst kontrolliert, und dabei jedes Mal etwas gefunden, das nach der Überarbeitung immer noch da war, mal eine falsche Zeitform, mal eine Getrenntschreibung. Nebenbei war er mit Abstand der grösste Token-Verbraucher. Mit Qwen hat er im ersten Lauf immerhin einen Brief durchgebracht und den Skeptiker auch benutzt, im zweiten Lauf ist das Modell in eine Schleife geraten und hat statt einer Prüfung über hunderttausend Zeichen Tabulatoren geschrieben, bis der Lauf nach einer Stunde abgebrochen wurde.

Was CrewAI selbst empfiehlt, ist damit ziemlich gut belegt: Eine Crew ist ein Team für *eine* Aufgabe, ein Flow ist der Ablauf für einen ganzen Prozess. Und der eingebaute Manager ist genau der Lead, um den es im nächsten Abschnitt geht.

## Lead oder Gerüst: die wichtigste Design-Entscheidung

Wenn ich aus dieser Serie bisher eine Sache mitnehme, dann diese: Ob es einen Lead gibt, der den Ablauf selbst plant, oder ein festes Gerüst, das die Agenten aufruft, ist die wichtigste Entscheidung beim Bau eines solchen Systems. Wichtiger als die Wahl der Plattform und wichtiger als die Wahl des Modells. Beide Wege haben ihren Preis.

**Ein Lead** kann mit dem Unerwarteten umgehen. Im Claude-Schwarm hat er von sich aus einen Matcher neu gestartet, der nichts geliefert hatte, einen Link ohne Tracking-Parameter noch einmal geladen und entschieden, welche zwei Stellen er auf morgen verschiebt. Nichts davon stand in seinem Prompt, und in einem festen Ablauf hätte ich jeden dieser Fälle vorher kennen und programmieren müssen. Dafür hat der Lead auf allen Plattformen mit Abstand die meisten Tokens gelesen und die meiste Zeit gebraucht, weil er bei jedem Schritt alles wieder liest. Und er braucht ein starkes Modell und gute Führung: Mit Qwen hat sich mein eigener Lead ständig an eine andere Regel nicht gehalten, und der eingebaute Manager von CrewAI hat mit DeepSeek lieber selbst geprüft, als den Skeptiker zu fragen.

**Ein Gerüst** ist billig, schnell und berechenbar. Das Tageslimit, die Status und die Auswahl stimmen garantiert, egal welches Modell gerade arbeitet, und auch ein schwächeres Modell liefert brauchbare Ergebnisse, weil es nur noch kleine, klar umrissene Aufgaben bekommt. Der Preis: Alles, was nicht im Code steht, passiert auch nicht. Lädt eine Anzeige nicht, gibt es keinen Lead, der es selbst noch einmal anders versucht.

Für meinen Job-Radar ist die Sache klar. Der Ablauf ist jeden Tag derselbe, die Regeln sind bekannt, und das Unerwartete ist selten. Da ist das Gerüst die bessere Wahl, und das wäre es auch bei Claude gewesen. Bei einer Aufgabe, deren Ablauf ich vorher nicht kenne, etwa einer offenen Recherche, würde ich mich anders entscheiden. Und dazwischen gibt es einen Mittelweg, den CrewAI ausdrücklich vorsieht: ein festes Gerüst, in dem einzelne Schritte einer kleinen Crew mit eigenem Lead überlassen werden, genau dort, wo es Planung braucht.

Für die Serie ist das eine spannende Pointe. Der Lead, der selbst plant, also das eigentliche Thema von Teil 2, ist nicht immer die beste Idee. Was bei CrewAI übrig bleibt, ist im Grunde ein fester Ablauf wie in Teil 1, mit Agenten an genau den Stellen, wo es Urteilsvermögen braucht.

## Exkurs: Und wo läuft das Ganze?

Bei den Plattformen gab es für jeden Teil des Schwarms eine eigene Sandbox mit eigenem Netz und eigenen Zugangsdaten. Das habe ich im ersten Versuch mit Docker nachgebaut: drei Container für Postfach, Schwarm und Ablage in einem internen Netz ohne Internet, und ein kleiner Squid-Proxy als einziger Ausgang, mit einer eigenen Liste erlaubter Adressen pro Container. Das funktioniert, war aber auch der aufwendigste Teil des ganzen Beitrags.

Für den Flow habe ich das vereinfacht. Weil CrewAI-Agenten keine Shell haben, sondern nur die Werkzeuge, die ich ihnen gebe, ist die Trennung pro Agent nicht mehr so wichtig wie bei den Plattformen: Der Matcher hat schlicht kein Werkzeug für Gmail. Der Flow läuft deshalb in einem einzigen Container, der jeden Morgen um sieben Uhr aufwacht. Den Proxy habe ich als zweite Absicherung behalten, damit der Container nur die Adressen erreicht, die der Schwarm wirklich braucht. Ein `docker compose up -d` startet das Ganze, egal ob auf meinem Mac oder auf einem Server.

## Deployen und damit arbeiten

Ein Schwarm, der nur auf meinem Laptop läuft, ist natürlich nur die halbe Miete. Mein Mac ist um sieben Uhr morgens nicht immer wach :) Deployt habe ich den Flow noch nicht, aber so würde ich es machen.

**Wo er läuft.** Weil das Modell bei OpenRouter läuft, braucht der Server kaum Leistung. Ein kleiner virtueller Server mit zwei Kernen und 4 GB Speicher reicht. Dort kommen das Repo, die Zugangsdaten und mein Profil hin, und ein `docker compose up -d` startet den Flow. Ein Update ist ein `git pull` und noch einmal dasselbe. Wer ganz ohne fremde Modelle auskommen will, stellt einen Server mit Grafikkarte daneben und ändert eine einzige Variable, nämlich `MODELL`.

**Worauf ich achten würde.** Das Gedächtnis liegt in einem Docker-Volume, und das würde ich jede Nacht sichern, sonst ist mit dem Server auch die ganze Bewerbungsgeschichte weg. Bei den Plattformen hat das jemand anderes gemacht. Und ein fehlgeschlagener Lauf landet im Moment nur im Log. Für den echten Betrieb würde ich die Push-Nachricht auch für Fehler nutzen.

**Wie ich damit arbeite.** Im Alltag merke ich vom Flow fast nichts, und genau so soll es sein. Nach dem Lauf kommt die Push-Nachricht aufs Handy, entweder mit den neuen Anschreiben oder mit einem kurzen „keine passt“ samt den Hauptgründen. Ein Tippen öffnet das Google Doc mit dem fertigen Anschreiben, die Übersicht hat einen Eintrag pro Stelle mit Score, Lohn, Risiken und Bewerbungslink, und dort setze ich den Status auf „beworben“ oder „nicht interessant“. Will ich wissen, warum eine Stelle verworfen wurde, liegt zu jeder Stelle ein Ordner mit allen Zwischenschritten im Gedächtnis, und pro Tag ein Protokoll. Was noch fehlt, ist der umgekehrte Weg: dem Schwarm einfach einen Link zu einer Stelle schicken, die ich selbst gefunden habe. Das steht ziemlich weit oben auf meiner Liste.

## Zuschauen, was passiert

Bei der hierarchischen Crew musste ich mir mühsam aus einem langen Log zusammensuchen, an wen der Manager was delegiert hat. Das geht auch komfortabler. CrewAI lässt sich mit sogenannten Tracing-Werkzeugen verbinden, die jeden Schritt aufzeichnen: welcher Agent welche Aufgabe bekommen hat, welche Werkzeuge er aufgerufen hat und wie lange jeder Modellaufruf gedauert hat. Ich habe zwei davon ausprobiert, eines in der Cloud und eines komplett lokal.

**CrewAIs eigenes Tracing** läuft über die Plattform von CrewAI. Man meldet sich mit `crewai login` an, schaltet es mit `crewai traces enable` ein, und ab dann landet jeder Lauf auf app.crewai.com, mit einem kostenlosen Konto. Mehr ist es nicht, keine Zeile Code. Der Haken: Selbst betreiben lässt sich das nicht, und in den Traces steht alles, was die Agenten sehen, also auch mein Lebenslauf und die Anschreiben. Für einen Beitrag über Unabhängigkeit ist das ein bisschen ironisch :)

Und das Ergebnis ist richtig gut. CrewAI zeigt den ganzen Flow als einen einzigen Trace, Schritt für Schritt von `postfach` über `vorfilter` und `matchen` bis `schreiben`, mit jeder Crew, jedem Agenten und jedem Modellaufruf darunter, samt Tokens und Dauer. Rechts steht, was ein Agent bekommen und zurückgegeben hat (die Ausgabe habe ich unkenntlich gemacht, da stehen Firmennamen drin):

![Ein Lauf des Flows im Tracing von CrewAI: links der ganze Ablauf mit Crews, Agenten und Modellaufrufen samt Tokens und Dauer, rechts die Details eines Agenten](../../assets/blog/bewerbungs-agent-crewai-tracing-crewai.png)

**Langtrace** ist Open Source und lässt sich selbst betreiben. Bei mir läuft es als eigener kleiner Docker-Stack mit drei Containern, der App, Postgres und ClickHouse für die Traces, und alles bleibt auf meinem Mac. Im Code sind es zwei Zeilen, die vor CrewAI geladen werden müssen:

```python
from langtrace_python_sdk import langtrace
langtrace.init(api_key=os.environ["LANGTRACE_API_KEY"], api_host="http://localhost:3100/api/trace")
```

Danach taucht jeder Agenten-Aufruf als eigener Trace auf:

![Die Trace-Liste im lokalen Langtrace: jeder Agenten-Aufruf des Flows als eigener Eintrag, mit Modell und Eingabe](../../assets/blog/bewerbungs-agent-crewai-langtrace-traces.png)

Und ein Klick zeigt, wie sich ein Aufruf zusammensetzt, vom Start der Crew über den Task bis zum einzelnen Modellaufruf, jeweils mit seiner Dauer:

![Die Detailansicht eines Traces in Langtrace: Crew, Task, Agent und die Modellaufrufe als Zeitleiste](../../assets/blog/bewerbungs-agent-crewai-langtrace-detail.png)

Ganz rund lief es aber nicht. Das SDK brauchte zwei zusätzliche Python-Pakete, die es nicht selbst mitbringt, und es schickt seine eigenen Fehlerberichte standardmässig an einen fremden Dienst, das musste ich erst abschalten. Die App rief sich intern unter einem falschen Port selbst auf, bis ich ihr gesagt habe, wo sie läuft. Und bei den Zahlen musste ich schmunzeln: Tokens und Kosten stehen bei mir überall auf null, weil Langtrace die Aufrufe über OpenRouter zwar sieht, aber weder deren Tokens noch deren Preise kennt. Es hat ausserdem nicht jeden Aufruf erwischt, und der eigene Reiter für CrewAI blieb leer. Ausserdem landet jeder Agenten-Aufruf des Flows als eigener Trace, man sieht also nicht den ganzen Lauf auf einen Blick, so wie bei CrewAI.

**Und die Kosten?** Beide Werkzeuge kosten für meinen Zweck nichts: CrewAIs Tracing läuft mit einem kostenlosen Konto, und Langtrace betreibe ich selbst. Dafür braucht der lokale Stack rund 1,1 GB Arbeitsspeicher, davon allein 900 MB für ClickHouse, und gut 5,7 GB Platz für die Images. Das Langtrace-Image allein ist 4,5 GB gross und schon anderthalb Jahre alt, was mich bei der Pflege des Projekts etwas nachdenklich macht. An den Kosten der Modelle ändert das Tracing nichts: Ein beobachteter Lauf hat mit gut fünf Minuten und 8 Rappen genauso viel gekostet wie ohne.

Mein Eindruck: Das Tracing von CrewAI ist klar das bessere Werkzeug, bequemer eingerichtet, mit dem ganzen Flow auf einen Blick und mit Tokens pro Aufruf. Es hat nur den einen Haken, dass meine Daten dafür in die Cloud von CrewAI gehen. Langtrace hält alles bei mir, zeigt aber weniger. Für den Dauerbetrieb mit persönlichen Daten würde ich trotzdem das selbst betriebene Werkzeug nehmen, und für die Kosten bleibe ich so oder so bei meiner eigenen Messung.

## Vier Wege zum selben Schwarm

Jetzt habe ich denselben Schwarm viermal gebaut, und damit kann ich endlich die Frage beantworten, die mich seit dem ersten Teil beschäftigt: Was ist eigentlich der beste Weg? Die ehrliche Antwort ist, wie so oft: Es kommt darauf an, worauf du Wert legst.

| | Dauer | Kosten pro Lauf mit Anschreiben | Anschreiben |
| --- | --- | --- | --- |
| Claude Managed Agents | 6 min 23 s | 1,77 $ | 1 |
| OpenAI Agents API | 3 min 8 s | 1,07 $ | 1 |
| Gemini Managed Agents | 33 min 53 s | 1,94 $ | 2 |
| CrewAI Flow mit DeepSeek V4.1 Flash | 2 bis 3 min | rund 0,03 $ | 1 |

**Die Kosten** sind schnell erzählt: Der Flow kostet rund ein Fünfzigstel von Claude. Pro Monat wären das für meinen Radar ein bis zwei Franken statt der rund 25 Dollar beim Claude-Schwarm. Dazu kommt allerdings der Server, ein kleiner kostet ein paar Franken im Monat. Fair ist der Vergleich nicht ganz, denn die Plattformen arbeiten mit einem Lead und der Flow nicht, aber genau das ist ja die Design-Entscheidung von oben.

**Wie einfach ist der Aufbau?** Hier gewinnt Claude klar. Jeder Agent ist eine Markdown-Datei, die Spezialisten sind vordefiniert, jede Rolle bekommt ihr eigenes Modell, und Tresor, Gedächtnis und Zeitplan sind kleine Konfigurationsdateien. OpenAI kommt knapp dahinter, aber die Subagenten erben das Modell des Leads. Bei Gemini habe ich mir die Spezialisten mangels Subagenten selbst gebaut. Und bei CrewAI schreibe ich alles in Python, inklusive Zeitplan und Kostenmessung. Mit dem Flow ist das aber erstaunlich übersichtlich geworden, viel übersichtlicher als mein erster Versuch mit dem Lead.

**Wie viel Arbeit macht der Betrieb?** Bei den drei Plattformen kümmert sich der Anbieter um Server, Updates und Ausfälle, mit ihren Eigenheiten: Claude hat ein Budget pro Zeitplan, OpenAI keines, und Gemini löscht eine Umgebung mitsamt Gedächtnis, wenn sie sieben Tage nicht benutzt wird. Bei CrewAI bin ich selbst der Betreiber: Server, Docker, Backups und Updates. Dafür kann ich das Modell mit einer einzigen Variable wechseln und bin an keinen Anbieter gebunden.

| | Claude | OpenAI | Gemini | CrewAI Flow |
| --- | --- | --- | --- | --- |
| Kosten | ★☆☆ | ★★☆ | ★☆☆ | ★★★ |
| Einfacher Aufbau | ★★★ | ★★☆ | ★☆☆ | ★★☆ |
| Einfacher Betrieb | ★★★ | ★★☆ | ★☆☆ | ★★☆ |
| Unabhängigkeit | ★☆☆ | ★☆☆ | ★☆☆ | ★★★ |

Die Sterne sind meine Erfahrung mit genau diesem Schwarm, keine allgemeine Bewertung der Produkte. Mit dem ersten Versuch hätte CrewAI beim Aufbau nur einen Stern bekommen, der Flow hat sich den zweiten verdient.

## Wo es weh tat

**CrewAI kannte das Kontextfenster nicht.** Mein erster Lauf mit Qwen kam einfach nicht vom Fleck. Im Log stand dann: „Context summarization triggered“, bei gerade mal 14'000 Tokens. CrewAI kennt das Kontextfenster von Qwen 3.8 nicht und hat mit 6963 Tokens gerechnet, obwohl das Modell eine Million kann. Also hat es den Verlauf alle paar Schritte zusammengefasst und meine Profil-Dateien ausgelagert. Für Modelle über OpenRouter gibt es dafür keinen Schalter, ich musste die Methode am Objekt selbst überschreiben. Ein Klassiker bei Open Source: Es funktioniert alles, sobald man weiss, wo man drehen muss.

**Qwen denkt gern sehr lange nach.** Ein Tipp aus der Community hat mir viel Zeit gespart: Mit einem Denkbudget von 8192 Tokens pro Anfrage wird Qwen 3.8 deutlich zügiger, ohne merklich schlechter zu werden. Bei llama.cpp heisst das `--reasoning-budget`, bei OpenRouter `reasoning.max_tokens`.

**DeepSeek hat sich einmal verdacht.** Bei einem der Tracing-Läufe hat ein einzelner Aufruf 131'072 Reasoning-Tokens erzeugt, bis das Längenlimit gegriffen hat, und das gleich mehrmals hintereinander, jedes Mal für rund 6,6 Rappen. Das Denkbudget hat DeepSeek dabei schlicht ignoriert. Seitdem gibt es eine harte Obergrenze für die Ausgabe pro Aufruf (`max_tokens`), und die hält. Ein schönes Beispiel dafür, warum man bei Modellen mit langem Nachdenken nie ohne Obergrenze arbeiten sollte.

## Mein Fazit

Brauche ich die Plattformen also gar nicht? So einfach ist es nicht. Bei CrewAI bin ich für alles selbst verantwortlich, vom Server bis zum Backup, und die offenen Modelle halten sich sichtbar weniger zuverlässig an Regeln als Claude oder GPT. Qwen hat mich auch mit dem besten Gerüst nicht überzeugt.

Dafür bekomme ich etwas, das mir keine der drei Plattformen gibt: Ich weiss genau, wo meine Daten liegen, ich kann das Modell jederzeit austauschen, und das Ganze kostet ein paar Rappen pro Tag. Die wichtigste Lektion war aber eine andere: Ein Framework will so benutzt werden, wie es gedacht ist. Solange ich CrewAI wie Claude behandelt habe, habe ich gegen das Framework gearbeitet. Mit dem Flow arbeitet es für mich. Und die Frage, ob ich einen Lead brauche, stelle ich mir ab jetzt bei jedem Agenten-System als Erstes.

Ich persönlich würde für meinen Radar inzwischen ziemlich sicher den Flow nehmen, mit DeepSeek als Modell und der Option, eines Tages auf eigene Hardware umzuziehen. Ich würde mein Geld darauf wetten, dass die offenen Modelle in einem Jahr bei der Regeltreue aufgeholt haben, und dann ist der Unterschied nur noch der Preis.

Den Code habe ich wie bei den anderen Schwärmen in einem eigenen Repo abgelegt, mit allen drei Varianten, der Docker-Konfiguration und allen Prompts, aber natürlich ohne meinen Lebenslauf und ohne Zugangsdaten.

## Warum nicht das OpenAI Agents SDK oder Google ADK?

Eine naheliegende Frage: Warum gerade CrewAI? OpenAI und Google haben mit dem Agents SDK und dem Agent Development Kit (ADK) ja ebenfalls offene Frameworks für Agenten-Teams. Und nein, die zwingen einen nicht zu ihren eigenen Modellen: Beide lassen sich laut Doku über LiteLLM oder eine OpenAI-kompatible Adresse auch mit DeepSeek, Qwen oder einem lokalen Modell betreiben.

Für mich gab es trotzdem drei Gründe. Erstens hatte ich OpenAI und Google gerade im letzten Beitrag mit ihren eigenen Plattformen verglichen, und ich wollte diesmal bewusst ein Framework, hinter dem kein Modellanbieter steht. Zweitens sind beide auf die eigenen Modelle zugeschnitten: Die Übergaben zwischen Agenten verlassen sich stark auf Function Calling, wie es GPT- und Gemini-Modelle liefern, und vieles drumherum, etwa Tracing, Auswertungen oder die Web-Oberfläche des ADK, spielt am besten mit dem eigenen Ökosystem zusammen. Mit einem kleineren offenen Modell, das schon bei CrewAI über Tool-Calls gestolpert ist, wäre ich da vermutlich nicht weiter gekommen. Und drittens passt das Denkmodell von CrewAI, ein Team aus Rollen mit Ziel und Hintergrundgeschichte, eins zu eins zu meinem Schwarm.

Ausprobiert habe ich die beiden für diesen Beitrag nicht, das ist also eine Begründung und kein Testergebnis. Zusammen mit LangGraph wären sie bestimmt einen eigenen Vergleich wert.

## Was kommt als Nächstes?

CrewAI ist ein Framework, in dem ich den Schwarm in Python zusammenbaue. Im nächsten Beitrag schaue ich mir zwei ganz andere Ansätze an: Wie weit komme ich mit **Pi** und **Hermes**, wenn ich damit ein ähnliches Schwarm-System baue? Ich bin gespannt, wie viel ich vom Flow aus diesem Beitrag dort wiederverwenden kann, und ob DeepSeek auch dort die Nase vorn hat.

<!-- serie:next -->
**Weiter in der Serie:** [Der Schwarm zieht nach Hause? (Pi, Hermes)](/blog/2026-10-29-bewerbungs-agent-pi-hermes/). Zum [Anfang von Teil 2](/blog/2026-10-28-bewerbungs-agent-geplante-aufgabe/).
<!-- serie:next-end -->

Ich freue mich auf eure Kommentare und Anregungen!
