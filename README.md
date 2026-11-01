# Wide Mode (Chromium extension)

One click makes a narrow web page use your full screen width. Fixed max-width containers are widened, scroll boxes are expanded, and if columns still do not fit, the page is scaled down just enough (never below 40 %) so nothing scrolls sideways. **Table and column widths stay as the site defines them**, so columns do not stretch.

Works in Brave, Chrome, Edge and other Chromium browsers (Manifest V3). Applies to the current tab only: click again or reload to go back. The badge shows "ON" when active, "!" means the page is blocked for extensions (e.g. `brave://` pages).

*Deutsch: siehe unten.*

## Install (once)
1. Download or clone this repository.
2. Open `brave://extensions` (Chrome: `chrome://extensions`, Edge: `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the `wide-mode` folder.
5. Pin the extension via the puzzle icon.

Do not move or delete the folder afterwards. After editing the code, click the reload icon on the extension card.

## How it works
- `manifest.json`: permissions `activeTab` and `scripting` only. No data leaves your browser, nothing is stored.
- `background.js`: reacts to the toolbar click and injects the script.
- `toggle.js`: the actual logic (unlock widths, freeze tables, fit to screen).

## Limits
Page layouts differ a lot. Some pages need special handling; issues and pull requests are welcome.

## License
MIT, see [LICENSE](LICENSE).

---

# Breit-Modus (Chromium-Erweiterung)

Ein Klick: Eine schmale Webseite nutzt die volle Bildschirmbreite. Feste Maximalbreiten werden aufgehoben, Scroll-Boxen ausgeklappt, und passen Spalten trotzdem nicht, wird die Seite nur so weit verkleinert (nie unter 40 %), dass nichts seitlich scrollt. **Tabellen- und Spaltenbreiten bleiben wie von der Seite vorgegeben**, die Spalten werden also nicht gestreckt.

Läuft in Brave, Chrome, Edge und anderen Chromium-Browsern. Gilt nur für den aktuellen Tab: erneut klicken oder neu laden = zurück. Das Badge zeigt "ON", "!" heißt: Seite für Erweiterungen gesperrt (z. B. `brave://`).

## Installation (einmalig)
1. Repository herunterladen oder klonen.
2. `brave://extensions` öffnen (Chrome: `chrome://extensions`, Edge: `edge://extensions`).
3. **Entwicklermodus** einschalten.
4. **Entpackte Erweiterung laden** und den Ordner `wide-mode` wählen.
5. Über das Puzzle-Symbol anheften.

Ordner danach nicht verschieben oder löschen.

## Lizenz
MIT, siehe [LICENSE](LICENSE).
