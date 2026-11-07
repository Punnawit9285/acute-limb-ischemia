# Case 4: Acute limb ischemia

Click-through case for CVS I peer tutoring (Peer support 82). People scan a QR code and work through the same case on their phones.

- **Deck:** https://punnawit9285.github.io/acute-limb-ischemia/
- **Tutor view (answers + SAY lines):** https://punnawit9285.github.io/acute-limb-ischemia/tutor.html

## Presenting

The talk is 11 slides, budgeted at 5:30 for a 6-minute slot. The tutor view shows a "by m:ss" target on each slide. The other 11 slides are **More practice**: reachable from the last slide or the tab, and Next never runs into them.

Open the deck on the projector and `tutor.html` in another window of the same browser. The tutor view follows the deck.

| Key | Does |
| --- | --- |
| `Space` / `Enter` / `PageDown` | Reveal the next thing, or move on when nothing is left |
| `←` `→` | Previous or next slide |
| `PageUp` | Undo the last reveal |
| `A`–`E` | Choose an option (the answer shows at once) |
| `Q` | Big QR code |
| `R` | Reset this slide |
| `F` | Full screen |

Rehearsing leaves answers in the browser. Press **Start over** on the last slide before presenting.

Every slide has its own QR code that opens that slide, so a late scan lands on the current page. Tapping a choice shows the answer immediately. In tap-all tasks each tap is marked right or wrong at once, and the explanation opens when every right one is found.

## Editing

All content is in `slides.js`. `{{text}}` makes a click-to-reveal blank. `t` is a slide's time budget in seconds, and `bonus: true` moves a slide to More practice. After changing a slide id or the address in `config.js`, rebuild the QR codes:

```bash
npm install
npm run qr
```

## Live sync and vote counts (off)

GitHub Pages is static, so phones can only follow the presenter and send votes through a realtime relay. `live.js` does this and is dormant until `config.js` lists a relay. The presenter then opens `index.html?host=1`. If the relay is missing or unreachable, phones stay self-paced.

Tested only against a local broker, not a hosted relay.

## Figures

Real figures from the course material, cited in each caption: chest film (AC81, labels from AC80), JVP (AC80), ECG Fig. 10-1 (ECG lab direction), fast action potential (heart contraction lab slide), AF tracing (Disturbance of CVS II lab). The one exception is the labelled normal JVP, which the course material does not have: it comes from Stanford Medicine 25 via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:JVP_waveform.png), public domain. The lecture's own symptoms-and-signs and flowchart slides are not reproduced: they were used as the answer key, and the flowchart is rebuilt so the audience can predict each box.
