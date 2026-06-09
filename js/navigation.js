/* =============================================
   AURAPIXEL — Navigation Module
   ============================================= */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  // ── Scroll State ──
  function handleScroll() {
    if (!navbar) return;
    const scrolled = window.scrollY > 20;
    navbar.classList.toggle('scrolled', scrolled);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // ── Mobile Menu Toggle ──
  function openMenu() {
    mobileMenu.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });
  }

  // Close on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
      menuBtn.focus();
    }
  });

  // ── Smooth Active Link Highlight ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setActiveLink() {
    const scrollY = window.scrollY;

    sections.forEach(function (section) {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === '#' + id) {
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
})();
