/* =============================================
   AURAPIXEL — Main JS Entry Point
   ============================================= */

(function () {
  'use strict';

  // ── Smooth Scroll for anchor links ──
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = document.getElementById('navbar')?.offsetHeight || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });

  // ── Year in footer ──
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
