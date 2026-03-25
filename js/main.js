/**
 * AFROOTIC NUTRITION — Main JavaScript
 * Features: Sticky Nav, Mobile Menu, FAQ Accordion,
 *           Product Filter, Scroll Reveal, WhatsApp Float
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. STICKY NAVIGATION — add .scrolled class on scroll
  ============================================================ */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load


  /* ============================================================
     2. MOBILE HAMBURGER MENU
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const openMenu = () => {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ============================================================
     3. SMOOTH SCROLLING for anchor links (with offset for nav)
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height') || '72'
      );
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ============================================================
     4. FAQ ACCORDION
  ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(faq => {
        faq.classList.remove('open');
        const a = faq.querySelector('.faq-answer');
        if (a) a.classList.remove('open');
        const q = faq.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ============================================================
     5. PRODUCT CATEGORY FILTER
  ============================================================ */
  const pills = document.querySelectorAll('.pill');
  const productCards = document.querySelectorAll('.product-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Trigger re-animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.opacity = '';
              card.style.transform = '';
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
            }, 10);
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ============================================================
     6. SCROLL REVEAL — Intersection Observer
  ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Elements to animate on scroll
  const revealSelectors = [
    '.product-card',
    '.why-card',
    '.blog-card',
    '.testimonial-card',
    '.pickup-card',
    '.faq-item',
    '.hero-content',
    '.hero-visual',
    '.collection-intro .section-tag',
    '.collection-intro .section-title',
    '.collection-intro .section-sub',
    '.why-text',
    '.payment-note',
  ];

  document.querySelectorAll(revealSelectors.join(', ')).forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay for grid items
    if (el.closest('.products-grid, .why-grid, .blog-grid, .testimonials-grid, .pickup-grid')) {
      const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains(el.classList[0]));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${Math.min(idx * 0.08, 0.5)}s`;
    }
    revealObserver.observe(el);
  });


  /* ============================================================
     7. FLOATING WHATSAPP BUTTON — hide/show on scroll direction
  ============================================================ */
  const waFloat = document.getElementById('waFloat');
  let lastScrollY = window.scrollY;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);

    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    // Hide when scrolling down fast, show when scrolling up or stopped
    if (scrollingDown && currentScrollY > 400) {
      waFloat && waFloat.classList.add('wa-hidden');
    } else {
      waFloat && waFloat.classList.remove('wa-hidden');
    }

    lastScrollY = currentScrollY;

    // Always show after scroll stops
    scrollTimeout = setTimeout(() => {
      waFloat && waFloat.classList.remove('wa-hidden');
    }, 800);
  }, { passive: true });


  /* ============================================================
     8. ACTIVE NAV LINK HIGHLIGHTING — based on scroll position
  ============================================================ */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active-nav'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active-nav');
      }
    });
  }, {
    rootMargin: '-40% 0px -50% 0px',
  });

  sections.forEach(section => activeNavObserver.observe(section));


  /* ============================================================
     9. SMOOTH PAGE LOAD — fade in body
  ============================================================ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    document.body.style.opacity = '1';
  }


  /* ============================================================
     10. YEAR — Auto update footer copyright year
  ============================================================ */
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace('2025', currentYear);
  }

});


/* ============================================================
   HELPER: Add .wa-hidden style dynamically
============================================================ */
const waStyle = document.createElement('style');
waStyle.textContent = `
  .wa-hidden {
    opacity: 0 !important;
    transform: scale(0.8) !important;
    pointer-events: none !important;
  }
  .whatsapp-float {
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease !important;
  }
  .nav-links a.active-nav {
    color: var(--green-main) !important;
    background: var(--green-mist) !important;
  }
`;
document.head.appendChild(waStyle);
