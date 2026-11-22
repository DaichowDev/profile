(() => {
  'use strict';

  const C = window.PORTFOLIO;
  if (!C) {
    document.body.textContent = 'Falta config.js o tiene un error de sintaxis.';
    return;
  }

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);

  // Crea elementos de forma segura (sin innerHTML)
  const h = (tag, props = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return el;
  };

  // Soporta "si:github", "devicon:python[:variante]", URL o ruta
  const iconURL = (icon, color = 'ffffff') => {
    if (!icon) return '';
    if (/^(https?:)?\/\//.test(icon) || /^[./]/.test(icon) || /\.(png|jpe?g|svg|webp|gif)$/i.test(icon)) return icon;
    const [kind, name, variant = 'original'] = icon.split(':');
    if (kind === 'si') return `https://cdn.simpleicons.org/${name}/${color}`;
    if (kind === 'devicon') return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;
    return '';
  };
  const isIconRef = (s) => /^(si|devicon):/.test(s) || /^(https?:)?\/\//.test(s) || /\.(png|jpe?g|svg|webp|gif)$/i.test(s);

  const safeURL = (url) => (/^(https?:|mailto:|\.{0,2}\/|[\w-]+\/)/i.test(url || '') ? url : '#');

  /* ---------- Tema ---------- */
  function applyTheme() {
    document.title = C.title || 'Portafolio';
    const t = C.theme || {};
    const root = document.documentElement.style;
    const map = {
      '--accent': t.accent, '--accent2': t.accent2, '--text': t.text, '--muted': t.muted,
      '--card-bg': t.cardBg, '--card-border': t.cardBorder, '--radius': t.radius,
      '--blur': t.blur, '--font': t.font, '--max-width': t.maxWidth,
      '--skill-size': (C.skillIconSize || 44) + 'px', '--cat-cols': C.categoryColumns || 2
    };
    for (const [k, v] of Object.entries(map)) if (v != null) root.setProperty(k, v);

    // Fondo
    const bg = $('#bg');
    const b = C.background || {};
    if (b.type === 'image') bg.style.backgroundImage = `url("${b.value}")`;
    else if (b.type === 'video') {
      bg.append(h('video', { src: b.value, autoplay: true, muted: true, loop: true, playsinline: true }));
      const v = $('video', bg); v.muted = true; v.play().catch(() => {});
    } else bg.style.background = b.value || '#0b0b10';
    if (b.blur) bg.style.filter = `blur(${b.blur}px)`;
    $('#bg-overlay').style.opacity = b.overlay ?? 0.35;
  }

  /* ---------- Secciones ---------- */
  const renderers = {};
  const cardClass = () => 'card' + (C.effects?.entrance !== false ? ' entrance' : '');
  let order = 0;
  const delay = () => ({ animationDelay: `${(order++) * 90}ms` });

  renderers.profile = () => {
    const p = C.profile || {};
    const tagEl = h('div', { class: 'tagline' });
    const card = h('section', { class: cardClass() + ' profile', style: delay() },
      p.avatar && h('img', { class: `avatar ${p.avatarShape || 'circle'}`, src: p.avatar, alt: p.name || 'Avatar' }),
      h('h1', { class: 'name' }, p.name),
      tagEl,
      p.bio && h('p', { class: 'bio' }, p.bio),
      p.location && h('div', { class: 'location' }, '📍 ' + p.location),
      p.badges?.length && h('div', { class: 'badges' }, p.badges.map((b) => h('span', { class: 'badge' }, b)))
    );
    startTyping(tagEl, p.tagline);
    return card;
  };

  function startTyping(el, lines) {
    const list = Array.isArray(lines) ? lines : lines ? [lines] : [];
    if (!list.length) return;
    if (C.effects?.typing === false) {
      el.textContent = list[0]; return;
    }
    const text = h('span'); const caret = h('span', { class: 'caret' });
    el.append(text, caret);
    let i = 0, j = 0, deleting = false;
    const tick = () => {
      const full = list[i];
      text.textContent = full.slice(0, j);
      let wait = deleting ? 30 : 70;
      if (!deleting && j === full.length) {
        if (list.length === 1) return; // una sola frase: queda escrita
        deleting = true; wait = 1800;
      } else if (deleting && j === 0) {
        deleting = false; i = (i + 1) % list.length; wait = 350;
      } else j += deleting ? -1 : 1;
      setTimeout(tick, wait);
    };
    tick();
  }

  renderers.socials = () => {
    const list = C.socials || [];
    if (!list.length) return null;
    return h('nav', { class: cardClass() + ' socials', style: delay(), 'aria-label': 'Redes sociales' },
      list.map((s) =>
        h('a', { class: 'social', href: safeURL(s.url), target: '_blank', rel: 'noopener noreferrer', title: s.name, 'aria-label': s.name },
          h('img', { src: iconURL(s.icon), alt: s.name, loading: 'lazy' }))
      )
    );
  };

  /* ---------- Música ---------- */
  let audio = null;
  renderers.music = () => {
    const m = C.music;
    if (!m?.enabled || !m.tracks?.length) return null;

    audio = new Audio();
    audio.volume = m.volume ?? 0.5;
    audio.preload = 'metadata';
    let idx = 0;

    const cover = h('div', { class: 'cover' }, '♪');
    const title = h('div', { class: 'track-title' });
    const artist = h('div', { class: 'track-artist' });
    const progress = h('input', { class: 'progress', type: 'range', min: 0, max: 1000, value: 0, 'aria-label': 'Progreso' });
    const playBtn = h('button', { class: 'icon-btn main', 'aria-label': 'Reproducir/Pausar' }, '▶');
    const prevBtn = h('button', { class: 'icon-btn', 'aria-label': 'Anterior' }, '⏮');
    const nextBtn = h('button', { class: 'icon-btn', 'aria-label': 'Siguiente' }, '⏭');
    const vol = h('input', { class: 'volume', type: 'range', min: 0, max: 100, value: Math.round(audio.volume * 100), 'aria-label': 'Volumen' });

    const load = (i, autoplay) => {
      idx = (i + m.tracks.length) % m.tracks.length;
      const t = m.tracks[idx];
      audio.src = t.src;
      title.textContent = t.title || 'Sin título';
      artist.textContent = t.artist || '';
      cover.style.backgroundImage = t.cover ? `url("${t.cover}")` : '';
      cover.textContent = t.cover ? '' : '♪';
      progress.value = 0;
      if (autoplay) audio.play().catch(() => {});
    };

    playBtn.onclick = () => (audio.paused ? audio.play().catch(() => {}) : audio.pause());
    prevBtn.onclick = () => load(idx - 1, true);
    nextBtn.onclick = () => load(idx + 1, true);
    vol.oninput = () => (audio.volume = vol.value / 100);
    progress.oninput = () => { if (audio.duration) audio.currentTime = (progress.value / 1000) * audio.duration; };

    audio.addEventListener('play', () => { playBtn.textContent = '⏸'; cover.classList.add('spinning'); });
    audio.addEventListener('pause', () => { playBtn.textContent = '▶'; cover.classList.remove('spinning'); });
    audio.addEventListener('timeupdate', () => { if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 1000; });
    audio.addEventListener('ended', () => {
      if (idx === m.tracks.length - 1 && m.loop === false) return;
      load(idx + 1, true);
    });
    audio.addEventListener('error', () => { artist.textContent = 'No se pudo cargar el archivo de audio'; });

    load(0, false);

    return h('section', { class: cardClass() + ' player', style: delay() },
      cover,
      h('div', { class: 'player-main' }, title, artist, progress),
      h('div', { class: 'controls' }, prevBtn, playBtn, nextBtn, vol)
    );
  };

  /* ---------- Skills ---------- */
  renderers.skills = () => {
    const groups = C.skills || [];
    if (!groups.length) return null;
    const mode = C.skillNames || 'hover';
    return h('section', { class: cardClass() + ` names-${mode}`, style: delay() },
      groups.map((g) =>
        h('div', { class: 'skill-group' },
          h('h3', { class: 'section-title' }, g.title),
          h('div', { class: 'skill-list' },
            (g.items || []).map((s) =>
              h('div', { class: 'skill', title: mode === 'hover' ? '' : s.name },
                h('img', { src: iconURL(s.icon), alt: s.name, loading: 'lazy' }),
                h('span', {}, s.name))
            ))
        ))
    );
  };

  /* ---------- Categorías ---------- */
  renderers.categories = () => {
    const cats = C.categories || [];
    if (!cats.length) return null;
    return h('section', { class: 'cat-grid' },
      cats.map((c) => {
        const iconNode = !c.icon ? null
          : isIconRef(c.icon) ? h('img', { src: iconURL(c.icon), alt: '' })
          : c.icon;
        return h('button', {
          class: cardClass() + ' cat' + (c.image ? ' has-image' : ''),
          style: { ...delay(), ...(c.image ? { backgroundImage: `url("${c.image}")` } : {}) },
          onclick: () => openCategory(c)
        },
          h('div', { class: 'cat-icon' }, iconNode),
          h('div', { class: 'cat-title' }, c.title),
          c.description && h('div', { class: 'cat-desc' }, c.description),
          h('span', { class: 'cat-count' }, String((c.items || []).length))
        );
      })
    );
  };

  /* ---------- Modal de categoría ---------- */
  const modal = $('#modal');
  const grid = $('#modal-grid');
  const search = $('#modal-search');
  let currentCat = null;
  let lastFocus = null;

  function itemCard(it) {
    return h('article', { class: 'card item' },
      it.image && h('img', { class: 'item-img', src: it.image, alt: it.title, loading: 'lazy' }),
      h('div', { class: 'item-body' },
        h('div', { class: 'item-title' }, it.title),
        it.description && h('p', { class: 'item-desc' }, it.description),
        it.tags?.length && h('div', { class: 'tags' }, it.tags.map((t) => h('span', { class: 'tag' }, t))),
        it.links?.length && h('div', { class: 'links' },
          it.links.map((l) => h('a', { class: 'btn', href: safeURL(l.url), target: '_blank', rel: 'noopener noreferrer' }, l.label)))
      )
    );
  }

  function renderItems(q = '') {
    grid.replaceChildren();
    const items = (currentCat.items || []).filter((it) => {
      if (!q) return true;
      const hay = [it.title, it.description, ...(it.tags || [])].join(' ').toLowerCase();
      return hay.includes(q.toLowerCase());
    });
    if (!items.length) {
      grid.append(h('p', { class: 'empty' }, (currentCat.items || []).length ? 'Sin resultados.' : 'Próximamente…'));
      return;
    }
    items.forEach((it) => grid.append(itemCard(it)));
  }

  function openCategory(c) {
    currentCat = c;
    lastFocus = document.activeElement;
    $('#modal-title').textContent = c.title;
    $('#modal-desc').textContent = c.description || '';
    search.value = '';
    search.hidden = !(c.items || []).length;
    renderItems();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal-panel', modal).scrollTop = 0;
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  search.addEventListener('input', () => renderItems(search.value.trim()));

  /* ---------- Efecto tilt ---------- */
  function initTilt() {
    if (C.effects?.tilt === false || matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest?.('.card:not(.player)');
      document.querySelectorAll('.card[data-tilt]').forEach((c) => {
        if (c !== card) { c.style.transform = ''; c.removeAttribute('data-tilt'); }
      });
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.dataset.tilt = '1';
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });
  }

  /* ---------- Partículas ---------- */
  function initParticles() {
    if (!C.effects?.particles || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = $('#particles');
    const ctx = cv.getContext('2d');
    let W, H, dots;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8b5cf6';
    const resize = () => {
      W = cv.width = innerWidth; H = cv.height = innerHeight;
      dots = Array.from({ length: C.effects.particleCount || 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25, vy: -(Math.random() * 0.3 + 0.08),
        a: Math.random() * 0.5 + 0.2
      }));
    };
    resize();
    addEventListener('resize', resize);
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = accent;
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.y < -5) { d.y = H + 5; d.x = Math.random() * W; }
        if (d.x < -5) d.x = W + 5; else if (d.x > W + 5) d.x = -5;
        ctx.globalAlpha = d.a;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Pantalla de entrada ---------- */
  function initEnter() {
    const enter = $('#enter');
    const wantsEnter = C.music?.enabled && C.music?.enterScreen && audio;
    if (!wantsEnter) return;
    $('#enter-text').textContent = C.music.enterText || 'Click para entrar';
    enter.hidden = false;
    enter.addEventListener('click', () => {
      audio.play().catch(() => {});
      enter.classList.add('leaving');
      setTimeout(() => (enter.hidden = true), 650);
    }, { once: true });
  }

  /* ---------- Render principal ---------- */
  applyTheme();
  const app = $('#app');
  (C.sections || ['profile', 'socials', 'music', 'skills', 'categories']).forEach((name) => {
    const node = renderers[name]?.();
    if (node) app.append(node);
  });
  if (C.footer) app.append(h('footer', { class: 'footer' }, C.footer));

  initTilt();
  initParticles();
  initEnter();
})();
