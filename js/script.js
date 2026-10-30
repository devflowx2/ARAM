/* ==========================================================================
   ARAM PHOTOGRAPHY — PORTFOLIO SCRIPT
   All editable content lives in js/config.js. You should not need to change
   anything in this file.

   Contents
   01 Helpers                 07 Video section + modal
   02 Content binding         08 About & contact
   03 Sound (optional)        09 Navigation, scrolling, hero
   04 Camera intro            10 Camera cursor & magnetic buttons
   05 Modal helper            11 Boot
   06 Photography reel + lightbox
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const C = window.SITE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = () => mqReduce.matches;
  const pad = (n, l = 2) => String(n).padStart(l, '0');

  /* ---------- 01 HELPERS -------------------------------------------------- */
  const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
  const str = v => (typeof v === 'string' ? v.trim() : '');

  function h(tag, props = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'dataset') Object.assign(n.dataset, v);
      else if (k === 'style') n.style.cssText = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => { if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c)); });
    return n;
  }
  const html = s => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; };

  const BLADES = [0, 60, 120, 180, 240, 300].map(a => `<path d="M0-38 31-19 11 0z" transform="rotate(${a})"/>`).join('');
  const apertureIcon = () => html(`<span class="ph__ap" aria-hidden="true"><svg viewBox="-50 -50 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><circle r="46"/>${BLADES}</svg></span>`);
  const placeholder = (label, light) => h('div', { class: 'ph' + (light ? ' ph--light' : ''), 'aria-hidden': 'true' }, apertureIcon(), h('span', { class: 'ph__label' }, label));

  function safeUrl(v) {
    v = str(v); if (!v) return '';
    try { const u = new URL(v); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; }
  }
  function waLink(number, message) {
    const d = str(number).replace(/\D/g, '').replace(/^0+/, '');
    if (d.length < 8 || d.length > 15) return '';
    return 'https://wa.me/' + d + (str(message) ? '?text=' + encodeURIComponent(str(message)) : '');
  }
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(v));

  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  const locks = new Set();
  function lockScroll(reason, on) {
    on ? locks.add(reason) : locks.delete(reason);
    root.classList.toggle('is-locked', locks.size > 0);
  }

  /* ---------- LANGUAGE & THEME STATE -------------------------------------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode: ignore */ } }
  };
  const AR = (C.i18n && C.i18n.ar) || {};
  const EN_UI = {
    'social.facebook': 'Facebook', 'social.instagram': 'Instagram', 'social.whatsapp': 'WhatsApp',
    'ui.follow': 'Follow', 'ui.message': 'Message me', 'ui.soon': 'Coming soon', 'ui.newTab': 'opens in a new tab',
    'ui.soonToast': '{name} — coming soon', 'ui.soonAria': '{name} — link coming soon',
    'ui.whatsapp': 'WhatsApp', 'ui.email': 'Email', 'ui.location': 'Location', 'ui.business': 'Business inquiries',
    'ui.pause': 'Pause reel', 'ui.play': 'Play reel', 'ui.frame': 'FRAME', 'ui.openPhoto': 'Open photograph {n} of {total}: {title}',
    'ui.cardAria': 'Business card, showing the {side}. Activate to flip.', 'ui.front': 'front', 'ui.back': 'back',
    'ui.menuOpen': 'Open menu', 'ui.menuClose': 'Close menu',
    'aria.enter': 'Enter the experience', 'aria.viewer': 'Photograph viewer', 'aria.prev': 'Previous photograph', 'aria.next': 'Next photograph',
    'aria.close': 'Close', 'aria.reel': 'Photography reel. Each frame opens a larger view.',
    'aria.langSwitch': 'Switch language to Arabic', 'aria.toLight': 'Switch to light mode', 'aria.toDark': 'Switch to dark mode'
  };
  let lang = (() => {
    const saved = store.get('aram-lang');
    if (saved === 'ar' || saved === 'en') return saved;
    return C.i18n && C.i18n.defaultLanguage === 'ar' ? 'ar' : 'en';
  })();
  let theme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const t = (key, vars = {}) => ((lang === 'ar' && AR[key]) || EN_UI[key] || key).replace(/\{(\w+)\}/g, (m, n) => (vars[n] ?? m));
  const langHooks = [];   // functions that rebuild dynamic text when the language changes

  /* ---------- 02 CONTENT BINDING ------------------------------------------ */
  function bindContent() {
    const name = str(C.name) || 'Aram Photography';
    const upper = name.toLocaleUpperCase();
    const parts = upper.split(/\s+/);
    const l1 = parts[0], l2 = parts.slice(1).join(' ');

    $$('[data-bind]').forEach(n => { const v = get(C, n.dataset.bind); if (str(v)) n.textContent = str(v); });
    $$('[data-name-inline]').forEach(n => { n.textContent = upper; });
    $$('[data-name-lines]').forEach(n => {
      n.textContent = '';
      [l1, l2].filter(Boolean).forEach((p, i) => n.append(h('span', { class: 'line' }, h('span', { class: 'line__in', style: `--i:${i}` }, p))));
      n.setAttribute('aria-label', name);
    });
    if (str(C.siteTitle)) document.title = C.siteTitle;
    if (str(C.description)) $('meta[name="description"]')?.setAttribute('content', C.description);

    // split headings into words for the reveal animation
    $$('[data-split]').forEach(el => splitWords(el, el.textContent));
  }

  function splitWords(el, text) {
    const words = text.trim().split(/\s+/);
    el.setAttribute('aria-label', text.trim());
    el.textContent = '';
    words.forEach((w, i) => {
      el.append(h('span', { class: 'w', 'aria-hidden': 'true' }, h('span', { class: 'wi', style: `--wi:${i}` }, w)));
      if (i < words.length - 1) el.append(' ');
    });
  }

  /* ---------- 02b LANGUAGE (EN / AR) & THEME (DARK / LIGHT) --------------- */
  function applyStrings() {
    $$('[data-i18n], [data-bind]').forEach(el => {
      const key = el.dataset.i18n || el.dataset.bind;
      if (el.dataset.en === undefined) el.dataset.en = el.hasAttribute('data-split') ? (el.getAttribute('aria-label') || el.textContent) : el.textContent;
      const txt = (lang === 'ar' && AR[key]) || el.dataset.en;
      if (el.hasAttribute('data-split')) { if (el.getAttribute('aria-label') !== txt) splitWords(el, txt); }
      else if (el.textContent !== txt) el.textContent = txt;
    });
    [['#enterBtn', 'aria.enter'], ['#lightbox', 'aria.viewer'], ['#lbPrev', 'aria.prev'], ['#lbNext', 'aria.next'], ['#reel', 'aria.reel']]
      .forEach(([sel, key]) => $(sel)?.setAttribute('aria-label', t(key)));
    $$('[data-close]').forEach(b => b.setAttribute('aria-label', t('aria.close')));
    $$('[data-lang-toggle]').forEach(b => {
      b.textContent = lang === 'ar' ? 'EN' : 'عربي';
      b.setAttribute('lang', lang === 'ar' ? 'en' : 'ar'); b.setAttribute('aria-label', t('aria.langSwitch'));
    });
    $$('[data-theme-toggle]').forEach(b => b.setAttribute('aria-label', t(theme === 'light' ? 'aria.toDark' : 'aria.toLight')));
    $('#menuBtn')?.setAttribute('aria-label', t(root.classList.contains('menu-open') ? 'ui.menuClose' : 'ui.menuOpen'));
  }

  function setLang(next, save) {
    lang = next === 'ar' ? 'ar' : 'en';
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (save) store.set('aram-lang', lang);
    applyStrings(); langHooks.forEach(fn => fn());
  }
  function setTheme(next, save) {
    theme = next === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    if (save) store.set('aram-theme', theme);
    $('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f0e9' : '#080808');
    applyStrings();
  }
  function initTools() {
    $$('[data-lang-toggle]').forEach(b => b.addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar', true)));
    $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => setTheme(theme === 'light' ? 'dark' : 'light', true)));
  }

  /* ---------- 03 SOUND (optional) ----------------------------------------- */
  const sound = (() => {
    const cfg = C.sound || {};
    const srcs = { startup: str(cfg.startup), ambient: str(cfg.ambient), shutter: str(cfg.shutter) };
    const available = !!cfg.enabled && Object.values(srcs).some(Boolean);
    const btn = $('#soundToggle');
    const state = { on: false, audio: {} };
    const vol = Math.min(1, Math.max(0, Number(cfg.volume) || .35));
    const make = k => (state.audio[k] ||= Object.assign(new Audio(srcs[k]), { preload: 'none', volume: vol, loop: k === 'ambient' }));
    const play = k => { if (!state.on || !srcs[k]) return; try { const a = make(k); a.currentTime = 0; a.play().catch(() => {}); } catch { /* ignore */ } };
    function set(on) {
      state.on = on; btn.setAttribute('aria-pressed', String(on)); $('#soundLabel').textContent = on ? 'Sound on' : 'Sound off';
      if (on) { play('startup'); if (srcs.ambient) { try { make('ambient').play().catch(() => {}); } catch { /* ignore */ } } }
      else Object.values(state.audio).forEach(a => a.pause());
    }
    if (!available) { btn?.remove(); return { shutter() {} }; }
    btn.hidden = false;
    btn.addEventListener('click', () => set(!state.on));
    return { shutter: () => play('shutter') };
  })();

  /* ---------- 04 CAMERA INTRO --------------------------------------------- */
  let entered = false;
  function initIntro() {
    const intro = $('#intro'), site = $('#site'), enter = $('#enterBtn'), skip = $('#skipIntro');
    if (!intro) { startSite(); return; }

    lockScroll('intro', true);
    site.inert = true;

    // running timecode in the corner of the intro
    const tc = $('#introTc'); const t0 = performance.now();
    const tcTimer = setInterval(() => {
      const t = (performance.now() - t0) / 1000;
      tc.textContent = `00:00:${pad(Math.floor(t) % 60)}:${pad(Math.floor((t % 1) * 24))}`;
    }, 80);

    const finish = quick => {
      if (entered) return; entered = true; clearInterval(tcTimer);
      sound.shutter();
      const r = enter.getBoundingClientRect();
      intro.style.setProperty('--cx', (r.left + r.width / 2) + 'px');
      intro.style.setProperty('--cy', (r.top + r.height * .38) + 'px');
      const instant = quick || reduced();
      intro.classList.add(instant ? 'is-fading' : 'is-opening');
      root.classList.add('is-entering');
      site.inert = false;
      setTimeout(() => {
        intro.classList.add('is-done'); intro.setAttribute('aria-hidden', 'true');
        lockScroll('intro', false); window.scrollTo(0, 0);
        $('#main').focus({ preventScroll: true });
      }, instant ? 600 : 1700);
      startSite();
    };

    enter.addEventListener('click', () => finish(false));
    skip.addEventListener('click', () => finish(true));
    intro.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); finish(true); } });
    // magnetic pull of the aperture toward the pointer
    if (mqFine.matches && !reduced()) {
      enter.addEventListener('pointermove', e => {
        const r = enter.getBoundingClientRect();
        enter.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .12}px)`;
      });
      enter.addEventListener('pointerleave', () => { enter.style.transform = ''; });
    }
    // after the sequence, keyboard focus lands on the enter button
    setTimeout(() => { if (!entered) enter.focus({ preventScroll: true }); }, reduced() ? 100 : 4600);
    enter.focus({ preventScroll: true });
  }

  /* ---------- 05 MODAL HELPER --------------------------------------------- */
  function createModal(el, { onClose, onKey } = {}) {
    let opener = null, open = false;
    const focusables = () => $$('button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])', el).filter(n => !n.closest('[hidden]') && n.offsetParent !== null);
    function show(from) {
      if (open) return; open = true;
      opener = from || document.activeElement;
      el.hidden = false; $('#site').inert = true; lockScroll('modal', true);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-open')));
      ($('[data-autofocus]', el) || el).focus({ preventScroll: true });
    }
    function hide() {
      if (!open) return; open = false;
      el.classList.remove('is-open'); $('#site').inert = false; lockScroll('modal', false);
      setTimeout(() => { if (!open) el.hidden = true; }, reduced() ? 20 : 450);
      onClose?.();
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    }
    el.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); hide(); }
      else if (e.key === 'Tab') {
        const f = focusables(); if (!f.length) { e.preventDefault(); return; }
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      } else onKey?.(e);
    });
    el.addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target === el) hide(); });
    return { show, hide, get isOpen() { return open; } };
  }

  /* ---------- 06 PHOTOGRAPHY REEL + LIGHTBOX ------------------------------ */
  const SHAPES = { portrait: '4/5', landscape: '3/2', square: '1/1', tall: '2/3', wide: '16/9' };
  const SHAPE_CYCLE = ['landscape', 'portrait', 'wide', 'square', 'tall', 'landscape', 'portrait', 'square'];

  function normalisePhotos() {
    let items = Array.isArray(C.gallery?.items) ? C.gallery.items : [];
    if (!items.length) items = Array.from({ length: 6 }, (_, i) => ({ title: `Frame title ${pad(i + 1)}` }));
    return items.map((it, i) => ({
      src: str(it.src), full: str(it.full), title: str(it.title) || `Untitled ${pad(i + 1)}`, category: str(it.category),
      caption: str(it.caption), year: str(it.year), alt: str(it.alt),
      shape: SHAPES[it.shape] ? it.shape : SHAPE_CYCLE[i % SHAPE_CYCLE.length]
    }));
  }

  function initGallery() {
    const reel = $('#reel'), track = $('#reelTrack'); if (!reel || !track) return;
    const list = normalisePhotos(), n = list.length;
    const toggle = $('#reelToggle'), toggleLabel = $('#reelToggleLabel');
    let anim = null, rate = 1, hoverTarget = 1, userPaused = false, offscreen = false, looping = false, lastW = innerWidth;

    function makeFrame(item, i, clone) {
      const media = h('span', { class: 'frame__media' });
      const fallback = () => media.replaceChildren(placeholder('Add your photograph'));
      if (item.src) {
        const img = h('img', { src: item.src, alt: clone ? '' : (item.alt || item.title), loading: 'lazy', decoding: 'async', draggable: 'false' });
        img.addEventListener('error', fallback, { once: true });
        media.append(img);
      } else fallback();
      return h('button', {
        type: 'button', class: `frame frame--${item.shape}`, style: `--ar:${SHAPES[item.shape]}`,
        dataset: { index: i, cursor: 'focus' }, 'aria-label': clone ? null : t('ui.openPhoto', { n: i + 1, total: n, title: item.title }),
        'aria-hidden': clone ? 'true' : null, tabindex: clone ? '-1' : null
      },
        media, h('span', { class: 'frame__shade' }), h('span', { class: 'frame__ui' }),
        h('span', { class: 'frame__no' }, `${t('ui.frame')} ${pad(i + 1)}`),
        h('span', { class: 'frame__meta' },
          item.category ? h('span', { class: 'frame__cat' }, item.category) : null,
          h('span', { class: 'frame__title' }, item.title)));
    }

    const effective = () => (userPaused || offscreen) ? 0 : hoverTarget;
    function step() {
      const t = effective(); rate += (t - rate) * .09;
      if (Math.abs(t - rate) < .004) { rate = t; looping = false; }
      if (anim) anim.playbackRate = rate;
      if (looping) requestAnimationFrame(step);
    }
    const kick = () => { if (!looping) { looping = true; requestAnimationFrame(step); } };

    function layout() {
      let progress = 0;
      if (anim) { const d = anim.effect.getTiming().duration; progress = ((anim.currentTime || 0) % d) / d; anim.cancel(); anim = null; }
      track.replaceChildren();
      const motionOk = !reduced() && typeof track.animate === 'function';
      toggle.hidden = !motionOk;
      reel.classList.toggle('is-static', !motionOk);
      if (!motionOk) {
        const half = h('div', { class: 'reel__half' }); list.forEach((it, i) => half.append(makeFrame(it, i, false)));
        track.append(half); reel.tabIndex = 0; reel.setAttribute('aria-label', 'Photography reel. Scroll sideways to browse; each frame opens a larger view.'); return;
      }
      reel.removeAttribute('tabindex');
      const fill = (half, primary, reps) => { half.replaceChildren(); for (let r = 0; r < reps; r++) list.forEach((it, i) => half.append(makeFrame(it, i, !(primary && r === 0)))); };
      const half1 = h('div', { class: 'reel__half' }); fill(half1, true, 1); track.append(half1);
      const one = half1.getBoundingClientRect().width || 1;
      const reps = Math.max(1, Math.ceil((innerWidth * 1.2) / one));
      if (reps > 1) fill(half1, true, reps);
      const half2 = h('div', { class: 'reel__half', 'aria-hidden': 'true' }); fill(half2, false, reps); track.append(half2);
      const W = half1.getBoundingClientRect().width;
      const tile = W / Math.max(1, Math.round(W / 48));
      half1.style.setProperty('--tile', tile + 'px'); half2.style.setProperty('--tile', tile + 'px');
      const speed = Math.max(8, Number(C.gallery?.speed) || 45), dur = (W / speed) * 1000;
      anim = track.animate([{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(${-W}px,0,0)` }], { duration: dur, iterations: Infinity, easing: 'linear' });
      anim.currentTime = progress * dur; anim.playbackRate = rate;
    }

    // hover: slow on the strip, near-pause on a frame
    reel.addEventListener('mouseover', e => { if (!mqFine.matches) return; hoverTarget = e.target.closest('.frame') ? 0 : .3; kick(); });
    reel.addEventListener('mouseleave', () => { hoverTarget = 1; kick(); });
    reel.addEventListener('focusin', () => { hoverTarget = 0; kick(); });
    reel.addEventListener('focusout', () => { hoverTarget = 1; kick(); });

    toggle.addEventListener('click', () => {
      userPaused = !userPaused; toggle.setAttribute('aria-pressed', String(userPaused));
      toggleLabel.textContent = userPaused ? t('ui.play') : t('ui.pause'); kick();
    });
    new IntersectionObserver(([e]) => { offscreen = !e.isIntersecting; kick(); }, { threshold: 0 }).observe(reel);
    document.addEventListener('visibilitychange', () => { offscreen = document.hidden || offscreen; if (!document.hidden) offscreen = false; kick(); });

    let rt; window.addEventListener('resize', () => {
      clearTimeout(rt); rt = setTimeout(() => { if (Math.abs(innerWidth - lastW) > 4) { lastW = innerWidth; layout(); } }, 200);
    });
    mqReduce.addEventListener?.('change', layout);

    /* lightbox */
    const lb = $('#lightbox'), stage = $('#lbStage');
    let idx = 0;
    const modal = createModal(lb, { onKey: e => { if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); } });

    function render(i) {
      idx = (i + n) % n; const it = list[idx];
      stage.replaceChildren();
      const src = it.full || it.src;
      const ph = () => h('div', { class: 'lb__ph', style: `--ar:${SHAPES[it.shape]}` }, placeholder('Add your photograph'));
      if (src) {
        const img = h('img', { src, alt: it.alt || it.title, decoding: 'async', draggable: 'false' });
        img.addEventListener('error', () => stage.replaceChildren(ph()), { once: true });
        stage.append(img);
      } else stage.append(ph());
      $('#lbTitle').textContent = it.title;
      $('#lbMeta').textContent = [it.category, it.year].filter(Boolean).join(' · ');
      $('#lbText').textContent = it.caption;
      $('#lbCount').textContent = `${pad(idx + 1)} / ${pad(n)}`;
      lb.setAttribute('aria-label', `${t('aria.viewer')} — ${it.title}`);
      $('#lbPrev').hidden = $('#lbNext').hidden = n < 2;
    }
    function go(d) {
      if (n < 2) return;
      stage.style.setProperty('--dx', (d * -30) + 'px'); stage.classList.add('is-swap');
      setTimeout(() => { render(idx + d); stage.style.setProperty('--dx', (d * 30) + 'px'); requestAnimationFrame(() => stage.classList.remove('is-swap')); }, reduced() ? 0 : 220);
    }
    track.addEventListener('click', e => {
      const f = e.target.closest('.frame'); if (!f) return;
      render(Number(f.dataset.index)); modal.show(f);
    });
    $('#lbPrev').addEventListener('click', () => go(-1));
    $('#lbNext').addEventListener('click', () => go(1));
    // touch swipe
    let sx = 0, sy = 0;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointerup', e => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    });

    toggleLabel.textContent = t('ui.pause');
    langHooks.push(() => { toggleLabel.textContent = userPaused ? t('ui.play') : t('ui.pause'); layout(); });
    layout();
  }

  /* ---------- 07 VIDEO SECTION + MODAL ------------------------------------ */
  function initVideos() {
    const grid = $('#videoGrid'); if (!grid) return;
    let items = (Array.isArray(C.videos?.items) ? C.videos.items : []).map((v, i) => ({
      src: str(v.src), poster: str(v.poster), title: str(v.title) || `Film title ${pad(i + 1)}`, category: str(v.category),
      description: str(v.description), duration: str(v.duration), orientation: v.orientation === 'portrait' ? 'portrait' : 'landscape', featured: !!v.featured
    }));
    if (!items.length) { $('#motion').hidden = true; $$('[data-nav][href="#motion"]').forEach(a => a.closest('li').remove()); return; }
    const fi = Math.max(0, items.findIndex(v => v.featured));
    const ordered = [items[fi], ...items.filter((_, i) => i !== fi)];
    ordered[0].orientation = 'landscape';

    const playSvg = () => html('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>');
    ordered.forEach((v, i) => {
      const media = h('span', { class: 'vcard__media' });
      const fb = () => media.replaceChildren(placeholder('Add your video poster'));
      if (v.poster) { const im = h('img', { src: v.poster, alt: '', loading: 'lazy', decoding: 'async' }); im.addEventListener('error', fb, { once: true }); media.append(im); } else fb();
      const card = h('button', {
        type: 'button', class: `vcard vcard--${v.orientation}${i === 0 ? ' vcard--featured' : ''}`, dataset: { v: items.indexOf(v), cursor: 'play' },
        'aria-label': v.src ? `Play video: ${v.title}` : `${v.title} — video coming soon`
      },
        media,
        h('span', { class: 'vcard__top' }, h('span', {}, `Reel ${pad(i + 1)}`), v.src ? (v.duration ? h('span', {}, v.duration) : null) : h('span', { class: 'vcard__soon' }, 'Coming soon')),
        h('span', { class: 'vcard__play', 'aria-hidden': 'true' }, playSvg()),
        h('span', { class: 'vcard__meta' }, v.category ? h('span', { class: 'vcard__cat' }, v.category) : null, h('span', { class: 'vcard__title' }, v.title), h('span', { class: 'vcard__desc' }, i === 0 ? v.description : '')));
      grid.append(card);
    });

    const modalEl = $('#videoModal'), video = $('#vmVideo'), msg = $('#vmMsg');
    const modal = createModal(modalEl, {
      onClose() { video.pause(); video.removeAttribute('src'); video.removeAttribute('poster'); video.load(); msg.hidden = true; }
    });
    video.addEventListener('error', () => { if (video.getAttribute('src')) msg.hidden = false; });

    grid.addEventListener('click', e => {
      const card = e.target.closest('.vcard'); if (!card) return;
      const v = items[Number(card.dataset.v)];
      if (!v.src) {
        toast('This film will be available soon');
        card.classList.remove('is-soon-flash'); void card.offsetWidth; if (!reduced()) card.classList.add('is-soon-flash'); return;
      }
      msg.hidden = true;
      modalEl.classList.toggle('is-portrait', v.orientation === 'portrait');
      $('#vmTitle').textContent = v.title; $('#vmText').textContent = v.description;
      $('#vmCat').textContent = [v.category, v.duration].filter(Boolean).join(' · ') || 'Motion story';
      modalEl.setAttribute('aria-label', `Video player — ${v.title}`);
      if (v.poster) video.poster = v.poster;
      video.src = v.src; video.load();
      modal.show(card);
      const p = video.play(); if (p && p.catch) p.catch(() => { /* needs a tap on the native play button */ });
    });
  }

  /* ---------- 08b BUSINESS CARD ------------------------------------------ */
  function initCard() {
    const K = C.card || {}, card = $('#bcard'); if (!card) return;
    const faces = [['front', $('#cardFaceFront'), str(K.front), str(K.frontAlt) || 'Front of the business card'],
                   ['back', $('#cardFaceBack'), str(K.back), str(K.backAlt) || 'Back of the business card']];
    if (/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(str(K.ratio))) card.style.setProperty('--ar', str(K.ratio));
    faces.forEach(([side, el, src, alt]) => {
      const fb = () => el.replaceChildren(placeholder(`Add card ${side}`));
      if (!src) { fb(); return; }
      const img = h('img', { src, alt, loading: 'lazy', decoding: 'async', draggable: 'false' });
      img.addEventListener('error', fb, { once: true });
      if (side === 'front') img.addEventListener('load', () => { if (img.naturalWidth && img.naturalHeight) card.style.setProperty('--ar', `${img.naturalWidth} / ${img.naturalHeight}`); }, { once: true });
      el.replaceChildren(img);
    });
    const bF = $('#cardFront'), bB = $('#cardBack');
    const set = back => {
      card.classList.toggle('is-flipped', back);
      bF.setAttribute('aria-pressed', String(!back)); bB.setAttribute('aria-pressed', String(back));
      card.setAttribute('aria-label', t('ui.cardAria', { side: t(back ? 'ui.back' : 'ui.front') }));
      faces[0][1].setAttribute('aria-hidden', String(back)); faces[1][1].setAttribute('aria-hidden', String(!back));
    };
    set(false);
    langHooks.push(() => set(card.classList.contains('is-flipped')));
    card.addEventListener('click', () => set(!card.classList.contains('is-flipped')));
    bF.addEventListener('click', () => set(false)); bB.addEventListener('click', () => set(true));
    // gentle 3D tilt + light glare following the pointer (desktop mouse only)
    if (mqFine.matches && !reduced()) {
      card.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - .5) * 12) + 'deg'); card.style.setProperty('--rx', ((.5 - py) * 10) + 'deg');
        card.style.setProperty('--gx', (px * 100) + '%'); card.style.setProperty('--gy', (py * 100) + '%');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    }
  }

  /* ---------- 08 ABOUT & CONTACT ------------------------------------------ */
  const ICONS = {
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><path d="M17.6 6.4h.01"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.5z"/><path d="M9 8.6c.2 2.4 3 5.4 6 6l1.2-1.3-1.9-1.2-.9.8c-.9-.4-1.8-1.2-2.2-2.2l.8-.9L11 7.9z"/></svg>'
  };
  const SOCIALS = ['facebook', 'instagram', 'whatsapp'];

  function initAbout() {
    if (!$('#about')) return;   // About section is turned off
    const A = C.about || {};
    const src = str(A.portrait);
    if (src) {
      const frame = $('#portraitFrame');
      const img = h('img', { src, alt: str(A.portraitAlt) || 'Portrait', loading: 'lazy', decoding: 'async', width: 800, height: 1000 });
      img.addEventListener('error', () => img.remove(), { once: true });
      frame.replaceChildren(img);
    }
    const genres = (Array.isArray(A.genres) ? A.genres : []).map(str).filter(Boolean);
    const ul = $('#genres'); genres.forEach(g => ul.append(h('li', {}, g)));
    if (!genres.length) ul.closest('div').hidden = true;
  }

  function initContact() {
    const K = C.contact || {}, S = K.socials || {};
    const wa = waLink(S.whatsapp, K.whatsappMessage);
    const hrefFor = key => (key === 'whatsapp' ? wa : safeUrl(S[key]));

    const renderSocials = (container) => {
      container.replaceChildren();
      SOCIALS.forEach(key => {
        const label = t('social.' + key), href = hrefFor(key);
        const inner = [html(ICONS[key]), h('span', { class: 'social__name' }, label),
          h('span', { class: 'social__tip', 'aria-hidden': 'true' }, href ? t(key === 'whatsapp' ? 'ui.message' : 'ui.follow') : t('ui.soon'))];
        const el = href
          ? h('a', { class: 'social', href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${label} (${t('ui.newTab')})`, dataset: { cursor: 'link' } }, ...inner)
          : h('button', { class: 'social', type: 'button', 'aria-disabled': 'true', 'aria-label': t('ui.soonAria', { name: label }), dataset: { cursor: 'link' } }, ...inner);
        el.addEventListener('pointerdown', () => { el.classList.remove('is-pressed'); void el.offsetWidth; el.classList.add('is-pressed'); });
        el.addEventListener('animationend', () => el.classList.remove('is-pressed'));
        if (!href) el.addEventListener('click', () => toast(t('ui.soonToast', { name: label })));
        container.append(h('li', {}, el));
      });
    };

    // optional contact details (only shown when filled in)
    const d = $('#details');
    const renderDetails = () => {
      d.replaceChildren();
      const rows = [];
      if (wa) rows.push([t('ui.whatsapp'), h('a', { class: 'd-v d-ltr', href: wa, target: '_blank', rel: 'noopener noreferrer', dataset: { cursor: 'link' } }, '+' + str(S.whatsapp).replace(/\D/g, '').replace(/^0+/, ''))]);
      if (validEmail(K.email)) rows.push([t('ui.email'), h('a', { class: 'd-v d-ltr', href: 'mailto:' + str(K.email), dataset: { cursor: 'link' } }, str(K.email))]);
      if (str(K.location)) rows.push([t('ui.location'), h('span', { class: 'd-v' }, str(K.location))]);
      if (str(K.businessInquiries)) rows.push([t('ui.business'), validEmail(K.businessInquiries) ? h('a', { class: 'd-v d-ltr', href: 'mailto:' + str(K.businessInquiries), dataset: { cursor: 'link' } }, str(K.businessInquiries)) : h('span', { class: 'd-v' }, str(K.businessInquiries))]);
      rows.forEach(([k, v]) => d.append(h('li', {}, h('span', { class: 'd-k' }, k), v)));
      d.hidden = !rows.length;
    };

    const renderAll = () => { renderSocials($('#socials')); renderSocials($('#footerSocials')); renderDetails(); };
    renderAll(); langHooks.push(renderAll);
    const missing = SOCIALS.filter(k => !hrefFor(k));
    if (missing.length) console.info('[Aram Photography site] Not configured yet (buttons are inactive):', missing.join(', '), '→ edit js/config.js → contact.socials');

    // footer
    const F = C.footer || {};
    const year = str(F.year) || String(new Date().getFullYear());
    $('#copyright').textContent = (str(F.copyright) || '© {year} {name}').replace('{year}', year).replace('{name}', str(C.name) || 'Aram Photography');
    $('#toTop').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); });
  }

  /* ---------- 09 NAVIGATION, SCROLLING, HERO ------------------------------ */
  function initNav() {
    const header = $('#header'), btn = $('#menuBtn'), nav = $('#nav');
    const setMenu = open => {
      root.classList.toggle('menu-open', open); btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', t(open ? 'ui.menuClose' : 'ui.menuOpen'));
      lockScroll('menu', open);
    };
    btn.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); btn.focus(); } });
    window.matchMedia('(min-width: 861px)').addEventListener?.('change', e => { if (e.matches) setMenu(false); });

    // active section indicator
    const links = $$('[data-nav]');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => { const on = a === map.get(e.target.id); a.classList.toggle('is-active', on); on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    new IntersectionObserver(([e]) => { if (e.isIntersecting) links.forEach(a => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); }); }, { rootMargin: '-45% 0px -50% 0px' }).observe($('#hero'));

    // header background + hero parallax (one rAF-throttled passive listener)
    const media = $('#heroMedia'), content = $('#heroContent'), hero = $('#hero');
    let ticking = false;
    const update = () => {
      ticking = false; const y = window.scrollY, vh = innerHeight;
      header.classList.toggle('is-scrolled', y > 40);
      if (reduced() || y > vh * 1.1) return;
      media.style.transform = `translate3d(0, ${y * .22}px, 0) scale(${1 + y / vh * .05})`;
      content.style.transform = `translate3d(0, ${y * -.08}px, 0)`; content.style.opacity = String(Math.max(0, 1 - y / (vh * .85)));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // hero timecode
    let s = 0; const tc = $('#timecode'); let started = false;
    root.addEventListener('siteentered', () => { if (started) return; started = true; setInterval(() => { if (document.hidden) return; s++; tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; }, 1000); });
    const frameLabel = $('.vf .hud--tl');
    const sections = $$('main > section');
    // frame counter in the hero changes as you scroll (decorative)
    window.addEventListener('scroll', () => { if (!ticking) frameLabel.textContent = `FRAME ${pad(Math.round(window.scrollY / 8), 3)}`; }, { passive: true });
    void sections; void hero;
  }

  function initHeroMedia() {
    const H = C.hero || {}, wrap = $('#heroMedia');
    const img = str(H.image), vid = str(H.video), poster = str(H.poster);
    const small = window.matchMedia('(max-width: 860px)').matches;
    const vSrc = (small && str(H.videoMobile)) || vid;
    const saver = navigator.connection && navigator.connection.saveData;
    if (vSrc) {
      const v = h('video', { muted: '', loop: '', playsinline: '', preload: 'metadata', 'aria-hidden': 'true', tabindex: '-1', poster: poster || null });
      v.muted = true; v.setAttribute('playsinline', '');
      v.append(h('source', { src: vSrc }), 'Your browser does not support background video.');
      v.addEventListener('error', () => v.remove(), true);
      wrap.append(v); wrap.classList.add('has-media');
      if (!reduced() && !saver) {
        const p = () => { const r = v.play(); if (r && r.catch) r.catch(() => {}); };
        new IntersectionObserver(([e]) => { e.isIntersecting ? p() : v.pause(); }, { threshold: .05 }).observe(wrap);
      } else if (poster) { /* poster stays visible, video never starts */ }
    } else if (img) {
      const i = h('img', { src: img, alt: str(H.imageAlt) || '', decoding: 'async', fetchpriority: 'high' });
      i.addEventListener('error', () => { i.remove(); wrap.classList.remove('has-media'); }, { once: true });
      wrap.append(i); wrap.classList.add('has-media');
    }
  }

  function initReveal() {
    const els = $$('.reveal, .footer');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(e => { if (e.dataset.d == null && e.style.getPropertyValue('--d') === '') e.style.setProperty('--d', '0s'); io.observe(e); });
  }

  /* ---------- 10 CAMERA CURSOR & MAGNETIC BUTTONS ------------------------- */
  function initCursor() {
    if (!mqFine.matches) return;
    const cur = html('<div class="cursor" aria-hidden="true"><i class="cursor__dot"></i><i class="cursor__ring"><i class="cursor__in"><i class="cursor__circle"></i><b></b><b></b><b></b><b></b></i></i><i class="cursor__label"><span>Play</span></i></div>');
    document.body.append(cur);
    const dot = $('.cursor__dot', cur), ring = $('.cursor__ring', cur), label = $('.cursor__label', cur), inner = $('.cursor__in', cur);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, running = false, vel = 0;
    const loop = () => {
      rx += (x - rx) * .2; ry += (y - ry) * .2;
      const dx = x - rx, dy = y - ry; vel = Math.min(1, Math.hypot(dx, dy) / 40);
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) rotate(${dx * .6}deg)`;
      label.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      inner.style.opacity = String(1 - vel * .25);
      if (Math.hypot(dx, dy) > .15) requestAnimationFrame(loop); else running = false;
    };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
    const setState = s => { cur.dataset.state = s || ''; };
    let active = false;
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      if (!active) { active = true; root.classList.add('has-cursor'); cur.classList.add('is-on'); rx = x = e.clientX; ry = y = e.clientY; }
      x = e.clientX; y = e.clientY; kick();
    }, { passive: true });
    document.addEventListener('mouseover', e => {
      const t = e.target; if (!(t instanceof Element)) return;
      const c = t.closest('[data-cursor]');
      if (c) setState(c.dataset.cursor === 'native' ? 'hidden' : c.dataset.cursor);
      else if (t.closest('a, button, [role="button"], summary')) setState('link');
      else setState('');
    });
    document.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
    document.addEventListener('mouseenter', () => { if (active) cur.classList.add('is-on'); });
    window.addEventListener('mousedown', () => cur.classList.add('is-down'));
    window.addEventListener('mouseup', () => cur.classList.remove('is-down'));
    // if the pointer capability changes (e.g. a tablet is docked), drop the custom cursor
    mqFine.addEventListener?.('change', e => { if (!e.matches) { cur.remove(); root.classList.remove('has-cursor'); } });
  }

  function initMagnetic() {
    if (!mqFine.matches || reduced()) return;
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 11 BOOT ------------------------------------------------------ */
  function startSite() { setTimeout(() => root.dispatchEvent(new Event('siteentered')), 1200); }

  function boot() {
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    bindContent();
    initHeroMedia();
    initGallery();
    initVideos();
    initAbout();
    initCard();
    initContact();
    initNav();
    initReveal();
    initCursor();
    initMagnetic();
    initIntro();
    initTools();
    setTheme(theme, false);
    applyStrings();
    window.__aramReady = true;
    root.classList.remove('no-js');
  }

  try { boot(); } catch (err) {
    console.error('[Aram Photography site] Something went wrong while starting:', err);
    root.classList.add('js-failed'); root.classList.remove('is-locked');
    const site = $('#site'); if (site) site.inert = false;
  }
})();
