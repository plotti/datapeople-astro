---
title: "Jev: die KI, die keine Texte generiert – und 17'363 YouTube-Kanäle für den Kinderaccount sortiert"
description: "Ein YouTube-Kids-Account soll her – mit genau den Kanälen, die bei uns im letzten Jahr wirklich geschaut wurden. Dafür habe ich den Wiedergabeverlauf aus Google Takeout extrahiert und alle 17'363 Kanäle mit Jev klassifiziert, dem KI-Modell von TypeSafe, das statt Texten kalibrierte Wahrscheinlichkeiten liefert. Die ganze Rechnung: $0.36."
pubDate: 2026-10-06
readTime: 10
category: "Machine Learning"
tags: ["Machine Learning", "Jev", "Klassifikation", "YouTube", "Kalibrierung", "Python", "KI"]
cover: "../../assets/blog/jev-youtube-kids-cover.jpg"
---

**Stand:** Oktober 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 12 Minuten

## Die Ausgangslage

Unsere Kinder sollten dieses Jahr einen eigenen YouTube-Kids-Account bekommen. Die Idee hinter YouTube Kids ist ja bestens: ein geschützter Raum, keine Kommentare, keine Videos, die für Erwachsene gemacht sind. Die Praxis ist ernüchternder – ohne gepflegte Kanalliste füllt der Empfehlungsalgorithmus die Zeit mit genau dem Zeug, das die Watchtime maximiert: laut, schnell geschnitten, inhaltlich leer.

Was ich wollte, war das Gegenteil: ein Profil mit einer kuratierten Kanalliste. Und zwar nicht auf Basis dessen, was ich *vermute*, was meine Kinder mögen – sondern auf Basis dessen, was die Daten sagen. Die Frage lautete also: **Was wurde in den letzten zwölf Monaten bei uns tatsächlich geschaut, und welche dieser Kanäle sind für Kinder geeignet?**

Die Daten liegen zum Glück alle bei mir selbst. Google [Takeout](https://takeout.google.com) exportiert den kompletten Wiedergabeverlauf – bei mir als eine einzige, rund 52 MB grosse HTML-Datei namens `Wiedergabeverlauf.html` (Takeout 4, Stand Oktober 2026). Die Zahlen daraus:

- **49'797 Videos** angesehen im letzten Jahr – die Datei hat also knapp 50'000 Zeilen
- **46'413** davon mit Kanalangabe, 3'384 ohne
- **17'363 verschiedene Kanäle**

Das ist der eigentliche Haken an der Sache. Ein YouTube-Kids-Account bekommt Kanäle zugewiesen, keine einzelnen Videos – die Aufgabe reduziert sich also von rund 50'000 Video-Entscheidungen auf 17'363 Kanal-Entscheidungen. Immer noch: 17'363 Mal googeln, was das für ein Kanal ist, und überlegen, ob das was fürs Kind ist. Bei fünf Sekunden pro Kanal sind das rund 24 Stunden reines Klicken. Nein.

## Erster Versuch: Keyword-Regeln (und warum das nichts wurde)

Der erste Reflex eines Data People ist natürlich ein Skript – okay, just kidding, aber tun wir mal so, als ob. :) Ich habe den Verlauf per Regex geparst – die deutsche Takeout-Datei ist hübsch regelmäßig aufgebaut („*Video-Titel* angesehen *Kanal* am 12.09.2026, 19:03:11 MESZ") – und Kanäle dann mit Keyword-Buckets kategorisiert:

```python
categories = {
    "Kids & Family": ["kids", "children", "cartoon", "toy", "nursery", ...],
    "Technology & Programming": ["tech", "code", "python", "linux", ...],
    "Gaming": ["gaming", "minecraft", "nintendo", ...],
    # ... 20 Kategorien, ~150 Keywords
}
```

Das Ergebnis war unterwegs brauchbar und an der entscheidenden Stelle unbrauchbar. „*Hot Wheels*" landete unter Automotive. „*The Action Lab*" – ein Wissenschaftskanal, den mein Zehnjähriger liebt – unter „Other", weil der Kanalname kein einziges Keyword enthält. Und die eigentliche Frage, *geeignet für Kinder ja/nein*, beantwortet so ein Bucket gar nicht: „Kids & Family" fängt, was „kids" im Namen trägt, und verliert alles andere.

Das ist die Grenze von Regeln: Sie matchen Zeichenketten, keine Bedeutung. Irgendwas musste die Kanalnamen *lesen*. Klassischer nächster Schritt wäre ein LLM-Prompt pro Kanal gewesen. Aber:

- **17'363 LLM-Calls** für eine Beschriftungs-Aufgabe sind teuer und träge – und mir wäre das nur für die Top 500 eingefallen, nicht für den ganzen Long Tail.
- Strukturierte Outputs lassen sich einfordern, JSON-Mode gibt es längst. Aber es bleibt generierter Text, der sich an ein Format halten soll – und genau das bricht dann gelegentlich.
- Und fragt man ein LLM, wie sicher es sich ist, bekommt man Text, der *klingt* wie eine Wahrscheinlichkeit – eine echte, kalibrierte ist das trotzdem nicht.

Genau hier kommt das Modell ins Spiel, um das es in diesem Post geht.

## Auftritt Jev

**Jev** ist ein Modell der Startup-Firma TypeSafe, über OpenRouter nutzbar – und es ist bemerkenswert, weil es *gar keinen Text generiert*. Kein Token-für-Token-Schreiben, kein Chain-of-Thought, keine Antwort in Prosa. Man reicht ihm einen Kontext („State") und eine Liste von Fragen, und es gibt für **alle Fragen gleichzeitig** kalibrierte Entscheidungswahrscheinlichkeiten zurück. Ein einziger Forward-Pass.

Der Name und das Design kommen aus Daniel Kahnemans *Thinking, Fast and Slow*:

| | System 1 *(schnell)* | System 2 *(langsam)* |
|---|---|---|
| **Mensch** | 2 × 2 = 4, ohne nachzudenken | 17 × 24 = 408, Schritt für Schritt |
| **KI** | **Jev**: Wahrscheinlichkeit in einem Durchgang, ohne Text | **LLMs & Reasoning-Modelle**: generieren Antwort und Gedankenkette Token für Token |

Ein LLM ist ein System-2-Apparat: wunderbar, wenn eine nuancierte Antwort entstehen soll, aber Overkill, wenn die Frage nur ein Urteil verlangt. Jev ist das System 1: Die Frage „Ist dieser Kanal Kindercontent?" wird nicht *beantwortet*, sie wird *bewertet*.

Dabei kann Jev drei Fragetypen, alle in einem Call:

1. **Ja/Nein-Frage** – „Ist das eine Rückerstattungsanfrage?" → `0.90`: ein einzelner Score, 90 % Wahrscheinlichkeit für „Ja".
2. **Mehrfachauswahl** – „An welches Team routen? `[Billing, Support, Sales]`" → `Billing: 0.85, Support: 0.10, Sales: 0.05` – die Verteilung ist auf die angebotenen Optionen beschränkt.
3. **Skaliert** – „Wie dringend ist die Anfrage?" → `0.88` auf einer Low-bis-Critical-Skala.

Und der Teil, der Jev für mich von „nett" zu „nützlich" macht: **Die Wahrscheinlichkeiten sind kalibriert.** Normale LLMs sind es demonstrativ nicht, und das liegt an ihrem Training: RLHF belohnt selbstbewusst klingende Antworten (Menschen mögen sie), RLVR belohnt Korrektheit, aber ignoriert, wie sicher sich das Modell dabei war. Jev wird mit **RLCD** (*Reinforcement Learning for Calibrated Decisions*) trainiert – belohnt wird, wenn die ausgegebene Wahrscheinlichkeit langfristig den tatsächlichen Ergebnissen entspricht. Wenn Jev sagt „0.80", dann ist es in 80 % dieser Fälle richtig. Nicht klingt so. Ist so.

Genau das ist der Unterschied zwischen „Das Modell sagt irgendwas zwischen 0 und 1" und „Ich kann auf 0.8 eine Regel bauen". Dazu gleich mehr.

*(Der Name ist übrigens eine kleine Pointe in sich: benannt nach William Stanley Jevons, dem Ökonomen des Jevons'schen Paradoxons – wenn man eine Ressource effizienter nutzt, steigt ihr Gesamtverbrauch, statt zu sinken. Davon mehr im Fazit.)*

## Der Code

Die API ist armselig einfach – ein POST an die Decisions-Route von OpenRouter mit State und Fragen, zurück kommen Wahrscheinlichkeiten. Das ist der Kern von `jev_classify_v2.py`, unverkürzt in der Logik (API-Key natürlich aus der Umgebungsvariable und nicht, wie in meiner ersten Version, im Klartext im Skript…):

```python
API_URL = "https://openrouter.ai/api/alpha/decisions"
MODEL   = "typesafe/jev-1.13"

KID10_QUESTIONS = {
    "kid_appealing": {
        "type": "noul",
        "instructions": (
            "Would a typical 10-year-old child find this YouTube channel's "
            "content interesting or entertaining to watch? Think like a curious "
            "10-year-old: they love restoration videos, science experiments, "
            "inventions and machines, animals, toys, tricks, building things. "
            "A channel does NOT need to be made for children to be appealing."
        ),
        "criteria": {
            "true":  "A typical 10-year-old would genuinely enjoy watching this.",
            "false": "The content requires adult interests; a 10-year-old would "
                     "find it boring or not understand it.",
        },
    },
    "kid_appropriate": {
        "type": "noul",
        "instructions": "Is this channel's content appropriate for a 10-year-old?",
        "criteria": {
            "true":  "No explicit content, graphic violence, hate speech, gambling. "
                     "Occasional mild adult language is acceptable.",
            "false": "Contains content parents would not want a 10-year-old to see.",
        },
    },
}

def classify(channel: str) -> dict:
    body = json.dumps({
        "model": MODEL,
        "state": {"channel": channel},
        "questions": KID10_QUESTIONS,
    }).encode()
    req = urllib.request.Request(API_URL, data=body, method="POST", headers={
        "Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}",
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as resp:
        ans = json.loads(resp.read())["answers"]
    return {"channel": channel,
            "kid_appealing":   ans["kid_appealing"]["noul"],
            "kid_appropriate": ans["kid_appropriate"]["noul"]}
```

Zwei Dinge, die mir dabei aufgefallen sind:

**Der State ist banal – und genau das ist der Punkt.** Ich habe pro Kanal nichts weiter als den Namen reingereicht: `"state": {"channel": "Steve Mould"}`. Kein Scraping von Kanalseiten, keine Videobeschreibungen. Die Fragen tun die Arbeit; in den `instructions` stecken ein paar Beispiel-Kinderkanäle als Mini-Few-Shot („Die Sendung mit der Maus, Löwenzahn, Woozle Goozle…"), mehr Kontext brauchte es nicht.

**Zwei Fragen, ein Call.** Der zweite Durchgang stellt pro Kanal zwei unabhängige Fragen – „interessant für einen Zehnjährigen?" und „geeignet für einen Zehnjährigen?" – und kriegt beide Wahrscheinlichkeiten in derselben Antwort. Für einen LLM-Prompt wäre das ein strukturiertes-Output-Konstrukt gewesen; hier ist es einfach ein zweiter Schlüssel im Fragen-Dictionary.

Das Ergebnis sieht dann so aus – Zeile für Zeile, mit Gebühren-Log:

```json
{"channel": "Woozle Goozle", "kid_appealing": 0.56, "kid_appropriate": 0.7}
{"channel": "Unser Sandmännchen (rbb media)", "kid_appealing": 0.39, "kid_appropriate": 0.94}
{"channel": "Veritasium", "noul": 0.02, "cost": 1.701e-05}
```

Und damit zur Frage, die Sie jetzt schon eine Weile stellen: **Was hat das gekostet?** Die API schreibt pro Entscheidung einen `cost`-Eintrag. Aufsummiert über den grossen Durchlauf mit rund 21'000 Klassifikationen:

> **Gesamtrechnung: $0.36.** Pro Entscheidung rund 0.0017 Cent.

Zum Vergleich: Schon ein recht sparsamer LLM-Call läge pro Kanal um Grössenordnungen darüber – und genau deshalb wäre meine LLM-Version ein Top-500-Stichprobendesign geworden. Mit Jev war „einfach alle 17'363“ die triviale Entscheidung. Merken Sie sich diesen Satz, er ist das Fazit dieses Posts.

## Schwellenwerte statt Bauchgefühl

Hier zahlt die Kalibrierung ein. Weil die Scores statistische Bedeutung haben, kann ich auf sie *Regeln* schreiben, und die Regeln sind Politik, nicht Vibes:

```python
# Durchgang 1: Kindercontent ja/nein
tier = "core"       if p_kid >= 0.8  else \
       "likely"     if p_kid >= 0.7  else "borderline"   # 0.5–0.69

# Durchgang 2: für den Zehnjährigen
tier = "yes"             if appeal >= 0.7 and appr >= 0.7 else \
       "watch-together"  if appeal >= 0.7 and appr >= 0.5 else "no"
```

`p ≥ 0.8` heißt bei einem kalibrierten Modell: In 8 von 10 Fällen mit diesem Score liegt das Modell richtig. Für „Kanal kommt automatisch auf den Kinderaccount" gut genug? Für mich ja – bei 10 % Fehlalarm-Rate schaue ich trotzdem drüber, aber die Masse läuft durch. Und der untere Bereich ist das eigentlich Schöne: Alles unterhalb der Schwelle landet nicht im Müll, sondern in einer **Grenzfall-Liste zur manuellen Durchsicht**. Das Modell sagt mir ehrlich, wo es unsicher ist, statt falsch selbstbewusst „Nein" zu sagen. Genau das ist der Unterschied zu einem LLM, das man per Prompt um eine Confidence-Zahl bittet.

## Die Resultate

Durchgang 1 über alle 17'363 Kanäle (46'413 Views mit Kanalzuordnung):

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

Und weil Sie es sich denken: Nein, nicht alles war goldrichtig. Mein Lieblingsfehlalarm steht mit **p = 0.74** in der „likely"-Liste: **MotherDuck** – die Data-Warehouse-Firma. Vermutlich das Entchen-Logo. (Zugegeben: Wäre mein Kind, würde ich es stolz ertragen.) Der umgekehrte Fall: Der offizielle Pokémon-Kanal liegt bei 0.70, **Der Elefant** bei 0.79 – beides hätte eindeutig als kindertauglich kategorisiert werden sollen. Hier ist das Modell zu vorsichtig; die Grenzliste lohnt die Durchsicht also in beide Richtungen. 225 Kanäle manuell sind 24 Stunden Kickarbeit auf etwa eine halbe Stunde geschrumpft.

## Zweiter Durchgang: für Kinder gemacht ≠ für mein Kind interessant

Der erste Durchgang beantwortet „Ist das Kindercontent?“. Die interessantere Frage ist eine andere: Was ist *interessant und geeignet* für meine Tochter – sie ist neun; im Prompt steht „typical 10-year-old“, ich habe grosszügig aufgerundet. Ein Kanal muss dafür nämlich nicht für Kinder gemacht sein: Restaurationsvideos, Wissenschaftler mit Sprudelkullen, Männer, die Dinge aus LEGO bauen, die niemand braucht. Deshalb derselbe Call noch einmal über die 571 meistgesehenen Kanäle (zusammen 44 % aller Views), diesmal mit den beiden Fragen von oben – ein Request pro Kanal, zwei Wahrscheinlichkeiten. Am Ende stehen **33 Kanäle**, die beide Hürden nehmen, von The Action Lab über Veritasium und Steve Mould bis Mark Rober (Appeal 0.94 – Spitzenwert).

## Wo die Grenzen liegen

Damit niemand denkt, hier lief ein Wunderwerk:

- **State ist nur Text.** Ich habe Kanalnamen reingereicht, keine Thumbnails, keine Videotexte. Bei einem Kanal namens „CHECKER WELT" (0.68) muss man schon wissen, dass das die KiKA-„Checker"-Reihe ist – der Name allein ist mehrdeutig. Mehr Kontext reinzugeben (z. B. die 10 häufigsten Videotitel pro Kanal, die ich aus dem Verlauf sowieso habe) ist der naheliegende nächste Hebel.
- **Kalibriert heißt nicht pro Fall richtig.** 0.74 für eine Datenbank-Ente. Die Statistik stimmt über viele Entscheidungen, nicht über jede.
- **Kein Reasoning, kein Rechnen.** Jev ist bewusst kein System 2: mehrstufige Schlüsse oder Zählen kann es nicht, dafür ist der LLM-Apparat daneben weiterhin zuständig.
- **Prompt-Anfällig bleibt es.** Wie alle Modelle kann adversarialer Text im State die Ausgabe verschieben. Bei Kanalnamen aus dem eigenen Verlauf ein theoretisches Risiko – in einem Produkt, das Fremdtext verarbeitet, wäre das eine Designfrage.

## Fazit

Der Kinderaccount steht jetzt: die Kern-Kinderkanäle für den kleineren Sprössling, 33 weitere für meine Neunjährige – alles abgeleitet aus einem Jahr echtem Schauverhalten statt aus Bauchgefühl und Algorithmus-Verdacht. Und wenn im nächsten Jahr der nächste Takeout ansteht: Skript nochmal laufen lassen, ein paar Cent Kosten.

Der eigentliche Punkt ist aber der Bauplan, nicht der Kinderaccount. Ich habe in den letzten Monaten etliche Posts über Foundation Models geschrieben – grosse Modelle, die in einem Forward-Pass erstaunliches leisten. Jev ist übrigens auch ein Foundation Model – vortrainiert und ohne Task-Training einsetzbar. Nur eben kein generatives: kein Text, kein Reasoning, nur Urteil – aber kalibriert, und so billig, dass Massenklassifikation zur Einzeiler-Entscheidung wird. Log-Dateien, Support-Tickets, Produktreviews, Datenbankzeilen, Wiedergabeverläufe: überall, wo man bislang entweder Stichproben zog oder die Aufgabe als „zu teuer für KI" weglegte, ist die Rechnung jetzt eine andere.

Und damit schliesst sich der Kreis zum Namenspatron: Das Jevons'sche Paradoxon besagt, dass effizientere Ressourcennutzung den Gesamtverbrauch *steigert* statt senkt. Bei $0.36 für 21'000 Entscheidungen kann ich Ihnen sagen, wie das in der Praxis aussieht – man klassifiziert plötzlich alles. Stichproben sind für Modelle, die pro Entscheidung kosten.

*Alle Zahlen in diesem Post stammen aus meinen eigenen Takeout-Exporten (Stand Oktober 2026); die Klassifikationen aus den JSONL-Artefakten der Läufe inklusive der vom API gelieferten `cost`-Felder.*

### Quellen

- [Jev (typesafe/jev-1.13) auf OpenRouter](https://openrouter.ai/typesafe/jev-1.13)
- [Video-Erklärung zu Jev (TypeSafe)](https://www.youtube.com/watch?v=YGgNBcIgI4s)
- [Daniel Kahneman: *Thinking, Fast and Slow*](https://de.wikipedia.org/wiki/Thinking,_Fast_and_Slow)
- [Jevons'sches Paradoxon](https://de.wikipedia.org/wiki/Jevons-Paradoxon)
- [Google Takeout](https://takeout.google.com)
