(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- header: solid on scroll, hides on scroll down ---------- */
  const header = $('.site-header');
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);
    if (!document.body.classList.contains('menu-open')) {
      header.classList.toggle('hide', y > 480 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove('hide');
    }
    lastY = y;
    updateStory();
    updateSteps();
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = $('.nav-toggle');
  const nav = $('#nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) header.classList.remove('hide');
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });

  /* ---------- active nav link ---------- */
  const links = $$('.nav a[href^="#"]:not(.btn)');
  const linkFor = id => links.find(a => a.getAttribute('href') === '#' + id);
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const l = linkFor(en.target.id);
      if (l && en.isIntersecting) { links.forEach(x => x.classList.remove('active')); l.classList.add('active'); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => navIO.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.rv').forEach(el => revealIO.observe(el));

  /* ---------- count-up ---------- */
  const fmt = n => n.toLocaleString('en-US');
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target, end = +el.dataset.count;
      if (reduce.matches) { el.textContent = fmt(end); return; }
      const dur = 1400, t0 = performance.now();
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- story band: step through the teaser lines ---------- */
  const story = $('.story');
  function updateStory() {
    if (!story || reduce.matches) return;
    const r = story.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    const step = Math.min(3, Math.floor(p * 4));
    if (story.dataset.step !== String(step)) story.dataset.step = step;
  }
  if (story) story.dataset.step = '0';

  /* ---------- process steps light up as you read ---------- */
  const lists = $$('.steps');
  function updateSteps() {
    const line = window.innerHeight * 0.62;
    lists.forEach(list => {
      const items = list.children;
      let lit = 0;
      for (const li of items) {
        const on = li.getBoundingClientRect().top < line;
        li.classList.toggle('lit', on);
        if (on) lit++;
      }
      list.style.setProperty('--p', items.length > 1 ? Math.max(0, (lit - 1) / (items.length - 1)) : 0);
    });
  }

  /* ---------- hero sparks ---------- */
  const canvas = $('.sparks');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const colors = ['255,178,62', '232,80,31', '245,235,218'];
    let w = 0, h = 0, dpr = 1, sparks = [], running = false, raf = 0, visible = true;

    const spawn = (initial) => {
      const art = $('.hero-art').getBoundingClientRect();
      const heroR = canvas.getBoundingClientRect();
      const cx = art.left - heroR.left + art.width / 2;
      const cy = art.top - heroR.top + art.height * 0.55;
      return {
        x: cx + (Math.random() - 0.5) * art.width * 0.7,
        y: initial ? cy - Math.random() * art.height * 0.9 : cy + (Math.random() - 0.2) * art.height * 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.35 + Math.random() * 0.9),
        len: 4 + Math.random() * 9,
        life: 0,
        max: 160 + Math.random() * 220,
        c: colors[Math.random() < 0.7 ? 0 : (Math.random() < 0.7 ? 1 : 2)],
        wob: Math.random() * Math.PI * 2
      };
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 700 ? 26 : 54;
      sparks = Array.from({ length: n }, () => spawn(true));
    };
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.life++; s.wob += 0.04;
        s.x += s.vx + Math.sin(s.wob) * 0.25;
        s.y += s.vy;
        const t = s.life / s.max;
        const a = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        if (t >= 1 || s.y < -20) { sparks[i] = spawn(false); continue; }
        ctx.strokeStyle = `rgba(${s.c},${(a * 0.85).toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * s.len, s.y - s.vy * s.len);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!running && visible && !reduce.matches && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    reduce.addEventListener?.('change', () => reduce.matches ? (stop(), ctx.clearRect(0, 0, w, h)) : start());
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    // wait for layout and fonts so the flame position is correct
    requestAnimationFrame(() => { resize(); start(); });
  }

  /* ---------- sample form (Netlify Forms, with graceful fallback) ---------- */
  const form = $('.sample-form');
  if (form) {
    const status = $('.form-status', form);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      status.textContent = 'Sending…';
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = 'Thank you. We will call or WhatsApp you about your sample.';
      } catch {
        status.textContent = 'Sorry, the form could not be sent right now. Please try again later.';
      } finally {
        btn.disabled = false;
      }
    });
  }

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  onScroll();
})();
