/* =============================================
   AURAPIXEL — Animations & Dynamic Content
   ============================================= */

(function () {
  'use strict';

  // ── Check reduced motion preference ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Intersection Observer for scroll reveals ──
  function initScrollReveals() {
    if (prefersReducedMotion) {
      // Make everything visible immediately
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Portfolio Rendering ──
  function renderPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    fetch('./data/portfolio.json')
      .then(function (res) { return res.json(); })
      .then(function (projects) {
        grid.innerHTML = projects.map(function (project) {
          return [
            '<article class="portfolio-card reveal-scale" aria-label="' + project.category + ' - ' + project.tag + '">',
            '  <div class="portfolio-visual" style="background: linear-gradient(135deg, ' + project.color + '18 0%, ' + project.color + '08 100%);">',
            '    <div class="portfolio-visual-lines"></div>',
            '    <div class="portfolio-visual-icon" role="img" aria-label="' + project.category + '">' + project.icon + '</div>',
            '  </div>',
            '  <div class="portfolio-card-body">',
            '    <span class="portfolio-tag">' + project.tag + '</span>',
            '    <h3>' + project.title + '</h3>',
            '    <p class="category">' + project.category + '</p>',
            '    <p>' + project.description + '</p>',
            '    <div class="portfolio-tech-tags" aria-label="Tags">',
            project.tags.map(function (tag) {
              return '<span class="tech-tag">' + tag + '</span>';
            }).join(''),
            '    </div>',
            '  </div>',
            '</article>',
          ].join('\n');
        }).join('\n');

        // Re-observe newly rendered cards
        initScrollReveals();
      })
      .catch(function () {
        grid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Portfolio loading failed. Please refresh.</p>';
      });
  }

  // ── Hero canvas particle effect ──
  function initHeroCanvas() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.5 - 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < 60; i++) {
        const p = createParticle();
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p, i) {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, ' + alpha + ')';
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          particles[i] = createParticle();
          particles[i].y = canvas.height + 10;
        }
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    const resizeObserver = new ResizeObserver(function () {
      resize();
      initParticles();
    });
    resizeObserver.observe(canvas);

    // Pause when not visible
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }

  // ── Lazy load images ──
  function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imgObserver.unobserve(img);
          }
        });
      });
      images.forEach(function (img) { imgObserver.observe(img); });
    }
  }

  // ── Init all ──
  function init() {
    initScrollReveals();
    renderPortfolio();
    initHeroCanvas();
    initLazyImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
