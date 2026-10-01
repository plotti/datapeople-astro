---
title: "Tabular Foundation Models – der kleine Bruder der LLMs für tabellarische Daten"
description: "Ich habe für über 10 tausend echte Hausinserate untersucht, welches Machine-Learning-Modell am besten die Preise voraussagen kann. Sogenannte Tabular Foundation Models schlagen die alten Machine-Learning-Modelle um Längen – eine kleine Revolution. Lesen Sie weiter, wenn Sie dies für Ihre Daten nachmachen möchten."
pubDate: 2026-10-01
readTime: 14
category: "Machine Learning"
tags: ["Machine Learning", "TabPFN", "XGBoost", "scikit-learn", "Foundation Models", "Immobilien", "Benchmark"]
cover: "../../assets/blog/tabular-models-cover.jpg"
---

**Stand:** Oktober 2026 · **Autor:** Thomas Ebermann · **Lesedauer:** ca. 14 Minuten

## Die Frage

Bei tabellarischen Daten – Zeilen und Spalten, der Stoff aus dem Tabellen und Datenbanken sind – regieren seit einem Jahrzehnt die Gradient-Boosted Trees. XGBoost, LightGBM und scikit-learns `HistGradientBoostingRegressor` gewinnen Kaggle-Wettbewerbe und treiben still und leise den Grossteil des produktiven Machine Learnings, das nicht gerade mit Bildern oder Text zu tun hat.

Und dann kam eine neue Idee: **Tabular Foundation Models**. Statt ein Modell auf Ihren Daten zu *trainieren*, reichen Sie dem vortrainierten Transformer einfach den kompletten Trainingssatz als *Kontext* – und er sagt in einem einzigen Forward-Pass voraus. Kein Gradient Descent, keine Hyperparameter-Suche, kein mühsames Tuning. **TabPFN v2** (von Prior Labs, 2026 in *Nature* publiziert) wurde auf Millionen synthetischer Tabellen-Aufgaben vortrainiert und ist für Datensätze bis ~10'000 Zeilen gemacht. **TabICL** (2026) folgt demselben In-Context-Learning-Rezept, ist aber architektonisch darauf ausgelegt, auf grössere Tabellen zu skalieren.

Das Versprechen klingt verführerisch: konkurrenzfähige Genauigkeit mit *null Tuning*. Aber hält das auch gegen ein sauber aufgesetztes XGBoost und scikits stärkste Bäume stand – auf echten, chaotischen Daten aus dem richtigen Leben? Nun, zufälligerweise habe ich genau solche Daten herumliegen. :)

## Der Datensatz

Hinter meiner [Haus-Karte](https://housing.ebermann.ch) steckt ein Scraper, der Einfamilienhaus-Inserate von kleinanzeigen.de zieht. Jedes Haus wird zu einer Zeile mit **70 Features**:

- **Strukturell:** Wohnfläche, Grundstücksgrösse, Zimmer, Bäder, Schlafzimmer, Etagen, Baujahr
- **Lage:** Breiten-/Längengrad, Distanzen zur nächsten Grossstadt, Uni, Schule, Supermarkt, Schwimmbad, Theater, See/Meer, Fluss, Tennisplatz, Autobahn und Naturregion; dazu das verfügbare Einkommen im Kreis und ein Bundesland-One-Hot
- **Haustyp:** freistehend, Doppelhaushälfte, Reihenhaus, Bungalow, Bauernhaus, Villa, …
- **Aus dem Text geschürfte Flags:** sanierungsbedürftig, saniert, Neubau, Erbpacht, Denkmal, aktuell vermietet, Keller, Garage, Garten, Heizungsart (Wärmepumpe, Fernwärme, Gas, Öl, Pellet, …) und die **Energieeffizienzklasse** (A–H), direkt aus dem Inseratstext geparst
- **Zielwert:** der Angebotspreis (wir modellieren `log(Preis)` – die Preise sind stark rechtsschief)

Das ist schön chaotisch, wie das echte Leben: viele Features sind lückenhaft (die Energieklasse steht nur in ~17% der Inserate), die Preise reichen von der 50'000-Euro-Hütte bis zur Multimillionen-Villa, und der Median-Angebotspreis liegt bei rund **419'000 €**.

## Die Spielregeln

Jedes Modell spielt nach denselben Regeln – damit nichts im Vergleich getürkt ist:

- **5-fach Out-of-Fold Cross-Validation.** Jedes Haus wird von einem Modell vorhergesagt, das es im Training nie gesehen hat. Gleiche Folds (gleicher Random Seed) für alle Modelle.
- **Dieselben 70 Features, dasselbe `log(Preis)`-Ziel.**
- **Metriken:** MAE und Median Absolute Error in Euro, R² auf dem log-Ziel, und der Median Absolute Percentage Error (MdAPE, robust gegen den Luxus-Langschwanz).
- Baum-Modelle schlucken NaNs direkt (XGBoost, HistGB) oder nach Median-Imputation (Random Forests); Ridge bekommt Imputation + Skalierung. Die Foundation Models kriegen die rohe Matrix und **gar kein Tuning**.

## Das klassische Feld (alle 11'168 Häuser)

Zuerst die Modelle, die gemütlich auf einer Laptop-CPU laufen. Das ist die eigentliche Konkurrenz – und die erste Überraschung ist: **XGBoost ist nicht das beste davon.**

| Modell | MAE | Median AE | R² (log) | MdAPE | Trainingszeit |
|---|---:|---:|---:|---:|---:|
| **ExtraTrees** | 100'738 € | **57'179 €** | 0.704 | **14.7%** | 160 s |
| **HistGradientBoosting** | **97'339 €** | 59'447 € | **0.736** | 15.2% | 21 s |
| RandomForest | 107'692 € | 63'739 € | 0.674 | 16.2% | 297 s |
| XGBoost *(plain vanilla, kein Tuning)* | 103'446 € | 66'229 € | 0.707 | 16.7% | 4 s |
| Ridge (linear) | – | 94'455 € | – | 23.7% | 0 s |

Zwei Dinge zum Mitnehmen:

1. **scikit-learns `HistGradientBoostingRegressor` und `ExtraTreesRegressor` schlagen beide mein Plain-Vanilla-XGBoost** – ExtraTrees um ~14% beim Median-Fehler, HistGB mit dem besten R² im ganzen Feld. Die Gradient-Boosting-Krone gehört also nicht automatisch XGBoost.
2. **Lineare Regression fällt auseinander.** Ridges R² auf dem log-Ziel rutscht steil ins Negative und der MAE überläuft in blanken Unsinn – ein lineares Modell, das im Log-Raum extrapoliert, produziert am Preis-Langschwanz absurde Euro-Werte. Eine schöne Erinnerung daran, *warum* bei solchen Daten alle zu Bäumen greifen.

## Auftritt der Foundation Models

Jetzt der Realitäts-Check aus dem Betrieb: **TabPFN und TabICL brauchen eine GPU.** Die In-Context-Attention von TabPFN skaliert mit der Grösse des Trainingssatzes, auf einer CPU ist das jenseits von ein paar hundert Zeilen hoffnungslos – auf meinem M-Serie-Laptop wurde ein einziger Fold mit 2'400 Zeilen schlicht nie fertig. Das ist kein Vorwurf an das Modell; es ist genau der Grund, warum das begleitende Notebook auf eine Colab-GPU setzt.

Mit einer GPU verschwindet das Fairness-Problem allerdings komplett: jedes Modell – klassisch *und* Foundation – läuft auf **denselben vollen 11'168 Häusern**, den gleichen Folds, in einem Rutsch. Das ist das Ranking weiter unten.

## Der Haken mit der Lizenz – und der ist gross

Bevor Sie sich in TabPFN verlieben, lesen Sie das Kleingedruckte – ich bin voll reingelaufen. Um TabPFN überhaupt zu nutzen, müssen Sie **ein Konto bei Prior Labs anlegen, deren Nutzungsbedingungen akzeptieren und ein API-Token besorgen** (`TABPFN_TOKEN`); das aktuelle Paket lädt die Gewichte für lokale Inferenz nicht mal herunter, solange Sie die Lizenz nicht akzeptiert haben. Auf einer Maschine ohne Browser knallt Ihnen schon der allererste `.fit()`-Aufruf einen Fehler hin mit der Aufforderung, sich doch bitte einzuloggen.

Und die Lizenz selbst ist **nicht-kommerziell**. Ab TabPFN-2.5 stehen die Modellgewichte unter Prior Labs' *Non-Commercial License*: gratis für Forschung, Tests und interne Evaluation, aber Sie dürfen das Modell, seine Ableitungen oder sogar seine *Outputs* **nicht** für irgendeinen kommerziellen oder produktiven Zweck nutzen. Das schliesst ausdrücklich ein: umsatzgenerierende Produkte, Kunden-Deliverables, Konkurrenz-Benchmarking für Beschaffung und – der Killer für sowas wie meine Haus-Karte – *die Nutzung der Vorhersagen für interne kommerzielle Entscheidungen*. Für alles Kommerzielle brauchen Sie entweder ihre gehostete API oder eine Commercial Enterprise License von `sales@priorlabs.ai`.

Und was kostet das? **Weiss öffentlich niemand.** Prior Labs listet Free-/Pro-/Max-API-Stufen und kommerzielle On-Prem-/Private-Cloud-Lizenzen auf, veröffentlicht aber **keine Preise** – jede kommerzielle Stufe ist ein „Contact Sales". Die Gratis-Stufe hat unspezifizierte „tägliche & monatliche Limits". Die ehrliche Antwort auf „Kann ich das in Produktion nutzen, und was kostet es?" ist also: *vielleicht, und Sie müssen ihr Sales-Team anmailen, um es rauszufinden.* Für ein so gutes Modell ist das echt schade.

Das Token schaltet allerdings einen richtig schönen Weg frei: die **gehostete API** (`pip install tabpfn-client`). Setzen Sie `TABPFN_TOKEN`, und `.fit()`/`.predict()` laufen auf den GPUs von Prior Labs – die standardmässig **TabPFN v3.5** ausliefern und das Zeilen-Limit auf ~1'000'000 hochschrauben. Genau so habe ich v3.5 ohne lokale GPU auf dem vollen Datensatz laufen lassen: der komplette Lauf über 11k Häuser mit 5-fach-CV kam in 46 Sekunden zurück. Super zum Evaluieren – aber es bleibt dieselbe nicht-kommerzielle Lizenz, solange Sie nicht auf einer Bezahlstufe sind, und jetzt verlassen Ihre Daten Ihre Maschine.

Zwei Notausgänge, die man kennen sollte:

- Die **älteren TabPFN-2-Gewichte** stehen unter der freizügigeren *Prior Labs License* (Apache 2.0 + Attribution) – kommerzielle Nutzung ist okay. Nur eben nicht ganz so stark wie 2.5+.
- **Bei TabICL ist die Geschichte umgekehrt.** Das Modell [soda-inria/tabicl](https://github.com/soda-inria/tabicl) steht unter **BSD-3-Clause – komplett frei für kommerzielle Nutzung**, kein Token, kein Konto, kein Sales-Call. Wenn ein Foundation Model in Produktion gehen soll, kann dieser Unterschied allein die Entscheidung kippen – egal, wer hier um ein paar hundert Euro besser abschneidet.

## Die Resultate – alle acht, dieselben 11'168 Häuser

Hier der komplett faire Lauf: **jedes Modell auf dem vollen Datensatz**, derselbe 5-fach-Split, auf einer Colab-T4-GPU. Sortiert nach Median-Fehler, das Beste oben.

| Modell | MAE | Median AE | R² (log) | MdAPE | Zeit |
|---|---:|---:|---:|---:|---:|
| **🥇 TabPFN v3.5 *(API)*** | **82'452 €** | **45'061 €** | **0.784** | **11.4%** | 46 s |
| **🥈 TabPFN v2** | 82'465 € | 45'266 € | 0.784 | 11.4% | 138 s |
| **🥉 TabICL** | 87'483 € | 49'708 € | 0.760 | 12.6% | 47 s |
| ExtraTrees | 100'738 € | 57'179 € | 0.704 | 14.7% | 160 s |
| HistGradientBoosting | 97'339 € | 59'447 € | 0.736 | 15.2% | 21 s |
| RandomForest | 107'692 € | 63'739 € | 0.674 | 16.2% | 297 s |
| XGBoost *(plain vanilla)* | 103'446 € | 66'229 € | 0.707 | 16.7% | 4 s |
| Ridge (linear) | Overflow | 94'455 € | −10.5 | 23.7% | 0 s |

**Die Foundation Models haben das ganze Podest abgeräumt – mit null Tuning.**

- **Alle drei Foundation Models schlagen jedes klassische Modell.** TabPFN v3.5 und v2 liegen an der Spitze praktisch gleichauf (**45'061 €** vs. 45'266 € Median-Fehler, beide R² 0.784), TabICL wird Dritter. Der beste Baum, ExtraTrees, liegt pro Haus rund 12'000 € Median-Fehler hinter den Spitzenreitern. Keine Hyperparameter-Suche, keine Feature-Skalierung – ein Forward-Pass pro Fold.
- **TabPFN v3.5 über die API ist der pragmatische Griff unter den dreien:** identische Genauigkeit wie das lokale v2, aber in **46 s** gelaufen statt 138 s – und auf der Hardware von Prior Labs, nicht meiner.
- **TabICL ist der Schnelle** – dritter Platz, aber in **47 s** und ganz ohne Token oder Konto. Warum das zählt, dazu gleich im Fazit mehr.
- Bei den klassischen Modellen ist die Reihenfolge die gewohnte: **ExtraTrees und HistGradientBoosting schlagen beide mein Plain-Vanilla-XGBoost** (ganz ohne Tuning, Default-Parameter), das im Mittelfeld landet – obwohl es mit 4 s am schnellsten trainiert. Die Gradient-Boosting-Krone gehört nicht automatisch XGBoost.
- Ridge explodiert nach wie vor: ein R² von **−10.5** auf dem log-Ziel, der Euro-Fehler überläuft in Unsinn. Lineare Modelle und schiefe Preise vertragen sich einfach nicht.

Um die Schlagzeile einzuordnen: das beste klassische Modell liegt bei einem typischen Haus um ~57'000 € daneben; die Foundation Models drücken das auf ~45'000 € – eine **Reduktion des Median-Fehlers um ~21%**, gratis und ohne Tuning. Bei der reinen Genauigkeit kommt nichts Klassisches auch nur in die Nähe.

## Probieren Sie es selbst aus

Der ganze Benchmark ist ein einziges, kommentiertes Colab-Notebook. Es installiert die Libraries, lädt die exakt hier verwendete Feature-Matrix, jagt alle acht Modelle durch dieselbe CV-Maschinerie, zeichnet die Vergleichs-Charts und generiert sogar einen Blogpost-Entwurf aus Ihren eigenen Zahlen.

- **▶️ In Colab öffnen:** [Benchmark-Notebook starten](https://colab.research.google.com/drive/14nzIRyFmveoLyAVFmco5sQa9lbfBCeFC)
- **Repo:** [github.com/plotti/tabular-models-vs-xgboost](https://github.com/plotti/tabular-models-vs-xgboost)
- **Daten:** [`house_xy.npz`](https://github.com/plotti/tabular-models-vs-xgboost/blob/main/house_xy.npz) (11'168 × 70, plus das log-Preis-Ziel)

Öffnen Sie es in Google Colab, stellen Sie die Runtime auf eine **T4-GPU** und lassen Sie es von oben bis unten durchlaufen. Für die TabPFN-Modelle brauchen Sie einen (kostenlosen) API-Key von Prior Labs: einfach auf [priorlabs.ai](https://priorlabs.ai) registrieren, Token kopieren und im Notebook einsetzen. TabICL, XGBoost und die scikit-Modelle laufen auch ohne Key.

## Fazit

Zwei Erkenntnisse, eine für jede Hälfte des Felds.

**Unter den klassischen Modellen ist XGBoost nicht der automatische Sieger.** Auf den vollen 11'168 Zeilen war `ExtraTreesRegressor` der beste Baum und `HistGradientBoostingRegressor` dicht dahinter – beide vor einem Plain-Vanilla-XGBoost ohne jedes Tuning. Wenn XGBoost Ihr Reflex ist, war ein Fünf-Minuten-Wechsel zu HistGB oder ExtraTrees hier ~4–14% beim Median-Fehler wert – gratis Genauigkeit, die in einer Library sitzt, die Sie ohnehin schon installiert haben.

**Aber die Foundation Models haben wirklich gewonnen.** Auf den vollen 11'168 Häusern schlagen alle drei – TabPFN v3.5, TabPFN v2 und TabICL – jedes klassische Modell, alle mit **null Tuning**. Die Spitzenreiter landen bei **~45'000 € Median-Fehler (R² 0.784)**, gegenüber ~57'000 € beim besten Baum – ein Minus von ~21%. Für Modelle, die null fitten und einfach in einem Forward-Pass vorhersagen, ist das ein bemerkenswertes Resultat. Der Hype ist, zumindest auf diesem Datensatz, verdient.

Der Haken ist: „beste Genauigkeit" und „in meinem Produkt einsetzbar" sind zwei verschiedene Fragen:

- **Sie brauchen eine GPU – lokal oder über die API.** TabPFNs In-Context-Attention skaliert mit dem Trainingssatz und wurde auf meiner Laptop-CPU mit keinem einzigen Fold fertig; eine Colab-GPU (oder die gehostete API) löst das, aber die API heisst, dass Ihre Daten Ihre Maschine verlassen. HistGradientBoosting trainiert in 21 Sekunden auf allem, offline.
- **TabPFNs Lizenz könnte es komplett ausschliessen.** Es ist das genaueste Modell in diesem Test *und* genau das, das ich rechtlich nicht hinter meine Haus-Karte setzen dürfte – die nicht-kommerzielle Lizenz verbietet exakt das (API inklusive, solange Sie nicht auf einer Bezahlstufe sind), und der kommerzielle Preis ist ein „Contact Sales"-Mysterium.

Mein persönliches Fazit für die kleinanzeigen-Karte lautet also: **HistGradientBoosting ist heute das pragmatische Upgrade gegenüber XGBoost** (besser, gratis, CPU-freundlich, keine Fallstricke). Und wenn ich Foundation-Model-Genauigkeit will und dabei kommerziell sauber bleibe, ist **TabICL** – hier Dritter, aber nur ein Wimpernschlag dahinter, BSD-lizenziert, kein Token, und schneller als TabPFN v2 – das, was ich tatsächlich ausliefern würde. TabPFN gewinnt den Benchmark; TabICL gewinnt den Trade-off.

*Alle Zahlen oben sind echte 5-fach Out-of-Fold-Resultate – jedes Modell auf den vollen 11'168 Häusern, dieselben Folds, auf einer Colab-T4-GPU (TabPFN v3.5 über die gehostete API von Prior Labs).*

---

### Quellen

- [TabPFN Non-Commercial License (Prior-Labs/tabpfn_3.5, Hugging Face)](https://huggingface.co/Prior-Labs/tabpfn_3_5/blob/main/LICENSE)
- [Prior Labs – Modelle & Lizenz-Doku](https://docs.priorlabs.ai/models)
- [Prior Labs – Pricing (Free / Pro / Max / Commercial, „Contact Sales")](https://priorlabs.ai/pricing)
- [TabICL – BSD-3-Clause-Lizenz (soda-inria/tabicl)](https://github.com/soda-inria/tabicl/blob/main/LICENSE)
- [AutoGluon-Doku – Tabular Foundation Models frei für kommerzielle Nutzung](https://auto.gluon.ai/dev/tutorials/tabular/tabular-foundational-models.html)
