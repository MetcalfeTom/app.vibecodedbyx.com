# Revisor de Memorias

Checker for Spanish building-services project reports (memorias técnicas de instalaciones) against REBT, RITE, CTE (HS3/HS4/HS5, HE, SI) and RIPCI. Asked for by arianmartiz (Twitch, Spanish engineer) on 2026-10-04: "me harías un analizador de memorias para ingeniería de instalaciones en España?" → "que cumpla con la normativa" → "todo".

## log
- v1 (2026-10-06): paste text or drop a PDF (pdf.js 3.11.174 UMD from cdnjs, loaded lazily on the first PDF). Detects installation types by keyword hits (≥2 distinct hits, or the regulation's RD number), checklist per type with article citations, derogated-reference list, numeric checks (cdt LGA/DI/interior, DI/LGA sections, diferencial 30 mA in viviendas, Ra·Ia ≤ 50/24 V, electrificación básica/elevada, 100 W/m² locales, HS4 pressure 100/150/500 kPa, velocity, ACS 50–65 °C, HS5 pendiente 1/2 %, RITE art. 15 power threshold, RITE IT 1.1.4.1.2 temps, IDA l/s·persona, heat recovery > 0,5 m³/s, cocina 50 l/s, ESS threshold 450.759,08 €, emergency 1/5 lux + 1 h, extintores 15 m + 0,80–1,20 m, SI3 recorridos 25/50 m). Summary tiles with score per type, collapsible sections, falta/revisar/correcto filter, toggles to force an installation type on/off, "copiar informe" plain text. "Cargar ejemplo" demo memoria has 3 deliberate faltas (RD 1942/1993, C1 cdt 3,8 % in vivienda, no estudio de seguridad y salud) plus UNE 20460 / RITE without RD 178/2021 as revisar. `#ejemplo` hash auto-runs the demo.
- v1.1 (2026-10-06): tested with a generated 2-page PDF (office, table rows, 14 faltas) and a scan-only PDF (friendly error). cdt kind per table row (LGA/DI/Cn), ITC-BT-25 table 1 circuit check (C1 10 A/1,5 … C5 16 A/2,5), IDA category + l/s·persona across line breaks, winter/summer temperature pairing fixed, "Señalar en el texto" selects the quoted snippet in the textarea, print/PDF button (opens all sections), detected types folded into one line ("cambiar"), per-law counts coloured, phone tiles two-up with stacked counts.

## issues
- Pure keyword/number matching: a mention counts as "correcto" even if the content is thin. Messages say "Aparece en el texto".
- Clause splitting: '.', ';' or a newline followed by an uppercase/bullet. PDF tables (one value per cell) can lose their row context.
- Number parsing: '1.250' is read as 1250 (thousands), '0.500' as 0.5.

## todos
- More checks: ITC-BT-28 cables (AS), HS3 garage 120 l/s per plaza, HE4 %, ICT/gas/ascensores if arianmartiz wants them.

## notes
- Rules only where confident; when a limit depends on conditions (meter arrangement, alumbrado vs otros usos, number of exits) the finding is "revisar" with the condition spelled out.
- Test PDFs: scratchpad mem/mkpdf.py writes prueba.pdf + escaneado.pdf (hand-written PDF, Helvetica/WinAnsi).
- window.__RM = {analyse, loadFile, report, demo, tally} for probes. Node harness: scratchpad mem/nt.js (stubs the DOM, prints every finding).
- rx() turns ' ?' into \s? and ' ' into \s+ — write patterns with plain spaces.
