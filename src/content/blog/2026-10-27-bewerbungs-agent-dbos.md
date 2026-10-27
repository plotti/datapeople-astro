---
title: "Braucht es überhaupt eine Plattform? Der Bewerbungs-Agent mit DBOS"
description: "Derselbe Bewerbungs-Agent als ein Python-Prozess mit DBOS: dauerhafte Workflows in einer SQLite-Datei, Doppelprüfung über Workflow-IDs, eine selbst gebaute Prüfseite und ein Absturztest mit kill -9."
pubDate: 2026-10-27
readTime: 7
category: "AI Integration"
tags: ["DBOS", "Python", "Durable Execution", "Agenten", "Automatisierung", "Open Source"]
cover: "../../assets/blog/bewerbungs-agent-dbos-liste.png"
---

**Stand:** Oktober 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 7 Minuten

<!-- serie:start -->
> **Serie „Agenten 2026“** · Teil 1: Bewerbungs-Agenten mit festem Ablauf, fünfmal derselbe Agent
>
> - Klicken: [Wie weit kommt man mit Klicken? (n8n)](/blog/2026-09-29-bewerbungs-agent-n8n/) · [Klicken, aber womit? (n8n gegen Activepieces)](/blog/2026-10-06-n8n-vs-activepieces/)
> - Code mit Plattform: [Was bringt echter Code? (Windmill)](/blog/2026-10-13-bewerbungs-agent-windmill/) · [Braucht es einen Orchestrierer? (Kestra)](/blog/2026-10-20-bewerbungs-agent-kestra/)
> - Code ohne Plattform: **Braucht es überhaupt eine Plattform? (DBOS)** ← du bist hier
> - Teil 2: Agenten, die selbst planen (folgt)
<!-- serie:end -->

In den letzten Beiträgen ging es Schritt für Schritt Richtung Code: [n8n](/blog/2026-09-29-bewerbungs-agent-n8n/) und Activepieces zum Klicken, [Windmill](/blog/2026-10-13-bewerbungs-agent-windmill/) mit Python-Skripten in einer Plattform, [Kestra](/blog/2026-10-20-bewerbungs-agent-kestra/) mit dem ganzen Ablauf als YAML und einem Container pro Schritt. Heute kommt der letzte Schritt im ersten Teil der Serie, und der ist eigentlich ein Schritt zurück: **keine Plattform mehr**. Kein Server, den ich installiere, keine Oberfläche, in die ich mich einlogge. Nur ein Python-Prozess und eine SQLite-Datei.

Klingt nach „dann schreib halt ein Skript mit einem Cronjob“? Fast :) Der Unterschied steckt in einer kleinen Bibliothek namens **DBOS**, und genau um die geht es heute.

## Was ist DBOS eigentlich?

Die kurze Antwort: DBOS macht aus normalen Python-Funktionen Abläufe, die einen Absturz überleben. Die längere Antwort braucht ein Bild.

Stell dir ein Videospiel vor, das nach jedem Level automatisch speichert. Stürzt die Konsole ab, fängst du nicht von vorne an, sondern beim letzten Speicherpunkt. DBOS macht genau das mit deinem Code: Jede Funktion, die du als Schritt markierst, schreibt ihr Ergebnis in eine Datenbank, bevor es weitergeht. Startet der Prozess neu, liest DBOS nach, welche Abläufe noch offen sind, und spielt sie bis zum letzten gespeicherten Schritt nach, ohne die fertigen Schritte noch einmal auszuführen.

Das Besondere: Dafür braucht es keinen eigenen Dienst. Windmill und Kestra sind Server mit Datenbank, Workern und Weboberfläche. DBOS ist ein `uv add dbos`, und die „Datenbank“ ist bei mir eine einzige Datei, `state/dbos.sqlite`.

## Wie sieht der Agent aus?

Der Ablauf ist derselbe wie in allen Varianten: Newsletter von jobs.ch und x28 lesen, jede Stelle mit Firecrawl laden und von DeepSeek gegen meinen Lebenslauf bewerten, ab 70 Punkten schreibt Opus das Anschreiben, das in meine Google-Docs-Vorlage samt Unterschrift kommt, und eine Push-Nachricht holt mich zur Freigabe.

Vieles musste ich gar nicht neu schreiben. Die Module für Gmail, Firecrawl, die Modellaufrufe und ntfy habe ich fast unverändert aus der Kestra-Variante kopiert, und für die Google-Docs-Vorlage läuft dieselbe JavaScript-Datei wie bei allen anderen Werkzeugen, hier einfach mit `node` aus Python aufgerufen. Insgesamt sind es rund 650 Zeilen.

Das Herzstück ist `flow.py`. So sieht der Workflow für eine einzelne Stelle aus, leicht gekürzt:

```python
@DBOS.workflow()
async def application(job: dict) -> str:
    await DBOS.set_event_async("job", job)
    posting = await load_posting(job["url"])          # Schritt: Firecrawl
    match = await rate(job, posting["text"])          # Schritt: DeepSeek
    if match["score"] < MATCH_THRESHOLD or match["dealbreaker"]:
        await status("übersprungen")
        return "übersprungen"

    letter = await write(job, posting["text"], match)  # Schritt: Opus
    doc = await document(job, letter)                  # Schritt: Google Doc + PDF
    await push(...)                                    # Schritt: ntfy
    await status("prüfen")

    # Wartet bis zu 14 Tage auf meine Entscheidung. Währenddessen läuft nichts.
    msg = await DBOS.recv_async("review", timeout_seconds=14 * DAY)
    ...
```

Das ist ganz normales Python mit `if` und `return`. Die Magie steckt in zwei Dekoratoren: `@DBOS.workflow()` über dem Ablauf und `@DBOS.step()` über jeder Funktion, die nach aussen spricht. Wiederholungen gibt es pro Schritt gleich mit, zum Beispiel dreimal mit zehn Sekunden Abstand, wenn DeepSeek mal eine leere Antwort liefert.

## Wer steuert hier eigentlich was?

Das war auch meine erste Frage: Wenn es keinen Server gibt, wer startet morgens um 7 den Scan? Ein Cronjob? Nein. DBOS bringt einen eigenen Zeitplaner mit, der im selben Prozess läuft:

```python
DBOS.apply_schedules([{
    "schedule_name": "daily-scan",
    "workflow_fn": daily_scan,
    "schedule": "0 7 * * *",
    "cron_timezone": "Europe/Zurich",
}])
```

Der Zeitplan landet in der SQLite-Datei, und um 7 Uhr startet DBOS den Workflow `daily_scan`. Der startet pro Newsletter einen Workflow `process_mail`, und der wiederum pro Stelle einen Workflow `application`. Abläufe, die Abläufe starten, alle mit gespeichertem Zustand.

Und jetzt kommt mein Lieblingstrick. In allen anderen Varianten brauchte ich eine Tabelle, die sich merkt, welche Mails und Stellen schon bearbeitet sind. Hier nicht. Jeder Workflow bekommt eine feste ID: `mail-<Gmail-ID>` pro Newsletter, `app-<Firma+Titel>` pro Stelle. Startet man einen Workflow mit einer ID, die es schon gibt, liefert DBOS einfach den vorhandenen zurück. Die Doppelprüfung ist damit gratis.

Hat das funktioniert? Mein erster echter Scan fand in 5 Newslettern 11 neue Stellen. Eine davon hatte ich vorher schon von Hand getestet, und sie wurde nicht doppelt angelegt. Ein zweiter Scan direkt danach: kein einziger neuer Workflow ausser dem Scan selbst, keine zweite Push-Nachricht. Es gibt auch keinen Tracker mehr: Der Status jeder Bewerbung *ist* ihr Workflow.

## Die Oberfläche baust du selbst

Was DBOS nicht mitbringt, ist eine Oberfläche. Windmill hat seine Freigabeseite, Kestra seine Pause mit Auswahl. Hier gibt es: nichts. (Es gäbe mit „DBOS Conductor“ eine Cloud-Konsole, die habe ich aber bewusst weggelassen.)

Also habe ich die Prüfseite selbst geschrieben: rund 170 Zeilen FastAPI mit schlichtem HTML, ohne Frontend-Framework, im selben Prozess wie die Workflows. Die Startseite listet alle Stellen mit Score und Status:

![Die Startseite: alle Stellen mit Score und Status, ein Knopf für den Scan von Hand](../../assets/blog/bewerbungs-agent-dbos-liste.png)

Die Seite einer Stelle zeigt, warum sie passt, was fehlt, und Links zu Google-Doc und PDF. Steht sie auf `prüfen`, kann ich das Anschreiben direkt im Textfeld korrigieren und freigeben; aus dem korrigierten Text entsteht dann ein neues Doc. Ein Klick auf „Freigeben“ schickt dem wartenden Workflow eine Nachricht mit `DBOS.send_async`, und der macht dort weiter, wo er seit Stunden oder Tagen steht.

![Die Seite einer freigegebenen Stelle, Gründe und Lücken gekürzt](../../assets/blog/bewerbungs-agent-dbos-pruefseite.png)

Ist das ein Nachteil? Ein bisschen Arbeit, klar. Aber ehrlich gesagt hat es mir auch richtig Spass gemacht: Die Seite zeigt genau das, was ich brauche, auf Deutsch, auf dem Handy lesbar, und ich musste mich mit keinem Formular-Baukasten herumschlagen. Wenn ein Coding-Agent den Code schreibt, sind 170 Zeilen sowieso keine Hürde mehr.

## Der wichtigste Test: Stecker ziehen

Die ganze Idee von DBOS steht und fällt mit dem Absturz. Also habe ich genau das getestet, wie es die Anleitung vorschlägt: Eine Stelle stand auf `prüfen` und wartete auf mich. Dann:

```bash
kill -9 <uvicorn-prozess>     # kein sauberes Herunterfahren, einfach weg
uv run uvicorn agent.app:app --port 3000
```

Im Log beim Neustart:

```
Recovering 1 workflows from application version 1
```

Keine zweite Push-Nachricht, kein neues Anschreiben, kein neues Doc. Ich habe die Stelle freigegeben, und sie sprang auf `bereit`, als wäre nichts gewesen. Das ist für mich der Moment, in dem man versteht, was DBOS anders macht als ein Skript mit Cronjob.

## Wo es weh tat

Weniger als bei Kestra, aber ein paar Dinge gab es:

- **ntfy mag keine Romane.** Der erste Push scheiterte mit HTTP 500. Der Grund: DeepSeek schreibt seine Begründungen gern als Aufsätze, zusammen 4,2 KB, und ntfy.sh nimmt pro Nachricht höchstens 4 KB an. Die Push-Nachricht ist jetzt kurz, die Details stehen auf der Prüfseite.
- **Ein fehlgeschlagener Schritt bleibt fehlgeschlagen.** DBOS hat den Push fünfmal wiederholt und den Workflow dann auf `ERROR` gesetzt. Nach dem Fix dachte ich: einfach fortsetzen. Aber `resume_workflow` spielt den gespeicherten Fehler nur noch einmal ab, weil ja auch der Fehler ein gespeichertes Ergebnis ist. Die Lösung ist eine Art Zeitreise: `rewind_workflow(id, start_step=13)` setzt den Workflow genau auf den Push zurück. Gleiche ID, Brief und Doc bleiben, nur der Push läuft neu. Das hat mich zuerst geärgert und dann ziemlich begeistert :)
- **Code ändern, während Workflows warten.** DBOS setzt nach einem Neustart nur Workflows fort, deren Version zur laufenden passt. Ohne feste Versionsnummer berechnet DBOS sie aus dem Code, und jede Änderung würde wartende Bewerbungen stranden lassen. Deshalb steht in der Konfiguration eine feste `APP_VERSION`. Die Regel dazu: Prompts und Prüfseite darf ich jederzeit ändern, die Reihenfolge der Schritte nur, wenn nichts mehr offen ist.
- **Das Formular füllt niemand aus.** Die Anleitung sieht noch ein Skript vor, das am Mac das Bewerbungsformular des Arbeitgebers ausfüllt. Das habe ich gebaut, erst mit festen Regeln, dann mit einem Browser-Agenten, der selbst entscheidet, wohin er klickt. Am Testformular lief beides, an echten Portalen mit Login in neuen Tabs, Tag-Eingaben und geteilten Datumsfeldern nicht. Der Agent brauchte für ein einziges echtes Formular 32 Schritte und rund 460'000 Tokens und scheiterte trotzdem an Nationalität und Geburtsdatum. Ich habe es wieder rausgenommen; das Thema passt ohnehin besser in den zweiten Teil der Serie, wo der Agent selbst plant.

## Und wie schnell ist das?

Dieselbe Stelle wie in den letzten Beiträgen, die Zeiten kommen direkt aus der SQLite-Datei, in der DBOS jeden Schritt mit Start und Ende speichert:

| Schritt | DBOS | Windmill | Kestra |
| --- | --- | --- | --- |
| Bewerten (Firecrawl + DeepSeek) | 13,9 s | 9,9 s | 45,1 s |
| Anschreiben (Opus) | 23,8 s | 21,9 s | 71,3 s |
| Google-Doc und PDF | 8,0 s | 9,0 s | 15,9 s |
| Push | 0,4 s | 0,6 s | 37,4 s |

Kein Overhead pro Schritt, weil es keinen gibt: Ein Schritt ist ein Funktionsaufruf plus eine Zeile in SQLite. Die Unterschiede zu Windmill sind die Modelle selbst, die mal schneller und mal langsamer antworten.

## Und auf einem Server?

Für den Betrieb reicht ein Container. Das Dockerfile installiert die Abhängigkeiten mit uv und dazu node für die Docs-Vorlage; das Image ist 649 MB gross, also ein Zehntel von Windmill. Der Zustand liegt in der SQLite-Datei auf einem Volume, das Backup ist eine Kopie dieser Datei. Wichtig ist nur, dass die Prüfseite nicht im offenen Internet hängt: Der Port bindet an die Tailscale-Adresse, und Handy und Mac erreichen die Seite über das private Netz.

## Fünf Werkzeuge, ein Agent

| | n8n / Activepieces | Windmill | Kestra | DBOS |
| --- | --- | --- | --- | --- |
| Was ist es? | Plattform zum Klicken | Plattform für Skripte | Orchestrierer für YAML-Abläufe | Bibliothek |
| Die Logik steckt in | Knoten | Python-Dateien | YAML plus Skripte | ganz normalem Python |
| Freigabe | Push-Links / Approval | eingebaute Freigabeseite | Pause mit Auswahl | selbst gebaute Seite |
| Tracker | Google Sheet / Tabelle | Datentabelle | Postgres | die Workflows selbst |
| Lokal betreiben | 1 bzw. 4 Container | 5 Container, ~6 GB | 2 Container, 769 MB | ein Prozess |
| Gut für | ohne Code starten | Code mit Komfort | viele Abläufe im Team | eigener Code, volle Kontrolle |

Welche Variante würde ich behalten? Für mich persönlich ist es knapp zwischen Windmill und DBOS. Windmill gibt mir Logs, Oberfläche und Freigabe geschenkt. DBOS gibt mir dafür das Gefühl, dass mir der ganze Agent gehört: ein Repo, ein Prozess, eine Datei mit dem Zustand, kein Server, den ich pflegen muss. Und weil ein Coding-Agent die paar hundert Zeilen ohnehin schreibt, ist „selbst bauen“ heute viel weniger abschreckend als noch vor einem Jahr. Ich würde mein Geld darauf wetten, dass dieser Ansatz, kleine Bibliothek statt grosser Plattform, mit Coding-Agenten noch deutlich beliebter wird.

## Was kommt als Nächstes?

Damit ist der erste Teil der Serie fertig: fünfmal derselbe feste Ablauf, vom Klicken bis zum reinen Code. Im zweiten Teil wechseln wir endlich die Seite. Dort gibt es keinen festen Ablauf mehr, sondern einen Agenten, der selbst plant, was er als Nächstes tut. Und vielleicht schafft der dann auch das Bewerbungsformular, an dem ich diesmal gescheitert bin :)

<!-- serie:next -->
**Weiter in der Serie:** Teil 2, Agenten, die selbst planen (folgt). Zum [Anfang der Serie](/blog/2026-09-29-bewerbungs-agent-n8n/).
<!-- serie:next-end -->

Ich freue mich auf eure Kommentare und Anregungen!
