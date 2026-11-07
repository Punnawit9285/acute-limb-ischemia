/* Optional live layer: phones follow the presenter, votes reach the presenter's screen.
   Dormant unless config.js lists relays. A presenter opens index.html?host=1.
   Every phone stays usable on its own if the relay is missing or unreachable. */
(function () {
  'use strict';
  var cfg = window.ALI_LIVE || {}, params = new URLSearchParams(location.search);
  var relays = (cfg.relays || []).slice();
  /* local testing only */
  var local = params.get('relay');
  if (local && /^ws:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(local)) relays = [local];
  if (!relays.length) return;

  var HOST = params.has('host');
  var ROOT = 'ali/' + (cfg.room || 'room') + '/';
  var $ = function (s) { return document.querySelector(s); };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('ali:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ali:' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var cid = LS.get('cid', null);
  if (!cid) { cid = Math.random().toString(36).slice(2, 12); LS.set('cid', cid); }

  var clients = [];
  function pub(topic, obj, opts) {
    var msg = obj === null ? '' : JSON.stringify(obj);
    clients.forEach(function (c) { if (c.connected) c.publish(ROOT + topic, msg, opts || {}); });
  }

  var script = document.createElement('script');
  script.src = 'vendor/mqtt.min.js';
  script.onload = connect;
  document.head.appendChild(script);

  function connect() {
    relays.forEach(function (url, i) {
      var c = window.mqtt.connect(url, { clientId: 'ali-' + cid + '-' + (HOST ? 'h' : 'p') + i, reconnectPeriod: 3000, connectTimeout: 8000 });
      c.on('connect', function () {
        c.subscribe(HOST ? [ROOT + 'vote/+', ROOT + 'hello/+'] : [ROOT + 'state', ROOT + 'tally']);
        if (HOST) publishState(); else hello();
        paint();
      });
      c.on('close', paint);
      c.on('message', function (topic, buf) {
        var body = buf.toString(), data = null;
        if (body) { try { data = JSON.parse(body); } catch (e) { return; } }
        onMessage(topic.slice(ROOT.length), data);
      });
      clients.push(c);
    });
    if (HOST) startHost(); else startPhone();
    paint();
  }
  function connected() { return clients.some(function (c) { return c.connected; }); }

  /* ---------- presenter ---------- */
  var votes = {}, seen = {}, lastTally = 0, tallyTimer = null;
  function startHost() {
    votes = LS.get('hostVotes', {});
    window.Deck.on('change', publishState);
    window.Deck.on('nav', function () { publishTally(); });
    setInterval(publishState, 15000);
    setInterval(paint, 5000);
  }
  function online() {
    var now = Date.now(), n = 0;
    Object.keys(seen).forEach(function (k) { if (now - seen[k] < 70000) n++; });
    return n;
  }
  function publishState() {
    var s = window.Deck.current();
    pub('state', { id: s.id, r: window.Deck.revealed(), t: Date.now(), n: online() }, { retain: true });
    paintBars();
  }
  function countFor(id) {
    var counts = {}, n = 0, m = votes[id] || {};
    Object.keys(m).forEach(function (c) {
      var v = m[c];
      if (Array.isArray(v)) { v.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; }); n++; }
      else if (typeof v === 'number') { counts[v] = (counts[v] || 0) + 1; n++; }
    });
    return { id: id, counts: counts, n: n };
  }
  function publishTally() {
    tallyTimer = null; lastTally = Date.now();
    current = countFor(window.Deck.current().id);
    pub('tally', current, { retain: true });
    paintBars(); paint();
    LS.set('hostVotes', votes);
  }
  function queueTally() {
    if (tallyTimer) return;
    tallyTimer = setTimeout(publishTally, Math.max(0, 800 - (Date.now() - lastTally)));
  }

  /* ---------- phone ---------- */
  var hostState = null, stateAt = 0, following = true, current = null;
  function startPhone() {
    window.Deck.on('vote', function (d) { pub('vote/' + cid, { id: d.id, v: d.v }); });
    setInterval(hello, 20000);
    setInterval(function () {
      /* presenter gone quiet: fall back to self-paced */
      if (hostState && Date.now() - stateAt > 45000) { hostState = null; paint(); }
    }, 5000);
    var strip = document.createElement('div');
    strip.className = 'livestrip';
    strip.id = 'liveStrip';
    strip.hidden = true;
    $('.pager').prepend(strip);
    strip.addEventListener('click', function (e) {
      if (!e.target.closest('button')) return;
      following = !following;
      if (following && hostState) applyState();
      paint();
    });
  }
  function hello() { pub('hello/' + cid, { votes: window.Deck.votes() }); }
  function applyState() {
    window.Deck.go(hostState.id);
    window.Deck.setRevealed(hostState.id, hostState.r);
    paintBars();
  }

  /* ---------- messages ---------- */
  function onMessage(topic, d) {
    if (HOST) {
      var parts = topic.split('/');
      if (parts[0] === 'vote' && d) {
        seen[parts[1]] = Date.now();
        (votes[d.id] = votes[d.id] || {})[parts[1]] = d.v;
        queueTally();
      } else if (parts[0] === 'hello' && d) {
        var isNew = !seen[parts[1]];
        seen[parts[1]] = Date.now();
        Object.keys(d.votes || {}).forEach(function (id) { (votes[id] = votes[id] || {})[parts[1]] = d.votes[id]; });
        queueTally();
        if (isNew) publishState();
      }
      return;
    }
    if (topic === 'state') {
      if (!d || d.end || Date.now() - d.t > 120000) { hostState = null; paint(); return; }
      hostState = d; stateAt = Date.now();
      if (following) applyState();
      paint();
    } else if (topic === 'tally') {
      current = d;
      paintBars();
    }
  }

  /* ---------- painting ---------- */
  function paintBars() {
    var card = $('#stage .card'), s = window.Deck.current();
    if (!card) return;
    var ready = current && current.id === s.id, shown = ready && card.classList.contains('rev');
    var total = ready ? current.n : 0;
    Array.prototype.forEach.call(card.querySelectorAll('.opt'), function (o) {
      var v = o.getAttribute('data-v'), c = (ready && current.counts[v]) || 0, pct = total ? Math.round(100 * c / total) : 0;
      var bar = o.querySelector('.vbar'); if (bar) bar.style.width = shown ? pct + '%' : '0';
      var tag = o.querySelector('.pct');
      if (shown) { if (!tag) { tag = document.createElement('span'); tag.className = 'pct'; o.insertBefore(tag, o.querySelector('.mk')); } tag.textContent = pct + '%'; }
      else if (tag) tag.remove();
    });
    Array.prototype.forEach.call(card.querySelectorAll('.ph'), function (p) {
      var old = p.querySelector('.cnt'); if (old) old.remove();
      if (!shown) return;
      var c = (ready && current.counts[p.getAttribute('data-p')]) || 0;
      var tag = document.createElement('span'); tag.className = 'cnt'; tag.textContent = c; p.appendChild(tag);
    });
  }
  function paint() {
    if (HOST) {
      var box = $('#livebox'); if (!box) return;
      box.hidden = false;
      var answered = current && current.id === window.Deck.current().id ? current.n : 0;
      box.innerHTML = connected()
        ? '<div class="st on">&#9679; LIVE</div><div><span class="n">' + online() + '</span> online</div><div><span class="n">' + answered + '</span> answered</div><button type="button" class="btn" id="endLive">End session</button>'
        : '<div class="st off">Connecting&#8230;</div>';
      var end = $('#endLive');
      if (end) end.onclick = function () {
        pub('state', { end: true, t: Date.now() }, { retain: true });
        pub('tally', null, { retain: true });
        votes = {}; LS.set('hostVotes', votes);
      };
      return;
    }
    var strip = $('#liveStrip'); if (!strip) return;
    var on = !!hostState && connected();
    strip.hidden = !on;
    document.body.classList.toggle('following', on && following);
    if (on) strip.innerHTML = following
      ? '<span class="dot">&#9679;</span> Following presenter <span class="muted">' + (hostState.n || 0) + ' online</span><button type="button" class="btn">Explore on my own</button>'
      : '<span class="muted">On your own</span><button type="button" class="btn">Back to live</button>';
  }
})();
