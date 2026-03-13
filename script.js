/* ═══════════════════════════════════════════
   script.js  –  Happy Birthday Airin Nirinda Putri
   Berisi:
     1. Star canvas (hero background)
     2. Scroll reveal observer
     3. Autoplay audio fallback
   ═══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. STAR CANVAS (hero section)
   Menggambar titik-titik bintang bergerak
   di background section hero
   ────────────────────────────────────────── */
(function initStarCanvas() {
  const canvas  = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let W, H, stars;

  /* Jumlah bintang – naikkan angka untuk lebih banyak */
  const STAR_COUNT = 160;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.5 + 0.2,
    }));
  }

  let tick = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    tick += 0.01;

    stars.forEach(s => {
      const alpha = s.baseAlpha + Math.sin(tick * (s.twinkleSpeed / 0.01) + s.twinkleOffset) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 210, 255, ${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();

      /* Gerakkan bintang perlahan ke bawah */
      s.y += s.speed;
      if (s.y > H + 2) {
        s.y = -2;
        s.x = Math.random() * W;
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ──────────────────────────────────────────
   2. SCROLL REVEAL
   Mengamati elemen dengan class .reveal dan
   .reveal-stagger, lalu tambahkan .visible
   saat masuk viewport
   ────────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Hentikan pengamatan setelah terlihat (animasi hanya sekali) */
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,  /* Persentase elemen yg harus terlihat sebelum animasi */
      rootMargin: '0px 0px -40px 0px',
    }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────────
   3. AUTOPLAY AUDIO FALLBACK
   Browser modern memblokir autoplay sebelum
   ada interaksi pengguna. Script ini mencoba
   memutar musik setelah pengguna pertama kali
   menyentuh / mengklik layar.

   UNTUK MENGGANTI LAGU:
   Ganti file music/music.mp3 dengan file baru.
   Jika format berbeda (ogg/wav), tambahkan
   <source> di dalam <audio> di index.html.
   ────────────────────────────────────────── */
(function initAudio() {
  const audio = document.getElementById('bgMusic');
  if (!audio) return;

  /* Coba autoplay langsung */
  const autoplayPromise = audio.play();

  if (autoplayPromise !== undefined) {
    autoplayPromise.catch(() => {
      /* Autoplay diblokir browser – tunggu interaksi pertama */
      const unlock = () => {
        audio.play().catch(() => {});
        document.removeEventListener('click',      unlock);
        document.removeEventListener('touchstart', unlock);
        document.removeEventListener('keydown',    unlock);
        document.removeEventListener('scroll',     unlock);
      };

      document.addEventListener('click',      unlock, { once: true });
      document.addEventListener('touchstart', unlock, { once: true });
      document.addEventListener('keydown',    unlock, { once: true });
      document.addEventListener('scroll',     unlock, { once: true, passive: true });
    });
  }
})();
