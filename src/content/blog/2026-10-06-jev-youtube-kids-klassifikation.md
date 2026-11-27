---
title: "Jev: die KI, die keine Texte generiert – und 17'363 YouTube-Kanäle für den Kinderaccount sortiert"
description: "Ein YouTube-Kids-Account soll her – mit genau den Kanälen, die bei uns im letzten Jahr wirklich geschaut wurden. Dafür habe ich den Wiedergabeverlauf aus Google Takeout extrahiert und alle 17'363 Kanäle mit Jev klassifiziert, dem KI-Modell von TypeSafe, das statt Texten kalibrierte Wahrscheinlichkeiten liefert. Die ganze Rechnung: $0.36."
pubDate: 2026-10-06
readTime: 13
category: "Machine Learning"
tags: ["Machine Learning", "Jev", "Klassifikation", "YouTube", "Kalibrierung", "Python", "KI"]
cover: "../../assets/blog/jev-youtube-kids-cover.jpg"
series: "Foundation Models"
---

**Stand:** Oktober 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 15 Minuten

## Die Ausgangslage

Unsere Kinder sollen dieses Jahr einen eigenen YouTube-Kids-Account bekommen. Die Idee hinter YouTube Kids finde ich ja ehrlich gesagt richtig gut: ein geschützter Raum, keine Kommentare, keine Videos, die eigentlich für Erwachsene gemacht sind. Nur sieht die Praxis leider anders aus. Lässt man das Profil ohne gepflegte Kanalliste laufen, füllt der Empfehlungsalgorithmus die Zeit nämlich mit genau dem Zeug, das die Watchtime maximiert: laut, schnell geschnitten und inhaltlich ungefähr so gehaltvoll wie die Verpackung eines Überraschungseis.

Was ich stattdessen wollte: ein Profil mit einer kuratierten Kanalliste, bei der ich selbst die Kontrolle habe. Und zwar nicht auf Basis dessen, was ich *vermute*, was meine Kinder mögen – meine Trefferquote an dieser Stelle ist, vorsichtig formuliert, ausbaufähig –, sondern auf Basis dessen, was die Daten über das letzte Jahr hergeben. Die Frage lautete also: **Was wurde in den letzten zwölf Monaten bei uns tatsächlich geschaut, und welche dieser Kanäle taugen für einen Kinderaccount?**

Die Daten liegen zum Glück alle bei mir selbst. Google [Takeout](https://takeout.google.com) exportiert den kompletten Wiedergabeverlauf – bei mir als eine einzige, rund 52 MB grosse HTML-Datei namens `Wiedergabeverlauf.html` (Takeout 4, Stand Oktober 2026). Die Zahlen daraus:

- **49'797 Videos** angesehen im letzten Jahr – die Datei hat also knapp 50'000 Zeilen
- **46'413** davon mit Kanalangabe, 3'384 ohne
- **17'363 verschiedene Kanäle**

Und genau da liegt der eigentliche Haken an der Sache. Ein YouTube-Kids-Account bekommt nämlich Kanäle zugewiesen und keine einzelnen Videos – die Aufgabe schrumpft damit von rund 50'000 Video-Entscheidungen auf 17'363 Kanal-Entscheidungen. Klingt erstmal nach einem Riesengewinn, und im Prinzip ist es auch einer. Aber es bleiben immer noch 17'363 Mal googeln, was das für ein Kanal ist, und anschliessend überlegen, ob das was fürs eigene Kind ist. Bei fünf Sekunden pro Kanal sind das rund 24 Stunden reines Klicken. Kann man machen – ich hatte aber Lust auf etwas Angenehmeres. :)

## Erster Versuch: Keyword-Regeln (und warum das nichts wurde)

Na ja, gut: Der erste Reflex eines Data People wäre natürlich ein Skript gewesen – okay, just kidding, der Reflex *war* ein Skript. :) Ich habe den Verlauf per Regex geparst – die deutsche Takeout-Datei ist hübsch regelmässig aufgebaut („*Video-Titel* angesehen *Kanal* am 12.09.2026, 19:03:11 MESZ") – und die Kanäle dann mit Keyword-Buckets kategorisiert:

```python
categories = {
    "Kids & Family": ["kids", "children", "cartoon", "toy", "nursery", ...],
    "Technology & Programming": ["tech", "code", "python", "linux", ...],
    "Gaming": ["gaming", "minecraft", "nintendo", ...],
    # ... 20 Kategorien, ~150 Keywords
}
```

Das Ergebnis war auf dem Papier brauchbar und in der Praxis an der entscheidenden Stelle unbrauchbar. „*Hot Wheels*" landete unter Automotive. „*The Action Lab*" – ein Wissenschaftskanal, den mein Zehnjähriger liebt – rutschte unter „Other", weil der Kanalname kein einziges der Keywords enthält. Und die Frage, die mich überhaupt erst interessiert hat – *geeignet für Kinder ja/nein* – beantwortet so ein Bucket schlicht nicht: „Kids & Family" fängt alles, was „kids" im Namen trägt, und verliert den Rest.

Das ist die klassische Grenze von Regeln: Sie matchen Zeichenketten, aber eben keine Bedeutung. Irgendetwas musste die Kanalnamen also wirklich *lesen* können. Der naheliegende nächste Schritt wäre ein LLM-Prompt pro Kanal gewesen. Aber genau da hapert es:

- **17'363 LLM-Calls** für eine reine Beschriftungs-Aufgabe sind teuer und träge. Realistisch wäre für mich nur eine Stichprobe der Top 500 gewesen – der ganze Long Tail wäre leer ausgegangen.
- Strukturierte Outputs lassen sich zwar einfordern, JSON-Mode gibt es ja längst. Aber am Ende bleibt es generierter Text, der sich an ein Format halten soll – und genau dabei bricht es dann gelegentlich.
- Und wenn man ein LLM fragt, wie sicher es sich ist, bekommt man Text, der *klingt* wie eine Wahrscheinlichkeit. Eine echte, kalibrierte ist das trotzdem keine.

Damit sind wir auch schon beim Modell, um das es in diesem Post geht.

## Auftritt Jev

**Jev** ist ein Modell der Startup-Firma TypeSafe, über OpenRouter nutzbar – und es ist deshalb so bemerkenswert, weil es *gar keinen Text generiert*. Kein Token-für-Token-Schreiben, kein Chain-of-Thought, keine Antwort in Prosa. Man reicht ihm einen Kontext („State") und eine Liste von Fragen, und zurück kommen für **alle Fragen gleichzeitig** kalibrierte Entscheidungswahrscheinlichkeiten. Ein einziger Forward-Pass, fertig.

Der Name und das Design kommen aus Daniel Kahnemans *Thinking, Fast and Slow*:

| | System 1 *(schnell)* | System 2 *(langsam)* |
|---|---|---|
| **Mensch** | 2 × 2 = 4, ohne nachzudenken | 17 × 24 = 408, Schritt für Schritt |
| **KI** | **Jev**: Wahrscheinlichkeit in einem Durchgang, ohne Text | **LLMs & Reasoning-Modelle**: generieren Antwort und Gedankenkette Token für Token |

Ein LLM ist damit eher ein System-2-Apparat: wunderbar, wenn am Ende eine nuancierte Antwort stehen soll, aber klarer Overkill, wenn die Frage nur ein Urteil verlangt. Jev ist das Gegenstück dazu, das System 1: Die Frage „Ist dieser Kanal Kindercontent?" wird hier nicht erst ausformuliert und dann beantwortet – sie geht direkt rein und kommt als Wahrscheinlichkeit wieder raus.

Dabei kann Jev drei Fragetypen, alle im selben Call:

1. **Ja/Nein-Frage** – „Ist das eine Rückerstattungsanfrage?" → `0.90`: ein einzelner Score, 90 % Wahrscheinlichkeit für „Ja".
2. **Mehrfachauswahl** – „An welches Team routen? `[Billing, Support, Sales]`" → `Billing: 0.85, Support: 0.10, Sales: 0.05` – die Verteilung ist auf die angebotenen Optionen beschränkt.
3. **Skaliert** – „Wie dringend ist die Anfrage?" → `0.88` auf einer Low-bis-Critical-Skala.

Und der Teil, der Jev für mich von „nett" zu „nützlich" gehoben hat: **Die Wahrscheinlichkeiten sind kalibriert.** Normale LLMs sind das demonstrativ nicht, und das liegt an ihrem Training: RLHF belohnt selbstbewusst klingende Antworten (Menschen mögen die einfach gern), RLVR belohnt Korrektheit, ignoriert aber, wie sicher sich das Modell dabei war. Jev wird mit **RLCD** (*Reinforcement Learning for Calibrated Decisions*) trainiert – belohnt wird, wenn die ausgegebene Wahrscheinlichkeit langfristig mit den tatsächlichen Ergebnissen übereinstimmt. Wenn Jev also „0.80" sagt, dann liegt es in 80 % dieser Fälle richtig. Also nicht: klingt so, als wäre es so. Sondern: die 80 % stimmen auch tatsächlich.

Das ist genau der Unterschied zwischen „Das Modell spuckt irgendetwas zwischen 0 und 1 aus" und „Ich kann auf 0.8 eine Regel bauen". Wie so eine Regel konkret aussieht, zeige ich weiter unten.

*(Der Name ist übrigens eine kleine Pointe in sich: benannt nach William Stanley Jevons, dem Ökonomen des Jevons'schen Paradoxons – wenn man eine Ressource effizienter nutzt, steigt ihr Gesamtverbrauch, statt zu sinken. Davon mehr im Fazit.)*

## Der Code

Die API ist fast schon peinlich einfach: ein POST an die Decisions-Route von OpenRouter mit State und Fragen, zurück kommen Wahrscheinlichkeiten. Das ist der Kern von `jev_classify_v2.py`, unverkürzt in der Logik (API-Key natürlich aus der Umgebungsvariable und nicht, wie in meiner ersten Version, im Klartext im Skript…):

```python
API_URL = "https://openrouter.ai/api/alpha/decisions"
MODEL   = "typesafe/jev-1.13"

KID_QUESTION = {
    "is_kid_content": {
        "type": "noul",
        "instructions": (
            "Is this YouTube channel's content made for children — "
            "topics, tone and pacing aimed at a child audience?"
        ),
        "criteria": {
            "true":  "The channel produces children's content.",
            "false": "The content targets an adult or general audience.",
        },
    },
}

def classify(channel: str) -> dict:
    body = json.dumps({
        "model": MODEL,
        "state": {"channel": channel},
        "questions": KID_QUESTION,
    }).encode()
    req = urllib.request.Request(API_URL, data=body, method="POST", headers={
        "Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}",
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as resp:
        ans = json.loads(resp.read())["answers"]
    return {"channel": channel,
            "p_kid": ans["is_kid_content"]["noul"]}
```

Zwei Dinge, die mir dabei aufgefallen sind:

**Der State ist banal – und genau deshalb gefällt er mir so gut.** Ich habe pro Kanal nichts weiter als den Namen reingereicht: `"state": {"channel": "Steve Mould"}`. Kein Scraping von Kanalseiten, keine Videobeschreibungen, nichts. Die eigentliche Arbeit machen die Fragen: In den `instructions` steht, wonach überhaupt geurteilt wird, und in den `criteria`, was „true" und „false" überhaupt bedeuten soll. Dazu ein paar Beispiel-Kinderkanäle als Mini-Few-Shot („Die Sendung mit der Maus, Löwenzahn, Woozle Goozle…") – und mehr Kontext hat es wirklich nicht gebraucht.

**Ein Call pro Kanal.** Pro Kanal geht genau ein Request raus und kommt mit einem einzigen Urteil wieder zurück. Mit einem LLM wäre das ein strukturiertes-Output-Konstrukt geworden, mit Prompt-Anleitung und gebetsmühlenartiger Hoffnung, dass der JSON-Block diesmal hält; hier ist die Antwort schlicht ein Feld im Antwort-Objekt.

Das Ergebnis sieht dann so aus – Zeile für Zeile, inklusive Gebühren-Log:

```json
{"channel": "Woozle Goozle", "noul": 0.95}
{"channel": "Unser Sandmännchen (rbb media)", "noul": 0.97}
{"channel": "Veritasium", "noul": 0.02, "cost": 1.701e-05}
```

Und damit zur Frage, die du dir vermutlich schon eine Weile stellst: **Was hat das gekostet?** Die API schreibt pro Entscheidung einen `cost`-Eintrag. Aufsummiert über den grossen Durchlauf mit rund 21'000 Klassifikationen:

> **Gesamtrechnung: $0.36.** Pro Entscheidung rund 0.0017 Cent.

Zum Vergleich: Schon ein recht sparsamer LLM-Call läge pro Kanal um Grössenordnungen darüber – und genau deshalb wäre meine LLM-Version ein Top-500-Stichprobendesign geworden. Mit Jev war „einfach alle 17'363" die triviale Entscheidung. Merk dir diesen Satz, er kommt im Fazit noch einmal zurück. :)

## Schwellenwerte statt Bauchgefühl

Und hier zahlt sich die Kalibrierung dann richtig aus. Weil die Scores eine statistische Bedeutung haben, kann ich darauf *Regeln* bauen – und die lege ich bewusst als klare Politik fest, nicht als Bauchgefühl:

```python
# Kindercontent ja/nein
tier = "core"       if p_kid >= 0.8  else \
       "likely"     if p_kid >= 0.7  else "borderline"   # 0.5–0.69
```

`p ≥ 0.8` heisst bei einem kalibrierten Modell: In 8 von 10 Fällen mit diesem Score liegt das Modell richtig. Ist das gut genug, um einen Kanal automatisch auf den Kinderaccount zu legen? Für mich ja – bei einer Fehlalarm-Rate von 10 % schaue ich trotzdem kurz drüber, aber die Masse läuft einfach durch. Und der untere Bereich ist eigentlich das Schönste an der ganzen Geschichte: Alles unterhalb der Schwelle landet nicht im Müll, sondern auf einer **Grenzfall-Liste zur manuellen Durchsicht**. Das Modell sagt mir ehrlich, wo es unsicher ist, statt falsch selbstbewusst „Nein" zu sagen. Von einem LLM, dem man per Prompt eine Confidence-Zahl entlockt, bekommt man dagegen eine Zahl ohne jede Gewähr.

## Die Resultate

Die Klassifikation über alle 17'363 Kanäle (46'413 Views mit Kanalzuordnung):

- **170 Kern-Kinderkanäle** (p ≥ 0.80)
- **66 weitere wahrscheinliche** (0.70–0.79)
- **225 Grenzfälle** (0.50–0.69) – manuelle Durchsicht
- **Insgesamt 461 Kinderkanäle = 9.8 % aller Views**

Die Spitze der Kern-Liste liest sich wie ein deutsches Fernsehen der letzten vier Jahrzehnte:

| Kanal | p(kid) | Views |
|---|---:|---:|
| Woozle Goozle | 0.95 | 943 |
| Shaun das Schaf | 0.94 | 367 |
| Unser Sandmännchen (rbb media) | 0.97 | 357 |
| Die Maus | 0.86 | 320 |
| Der kleine Maulwurf | 0.92 | 228 |
| Art Attack auf Deutsch | 0.85 | 102 |
| KiKA von ARD und ZDF | 0.96 | 34 |
| Peppa Pig Deutsch – Offizieller Kanal | 0.99 | 3 |

Und weil du es dir vermutlich schon denkst: Nicht alles war goldrichtig. Mein Lieblingsfehlalarm steht mit **p = 0.74** in der „likely"-Liste: **MotherDuck** – die Data-Warehouse-Firma. Vermutlich wegen des Entchen-Logos. (Zugegeben: Wäre das mein Kind, würde ich es stolz ertragen.) Der umgekehrte Fall sieht so aus: Der offizielle Pokémon-Kanal liegt bei 0.70, **Der Elefant** bei 0.79 – beides hätte eindeutig als kindertauglich durchgehen sollen. Hier war das Modell zu vorsichtig; die Grenzliste lohnt die Durchsicht also in beide Richtungen. Immerhin: 225 Kanäle manuell durchgehen ist von 24 Stunden Kickarbeit auf etwa eine halbe Stunde geschrumpft.

## Und wie gut ist Jev im Vergleich?

Schön und gut, wirst du jetzt vielleicht sagen – aber ist Jev auch *besser* als die Alternativen? Meine YouTube-Kanäle taugen dafür nicht, denn sie sind eine Anekdote: Es gibt keine richtige Antwort, gegen die ich messen könnte. Also habe ich die öffentlichen Benchmarks nachgebaut, die [AIMLAPI](https://aimlapi.com/blog/what-is-jev) für Jev veröffentlicht hat – in einer leichten Version, aber mit denselben Daten und derselben Stichprobe (300 Beispiele pro Aufgabe, Seed 42). Das Schöne daran: Die drei Aufgaben decken genau die drei Fragetypen von oben ab.

| Aufgabe | Datensatz | Fragetyp |
|---|---|---|
| **Anfragen routen** | [Banking77](https://huggingface.co/datasets/PolyAI/banking77): Kundenanfragen an eine Bank, 77 Absichten | Mehrfachauswahl |
| **Moderation** | [TweetEval offensive](https://huggingface.co/datasets/cardiffnlp/tweet_eval): Ist der Tweet beleidigend? | Ja/Nein |
| **Antworten bewerten** | [HelpSteer2](https://huggingface.co/datasets/nvidia/HelpSteer2): Wie hilfreich ist eine KI-Antwort, 0 bis 4, von Menschen bewertet | Skaliert |

Gegen Jev antreten mussten zwei Sprachmodelle ohne Training – **Mistral Small** und **Gemma 4 31B** mit offenen Gewichten, beide mit denselben Anweisungen und Optionen wie Jev – und zwei klassische Verfahren, die aus den Trainingsdaten der jeweiligen Aufgabe lernen (bis 10'000 Beispiele): **TF-IDF mit Logistischer Regression** und **Open-Source-Embeddings** (multilingual-e5-small, lokal) mit Logistischer Regression.

**Erst mal: Lassen sich die veröffentlichten Zahlen bestätigen?** Weitgehend ja:

| Jev-1.13 | Banking77 (Genauigkeit) | Moderation (F1) | Antworten bewerten (Spearman) |
|---|---:|---:|---:|
| veröffentlicht von AIMLAPI | 78.3 % | 0.70 | 0.39 |
| mein Nachbau | 80.3 % | 0.67 | 0.33 |

**Und jetzt der eigentliche Vergleich:**

| Kandidat | Banking77 Genauigkeit | Moderation F1 | Bewerten Spearman | Kosten (alle 900) |
|---|---:|---:|---:|---:|
| **Jev-1.13** | 80 % | **0.67** | **0.33** | $0.041 |
| Mistral Small | 71 % | 0.63 | 0.24 | $0.040 |
| Gemma 4 31B (offene Gewichte) | 78 % | 0.55 | 0.32 | $0.064 |
| TF-IDF + Logistische Regression | 88 % | 0.58 | 0.29 | 0 |
| Embeddings + Logistische Regression | **92 %** | **0.67** | 0.24 | 0 |

Unter den drei Modellen ohne Training ist Jev auf allen drei Aufgaben vorne – und dabei das schnellste: eine Fünftelsekunde pro Entscheidung, Mistral und Gemma brauchen das Zwei- bis Vierfache. Spannender finde ich aber drei andere Dinge:

**Mit Trainingsdaten gewinnt beim Routen das klassische ML.** Sobald es gelabelte Beispiele gibt, sind TF-IDF und Embeddings bei Banking77 mit 88 und 92 % klar besser als jedes Modell ohne Training – kostenlos und lokal. Bei der Moderation zieht nur noch das Embedding-Verfahren mit Jev gleich, und beim Bewerten liegen beide sogar dahinter. Jev und Co. sind also vor allem dort stark, wo es **keine oder kaum Labels gibt** – so wie bei meinen 17'363 YouTube-Kanälen.

**Die Konfidenz ist der eigentliche Unterschied.** Was passiert, wenn ich nur Antworten mit einer Sicherheit von mindestens 0.9 automatisch übernehme und den Rest von Hand anschaue?

| Kandidat | Banking77: automatisch durch | … davon richtig | Moderation: automatisch durch | … davon richtig |
|---|---:|---:|---:|---:|
| Jev-1.13 | 66 % | 92 % | 44 % | 98 % |
| Gemma 4 31B | 83 % | 86 % | 69 % | 88 % |
| Mistral Small | 99 % | 72 % | 100 % | 81 % |

Mistral sagt praktisch bei jeder Anfrage, es sei sich zu mindestens 90 % sicher – und liegt trotzdem bei mehr als jeder vierten daneben. Eine Schwelle auf dieser Zahl ist wertlos, genau das meinte ich weiter oben mit „eine Zahl ohne jede Gewähr“. Bei Jev hält die Schwelle, was sie verspricht. Gemessen als Kalibrierungsfehler (ECE, kleiner ist besser) liegt Jev bei 0.08 (Banking77) und 0.06 (Moderation), Mistral bei 0.26 und 0.18.

**Beim Bewerten stossen alle an ihre Grenzen.** Ob eine KI-Antwort eine 3 oder eine 4 verdient, ist offenbar schwer zu treffen: Kein Kandidat kommt über eine Korrelation von 0.33 mit dem menschlichen Urteil, und auch Jevs Kalibrierung bricht hier ein (ECE 0.32 – das hatte AIMLAPI ebenfalls gesehen). Und eine Warnung zu einer Kennzahl, die gern zitiert wird: Wer bei HelpSteer2 *immer* „3“ antwortet, liegt bei 84 % der Antworten höchstens einen Punkt daneben – besser als jedes Modell in meinem Test. „Innerhalb eines Punktes“ sagt hier also nichts aus. Für meine Kinderkanäle heisst das alles: Die Frage „Ist das für Kinder gemacht?“ ist eine klare Ja/Nein-Frage zum Inhalt – genau die Sorte Frage, bei der Jev am besten und am ehrlichsten ist.

Der ganze Nachbau hat übrigens 15 Cent gekostet.

## Wo die Grenzen liegen

Damit hier niemand auf die Idee kommt, es hätte ein Wunderwerk laufen:

- **State ist nur Text.** Ich habe Kanalnamen reingereicht, keine Thumbnails, keine Videotexte. Bei einem Kanal namens „CHECKER WELT" (0.68) muss man schon wissen, dass das die KiKA-„Checker"-Reihe ist – der Name allein ist mehrdeutig. Mehr Kontext reinzugeben (z. B. die 10 häufigsten Videotitel pro Kanal, die ich aus dem Verlauf sowieso habe) ist der naheliegende nächste Hebel.
- **Kalibriert heisst nicht pro Fall richtig.** 0.74 für eine Datenbank-Ente. Die Statistik stimmt über viele Entscheidungen hinweg, nicht über jede einzelne.
- **Kein Reasoning, kein Rechnen.** Jev ist bewusst kein System 2: Mehrstufige Schlüsse oder Zählen kann es nicht – dafür ist der LLM-Apparat daneben weiterhin zuständig.
- **Prompt-Anfällig bleibt es.** Wie alle Modelle lässt es sich durch adversarialen Text im State beeinflussen. Bei Kanalnamen aus dem eigenen Verlauf ist das ein rein theoretisches Risiko – in einem Produkt, das Fremdtext verarbeitet, wäre das aber eine echte Designfrage.

## Fazit

Der Kinderaccount steht jetzt: 170 Kern-Kinderkanäle, 66 Wahrscheinliche obendrauf, dazu die Treffer aus einer halben Stunde Grenzfall-Durchsicht – alles abgeleitet aus einem Jahr echtem Schauverhalten statt aus Bauchgefühl und Algorithmus-Verdacht. Und wenn im nächsten Jahr der nächste Takeout ansteht: Skript nochmal laufen lassen, ein paar Cent Kosten, fertig.

Der eigentlich interessante Punkt ist aber der Bauplan, nicht der Kinderaccount. Ich habe in den letzten Monaten etliche Posts über Foundation Models geschrieben – grosse Modelle, die in einem Forward-Pass Erstaunliches leisten. Jev ist übrigens auch ein Foundation Model – vortrainiert und ohne Task-Training einsetzbar. Nur eben kein generatives: kein Text, kein Reasoning, nur Urteile. Dafür kalibriert, und so billig, dass Massenklassifikation keine Budgetfrage mehr ist, sondern ein Einzeiler im Skript. Log-Dateien, Support-Tickets, Produktreviews, Datenbankzeilen, Wiedergabeverläufe: Überall, wo man bislang entweder Stichproben gezogen oder die Aufgabe als „zu teuer für KI" beiseitegelegt hat, sieht die Rechnung jetzt anders aus.

Und damit schliesst sich der Kreis zum Namenspatron: Das Jevons'sche Paradoxon besagt, dass effizientere Ressourcennutzung den Gesamtverbrauch *steigert* statt senkt. Bei $0.36 für 21'000 Entscheidungen kann ich dir sagen, wie das in der Praxis aussieht – man klassifiziert plötzlich alles. Und das ist auch in Ordnung so: Stichproben braucht man nur dort, wo jede einzelne Entscheidung Geld kostet.

*Alle Zahlen in diesem Post stammen aus meinen eigenen Takeout-Exporten (Stand Oktober 2026); die Klassifikationen aus den JSONL-Artefakten der Läufe inklusive der vom API gelieferten `cost`-Felder.*

### Quellen

- [Jev (typesafe/jev-1.13) auf OpenRouter](https://openrouter.ai/typesafe/jev-1.13)
- [Video-Erklärung zu Jev (TypeSafe)](https://www.youtube.com/watch?v=YGgNBcIgI4s)
- [Daniel Kahneman: *Thinking, Fast and Slow*](https://de.wikipedia.org/wiki/Thinking,_Fast_and_Slow)
- [Jevons'sches Paradoxon](https://de.wikipedia.org/wiki/Jevons-Paradoxon)
- [Google Takeout](https://takeout.google.com)
- [AIMLAPI: What Is Jev? TypeSafe's Decision Model, Tested Against LLMs](https://aimlapi.com/blog/what-is-jev)
- [Banking77](https://huggingface.co/datasets/PolyAI/banking77), [TweetEval](https://huggingface.co/datasets/cardiffnlp/tweet_eval), [HelpSteer2](https://huggingface.co/datasets/nvidia/HelpSteer2)
- [intfloat/multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small)
