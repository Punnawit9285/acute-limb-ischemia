# Case 4: Acute limb ischemia

Click-through case for CVS I peer tutoring (Peer support 82). People scan a QR code and work through the same case on their phones.

- **Deck:** https://punnawit9285.github.io/acute-limb-ischemia/
- **Tutor view (answers + SAY lines):** https://punnawit9285.github.io/acute-limb-ischemia/tutor.html

## Presenting

Open the deck on the projector and `tutor.html` in another window of the same browser. The tutor view follows the deck.

| Key | Does |
| --- | --- |
| `Space` / `Enter` / `PageDown` | Reveal the next thing, or move on when nothing is left |
| `←` `→` | Previous or next slide |
| `PageUp` | Undo the last reveal |
| `A`–`E` | Choose an option |
| `Q` | Big QR code |
| `R` | Reset this slide |
| `F` | Full screen |

Rehearsing leaves answers in the browser. Press **Start over** on the last slide before presenting.

Every slide has its own QR code that opens that slide, so a late scan lands on the current page. Phones get a **Show my answer** button: a full-screen coloured letter to hold up, so you can read the room without a backend.

## Editing

All content is in `slides.js`. `{{text}}` makes a click-to-reveal blank. After changing a slide id or the address in `config.js`, rebuild the QR codes:

```bash
npm install
npm run qr
```

## Live sync and vote counts (off)

GitHub Pages is static, so phones can only follow the presenter and send votes through a realtime relay. `live.js` does this and is dormant until `config.js` lists a relay. The presenter then opens `index.html?host=1`. If the relay is missing or unreachable, phones stay self-paced.

Tested only against a local broker, not a hosted relay.

## Figures

Real figures from the course material, cited in each caption: chest film (AC81, labels from AC80), JVP (AC80), ECG Fig. 10-1 (ECG lab direction), fast action potential (heart contraction lab slide), AF tracing (Disturbance of CVS II lab). The lecture's own symptoms-and-signs and flowchart slides are not reproduced: they were used as the answer key, and the flowchart is rebuilt so the audience can predict each box.
