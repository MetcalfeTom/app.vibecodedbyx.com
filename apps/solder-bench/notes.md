# solder-bench · notes

## log
- 2026-07-11: v1 (chat ask: electronics project manager — BOM tracking + pin assignment tables + ESP32 pinout diagrams, browser-based). **Board model**: ESP32 DevKit V1 30-pin (DOIT layout — LEFT: EN,VP,VN,D34,D35,D32,D33,D25,D26,D27,D14,D12,GND,D13,VIN; RIGHT: D23,D22,TX0,RX0,D21,D19,D18,D5,TX2,RX2,D4,D2,D15,GND,3V3; GND2 internal id to keep keys unique, displayed as GND). GPIO fact tables: INPUT_ONLY {34,35,36,39}, ADC1/ADC2 channels, DAC 25/26, touch, strapping {0,2,5,12,15}, UART pins. **Pure rule engine** `pinWarnings(id, {signal,dir})` — errors: output/inout on input-only pin, analog on no-ADC pin, any signal on power/EN; warnings: strapping pins, UART0 loss, ADC2-dies-with-WiFi. All 6 rules node-verified. **Pinout SVG**: built from JS pin arrays (namespace createElementNS), board body + WROOM shield + USB, clickable/keyboard-focusable pin groups (tabindex+role=button+aria-label), assigned pins fill copper w/ signal label outside the row, selected ring. Click → side panel: capabilities line, signal/direction/note form, live warning box (updates on input BEFORE saving), assignment table with amber/red row edging per warnings. **BOM**: inline-editable rows (ref/part/value/pkg/qty/unit-cost/status needed→ordered→received→mounted w/ color coding), totals strip (lines/parts/€cost/%mounted by qty), CSV export (proper quote escaping, node-verified), add/delete. **Projects**: multi-project via header select (new/rename/delete w/ confirm + last-project guard), whole-project JSON export/import (shape-validated). All in localStorage `solder-bench-v1`; seed project ships with ESP32+LED+resistor BOM and D2=STATUS_LED so nothing looks empty. PCB aesthetic: soldermask green grid bg, copper/gold accents, Michroma + Fira Code. Pollinations OG (flux seed 2288). Hook `__bench {pinWarnings,capsOf,bomToCsv,csvEsc,GPIO,store,proj,selectPin}`.

## issues
- Board is hardcoded DevKit V1 30-pin. If chat asks for the 38-pin or ESP32-S3, add a BOARDS registry (pin arrays + GPIO map are already data-driven — mostly a data task).
- prompt()/confirm() used for project ops — fine for v1, custom modals if chat complains.

## todos
- More boards (ESP32-S3 DevKitC, 38-pin WROOM, Pico W?).
- Wire-color column in assignment table.
- Print stylesheet for the pinout + BOM (workshop paper copy).
