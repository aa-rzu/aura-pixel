/* =============================================
   AURAPIXEL — FAQ Accordion Module
   ============================================= */

(function () {
  'use strict';

  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.setAttribute('aria-expanded', 'false');
      const answerId = 'faq-answer-' + Math.random().toString(36).slice(2, 9);
      answer.id = answerId;
      question.setAttribute('aria-controls', answerId);

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard support
      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
