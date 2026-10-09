# SCHILCHER HÄUSER – Version 2 (schlanke One-Page)

Reduzierte Projektseite nach dem Aufbau von am-see-leben.at, im Design der
SCHILCHER HÄUSER (Farben, Schriften). Reines HTML/CSS/JavaScript, kein Build.

## Starten

`index.html` im Browser öffnen – oder lokal:

```bash
npx serve .
```

Schriften und Musterbilder werden online geladen (Internet nötig).

## Aufbau

Hero · Intro · Grundstück & Winzerhaus · Bildergalerie · Benefits · Lage mit
Download-Buttons · Stimmungsbild · Key Facts mit Masterplan · Preisliste ·
FAQ · Anfrageformular · Footer

## Inhalte pflegen

- **Bilder:** `js/images.js` (zentrale URL-Liste)
- **Grundstücke / Status:** Liste `LOTS` oben in `js/main.js`
- **Key Facts & FAQ:** direkt in `index.html`. Gelb hinterlegte Felder
  (Klasse `ph`) sind Platzhalter, z. B. Widmung, Bauverpflichtung, Zeitplan.
- **Masterplan:** `img/masterplan.svg` (aus den Vermessungsdaten erzeugt)

## Demo-Hinweise

- Das Formular versendet und speichert nichts, es zeigt nur eine Bestätigung.
- Download-Buttons springen zum Formular und füllen die Nachricht vor
  (die Unterlagen sind noch in Vorbereitung).
- Impressum und Datenschutz sind Platzhalter.
