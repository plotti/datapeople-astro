---
title: "Claude Code günstiger nutzen: Z.ai, Zed und mein 30-Dollar-Setup"
description: "Claude Pro stösst bei intensiven Coding-Sessions schnell an Limits. Statt einen grösseren Tarif zu buchen: Z.ai mit GLM als zweites Backend in Claude Code, ein Umschalt-Skript, Zed statt Cursor – für insgesamt 30 US-Dollar im Monat."
pubDate: 2026-09-17
readTime: 7
category: "KI Tools"
tags: ["Claude Code","Z.ai","Zed","Kostenoptimierung"]
cover: "../../assets/blog/claude-code-zai-zed.svg"
---

**Stand:** September 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 7 Minuten

Claude Code passt zu meiner Arbeitsweise. Das Nutzungskontingent von Claude Pro weniger: Bei intensiven Coding-Sessions erreiche ich das Limit häufig, bevor die Aufgabe erledigt ist. Statt einen grösseren Tarif zu buchen, habe ich Z.ai ergänzt.

Heute verwende ich Claude Code mit zwei getrennten Konfigurationen: eine für Claude, eine für GLM von Z.ai. Als Editor nutze ich Zed; Cursor habe ich gekündigt. Meine beiden Modell-Abos kosten zusammen **30 US-Dollar im Monat**.

Dazwischen lagen Versuche mit Hermes Agent und Proxies, Ärger über Anthropics Zugriffsbeschränkungen und die Erkenntnis, dass ein manueller Umschalter für meinen Bedarf genügt.

## Claude Pro: Das Fünf-Stunden-Fenster ist keine Arbeitszeitgarantie

Claude Pro kostet im monatlich abgerechneten US-Tarif 20 US-Dollar. Das Abo hat ein sitzungsbezogenes Fünf-Stunden-Limit sowie ein Wochenlimit. Claude und Claude Code teilen sich das Kontingent. Das beschreibt Anthropic in seiner [Dokumentation zur Nutzung von Claude Code mit Pro und Max](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan).

**Fünf Stunden bedeuten nicht fünf Stunden ununterbrochene Nutzung.** Das verfügbare Kontingent kann deutlich früher ausgeschöpft sein. Der Verbrauch hängt unter anderem vom Modell, der Kontextlänge und der Aufgabe ab.

Beim agentischen Programmieren löst ein kurzer Auftrag oft zahlreiche Modellanfragen aus: Dateien lesen, Werkzeuge ausführen, Ergebnisse auswerten, Änderungen prüfen. Entsprechend wenig sagt die Anzahl meiner eigenen Eingaben über den Verbrauch aus.

Umgangssprachlich sind dann «die Tokens aufgebraucht». Tatsächlich verkauft Anthropic mit Pro aber keine fest zugesicherte Tokenmenge. Für meine längeren Coding-Sessions war das Kontingent häufig zu knapp. Ich wollte weiterarbeiten können, ohne jedes Mal Zusatznutzung oder einen grösseren Tarif zu bezahlen.

## Z.ai in Claude Code: gleicher Client, anderes Modell

Z.ai liess sich direkt in meinen bestehenden Workflow einbauen. Claude Code bleibt dabei der Client, während ein GLM-Modell die Anfragen verarbeitet.

Die [offizielle Z.ai-Anleitung](https://docs.z.ai/devpack/tool/claude) beschreibt die Einrichtung über einen Anthropic-kompatiblen Endpunkt. Dafür werden `ANTHROPIC_BASE_URL`, der Zugangsschlüssel und die Modellzuordnungen angepasst.

Für viele meiner alltäglichen Programmieraufgaben waren die Ergebnisse brauchbar. Das ist eine persönliche Erfahrung, kein Nachweis, dass GLM und Claude gleichwertig sind. Dafür müsste ich identische Aufgaben unter vergleichbaren Bedingungen testen und insbesondere den Korrekturaufwand messen.

**Für meinen bestehenden Z.ai-Tarif bezahle ich 10 US-Dollar monatlich.** Das ist nicht der heute allgemein verfügbare Einstiegspreis: Die aktuelle [Produktübersicht](https://docs.z.ai/devpack/overview) nennt einen Einstieg ab 18 US-Dollar.

Auch Z.ai hat Fünf-Stunden- und Wochenlimits. Modellwahl und Aufgabenkomplexität beeinflussen den Verbrauch. Für mich war der Vorteil deshalb nicht unbegrenzte Nutzung, sondern ein günstiger zweiter Zugang.

Zunächst stellte ich meine Konfiguration allerdings vollständig auf Z.ai um. Mein Claude-Abo lief weiter, wurde aber kaum noch genutzt. Ich hatte einen günstigeren Anbieter gefunden, ohne meine bezahlten Zugänge sinnvoll aufzuteilen.

## Hermes Agent und Anthropics Zugriffsbeschränkungen

Mit Hermes Agent wollte ich beide Zugänge in einem gemeinsamen Workflow verfügbar machen: Claude für ausgewählte Aufgaben, GLM für den Rest.

Eine Weile funktionierte mein Aufbau. Dann scheiterte der verwendete Subscription-Zugriff mit dieser Meldung:

> This credential is only authorized for use with Claude Code.

Ein Claude-Pro-Abo enthält kein allgemeines API-Guthaben. Seine OAuth-Zugangsdaten sind deshalb auch kein universeller API-Schlüssel für andere Anwendungen. Dass ein Zugangsweg technisch funktioniert hatte, bedeutete nicht automatisch, dass Anthropic ihn unterstützte.

Am 9. Januar 2026 berichtete [VentureBeat über verschärfte Kontrollen gegen Drittanbieter-Clients](https://venturebeat.com/technology/anthropic-cracks-down-on-unauthorized-claude-usage-by-third-party-harnesses), die sich gegenüber Anthropic als Claude Code ausgaben. Betroffen waren unter anderem Workflows mit OpenCode.

### Warum die Entwickler-Community verärgert war

VentureBeat dokumentierte deutliche Kritik. Rails-Entwickler David Heinemeier Hansson kommentierte:

> Seems very customer hostile.

Der Einwand betroffener Nutzer war nachvollziehbar: Warum sollte die Nutzung eines bezahlten Kontingents davon abhängen, welchen Client man bevorzugt?

Anthropic verwies unter anderem auf ungewöhnliche Zugriffsmuster und schwer diagnostizierbare Probleme mit fremden Clients. Laut Bericht räumte das Unternehmen zugleich irrtümliche Kontosperren durch automatische Missbrauchsfilter ein. Diese sollten rückgängig gemacht werden; die Zugriffsbeschränkungen selbst waren beabsichtigt.

**Für mich war das eine kundenunfreundliche Umsetzung einer nachvollziehbaren geschäftlichen Grenze.** Anthropic darf Subscription und API voneinander abgrenzen. Wenn dabei bestehende Arbeitsabläufe wegbrechen und Konten irrtümlich gesperrt werden, kostet das Nutzer Zeit und Vertrauen.

Ein pauschales Verbot sämtlicher Integrationen folgt daraus nicht. Den regulären Claude-Code-Client innerhalb eines Editors auszuführen, ist etwas anderes, als dessen Zugangsdaten für eigene Modellanfragen zu übernehmen.

Anschliessend probierte ich noch Proxies aus, um beide Anbieter hinter einer Schnittstelle zusammenzuführen. Sie lösten das Berechtigungsproblem nicht; eines der angesehenen Projekte war zudem archiviert. Damit war der Integrationsversuch für mich beendet.

## Subventionierte KI-Abos sind keine API-Flatrates

Die günstigen KI-Abos bilden die Kosten intensiver Nutzung nicht zwingend ab. Dafür gibt es öffentliche Hinweise, aber keine vollständigen, geprüften Kostenrechnungen pro Tarif.

[The Decoder berichtete im März 2026 unter Berufung auf Forbes](https://the-decoder.com/anthropics-claude-code-subscription-may-consume-up-to-5000-in-compute-per-month-while-charging-the-user-just-200/) über negative Margen bei Cursors Consumer-Abos und Schätzungen zu stark subventionierter Claude-Code-Nutzung im 200-Dollar-Tarif. Ein Teil dieser Einschätzungen stammte aus dem Umfeld des Wettbewerbers Cursor.

Daraus lässt sich weder eine konkrete Subvention für jedes 20-Dollar-Abo ableiten noch beweisen, dass jeder Nutzer Verluste verursacht. Auch API-Listenpreise sind keine internen Rechenkosten.

Für meine Planung reicht die vorsichtigere Schlussfolgerung: **Ein günstiges Abo ist keine Garantie auf dauerhaft gleichbleibende Kapazität oder frei wählbare Zugangswege.** Subventionierte Nutzung erklärt den Druck auf Limits und Preise, rechtfertigt aber nicht jede Einschränkung.

### OpenRouter als Alternative

Für einen gemeinsamen API-Zugang zu mehreren Modellanbietern gibt es OpenRouter. Der Dienst bündelt Modelle, Routing und Abrechnung, ohne dass ich einen eigenen Proxy betreiben muss.

Laut [OpenRouter-Dokumentation](https://openrouter.ai/docs/faq) werden die jeweiligen Inferenzpreise ohne Aufschlag weitergegeben. Beim regulären Guthabenkauf fallen derzeit 5,5 Prozent Gebühr an, mindestens 0,80 US-Dollar.

OpenRouter übernimmt aber weder mein Claude-Pro-Kontingent noch meinen Z.ai-Coding-Plan. Es ist eine separate, verbrauchsabhängig abgerechnete Alternative. Für gelegentliche Modellwechsel kann das passen; bei langen Agentenläufen muss ich die Kosten im Blick behalten.

## Mein Switcher: zwei Konfigurationen statt eines Gateways

Heute wähle ich vor dem Start von Claude Code das gewünschte Backend. Ein Skript kopiert die passende Konfiguration nach `~/.claude/settings.json`; danach starte ich eine neue Sitzung.

<details>
<summary><strong>Shell-Skript zum Wechsel zwischen Claude und Z.ai</strong></summary>

Die beiden Quelldateien müssen bereits korrekt eingerichtet sein. Vor der ersten Verwendung sollte die bestehende Konfiguration gesichert werden.

```bash
#!/usr/bin/env bash
# Datei: ~/.claude/switch.sh

set -euo pipefail
umask 077

CLAUDE_DIR="$HOME/.claude"
TARGET="$CLAUDE_DIR/settings.json"

case "${1:-}" in
  zai)
    SOURCE="$CLAUDE_DIR/settings_z.json"
    ;;
  claude)
    SOURCE="$CLAUDE_DIR/settings.json.bak"
    ;;
  *)
    printf 'Verwendung: %s [zai|claude]\n' "$0" >&2
    exit 1
    ;;
esac

if [[ ! -r "$SOURCE" ]]; then
  printf 'Konfiguration nicht lesbar: %s\n' "$SOURCE" >&2
  exit 1
fi

TEMP_FILE="$(mktemp "$CLAUDE_DIR/.settings.XXXXXX")"
trap 'rm -f "$TEMP_FILE"' EXIT

cp "$SOURCE" "$TEMP_FILE"
chmod 600 "$TEMP_FILE"
mv -f "$TEMP_FILE" "$TARGET"

printf 'Konfiguration gewählt: %s\n' "$1"
```

Mit Z.ai starten:

```bash
bash ~/.claude/switch.sh zai && claude
```

Zurück zu Claude:

```bash
bash ~/.claude/switch.sh claude && claude
```

Das Skript ersetzt die gesamte Einstellungsdatei. Gemeinsame Einstellungen müssen in beiden Profilen gepflegt werden; parallele Sitzungen mit unterschiedlichen Backends sind damit nicht sauber getrennt.

Shell-Variablen und projektbezogene Einstellungen können die wirksame Konfiguration beeinflussen. Im nativen Profil dürfen keine Z.ai-Zugangsdaten übrig bleiben. Nach dem Wechsel den aktiven Zugang prüfen, unter anderem mit `/status`.

Dateien mit Zugangsschlüsseln gehören nicht ins Git-Repository. Die Änderung interner Onboarding-Daten aus meinem ursprünglichen Skript ist hier bewusst entfernt.

</details>

Bei Kundencode reicht die technische Prüfung nicht: Mit dem Backend wechselt der Empfänger der Modellanfragen. Datenschutz, Verträge und interne Anbieterfreigaben müssen diesen Wechsel abdecken.

## Cursor gekündigt, Zed mit Z.ai behalten

Cursor öffnete ich inzwischen selten, bezahlte aber weiterhin 20 US-Dollar monatlich. Also habe ich gekündigt.

Nicht wegen fehlender Anschlussmöglichkeiten: Cursor unterstützt [eigene API-Schlüssel](https://cursor.com/docs/settings/api-keys). Das Cursor-Abo lässt sich dadurch allerdings nicht als Modellguthaben in anderen Programmen verwenden.

Heute arbeite ich in Zed mit Z.ai, ohne zusätzliches Zed-KI-Abo. Wer das nachbaut, muss die Tarifbedingungen prüfen: Z.ai beschränkt seinen Coding-Plan auf unterstützte Werkzeuge und Szenarien. Ein funktionierender API-Endpunkt beweist noch nicht, dass die Nutzung vom Abo gedeckt ist.

Auch Claude bleibt in Zed möglich. Die [Zed-Dokumentation zu bestehenden Subscriptions](https://zed.dev/docs/ai/use-an-existing-subscription) beschreibt unterstützte Agenten- und Terminal-Wege. Den nativen Claude-Code-Client im Terminal zu verwenden, ist aber nicht dasselbe, wie Claude Pro als Backend für sämtliche Editor-KI-Funktionen einzutragen.

## Meine monatlichen Kosten

| Bestandteil | Monatlicher Abobetrag |
|---|---:|
| Z.ai, bestehender Tarif | 10 US-Dollar |
| Claude Pro | 20 US-Dollar |
| Zusätzliches Zed-KI-Abo | keines |
| Cursor | gekündigt |
| **Summe** | **30 US-Dollar** |

Das sind meine Abobeträge, keine aktuelle Preisliste zum Nachbauen. Steuern, Wechselkurse und mögliche Zusatznutzung sind separat zu berücksichtigen.

Für einen wirtschaftlichen Vergleich fehlen ausserdem Einrichtung, Fehlersuche und Nacharbeit am erzeugten Code. Ein günstigeres Modell spart wenig, wenn die Ergebnisse mehr Korrekturzeit benötigen. Einen systematischen Produktivitätsvergleich habe ich nicht durchgeführt.

## Lokal statt Abo: Qwen3.5-27B auf einer RTX 3090?

Als nächsten Versuch würde ich mir **Qwen3.5-27B in einer 4-Bit-Quantisierung auf einer RTX 3090 mit 24 GB VRAM** ansehen.

Die [Modellbeschreibung von Qwen](https://huggingface.co/Qwen/Qwen3.5-27B) veröffentlicht vielversprechende Coding-Benchmarks. Das sind Herstellerergebnisse, keine Messung meines Workflows und keine Garantie für die quantisierte Variante.

[Unsloth nennt rund 17 GB Speicherbedarf für die 4-Bit-Ausführung](https://unsloth.ai/docs/models/qwen3.5). Damit ist die RTX 3090 ein plausibler Kandidat. Laufzeitumgebung und Kontext-Cache benötigen zusätzlich Speicher; das maximal beworbene Kontextfenster ist auf einer einzelnen 24-GB-Karte nicht selbstverständlich nutzbar. Geschwindigkeit und Tool-Zuverlässigkeit müsste ich selbst testen.

Wirtschaftlich hängt viel davon ab, ob die Hardware bereits vorhanden ist. Ein hypothetischer Kauf für 600 US-Dollar würde bei vollständig eingesparten Abos von 30 US-Dollar monatlich erst nach 20 Monaten den Kaufpreis ausgleichen – noch ohne Strom, Einrichtung und Wartung. Bleibt ein Abo bestehen, dauert es länger.

Lokaler Betrieb kann wegen Datenschutz, Offline-Nutzung und Unabhängigkeit sinnvoll sein. Günstiger ist er nicht automatisch.

## Fazit

Z.ai löst für mich das Kapazitätsproblem von Claude Pro, ohne dass ich sofort einen grösseren Claude-Tarif brauche. Der manuelle Wechsel reicht aus; ein gemeinsamer Agent oder Proxy brachte mir keinen dauerhaften Vorteil.

Die klarste Einsparung war die Kündigung von Cursor. Für meine verbleibenden 30 US-Dollar nutze ich jetzt beide Modellzugänge bewusst. Lokales Qwen bleibt ein Testkandidat – eine neue Grafikkarte kaufe ich dafür aber erst, wenn Qualität, Geschwindigkeit und Kostenrechnung stimmen.
