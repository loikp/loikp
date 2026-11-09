(function () {
  'use strict';

  var TS = 16, COLS = 26, ROWS = 14;
  var W = COLS * TS, H = ROWS * TS;
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  canvas.width = W; canvas.height = H;
  ctx.imageSmoothingEnabled = false;

  var IMG = {};
  for (var a in ASSETS) {
    (function (key) {
      var im = new Image();
      im.src = ASSETS[key];
      IMG[key] = im;
    })(a);
  }

  /* ------------------------------ 输入 ------------------------------ */
  var down = {}, touch = {};
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
  document.addEventListener('touchstart', function (e) {
    var t = e.target;
    if (!t || !t.closest || !t.closest('[data-k]')) e.preventDefault();
  }, { passive: false });
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, false);
  document.addEventListener('pointerdown', function (e) {
    if (phase !== 'gameover' && phase !== 'allwin') return;
    if (e.target && e.target.closest && e.target.closest('[data-k]')) return;
    restart();
  }, false);
  window.addEventListener('keydown', function (e) {
    down[e.code] = 1;
    if (phase === 'gameover' || phase === 'allwin') { restart(); return; }
    if (e.code === 'KeyQ' && !e.repeat) active = 1 - active;
    if (/^(Arrow|Space)/.test(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', function (e) { down[e.code] = 0; });

  (function bind() {
    var list = document.querySelectorAll('[data-k]');
    for (var i = 0; i < list.length; i++) {
      (function (el) {
        var key = el.getAttribute('data-k');
        function on(e) {
          e.preventDefault();
          if (phase === 'gameover' || phase === 'allwin') { restart(); return; }
          if (key === 'swap') { active = 1 - active; return; }
          touch[key] = 1;
        }
        function off(e) { e.preventDefault(); touch[key] = 0; }
        el.addEventListener('pointerdown', on);
        el.addEventListener('pointerup', off);
        el.addEventListener('pointerleave', off);
        el.addEventListener('pointercancel', off);
      })(list[i]);
    }
  })();

  function held(p, d) {
    if (p.idx !== active || p.dead || p.out) return false;
    var a = d === 'l' ? 'KeyA' : d === 'r' ? 'KeyD' : 'KeyW';
    var b = d === 'l' ? 'ArrowLeft' : d === 'r' ? 'ArrowRight' : 'ArrowUp';
    if (down[a] || down[b]) return true;
    if (d === 'j' && down.Space) return true;
    return !!(touch['p0' + d] || touch['p1' + d]);
  }

  /* ------------------------------ 常量 ------------------------------ */
  var GRAV = 0.5, MAXFALL = 10;

  /* ------------------------------ 声音 ------------------------------ */
  var SFX_SRC = { pickup: 'assets/sfx/pickup.wav', hurt: 'assets/sfx/hurt.wav',
                  win: 'assets/sfx/win.wav', over: 'assets/sfx/over.wav',
                  test: 'assets/sfx/test.wav' };
  var SFX = {}, BGM = null, audioOn = 0;
  function initAudio() {
    if (audioOn) return; audioOn = 1;
    for (var k in SFX_SRC) {
      try { var a = new Audio(SFX_SRC[k]); a.preload = 'auto'; a.volume = 0.55; SFX[k] = a; } catch (e) {}
    }
    try { BGM = new Audio('assets/sfx/bgm.mp3'); BGM.loop = true; BGM.volume = 0.32; } catch (e) {}
    try { window.__a = { BGM: BGM, SFX: SFX }; } catch (e) {}
    if (BGM) BGM.play().catch(function () {});
  }
  function sfx(n) {
    var a = SFX[n];
    if (!a) return;
    try { a.currentTime = 0; a.play().catch(function () {}); } catch (e) {}
  }
  function bgm(on) {
    if (!BGM) return;
    try { if (on) { BGM.play().catch(function () {}); } else BGM.pause(); } catch (e) {}
  }

  function mkPlayer(idx, kind) {
    var p = { idx: idx, kind: kind, vx: 0, vy: 0, onGround: 0, inv: 0, dead: 0,
              deadT: 0, out: 0, lives: 2, anim: 0, jumpLock: 0, face: 1 };
    if (kind === 'sans') { p.w = 10; p.h = 24; p.spd = 2.35; p.jump = -8.2; }
    else { p.w = 12; p.h = 34; p.spd = 1.95; p.jump = -9.0; }
    return p;
  }

  /* ------------------------------ 世界 ------------------------------ */
  var L, grid, cols, goalCol;
  var players = [], enemies = [], items = [], parts = [], pending = [], floaters = [];
  var sw = [], score = 0, doorsOpen = 0, spk = [], doorsKeep = 0, proj = [];
  var bonusUsed = 0, inBonus = 0, bonusBack = null;
  var cam = { x: 0 }, phase = 'play', phaseT = 0, levelIdx = 0, tick = 0, active = 0;

  function cell(tx, ty) {
    if (ty < 0 || ty >= ROWS) return ' ';
    if (tx < 0) return ty >= 12 ? '#' : ' ';
    if (tx >= cols) return ty >= 12 ? '#' : ' ';
    return grid[ty][tx];
  }
  function solid(ch) {
    return ch === '#' || ch === '=' || ch === 'B' || ch === '?' || ch === 'b' ||
           ch === 'x' || ch === 'X' || ch === 'P' || ch === 'D';
  }

  function build(idx, data) {
    var prevOpen = doorsOpen;
    levelIdx = idx;
    phase = 'play'; phaseT = 0;
    L = data || LEVELS[idx];
    cols = L.len;
    goalCol = L.goal;
    initClouds();
    grid = []; items = [];
    for (var r = 0; r < ROWS; r++) grid[r] = new Array(cols).fill(' ');

    (L.ground || []).forEach(function (s) {
      for (var c = s[0]; c < s[1]; c++) { grid[12][c] = '#'; grid[13][c] = '#'; }
    });
    (L.plats || []).forEach(function (pl) {
      for (var c2 = pl[0]; c2 < pl[0] + pl[2]; c2++) if (c2 < cols) grid[pl[1]][c2] = '=';
    });
    (L.bricks || []).forEach(function (b) {
      for (var i = 0; i < b[2].length; i++) if (b[0] + i < cols) grid[b[1]][b[0] + i] = b[2][i];
    });
    (L.pipes || []).forEach(function (pp) {
      for (var r2 = 0; r2 < pp[1]; r2++) {
        grid[11 - r2][pp[0]] = 'P';
        grid[11 - r2][pp[0] + 1] = 'P';
      }
    });
    (L.fake || []).forEach(function (f) {
      for (var c3 = f[0]; c3 < f[0] + f[2]; c3++) if (c3 < cols) grid[f[1]][c3] = 'X';
    });
    spk = (L.spikes || []).map(function (sp) {
      return { c1: sp[0], c2: sp[1], t: Math.random() * 4, up: -1 };
    });
    spk.forEach(function (s1) { for (var c4 = s1.c1; c4 < s1.c2; c4++) { grid[11][c4] = ' '; grid[10][c4] = ' '; } });
    (L.boxes || []).forEach(function (b) {
      for (var by = b[1]; by < b[1] + b[3]; by++)
        for (var bx = b[0]; bx < b[0] + b[2]; bx++)
          if (by >= 0 && by < ROWS && bx >= 0 && bx < cols) grid[by][bx] = '#';
    });
    (L.doors || []).forEach(function (d) {
      for (var r4 = d[1]; r4 < d[1] + d[2]; r4++) if (r4 < ROWS) grid[r4][d[0]] = 'D';
    });
    sw = (L.switches || []).map(function (s2) { return { c: s2[0], r: s2[1], on: 0 }; });
    doorsOpen = doorsKeep ? prevOpen : 0;
    if (doorsOpen) {
      (L.doors || []).forEach(function (d) {
        for (var r5 = d[1]; r5 < d[1] + d[2]; r5++) if (r5 < ROWS) grid[r5][d[0]] = 'd';
      });
      (L.switches || []).forEach(function (s3) { sw.forEach(function (w) { if (w.c === s3[0] && w.r === s3[1]) w.on = 1; }); });
    }
    proj = [];
    (L.ketchup || []).forEach(function (k2) {
      items.push({ type: 'ketchup', x: k2[0] * TS + 2, y: k2[1] * TS + 2,
                   w: 12, h: 14, vy: 0, groundY: (k2[1] + 1) * TS, t: 0, got: 0 });
    });
    if (audioOn) bgm(1);
    for (var r3 = 3; r3 <= 11; r3++) grid[r3][goalCol] = '|';
    grid[11][goalCol] = 'f';

    enemies = (L.enemies || []).map(function (e) {
      var t = e[2], w = 14, h = 14;
      if (t === 'dog') { w = 18; h = 17; }
      return { type: t, x: e[0] * TS + 1, y: e[1] * TS - h, w: w, h: h,
               base: e[1] * TS - h, vx: 0, dead: 0, dir: -1, t: Math.random() * 6 };
    });
    parts = []; pending = []; floaters = [];

    players = [mkPlayer(0, 'sans'), mkPlayer(1, 'papyrus')];
    players.forEach(function (p, i) {
      p.x = (2 + i * 2) * TS;
      p.y = 12 * TS - p.h;
      p.vx = p.vy = 0; p.dead = 0; p.deadT = 0; p.out = 0; p.inv = 0;
    });
    cam.x = 0;
  }

  /* ------------------------------ 砖与道具 ------------------------------ */
  function popup(x, y, text) { floaters.push({ x: x, y: y, text: text, t: 0 }); }

  function burst(tx, ty) {
    for (var i = 0; i < 6; i++) {
      parts.push({ x: tx * TS + 4, y: ty * TS + 4, vx: (Math.random() - 0.5) * 4,
                   vy: -Math.random() * 3 - 1, t: 30, c: i % 2 ? '#c84c0c' : '#7a2b06' });
    }
  }

  function hitBrick(tx, ty) {
    var ch = grid[ty][tx];
    if (ch === 'B') {
      return;
    }
    else if (ch === '?') {
      grid[ty][tx] = 'b'; sfx('test');
      var gy = ty + 1;
      while (gy < ROWS && !solid(cell(tx, gy))) gy++;
      var pieP = Math.random() < 0.5;
      if (pieP) items.push({ type: 'pie', x: tx * TS + 1, y: ty * TS - 16, groundY: gy * TS,
                             w: 14, h: 14, vy: -3.4, t: 0, got: 0 });
      else items.push({ type: 'ketchup', x: tx * TS + 2, y: ty * TS - 14, groundY: gy * TS,
                        w: 12, h: 14, vy: -3.4, t: 0, got: 0 });
      burst(tx, ty);
    }
    else if (ch === 'x') { grid[ty][tx] = ' '; burst(tx, ty); sfx('test'); }
  }

  function restart() {
    bonusUsed = 0; inBonus = 0; bonusBack = null;
    score = 0;
    build(0);
    phase = 'play';
    bgm(1);
  }

  function killPlayer(p) {
    sfx('hurt');
    if (p.inv > 0 || p.dead || p.out) return;
    p.lives--;
    if (p.lives <= 0) { p.lives = 0; p.out = 1; p.dead = 1; p.deadT = 0; }
    else { p.dead = 1; p.deadT = 0; }
    p.vy = -3.5; p.vx = 0;
  }

  /* ------------------------------ 物理 ------------------------------ */
  function collideH(p) {
    var y0 = Math.floor(p.y / TS), y1 = Math.floor((p.y + p.h - 0.01) / TS);
    if (p.vx > 0) {
      var xr = Math.floor((p.x + p.w - 0.01) / TS);
      for (var ty = y0; ty <= y1; ty++) if (solid(cell(xr, ty))) { p.x = xr * TS - p.w; p.vx = 0; break; }
    } else if (p.vx < 0) {
      var xl = Math.floor(p.x / TS);
      for (var ty2 = y0; ty2 <= y1; ty2++) if (solid(cell(xl, ty2))) { p.x = (xl + 1) * TS; p.vx = 0; break; }
    }
    if (p.x < 0) { p.x = 0; p.vx = 0; }
  }

  function collideV(p) {
    var x0 = Math.floor(p.x / TS), x1 = Math.floor((p.x + p.w - 0.01) / TS);
    if (p.vy > 0) {
      var yb = Math.floor((p.y + p.h - 0.01) / TS);
      for (var tx = x0; tx <= x1; tx++) {
        var ch = cell(tx, yb);
        if (solid(ch)) {
          p.y = yb * TS - p.h; p.vy = 0; p.onGround = 1;
          if (ch === 'X') {
            var lo = tx, hi = tx;
            while (lo > 0 && grid[yb][lo - 1] === 'X') lo--;
            while (hi < cols - 1 && grid[yb][hi + 1] === 'X') hi++;
            for (var q2 = lo; q2 <= hi; q2++) {
              var dup = false;
              for (var q3 = 0; q3 < pending.length; q3++) if (pending[q3].c === q2 && pending[q3].r === yb) dup = true;
              if (!dup) pending.push({ c: q2, r: yb, t: 0.22 });
            }
          }
          break;
        }
      }
    } else if (p.vy < 0) {
      var yt = Math.floor(p.y / TS);
      for (var tx2 = x0; tx2 <= x1; tx2++) {
        var ch2 = cell(tx2, yt);
        if (solid(ch2)) { p.y = (yt + 1) * TS; p.vy = 0; hitBrick(tx2, yt); break; }
      }
    }
  }

  function stepPlayer(p) {
    if (p.out || p.hidden) return;
    if (p.dead) {
      p.deadT += 1 / 60;
      if (p.y < H + 60) { p.vy += GRAV; p.y += p.vy; }
      if (p.deadT > 1.8 && p.lives > 0) {
        p.dead = 0; p.deadT = 0; p.inv = 1.5;
        p.x = 2 * TS; p.y = 12 * TS - p.h; p.vx = 0; p.vy = 0;
      }
      return;
    }
    p.inv = Math.max(0, p.inv - 1 / 60);
    p.anim += Math.abs(p.vx) > 0.1 ? 0.18 : 0;

    p.vx = (held(p, 'r') ? 1 : 0) * p.spd - (held(p, 'l') ? 1 : 0) * p.spd;
    if (p.vx > 0) p.face = 1; else if (p.vx < 0) p.face = -1;
    p.x += p.vx;
    collideH(p);

    p.vy += GRAV;
    if (p.vy > MAXFALL) p.vy = MAXFALL;
    p.y += p.vy;
    p.onGround = 0;
    collideV(p);

    if (held(p, 'j') && p.onGround && !p.jumpLock) { p.vy = p.jump; p.jumpLock = 1; }
    if (!held(p, 'j')) { p.jumpLock = 0; }

    if (p.y > H + 60) killPlayer(p);

    if (!inBonus && !bonusUsed && p.onGround && !p.dead) {
      var tube = tubeUnder(p);
      if (tube) {
        p.tubeT = (p.tubeT || 0) + 1 / 60;
        if (down.ArrowDown || down.KeyS || p.tubeT > 1.2) { enterBonus(p); return; }
      } else p.tubeT = 0;
    } else p.tubeT = 0;

    var cx = Math.floor((p.x + p.w / 2) / TS);
    var cy = Math.floor((p.y + p.h / 2) / TS);
    if (cell(cx, cy) === '^' || cell(cx, Math.floor((p.y + p.h - 4) / TS)) === '^') killPlayer(p);

    for (var r = 3; r <= 11; r++) {
      if (cell(cx, r) === '|' || cell(Math.floor(p.x / TS), r) === '|') { win(); return; }
    }
    if (cell(cx, 11) === 'f') win();
  }

  function tubeUnder(p) {
    var pcol = Math.floor((p.x + p.w / 2) / TS);
    var tubes = L.pipes || [];
    for (var i = 0; i < tubes.length; i++) {
      var tp = tubes[i];
      if (tp[0] !== L.bonus) continue;
      if (pcol === tp[0] || pcol === tp[0] + 1) {
        var top = (12 - tp[1]) * TS;
        if (Math.abs(p.y + p.h - top) < 2) return tp;
      }
    }
    return null;
  }

  function enterBonus(p) {
    if (bonusUsed || inBonus) return;
    bonusUsed = 1; inBonus = 1;
    bonusBack = {
      lv: levelIdx, idx: p.idx,
      pos: players.map(function (q) { return [q.x, q.y]; })
    };
    doorsKeep = 1; build(-1, BONUS); doorsKeep = 0;
    for (var i = 0; i < players.length; i++) {
      if (i !== bonusBack.idx) players[i].hidden = 1;
    }
    popup(30, 120, '下去看看');
  }

  function exitBonus() {
    var bk = bonusBack;
    inBonus = 0;
    doorsKeep = 1; build(bk.lv); doorsKeep = 0;
    for (var i = 0; i < players.length; i++) {
      var q = players[i];
      q.hidden = 0;
      q.x = bk.pos[i][0]; q.y = bk.pos[i][1];
      q.vx = 0; q.vy = 0;
    }
    var me = players[bk.idx];
    me.y -= 30;
    popup(me.x, me.y - 40, '回来了');
  }

  function win() {
    bgm(0); sfx('win');
    if (inBonus) { exitBonus(); return; }
    if (phase !== 'play') return;
    phase = 'win'; phaseT = 0;
  }

  function stepSpikes() {
    for (var i = 0; i < spk.length; i++) {
      var s = spk[i];
      s.t += 1 / 60;
      var up = (s.t % 4) > 2 ? 1 : 0;
      if (up !== s.up) {
        s.up = up;
        for (var c = s.c1; c < s.c2; c++) {
          grid[11][c] = up ? '^' : ' ';
          grid[10][c] = up ? '^' : ' ';
        }
      }
    }
  }

  function stepEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (e.dead) { continue; }
      e.t += 1 / 60;
      if (e.type === 'froggit') {
        e.vx = Math.sin(e.t * 2) > 0 ? 0.6 : -0.6;
        e.x += e.vx;
        if (solid(cell(Math.floor((e.x + (e.vx > 0 ? e.w : 0)) / TS), Math.floor((e.y + e.h - 2) / TS)))) e.x -= e.vx * 2;
      } else if (e.type === 'dog') {
        var sp = 0.85;
        e.x += e.dir * sp;
        if (e.x < 0) { e.x = 0; e.dir = 1; }
        var probe = Math.floor((e.x + (e.dir > 0 ? e.w : 0)) / TS);
        var foot = Math.floor((e.y + e.h + 1) / TS);
        var wall = solid(cell(probe, Math.floor((e.y + e.h - 2) / TS)));
        var pit = !solid(cell(probe, foot)) && !solid(cell(probe, foot - 1));
        if (wall || pit) { e.dir = -e.dir; e.x += e.dir * sp * 2; }
        e.shootT = (e.shootT || 0) + 1;
        if (e.shootT >= 180) {
          var cur = players[active];
          var dIn = e.x + e.w > cam.x - 8 && e.x < cam.x + W + 8;
          var pIn = cur && !cur.hidden && cur.x + cur.w > cam.x - 8 && cur.x < cam.x + W + 8;
          if (dIn && pIn) {
            e.shootT = 0;
            proj.push({ x: e.x + (e.dir > 0 ? e.w : -10), y: e.y + 6,
                        vx: e.dir * 2.7, w: 10, h: 10, t: 0 });
          }
        }
      } else if (e.type === 'whimsun') {
        e.y = e.base + Math.sin(e.t * 2.4) * 8;
      } else if (e.type === 'moldsmal') {
        e.y = e.base + (Math.sin(e.t * 3) > 0.6 ? 1 : 0);
      }
    }
  }

  function stepProj() {
    for (var i = proj.length - 1; i >= 0; i--) {
      var pb = proj[i];
      pb.x += pb.vx; pb.t++;
      if (pb.x + pb.w < cam.x - 20 || pb.x > cam.x + W + 20 || pb.t > 700) { proj.splice(i, 1); continue; }
      if (solid(cell(Math.floor((pb.x + (pb.vx > 0 ? pb.w : 0)) / TS), Math.floor((pb.y + pb.h / 2) / TS)))) {
        proj.splice(i, 1); continue;
      }
      for (var j = 0; j < players.length; j++) {
        var pp = players[j];
        if (pp.dead || pp.out || pp.hidden) continue;
        if (pp.x < pb.x + pb.w && pp.x + pp.w > pb.x && pp.y < pb.y + pb.h && pp.y + pp.h > pb.y) {
          killPlayer(pp); proj.splice(i, 1); break;
        }
      }
    }
  }

  function checkSwitches() {
    if (!sw.length) return;
    var allOn = true;
    for (var si = 0; si < sw.length; si++) {
      var sc = sw[si], hit = 0;
      for (var pi = 0; pi < players.length; pi++) {
        var pp = players[pi];
        if (pp.dead || pp.out) continue;
        if (pp.x + pp.w > sc.c * TS && pp.x < sc.c * TS + TS &&
            pp.y + pp.h > sc.r * TS - 3 && pp.y + pp.h < sc.r * TS + TS + 5) { hit = 1; break; }
      }
      if (hit && !sc.on) {
        sc.on = 1; popup(sc.c * TS + 1, sc.r * TS - 14, '咔');
        var cnt = 0;
        for (var q = 0; q < sw.length; q++) if (sw[q].on) cnt++;
        if (cnt < sw.length) popup(sc.c * TS - 6, sc.r * TS - 27, '还差一个');
      }
      else if (!hit && sc.on) sc.on = 0;
      if (!sc.on) allOn = false;
    }
    if (allOn && !doorsOpen) {
      doorsOpen = 1;
      for (var rr = 0; rr < ROWS; rr++) for (var cc2 = 0; cc2 < cols; cc2++)
        if (grid[rr][cc2] === 'D') grid[rr][cc2] = 'd';
      popup(players[active].x, players[active].y - 26, '开了');
    }
  }

  function hitCheck() {
    for (var i = 0; i < players.length; i++) {
      var p = players[i];
      if (p.dead || p.out) continue;
      for (var j = 0; j < enemies.length; j++) {
        var e = enemies[j];
        if (e.dead) continue;
        if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
          if (p.vy > 0 && p.y + p.h - e.y < 12 && e.type !== 'whimsun') {
            e.dead = 1; p.vy = -5; sfx('hurt');
            if (e.type === 'dog') {
              popup(e.x + e.w / 2, e.y - 2, '+2');
              for (var dk = 0; dk < 2; dk++) {
                items.push({ type: 'ketchup', x: e.x + dk * 10, y: e.y - 4, w: 12, h: 14,
                             vy: -2.2, groundY: 192, t: 0, got: 0 });
              }
            }
          } else killPlayer(p);
        }
      }
      for (var k = 0; k < items.length; k++) {
        var it = items[k];
        if (it.got) continue;
        if (p.x < it.x + it.w && p.x + p.w > it.x && p.y < it.y + it.h && p.y + p.h > it.y) {
          it.got = 1;
          if (it.type === 'ketchup') {
            score++; popup(it.x + 4, it.y - 2, '+1'); sfx('pickup');
          } else {
            p.lives = Math.min(9, p.lives + 1);
            popup(it.x + 7, it.y - 2, '+1');
            sfx('pickup');
          }
          burst(Math.floor((it.x + 7) / TS), Math.floor((it.y + 7) / TS));
        }
      }
    }
  }

  /* ------------------------------ 主循环 ------------------------------ */
  function step() {
    tick++;
    if (phase === 'play') {
      for (var i = 0; i < players.length; i++) stepPlayer(players[i]);
      stepSpikes();
      stepEnemies();
      stepProj();
      hitCheck();
      checkSwitches();

      var target = Math.max(0, Math.min(cols * TS - W, players[active].x - W / 2));
      cam.x += (target - cam.x) * 0.12;

      if (players[0].out || players[1].out) { phase = 'gameover'; phaseT = 0; bgm(0); sfx('over'); return; }
    } else if (phase === 'win') {
      phaseT += 1 / 60;
      if (phaseT > 1.6) {
        if (levelIdx + 1 < LEVELS.length) build(levelIdx + 1);
        else phase = 'allwin';
      }
    }

    for (var q = 0; q < pending.length; q++) {
      pending[q].t -= 1 / 60;
      if (pending[q].t <= 0) { var pc = pending[q]; grid[pc.r][pc.c] = ' '; burst(pc.c, pc.r); pending.splice(q, 1); q--; }
    }
    for (var s = parts.length - 1; s >= 0; s--) {
      var pa = parts[s];
      pa.x += pa.vx; pa.y += pa.vy; pa.vy += 0.3; pa.t--;
      if (pa.t <= 0) parts.splice(s, 1);
    }
    for (var ii = items.length - 1; ii >= 0; ii--) {
      var itm = items[ii];
      itm.t++;
      if (itm.t > 120000) { items.splice(ii, 1); continue; }
      if (itm.got) continue;
      itm.vy += 0.4;
      if (itm.vy > 8) itm.vy = 8;
      itm.y += itm.vy;
      if (itm.vy > 0 && itm.groundY && itm.y + itm.h >= itm.groundY) {
        itm.y = itm.groundY - itm.h;
        itm.vy = 0;
      }
      if (itm.y > ROWS * TS + 60) { itm.got = 1; }
    }
    for (var fi = floaters.length - 1; fi >= 0; fi--) {
      var fl = floaters[fi];
      fl.t++;
      fl.y -= 0.35;
      if (fl.t > 55) floaters.splice(fi, 1);
    }
  }

  /* ------------------------------ 绘制 ------------------------------ */
  var clouds = [];
  function initClouds() {
    clouds.length = 0;
    var seed = 1337;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var n = Math.max(12, Math.round(cols * TS / 88));
    for (var i = 0; i < n; i++) {
      var sc = 0.5 + rnd() * 0.9;
      clouds.push({ x: rnd() * cols * TS * 1.4 - 60, y: 30 + Math.pow(rnd(), 1.5) * 70, s: sc });
    }
  }

  function tileGround(x, y) {
    var cave = L.sky !== 'day';
    ctx.fillStyle = cave ? '#39415c' : '#c84c0c'; ctx.fillRect(x, y, TS, TS);
    ctx.fillStyle = cave ? '#5c688c' : '#e08a3c'; ctx.fillRect(x, y, TS, 2);
    ctx.fillStyle = cave ? '#20263a' : '#7a2b06';
    ctx.fillRect(x, y + TS - 3, TS, 3);
    ctx.fillRect(x + TS - 2, y, 2, TS);
  }
  function tilePlat(x, y) {
    ctx.fillStyle = '#9c9c9c'; ctx.fillRect(x, y, TS, TS);
    ctx.fillStyle = '#c8c8c8'; ctx.fillRect(x, y, TS, 2);
    ctx.fillStyle = '#6c6c6c'; ctx.fillRect(x, y + TS - 3, TS, 3);
  }
  function tileBrick(x, y, empty) {
    ctx.fillStyle = empty ? '#7a3c14' : '#b8451a'; ctx.fillRect(x, y, TS, TS);
    ctx.fillStyle = empty ? '#5a2a0c' : '#8b3010';
    ctx.fillRect(x, y + 7, TS, 2); ctx.fillRect(x, y + 14, TS, 2);
    ctx.fillRect(x + 7, y, 2, 7); ctx.fillRect(x + 3, y + 9, 2, 5); ctx.fillRect(x + 11, y + 9, 2, 5);
    ctx.fillStyle = '#e8a070'; ctx.fillRect(x, y, TS, 1);
  }
  function tileQuestion(x, y) {
    ctx.fillStyle = '#f0b02a'; ctx.fillRect(x, y, TS, TS);
    ctx.fillStyle = '#c8801a'; ctx.fillRect(x, y + TS - 3, TS, 3);
    ctx.fillStyle = '#8b4a00';
    ctx.fillRect(x + 2, y + 2, 12, 1); ctx.fillRect(x + 2, y + 13, 12, 1);
    ctx.fillStyle = '#fff4c8';
    ctx.fillRect(x + 6, y + 4, 4, 2); ctx.fillRect(x + 9, y + 6, 2, 2);
    ctx.fillRect(x + 7, y + 8, 2, 1); ctx.fillRect(x + 7, y + 10, 2, 3);
    ctx.fillRect(x + 7, y + 10, 2, 1);
  }
  function tileCrack(x, y) {
    tileBrick(x, y, false);
    ctx.fillStyle = '#2a0e02';
    ctx.fillRect(x + 4, y + 1, 1, 5); ctx.fillRect(x + 5, y + 6, 1, 3);
    ctx.fillRect(x + 6, y + 9, 1, 2); ctx.fillRect(x + 6, y + 11, 1, 5);
    ctx.fillRect(x + 10, y + 2, 1, 4); ctx.fillRect(x + 11, y + 6, 1, 6);
  }
  function tileDoor(x, y) {
    ctx.fillStyle = '#3a2c22'; ctx.fillRect(x, y, TS, TS);
    ctx.fillStyle = '#7a5a3a';
    for (var i = 2; i < TS; i += 5) ctx.fillRect(x + i, y + 1, 2, TS - 2);
    ctx.fillStyle = '#2a1e16';
    ctx.fillRect(x, y + 3, TS, 2); ctx.fillRect(x, y + 12, TS, 2);
  }

  function tileDoorOpen(x, y, c, r) {
    var top = r === 0 || grid[r - 1][c] !== 'd';
    ctx.fillStyle = '#3a2c22';
    ctx.fillRect(x, y, 3, TS); ctx.fillRect(x + TS - 3, y, 3, TS);
    if (top) ctx.fillRect(x, y, TS, 3);
  }

  function tileSwitch(x, y, c, r) {
    var on = 0;
    for (var i = 0; i < sw.length; i++) if (sw[i].c === c && sw[i].r === r) on = sw[i].on;
    ctx.fillStyle = on ? '#2a7a4a' : '#6a4a2a';
    ctx.fillRect(x + 3, y + TS - 6, TS - 6, 4);
    ctx.fillStyle = on ? '#6aff9a' : '#d0a060';
    ctx.fillRect(x + 4, y + TS - 5, TS - 8, 2);
  }

  function tilePipe(x, y, c, r) {
    var cave = L.sky !== 'day';
    var isL = c > 0 && grid[r][c - 1] === 'P';
    var isR = c < cols - 1 && grid[r][c + 1] === 'P';
    var body = cave ? '#25543a' : '#33a02a';
    var lit = cave ? '#3d7d57' : '#63cc48';
    var dark = cave ? '#16362a' : '#1b6a12';
    ctx.fillStyle = body; ctx.fillRect(x, y, TS, TS);
    if (!isL) { ctx.fillStyle = lit; ctx.fillRect(x + 1, y, 4, TS); }
    if (!isR) { ctx.fillStyle = dark; ctx.fillRect(x + TS - 3, y, 3, TS); }
    var top = r === 0 || grid[r - 1][c] !== 'P';
    if (top) {
      var ox = isL ? -2 : 0, ow = TS + 2;
      ctx.fillStyle = body; ctx.fillRect(x + ox, y, ow, 7);
      if (!isL) { ctx.fillStyle = lit; ctx.fillRect(x + ox + 1, y + 1, 4, 5); }
      if (!isR) { ctx.fillStyle = dark; ctx.fillRect(x + ox + ow - 3, y, 3, 7); }
      ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(x + ox, y + 6, ow, 2);
    }
  }
  function tilePole(x, y) {
    ctx.fillStyle = '#d8d8d8'; ctx.fillRect(x + 7, y, 2, TS);
    ctx.fillStyle = '#8a8a8a'; ctx.fillRect(x + 9, y, 1, TS);
  }
  function tileSpike(x, y) {
    ctx.fillStyle = '#d8d8e8';
    for (var i = 0; i < 2; i++) {
      var bx = x + i * 8;
      ctx.beginPath();
      ctx.moveTo(bx, y + TS); ctx.lineTo(bx + 4, y + 2); ctx.lineTo(bx + 8, y + TS);
      ctx.closePath(); ctx.fill();
    }
  }

  var TILE_FN = {
    '#': tileGround, '=': tilePlat, 'P': tilePipe, '|': tilePole, 'f': tilePole,
    '^': tileSpike, '?': tileQuestion, 'x': tileCrack, 'D': tileDoor, 'd': tileDoorOpen
  };

  function drawWorld() {
    if (L.sky === 'day') {
      ctx.fillStyle = '#5c94fc'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      for (var i = 0; i < clouds.length; i++) {
        var c = clouds[i];
        var cx = Math.round(c.x - cam.x * (0.16 + 0.14 * c.s));
        if (cx < -90 || cx > W + 90) continue;
        ctx.save();
        ctx.translate(cx, Math.round(c.y));
        ctx.scale(c.s, c.s);
        ctx.fillRect(0, 6, 22, 6);
        ctx.fillRect(4, 2, 14, 6);
        ctx.fillRect(2, 0, 8, 6);
        ctx.restore();
      }
    } else if (L.sky === 'castle') {
      ctx.fillStyle = '#150b12'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#241626';
      for (var rr = 0; rr < ROWS; rr += 2) ctx.fillRect(0, rr * TS, W, 1);
      var poff = (cam.x * 0.5) % (TS * 2);
      for (var cc = -1; cc * TS * 2 - poff < W; cc++) ctx.fillRect(cc * TS * 2 - poff, 0, 1, H);
    } else {
      ctx.fillStyle = '#0b0b14'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#151528';
      for (var r = 0; r < ROWS; r += 2) ctx.fillRect(0, r * TS, W, 1);
    }

    var c0 = Math.floor(cam.x / TS) - 1, c1 = Math.floor((cam.x + W) / TS) + 1;
    if (c0 < 0) c0 = 0; if (c1 > cols) c1 = cols;
    for (var ty = 0; ty < ROWS; ty++) {
      for (var tx = c0; tx < c1; tx++) {
        var ch = grid[ty][tx];
        if (ch === ' ') continue;
        var px = tx * TS - cam.x, py = ty * TS;
        if (ch === 'B' || ch === 'b') { tileBrick(px, py, ch === 'b'); }
        else if (ch === 'X') { tileBrick(px, py, false); }
        else if (TILE_FN[ch]) { TILE_FN[ch](px, py, tx, ty); }
      }
    }
    // 旗子
    var fx = goalCol * TS - cam.x;
    if (fx > -40 && fx < W + 40) {
      ctx.fillStyle = '#e8e8f0';
      ctx.beginPath(); ctx.arc(fx + 8, 3 * TS + 2, 3, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#ff4040';
      ctx.fillRect(fx + 2, 3 * TS + 6, 12, 8);
      ctx.fillStyle = '#ffb0b0';
      ctx.fillRect(fx + 4, 3 * TS + 8, 8, 4);
    }
  }

  function drawSwitches() {
    for (var i = 0; i < sw.length; i++) {
      var s3 = sw[i];
      var x = s3.c * TS - cam.x, y = s3.r * TS;
      if (x < -TS || x > W) continue;
      ctx.fillStyle = '#2a1c12';
      ctx.fillRect(x + 2, y + TS - 6, TS - 4, 5);
      ctx.fillStyle = s3.on ? '#2a7a4a' : '#6a4526';
      ctx.fillRect(x + 3, y + TS - 5, TS - 6, 3);
      ctx.fillStyle = s3.on ? '#7dffb0' : '#d8a868';
      ctx.fillRect(x + 4, y + TS - 5, TS - 8, 1);
    }
  }

  function drawItems() {
    if (phase === 'gameover') return;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.got) continue;
      var x = it.x - cam.x, y = it.y;
      if (it.type === 'pie') { if (IMG.bigpie && IMG.bigpie.width) ctx.drawImage(IMG.bigpie, x - 4, y - 0); }
      else if (it.type === 'ketchup') {
        ctx.fillStyle = '#6a1010'; ctx.fillRect(x + 1, y + 5, 10, 9);
        ctx.fillStyle = '#e02020'; ctx.fillRect(x + 2, y + 6, 8, 7);
        ctx.fillStyle = '#ff6060'; ctx.fillRect(x + 3, y + 7, 2, 5);
        ctx.fillStyle = '#c8c8d0'; ctx.fillRect(x + 4, y + 1, 4, 4);
        ctx.fillStyle = '#fff'; ctx.fillRect(x + 5, y + 2, 1, 1);
      }
      else if (IMG.tobdogl && IMG.tobdogl.width) ctx.drawImage(IMG.tobdogl, x - 3, y);
    }
    for (var f2 = 0; f2 < floaters.length; f2++) {
      var ff = floaters[f2];
      ctx.globalAlpha = Math.max(0, 1 - ff.t / 55);
      ctx.font = '9px SansCN, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff8d0';
      ctx.fillText(ff.text, Math.round(ff.x - cam.x), Math.round(ff.y));
      ctx.globalAlpha = 1;
    }
  }

  function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (e.dead) continue;
      var x = Math.round(e.x - cam.x), y = Math.round(e.y);
      if (e.type === 'froggit') {
        ctx.fillStyle = '#7ac04a'; ctx.fillRect(x + 2, y + 4, 10, 9);
        ctx.fillRect(x + 4, y + 1, 6, 4);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x + 4, y + 5, 2, 2); ctx.fillRect(x + 9, y + 5, 2, 2);
        ctx.fillStyle = '#4a8a2a'; ctx.fillRect(x, y + 11, 14, 3);
      } else if (e.type === 'whimsun') {
        ctx.fillStyle = '#f0f0f8';
        ctx.beginPath(); ctx.arc(x + 7, y + 6, 6, 0, 6.3); ctx.fill();
        ctx.fillRect(x + 2, y + 7, 10, 4);
        ctx.fillStyle = '#333'; ctx.fillRect(x + 4, y + 5, 2, 2); ctx.fillRect(x + 8, y + 5, 2, 2);
      } else if (e.type === 'dog') {
        var dim = IMG.tobdogl;
        if (dim && dim.width) {
          var dxo = Math.round(x + e.w / 2 - dim.width / 2), dyo = Math.round(y + e.h - dim.height);
          if (e.dir > 0) {
            ctx.save(); ctx.translate(dxo + dim.width, 0); ctx.scale(-1, 1);
            ctx.drawImage(dim, 0, dyo); ctx.restore();
          } else ctx.drawImage(dim, dxo, dyo);
        } else { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 2, y + 6, e.w - 4, e.h - 6); }
      } else if (e.type === 'moldsmal') {
        ctx.fillStyle = '#b8a8c8'; ctx.fillRect(x + 1, y + 6, 12, 8);
        ctx.fillStyle = '#9888a8'; ctx.fillRect(x + 3, y + 9, 2, 2); ctx.fillRect(x + 8, y + 9, 2, 2);
        ctx.fillStyle = '#e8e0f0'; ctx.fillRect(x + 4, y + 4, 6, 3);
      }
    }
  }

  function drawProj() {
    for (var i = 0; i < proj.length; i++) {
      var pb = proj[i], x = Math.round(pb.x - cam.x), y = Math.round(pb.y);
      if (x < -20 || x > W + 20) continue;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x + 5, y + 5, 5, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#9a9ab0';
      ctx.beginPath(); ctx.arc(x + 5, y + 5, 2.4, 0, 6.3); ctx.fill();
    }
  }

  function drawPlayer(p) {
    if (p.out || p.hidden) return;
    var x = Math.round(p.x - cam.x + p.w / 2), y = Math.round(p.y);
    if (p.inv > 0 && Math.floor(p.inv * 12) % 2) return;
    var names = p.kind === 'sans' ? ['sans0', 'sans1', 'sans2', 'sans3'] : ['pap0', 'pap1', 'pap2', 'pap3'];
    var f = 0;
    if (!p.onGround) f = 1;
    else if (Math.abs(p.vx) > 0.1) f = Math.floor(p.anim) % 4;
    var im = IMG[names[f]];
    if (!im || !im.width) { ctx.fillStyle = p.kind === 'sans' ? '#7ac0ff' : '#ff8a3c'; ctx.fillRect(p.x - cam.x, p.y, p.w, p.h); return; }
    var ddx = Math.round(x - im.width / 2), ddy = Math.round(y + p.h - im.height);
    if (p.face < 0) {
      ctx.save(); ctx.translate(ddx + im.width, 0); ctx.scale(-1, 1);
      ctx.drawImage(im, 0, ddy); ctx.restore();
    } else {
      ctx.drawImage(im, ddx, ddy);
    }
    if (p.idx === active && !p.dead) {
      var by = Math.round(p.y - 17 + Math.sin(tick / 9) * 2);
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      ctx.beginPath();
      ctx.moveTo(x - 6, by - 1); ctx.lineTo(x + 6, by - 1); ctx.lineTo(x, by + 8);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x - 5, by); ctx.lineTo(x + 5, by); ctx.lineTo(x, by + 7);
      ctx.closePath(); ctx.fill();
    }
  }

  function hudText(str, x, y) {
    var col = ctx.fillStyle;
    ctx.fillStyle = 'rgba(0,0,0,.62)';
    ctx.fillText(str, x + 1, y + 1);
    ctx.fillStyle = col;
    ctx.fillText(str, x, y);
  }

  function drawHUD() {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var hx = 4;
    for (var i = 0; i < players.length; i++) {
      var p = players[i];
      if (p.hidden) continue;
      hx = i === 0 ? 4 : W / 2 + 4;
      var hy = 14;
      for (var k = 0; k < p.lives; k++) {
        var im = IMG.soulheart;
        if (im && im.width) ctx.drawImage(im, hx + k * 12, hy - 1, 10, 10);
        else { ctx.fillStyle = '#ff4040'; ctx.fillRect(hx + k * 12, hy, 8, 8); }
      }
      ctx.fillStyle = p.idx === active ? '#fff' : 'rgba(255,255,255,.42)';
      ctx.font = p.kind === 'sans' ? '11px SansEN, sans-serif' : '11px PapEN, sans-serif';
      hudText(p.kind === 'sans' ? 'sans' : 'PAPYRUS', hx + p.lives * 12 + 5, 13);
    }
    {
      var cx = W - 52;
      ctx.fillStyle = '#6a1010'; ctx.fillRect(cx, 8, 11, 12);
      ctx.fillStyle = '#e02020'; ctx.fillRect(cx + 1, 9, 9, 10);
      ctx.fillStyle = '#ff6060'; ctx.fillRect(cx + 2, 10, 2, 7);
      ctx.fillStyle = '#c8c8d0'; ctx.fillRect(cx + 3, 3, 5, 5);
      ctx.fillStyle = '#fff'; ctx.font = '13px SansEN, sans-serif';
      ctx.textAlign = 'left';
      hudText('x' + score, cx + 15, 8);
    }
    if (phase === 'win') {
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, H / 2 - 20, W, 40);
      ctx.fillStyle = '#fff'; ctx.font = '14px SansCN, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('恭喜过关！', W / 2, H / 2 - 6);
    }
    if (phase === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,.78)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = '18px SansCN, sans-serif'; ctx.fillText('GAME OVER', W / 2, H / 2 - 18);
      ctx.font = '10px SansCN, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.fillText(players[0].out ? 'sans 先躺下了' : '', W / 2, H / 2 + 6);
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      ctx.fillText('按任意键重来', W / 2, H / 2 + 26);
    }
    if (phase === 'allwin') {
      ctx.fillStyle = 'rgba(0,0,0,.72)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = '18px SansCN, sans-serif'; ctx.fillText('番茄酱都归你了', W / 2, H / 2 - 20);
      ctx.font = '13px SansCN, sans-serif'; ctx.fillText('老哥这趟没白跑', W / 2, H / 2 + 4);
      ctx.font = '13px SansCN, sans-serif'; ctx.fillText('按任意键重新玩', W / 2, H / 2 + 26);
    }
  }

  function render() {
    drawWorld();
    drawSwitches();
    drawItems();
    drawProj();
    drawEnemies();
    drawPlayer(players[0]);
    drawPlayer(players[1]);
    for (var i = 0; i < parts.length; i++) {
      var pa = parts[i];
      ctx.fillStyle = pa.c;
      ctx.fillRect(Math.round(pa.x - cam.x), Math.round(pa.y), 3, 3);
    }
    drawHUD();
  }

  var acc = 0, last = performance.now();
  function frame(now) {
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    acc += dt;
    while (acc >= 1 / 60) { step(); acc -= 1 / 60; }
    if (document.body && document.body.classList) document.body.classList.toggle('over', phase === 'gameover');
    render();
    requestAnimationFrame(frame);
  }

  var qlv = (location.search.match(/lv=(\d+)/) || [])[1];
  var qdir = (location.search.match(/dir=(-?\d+)/) || [])[1];
  var qcam = (location.search.match(/cam=(\d+)/) || [])[1];
  var qpx = (location.search.match(/px=(\d+)/) || [])[1];
  var qp = (location.search.match(/p=(\d)/) || [])[1];
  if (qp) active = parseInt(qp, 10) ? 1 : 0;
  build(qlv ? Math.min(parseInt(qlv, 10), LEVELS.length - 1) : 0);
  if (qdir) for (var qi = 0; qi < players.length; qi++) players[qi].face = parseInt(qdir, 10);
  if (qcam) { cam.x = Math.max(0, Math.min(cols * TS - W, parseInt(qcam, 10))); }
  if (qpx) { players[0].x = parseInt(qpx, 10); players[1].x = parseInt(qpx, 10) + 20; cam.x = Math.max(0, players[0].x - W / 2); }
  if (/[?&]bonus=1/.test(location.search)) { build(-1, BONUS); }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, function () { initAudio(); if (phase === 'play') bgm(1); }, { once: true, passive: true });
  });
  if (/[?&]go=1/.test(location.search)) { players[0].lives = 0; players[0].out = 1; players[0].dead = 1; phase = 'gameover'; }
  if (/[?&]test=1/.test(location.search)) {
    window.__t = {
      get players() { return players; },
      get grid() { return grid; },
      get sw() { return sw; },
      get doorsOpen() { return doorsOpen; },
      get items() { return items; },
      get active() { return active; },
      get phase() { return phase; },
      get score() { return score; },
      build: build,
      run: function (n) { for (var i = 0; i < n; i++) step(); },
      press: function (k) { down[k] = 1; },
      swap: function () { active = 1 - active; },
      openDoors: function () { doorsOpen = 1; for (var r = 0; r < ROWS; r++) for (var c = 0; c < cols; c++) if (grid[r][c] === 'D') grid[r][c] = 'd'; },
      enterBonus: enterBonus,
      exitBonus: exitBonus,
      get inBonus() { return inBonus; },
      get proj() { return proj; },
      resetBonus: function () { bonusUsed = 0; inBonus = 0; },
      release: function (k) { down[k] = 0; },
      countChar: function (ch) {
        var c = 0;
        for (var r = 0; r < ROWS; r++) for (var k = 0; k < cols; k++) if (grid[r][k] === ch) c++;
        return c;
      }
    };
  }
  requestAnimationFrame(frame);
})();
