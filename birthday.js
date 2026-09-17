
/* ============================================================
   HAPPY BIRTHDAY — the little film
   ============================================================ */

import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";

/* ============================================================
   DOM
   ============================================================ */

const $ = (selector) => document.querySelector(selector);

const hero = $("#hero");
const eyebrow = $("#eyebrow");
const hint = $("#hint");
const archery = $("#archery");
const target = $("#target");
const targetHeart = $("#targetHeart");
const heartGlow = $(".heart__glow");
const bow = $("#bow");
const arrow = $("#arrow");
const strL = $("#strL");
const strR = $("#strR");
const serving = $("#serving");
const flood = $("#flood");
const field = $("#field");
const fgrid = $("#fgrid");
const camera = $("#camera");
const kEyebrow = $("#kEyebrow");
const headline = $("#headline");
const wLine1 = $("#wLine1");
const wLine2 = $("#wLine2");
const uline = $("#uline");
const ulinePath = $(".uline__path");
const kSub = $("#kSub");
const barTop = $("#barTop");
const barBot = $("#barBot");
const bloom = $("#bloom");
const wish = $("#wish");
const wEyebrow = $("#wEyebrow");
const wHero = $("#wHero");
const wRule = $("#wRule");
const wSub = $("#wSub");
const replay = $("#replay");
const treeCanvas = $("#tree");
const motes = $("#motes");

/* ============================================================
   CONFIG
   ============================================================ */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isTouch = window.matchMedia("(pointer: coarse)").matches;

/* ============================================================
   UTILS
   ============================================================ */

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const lerp = (a, b, t) =>
  a + (b - a) * t;

const random = (min, max) =>
  min + Math.random() * (max - min);

const randomInt = (min, max) =>
  Math.floor(random(min, max + 1));

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const setStyle = (element, styles) => {
  Object.assign(element.style, styles);
};

const setText = (element, text) => {
  element.textContent = text;
};

/* ============================================================
   MOTES
   ============================================================ */

const MOTE_COUNT = 42;

function createMotes() {
  if (!motes) return;

  motes.innerHTML = "";

  for (let i = 0; i < MOTE_COUNT; i++) {
    const mote = document.createElement("span");

    mote.className = "mote";

    const size = random(2, 7);

    setStyle(mote, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${random(0, 100)}%`,
      top: `${random(0, 100)}%`,
      opacity: random(0.15, 0.6),
    });

    motes.appendChild(mote);

    if (!prefersReducedMotion) {
      gsap.to(mote, {
        x: random(-35, 35),
        y: random(-50, 50),
        duration: random(4, 9),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: random(0, 4),
      });
    }
  }
}

/* ============================================================
   INITIAL STATE
   ============================================================ */

function resetScene() {
  gsap.killTweensOf("*");

  gsap.set(hero, { autoAlpha: 1 });
  gsap.set(eyebrow, { autoAlpha: 0 });
  gsap.set(hint, { autoAlpha: 0 });
  gsap.set(target, { scale: 1, x: 0, y: 0 });
  gsap.set(targetHeart, { scale: 1, rotation: 0 });
  gsap.set(heartGlow, { scale: 1, autoAlpha: 1 });

  gsap.set(archery, {
    x: 0,
    y: 0,
    rotation: 0,
    autoAlpha: 1,
  });

  gsap.set(arrow, {
    x: 0,
    y: 0,
    rotation: 0,
    autoAlpha: 1,
  });

  gsap.set(bow, {
    rotation: 0,
    scale: 1,
  });

  gsap.set(flood, {
    clipPath: "circle(0% at 50% 50%)",
    autoAlpha: 1,
  });

  gsap.set(field, { autoAlpha: 0 });
  gsap.set(bloom, {
    clipPath: "circle(0% at 50% 50%)",
    autoAlpha: 1,
  });

  gsap.set(wish, { autoAlpha: 0 });
  gsap.set(wHero, { yPercent: 110 });
  gsap.set(wEyebrow, { autoAlpha: 0 });
  gsap.set(wSub, { autoAlpha: 0 });
  gsap.set(wRule, { width: 0 });

  gsap.set(kEyebrow, { autoAlpha: 0 });
  gsap.set(wLine1, { yPercent: 110 });
  gsap.set(wLine2, { yPercent: 110 });
  gsap.set(kSub, { autoAlpha: 0 });
  gsap.set(ulinePath, { strokeDashoffset: 340 });
  gsap.set(barTop, { scaleX: 0 });
  gsap.set(barBot, { scaleX: 0 });

  replay.hidden = true;
}

/* ============================================================
   HERO INTRO
   ============================================================ */

function intro() {
  const tl = gsap.timeline();

  tl.to(eyebrow, {
    autoAlpha: 1,
    duration: 1.2,
    ease: "power2.out",
  });

  tl.to(
    target,
    {
      scale: 1.05,
      duration: 1.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    },
    "<"
  );

  tl.to(
    heartGlow,
    {
      scale: 1.15,
      autoAlpha: 0.65,
      duration: 1.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    },
    "<"
  );

  tl.to(
    hint,
    {
      autoAlpha: 1,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.8"
  );

  return tl;
}

/* ============================================================
   ARCHERY INTERACTION
   ============================================================ */

let isDrawing = false;
let hasReleased = false;
let drawStartX = 0;
let drawStartY = 0;

function beginDraw(event) {
  if (hasReleased || isDrawing) return;

  isDrawing = true;

  const point = getPoint(event);

  drawStartX = point.x;
  drawStartY = point.y;

  archery.setPointerCapture?.(event.pointerId);

  gsap.killTweensOf(arrow);
  gsap.killTweensOf(bow);
}

function moveDraw(event) {
  if (!isDrawing || hasReleased) return;

  const point = getPoint(event);

  const dx = point.x - drawStartX;
  const dy = point.y - drawStartY;

  const pull = clamp(Math.abs(dx) + Math.abs(dy), 0, 180);

  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  gsap.set(arrow, {
    y: pull * 0.4,
    rotation: clamp(angle, -35, 35),
  });

  gsap.set(bow, {
    rotation: clamp(dx * 0.05, -8, 8),
  });

  gsap.set(strL, {
    x2: 230 - pull * 0.15,
  });

  gsap.set(strR, {
    x2: 230 - pull * 0.15,
  });
}

function endDraw(event) {
  if (!isDrawing || hasReleased) return;

  isDrawing = false;

  archery.releasePointerCapture?.(event.pointerId);

  hasReleased = true;

  shootArrow();
}

function getPoint(event) {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

/* ============================================================
   SHOOT ARROW
   ============================================================ */

function shootArrow() {
  gsap.killTweensOf("*");

  const tl = gsap.timeline({
    onComplete: playFilm,
  });

  tl.to(hint, {
    autoAlpha: 0,
    duration: 0.25,
  });

  tl.to(
    arrow,
    {
      x: window.innerWidth * 0.34,
      y: -window.innerHeight * 0.22,
      rotation: -25,
      duration: prefersReducedMotion ? 0.01 : 0.7,
      ease: "power3.in",
    },
    "<"
  );

  tl.to(
    target,
    {
      scale: 1.18,
      duration: 0.16,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    },
    "-=0.25"
  );

  tl.to(
    heartGlow,
    {
      scale: 1.5,
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.out",
    },
    "<"
  );

  tl.to(
    targetHeart,
    {
      scale: 1.12,
      rotation: 8,
      duration: 0.16,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    },
    "<"
  );
}
function buildScene(){
  branches = [];
  hearts = [];
  petals = [];
  rested = [];
  twinkles = [];
  orbs = [];
  floaters = [];

  buildHeartPoly();

  const wide = W / H > 1.2;

  cx = W * (wide ? 0.57 : 0.5);
  cy = H * (wide ? 0.37 : 0.38);

  ry = Math.min(
    H * (wide ? 0.33 : 0.33),
    W * 0.34
  );

  rx = ry * 1.16;
  groundY = H * 0.93;

  bgGrad = ctx.createLinearGradient(0, 0, 0, H);

  bgGrad.addColorStop(0, '#fff3e9');
  bgGrad.addColorStop(0.46, '#ffe7d6');
  bgGrad.addColorStop(0.78, '#fcd9c4');
  bgGrad.addColorStop(1, '#f3c4b5');

  glowGrad = ctx.createRadialGradient(
    cx,
    cy,
    ry * 0.1,
    cx,
    cy,
    ry * 1.55
  );

  glowGrad.addColorStop(
    0,
    'rgba(255,219,170,0.6)'
  );

  glowGrad.addColorStop(
    0.5,
    'rgba(255,170,150,0.2)'
  );

  glowGrad.addColorStop(
    1,
    'rgba(255,170,150,0)'
  );

  groundGrad = ctx.createRadialGradient(
    cx,
    H * 1.02,
    ry * 0.2,
    cx,
    H * 1.02,
    ry * 1.6
  );

  groundGrad.addColorStop(
    0,
    'rgba(255,205,165,0.5)'
  );

  groundGrad.addColorStop(
    1,
    'rgba(255,205,165,0)'
  );

  for (let i = 0; i < 11; i++){
    orbs.push({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(W * 0.05, W * 0.17),
      vy: rand(-6, -16),
      drift: rand(-0.3, 0.3),
      phase: rand(0, 6.28),
      alpha: rand(0.05, 0.13),
      sprite: pick(BOKEH)
    });
  }

  const FN = wide ? 18 : 15;

  for (let i = 0; i < FN; i++){
    const depth = Math.random();

    floaters.push({
      x: rand(0, W),
      y: rand(-H * 0.1, H * 1.1),
      depth,
      idx: (Math.random() * BLOSSOM.length) | 0,
      box: lerp(
        Math.min(W, H) * 0.025,
        Math.min(W, H) * 0.075,
        depth
      ),
      vy: lerp(7, 20, depth),
      sway: rand(8, 22),
      phase: rand(0, 6.28),
      rot: rand(-0.4, 0.4),
      vrot: rand(-0.5, 0.5),
      baseA: lerp(0.16, 0.5, depth),
      soft: depth < 0.45,
    });
  }

  const baseX = cx;
  const baseY = H * 1.0;

  const trunkTopY = cy + ry * 0.62;
  const trunkW = Math.max(9, W * 0.024);
  const limbLen = ry * 0.6;

  const insidePx = (x, y, m = 0.9) =>
    pointInPoly(
      (x - cx) / (rx * m),
      (cy - y) / (ry * m)
    );

  function addBranch(x, y, ang, len, w0, depth, t0){
    let ex = x + Math.cos(ang) * len;
    let ey = y + Math.sin(ang) * len;
    let clipped = false;

    if (!insidePx(ex, ey)){
      let lo = 0;
      let hi = 1;

      for (let k = 0; k < 12; k++){
        const mid = (lo + hi) / 2;

        if (
          insidePx(
            x + Math.cos(ang) * len * mid,
            y + Math.sin(ang) * len * mid
          )
        ){
          lo = mid;
        } else {
          hi = mid;
        }
      }

      ex = x + Math.cos(ang) * len * lo;
      ey = y + Math.sin(ang) * len * lo;
      clipped = true;
    }

    const mx = (x + ex) / 2;
    const my = (y + ey) / 2;
    const perp = ang + Math.PI / 2;
    const bend = rand(-1, 1) * len * 0.12;
    const w1 = w0 * 0.66;

    branches.push({
      x1: x,
      y1: y,
      cx: mx + Math.cos(perp) * bend,
      cy: my + Math.sin(perp) * bend,
      x2: ex,
      y2: ey,
      w0,
      w1,
      t0,
      dur: Math.max(0.14, 0.32 - depth * 0.03),
      depth,
      grad: barkGrad(x, y, ex, ey, depth)
    });

    return {
      ex,
      ey,
      w1,
      clipped
    };
  }

  function grow(x, y, ang, len, w, depth, t0){
    const r = addBranch(
      x,
      y,
      ang,
      len,
      w,
      depth,
      t0
    );

    if (
      r.clipped ||
      depth >= 6 ||
      len < ry * 0.06
    ){
      return;
    }

    const childT0 =
      t0 + (0.32 - depth * 0.03) * 0.6;

    const n = Math.random() < 0.55 ? 2 : 3;

    for (let i = 0; i < n; i++){
      const spread =
        0.6 * (i - (n - 1) / 2) +
        rand(-0.22, 0.22);

      const lift = -0.06 + rand(-0.05, 0.05);

      grow(
        r.ex,
        r.ey,
        ang + spread + lift,
        len * rand(0.74, 0.84),
        r.w1,
        depth + 1,
        childT0 + i * 0.03
      );
    }
  }

  addBranch(
    baseX,
    baseY,
    -Math.PI / 2,
    baseY - trunkTopY,
    trunkW,
    0,
    T.trunkStart
  );

  branches[0].dur = 0.55;

  const limbT0 = T.trunkStart + 0.36;
  const L = 3;

  for (let i = 0; i < L; i++){
    const ang =
      -Math.PI / 2 +
      0.62 * (i - (L - 1) / 2) +
      rand(-0.12, 0.12);

    grow(
      baseX,
      trunkTopY,
      ang,
      limbLen,
      trunkW * 0.7,
      1,
      limbT0 + i * 0.05
    );
  }

  const maxT0 = branches.reduce(
    (m, b) => Math.max(m, b.t0 + b.dur),
    0
  );

  const sc =
    (T.branchSpan - T.trunkStart) /
    (maxT0 - T.trunkStart);

  for (const b of branches){
    b.t0 =
      T.trunkStart +
      (b.t0 - T.trunkStart) * sc;
  }

  const COUNT = Math.round(
    clamp(rx * ry / 56, 250, 440)
  );

  const baseBox = clamp(
    Math.min(W, H) * 0.115,
    30,
    74
  );

  let guard = 0;

  while (
    hearts.length < COUNT &&
    guard < COUNT * 50
  ){
    guard++;

    const u = rand(-1.06, 1.06);
    const v = rand(-1.06, 1.06);

    if (!pointInPoly(u, v)) continue;

    const x = cx + u * rx;
    const y = cy - v * ry;

    const d = clamp01(
      Math.hypot(u, v + 1) / 2.4
    );

    const t0 =
      T.bloomT0 +
      d * (T.bloomSpan * 0.82) +
      rand(0, T.bloomSpan * 0.18);

    const soft = Math.random() < 0.42;

    hearts.push({
      x,
      y,
      idx: (Math.random() * BLOSSOM.length) | 0,
      soft,
      box: baseBox * (
        soft
          ? rand(0.6, 0.85)
          : rand(0.78, 1.12)
      ),
      rot: rand(-0.55, 0.55),
      sway: rand(0, 6.28),
      t0
    });
  }

  hearts.sort((a, b) =>
    a.soft === b.soft
      ? a.y - b.y
      : a.soft
        ? -1
        : 1
  );
    }
      
function autoFire(){
  if (played) return;
  recT0 = performance.now();
  cue('draw');

  gsap.to(
    { d: curDraw },
    {
      d: maxDraw,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate(){
        setDraw(this.targets()[0].d);
      },
      onComplete(){
        fire();
      }
    }
  );
}

function pointerDown(e){
  if (played) return;

  drawing = true;
  startPX = e.clientX;
  startPY = e.clientY;
  startDraw = curDraw;

  archery.setPointerCapture?.(e.pointerId);
  e.preventDefault();
}

function pointerMove(e){
  if (!drawing || played) return;

  const dx = e.clientX - startPX;
  const dy = e.clientY - startPY;

  // Pull-back distance along the string's screen-space axis.
  const d = dx * pullUX + dy * pullUY;

  setDraw(startDraw + d);
  e.preventDefault();
}

function pointerUp(e){
  if (!drawing || played) return;

  drawing = false;
  archery.releasePointerCapture?.(e.pointerId);

  if (curDraw >= maxDraw * 0.78){
    fire();
  } else {
    springBack();
  }

  e.preventDefault();
}

archery.addEventListener('pointerdown', pointerDown);
archery.addEventListener('pointermove', pointerMove);
archery.addEventListener('pointerup', pointerUp);
archery.addEventListener('pointercancel', pointerUp);

archery.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    autoFire();
  }
});

/* ============================================================
   RESIZE
   ============================================================ */

let resizeTimer = null;

function resize(){
  W = window.innerWidth;
  H = window.innerHeight;

  treeCanvas.width = Math.round(W * DPR);
  treeCanvas.height = Math.round(H * DPR);

  treeCanvas.style.width = `${W}px`;
  treeCanvas.style.height = `${H}px`;

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  buildScene();
  refreshRig();
}

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    resize();
  }, 100);
});

/* ============================================================
   START
   ============================================================ */

function start(){
  resize();
  resetScene();
  buildMotes();
  startBeat();
  intro();
}

start();
      let played = false, drawing = false, startPX = 0, startPY = 0, startDraw = 0;

function fire(){
  if (played) return;
  played = true;
  drawing = false;
  stopBeat();
  cue('release'); cue('whoosh');
  filmTL = buildFilm(shotGeom());
  filmTL.play(0);
}

function springBack(){
  const from = curDraw;
  gsap.to({ d: from }, {
    d: 0,
    duration: 0.55,
    ease: 'elastic.out(1,0.4)',
    onUpdate() {
      setDraw(this.targets()[0].d);
    }
  });
}

function autoFire(){
  if (played) return;
  recT0 = performance.now();
  cue('draw');       // t=0 of the soundtrack

  gsap.to({ d: curDraw }, {
    d: maxDraw * 0.94,
    duration: 0.62,
    ease: 'power2.inOut',
    onUpdate() {
      setDraw(this.targets()[0].d);
    },
    onComplete: () => gsap.delayedCall(0.16, fire),
  });
}

archery.addEventListener('pointerdown', (e) => {
  if (played) return;

  drawing = true;

  try {
    archery.setPointerCapture(e.pointerId);
  } catch (_) {}

  startPX = e.clientX;
  startPY = e.clientY;
  startDraw = curDraw;

  e.preventDefault();
});

archery.addEventListener('pointermove', (e) => {
  if (!drawing) return;

  // project the drag onto the pull-back axis, so dragging back along the aim
  // (down + away from the heart) draws the string — on any shot angle.
  const proj =
    (e.clientX - startPX) * pullUX +
    (e.clientY - startPY) * pullUY;

  setDraw(startDraw + proj);
});

function endDraw(){
  if (!drawing) return;

  drawing = false;

  if (curDraw > maxDraw * 0.26) {
    fire();
  } else {
    springBack();
  }
}

archery.addEventListener('pointerup', endDraw);
archery.addEventListener('pointercancel', endDraw);

archery.addEventListener('keydown', (e) => {
  if (played) return;

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    autoFire();
  }
});

/* boot Act 1: reveal the target + bow + hint, then start the beat */
function enter(){
  gsap.set(hero, { autoAlpha: 1 });

  refreshRig();
  setDraw(0);

  gsap.set([eyebrow, hint], {
    opacity: 0,
    y: 14
  });

  gsap.set(target, {
    opacity: 0,
    y: 10,
    scaleX: 0.9,
    scaleY: 0.9
  });

  gsap.set(archery, {
    opacity: 0,
    scale: 0.85
  }); // scale from the grip; keeps rotation

  gsap.set(heartGlow, {
    opacity: 0,
    scale: 1
  });

  gsap.set(arrow, {
    opacity: 1
  });

  const tl = gsap.timeline({
    onComplete: startBeat
  });

  tl.to(target, {
      opacity: 1,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.1)

    .to(heartGlow, {
      opacity: 0.7,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.2)

    .to(archery, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.28)

    .to(eyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, 0.4)

    .to(hint, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, 0.7);
}

function armReplay(){
  replay.hidden = false;

  requestAnimationFrame(() => {
    replay.classList.add('is-shown');
  });
}

/* back to Act 1, ready to be drawn again */
function resetAll(){
  treeStop();
  showWish(false);

  window.bdayDone = false;
  replayArmed = false;

  replay.classList.remove('is-shown');
  replay.hidden = true;

  if (filmTL) {
    filmTL.pause(0);
  }

  gsap.set([flood, bloom], {
    autoAlpha: 0
  });

  gsap.set(field, {
    autoAlpha: 0
  });

  gsap.set(arrow, {
    opacity: 1,
    scaleY: 1
  });

  played = false;

  enter();
}

/* ============================================================
   SIZING + BOOT
   ============================================================ */

function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  W = canvas.clientWidth;
  H = canvas.clientHeight;

  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  buildSprites();
  buildScene();

  if (reduceMotion){
    drawFinal();
    return;
  }

  if (played && filmTL){
    const at = filmTL.time();
    const active = filmTL.isActive();

    filmTL = buildFilm(shotGeom());

    filmTL.pause(at);

    if (active) {
      filmTL.play(at);
    }
  } else {
    refreshRig();
    setDraw(0);
  }
}

let resizeRAF = 0;

window.addEventListener('resize', () => {
  if (resizeRAF) return;

  resizeRAF = requestAnimationFrame(() => {
    resizeRAF = 0;
    resize();
  });
});

resize();

if (reduceMotion){
  drawFinal();
} else {
  buildMotes();

  document.fonts &&
    document.fonts.ready.then(() => {
      refreshRig();
      setDraw(0);
    });

  enter();

  replay.addEventListener('click', resetAll);
}

/* ============================================================
   RECORDING HOOK — the rig draws + fires after its pre-roll
   ============================================================ */

if (isRecord){
  window.bdayAPI = {
    start(){
      autoFire();
    },

    replay(){
      resetAll();
    },
  };
}
