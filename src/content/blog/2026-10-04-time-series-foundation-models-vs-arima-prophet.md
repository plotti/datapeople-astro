---
title: "Schlagen Time Series Foundation Models das gute alte ARIMA und Prophet? Ein Test mit Zürcher Velozählern"
description: "Ich habe die neuen Zeitreihen-Foundation-Models (Chronos-2, TimesFM, TabPFN-TS) gegen die Klassiker ARIMA, Prophet und ein getuntes LightGBM antreten lassen – auf echten, stündlichen Velozähldaten der Stadt Zürich. Die Foundation Models gewinnen deutlich. Und die Wetterdaten als Covariates? Haben überraschend wenig gebracht. Lesen Sie weiter, wenn Sie das selbst nachspielen möchten."
pubDate: 2026-10-04
readTime: 13
category: "Machine Learning"
tags: ["Machine Learning", "Time Series", "Forecasting", "Chronos", "TimesFM", "Foundation Models", "Zürich", "Open Data"]
cover: "../../assets/blog/time-series-models-cover.jpg"
---

**Stand:** Oktober 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 13 Minuten

## Die Frage

Für tabellarische Daten hatte ich kürzlich herausgefunden, dass [Foundation Models das gute alte XGBoost schlagen](https://github.com/plotti/tabular-models-vs-xgboost). Die naheliegende nächste Frage: Gilt dieselbe Geschichte auch für **Zeitreihen**? 2025–2026 kam eine ganze Welle von *Time Series Foundation Models* – TimesFM (Google), Chronos (Amazon), Moirai (Salesforce), TabPFN-TS (Prior Labs) – alle mit demselben Versprechen: Man zeigt ihnen eine Reihe, die sie nie gesehen haben, und sie prognostizieren in einem einzigen Forward-Pass, **ohne Training, ohne Tuning**.

Aber Forecasting hat einen Haken, den tabellarische Daten nicht haben: Das, was Sie vorhersagen wollen, wird meistens von **anderen Grössen getrieben, die Sie im Voraus kennen** – Wetter, Feiertage, Aktionen. Die meisten dieser Modelle sind aber *univariat* (sie schauen nur auf die Vergangenheit des Zielwerts selbst). Die eigentliche Frage ist also nicht nur „schlagen sie ARIMA?" – sondern **„helfen die exogenen Covariates tatsächlich, und welche Modelle können sie überhaupt nutzen?"**

## Der Datensatz

Ich brauchte einen Zielwert, der wirklich von Covariates getrieben wird – also habe ich Open Data aus meiner Wahlheimat genommen. Das Tiefbauamt der **Stadt Zürich** zählt seit 2009 mit automatischen Zählstellen die Velos, und die Stadt veröffentlicht die **stündlichen Wetterdaten** gleich dazu. Fügt man beides zusammen, bekommt man ein schönes, chaotisches, echtes Forecasting-Problem:

- **Zielwert:** stadtweite stündliche Velo-Anzahl (Median 931/h, Spitzen bis 7'461).
- **Covariates:** Temperatur, Regen, Luftfeuchtigkeit, Strahlung, Wind, Luftdruck (Wetter) + Stunde, Wochentag, Monat, Wochenende, ein Covid-Lockdown-Flag (Kalender).
- **43'762 stündliche Zeilen**, 2019–2023.

Und das Signal ist genau das, was man sich erhofft: ein scharfer **Pendler-Doppelgipfel** (8 Uhr und 17–18 Uhr an Werktagen), eine starke Trennung zwischen Wochentag und Wochenende, und – der Clou – **Regen senkt das Velofahren in den Pendlerstunden um ~30%**. Wenn Wetter-Covariates *hier* nicht helfen, dann nirgends.

## Die Spielregeln

Zeitreihen kann man nicht einfach durchmischen, also nehmen wir statt k-fold Cross-Validation einen **Rolling-Origin-Backtest**: Wir wählen 14 Schnittpunkte gegen Ende der Reihe; an jedem sieht jedes Modell nur die Vergangenheit, prognostiziert die nächsten **24 Stunden** (Day-Ahead, der operative Horizont), und wir bewerten gegen das, was wirklich passiert ist. Gleiche Schnittpunkte, gleicher Horizont, gleiche Covariates für jedes Modell.

Wir berichten **beides**:

- **Punkt-Genauigkeit** – MAE in Velos/Stunde und **MASE** (skaliert gegen eine saisonale Naive-Prognose; **MASE < 1 heisst, Sie schlagen „gleich wie letzte Woche"**, die einzige Baseline, die wirklich zählt).
- **Probabilistische Qualität** – **Pinball Loss** über die Quantile P10/P50/P90 und **Coverage** (enthält das 80%-Band auch wirklich ~80% der Wahrheit?). Foundation Models sind von Haus aus probabilistisch, also zeigt sich hier ihr eigentlicher Wert.

## Die Resultate – 14-Fenster-Backtest

Das ist der Apples-to-Apples-Lauf: Jedes Modell unten auf denselben 14 Schnittpunkten, 24h-Horizont, jeweils mit und ohne Covariates. Sortiert nach MASE, das Beste oben.

| Modell | MAE | MASE | Pinball | Coverage |
|---|---:|---:|---:|---:|
| **🥇 Chronos-2 ＋cov** | **146** | **0.495** | **46.7** | 0.79 |
| **🥈 Chronos-2 base** | **150** | **0.511** | **49.2** | 0.76 |
| **🥉 TabPFN-TS ＋cov** | **173** | **0.589** | **55.7** | 0.77 |
| TabPFN-TS base | 183 | 0.624 | 57.1 | 0.84 |
| TimesFM base | 206 | 0.700 | 69.3 | 0.66 |
| ARIMA base | 221 | 0.751 | 85.5 | 0.93 |
| TimesFM ＋cov | 222 | 0.754 | 77.2 | 0.55 |
| LightGBM ＋cov | 279 | 0.953 | 98.7 | 0.54 |
| ARIMA ＋cov | 290 | 0.987 | 96.7 | 0.87 |
| AutoETS base | 303 | 1.029 | 119.4 | 0.57 |
| LightGBM base | 305 | 1.034 | 94.9 | 0.74 |
| Prophet base | 333 | 1.124 | 100.6 | 0.77 |
| SeasonalNaive base | 351 | 1.188 | 129.2 | 0.81 |
| Prophet ＋cov | 359 | 1.213 | 111.7 | 0.73 |

*(Moirai fehlt mit Absicht: Ich habe wiederholt versucht, es zum Laufen zu bringen, aber seine `uni2ts`-Library pinnt ein älteres torch, das mit Chronos-2 und TimesFM kollidiert, und es scheitert zuverlässig in einer gemeinsamen Umgebung – eine Aufgabe für ein andermal.)*

### Wie sieht das konkret aus?

Zahlen in einer Tabelle sind das eine – aber am spannendsten wird es, wenn Sie selbst herumspielen. Unten können Sie **jedes der 14 Fenster durchblättern** und **jedes Modell ein- und ausblenden**, um zu sehen, was es vorausgesagt hat gegenüber dem, was tatsächlich passierte (die dicke schwarze Linie). Wählen Sie oben links einen Tag, klicken Sie die Modelle an und ab:

<iframe src="/time-series-forecast-explorer.html" title="Interaktiver Velo-Prognose-Explorer" style="width:100%;height:560px;border:1px solid #e5e7eb;border-radius:10px;" loading="lazy"></iframe>

Probieren Sie mal einen Werktag (Mo–Fr) gegen ein Wochenende – der charakteristische Pendler-Doppelgipfel ist nur unter der Woche da, und man sieht sofort, welche Modelle ihn treffen und welche danebenliegen. Blenden Sie **Chronos-2** ein (der Sieger) und vergleichen Sie es mit Prophet oder Seasonal-Naive: Chronos-2 legt sich an den meisten Tagen fast deckungsgleich auf die tatsächliche Kurve, während die simplen Baselines systematisch danebenliegen.

Drei Dinge stechen heraus:

1. **Die Foundation Models räumen die Spitze ab.** Die drei besten Zeilen sind alle zero-shot Foundation Models. Chronos-2 prognostiziert die Velo-Anzahl des nächsten Tages mit einem Median-Fehler von ~146/Stunde (MASE 0.495) – die *Hälfte* des Fehlers von saisonal-naive – mit **TabPFN-TS** (dem Zeitreihen-Cousin des Modells, das [den tabellarischen Benchmark](https://github.com/plotti/tabular-models-vs-xgboost) gewonnen hat) dicht dahinter. Interessant ist, wer sich dazwischenschiebt: das **gute alte ARIMA** (MASE 0.751) landet im Mittelfeld und schlägt sowohl LightGBM als auch Prophet – Letzteres verliert sogar glatt gegen „gleich wie letzte Woche" (MASE > 1), ein ernüchterndes Ergebnis für das berühmteste Open-Source-Forecasting-Tool. Wenn Sie schon eine klassische Baseline wollen, nehmen Sie ARIMA, nicht Prophet.

2. **Covariates haben kaum etwas gebracht – und oft geschadet.** Das ist die eigentliche Überraschung. Die Wetter-Covariates halfen nur einer Handvoll Modelle, und das nur minimal (Chronos-2 −3%, TabPFN-TS −6%, LightGBM −8%), während sie TimesFM (+8% Fehler), Prophet (+8%) und ARIMA (+31%!) aktiv **schadeten**. Der wahrscheinliche Grund: Der Tages-/Wochenrhythmus kodiert bereits das meiste von dem, was Temperatur und Regen beitragen – um 3 Uhr morgens ist es kalt und nass, und da fährt sowieso niemand Velo – ein gutes saisonales Modell hat das Wetter also schon „eingepreist".

3. **Null Tuning, und auch noch schneller.** Chronos-2 produzierte jede Prognose in **~1–2 Sekunden**, komplett ohne Training – schneller als der Prophet-Fit pro Fenster. (TabPFN-TS ist mit ~60s/Konfiguration langsamer, weil es pro Fenster eine gehostete API aufruft.) Das Foundation-Model-Versprechen – ein Forward-Pass, keine Pipeline pro Zeitreihe – hält operativ, nicht nur bei der Genauigkeit.

### Eine Anmerkung zum Covariate-Ergebnis

Es lohnt sich, bei Erkenntnis #2 kurz zu verweilen, denn sie ist das Gegenteil von dem, was das Setup versprochen hat. Ich habe diesen Datensatz *genau deshalb* gewählt, weil Regen das Velofahren so offensichtlich dämpft – und das tut er, −30% in den Rohdaten. Trotzdem hat das Füttern dieses Regen-Signals als Covariate fast nichts geändert. Die Lehre ist nicht „Wetter spielt keine Rolle"; sie ist, dass **ein starkes saisonales Modell den Wettereffekt bereits indirekt einfängt** – über die Stunden- und Jahreszeit-Muster, denen das Wetter selbst folgt. Covariates verdienen ihr Geld, wenn sie etwas tragen, das der Kalender *nicht* kann – ein einmaliges Ereignis, eine Aktion, ein Kälteeinbruch zur Unzeit – nicht, wenn sie selbst saisonal sind.

## Probieren Sie es selbst aus

Der ganze Benchmark ist ein kommentiertes Colab-Notebook – es installiert alles, lädt den Zürcher Datensatz automatisch, jagt die volle Leiter durch den Rolling-Backtest mit und ohne Covariates und druckt die Resultat-Tabelle plus einen Blogpost-Entwurf.

- **▶️ In Colab öffnen:** [Benchmark-Notebook starten](https://colab.research.google.com/drive/1M-dcTiYkaDA48D1S0aMqBD19686xS26i)
- **Repo:** [github.com/plotti/time-foundation-models](https://github.com/plotti/time-foundation-models)
- **Daten:** [`zurich_bikes.parquet`](https://github.com/plotti/time-foundation-models/blob/main/data/zurich_bikes.parquet) (43'762 stündliche Zeilen)

Öffnen Sie es in Colab, stellen Sie die Runtime auf eine **T4-GPU** und lassen Sie es von oben bis unten durchlaufen. Für das TabPFN-TS-Modell brauchen Sie einen kostenlosen API-Key von [priorlabs.ai](https://priorlabs.ai); der Rest läuft ohne.

## Fazit

Zwei Erkenntnisse auf diesem Datensatz, und beide haben sich sauber vom tabellarischen Experiment übertragen – eine wie erwartet, eine nicht.

**Time Series Foundation Models schlagen die klassische Riege wirklich.** Chronos-2 halbierte den Fehler von saisonal-naive mit null Tuning und schlug sowohl Prophet als auch ein getuntes LightGBM um rund das Doppelte. Die drei Spitzenplätze gehen alle an Foundation Models, und sie führen das Feld klar an. Der einzige klassische Lichtblick ist das gute alte ARIMA, das sich ins Mittelfeld schiebt – aber auch das kostet rund 17 Minuten Rechenzeit pro Fenster, während Chronos-2 in **1–2 Sekunden** fertig ist. Wenn Sie aus Gewohnheit zu Prophet oder einem handgebauten LightGBM greifen: Ein zero-shot Aufruf von Chronos-2 war hier genauer *und* schneller. Das spiegelt die tabellarische Geschichte exakt: Vortrainierte Modelle fressen still und leise die Standard-Toolbox auf.

**Aber die Covariates waren das Gegenteil von dem, was ich erwartet hatte.** Auf der tabellarischen Seite half das richtige Feature (die Energieeffizienzklasse) klar. Hier – auf einem Datensatz, den ich *ausgesucht* habe, weil Regen das Velofahren so offensichtlich treibt – bewegten die Wetter-Covariates kaum die Nadel und schadeten oft. Der Grund ist subtil, aber allgemein: Ein starkes saisonales Modell fängt den Wettereffekt bereits indirekt ein, über die Stunden- und Jahreszeit-Muster, denen das Wetter folgt. Covariates verdienen ihr Geld, wenn sie etwas tragen, das der Kalender nicht kann. Manchmal lautet das ehrliche Ergebnis „genau das, von dem man sicher war, dass es zählt, tat es nicht" – und genau deshalb macht man den Benchmark, statt zu raten. :)

*Zahlen aus einem 14-Fenster-Rolling-Backtest auf 43'762 stündlichen Beobachtungen (Open Data der Stadt Zürich, 2019–2023). Foundation Models und die intermediate Modelle liefen auf einer Colab-T4-GPU; die klassischen Baselines (Seasonal-Naive, ETS, ARIMA) auf der CPU – AutoARIMA braucht rund 17 Minuten pro Fenster, daher getrennt gerechnet und hier eingefügt.*

---

### Quellen

- [Stadt Zürich – Velo- und Fussgänger-Zähldaten](https://data.stadt-zuerich.ch/dataset/ted_taz_verkehrszaehlungen_werte_fussgaenger_velo)
- [Stadt Zürich – stündliche Wetterdaten](https://data.stadt-zuerich.ch/dataset/ugz_meteodaten_stundenmittelwerte)
- [The Forecasting Company – From ARIMA to Foundation Models](https://www.theforecastingcompany.com/blog/from-arima-to-foundation-models/)
- [Chronos-2: From Univariate to Universal Forecasting](https://arxiv.org/pdf/2510.15821)
