---
title: "Braucht es immer KI?"
description: "Im folgenden möchte ich eine fundamentale Unterscheidung einführen. Sie soll bei der Entscheidung und vor allem bei der Bewertung der Konsequenzen des AI-Einsatzes helfen."
pubDate: 2026-02-22
readTime: 5
category: "KI & Strategie"
tags: ["KI","Strategie","Determinismus","AI-Einsatz"]
cover: "../../assets/blog/ki-entscheidung.webp"
---

**Stand:** Januar 2025 · **Autor:** Philipp Egli · **Lesedauer:** ca. 5 Minuten

Im folgenden möchte ich eine fundamentale Unterscheidung einführen. Sie soll bei der Entscheidung und vor allem bei der Bewertung der Konsequenzen des AI-Einsatzes helfen. Spoiler und drastische Vereinfachung: Es gibt nur zwei grundsätzliche Einsatzgebiete.

## Welche grundlegenden Einsatzgebiete gibt es?

Ich nutze die KI, um etwas zu bauen. Z.B. lasse ich programmieren oder schreiben und ich nehme das Endprodukt ab – im Idealfall bin ich auch qualifiziert dafür. Danach habe ich ein Artefakt, das unveränderlich ist. Diesen Output kontrolliere ich zu 100% selbst dann, wenn ich das durch die KI generierte Artefakt verwerfen muss.

Oder ich nutze KI "In the Loop", was bedeutet, dass ich sie in "Echtzeit" in meine Unternehmensprozesse einbinde. Dort trifft sie Entscheidungen oder macht Annahmen, die wiederum zu Entscheidungen führen. Kurzum: Die KI ist Teil meines Daily Business wie ein digitaler Mitarbeiter. Sie wird Teil eines komplexeren Systems. Diesen Output kann ich nicht zu 100% kontrollieren.

Um diesen Zusammenhang besser zu verstehen hilft ein Konzept aus der Wissenschaft das auch eine zentrale Rolle in der Informatik spielt.

## Deterministisch vs. non Deterministisch

Nach der klassischen Definition ist die Addition von _2 + 2 = 4_ deterministisch. Gleicher Input gibt immer den gleichen Output oder für die Techniker: Eine Datenbankabfrage in SQL ist deterministisch. Gleicher Input gleicher Output.

Im Gegensatz dazu ist die natürliche Sprache zu nennen. Wir fragen fünf Personen nach einer Wegbeschreibung. Wir erhalten fünf verschiedene Antworten, die vielleicht alle korrekten Wegbeschreibungen entsprechen, aber sie unterscheiden sich in Herangehensweise und Detaillierungsgrad. Das ist non-deterministisch. Ein LLM (Large Language Model) also ein Sprachmodell hat den gleichen non-deterministischen Twist wie natürliche Sprachen. Aber auch komplexe Systeme wie Wetter sind non-deterministisch.

Ok, wir setzen in beiden Fällen KI ein – meistens in Form eines LLM. Im ersten Fall ist es deterministisch und im zweiten Fall non-deterministisch. Warum?

Im ersten Fall lassen wir KI ein Artefakt kreieren, das innerhalb einer deterministischen Welt laufen muss – ein Algorithmus tut entweder das, was er tun soll oder nicht. Computer-Programme funktionieren oder nicht. Eine Datenbankabfrage liefert die Daten, die man sucht oder nicht. Die Maschine dahinter ist deterministisch. Daher ist auch das Resultat deterministisch, wenn wir es einmal für gut befunden haben.

Im zweiten Fall macht ein LLM eine Zusammenfassung, schreibt einen Text in natürlicher Sprache, interagiert mit Kunden, interpretiert oder berät. Hier gibt es kein so klares richtig oder falsch; zudem läuft die KI im Hintergrund oder übernimmt einzelne Prozessschritte. Hier sind wir in der non-deterministischen Welt.

## Entscheidungshilfe & Fazit

Beide Einsatzgebiete deterministisch und nicht-deterministisch haben ihre Existenzberechtigung. Beide Einsatzgebiete haben ihre eigenen Fragestellungen und Best Practices. Aber darum geht es hier nicht. Wichtig ist es diese Frage zu stellen: Kann ich mein Problem in einer deterministischen Welt lösen?

Wenn ich diese Frage mit "ja" beantworten kann, dann sollte ich es auch so lösen. KI kann mich dabei unterstützen. Das fertige Produkt selbst braucht keine KI mehr. Meine Pflichten: Ich muss mir über den Einsatz von KI als Werkzeug Gedanken machen. Ich sollte die Artefakte testen wie Produkte, die Menschen hergestellt haben. Im laufenden Betrieb habe ich dann keine KI-Risiken mehr. In dieser Klasse von Aufgaben fungiert KI als Produktivitätsbooster.

Auf der anderen Seite steht KI als digitaler Mitarbeiter, als Interpret und Entscheider oder wie man so schön sagt, als Agent. Dort wird es schwieriger. Die Risiken steigen. Die Komplexität nimmt zu. Der Einsatz ist verlockend aber mit Vorsicht zu geniessen. Was passiert bei Fehlentscheidungen, wer trägt die Verantwortung? Wie stelle ich Kontinuität sicher? Wie viele Ressourcen benötige ich, um die KI "in Schach" zu halten? Letzteres ist auch eine zentrale Frage bei der Bewertung der Rentabilität. Aber vor allem: Brauche ich das wirklich?

| | **KI als Werkzeug** | **KI als Mitarbeiter** |
| --- | --- | --- |
| **Modus** | Deterministisch | Non-deterministisch |
| **Beispiel** | Code, SQL-Abfragen, Dokumente | Kundendialog, Zusammenfassungen, Entscheidungen |
| **Output** | Fertiges Artefakt, abnehmbar | Laufender Prozess, variabel |
| **Kontrolle** | 100% | Eingeschränkt |
| **Risiko im Betrieb** | Keins (KI ist raus) | Dauerhaft (KI läuft mit) |
| **Empfehlung** | Zuerst machen | Kritisch hinterfragen |

Es wird klar, dass der Einsatz von KI im ersten Fall einfacher realisierbar ist und meiner Meinung nach sollte auch dieser Teil als erstes erledigt werden. Oder markiger:

**KI als Werkzeug – so oft wie möglich. KI als Mitarbeiter – so selten wie nötig.**
