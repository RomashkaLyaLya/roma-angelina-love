(function () {
  "use strict";

  var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
  var stage = document.getElementById("stage");
  var dotsWrap = document.getElementById("progressDots");
  var current = 0;

  // ---- Build progress dots ----
  scenes.forEach(function (_, i) {
    var d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " active" : "");
    dotsWrap.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function goTo(index) {
    if (index < 0 || index >= scenes.length) return;
    scenes[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = index;
    scenes[current].classList.add("active");
    dots[current].classList.add("active");
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-next]");
    if (trigger) goTo(current + 1);
  });

  // ---- Swipe support ----
  var touchStartX = 0;
  stage.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  // ---- Floating hearts background ----
  var heartsBg = document.getElementById("heartsBg");
  var HEART_EMOJI = ["💗", "💕", "💖", "💓", "🩷"];
  function spawnHeart() {
    var h = document.createElement("span");
    h.className = "floating-heart";
    h.textContent = HEART_EMOJI[Math.floor(Math.random() * HEART_EMOJI.length)];
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 14 + Math.random() * 18 + "px";
    var duration = 8 + Math.random() * 8;
    h.style.animationDuration = duration + "s";
    heartsBg.appendChild(h);
    setTimeout(function () { h.remove(); }, duration * 1000 + 500);
  }
  for (var i = 0; i < 6; i++) setTimeout(spawnHeart, i * 700);
  setInterval(spawnHeart, 1400);

  // ---- Love meter (scene 1) ----
  var slider = document.getElementById("loveSlider");
  var percentLabel = document.getElementById("meterPercent");
  var question = document.getElementById("meterQuestion");
  var mascot = document.getElementById("mascotFace");
  var meterNext = document.getElementById("meterNext");

  var stages = [
    { max: 20, q: "Насколько сильно ты меня любишь?", face: "🥺" },
    { max: 45, q: "Только-то? Серьёзно?", face: "😢" },
    { max: 70, q: "Уже теплее…", face: "🙂" },
    { max: 99, q: "Вот это по-нашему!", face: "😍" },
    { max: 101, q: "Именно столько я и знал! 💯", face: "🥰" }
  ];

  function updateMeter() {
    var v = Number(slider.value);
    percentLabel.textContent = v + "%";
    slider.style.setProperty("--fill", v + "%");
    var s = stages.find(function (st) { return v <= st.max; }) || stages[stages.length - 1];
    question.textContent = s.q;
    mascot.textContent = s.face;
    mascot.style.transform = "scale(" + (1 + v / 300) + ")";
    if (v >= 100) {
      meterNext.disabled = false;
    } else {
      meterNext.disabled = true;
    }
  }
  slider.addEventListener("input", updateMeter);
  updateMeter();

  // ---- Gift box (scene 2) ----
  var giftBox = document.getElementById("giftBox");
  var giftHint = document.getElementById("giftHint");
  giftBox.addEventListener("click", function () {
    if (giftBox.classList.contains("opened")) return;
    giftBox.classList.add("opened");
    giftBox.textContent = "";
    giftHint.textContent = "открываю сюрприз… 🎉";
    burstConfetti();
    setTimeout(function () { goTo(current + 1); }, 900);
  });

  function burstConfetti() {
    var wrap = document.querySelector('.scene[data-scene="2"] .scene-inner');
    for (var i = 0; i < 18; i++) {
      var c = document.createElement("span");
      c.textContent = ["🎉", "💗", "✨", "🎊"][i % 4];
      c.style.position = "absolute";
      c.style.left = "50%";
      c.style.top = "45%";
      c.style.fontSize = "20px";
      c.style.pointerEvents = "none";
      c.style.transition = "transform 0.9s cubic-bezier(.2,.8,.2,1), opacity 0.9s";
      wrap.appendChild(c);
      var angle = Math.random() * Math.PI * 2;
      var dist = 80 + Math.random() * 120;
      requestAnimationFrame(function (el, a, d) {
        return function () {
          el.style.transform = "translate(" + Math.cos(a) * d + "px," + Math.sin(a) * d + "px) rotate(" + (Math.random() * 360) + "deg)";
          el.style.opacity = "0";
        };
      }(c, angle, dist));
      setTimeout(function (el) { el.remove(); }, 1000, c);
    }
  }

  // ---- Live counter (scene 3) ----
  var START = new Date("2026-01-31T00:00:00");
  var tDays = document.getElementById("tDays");
  var tHours = document.getElementById("tHours");
  var tMins = document.getElementById("tMins");
  var tSecs = document.getElementById("tSecs");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tickTimer() {
    var diff = Date.now() - START.getTime();
    if (diff < 0) diff = 0;
    var totalSecs = Math.floor(diff / 1000);
    var days = Math.floor(totalSecs / 86400);
    var hours = Math.floor((totalSecs % 86400) / 3600);
    var mins = Math.floor((totalSecs % 3600) / 60);
    var secs = totalSecs % 60;
    tDays.textContent = String(days).padStart(3, "0");
    tHours.textContent = pad(hours);
    tMins.textContent = pad(mins);
    tSecs.textContent = pad(secs);
  }
  tickTimer();
  setInterval(tickTimer, 1000);

  // ---- Memory video sound toggle (scene 5) ----
  var memoryVideo = document.getElementById("memoryVideo");
  var muteToggle = document.getElementById("muteToggle");
  muteToggle.addEventListener("click", function () {
    memoryVideo.muted = !memoryVideo.muted;
    muteToggle.textContent = memoryVideo.muted ? "🔇" : "🔊";
  });

  // ---- Bouquet picker (scene 4) ----
  var FLOWER_POS = [
    { x: 50, y: 34, r: 15 },
    { x: 27, y: 46, r: 12 },
    { x: 73, y: 46, r: 12 },
    { x: 37, y: 26, r: 10 },
    { x: 63, y: 26, r: 10 },
    { x: 50, y: 54, r: 9 }
  ];
  var BLOB_POS = [
    { x: 14, y: 30, r: 9 }, { x: 88, y: 26, r: 7 }, { x: 50, y: 10, r: 6 },
    { x: 10, y: 58, r: 5 }, { x: 90, y: 60, r: 8 }, { x: 20, y: 74, r: 4 }, { x: 80, y: 78, r: 5 }
  ];
  var PETAL_D = "M0,0 C-9,-6 -10,-25 0,-35 C10,-25 9,-6 0,0 Z";

  function flowerSvg(x, y, r, petalColor, strokeColor, centerColor, petalCount) {
    var scale = (r / 30).toFixed(2);
    var count = petalCount || 5;
    var step = 360 / count;
    var g = '<g transform="translate(' + x + "," + y + ')">';
    for (var i = 0; i < count; i++) {
      var angle = i * step + (x + y) % 15;
      g += '<path d="' + PETAL_D + '" fill="' + petalColor + '" fill-opacity="0.94" stroke="' + strokeColor + '" stroke-width="1" stroke-linejoin="round" transform="rotate(' + angle.toFixed(1) + ') scale(' + scale + ')"/>';
    }
    for (var j = 0; j < count; j++) {
      var a2 = (j * step * Math.PI) / 180;
      var dx = Math.cos(a2) * r * 0.12;
      var dy = Math.sin(a2) * r * 0.12;
      g += '<circle cx="' + dx.toFixed(1) + '" cy="' + dy.toFixed(1) + '" r="' + (r * 0.06).toFixed(1) + '" fill="' + centerColor + '"/>';
    }
    g += "</g>";
    return g;
  }

  function bouquetSvg(cfg) {
    var svg = '<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">';
    // soft watercolor blobs
    BLOB_POS.forEach(function (b, i) {
      var c = Array.isArray(cfg.petal) ? cfg.petal[i % cfg.petal.length] : cfg.blob || cfg.petal;
      svg += '<circle cx="' + b.x + '" cy="' + b.y + '" r="' + b.r + '" fill="' + c + '" fill-opacity="0.16"/>';
    });
    // stems into vase
    FLOWER_POS.forEach(function (f, i) {
      var endX = 46 + (i % 3) * 4;
      svg += '<path d="M' + f.x + " " + (f.y + f.r * 0.45) + " Q " + (f.x + (50 - f.x) * 0.4) + " 80 " + endX + ' 98" fill="none" stroke="' + cfg.leaf + '" stroke-width="1.3" stroke-linecap="round"/>';
    });
    // leaves
    svg += '<path d="M32 78 Q22 74 20 64 Q32 66 34 78 Z" fill="' + cfg.leaf + '" fill-opacity="0.85"/>';
    svg += '<path d="M68 78 Q78 74 80 64 Q68 66 66 78 Z" fill="' + cfg.leaf + '" fill-opacity="0.85"/>';
    // glass vase
    svg += '<path d="M40 96 C40 100 37 105 37 114 C37 124 43 129 50 129 C57 129 63 124 63 114 C63 105 60 100 60 96 Z" fill="' + (cfg.vase || "rgba(210,225,245,0.4)") + '" stroke="rgba(255,255,255,0.7)" stroke-width="1.1"/>';
    svg += '<ellipse cx="50" cy="96" rx="10.5" ry="2.6" fill="rgba(255,255,255,0.55)"/>';
    // main flowers
    FLOWER_POS.forEach(function (f, i) {
      var petalColor = Array.isArray(cfg.petal) ? cfg.petal[i % cfg.petal.length] : cfg.petal;
      svg += flowerSvg(f.x, f.y, f.r, petalColor, cfg.stroke, cfg.center, cfg.petalCount);
    });
    svg += "</svg>";
    return svg;
  }

  var BOUQUETS = [
    {
      id: "dusty-blue",
      petal: "#c9d9e8", stroke: "#8fa6bc", center: "#3f3a3a", leaf: "#a9b79a", vase: "rgba(210,225,245,0.45)",
      message: "Ты — как этот спокойный голубой оттенок: рядом с тобой всегда тихо и надёжно на душе."
    },
    {
      id: "blush",
      petal: "#f0c6cf", stroke: "#d69cab", center: "#5a3a3f", leaf: "#9fb28f", vase: "rgba(245,220,225,0.45)",
      message: "Ты нежная и удивительная, совсем как эти цветы. Рядом с тобой я чувствую себя дома."
    },
    {
      id: "peach",
      petal: "#f2b98c", stroke: "#d9925c", center: "#5a3a24", leaf: "#a9b79a", vase: "rgba(250,230,210,0.45)",
      message: "Ты — моё солнце, даже когда за окном пасмурно. С тобой всегда светлее."
    },
    {
      id: "lavender",
      petal: "#c9b8e0", stroke: "#a68fc9", center: "#3f3550", leaf: "#9fb28f", vase: "rgba(225,215,245,0.45)",
      message: "Одно твоё присутствие успокаивает меня, как поле лаванды на закате."
    },
    {
      id: "ivory",
      petal: "#faf6ec", stroke: "#d8cdb4", center: "#4a4030", leaf: "#a9b79a", vase: "rgba(250,245,230,0.5)",
      message: "Наша любовь чистая и настоящая — как эти цветы по весне."
    },
    {
      id: "mixed",
      petal: ["#f0c6cf", "#c9b8e0", "#f2c96a", "#c9d9e8", "#f2b98c", "#f0c6cf"], stroke: "#b98fa0", center: "#4a3a3a", leaf: "#93a67f", vase: "rgba(235,225,245,0.45)",
      message: "Ты — целый букет всего, что я люблю: доброты, тепла и света. Ты моя самая любимая."
    }
  ];

  var bouquetGrid = document.getElementById("bouquetGrid");
  var bouquetNext = document.getElementById("bouquetNext");
  var overlay = document.getElementById("bouquetOverlay");
  var overlaySvg = document.getElementById("overlaySvg");
  var overlayMessage = document.getElementById("overlayMessage");
  var pickedIds = {};

  BOUQUETS.forEach(function (b) {
    var card = document.createElement("button");
    card.className = "bouquet-card";
    card.setAttribute("data-id", b.id);
    card.setAttribute("aria-label", "Открыть букет");
    card.innerHTML = bouquetSvg(b) + '<span class="bq-check">✓</span>';
    card.addEventListener("click", function () {
      pickedIds[b.id] = true;
      card.classList.add("picked");
      bouquetNext.disabled = false;
      overlaySvg.innerHTML = bouquetSvg(b);
      overlayMessage.textContent = "“" + b.message + "”";
      overlay.classList.add("open");
    });
    bouquetGrid.appendChild(card);
  });

  document.getElementById("overlayClose").addEventListener("click", function () {
    overlay.classList.remove("open");
  });
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) overlay.classList.remove("open");
  });

  // ---- Replay ----
  document.getElementById("replayBtn").addEventListener("click", function () {
    slider.value = 0;
    updateMeter();
    var gb = document.getElementById("giftBox");
    gb.classList.remove("opened");
    gb.textContent = "🎁";
    giftHint.textContent = "нажми на подарок";
    pickedIds = {};
    bouquetNext.disabled = true;
    Array.prototype.forEach.call(bouquetGrid.children, function (c) { c.classList.remove("picked"); });
    overlay.classList.remove("open");
    goTo(0);
  });
})();
