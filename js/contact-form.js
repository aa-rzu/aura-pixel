/* =============================================
   AURAPIXEL — Contact Form Module
   ============================================= */

(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const successEl = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('[type="submit"]');

    // ── Validation rules ──
    const rules = {
      name: {
        required: true,
        minLength: 2,
        message: 'Please enter your full name (at least 2 characters).',
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address.',
      },
      business: {
        required: true,
        minLength: 2,
        message: 'Please enter your business name.',
      },
      details: {
        required: true,
        minLength: 20,
        message: 'Please describe your project in at least 20 characters.',
      },
    };

    // ── Validate single field ──
    function validateField(fieldName) {
      const field = form.querySelector('[name="' + fieldName + '"]');
      if (!field) return true;

      const group = field.closest('.form-group');
      const errorEl = group ? group.querySelector('.form-error-msg') : null;
      const rule = rules[fieldName];
      if (!rule) return true;

      let valid = true;
      const val = field.value.trim();

      if (rule.required && val.length === 0) {
        valid = false;
      } else if (rule.minLength && val.length < rule.minLength) {
        valid = false;
      } else if (rule.pattern && !rule.pattern.test(val)) {
        valid = false;
      }

      if (group) {
        group.classList.toggle('has-error', !valid);
      }
      if (errorEl) {
        errorEl.textContent = valid ? '' : rule.message;
      }

      return valid;
    }

    // ── Real-time validation on blur ──
    Object.keys(rules).forEach(function (fieldName) {
      const field = form.querySelector('[name="' + fieldName + '"]');
      if (field) {
        field.addEventListener('blur', function () {
          validateField(fieldName);
        });
        field.addEventListener('input', function () {
          const group = field.closest('.form-group');
          if (group && group.classList.contains('has-error')) {
            validateField(fieldName);
          }
        });
      }
    });

    // ── Form submit ──
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let allValid = true;
      Object.keys(rules).forEach(function (fieldName) {
        if (!validateField(fieldName)) allValid = false;
      });

      if (!allValid) {
        const firstError = form.querySelector('.has-error input, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending…';

      setTimeout(function () {
        form.style.display = 'none';
        if (successEl) {
          successEl.classList.add('visible');
          successEl.focus();
        }

        // Reset after 8 seconds for demo
        setTimeout(function () {
          form.reset();
          form.style.display = '';
          if (successEl) successEl.classList.remove('visible');
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Send Message';
        }, 8000);
      }, 1200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
