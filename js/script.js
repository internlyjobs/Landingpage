/* ════════════════════════════════════════════════
   Internly — Antigravity Animation Engine v2.0
   ════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     1. LOADING SCREEN
  ══════════════════════════════════════════════ */
  function initLoader() {
    const loader = document.querySelector('.loader-screen');
    if (!loader) return;

    window.addEventListener('load', () => {
      // Small delay so the loader feels intentional
      setTimeout(() => {
        loader.classList.add('loaded');
        // Remove from DOM after CSS fade-out completes
        loader.addEventListener('transitionend', () => {
          loader.remove();
        }, { once: true });
        // Fallback removal if transitionend doesn't fire
        setTimeout(() => {
          if (loader.parentNode) loader.remove();
        }, 1500);
      }, 300);
    });
  }

  /* ══════════════════════════════════════════════
     2. ANTIGRAVITY PARTICLE SYSTEM (Enhanced)
  ══════════════════════════════════════════════ */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const COUNT = 35;
    const COLORS = [
      'rgba(74,101,239,0.18)',
      'rgba(162,112,241,0.15)',
      'rgba(74,101,239,0.1)',
      'rgba(232,236,253,0.6)',
      'rgba(162,112,241,0.12)',
    ];

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size   = 6 + Math.random() * 22;          // 6–28 px
      const left   = Math.random() * 100;              // % across viewport
      const delay  = Math.random() * 18;               // stagger start
      const dur    = 10 + Math.random() * 20;          // 10–30 s rise
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)];

      // Add slight variety — some particles are slightly oval
      const isOval   = Math.random() > 0.6;
      const scaleX   = isOval ? (0.6 + Math.random() * 0.4).toFixed(2) : 1;
      const scaleY   = isOval ? (1.1 + Math.random() * 0.4).toFixed(2) : 1;
      const rotation = isOval ? Math.floor(Math.random() * 180) : 0;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        animation-duration: ${dur}s;
        animation-delay: -${delay}s;
        opacity: 0;
        transform: scale(${scaleX}, ${scaleY}) rotate(${rotation}deg);
      `;

      container.appendChild(p);
    }
  }

  /* ══════════════════════════════════════════════
     3. SCROLL-TRIGGERED FADE-IN (rise from below)
  ══════════════════════════════════════════════ */
  function initFadeIn() {
    const items = document.querySelectorAll('.fade-in');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════════════
     4. PROGRESS BAR ANIMATION (passport card)
  ══════════════════════════════════════════════ */
  function initProgressBars() {
    const passportCard = document.querySelector('.passport-card');
    if (!passportCard) return;

    // Store target widths, reset to 0 initially
    const fills = passportCard.querySelectorAll('.progress-fill');
    fills.forEach((f) => {
      f.dataset.target = f.style.width;
      f.style.width = '0';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fills.forEach((f, i) => {
              setTimeout(() => {
                f.style.width = f.dataset.target;
              }, i * 150 + 300);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(passportCard);
  }

  /* ══════════════════════════════════════════════
     5. ALLOCATION BAR ANIMATION
  ══════════════════════════════════════════════ */
  function initAllocBars() {
    const allItems = document.querySelectorAll('.alloc-bar-fill');
    if (!allItems.length) return;

    // Store & reset
    allItems.forEach((b) => {
      b.dataset.target = b.style.width;
      b.style.width = '0';
    });

    const section = document.querySelector('.allocation');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            allItems.forEach((b, i) => {
              setTimeout(() => {
                b.style.width = b.dataset.target;
              }, i * 100 + 200);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
  }

  /* ══════════════════════════════════════════════
     6. NAV SCROLL SHADOW + ENHANCED .scrolled CLASS
  ══════════════════════════════════════════════ */
  function initNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;

          // Original shadow behavior
          if (y > 20) {
            nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.08)';
          } else {
            nav.style.boxShadow = 'none';
          }

          // Enhanced: add .scrolled class past 50px
          if (y > 50) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     7. PARALLAX TILT on passport card
  ══════════════════════════════════════════════ */
  function initTilt() {
    const card = document.querySelector('.passport-card');
    const visual = document.querySelector('.hero-visual');
    if (!card || !visual) return;

    visual.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / rect.width;
      const dy   = (e.clientY - cy) / rect.height;

      // Apply tilt — card fights gravity, tilts opposite to cursor
      card.style.transform = `
        translateY(-18px)
        rotateY(${dx * -12}deg)
        rotateX(${dy * 10}deg)
      `;
    });

    visual.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      setTimeout(() => { card.style.transition = ''; }, 700);
    });
  }

  /* ══════════════════════════════════════════════
     8. COUNTER ANIMATION (hero stats)
  ══════════════════════════════════════════════ */
  function animateCounter(el, target, duration, suffix) {
    let start = null;
    const isFloat = String(target).includes('.');
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = isFloat
        ? (ease * target).toFixed(1)
        : Math.floor(ease * target);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const stats = document.querySelectorAll('.hero-stat-num, .mstat-num');
    // We won't parse Arabic numerals — skip counter for Arabic numbers
    // but animate opacity
    stats.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.3 }
    );
    stats.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════════════
     9. SMOOTH ANCHOR SCROLL
  ══════════════════════════════════════════════ */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = id ? document.getElementById(id) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ══════════════════════════════════════════════
     10. MOBILE HAMBURGER MENU
  ══════════════════════════════════════════════ */
  function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    // Toggle menu
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close when a nav link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  /* ══════════════════════════════════════════════
     11. WAITLIST MODAL
  ══════════════════════════════════════════════ */
  function initModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;

    const modalBody    = overlay.querySelector('.modal-body, .modal-content, .modal');
    const form         = document.getElementById('waitlistForm');
    const successPanel = overlay.querySelector('.modal-success');

    // Open modal — expose globally for onclick attributes
    window.openModal = function () {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    // Close modal
    window.closeModal = function () {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      // Reset after close animation completes
      setTimeout(() => {
        if (form) {
          form.style.display = '';
          form.reset();
        }
        if (successPanel) {
          successPanel.style.display = 'none';
          successPanel.classList.remove('active');
        }
      }, 400);
    };

    // Close on overlay click (not modal body)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        window.closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        window.closeModal();
      }
    });

    // Form submit handler — no backend, just show success
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Smooth transition: hide form, show success
        form.style.opacity = '0';
        form.style.transform = 'translateY(-10px)';
        form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
          form.style.display = 'none';
          if (successPanel) {
            successPanel.style.display = 'flex';
            // Trigger reflow for animation
            void successPanel.offsetWidth;
            successPanel.classList.add('active');
          }
        }, 300);
      });
    }

    // Also wire up any CTA buttons that should open the modal
    document.querySelectorAll('.nav-cta, .btn-primary, .btn-white').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Only intercept if there's a modal to show
        if (overlay) {
          e.preventDefault();
          window.openModal();
        }
      });
    });
  }

  /* ══════════════════════════════════════════════
     12. SCROLL SPY — Highlight active nav link
  ══════════════════════════════════════════════ */
  function initScrollSpy() {
    const sections = document.querySelectorAll('#problem, #solution, #market, #plans');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', // trigger when section is in upper-middle of viewport
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ══════════════════════════════════════════════
     13. BACK TO TOP BUTTON
  ══════════════════════════════════════════════ */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 500) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════════════
     14. HERO PARALLAX ON SCROLL
  ══════════════════════════════════════════════ */
  function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;

          // Only apply parallax while hero is in view
          if (scrollY < heroHeight * 1.5) {
            const offset = scrollY * 0.35;
            hero.style.setProperty('--parallax-offset', `${offset}px`);
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     15. TYPING / PULSE EFFECT on hero badge
  ══════════════════════════════════════════════ */
  function initBadgePulse() {
    const badge = document.querySelector('.hero-badge');
    if (!badge) return;

    // Add a subtle pulse/glow animation class
    badge.classList.add('badge-glow');
  }

  /* ══════════════════════════════════════════════
     16. DONUT CHART SVG STROKE REVEAL
  ══════════════════════════════════════════════ */
  function initDonutReveal() {
    const donutWrap = document.querySelector('.donut-wrap');
    if (!donutWrap) return;

    const circles = donutWrap.querySelectorAll('svg circle[stroke-dasharray]');
    if (!circles.length) return;

    // Store original dasharray values, then hide strokes
    circles.forEach((circle) => {
      const dasharray = circle.getAttribute('stroke-dasharray');
      if (!dasharray) return;

      const parts    = dasharray.split(/[\s,]+/);
      const visible  = parseFloat(parts[0]) || 0;
      const gap      = parseFloat(parts[1]) || 0;
      const total    = visible + gap;

      // Set initial state: fully hidden (dashoffset eats the visible segment)
      circle.dataset.originalDasharray  = dasharray;
      circle.dataset.originalDashoffset = circle.getAttribute('stroke-dashoffset') || '0';
      circle.dataset.visibleLength      = visible;

      // Start with zero visible stroke
      circle.setAttribute('stroke-dasharray', `0 ${total}`);

      // Prepare CSS transition
      circle.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the reveal of each segment
            circles.forEach((circle, i) => {
              setTimeout(() => {
                circle.setAttribute(
                  'stroke-dasharray',
                  circle.dataset.originalDasharray
                );
              }, i * 120 + 200);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(donutWrap);
  }

  /* ══════════════════════════════════════════════
     BOOT — Initialize everything on DOMContentLoaded
  ══════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    // Core (original features preserved)
    initLoader();
    initParticles();
    initFadeIn();
    initProgressBars();
    initAllocBars();
    initNav();
    initTilt();
    initCounters();
    initAnchors();

    // New features
    initHamburger();
    initModal();
    initScrollSpy();
    initBackToTop();
    initHeroParallax();
    initBadgePulse();
    initDonutReveal();
  });
})();
