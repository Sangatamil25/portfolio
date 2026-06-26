// ── LOADER ──
const loaderFill = document.getElementById('loader-fill');
let prog = 0;
const loaderInt = setInterval(() => {
  prog += Math.random() * 18;
  if (prog >= 100) {
    prog = 100;
    clearInterval(loaderInt);
    setTimeout(() => {
      document.getElementById('loader').classList.add('hide');
      animateBars();
    }, 300);
  }
  loaderFill.style.width = prog + '%';
}, 100);

// ── CURSOR ──
const c1 = document.getElementById('cur1');
const c2 = document.getElementById('cur2');
const c3 = document.getElementById('cur3');
let mx = -999, my = -999, c2x = -999, c2y = -999, c3x = -999, c3y = -999;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function updateCursor() {
  c1.style.left = mx + 'px';
  c1.style.top = my + 'px';
  c2x += (mx - c2x) * .15;
  c2y += (my - c2y) * .15;
  c2.style.left = c2x + 'px';
  c2.style.top = c2y + 'px';
  c3x += (mx - c3x) * .07;
  c3y += (my - c3y) * .07;
  c3.style.left = c3x + 'px';
  c3.style.top = c3y + 'px';
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Cursor hover expand
document.querySelectorAll('a,button,.pcard,.stat-c,.aw-card,.cert-card,.c-card,.tcard').forEach(el => {
  el.addEventListener('mouseenter', () => {
    c2.style.width = '60px';
    c2.style.height = '60px';
    c2.style.borderColor = 'var(--c3)';
    c1.style.background = 'var(--c3)';
    c1.style.boxShadow = '0 0 20px var(--c3)';
  });
  el.addEventListener('mouseleave', () => {
    c2.style.width = '44px';
    c2.style.height = '44px';
    c2.style.borderColor = 'var(--c1)';
    c1.style.background = 'var(--c1)';
    c1.style.boxShadow = '0 0 15px var(--c1),0 0 30px var(--c1)';
  });
});

// Click sparks
document.addEventListener('click', e => {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'cur-spark';
    const angle = (Math.PI * 2 / 8) * i;
    const dist = 30 + Math.random() * 30;
    s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.style.animation = 'sparkle .6s ease forwards';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
});

// ── CANVAS ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * 3000,
  y: Math.random() * 3000,
  vx: (Math.random() - .5) * .5,
  vy: (Math.random() - .5) * .5,
  r: Math.random() * 2 + .5,
  color: ['#00f5ff', '#bf00ff', '#ff0090', '#00ff88'][Math.floor(Math.random() * 4)],
  a: Math.random() * .5 + .1
}));

const stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  r: Math.random() * 1.2 + .2,
  o: Math.random() * .5 + .1,
  s: Math.random() * .15 + .02
}));

let scrollY2 = 0;
window.addEventListener('scroll', () => scrollY2 = window.scrollY);

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Stars
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, (s.y + scrollY2 * s.s) % H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160,200,255,${s.o})`;
    ctx.fill();
  });

  // Particles + connections
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.a;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${(1 - d / 110) * .1})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }

  // Cursor glow on canvas
  if (mx > 0) {
    const g = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
    g.addColorStop(0, 'rgba(0,245,255,.04)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  requestAnimationFrame(draw);
}
draw();

// ── TYPEWRITER ──
const phrases = [
  'Java Full Stack Engineer',
  'Spring Boot Microservices Architect',
  'React + Java Developer',
  'Building APIs & UIs from scratch',
  'Enterprise Java EE Developer'
];
let pi = 0, ci = 0, del = false;
const tw = document.getElementById('typewriter');

function type() {
  const p = phrases[pi];
  if (!del) {
    tw.innerHTML = p.slice(0, ci++) + '<span style="animation:blink 1s infinite;display:inline">|</span>';
    if (ci > p.length) { del = true; setTimeout(type, 1500); return; }
  } else {
    tw.innerHTML = p.slice(0, ci--) + '<span style="animation:blink 1s infinite;display:inline">|</span>';
    if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; ci = 0; setTimeout(type, 400); return; }
  }
  setTimeout(type, del ? 35 : 65);
}
type();

// ── SCROLL PROGRESS ──
const prog2 = document.getElementById('scroll-prog');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog2.style.width = pct + '%';
});

// ── SCROLL REVEAL ──
const rvEls = document.querySelectorAll('.rv,.rv-l,.rv-r');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), 80);
    }
  });
}, { threshold: .1 });
rvEls.forEach(e => io.observe(e));

// ── COUNTER ANIMATION ──
function animateBars() {}

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target.querySelector('.stat-n');
      if (!el || el.dataset.done) return;
      el.dataset.done = '1';
      const target = +el.dataset.target;
      let cur = 0;
      const step = target / 50;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = Math.round(cur) + (target >= 2 ? '+' : '');
      }, 40);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('.stat-c').forEach(c => counterIO.observe(c));

// ── SKILL BARS ──
function animateSkillBars(container) {
  container.querySelectorAll('.skill-fill').forEach(b => {
    b.style.width = '0';
    setTimeout(() => b.style.width = b.dataset.w + '%', 100);
  });
}

const skillIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) animateSkillBars(e.target); });
}, { threshold: .2 });
document.querySelectorAll('.skill-group').forEach(g => skillIO.observe(g));

// ── SKILL FILTER ──
document.querySelectorAll('.sf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.skill-group').forEach(g => g.classList.remove('active'));
    const target = document.getElementById('cat-' + cat);
    if (target) { target.classList.add('active'); animateSkillBars(target); }
  });
});

// ── PROJECT FILTER ──
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.pcard').forEach(c => {
      const tags = c.dataset.tags || '';
      c.style.display = (f === 'all' || tags.includes(f)) ? '' : 'none';
    });
  });
});

// ── 3D TILT ──
document.querySelectorAll('.pcard,.stat-c,.aw-card,.cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-10px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// ── HERO NAME GLITCH ON HOVER ──
const heroName = document.getElementById('hero-name');
let glitchInt;

heroName.addEventListener('mouseenter', () => {
  let cnt = 0;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  const orig = 'SANGATAMIL T';
  glitchInt = setInterval(() => {
    cnt++;
    if (cnt > 20) { heroName.textContent = orig; clearInterval(glitchInt); return; }
    heroName.textContent = orig.split('').map(c => (c === ' ' ? ' ' : Math.random() > .6 ? chars[Math.floor(Math.random() * chars.length)] : c)).join('');
  }, 40);
});

heroName.addEventListener('mouseleave', () => {
  clearInterval(glitchInt);
  document.getElementById('hero-name').textContent = 'SANGATAMIL T';
});

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.btn-p,.btn-s,.nav-hire').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .25;
    const y = (e.clientY - r.top - r.height / 2) * .25;
    btn.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ── ACTIVE NAV HIGHLIGHT ──
const sections2 = document.querySelectorAll('section[id]');
const navLinks2 = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections2.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
  navLinks2.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--c1)' : '';
  });
});
