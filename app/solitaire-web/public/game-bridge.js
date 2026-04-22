// ============================================================
// Solitaire Arena — 完整游戏运行时
// WASM 桥接 + 模式管理 + 排行榜 + 种子 + 计时器
// 合并 src/shell/ 的所有功能到这一个文件
// ============================================================

(function() {
  'use strict';

  // ── 配置 ──────────────────────────────────────────────────
  var GAME_SLUG = window.__GAME_SLUG__ || 'klondike';
  var API_BASE = '';
  var QUEUE_KEY = 'solitaire-score-queue';
  var PLAYER_KEY = 'solitaire-player-id';
  var MODE_KEY = 'solitaire-current-mode';

  // ── 工具函数 ──────────────────────────────────────────────
  function formatTime(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = Math.floor(totalSeconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function formatCountdown(ms) {
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function todayDateString() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getPlayerId() {
    var id = localStorage.getItem(PLAYER_KEY);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(PLAYER_KEY, id); }
    return id;
  }

  // ── SHA-256 种子计算 (与 C# ComputeSeed 一致) ─────────────
  async function computeSeed(str) {
    var data = new TextEncoder().encode(str);
    var buf = await crypto.subtle.digest('SHA-256', data);
    return Math.abs(new Int32Array(buf)[0]);
  }

  // ── 评分公式: moves * 100 + timeSeconds, 越低越好 ─────────
  function computeScore(moves, timeMs) {
    return moves * 100 + Math.floor(timeMs / 1000);
  }

  // ── Stopwatch ─────────────────────────────────────────────
  function Stopwatch() {
    this.startMark = 0;
    this.accumulated = 0;
    this.running = false;
  }
  Stopwatch.prototype.start = function() { this.startMark = performance.now(); this.running = true; };
  Stopwatch.prototype.stop = function() { if (this.running) { this.accumulated += performance.now() - this.startMark; this.running = false; } };
  Stopwatch.prototype.reset = function() { this.accumulated = 0; this.startMark = 0; this.running = false; };
  Stopwatch.prototype.elapsed = function() { return this.running ? this.accumulated + (performance.now() - this.startMark) : this.accumulated; };

  // ── LeaderboardClient (离线优先) ──────────────────────────
  var playerId = getPlayerId();

  function submitScore(leaderboardId, score, moves, timeMs, seed) {
    var payload = { playerId: playerId, leaderboardId: leaderboardId, score: score, moves: moves, timeMs: timeMs, seed: seed || null };
    fetch(API_BASE + '/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function() {
      var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      queue.push(payload);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    });
  }

  function flushQueue() {
    var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (!queue.length) return;
    var failed = [];
    queue.forEach(function(payload) {
      fetch(API_BASE + '/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function() { failed.push(payload); });
    });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
  }

  // ── ModeManager ───────────────────────────────────────────
  var currentMode = localStorage.getItem(MODE_KEY) || 'freeplay'; // freeplay | daily | timetrial
  var currentSeed = 0;
  var timer = new Stopwatch();
  var timetrialDuration = 5 * 60 * 1000; // 5 分钟
  var timetrialRemaining = timetrialDuration;
  var timetrialInterval = null;
  var dailyDate = todayDateString();

  // ── WASM Bridge ───────────────────────────────────────────
  // main.js 在 runtime 就绪后将 exports 挂到 window.__wasmBridge
  // 这里优先读 window，回退到 runtime API，兜底轮询
  var wasmExports = null;

  async function getWasmExports() {
    if (wasmExports) return wasmExports;

    // 优先: main.js 已暴露
    if (globalThis.__wasmBridge) {
      wasmExports = globalThis.__wasmBridge;
      return wasmExports;
    }

    // 兜底: 通过 runtime API 获取
    if (globalThis.__dotnetRuntime) {
      try {
        var exports = globalThis.__dotnetRuntime.getAssemblyExports('Solitaire.Browser');
        wasmExports = exports && exports.Solitaire && exports.Solitaire.Browser;
        if (wasmExports) return wasmExports;
      } catch (e) {
        console.warn('[game-bridge] runtime.getAssemblyExports failed:', e);
      }
    }

    // 轮询等待 main.js 完成（最多 15s）
    for (var i = 0; i < 30; i++) {
      await new Promise(function(r) { setTimeout(r, 500); });
      if (globalThis.__wasmBridge) {
        wasmExports = globalThis.__wasmBridge;
        return wasmExports;
      }
    }

    console.warn('[game-bridge] WASM exports not available after 15s');
    return null;
  }

  // ── 种子注入 ──────────────────────────────────────────────
  async function getSeedBridge() {
    var bridge = await getWasmExports();
    return bridge && bridge.BrowserSeedBridge ? bridge.BrowserSeedBridge : null;
  }

  async function injectSeed(seed) {
    var sb = await getSeedBridge();
    if (sb && sb.SetSeed) sb.SetSeed(seed);
  }

  async function clearSeed() {
    var sb = await getSeedBridge();
    if (sb && sb.ClearSeed) sb.ClearSeed();
  }

  // ── 胜利回调 ──────────────────────────────────────────────
  window.solitaireArena = {
    onGameWon: function(gameSlug, score, moves, elapsedSeconds) {
      timer.stop();
      stopTimetrialCountdown();

      // 提交排行榜
      if (currentMode === 'daily') {
        submitScore('DC-' + GAME_SLUG, computeScore(moves, timer.elapsed()), moves, timer.elapsed() * 1, currentSeed);
      } else if (currentMode === 'timetrial') {
        submitScore('TT-' + GAME_SLUG, computeScore(moves, timer.elapsed()), moves, timer.elapsed() * 1, null);
      }

      showVictoryModal(score, moves, elapsedSeconds);
      launchConfetti();
      stopPolling();
    }
  };

  // ── DOM 引用 ──────────────────────────────────────────────
  var elMoves = document.getElementById('stat-moves');
  var elTime = document.getElementById('stat-time');
  var elScore = document.getElementById('stat-score');
  var modeButtons = document.querySelectorAll('.sb-mode');

  // ── 模式切换 ──────────────────────────────────────────────
  function setMode(mode) {
    currentMode = mode;
    localStorage.setItem(MODE_KEY, mode);

    modeButtons.forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    // 更新时间显示标签
    var timeLabel = document.querySelector('.stat-chip:nth-child(2) .stat-lbl');
    if (mode === 'timetrial' && timeLabel) {
      timeLabel.textContent = 'LEFT';
    } else if (timeLabel) {
      timeLabel.textContent = 'TIME';
    }
  }

  // Free Play
  async function startFreeplay() {
    stopTimetrialCountdown();
    await clearSeed();
    setMode('freeplay');
    var bridge = await getWasmExports();
    if (bridge && bridge.BrowserGameBridge) {
      bridge.BrowserGameBridge.TriggerNewGame && bridge.BrowserGameBridge.TriggerNewGame();
    }
    hideVictoryModal();
    startPolling();
  }

  // Daily Challenge
  async function startDaily() {
    stopTimetrialCountdown();
    dailyDate = todayDateString();
    var seed = await computeSeed(dailyDate + '-' + GAME_SLUG);
    currentSeed = seed;
    await injectSeed(seed);
    setMode('daily');
    timer.reset();
    timer.start();

    var bridge = await getWasmExports();
    if (bridge && bridge.BrowserGameBridge) {
      bridge.BrowserGameBridge.TriggerNewGame && bridge.BrowserGameBridge.TriggerNewGame();
    }
    hideVictoryModal();
    startPolling();
    showToast('Daily Challenge for ' + dailyDate + ' started!');
  }

  // Time Trial (5 分钟倒计时)
  async function startTimetrial() {
    setMode('timetrial');
    timetrialRemaining = timetrialDuration;
    timer.reset();
    timer.start();
    await clearSeed();

    var bridge = await getWasmExports();
    if (bridge && bridge.BrowserGameBridge) {
      bridge.BrowserGameBridge.TriggerNewGame && bridge.BrowserGameBridge.TriggerNewGame();
    }
    hideVictoryModal();
    startPolling();
    startTimetrialCountdown();
    showToast('Time Trial: 5 minutes. Go!');
  }

  // 倒计时逻辑
  function startTimetrialCountdown() {
    stopTimetrialCountdown();
    timetrialInterval = setInterval(function() {
      timetrialRemaining -= 1000;
      if (elTime) elTime.textContent = formatCountdown(timetrialRemaining);

      if (timetrialRemaining <= 0) {
        stopTimetrialCountdown();
        showGameOver();
      }
    }, 1000);
  }

  function stopTimetrialCountdown() {
    if (timetrialInterval) { clearInterval(timetrialInterval); timetrialInterval = null; }
  }

  function showGameOver() {
    timer.stop();
    hideVictoryModal();
    var overlay = document.createElement('div');
    overlay.id = 'victory-overlay';
    overlay.innerHTML =
      '<div class="victory-backdrop"></div>' +
      '<div class="victory-modal">' +
        '<div class="vm-title" style="-webkit-text-fill-color:#c0392b;background:none;color:#c0392b">Time\'s Up!</div>' +
        '<div class="vm-game">Better luck next time</div>' +
        '<button class="vm-btn vm-btn-primary" id="vm-play-again">Try Again</button>' +
        '<button class="vm-btn vm-btn-secondary" id="vm-close">Close</button>' +
      '</div>';
    injectVictoryStyles();
    document.body.appendChild(overlay);
    document.getElementById('vm-play-again')?.addEventListener('click', startTimetrial);
    document.getElementById('vm-close')?.addEventListener('click', hideVictoryModal);
  }

  // 模式按钮绑定
  modeButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var mode = btn.getAttribute('data-mode');
      if (mode === 'freeplay') startFreeplay();
      else if (mode === 'daily') startDaily();
      else if (mode === 'timetrial') startTimetrial();
    });
  });

  // 初始化模式高亮
  setMode(currentMode);

  // ── Toast 通知 ────────────────────────────────────────────
  function showToast(message) {
    var existing = document.getElementById('sol-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'sol-toast';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;top:60px;right:20px;z-index:10001;background:#162219;border:1px solid #2d6a4f;color:#e8e0d0;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:500;animation:toast-in .3s ease;pointer-events:none;';
    var s = document.createElement('style');
    s.textContent = '@keyframes toast-in{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}';
    document.head.appendChild(s);
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); s.remove(); }, 3000);
  }

  // ── 轮询游戏状态 ──────────────────────────────────────────
  var pollTimer = null;

  async function pollGameState() {
    var bridge = await getWasmExports();
    if (!bridge || !bridge.BrowserGameBridge) return;
    var bg = bridge.BrowserGameBridge;
    try {
      if (elMoves) elMoves.textContent = bg.GetMoves();
      if (elScore) elScore.textContent = bg.GetScore();
      // Time Trial 模式下显示倒计时而非游戏时间
      if (currentMode !== 'timetrial' || !timetrialInterval) {
        if (elTime) elTime.textContent = formatTime(bg.GetElapsedSeconds());
      }
    } catch (e) {}
  }

  function startPolling() {
    if (pollTimer) return;
    pollTimer = setInterval(pollGameState, 500);
  }

  function stopPolling() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  // ── 工具栏按钮 ────────────────────────────────────────────
  document.getElementById('btn-undo')?.addEventListener('click', async function() {
    var bridge = await getWasmExports();
    bridge?.BrowserGameBridge?.TriggerUndo?.();
  });

  document.getElementById('btn-new')?.addEventListener('click', async function() {
    if (currentMode === 'daily') { startDaily(); return; }
    if (currentMode === 'timetrial') { startTimetrial(); return; }
    startFreeplay();
  });

  // ── 游戏切换按钮 ──────────────────────────────────────────
  document.querySelectorAll('.sb-game-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      var slug = btn.getAttribute('data-slug');
      if (!slug) return;
      var bridge = await getWasmExports();
      if (bridge && bridge.BrowserGameBridge && bridge.BrowserGameBridge.NavigateToGame) {
        bridge.BrowserGameBridge.NavigateToGame(slug);
        GAME_SLUG = slug;
        hideVictoryModal();
        startPolling();
        document.querySelectorAll('.sb-game-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        history.pushState({}, '', '/play/' + slug + '/');
        var names = { klondike: '♠ Klondike', spider: '🕷️ Spider', freecell: '♣ FreeCell' };
        var colors = { klondike: '#2d6a4f', spider: '#8B5CF6', freecell: '#d4af37' };
        var badge = document.querySelector('.tb-badge');
        if (badge) { badge.textContent = names[slug] || slug; badge.style.background = colors[slug] || '#2d6a4f'; }
        // 重新应用当前模式的种子
        if (currentMode === 'daily') { startDaily(); }
      } else {
        window.location.href = '/play/' + slug + '/';
      }
    });
  });

  // ── 全屏 ──────────────────────────────────────────────────
  document.getElementById('btn-fullscreen')?.addEventListener('click', function() {
    var w = document.getElementById('game-wrapper');
    document.fullscreenElement ? document.exitFullscreen() : w && w.requestFullscreen();
  });

  // ── 侧边栏 ───────────────────────────────────────────────
  var panel = document.getElementById('sidebar-panel');
  document.getElementById('btn-sidebar-toggle')?.addEventListener('click', function() { panel && panel.classList.toggle('open'); });
  document.getElementById('sidebar-close')?.addEventListener('click', function() { panel && panel.classList.remove('open'); });

  // ── Loading + Avalonia 清理 + 自动切换游戏 ────────────────
  var outEl = document.getElementById('out');
  var loadingEl = document.getElementById('game-loading');

  function cleanAvaloniaJunk() {
    if (!outEl) return;
    outEl.querySelectorAll('.avalonia-splash').forEach(function(el) { el.remove(); });
    outEl.querySelectorAll('a, button, span').forEach(function(el) {
      if (el.textContent && el.textContent.toLowerCase().indexOf('avalonia') >= 0) el.remove();
    });
    outEl.querySelectorAll('a, div, span, button, img').forEach(function(el) {
      var s = el.style;
      if (s.position === 'absolute' && parseInt(s.right) >= 0 && el.getBoundingClientRect().width < 50) el.remove();
    });
  }

  if (outEl) {
    var observer = new MutationObserver(function() {
      var canvas = outEl.querySelector('canvas');
      if (canvas) {
        if (loadingEl && loadingEl.parentNode) loadingEl.remove();
        cleanAvaloniaJunk();
        observer.disconnect();

        (async function() {
          var bridge = await getWasmExports();
          if (bridge && bridge.BrowserGameBridge && bridge.BrowserGameBridge.NavigateToGame) {
            bridge.BrowserGameBridge.NavigateToGame(GAME_SLUG);
          }

          // 恢复上次的模式
          if (currentMode === 'daily') {
            var seed = await computeSeed(todayDateString() + '-' + GAME_SLUG);
            currentSeed = seed;
            await injectSeed(seed);
            timer.reset(); timer.start();
            showToast('Daily Challenge restored');
          } else if (currentMode === 'timetrial') {
            // 不自动恢复计时竞速
            setMode('freeplay');
          }

          startPolling();
          flushQueue(); // 尝试上传离线成绩
        })();

        var ci = setInterval(cleanAvaloniaJunk, 1000);
        setTimeout(function() { clearInterval(ci); }, 15000);
      }
    });
    observer.observe(outEl, { childList: true, subtree: true });
  }

  // ── 胜利弹窗 ─────────────────────────────────────────────
  function injectVictoryStyles() {
    if (document.getElementById('victory-style')) return;
    var style = document.createElement('style');
    style.id = 'victory-style';
    style.textContent =
      '#victory-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}' +
      '.victory-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px)}' +
      '.victory-modal{position:relative;background:#0d1a12;border:1px solid #2d6a4f;border-radius:16px;padding:40px 48px;text-align:center;max-width:400px;width:90%;animation:vm-in .4s ease;box-shadow:0 0 60px rgba(212,175,55,0.15)}' +
      '@keyframes vm-in{from{opacity:0;transform:scale(.9)translateY(20px)}to{opacity:1;transform:none}}' +
      '.vm-crown{font-size:48px;color:#d4af37;margin-bottom:8px;line-height:1}' +
      '.vm-title{font-size:36px;font-weight:900;background:linear-gradient(135deg,#d4af37,#f5e6a3,#d4af37);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px;font-family:Outfit,sans-serif}' +
      '.vm-game{font-size:14px;color:#5a6a5e;margin-bottom:24px}' +
      '.vm-mode-badge{display:inline-block;padding:3px 12px;border-radius:100px;font-size:11px;font-weight:600;margin-bottom:16px}' +
      '.vm-mode-daily{background:rgba(212,175,55,0.15);color:#d4af37}' +
      '.vm-mode-timetrial{background:rgba(192,57,43,0.15);color:#c0392b}' +
      '.vm-stats{display:flex;justify-content:center;gap:24px;margin-bottom:28px}' +
      '.vm-stat{display:flex;flex-direction:column;align-items:center}' +
      '.vm-stat-val{font-size:28px;font-weight:800;color:#e8e0d0;font-family:Outfit,sans-serif}' +
      '.vm-stat-lbl{font-size:11px;color:#5a6a5e;text-transform:uppercase;letter-spacing:1px;margin-top:2px}' +
      '.vm-btn{display:block;width:100%;padding:12px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;transition:200ms;border:none;margin-bottom:8px}' +
      '.vm-btn-primary{background:linear-gradient(135deg,#1a472a,#2d6a4f);color:#e8e0d0}' +
      '.vm-btn-primary:hover{filter:brightness(1.2)}' +
      '.vm-btn-secondary{background:transparent;color:#5a6a5e;border:1px solid #1e2e24}' +
      '.vm-btn-secondary:hover{border-color:#2d6a4f;color:#8a9a8e}';
    document.head.appendChild(style);
  }

  function showVictoryModal(score, moves, elapsedSeconds) {
    hideVictoryModal();
    injectVictoryStyles();
    var timeStr = formatTime(elapsedSeconds);
    var gameName = document.querySelector('.tb-badge')?.textContent?.trim() || 'Solitaire';

    var modeHtml = '';
    if (currentMode === 'daily') {
      modeHtml = '<div class="vm-mode-badge vm-mode-daily">Daily Challenge — ' + dailyDate + '</div>';
    } else if (currentMode === 'timetrial') {
      var remaining = formatCountdown(timetrialRemaining);
      modeHtml = '<div class="vm-mode-badge vm-mode-timetrial">Time Trial — ' + remaining + ' left</div>';
    }

    var overlay = document.createElement('div');
    overlay.id = 'victory-overlay';
    overlay.innerHTML =
      '<div class="victory-backdrop"></div>' +
      '<div class="victory-modal">' +
        '<div class="vm-crown">&#9813;</div>' +
        '<div class="vm-title">You Win!</div>' +
        '<div class="vm-game">' + gameName + '</div>' +
        modeHtml +
        '<div class="vm-stats">' +
          '<div class="vm-stat"><span class="vm-stat-val">' + score + '</span><span class="vm-stat-lbl">Score</span></div>' +
          '<div class="vm-stat"><span class="vm-stat-val">' + moves + '</span><span class="vm-stat-lbl">Moves</span></div>' +
          '<div class="vm-stat"><span class="vm-stat-val">' + timeStr + '</span><span class="vm-stat-lbl">Time</span></div>' +
        '</div>' +
        '<button class="vm-btn vm-btn-primary" id="vm-play-again">Play Again</button>' +
        '<button class="vm-btn vm-btn-secondary" id="vm-close">Close</button>' +
      '</div>';

    document.body.appendChild(overlay);

    document.getElementById('vm-play-again')?.addEventListener('click', async function() {
      if (currentMode === 'daily') startDaily();
      else if (currentMode === 'timetrial') startTimetrial();
      else startFreeplay();
    });
    document.getElementById('vm-close')?.addEventListener('click', hideVictoryModal);
    document.getElementById('vm-play-again')?.focus();
  }


  function hideVictoryModal() {
    document.getElementById('victory-overlay')?.remove();
  }

  // ── Confetti ──────────────────────────────────────────────
  function launchConfetti() {
    var colors = ['#d4af37', '#2d6a4f', '#c0392b', '#e8e0d0', '#7dbe8a'];
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:hidden;';
    document.body.appendChild(container);
    if (!document.getElementById('confetti-style')) {
      var s = document.createElement('style'); s.id = 'confetti-style';
      s.textContent = '@keyframes confetti-fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
      document.head.appendChild(s);
    }
    for (var i = 0; i < 60; i++) {
      var p = document.createElement('div');
      var c = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = 'position:absolute;top:-20px;left:' + (Math.random()*100) + '%;width:' + (6+Math.random()*8) + 'px;height:' + (6+Math.random()*8) + 'px;background:' + c + ';border-radius:' + (Math.random()>0.5?'50%':'2px') + ';animation:confetti-fall ' + (2+Math.random()*2) + 's linear ' + (Math.random()*0.5) + 's forwards;opacity:0.9;';
      container.appendChild(p);
    }
    setTimeout(function() { container.remove(); }, 5000);
  }

  // ── 多人对战 ──────────────────────────────────────────────
  // D1 轮询方案: 创建/加入/上报/轮询
  // 所有人玩同一副牌（确定性种子），各自上报进度

  var roomCode = null;
  var roomSeed = null;
  var roomPollTimer = null;
  var roomReportTimer = null;

  async function createRoom(game) {
    try {
      var res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: game || GAME_SLUG })
      });
      var data = await res.json();
      if (data.error) { showToast('Error: ' + data.error); return null; }
      roomCode = data.code;
      roomSeed = data.seed;
      showToast('Room created: ' + roomCode);
      return data;
    } catch (e) {
      showToast('Failed to create room');
      return null;
    }
  }

  async function joinRoom(code) {
    try {
      var res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, playerId: playerId })
      });
      var data = await res.json();
      if (data.error) { showToast('Error: ' + data.error); return null; }
      roomCode = data.code;
      roomSeed = data.seed;
      showToast('Joined room: ' + roomCode);
      return data;
    } catch (e) {
      showToast('Failed to join room');
      return null;
    }
  }

  async function startRoomGame() {
    if (!roomCode) return;
    try {
      await fetch('/api/rooms/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: roomCode })
      });
    } catch (e) {}

    // 注入种子并开始
    currentMode = 'versus';
    await injectSeed(roomSeed);
    var bridge = await getWasmExports();
    if (bridge && bridge.BrowserGameBridge) {
      bridge.BrowserGameBridge.TriggerNewGame && bridge.BrowserGameBridge.TriggerNewGame();
    }
    hideVictoryModal();
    timer.reset();
    timer.start();
    startPolling();
    startRoomPolling();
    startRoomReporting();
  }

  // 每 1s 上报自己的进度
  function startRoomReporting() {
    stopRoomReporting();
    roomReportTimer = setInterval(async function() {
      if (!roomCode) return;
      var bridge = await getWasmExports();
      if (!bridge || !bridge.BrowserGameBridge) return;
      var bg = bridge.BrowserGameBridge;
      try {
        await fetch('/api/rooms/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: roomCode,
            playerId: playerId,
            moves: bg.GetMoves(),
            score: bg.GetScore(),
            timeMs: timer.elapsed(),
            finished: false
          })
        });
      } catch (e) {}
    }, 1000);
  }

  function stopRoomReporting() {
    if (roomReportTimer) { clearInterval(roomReportTimer); roomReportTimer = null; }
  }

  // 每 2s 轮询对手进度
  function startRoomPolling() {
    stopRoomPolling();
    roomPollTimer = setInterval(async function() {
      if (!roomCode) return;
      try {
        var res = await fetch('/api/rooms/poll?code=' + roomCode);
        var data = await res.json();
        if (data.error) return;
        updateOpponentsUI(data.players);
        if (data.status === 'finished') {
          stopRoomPolling();
          stopRoomReporting();
          showVersusResults(data.players);
        }
      } catch (e) {}
    }, 2000);
  }

  function stopRoomPolling() {
    if (roomPollTimer) { clearInterval(roomPollTimer); roomPollTimer = null; }
  }

  // 胜利时上报完成
  var origOnGameWon = window.solitaireArena.onGameWon;
  window.solitaireArena.onGameWon = function(gameSlug, score, moves, elapsedSeconds) {
    // 调用原始回调
    if (origOnGameWon) origOnGameWon(gameSlug, score, moves, elapsedSeconds);

    // 如果在房间对战中，上报完成
    if (roomCode) {
      fetch('/api/rooms/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          playerId: playerId,
          moves: moves,
          score: score,
          timeMs: timer.elapsed(),
          finished: true
        })
      }).catch(function() {});
      stopRoomReporting();
    }
  };

  // ── 对手面板 UI ──────────────────────────────────────────
  function updateOpponentsUI(players) {
    var panel = document.getElementById('opponents-panel');
    if (!panel) return;

    var html = '<div class="opp-header">Opponents</div>';
    var me = players.filter(function(p) { return p.playerId === playerId; })[0];
    var others = players.filter(function(p) { return p.playerId !== playerId; });

    others.sort(function(a, b) {
      return (a.moves * 100 + Math.floor(a.timeMs / 1000)) - (b.moves * 100 + Math.floor(b.timeMs / 1000));
    });

    others.forEach(function(p) {
      var scoreVal = p.moves * 100 + Math.floor(p.timeMs / 1000);
      var statusClass = p.finished ? 'opp-done' : 'opp-playing';
      html += '<div class="opp-row ' + statusClass + '">' +
        '<span class="opp-name">' + p.playerId.substring(0, 8) + '</span>' +
        '<span class="opp-score">' + scoreVal + '</span>' +
        '<span class="opp-moves">' + p.moves + ' moves</span>' +
        (p.finished ? '<span class="opp-badge">Done</span>' : '') +
      '</div>';
    });

    if (others.length === 0) {
      html += '<div class="opp-empty">Waiting for opponents...</div>';
    }

    panel.innerHTML = html;
  }

  function showVersusResults(players) {
    players.sort(function(a, b) { return (a.rank || 999) - (b.rank || 999); });
    var myRank = players.filter(function(p) { return p.playerId === playerId; })[0]?.rank || '?';

    var overlay = document.createElement('div');
    overlay.id = 'victory-overlay';
    var resultsHtml = players.map(function(p) {
      var isMe = p.playerId === playerId;
      var scoreVal = p.moves * 100 + Math.floor(p.timeMs / 1000);
      return '<div class="opp-row' + (isMe ? ' opp-me' : '') + '">' +
        '<span class="opp-rank">#' + (p.rank || '?') + '</span>' +
        '<span class="opp-name">' + (isMe ? 'You' : p.playerId.substring(0, 8)) + '</span>' +
        '<span class="opp-score">' + scoreVal + '</span>' +
        '<span class="opp-moves">' + p.moves + ' moves / ' + formatTime(p.timeMs / 1000) + '</span>' +
      '</div>';
    }).join('');

    overlay.innerHTML =
      '<div class="victory-backdrop"></div>' +
      '<div class="victory-modal">' +
        '<div class="vm-crown">&#9813;</div>' +
        '<div class="vm-title" style="font-size:28px">You ranked #' + myRank + '!</div>' +
        '<div class="vm-game">Room ' + roomCode + '</div>' +
        '<div class="vm-stats" style="flex-direction:column;gap:8px">' + resultsHtml + '</div>' +
        '<button class="vm-btn vm-btn-primary" id="vm-play-again">New Room</button>' +
        '<button class="vm-btn vm-btn-secondary" id="vm-close">Close</button>' +
      '</div>';
    injectVictoryStyles();
    document.body.appendChild(overlay);

    document.getElementById('vm-play-again')?.addEventListener('click', function() {
      roomCode = null;
      roomSeed = null;
      hideVictoryModal();
      createRoom(GAME_SLUG);
    });
    document.getElementById('vm-close')?.addEventListener('click', function() {
      roomCode = null;
      roomSeed = null;
      hideVictoryModal();
    });
  }

  // ── 暴露给外部（调试 + UI 调用） ──────────────────────────
  window.solitaireArena._modes = { startFreeplay: startFreeplay, startDaily: startDaily, startTimetrial: startTimetrial, currentMode: function() { return currentMode; } };
  window.solitaireArena._rooms = { create: createRoom, join: joinRoom, start: startRoomGame };

})();
