/* Deck engine. Works entirely offline from any backend: every reveal, answer and score lives on the device.
   live.js (optional, see config.js) hooks in through window.Deck. */
(function () {
  'use strict';
  var A = window.ALI, S = A.slides, FLOW = A.flow;
  var TUTOR = window.ALI_MODE === 'tutor';
  var BASE = window.ALI_BASE;
  var LET = 'ABCDEFGH';
  var CARD_COL = ['#c0392b', '#1f4f97', '#b7791f', '#13744a', '#6b3fa0'];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('ali:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ali:' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var byId = {}; S.forEach(function (s, i) { byId[s.id] = i; });
  var rev = LS.get('rev', {}), sel = LS.get('sel', {}), idx = 0;
  var listeners = {};
  function emit(ev, data) { (listeners[ev] || []).forEach(function (f) { f(data); }); }

  /* ---------- QR ---------- */
  function qrSvg(id) {
    var q = window.ALI_QR[id] || window.ALI_QR.start;
    var size = q.n + 8;
    return '<svg viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges" role="img" aria-label="QR code that opens this page"><rect width="' + size + '" height="' + size + '" fill="#fff"/><path transform="translate(4 4)" fill="#000" d="' + q.d + '"/></svg>';
  }
  function pageUrl(id) { return BASE + (id === 'start' ? '' : '#' + id); }
  function renderRail(id) {
    $('#railqr').innerHTML = qrSvg(id);
    $('#qrthumb').innerHTML = qrSvg(id);
    $('#railhere').textContent = '#' + id;
  }
  function openQr() {
    var id = S[idx].id;
    var o = document.createElement('div');
    o.className = 'overlay';
    o.innerHTML = '<div class="ovbox"><div class="ovpaper">' + qrSvg(id) + '</div><p class="ovcap">สแกนเพื่อเปิดหน้านี้ในมือถือ<br>' + pageUrl(id).replace('https://', '') + '</p></div>';
    o.addEventListener('click', function () { o.remove(); });
    document.body.appendChild(o);
  }

  /* ---------- pieces ---------- */
  function cloze(html) { return html.replace(/\{\{([\s\S]*?)\}\}/g, '<span class="cz" data-step role="button" tabindex="0" aria-label="reveal">$1</span>'); }
  function eyebrow(s) {
    var sec = s.sec >= 0 ? A.sections[s.sec] : null;
    var exam = /^AC/.test(s.src || '');
    return '<div class="eyebrow"><span class="chip ' + (exam ? 'exam' : 'kind') + '">' + s.tag + '</span>' +
      (s.src && s.src !== 'Case' ? '<span class="chip">' + s.src + '</span>' : '') +
      '<span class="sp"></span>' + (sec ? '<span>' + sec.k + ' &#183; ' + sec.name + '</span>' : '') + '</div>';
  }
  function optsHtml(s) {
    return '<ol class="opts">' + s.o.map(function (t, i) {
      return '<li><button type="button" class="opt' + (i === s.a ? ' isans' : '') + '" data-v="' + i + '"><span class="vbar"></span><span class="L">' + LET[i] + '</span><span class="ot">' + t + '</span><span class="mk" aria-hidden="true"></span></button></li>';
    }).join('') + '</ol>';
  }
  function explainHtml(s, head) {
    var ans = head || ('Answer ' + LET[s.a] + ' &#183; ' + s.o[s.a]);
    return '<div class="explain" data-step><div class="ans">' + ans + '</div><ul class="ex-list">' +
      s.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' + (s.figAfter || '') + '</div>';
  }
  function flowHtml(opts) {
    /* opts: known[], reveals[], steps(bool), large(bool) */
    var known = opts.known || [], reveals = opts.reveals || [];
    var html = '<div class="fc' + (opts.large ? ' large' : '') + '"><svg class="edges" aria-hidden="true"></svg>';
    FLOW.rows.forEach(function (row, r) {
      row.forEach(function (k) {
        var n = FLOW.nodes[k];
        var isKnown = known.indexOf(k) >= 0, isRev = reveals.indexOf(k) >= 0;
        var cls = 'fnode' + (n.hot ? ' hot' : '') + (n.chip ? ' chipn' : '') + (isKnown ? '' : ' blank') + (isRev ? ' next' : '');
        var stepAttr = (opts.steps && !isKnown) ? ' data-step data-order="' + FLOW.order.indexOf(k) + '"' : '';
        html += '<div class="' + cls + (stepAttr ? ' steppable' : '') + '" data-node="' + k + '" style="grid-row:' + (r + 1) + ';grid-column:' + n.col + '"' + stepAttr + '>' +
          '<span>' + n.t + (n.sub ? '<span class="sub">(' + n.sub + ')</span>' : '') + '</span></div>';
      });
    });
    return html + '</div>';
  }
  function drawEdges(fc) {
    var svg = $('svg.edges', fc); if (!svg) return;
    var box = fc.getBoundingClientRect();
    var pos = {};
    $$('.fnode', fc).forEach(function (el) {
      var r = el.getBoundingClientRect();
      pos[el.getAttribute('data-node')] = { x: r.left - box.left + r.width / 2, top: r.top - box.top, bot: r.bottom - box.top, el: el };
    });
    var h = '<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="var(--ink2)"/></marker>' +
      '<marker id="ahl" markerWidth="11" markerHeight="11" refX="8.5" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--art)"/></marker></defs>';
    FLOW.edges.forEach(function (e) {
      var a = pos[e[0]], b = pos[e[1]]; if (!a || !b) return;
      var off = a.el.classList.contains('blank') || b.el.classList.contains('blank');
      var hl = a.el.classList.contains('hl') && b.el.classList.contains('hl');
      var toChip = e[1] === 'atp';
      h += '<line class="e' + (off ? ' off' : '') + (hl ? ' hl' : '') + '" x1="' + a.x.toFixed(1) + '" y1="' + a.bot.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + (b.top - 1).toFixed(1) + '"' +
        (off || toChip ? '' : ' marker-end="url(#' + (hl ? 'ahl' : 'ah') + ')"') + '/>';
    });
    svg.innerHTML = h;
  }
  function fig2zoom(img) {
    var wrap = img.closest('.cxrwrap');
    if (wrap) {
      var ov = document.createElement('div');
      ov.className = 'overlay';
      ov.innerHTML = '<div class="ovbox ' + ($('#stage .card').classList.contains('rev') ? 'rev' : '') + '"><div class="ovcxr">' + wrap.outerHTML + '</div></div>';
      ov.addEventListener('click', function () { ov.remove(); });
      document.body.appendChild(ov);
      return;
    }
    var cap = img.closest('.scan') ? $('figcaption', img.closest('.scan')) : null;
    var o = document.createElement('div');
    o.className = 'overlay';
    o.innerHTML = '<div class="ovbox"><div class="ovpaper"><img src="' + img.getAttribute('src') + '" alt=""></div>' + (cap ? '<p class="ovcap">' + cap.innerHTML + '</p>' : '') + '</div>';
    o.addEventListener('click', function () { o.remove(); });
    document.body.appendChild(o);
  }

  /* ---------- slide renderers ---------- */
  function renderTitle() {
    return '<article class="card"><div class="title"><div>' +
      '<div class="kick">Case 4 &#183; Pathophysiology of common cardiovascular diseases</div>' +
      '<h1>Acute limb ischemia</h1>' +
      '<p class="lede">อ่านเคส หา symptoms and signs แล้วต่อ flowchart กลไกด้วยกันทีละกล่อง</p>' +
      '<ol class="howto"><li>สแกน QR ของหน้าไหนก็ได้ มือถือจะเปิดหน้านั้นทันที</li>' +
      '<li>เลือกคำตอบในมือถือ<b>ก่อน</b>กด Reveal</li>' +
      '<li>พอถูกถาม กด <b>Show my answer</b> แล้วชูมือถือขึ้น</li></ol>' +
      '<p class="keys"><kbd>Space</kbd> reveal next &#183; <kbd>&#8592;</kbd> <kbd>&#8594;</kbd> move &#183; <kbd>A</kbd>&#8211;<kbd>E</kbd> choose &#183; <kbd>Q</kbd> big QR &#183; <kbd>R</kbd> reset page &#183; <kbd>F</kbd> full screen</p>' +
      '</div><div class="bigqr"><div class="scan-t">Scan to join</div><button type="button" class="bigqrbtn" aria-label="Enlarge QR">' + qrSvg('start') + '</button><div class="url">' + BASE.replace('https://', '') + '</div></div></div></article>';
  }
  function renderFrag(s) {
    return '<article class="card">' + eyebrow(s) + '<h2>' + s.title + '</h2><div class="casebox">' +
      s.frags.map(function (t, i) { return '<p class="frag' + (i === 0 ? ' on' : '') + '"' + (i === 0 ? '' : ' data-step') + '>' + t + '</p>'; }).join('') +
      '</div>' + (s.prompt ? '<p class="prompt">' + s.prompt + '</p>' : '') + '</article>';
  }
  function renderPoll(s) {
    var left = '<div class="stem">' + s.q + '</div>' + optsHtml(s) + '<button type="button" class="btn showcard">Show my answer</button>';
    var right;
    if (s.figHtml) right = s.figHtml;
    else right = '<div class="waiting">เลือกคำตอบก่อน แล้วรอเฉลยพร้อมกัน</div>';
    var ex = explainHtml(s);
    return '<article class="card pollcard">' + eyebrow(s) + '<div class="pgrid">' +
      (s.layout === 'fig'
        ? '<div class="pcol">' + left + ex + '</div><div class="pcol">' + right + '</div>'
        : '<div class="pcol">' + left + '</div><div class="pcol">' + right + ex + '</div>') +
      '</div></article>';
  }
  function renderTap(s) {
    var n = 0;
    var text = s.text.replace(/\[\[(\+?)(.+?)\]\]/g, function (m, plus, t) {
      return '<span class="ph' + (plus ? ' ok' : '') + '" role="button" tabindex="0" data-p="' + (n++) + '">' + t + '</span>';
    });
    return '<article class="card pollcard tapcard">' + eyebrow(s) + '<h2>' + s.title + '</h2><div class="cbody"><p class="caseline">' + text + '</p>' +
      '<div class="explain" data-step><div class="tapscore"></div><ul class="ex-list">' + s.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul></div></div></article>';
  }
  function renderConcept(s) {
    return '<article class="card">' + eyebrow(s) + '<h2>' + s.title + '</h2><div class="cbody">' + cloze(s.html) + '</div></article>';
  }
  function renderFlowPoll(s) {
    var q;
    if (s.kind === 'flowtap') {
      var ok = s.chips.filter(function (c) { return c.ok; }).map(function (c) { return c.t; }).join(', ');
      q = '<div class="stem">' + s.q + '</div><div class="chips">' + s.chips.map(function (c, i) {
        return '<button type="button" class="ph' + (c.ok ? ' ok' : '') + '" data-p="' + i + '">' + c.t + '</button>';
      }).join('') + '</div>' + explainHtml(s, 'Answer &#183; ' + ok);
    } else {
      q = '<div class="stem">' + s.q + '</div>' + optsHtml(s) + '<button type="button" class="btn showcard">Show my answer</button>' + explainHtml(s);
    }
    return '<article class="card pollcard' + (s.kind === 'flowtap' ? ' tapcard' : '') + '">' + eyebrow(s) + '<div class="flowgrid pollflow"><div class="fcwrap">' + flowHtml({ known: s.known, reveals: s.reveals }) + '</div><div class="pcol">' + q + '</div></div></article>';
  }
  function renderTrace(s) {
    return '<article class="card">' + eyebrow(s) + '<h2>' + s.title + '</h2><div class="flowgrid"><div>' + flowHtml({ known: Object.keys(FLOW.nodes), large: true }) + '</div>' +
      '<div class="pcol"><div class="tracebar">' + s.traces.map(function (t, i) {
        return '<button type="button" class="tr" data-step data-tr="' + i + '">' + t.t + '</button>';
      }).join('') + '</div><div class="tracenote"></div></div></div></article>';
  }
  function renderRecall(s) {
    return '<article class="card">' + eyebrow(s) + '<h2>' + s.title + '</h2>' + flowHtml({ known: ['occl'], steps: true, large: true }) + '</article>';
  }
  function renderEnd(s) {
    return '<article class="card">' + eyebrow(s) + '<h2>' + s.title + '</h2><div class="cbody">' + cloze(s.html) +
      '<div class="score"><span id="scoreTxt"></span><button type="button" class="btn" id="startOver">Start over</button></div></div></article>';
  }
  var R = { title: renderTitle, frag: renderFrag, poll: renderPoll, tap: renderTap, concept: renderConcept, flowpoll: renderFlowPoll, flowtap: renderFlowPoll, trace: renderTrace, recall: renderRecall, end: renderEnd };

  /* ---------- steps: every slide is an ordered list of [data-step] elements ---------- */
  function stepsOf() {
    var st = $$('#stage [data-step]');
    /* recall boxes reveal in teaching order, not grid order */
    if (S[idx].kind === 'recall') st.sort(function (a, b) { return +a.getAttribute('data-order') - +b.getAttribute('data-order'); });
    return st;
  }
  function saveRev() { if (!TUTOR) LS.set('rev', rev); }
  function curRev() { var id = S[idx].id; return rev[id] || (rev[id] = []); }
  function sync(fresh) {
    var s = S[idx], card = $('#stage .card'), steps = stepsOf(), r = TUTOR && s.kind !== 'trace' ? steps.map(function (_, i) { return i; }) : curRev();
    steps.forEach(function (el, i) { el.classList.toggle('on', r.indexOf(i) >= 0); });
    var ex = $('.explain', card), revealed = ex ? ex.classList.contains('on') : false;
    card.classList.toggle('rev', revealed);

    /* flowchart state */
    var fc = $('.fc', card);
    if (fc) {
      if (s.reveals) s.reveals.forEach(function (k) {
        var el = $('[data-node="' + k + '"]', fc);
        el.classList.toggle('blank', !revealed);
        el.classList.toggle('next', !revealed);
        if (revealed && fresh) el.classList.add('fresh');
      });
      if (s.kind === 'recall') steps.forEach(function (el) {
        var on = el.classList.contains('on');
        el.classList.toggle('blank', !on);
        if (on && fresh === el) el.classList.add('fresh');
      });
      if (s.kind === 'trace') applyTrace(s, fc, r);
      drawEdges(fc);
    }

    /* selection */
    var v = sel[s.id];
    $$('.opt', card).forEach(function (o) { o.classList.toggle('sel', +o.getAttribute('data-v') === v); });
    card.classList.toggle('hassel', typeof v === 'number');
    if (Array.isArray(v)) $$('.ph', card).forEach(function (p) { p.classList.toggle('sel', v.indexOf(+p.getAttribute('data-p')) >= 0); });
    var ts = $('.tapscore', card);
    if (ts) {
      var okEls = $$('.ph.ok', card);
      var picked = Array.isArray(v) ? v : [];
      var hit = okEls.filter(function (p) { return picked.indexOf(+p.getAttribute('data-p')) >= 0; }).length;
      var over = picked.length - hit;
      ts.textContent = picked.length ? 'You found ' + hit + ' of ' + okEls.length + (over ? ', plus ' + over + ' extra' : '') : 'There are ' + okEls.length + ' in total';
    }
    if (s.kind === 'end') { var score = scoreOf(); $('#scoreTxt').innerHTML = 'Your score <b>' + score.right + ' / ' + score.total + '</b>' + (score.answered < score.total ? ' <span class="muted">(answered ' + score.answered + ')</span>' : ''); }

    if (fresh && window.matchMedia('(max-width: 860px), (max-aspect-ratio: 1/1)').matches) {
      var target = revealed && fresh !== true ? (s.reveals ? fc : ex) : null;
      if (target && target.scrollIntoView) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    updateButtons();
    emit('change', { id: s.id, r: r.slice() });
  }
  function applyTrace(s, fc, r) {
    var note = $('.tracenote'), cur = r.length ? r[r.length - 1] : -1;
    $$('.tr').forEach(function (b, i) { b.classList.toggle('cur', i === cur); });
    $$('.fnode', fc).forEach(function (n) { n.classList.remove('hl'); });
    fc.classList.toggle('tracing', cur >= 0);
    if (cur < 0) { note.innerHTML = 'กด Reveal หรือแตะอาการด้านบน แล้วไล่เส้นทางกลับไปหา arterial occlusion'; return; }
    var t = s.traces[cur];
    t.path.forEach(function (k) { $('[data-node="' + k + '"]', fc).classList.add('hl'); });
    note.innerHTML = '<b>' + t.t + '</b>: ' + t.note;
  }
  function scoreOf() {
    var total = 0, right = 0, answered = 0;
    S.forEach(function (s) {
      if (typeof s.a !== 'number') return;
      total++;
      if (typeof sel[s.id] === 'number') { answered++; if (sel[s.id] === s.a) right++; }
    });
    return { total: total, right: right, answered: answered };
  }
  function remaining() { var r = curRev(); return stepsOf().length - r.length; }
  function advance() {
    if (TUTOR && S[idx].kind !== 'trace') return false;
    var steps = stepsOf(), r = curRev();
    for (var i = 0; i < steps.length; i++) {
      if (r.indexOf(i) < 0) {
        r.push(i); saveRev();
        sync(steps[i]);
        return true;
      }
    }
    return false;
  }
  function retreat() {
    if (TUTOR) return false;
    var r = curRev();
    if (r.length) { r.pop(); saveRev(); sync(); return true; }
    return false;
  }

  /* ---------- navigation ---------- */
  function render(id) {
    idx = byId[id] !== undefined ? byId[id] : 0;
    var s = S[idx];
    document.body.setAttribute('data-kind', s.kind);
    $('#stage').innerHTML = R[s.kind](s);
    $('#stage').scrollTop = 0;
    renderRail(s.id);
    $$('.tab').forEach(function (t, i) { t.setAttribute('aria-current', i === s.sec ? 'true' : 'false'); });
    var n = S.length - 1;
    $('#pos').innerHTML = (s.sec >= 0 ? A.sections[s.sec].name + ' &#183; ' : '') + '<span>' + (idx + 1) + '</span> / ' + (n + 1);
    $('#progBar').style.width = (100 * idx / n) + '%';
    if (TUTOR) $('#say').innerHTML = s.say || '';
    try { history.replaceState(null, '', '#' + s.id); } catch (e) { }
    LS.set('pos', s.id);
    if (!TUTOR && CH) CH.postMessage({ id: s.id });
    sync();
    try { window.scrollTo(0, 0); } catch (e) { }
    emit('nav', { id: s.id });
  }
  function go(d) { var n = Math.max(0, Math.min(S.length - 1, idx + d)); if (n !== idx) render(S[n].id); }
  function primary() { if (!advance()) go(1); }
  function updateButtons() {
    var left = TUTOR ? 0 : remaining();
    $('#reveal').disabled = left <= 0;
    $('#reveal').textContent = left > 0 ? 'Reveal' + (stepsOf().length > 1 ? ' (' + left + ')' : '') : 'Reveal';
    $('#prev').disabled = idx === 0;
    $('#next').disabled = idx === S.length - 1;
  }

  /* ---------- answers ---------- */
  function pick(v) {
    var s = S[idx], card = $('#stage .card');
    if (card.classList.contains('rev') && !TUTOR) return;
    sel[s.id] = v; LS.set('sel', sel);
    sync();
    emit('vote', { id: s.id, v: v });
  }
  function toggleP(i) {
    var s = S[idx], card = $('#stage .card');
    if (card.classList.contains('rev')) return;
    var cur = Array.isArray(sel[s.id]) ? sel[s.id].slice() : [], at = cur.indexOf(i);
    if (at >= 0) cur.splice(at, 1); else cur.push(i);
    sel[s.id] = cur; LS.set('sel', sel);
    sync();
    emit('vote', { id: s.id, v: cur });
  }
  function showCard() {
    var v = sel[S[idx].id]; if (typeof v !== 'number') return;
    var o = document.createElement('div');
    o.className = 'anscard'; o.style.background = CARD_COL[v % CARD_COL.length];
    o.innerHTML = '<b>' + LET[v] + '</b><span>ชูมือถือขึ้น แตะเพื่อปิด</span>';
    o.addEventListener('click', function () { o.remove(); });
    document.body.appendChild(o);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var b;
    if ((b = t.closest('.opt'))) { pick(+b.getAttribute('data-v')); b.blur(); return; }
    if ((b = t.closest('.ph'))) { toggleP(+b.getAttribute('data-p')); return; }
    if ((b = t.closest('.tr'))) {
      var i = stepsOf().indexOf(b), r = curRev(), at = r.indexOf(i);
      if (at >= 0) r.splice(at, 1);
      r.push(i); saveRev(); sync(); return;
    }
    if ((b = t.closest('.cz')) || (b = t.closest('.fnode.steppable'))) {
      var st = stepsOf().indexOf(b); if (st < 0) return;
      var rr = curRev(), a2 = rr.indexOf(st);
      if (a2 >= 0) rr.splice(a2, 1); else rr.push(st);
      saveRev(); sync(b); return;
    }
    if (t.closest('.showcard')) { showCard(); return; }
    if (t.closest('.qrbtn') || t.closest('.qrthumb') || t.closest('.bigqrbtn')) { openQr(); return; }
    if ((b = t.closest('.tab'))) { var si = +b.getAttribute('data-sec'); for (var k = 0; k < S.length; k++) { if (S[k].sec === si) { render(S[k].id); break; } } return; }
    if (t.closest('#startOver')) { rev = {}; sel = {}; LS.set('rev', rev); LS.set('sel', sel); render('start'); return; }
    if (t.tagName === 'IMG' && t.closest('.scan')) { fig2zoom(t); return; }
  });
  $('#prev').addEventListener('click', function () { go(-1); this.blur(); });
  $('#next').addEventListener('click', function () { go(1); this.blur(); });
  $('#reveal').addEventListener('click', function () { advance(); this.blur(); });
  $('#themeBtn').addEventListener('click', function () {
    var root = document.documentElement, t = root.getAttribute('data-theme');
    var dark = t ? t === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next); LS.set('theme', next);
    var fc = $('.fc'); if (fc) drawEdges(fc);
  });
  function fullscreen() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) { var p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(function () { }); }
    } catch (err) { }
  }
  $('#fsBtn').addEventListener('click', fullscreen);
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    var ov = $('.overlay, .anscard');
    if (ov && (k === 'Escape' || k === ' ' || k === 'Enter' || k === 'q' || k === 'Q')) { ov.remove(); e.preventDefault(); return; }
    if (k === 'ArrowRight') { go(1); e.preventDefault(); return; }
    if (k === 'ArrowLeft') { go(-1); e.preventDefault(); return; }
    if (k === ' ' || k === 'Enter') {
      var ctl = e.target && e.target.closest ? e.target.closest('button, [role="button"]') : null;
      if (ctl) { e.preventDefault(); ctl.click(); ctl.blur(); return; }
    }
    if (k === ' ' || k === 'Enter' || k === 'PageDown') { primary(); e.preventDefault(); return; }
    if (k === 'PageUp') { if (!retreat()) go(-1); e.preventDefault(); return; }
    if (k === 'q' || k === 'Q') { openQr(); return; }
    if (k === 'f' || k === 'F') { fullscreen(); return; }
    if (k === 'r' || k === 'R') { var s = S[idx]; rev[s.id] = []; delete sel[s.id]; saveRev(); LS.set('sel', sel); render(s.id); return; }
    var i = LET.indexOf(k.toUpperCase());
    if (S[idx].o && i >= 0 && i < S[idx].o.length) pick(i);
  });
  var tx = null;
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tx = null; return; }
    var t = e.target; if (t && t.closest && t.closest('.tblwrap, .tabs, .overlay')) { tx = null; return; }
    tx = [e.touches[0].clientX, e.touches[0].clientY];
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!tx) return;
    var dx = e.changedTouches[0].clientX - tx[0], dy = e.changedTouches[0].clientY - tx[1];
    if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy)) go(dx < 0 ? 1 : -1);
    tx = null;
  }, { passive: true });
  window.addEventListener('hashchange', function () {
    var id = location.hash.slice(1);
    if (byId[id] !== undefined && id !== S[idx].id) render(id);
  });
  if (window.ResizeObserver) new ResizeObserver(function () { var fc = $('.fc'); if (fc) drawEdges(fc); }).observe(document.documentElement);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { var fc = $('.fc'); if (fc) drawEdges(fc); });

  /* ---------- tutor follows the student deck in the same browser ---------- */
  var CH = null;
  try { CH = new BroadcastChannel('ali-case4'); } catch (e) { }
  if (TUTOR && CH) CH.onmessage = function (m) {
    var f = $('#follow');
    if (f && f.checked && m.data && byId[m.data.id] !== undefined && m.data.id !== S[idx].id) render(m.data.id);
  };

  /* ---------- start ---------- */
  $('#tabs').innerHTML = A.sections.map(function (s, i) { return '<button type="button" class="tab" data-sec="' + i + '"><span class="k">' + s.k + '</span>' + s.name + '</button>'; }).join('');
  var th = LS.get('theme', null);
  if (th === 'dark' || th === 'light') document.documentElement.setAttribute('data-theme', th);

  window.Deck = {
    on: function (ev, f) { (listeners[ev] = listeners[ev] || []).push(f); },
    go: function (id) { if (byId[id] !== undefined && id !== S[idx].id) render(id); },
    current: function () { return S[idx]; },
    revealed: function () { return curRev().slice(); },
    setRevealed: function (id, r) { rev[id] = r.slice(); if (S[idx].id === id) sync(true); },
    votes: function () { return sel; }
  };

  /* Fetch every figure up front: reveals stay instant, and the deck survives Wi-Fi dropping after the first load. */
  ['cxr-ac81.jpg', 'jvp-ac80.png', 'ecg-fig10-1.png', 'af-doglab.png', 'fast-ap-labslide.png'].forEach(function (f) { new Image().src = 'img/' + f; });

  var want = location.hash ? location.hash.slice(1) : 'start';
  render(byId[want] !== undefined ? want : 'start');
})();
