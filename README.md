# Case 4: Acute limb ischemia

Click-through case presentation for CVS I. People scan a QR code and work through the same case on their phones.

- **Deck:** https://punnawit9285.github.io/acute-limb-ischemia/
- **Tutor view (answers + SAY lines):** https://punnawit9285.github.io/acute-limb-ischemia/tutor.html

## Course rules this deck follows

- At most 6 slides, not counting the cover and the references. The search method takes 1 of the 6 and comes first, because sources and search process must be stated before presenting.
- 6 minutes per person. The talk is budgeted at 5:20, and the tutor view shows a "by m:ss" target on each slide.
- Every claim carries a citation. Numbers refer to the Vancouver list on the last talk slide, in order of first appearance. `5 Ch13` means reference 5, chapter 13.
- Hand-in is a PDF of at most 10 MB. Build it with `npm run pdf`.

Only cite what has been opened. `[abstract]` in the reference list marks a source read at abstract level only.

## Presenting

Open the deck on the projector and `tutor.html` in another window of the same browser. The tutor view follows the deck. The 16 slides after the references are **More practice**: reachable from the references slide or the tab, and Next never runs into them.

| Key | Does |
| --- | --- |
| `Space` / `Enter` / `PageDown` | Reveal the next thing, or move on when nothing is left |
| `←` `→` | Previous or next slide |
| `PageUp` | Undo the last reveal |
| `A`–`E` | Choose an option (the answer shows at once) |
| `Q` | Big QR code |
| `R` | Reset this slide |
| `F` | Full screen |

Rehearsing leaves answers in the browser. Press **Start over** on the references slide before presenting.

Every slide has its own QR code that opens that slide, so a late scan lands on the current page. Tapping a choice shows the answer immediately. In tap-all tasks each tap is marked right or wrong at once, and the explanation opens when every right one is found.

## Editing

All content is in `slides.js`. `c('5 Ch13')` writes a citation. `{{text}}` makes a click-to-reveal blank. `t` is a slide's time budget in seconds, and `bonus: true` moves a slide to More practice. The presenter's name, ID and group go in `config.js`.

```bash
npm install
npm run qr                                   # after changing a slide id or the address
CHROME="/path/to/Google Chrome" npm run pdf -- "output.pdf"
```

The PDF is the real slides with every answer open (`index.html?pdf=1`). The build fails if a slide is cut off or the file is over 10 MB.

## Live sync and vote counts (off)

GitHub Pages is static, so phones can only follow the presenter and send votes through a realtime relay. `live.js` does this and is dormant until `config.js` lists a relay. The presenter then opens `index.html?host=1`. If the relay is missing or unreachable, phones stay self-paced.

Tested only against a local broker, not a hosted relay.

## Figures

Talk: the chest film comes from the CVS I recall file AC81 CVS MCQ, with labels from AC80 CVS1 MCQ. These are internal course files, not published sources, and the slide says so.

More practice: JVP (AC80), ECG Fig. 10-1 (ECG lab direction), fast action potential (heart contraction lab slide), AF tracing (Disturbance of CVS II lab). The labelled normal JVP comes from Stanford Medicine 25 via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:JVP_waveform.png), public domain.

The lecture's own symptoms-and-signs and flowchart slides are not reproduced: they were used as the answer key, and the flowchart is rebuilt so the audience can predict each box.
