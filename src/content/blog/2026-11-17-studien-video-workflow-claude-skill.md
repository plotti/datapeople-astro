---
title: "Vom Thema zum Rohschnitt: ein Claude-Skill für Erklärvideos, in denen jede Zahl belegt ist"
description: "Für ein YouTube-Video über die Krise der liberalen Demokratie habe ich Claude Recherche, Faktencheck, Teleprompter, Studien-Slides, O-Töne, Schnitt-Mockup, Preview und 1080p-Clips machen lassen. Daraus ist ein Open-Source-Skill geworden, den man in Claude Code oder in der Claude-App installiert und dann einfach benutzt, indem man mit Claude redet."
pubDate: 2026-11-17T21:30:00+01:00
readTime: 9
category: "KI Tools"
tags: ["Claude","Claude Code","Skills","Video","Faktencheck","Piper TTS","yt-dlp"]
cover: "../../assets/blog/studien-video-cover.png"
---

**Stand:** November 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 9 Minuten

Ich mache nebenbei Videos für den YouTube-Kanal Losdemokratie. Das Format ist simpel: Ich stehe rechts im Bild und rede, links läuft eine Folie mit der Studie, die meine Aussage belegt. Dazwischen O-Töne von Politikerinnen, Forschern oder Bürgern. Der Anspruch ist genauso simpel: **Jede Behauptung im Video muss durch eine Studie belegt sein.** Keine gefühlten Wahrheiten, keine Zahl aus einem Zeitungsartikel, der eine Pressemitteilung zusammenfasst, die eine Studie zusammenfasst.

Das Problem an diesem Anspruch ist der Aufwand. Für ein Video von gut zwölf Minuten kommen schnell zwanzig Studien, zwei Dutzend Folien und zwanzig O-Töne zusammen. Jede Zahl muss ich im Original finden, jede Grafik nachbauen, jeden O-Ton auf die Zehntelsekunde schneiden. Und bevor ich überhaupt vor die Kamera stehe, will ich wissen, ob das Ganze als Video funktioniert.

Beim letzten Video, «Krise der liberalen Demokratie?», habe ich das komplett mit Claude gemacht. Daraus ist ein Skill geworden, den ich jetzt [auf GitHub veröffentlicht](https://github.com/plotti/ai-video-toolkit) habe.

## 1. Was am Ende rauskommt

Ich gebe Claude das Thema, meine Thesen und eine lose Ideensammlung mit Links. Am Ende habe ich:

- einen **Teleprompter** als Dokument, in dem vor jedem belegten Satz steht, welche Folie eingeblendet wird, dazu eine Quellentabelle mit exakter Fundstelle (Seite, Tabelle, Abbildung),
- ein **Foliendeck** mit 26 Folien, die Grafiken aus den Studien als echte, editierbare Diagramme nachgebaut,
- einen Ordner mit den **20 Originalstudien** als PDF, nummeriert wie die Folien,
- **19 O-Töne**, die im Skript an der richtigen Stelle stehen,
- einen klickbaren **Schnitt-Mockup** im Browser, in dem eine Computerstimme meinen Text vorliest,
- ein **Preview-Video** von zwölfeinhalb Minuten, bevor ich eine einzige Aufnahme gemacht habe,
- alle O-Töne als **1080p-Clips mit fünf Sekunden Vor- und Nachlauf** und eine Schnittliste für das Schnittprogramm,
- eine **Rechte-Ampel** pro O-Ton: Darf ich das zeigen?

![Ein Ausschnitt aus dem Foliendeck: Edelman Trust Barometer, Iyengar et al. zur Polarisierung, Healy & Malhotra zur Katastrophenvorsorge](../../assets/blog/studien-video-slides.jpg)

## 2. Die wichtigste Regel: Nichts aus der Ideensammlung ist geprüft

Der Teil, der mir am meisten bringt, ist nicht die Technik, sondern der Faktencheck. Im Skill steht eine Regel ganz oben: Jede Zahl, jedes Zitat und jede Studienaussage aus meinen Notizen gilt als ungeprüft, bis sie wörtlich im Original gefunden ist. Claude lädt dafür das PDF der Studie herunter, wandelt es in Text um und sucht die exakte Zahl.

Das klingt pedantisch. Beim ersten Testlauf hat Claude aber in **9 von rund 15 Aussagen** Abweichungen gefunden. Nicht, weil meine Notizen erfunden waren, sondern weil Zahlen auf dem Weg vom Paper bis in meine Sammlung kleine Veränderungen durchmachen. Ein paar Beispiele, die ich so nie selbst gefunden hätte:

- **Presseseite und Bericht sagen etwas anderes.** Bei der irischen Bürgerversammlung steht auf der Presseseite 98 Prozent, im Final Report 97 Prozent (73 von 75 Anwesenden). Es gilt der Bericht.
- **Der Durchschnitt stimmt, aber nicht für Deutschland.** Eine Studie findet über viele Länder einen negativen Effekt. Für Deutschland ist er positiv. Wenn ich das Video für ein deutsches Publikum mache, gehört das offen auf die Folie.
- **Die Richtung ist falsch.** «Das Vertrauen sinkt» braucht eine Zeitreihe. Beim Edelman Trust Barometer ist der Wert für Deutschland 2026 gestiegen. Gewachsen ist nur der Abstand zwischen hohen und tiefen Einkommen, und genau das zeigt jetzt die Folie.
- **Die Quelle existiert so nicht.** Eine Zahl, die einer Stiftung zugeschrieben wurde, war im Original nicht auffindbar. Claude hat sie durch eine Studie ersetzt, die das Gleiche belegt und die man nachlesen kann.

Jede dieser Abweichungen landet in einer Tabelle «Korrekturen gegenüber der Ideensammlung»: was ich hatte, was im Original steht, was jetzt im Skript steht. So sehe ich auf einen Blick, wo mein Bauchgefühl danebenlag.

## 3. Das Skript ist die Quelle der Wahrheit

Der Teleprompter ist ein normales Dokument, in dem ich auch selbst schreibe. Damit Claude daraus später einen Schnitt bauen kann, hat er eine ganz einfache Syntax:

```
## 3. Spaltung
▶ EINBLENDEN 9 · Iyengar et al. 2012
1960 wären in den USA nur 4 Prozent der Demokraten und 5 Prozent der Republikaner unglücklich gewesen, wenn ihr Kind jemanden von der Gegenseite heiratet. 2010 waren es 33 und 49 Prozent.
■ O-TON Mehr Demokratie · 5:21,8–5:33,3 · «… redet kaum jemand mit jemand anderem, der nicht seiner Meinung ist.»
```

Kapitel, Folienwechsel, Sprechtext, O-Ton mit Zeitstempel im Quellvideo. Das ist alles. Den Rest der Zusammenarbeit führe ich im Chat, und zwar so, wie ich mit einem Cutter reden würde:

- «OT 11 raus, OT 8 auch raus.»
- «Schieb den O-Ton aus dem Film zu Problem 1.»
- «Nimm die 52 Prozent bei Grossbritannien raus, das ist zu polemisch.»
- «Ich will Zwischenüberschriften für die einzelnen Probleme.»
- «Geh den Teleprompter durch und sag mir, welches die schwächste Stelle ist.»

Gerade die letzte Frage stelle ich inzwischen bei jedem Video. Claude sucht dann Brüche in der Logik, Stellen, an denen ein Beispiel für ein deutsches Publikum nicht trägt, oder einen O-Ton, der dem Sprechtext davor eigentlich widerspricht, und schlägt konkret eine neue Formulierung vor.

## 4. O-Töne finden und schneiden

Für die O-Töne nutze ich ein eigenes Tool, das ich vor einiger Zeit gebaut habe: Es hat die Transkripte vieler YouTube-Videos zu Demokratie und Politik und eine semantische Suche darüber. Claude stellt pro Folie zwei, drei Suchanfragen, schaut sich das Transkript rund um die Treffer an und schlägt mir eine Tabelle mit Sprecher, Zitat und Link mit Zeitmarke vor. Ich suche aus.

Der Skill ist aber bewusst **nicht an dieses Tool gebunden**. Ohne eigenes Archiv sucht Claude direkt auf YouTube und schneidet über die automatischen Untertitel, die Zeitmarken für jedes einzelne Wort haben. Man kann auch eigene Aufnahmen oder Material aus einer Mediathek als Datei angeben.

Ein praktisches Detail: YouTube blockiert Downloads aus Rechenzentren. Die O-Töne hat Claude deshalb nicht in der Cloud geholt, sondern auf meinem Mac, über die Verbindung der Claude-Desktop-App. Bei einem O-Ton aus einem Dokumentarfilm, der auf der Film-Website als Vimeo-Stream eingebettet ist, war die signierte Video-URL nach ein paar Stunden abgelaufen. Claude hat sie mit einem Befehl neu geholt, und der Download lief weiter.

## 5. Der Schnitt-Mockup: das Video sehen, bevor es gedreht ist

Das ist der Teil, der mich am meisten überrascht hat, wie nützlich er ist. Claude liest jeden Satz aus dem Teleprompter mit [Piper](https://github.com/rhasspy/piper) vor, einer freien Text-to-Speech-Engine, die lokal läuft. Daraus entsteht eine Webseite: links die Folie, rechts ein Platzhalter für mich, unten die Zeitleiste und das Skript. Bei einem O-Ton läuft der Clip im Vollbild mit Originalton und Bauchbinde.

![Der Schnitt-Mockup: Folie links, Sprecher rechts, darunter Zeitleiste und Drehfassung](../../assets/blog/studien-video-mockup.png)

Man merkt dabei Dinge, die man auf Papier nicht merkt. Dass eine Folie zwei Minuten stehen bleibt, während ich rede. Dass zwei O-Töne direkt hintereinander zu viel sind. Dass ein Kapitel viel länger ist als die anderen. Ändere ich etwas im Skript, wird nur der geänderte Satz neu vertont, und der Mockup ist in Sekunden wieder aktuell.

Wer den Mockup nicht im Browser anschauen will, bekommt das Ganze auch als MP4. Für das Demokratie-Video waren das 12 Minuten 42 Sekunden.

![Ein Bild aus dem Preview-Video](../../assets/blog/studien-video-preview.jpg)

## 6. Schnitt-Assets und Rechte-Ampel

Wenn das Skript steht, sage ich: «Render mir alle Videos, die im Video benutzt werden, in einen Ordner, 1080p und vorne und hinten fünf Sekunden mehr.» Dann kommt ein Ordner mit `OT01_….mp4` bis `OT19_….mp4` und eine `Schnittliste.csv`, in der für jeden Clip steht, wo der O-Ton in der Datei beginnt und endet und woher er stammt. Das ziehe ich ins Schnittprogramm, fertig.

Die Frage, die danach immer kommt: Darf ich das überhaupt zeigen? In der Schweiz und in Deutschland gibt es ein Zitatrecht (Art. 25 URG, § 51 UrhG). Es deckt fremdes Material, wenn ich mich im Video damit auseinandersetze, es nicht länger ist als nötig und die Quelle genannt wird. Claude ordnet dafür jeden O-Ton ein: Wem gehört er (Sender, Parlament, Partei, Filmproduktion)? Wird er zitiert und eingeordnet, oder läuft er nur als Bebilderung unter meinem Text?

Für das Demokratie-Video kam heraus: **13 gelb, 6 rot, keiner grün.** Gelb heisst: Zitatrecht trägt wahrscheinlich, wenn ich mich wirklich damit befasse. Rot waren vier Ausschnitte aus einem Dokumentarfilm, für die ich die Produktion um Erlaubnis fragen sollte, und zwei Schnittbilder von Politikern im Hochwassergebiet, die ich nur als Bebilderung verwende. Das ist keine Rechtsberatung, aber es ist eine Liste, mit der ich konkret weiss, wen ich anschreiben muss.

## 7. Warum ein Skill und kein Tool

Meine erste Version auf GitHub war eine Sammlung von Python-Skripten mit einer langen Anleitung: Projektordner anlegen, Stimme herunterladen, diesen Befehl ausführen, dann jenen. Technisch korrekt, aber am Thema vorbei. Ich habe keinen einzigen dieser Befehle selbst eingetippt. Ich habe mit Claude geredet.

Darum ist das Ganze jetzt als **Claude-Skill** verpackt. Ein Skill ist im Kern ein Ordner mit einer Anleitung, die Claude liest, wenn sie zur Aufgabe passt, plus den Skripten, die Claude dafür braucht. Die Anleitung beschreibt den ganzen Ablauf, inklusive der Faktencheck-Regeln und der Dinge, die ich unterwegs gelernt habe. Die Skripte für Stimme, Mockup, Preview, Clips und Rechte liegen daneben, und Claude ruft sie selbst auf.

**In Claude Code:**

```
/plugin marketplace add plotti/ai-video-toolkit
/plugin install ai-video-toolkit@ai-video-toolkit
```

**In der Claude-App:** die ZIP-Datei aus dem Ordner `dist/` im [Repository](https://github.com/plotti/ai-video-toolkit) herunterladen und unter *Customize → Skills* hochladen. Dafür muss in den Einstellungen die Code-Ausführung aktiviert sein.

Danach reicht ein Satz wie: «Mach mir ein Video von acht Minuten darüber, warum das Vertrauen in Parlamente sinkt. Meine Notizen und die Studien hängen an.» Der Skill ist auf Deutsch geschrieben, weil mein Kanal deutsch ist, funktioniert aber für Videos in jeder Sprache. Ein kleines Demo-Projekt und das komplette Demokratie-Projekt mit allen O-Ton-Zeitmarken und Rechte-Einträgen liegen als Beispiele dabei, ohne das Videomaterial selbst.

## Was nehme ich mit?

1. **Der Faktencheck ist der eigentliche Gewinn.** Folien bauen und Clips schneiden spart Zeit. Dass jede Zahl im PDF gegengeprüft wird, macht das Video besser. Ohne diese Regel hätte ich mehrere Zahlen gesagt, die so nicht stimmen.
2. **Den Ablauf sehen ändert die Dramaturgie.** Beim Durchklicken im Mockup habe ich O-Töne geparkt, umgestellt und neue Folien eingefügt, was mir auf Papier nicht aufgefallen wäre.
3. **Das Skript muss die einzige Quelle bleiben.** Alles, also Mockup, Preview, Schnittliste und Rechte-Ampel, wird aus dem Teleprompter erzeugt. Sobald man an zwei Stellen ändert, laufen sie auseinander.
4. **Wer das Werkzeug benutzt, ist Claude, nicht ich.** Deshalb gehört die Anleitung in den Skill und nicht in ein README, das Befehle erklärt.

Der Code steht unter MIT-Lizenz auf [GitHub](https://github.com/plotti/ai-video-toolkit). Ich freue mich auf eure Kommentare, und vor allem auf Erfahrungen, falls jemand den Skill für ein ganz anderes Thema ausprobiert.
