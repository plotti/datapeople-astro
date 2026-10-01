---
title: "Wie gut sind Tabular Foundation Models wirklich – schlagen TabPFN und TabICL das gute alte XGBoost?"
description: "Ein direkter Vergleich auf ~11'000 echten deutschen Hausinseraten: XGBoost und die besten Regressoren aus scikit-learn gegen die neuen Tabular Foundation Models TabPFN v2, v3.5 und TabICL. Gleiche Features, gleiche Folds, ehrliche Zahlen – plus ein Colab-Notebook zum Nachspielen."
pubDate: 2026-10-01
readTime: 14
category: "Machine Learning"
tags: ["Machine Learning", "TabPFN", "XGBoost", "scikit-learn", "Foundation Models", "Immobilien", "Benchmark"]
cover: "../../assets/blog/immo-map-germany.png"
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
| **ExtraTrees** | 100'477 € | **56'928 €** | 0.704 | **14.5%** | 14 s |
| **HistGradientBoosting** | **97'136 €** | 59'870 € | **0.736** | 15.1% | 63 s |
| RandomForest | 107'372 € | 63'262 € | 0.674 | 16.0% | 22 s |
| XGBoost *(meine Produktiv-Config)* | 103'460 € | 65'716 € | 0.707 | 16.6% | 3 s |
| Ridge (linear) | – | 94'604 € | – | 23.7% | 0 s |

Zwei Dinge zum Mitnehmen:

1. **scikit-learns `HistGradientBoostingRegressor` und `ExtraTreesRegressor` schlagen beide mein getuntes XGBoost** – ExtraTrees um ~13% beim Median-Fehler, HistGB mit dem besten R² im ganzen Feld. Die Gradient-Boosting-Krone gehört also nicht automatisch XGBoost.
2. **Lineare Regression fällt auseinander.** Ridges R² auf dem log-Ziel rutscht steil ins Negative und der MAE überläuft in blanken Unsinn – ein lineares Modell, das im Log-Raum extrapoliert, produziert am Preis-Langschwanz absurde Euro-Werte. Eine schöne Erinnerung daran, *warum* bei solchen Daten alle zu Bäumen greifen.

## Auftritt der Foundation Models

Jetzt der Realitäts-Check aus dem Betrieb: **TabPFN und TabICL brauchen eine GPU.** Die In-Context-Attention von TabPFN skaliert mit der Grösse des Trainingssatzes, auf einer CPU ist das jenseits von ein paar hundert Zeilen hoffnungslos – auf meinem M-Serie-Laptop wurde ein einziger Fold mit 2'400 Zeilen schlicht nie fertig. Das ist kein Vorwurf an das Modell; es ist genau der Grund, warum das begleitende Notebook auf eine Colab-GPU setzt.

Und weil die Foundation Models bei ≤10k Zeilen am glücklichsten sind und der faire Vergleich jedes Modell auf *demselben* Arbeitsdatensatz braucht, lässt das Notebook alle sieben Modelle zusätzlich zu diesen Volldaten-Zahlen auf einem gemeinsamen Subsample (standardmässig 4'000 Zeilen) laufen.

## Der Haken mit der Lizenz – und der ist gross

Bevor Sie sich in TabPFN verlieben, lesen Sie das Kleingedruckte – ich bin voll reingelaufen. Um TabPFN überhaupt zu nutzen, müssen Sie **ein Konto bei Prior Labs anlegen, deren Nutzungsbedingungen akzeptieren und ein API-Token besorgen** (`TABPFN_TOKEN`); das aktuelle Paket lädt die Gewichte für lokale Inferenz nicht mal herunter, solange Sie die Lizenz nicht akzeptiert haben. Auf einer Maschine ohne Browser knallt Ihnen schon der allererste `.fit()`-Aufruf einen Fehler hin mit der Aufforderung, sich doch bitte einzuloggen.

Und die Lizenz selbst ist **nicht-kommerziell**. Ab TabPFN-2.5 stehen die Modellgewichte unter Prior Labs' *Non-Commercial License*: gratis für Forschung, Tests und interne Evaluation, aber Sie dürfen das Modell, seine Ableitungen oder sogar seine *Outputs* **nicht** für irgendeinen kommerziellen oder produktiven Zweck nutzen. Das schliesst ausdrücklich ein: umsatzgenerierende Produkte, Kunden-Deliverables, Konkurrenz-Benchmarking für Beschaffung und – der Killer für sowas wie meine Haus-Karte – *die Nutzung der Vorhersagen für interne kommerzielle Entscheidungen*. Für alles Kommerzielle brauchen Sie entweder ihre gehostete API oder eine Commercial Enterprise License von `sales@priorlabs.ai`.

Und was kostet das? **Weiss öffentlich niemand.** Prior Labs listet Free-/Pro-/Max-API-Stufen und kommerzielle On-Prem-/Private-Cloud-Lizenzen auf, veröffentlicht aber **keine Preise** – jede kommerzielle Stufe ist ein „Contact Sales". Die Gratis-Stufe hat unspezifizierte „tägliche & monatliche Limits". Die ehrliche Antwort auf „Kann ich das in Produktion nutzen, und was kostet es?" ist also: *vielleicht, und Sie müssen ihr Sales-Team anmailen, um es rauszufinden.* Für ein so gutes Modell ist das echt schade.

Das Token schaltet allerdings einen richtig schönen Weg frei: die **gehostete API** (`pip install tabpfn-client`). Setzen Sie `TABPFN_TOKEN`, und `.fit()`/`.predict()` laufen auf den GPUs von Prior Labs – die standardmässig **TabPFN v3.5** ausliefern und das Zeilen-Limit auf ~1'000'000 hochschrauben. Genau so bin ich ohne lokale GPU an die Volldaten-Zahlen für v3.5 weiter unten gekommen: der komplette Lauf über 11k Häuser mit 5-fach-CV kam in 29 Sekunden zurück. Super zum Evaluieren – aber es bleibt dieselbe nicht-kommerzielle Lizenz, solange Sie nicht auf einer Bezahlstufe sind, und jetzt verlassen Ihre Daten Ihre Maschine.

Zwei Notausgänge, die man kennen sollte:

- Die **älteren TabPFN-2-Gewichte** stehen unter der freizügigeren *Prior Labs License* (Apache 2.0 + Attribution) – kommerzielle Nutzung ist okay. Nur eben nicht ganz so stark wie 2.5+.
- **Bei TabICL ist die Geschichte umgekehrt.** Das Modell [soda-inria/tabicl](https://github.com/soda-inria/tabicl) steht unter **BSD-3-Clause – komplett frei für kommerzielle Nutzung**, kein Token, kein Konto, kein Sales-Call. Wenn ein Foundation Model in Produktion gehen soll, kann dieser Unterschied allein die Entscheidung kippen – egal, wer hier um ein paar hundert Euro besser abschneidet.

## Die Resultate – alle sieben, dieselben 4'000 Häuser

Hier der Apples-to-Apples-Lauf: jedes Modell auf demselben 4'000-Zeilen-Subsample, den gleichen Folds, auf einer Colab-T4-GPU. Sortiert nach Median-Fehler, das Beste oben.

| Modell | MAE | Median AE | R² (log) | MdAPE | Zeit |
|---|---:|---:|---:|---:|---:|
| **🥇 TabPFN v2** | **94'503 €** | **55'895 €** | **0.743** | **14.1%** | 63 s |
| TabPFN v3.5 *(API)* | 94'509 € | 55'742 € | 0.743 | 14.1% | 20 s |
| **🥈 TabICL** | 100'845 € | 61'824 € | 0.714 | 15.3% | 20 s |
| HistGradientBoosting | 109'460 € | 67'980 € | 0.681 | 16.8% | 15 s |
| XGBoost *(produktiv)* | 110'865 € | 70'767 € | 0.677 | 17.8% | 3 s |
| ExtraTrees | 117'369 € | 70'954 € | 0.634 | 18.1% | 59 s |
| RandomForest | 123'698 € | 75'393 € | 0.597 | 19.2% | 106 s |
| Ridge (linear) | Overflow | 99'189 € | −40.1 | 24.8% | 0 s |

**Die Foundation Models haben die Spitzenplätze abgeräumt – mit null Tuning.**

- **TabPFN gewinnt klar.** Sein Median-Fehler von **55'895 €** schlägt das beste klassische Modell (HistGradientBoosting) um ~18% und mein produktives XGBoost um ~21%. Dazu das beste R² (0.743) und der engste typische Prozentfehler (14.1%). Keine Hyperparameter-Suche, keine Feature-Skalierung – ein Forward-Pass pro Fold.
- **Das neuere TabPFN v3.5** (über die gehostete API von Prior Labs, die v3.5 standardmässig ausliefert) landet bei dieser Grösse praktisch gleichauf mit v2 – 55'742 € Median – hat aber noch ein Ass im Ärmel, das die anderen nicht haben; dazu gleich mehr.
- **TabICL wird Zweiter** unter den lokalen Modellen, ~10% vor HistGradientBoosting, und das in **20 s** – dreimal schneller als TabPFN v2, weil seine Architektur auf Skalierung gebaut ist.
- Bei den klassischen Modellen führt wieder HistGradientBoosting, und XGBoost landet im Mittelfeld. (Kleiner Hinweis: auf diesem kleineren 4'000-Zeilen-Subsample verschiebt sich die Baum-Reihenfolge leicht gegenüber dem Volldaten-Lauf oben – ExtraTrees braucht mehr Daten, um zu glänzen – aber die Kernaussage, dass *XGBoost nicht automatisch der beste Baum ist*, hält in beiden Läufen.)
- Ridge explodiert nach wie vor: ein R² von **−40** auf dem log-Ziel. Lineare Modelle und schiefe Preise vertragen sich einfach nicht.

### TabPFN v3.5 auf *allen* 11'168 Häusern

Das 4'000-Zeilen-Limit gab es nur, weil TabPFN v2 und TabICL in-context arbeiten und auf einer Laptop-GPU jenseits von ~10k Zeilen unhandlich werden. Aber TabPFN **v3.5 über die gehostete API verkraftet bis zu einer Million Zeilen** – also habe ich es auf den vollen Datensatz losgelassen, dieselbe 5-fach-CV:

| Modell | MAE | Median AE | R² (log) | MdAPE | Zeit |
|---|---:|---:|---:|---:|---:|
| **TabPFN v3.5 – alle 11'168 Häuser** | **82'357 €** | **46'529 €** | **0.784** | **11.6%** | 29 s |

Das ist eine andere Liga: **46'529 €** Median-Fehler und **R² 0.784**, gegenüber ~56'000 € / 0.74 auf dem 4k-Subsample und ~68'000 € beim besten klassischen Modell. Mehr Daten haben das Foundation Model schlicht besser gemacht – und es war trotzdem in unter 30 Sekunden durch, weil die Schwerarbeit auf den GPUs von Prior Labs läuft, nicht auf meinen. Bei der reinen Genauigkeit kommt in diesem Test nichts anderes auch nur in die Nähe.

## Probieren Sie es selbst aus

Der ganze Benchmark ist ein einziges, kommentiertes Colab-Notebook. Es installiert die Libraries, lädt die exakt hier verwendete Feature-Matrix, jagt alle sieben Modelle durch dieselbe CV-Maschinerie, zeichnet die Vergleichs-Charts und generiert sogar einen Blogpost-Entwurf aus Ihren eigenen Zahlen.

- **▶️ In Colab öffnen:** [Benchmark-Notebook starten](https://colab.research.google.com/drive/1BbOUrao09E6oYhPL4dEDHfWSPxrtNtlh)
- **Repo:** [github.com/plotti/tabular-models-vs-xgboost](https://github.com/plotti/tabular-models-vs-xgboost)
- **Daten:** [`house_xy.npz`](https://github.com/plotti/tabular-models-vs-xgboost/blob/main/house_xy.npz) (11'168 × 70, plus das log-Preis-Ziel)

Öffnen Sie es in Google Colab, stellen Sie die Runtime auf eine **T4-GPU** und lassen Sie es von oben bis unten durchlaufen. Tauschen Sie Ihre eigene `house_xy.npz` rein, und dasselbe Protokoll benchmarkt jede beliebige tabellarische Regressionsaufgabe – es ist komplett datensatz-agnostisch.

## Fazit

Zwei Erkenntnisse, eine für jede Hälfte des Felds.

**Unter den klassischen Modellen ist XGBoost nicht der automatische Sieger.** scikit-learns `HistGradientBoostingRegressor` schlägt mein getuntes Produktiv-XGBoost sowohl auf den vollen 11k Zeilen als auch auf dem 4'000-Zeilen-Subsample, und auf den Volldaten war `ExtraTreesRegressor` sogar der Beste von allen. Wenn XGBoost Ihr Reflex ist, war ein Fünf-Minuten-Wechsel zu HistGB oder ExtraTrees hier ~4–13% beim Median-Fehler wert – gratis Genauigkeit, die in einer Library sitzt, die Sie ohnehin schon installiert haben.

**Aber die Foundation Models haben wirklich gewonnen.** Im ausgeglichenen 4'000-Zeilen-Feld holten sich TabPFN und TabICL die Spitzenplätze, beide vor jedem klassischen Modell, beide mit **null Tuning**. Und als ich **TabPFN v3.5 über die API auf alle 11'168 Häuser** losliess, zog es komplett davon – **46'529 € Median-Fehler, R² 0.784**, gegenüber ~68'000 € beim besten Baum. Für ein Modell, das null fittet und einfach in einem Forward-Pass vorhersagt, ist das ein bemerkenswertes Resultat. Der Hype ist, zumindest auf diesem Datensatz, verdient.

Der Haken ist: „beste Genauigkeit" und „in meinem Produkt einsetzbar" sind zwei verschiedene Fragen:

- **Sie brauchen eine GPU – lokal oder über die API.** TabPFNs In-Context-Attention skaliert mit dem Trainingssatz und wurde auf meiner Laptop-CPU mit keinem einzigen Fold fertig; die gehostete API löst das (so kam der Volldaten-Lauf von v3.5 zustande), aber dann verlassen Ihre Daten Ihre Maschine. HistGradientBoosting trainiert in 15 Sekunden auf allem, offline.
- **TabPFNs Lizenz könnte es komplett ausschliessen.** Es ist das genaueste Modell in diesem Test *und* genau das, das ich rechtlich nicht hinter meine Haus-Karte setzen dürfte – die nicht-kommerzielle Lizenz verbietet exakt das (API inklusive, solange Sie nicht auf einer Bezahlstufe sind), und der kommerzielle Preis ist ein „Contact Sales"-Mysterium.

Mein persönliches Fazit für die kleinanzeigen-Karte lautet also: **HistGradientBoosting ist heute das pragmatische Upgrade gegenüber XGBoost** (besser, gratis, CPU-freundlich, keine Fallstricke). Und wenn ich Foundation-Model-Genauigkeit will und dabei kommerziell sauber bleibe, ist **TabICL** – hier Zweiter, BSD-lizenziert, kein Token, 3× schneller als TabPFN – das, was ich tatsächlich ausliefern würde. TabPFN gewinnt den Benchmark; TabICL gewinnt den Trade-off.

*Alle Zahlen oben sind echte 5-fach Out-of-Fold-Resultate – klassische Modelle auf den vollen 11'168 Häusern; das Sieben-Modelle-Ranking auf einem identischen 4'000-Zeilen-Subsample (Colab-T4-GPU); und TabPFN v3.5 sowohl auf dem 4k-Subsample als auch auf den vollen 11'168 Häusern über die gehostete API von Prior Labs.*

---

### Quellen

- [TabPFN Non-Commercial License (Prior-Labs/tabpfn_3.5, Hugging Face)](https://huggingface.co/Prior-Labs/tabpfn_3_5/blob/main/LICENSE)
- [Prior Labs – Modelle & Lizenz-Doku](https://docs.priorlabs.ai/models)
- [Prior Labs – Pricing (Free / Pro / Max / Commercial, „Contact Sales")](https://priorlabs.ai/pricing)
- [TabICL – BSD-3-Clause-Lizenz (soda-inria/tabicl)](https://github.com/soda-inria/tabicl/blob/main/LICENSE)
- [AutoGluon-Doku – Tabular Foundation Models frei für kommerzielle Nutzung](https://auto.gluon.ai/dev/tutorials/tabular/tabular-foundational-models.html)
