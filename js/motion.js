// Scroll choreography with GSAP and Lenis: the loader, the hero entrance, heading reveals,
// paint thrown into Skills and Education, the skills bento rising, experience told sideways, the education line drawing
// itself, the projects carousel rising, the contact cards.
(() => {
  const root = document.documentElement;
  const ready = window.gsap && window.ScrollTrigger && window.SplitText;
  if (!ready || !root.classList.contains('js-anim')) {
    root.classList.remove('js-anim', 'is-loading');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'expo.out', duration: 1 });
  root.classList.add('motion-ready');

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (window.Lenis && !/[?&]lenis=0/.test(location.search)) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -96 } });
    lenis.on('scroll', ScrollTrigger.update);
    window.__lenis = lenis; // the blog reader pauses it while an article is open
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  // ---------- Loader: the logo painted with a brush, stroke by stroke, following the load ----------
  const count = document.getElementById('loaderCount');
  const paint = document.querySelector('.loader-paint');
  const NS = 'http://www.w3.org/2000/svg';

  // six brush strokes that trace the logo's four pieces, in the order a hand would paint them
  // (logo units: [from], [to], width)
  const STROKES = [
    [[154, 316], [154, 140], 34],
    [[146, 132], [207, 168], 22],
    [[201, 233], [344, 148], 38],
    [[331, 311], [331, 207], 32],
    [[201, 302], [286, 251], 38],
    [[214, 294], [214, 345], 33],
  ];
  const GREENS = ['#3fb36a', '#36a862', '#46bd72', '#2f9e5a', '#3fb36a'];
  let s = 31;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const line = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  const add = (d, width, colour, opacity) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('stroke', colour);
    p.setAttribute('stroke-width', width.toFixed(2));
    p.setAttribute('opacity', opacity.toFixed(2));
    paint.appendChild(p);
    return p;
  };

  const strokeGroups = STROKES.map(([a, b, w]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    const d = [dx / len, dy / len];
    const n = [-d[1], d[0]];
    const parts = [];
    // the body of the stroke
    const core = add(line([[a[0] + d[0] * len * 0.04, a[1] + d[1] * len * 0.04], [a[0] + d[0] * len * 0.94, a[1] + d[1] * len * 0.94]]), w * 0.7, '#3fb36a', 1);
    core.style.strokeLinecap = 'butt';
    parts.push(core);
    // bristles: thin lines across the width, a little wobble, some running dry before the end
    const B = 16;
    for (let i = 0; i < B; i++) {
      const o = (i / (B - 1) - 0.5) * w;
      // ragged start and end: each bristle touches down and lifts off at its own point
      const start = rnd() * 0.07;
      const end = rnd() < 0.3 ? 0.72 + rnd() * 0.2 : 0.9 + rnd() * 0.1;
      const pts = [];
      for (let k = 0; k <= 12; k++) {
        const t = start + (k / 12) * (end - start);
        const swell = 0.82 + 0.18 * Math.sin(Math.PI * t); // the brush presses harder mid-stroke
        const off = o * swell + (rnd() - 0.5) * 1.4;
        pts.push([a[0] + d[0] * len * t + n[0] * off, a[1] + d[1] * len * t + n[1] * off]);
      }
      const bristle = add(line(pts), (w / B) * (1.4 + rnd() * 1.1), GREENS[i % GREENS.length], 0.6 + rnd() * 0.35);
      bristle.style.strokeLinecap = 'butt';
      parts.push(bristle);
    }
    parts.forEach((p) => {
      const l = p.getTotalLength();
      p.style.strokeDasharray = l;
      p.style.strokeDashoffset = l;
    });
    return parts;
  });

  // the painting as a paused timeline: the load progress scrubs it, stroke after stroke
  const pour = gsap.timeline({ paused: true });
  strokeGroups.forEach((parts, i) => {
    pour.to(parts, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: { amount: 0.25, from: 'random' } }, i * 0.85);
  });
  // then the name, written beside the logo: the outline first, the ink filling in behind it
  pour
    .to('.loader-sign text', { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut', stagger: 0.6 }, 4.4)
    .to('.loader-sign text', { fillOpacity: 1, duration: 0.7, ease: 'power1.out', stagger: 0.4 }, 5.6);

  const images = [...document.images].filter((img) => img.loading !== 'lazy');
  const tasks = [document.fonts.ready, ...images.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })))];
  let done = 0;
  const progress = { v: 0 };
  const shown = { v: 0 };
  tasks.forEach((p) => p.then(() => { done++; progress.v = done / tasks.length; }));

  const show = (v) => {
    v = Math.min(1, v);
    count.textContent = Math.round(v * 100);
    pour.progress(v);
  };
  const minTime = new Promise((r) => setTimeout(r, 3000));
  const maxTime = new Promise((r) => setTimeout(r, 4500));
  const ticker = () => {
    // never faster than the brush: at most ~1/3.2 s of the painting per second
    shown.v += Math.min((Math.max(progress.v, shown.v) - shown.v) * 0.05 + 0.002, 0.0055);
    show(shown.v);
  };
  gsap.ticker.add(ticker);

  Promise.race([Promise.all([Promise.all(tasks), minTime]), maxTime]).then(() => {
    gsap.ticker.remove(ticker);
    gsap
      .timeline()
      .fromTo(shown, { v: Math.min(1, shown.v) }, { v: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => show(shown.v) })
      .to('.loader-stage', { scale: 1.04, duration: 0.5, ease: 'power2.out' }, '+=0.35')
      .to('.loader-stage, .loader-foot', { autoAlpha: 0, y: -20, duration: 0.5, ease: 'power3.in' }, '+=0.3')
      .to('#loader', { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut' }, '-=0.15')
      .add(() => {
        heroEntrance();
        lenis?.start();
      }, '<0.15')
      .add(() => root.classList.remove('is-loading'));
  });

  // ---------- Hero ----------
  function heroEntrance() {
    const title = SplitText.create('.hero-title', { type: 'words', mask: 'words' });
    const tl = gsap.timeline();

    // the drip painting paints itself: lines poured one after another, then pools and splatter
    const lines = gsap.utils.toArray('.art-pollock .art-line');
    lines.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    tl.to(lines, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: { amount: 1, from: 'random' } }, 0.1)
      .from('.art-pollock .art-pool', { scale: 0, transformOrigin: '50% 50%', duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.2)
      .from('.art-pollock .art-dot', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)', stagger: { amount: 0.9, from: 'random' } }, 0.7);

    tl.fromTo('.nav-bar', { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0, duration: 1 }, 0)
      .set('.hero-copy > *', { autoAlpha: 1 }, 0)
      .from('.hero-copy .status', { autoAlpha: 0, y: 16, duration: 0.9 }, 0.05)
      .from(title.words, { yPercent: 115, duration: 1.2, stagger: 0.045 }, 0.1)
      .from('.hero-lead, .hero-actions, .hero-stats', { autoAlpha: 0, y: 22, duration: 1, stagger: 0.08 }, 0.45)
      .set('.hero-visual', { autoAlpha: 1 }, 0)
      .from('.hero-portrait img', { yPercent: 18, autoAlpha: 0, duration: 1.4 }, 0.05);

    document.querySelectorAll('[data-count]').forEach((el) => {
      const c = { v: 0 };
      tl.to(c, { v: Number(el.dataset.count), duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(c.v)) }, 0.6);
    });
  }

  // ---------- Headings rise word by word ----------
  gsap.utils.toArray('.section-title, .contact-title').forEach((h) => {
    SplitText.create(h, {
      type: 'words',
      mask: 'words',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.words, { yPercent: 115, duration: 1.2, stagger: 0.05, scrollTrigger: { trigger: h, start: 'top 88%', once: true } }),
    });
  });
  gsap.utils.toArray('.eyebrow, .section-sub').forEach((el) =>
    gsap.from(el, { autoAlpha: 0, y: 14, duration: 1, scrollTrigger: { trigger: el, start: 'top 94%', once: true } })
  );

  // ---------- A paint splash thrown into Skills, watercolour into Education ----------
  gsap.utils.toArray('.section-splash').forEach((wrap) => {
    const img = wrap.querySelector('.art-img');
    const thrown = wrap.classList.contains('section-splash-left');
    const trigger = { trigger: wrap.parentElement, start: 'top 72%', once: true };
    if (thrown) {
      // the paint flies in from the left, lands, and splats out
      gsap.timeline({ scrollTrigger: trigger })
        .from(img, { x: '-40%', scale: 0.12, rotate: -25, autoAlpha: 0, transformOrigin: '35% 40%', duration: 0.45, ease: 'power2.in' })
        .to(img, { scaleX: 1.08, scaleY: 0.94, duration: 0.12, ease: 'power1.out' })
        .to(img, { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    } else {
      // the watercolour washes bleed out one after another, then the grain settles
      gsap.timeline({ scrollTrigger: trigger })
        .from(wrap.querySelectorAll('.wc-wash'), { scale: 0.35, autoAlpha: 0, transformOrigin: '50% 50%', duration: 1.8, ease: 'expo.out', stagger: 0.14 })
        .from(wrap.querySelectorAll('.wc-bloom'), { scale: 0.2, autoAlpha: 0, transformOrigin: '50% 50%', duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.5)
        .from(wrap.querySelector('.wc-grain'), { autoAlpha: 0, duration: 1.2 }, 0.9);
    }
    // a slow drift while the section scrolls by, for depth
    gsap.to(wrap, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: wrap.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // ---------- Skills ----------
  gsap.from('.skills-bento > .card', {
    y: 60,
    autoAlpha: 0,
    duration: 1.2,
    stagger: 0.08,
    clearProps: 'transform',
    scrollTrigger: { trigger: '.skills-bento', start: 'top 85%', once: true },
  });
  gsap.from('.meter i', { scaleX: 0, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.skill-lang', start: 'top 90%', once: true } });

  // ---------- Experience: pinned on wide screens, the cards travel sideways ----------
  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px)', () => {
    const section = document.querySelector('.experience');
    const track = document.querySelector('.exp-track');
    const fill = document.querySelector('.exp-line-fill');
    section.classList.add('is-story');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.exp-stage',
        start: 'top top',
        end: () => `+=${distance() + window.innerHeight * 0.3}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    tl.to(track, { x: () => -distance(), ease: 'none' }, 0).fromTo(fill, { scaleX: 0.08 }, { scaleX: 1, ease: 'none' }, 0);

    // each card leans in as it nears the centre
    gsap.utils.toArray('.exp-card').forEach((card) => {
      gsap.fromTo(
        card,
        { rotateY: -14, scale: 0.92, transformPerspective: 1200 },
        {
          rotateY: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tl, start: 'left 95%', end: 'left 45%', scrub: true },
        }
      );
    });
    return () => section.classList.remove('is-story');
  });
  mm.add('(max-width: 960px)', () => {
    gsap.from('.exp-card', { autoAlpha: 0, x: 60, duration: 1, stagger: 0.08, scrollTrigger: { trigger: '.exp-track', start: 'top 85%', once: true } });
  });

  // ---------- Education: the line draws, the steps rise in turn ----------
  const edu = document.querySelector('.edu');
  if (edu) {
    gsap.fromTo(edu, { '--edu-line': '0%' }, { '--edu-line': '100%', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: edu, start: 'top 80%', once: true } });
    gsap.from('.edu-card', { autoAlpha: 0, y: 50, duration: 1.1, stagger: 0.18, scrollTrigger: { trigger: edu, start: 'top 80%', once: true } });
    gsap.from('.edu-dot', { scale: 0, duration: 0.8, stagger: 0.18, delay: 0.3, ease: 'back.out(3)', scrollTrigger: { trigger: edu, start: 'top 80%', once: true } });
  }

  // ---------- Projects: the cards fan in ----------
  gsap.from('.carousel', { autoAlpha: 0, y: 80, scale: 0.94, duration: 1.4, scrollTrigger: { trigger: '.carousel', start: 'top 85%', once: true }, clearProps: 'transform' });
  gsap.from('.carousel-bar', { autoAlpha: 0, y: 20, duration: 1, delay: 0.3, scrollTrigger: { trigger: '.carousel', start: 'top 85%', once: true } });

  // ---------- Blog: the posts rise, their covers settle from a slight zoom ----------
  const posts = gsap.utils.toArray('.blog-bento > .post');
  gsap.set(posts, { autoAlpha: 0, y: 60 });
  ScrollTrigger.batch(posts, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12, overwrite: true, clearProps: 'transform' });
      gsap.from(batch.map((p) => p.querySelector('.post-media img')), { scale: 1.18, duration: 1.6, stagger: 0.12, clearProps: 'transform' });
    },
  });

  // ---------- Contact ----------
  const contactCards = gsap.utils.toArray('.contact-bento > .card');
  gsap.set(contactCards, { autoAlpha: 0, y: 50, scale: 0.97 });
  ScrollTrigger.batch(contactCards, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.08, overwrite: true, clearProps: 'transform' }),
  });

  // ---------- Progress, and a nav that steps aside on the way down ----------
  gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  const nav = document.getElementById('siteNav');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      if (document.body.classList.contains('menu-open')) return;
      nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > window.innerHeight * 0.8);
    },
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
