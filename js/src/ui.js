// UI motion with Motion (the framework-free build of Framer Motion): custom cursor,
// settings and theme, floating hero icons, the swipeable skills shelf with 3D tiles,
// the curved projects carousel and its detail sheet, magnetic buttons, the clock.
//
// Source file. The page loads js/ui.min.js (a classic script, so it also runs from disk):
// rebuild with build.sh.
import { animate, press } from 'motion';

const root = document.documentElement;
// hover effects follow the pointer actually used: a touch laptop reports a coarse primary
// pointer yet has a mouse, so handlers check each event instead of a media query
const isMouse = (e) => e.pointerType === 'mouse' || e.pointerType === 'pen';
const reduced = () => root.dataset.motion === 'reduced';
const store = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
};
const SPRING = { type: 'spring', stiffness: 380, damping: 30 };

// ==========================================================================
// Cursor: a dot that follows exactly, a ring that trails and grows
// ==========================================================================
if (!reduced()) {
  const cursor = document.querySelector('.cursor');
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  const label = cursor.querySelector('.cursor-label');
  cursor.classList.add('is-hidden');

  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (!isMouse(e)) return root.classList.remove('has-cursor');
      root.classList.add('has-cursor');
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      cursor.classList.remove('is-hidden');
    },
    { passive: true }
  );
  const follow = () => {
    ringPos.x += (pos.x - ringPos.x) * 0.2;
    ringPos.y += (pos.y - ringPos.y) * 0.2;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);

  document.addEventListener('pointerover', (e) => {
    const link = e.target.closest('a, button, label, summary');
    const labelled = !link || link.closest('[data-cursor]') === link ? e.target.closest('[data-cursor]') : null;
    cursor.classList.toggle('is-label', Boolean(labelled));
    cursor.classList.toggle('is-link', Boolean(link) && !labelled);
    label.textContent = labelled ? labelled.dataset.cursor : '';
  });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  root.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
}

// ==========================================================================
// Segmented controls: a pill that springs to the checked option
// ==========================================================================
const placePills = (spring = true) => {
  document.querySelectorAll('.segmented').forEach((seg) => {
    const pill = seg.querySelector('.segmented-pill');
    const lab = seg.querySelector('input:checked')?.closest('label');
    if (!pill || !lab || !lab.offsetWidth) return;
    animate(pill, { x: lab.offsetLeft - 4, width: lab.offsetWidth }, spring && !reduced() ? SPRING : { duration: 0 });
  });
};

// ==========================================================================
// Settings and theme
// ==========================================================================
const btn = document.getElementById('settingsBtn');
const panel = document.getElementById('settingsPanel');
const nav = document.getElementById('siteNav');

const openPanel = () => {
  panel.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  nav.classList.add('is-pinned');
  placePills(false);
  animate(panel, { opacity: [0, 1], scale: [0.94, 1], y: [-8, 0] }, reduced() ? { duration: 0 } : { type: 'spring', bounce: 0.25, duration: 0.45 });
  panel.querySelector('input:checked')?.focus({ preventScroll: true });
};
const closePanel = (focusBtn) => {
  if (panel.hidden) return;
  btn.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-pinned');
  animate(panel, { opacity: 0, scale: 0.97, y: -4 }, { duration: reduced() ? 0 : 0.14 }).then(() => {
    if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true;
  });
  if (focusBtn) btn.focus();
};
btn.addEventListener('click', () => (panel.hidden ? openPanel() : closePanel(false)));
document.addEventListener('pointerdown', (e) => {
  if (!panel.hidden && !e.target.closest('.settings')) closePanel(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hidden) closePanel(true);
});

const systemDark = matchMedia('(prefers-color-scheme: dark)');
const resolve = (pref) => (pref === 'light' || pref === 'dark' ? pref : systemDark.matches ? 'dark' : 'light');

const setTheme = (pref, origin) => {
  const theme = resolve(pref);
  root.dataset.themePref = pref;
  const radio = panel.querySelector(`input[name="theme"][value="${pref}"]`);
  if (radio) radio.checked = true;
  placePills();
  if (theme === root.dataset.theme) return;
  const apply = () => {
    root.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  };
  if (!document.startViewTransition || reduced() || !origin) return apply();
  const r = origin.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() =>
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 800, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
    )
  );
};
systemDark.addEventListener('change', () => {
  if (root.dataset.themePref === 'system') setTheme('system', null);
});

panel.querySelector(`input[name="theme"][value="${root.dataset.themePref || 'system'}"]`)?.setAttribute('checked', '');
panel.querySelector(`input[name="motion"][value="${root.dataset.motion}"]`)?.setAttribute('checked', '');

panel.addEventListener('change', (e) => {
  const input = e.target;
  if (input.name === 'theme') {
    store('theme', input.value);
    setTheme(input.value, input.closest('label'));
  }
  if (input.name === 'motion') {
    store('motion', input.value);
    placePills();
    setTimeout(() => location.reload(), 200);
  }
});

const quick = document.getElementById('themeQuick');
quick.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  store('theme', next);
  setTheme(next, quick);
  if (!reduced()) animate(quick.querySelectorAll('.i'), { rotate: [-90, 0], scale: [0.6, 1] }, { type: 'spring', stiffness: 300, damping: 15 });
});

// ==========================================================================
// Buttons: press feedback everywhere, a magnetic pull on the main calls to action
// ==========================================================================
press('.btn, .icon-btn, .nav-burger, .card-social', (el) => {
  if (reduced()) return;
  animate(el, { scale: 0.96 }, { duration: 0.1 });
  return () => animate(el, { scale: 1 }, { type: 'spring', stiffness: 500, damping: 18 });
});

{
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (!isMouse(e) || reduced()) return;
      const r = el.getBoundingClientRect();
      animate(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35 }, { type: 'spring', stiffness: 260, damping: 16, mass: 0.6 });
    });
    el.addEventListener('pointerleave', () => animate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 220, damping: 12 }));
  });

  document.querySelectorAll('.card').forEach((c) =>
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`);
      c.style.setProperty('--my', `${e.clientY - r.top}px`);
    })
  );
}

// ==========================================================================
// Hero: the paint splash and the portrait drift apart with the pointer, for depth
// ==========================================================================
const visual = document.getElementById('heroVisual');
if (visual && !reduced()) {
  const splash = visual.querySelector('.hero-splash');
  const portrait = visual.querySelector('.hero-portrait');
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.tx = (e.clientX / innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / innerHeight) * 2 - 1;
    },
    { passive: true }
  );
  let running = false;
  const frame = () => {
    if (!running) return;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    splash.style.translate = `calc(-50% + ${-pointer.x * 16}px) calc(-50% + ${-pointer.y * 12}px)`;
    splash.style.rotate = `${pointer.x * 2}deg`;
    portrait.style.translate = `${pointer.x * 6}px ${pointer.y * 4}px`;
    requestAnimationFrame(frame);
  };
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    if (running) requestAnimationFrame(frame);
  }).observe(visual);
}

// ==========================================================================
// Skills: tiles tilt toward the pointer and spin in 3D on click
// ==========================================================================
document.querySelectorAll('.skill').forEach((skill) => {
  const face = skill.querySelector('.skill-face');
  let spinning = false;

  {
    skill.addEventListener('pointermove', (e) => {
      if (!isMouse(e) || reduced() || spinning) return;
      const r = face.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      animate(face, { rotateY: px * 40, rotateX: -py * 40, scale: 1.12, transformPerspective: 400 }, { type: 'spring', stiffness: 300, damping: 18 });
    });
    skill.addEventListener('pointerleave', () => {
      if (spinning) return;
      animate(face, { rotateX: 0, rotateY: 0, scale: 1 }, { type: 'spring', stiffness: 220, damping: 14 });
    });
  }

  skill.addEventListener('click', () => {
    if (reduced() || spinning) return;
    spinning = true;
    animate(face, { rotateY: [0, 360], rotateX: 0, scale: [1.15, 1], transformPerspective: 400 }, { duration: 0.9, ease: [0.22, 1, 0.36, 1] }).then(() => {
      spinning = false;
      animate(face, { rotateY: 0 }, { duration: 0 });
    });
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'skill-spark';
      face.appendChild(s);
      const a = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
      const d = 46 + Math.random() * 26;
      animate(s, { x: Math.cos(a) * d, y: Math.sin(a) * d, scale: [1, 0], opacity: [1, 0] }, { duration: 0.7, ease: [0.22, 1, 0.36, 1] }).then(() => s.remove());
    }
  });
});

// ==========================================================================
// Projects: the Bulge carousel — cards ride the outside of a cylinder that bulges
// toward the viewer, like the Bulge mode on gahanrao.com. It loops: past the last
// project comes the first, as if the cards stood on a ring.
// ==========================================================================
const carousel = document.getElementById('carousel');
if (carousel) {
  const cards = [...carousel.querySelectorAll('.pcard')];
  const n = cards.length;
  let current = 0; // position on the ring, in cards (unbounded)
  let target = 0;
  let velocity = 0;
  carousel.classList.add('is-live');

  const dots = document.getElementById('carDots');
  cards.forEach(() => dots.appendChild(document.createElement('li')));

  const STEP = 0.5; // radians between two cards on the cylinder
  const wrap = (v) => ((v % n) + n) % n;
  // the shortest way round the ring from the centre to card i
  const offsetOf = (i) => {
    let o = wrap(i - current);
    if (o > n / 2) o -= n;
    return o;
  };
  const gap = () => cards[0].offsetWidth * 1.03;

  const layout = () => {
    const R = gap() / STEP;
    const blur = reduced() ? 0 : Math.min(6, Math.abs(velocity) * 80);
    cards.forEach((card) => {
      const o = offsetOf(cards.indexOf(card));
      const a = Math.abs(o);
      const t = Math.max(-1.5, Math.min(1.5, o * STEP));
      const x = R * Math.sin(t);
      const z = R * (Math.cos(t) - 1);
      const lift = Math.max(0, 1 - a) * 0.03; // the centre card swells a touch
      card.style.transform = `translate3d(${x}px, -50%, ${z}px) rotateY(${t}rad) scale(${1 + lift})`;
      card.style.zIndex = String(100 - Math.round(a * 10));
      card.style.opacity = String(Math.max(0, 1 - Math.max(0, a - 1.25) * 1.4));
      card.style.visibility = a > 2.2 ? 'hidden' : 'visible';
      card.style.filter = blur > 0.3 || a > 0.5 ? `blur(${blur.toFixed(2)}px) brightness(${1 - Math.min(a, 2) * 0.05})` : 'none';
      card.classList.toggle('is-center', a < 0.5);
    });
    const on = wrap(Math.round(current));
    [...dots.children].forEach((d, i) => d.classList.toggle('is-on', i === on));
  };

  // the NodaJPA code types itself the first time its card reaches the centre
  const typeCode = (card) => {
    const code = card.querySelector('.code code');
    if (!code || code.dataset.typed || reduced()) return;
    code.dataset.typed = '1';
    code.innerHTML = code.innerHTML.split('\n').map((l) => `<span class="code-line">${l || ' '}</span>`).join('');
    let delay = 0.1;
    code.querySelectorAll('.code-line').forEach((line) => {
      const d = Math.max(0.06, Math.min(0.4, line.textContent.trim().length * 0.012));
      line.style.clipPath = 'inset(0 100% 0 0)';
      animate(line, { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }, { duration: d, delay, ease: 'linear' });
      delay += d + 0.04;
    });
  };

  let raf = 0;
  const settle = () => {
    const card = cards[wrap(Math.round(current))];
    if (carousel.dataset.seen) typeCode(card);
  };
  const tick = () => {
    const prev = current;
    current += (target - current) * (reduced() ? 1 : 0.1);
    if (Math.abs(target - current) < 0.0005) current = target;
    velocity = current - prev;
    if (current === target) {
      velocity = 0;
      raf = 0;
      layout();
      settle();
      return;
    }
    layout();
    raf = requestAnimationFrame(tick);
  };
  const go = (to) => {
    target = to;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  // drag (mouse and touch); a vertical move is left to the page
  let drag = null;
  carousel.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, start: target, moved: false, axis: null };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.axis && Math.hypot(dx, dy) > 8) drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (drag.axis !== 'x') return;
    drag.moved = true;
    const prev = current;
    target = drag.start - dx / gap();
    current = target;
    velocity = current - prev;
    layout();
  });
  window.addEventListener('pointerup', () => {
    if (!drag) return;
    if (drag.moved) go(Math.round(target));
    setTimeout(() => (drag = null), 0);
  });
  // a drag never counts as a click on a link inside a card
  carousel.addEventListener('click', (e) => {
    if (drag?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // horizontal wheel / trackpad swipe
  let wheelLock = 0;
  carousel.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock < 300) return;
      wheelLock = now;
      go(Math.round(target) + Math.sign(e.deltaX));
    },
    { passive: false }
  );

  document.getElementById('carPrev').addEventListener('click', () => go(Math.round(target) - 1));
  document.getElementById('carNext').addEventListener('click', () => go(Math.round(target) + 1));
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(Math.round(target) - 1);
    if (e.key === 'ArrowRight') go(Math.round(target) + 1);
  });

  // a click on a side card brings it to the centre, the short way round
  cards.forEach((card, i) =>
    card.addEventListener('click', (e) => {
      if (drag?.moved || card.classList.contains('is-center')) return;
      e.preventDefault();
      go(Math.round(target) + Math.round(offsetOf(i)));
    })
  );

  // start typing once the carousel is on screen
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    carousel.dataset.seen = '1';
    settle();
  }, { threshold: 0.4 }).observe(carousel);

  new ResizeObserver(layout).observe(carousel);
  layout();
}

// ==========================================================================
// The logo: its four pieces part on hover
// ==========================================================================
const brand = document.querySelector('.brand');
if (brand) {
  const OUT = [[-3, -3], [3, -3], [3, 2], [-1, 3]];
  const pieces = [...brand.querySelectorAll('.lm')];
  brand.addEventListener('pointerenter', () => {
    if (reduced()) return;
    pieces.forEach((el, i) => animate(el, { x: OUT[i][0] * 7, y: OUT[i][1] * 7, rotate: (i % 2 ? 1 : -1) * 6 }, { type: 'spring', stiffness: 380, damping: 12 }));
  });
  brand.addEventListener('pointerleave', () =>
    pieces.forEach((el) => animate(el, { x: 0, y: 0, rotate: 0 }, { type: 'spring', stiffness: 280, damping: 11 }))
  );
}

// ==========================================================================
// Blog: each article opens in a reader sheet that rises over the page
// ==========================================================================
document.querySelectorAll('.post-open').forEach((open) => {
  const reader = document.getElementById(open.dataset.post);
  if (!reader?.showModal) return;
  const bar = reader.querySelector('.reader-progress');
  const onScroll = () => {
    const max = reader.scrollHeight - reader.clientHeight;
    bar.style.setProperty('--read', max > 0 ? (reader.scrollTop / max).toFixed(3) : 1);
  };
  reader.addEventListener('scroll', onScroll, { passive: true });

  open.addEventListener('click', () => {
    window.__lenis?.stop();
    reader.showModal();
    reader.scrollTop = 0;
    onScroll();
    animate(reader, { y: ['100%', '0%'], opacity: [0.6, 1] }, reduced() ? { duration: 0 } : { type: 'spring', bounce: 0.12, duration: 0.6 });
  });

  let closing = false;
  const close = () => {
    if (closing) return;
    closing = true;
    animate(reader, { y: '100%', opacity: 0.6 }, { duration: reduced() ? 0 : 0.28, ease: [0.4, 0, 1, 1] }).then(() => {
      reader.close();
      closing = false;
    });
  };
  // Escape and the close button go through the same exit
  reader.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  reader.querySelector('.reader-close').addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });
  // a click on the dimmed page around the sheet closes it
  reader.addEventListener('click', (e) => {
    if (e.target !== reader) return;
    const r = reader.getBoundingClientRect();
    if (e.clientY < r.top || e.clientX < r.left || e.clientX > r.right) close();
  });
  reader.addEventListener('close', () => {
    window.__lenis?.start();
    open.focus({ preventScroll: true });
  });
  // "Get in touch": close, then scroll to Contact
  reader.querySelector('[data-close-reader]')?.addEventListener('click', (e) => {
    e.preventDefault();
    reader.addEventListener('close', () => {
      const target = document.getElementById('contact');
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -96 });
      else target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
    }, { once: true });
    close();
  });
});

// ==========================================================================
// Local time in Antananarivo
// ==========================================================================
const clock = document.getElementById('clock');
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Indian/Antananarivo' });
  const tickClock = () => (clock.textContent = fmt.format(new Date()));
  tickClock();
  setInterval(tickClock, 15000);
}

document.fonts?.ready.then(() => placePills(false));
placePills(false);
