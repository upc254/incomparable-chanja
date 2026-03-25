/**
 * AFROOTIC NUTRITION — Premium Animations JS
 * Particles, scroll reveals, stagger effects, counter animation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. ADD STATS BAR after hero section
  ============================================================ */
  const statsBarHTML = `
    <section class="stats-bar" id="stats">
      <div class="stats-inner">
        <div class="stat-item anim-scale">
          <span class="stat-number" data-target="11">0</span>
          <span class="stat-label">Premium Products</span>
        </div>
        <div class="stat-item anim-scale">
          <span class="stat-number" data-target="3">0</span>
          <span class="stat-label">Pickup Locations</span>
        </div>
        <div class="stat-item anim-scale">
          <span class="stat-number" data-target="500" data-suffix="+">0</span>
          <span class="stat-label">Happy Customers</span>
        </div>
        <div class="stat-item anim-scale">
          <span class="stat-number" data-target="100" data-suffix="%">0</span>
          <span class="stat-label">Natural Ingredients</span>
        </div>
      </div>
    </section>
  `;

  const collectionIntro = document.getElementById('collection');
  if (collectionIntro) {
    collectionIntro.insertAdjacentHTML('beforebegin', statsBarHTML);
  }

  /* ============================================================
     2. ADD SPARKLE ELEMENTS to CTA banner
  ============================================================ */
  const ctaBanner = document.querySelector('.cta-banner');
  if (ctaBanner) {
    const sparks = Array.from({length: 5}, (_, i) => {
      const s = document.createElement('div');
      s.className = 'cta-banner-spark';
      return s;
    });
    sparks.forEach(s => ctaBanner.appendChild(s));
  }

  /* ============================================================
     3. HERO PARTICLES
  ============================================================ */
  const hero = document.querySelector('.hero');
  if (hero) {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'hero-particles';
    hero.insertBefore(particleContainer, hero.firstChild);

    const colors = ['#52b788', '#b7e4c7', '#d8f3dc', '#c8a882'];
    const count = window.innerWidth > 768 ? 18 : 8;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 12 + 10}s;
        animation-delay: ${Math.random() * 8}s;
        filter: blur(${Math.random() * 2}px);
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ============================================================
     4. ADD ANIMATION CLASSES to sections
  ============================================================ */

  // Products grid — stagger
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid) productsGrid.classList.add('anim-stagger');

  // Why grid
  const whyGrid = document.querySelector('.why-grid');
  if (whyGrid) whyGrid.classList.add('anim-stagger');

  // Blog grid
  const blogGrid = document.querySelector('.blog-grid');
  if (blogGrid) blogGrid.classList.add('anim-stagger');

  // Testimonials grid
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  if (testimonialsGrid) testimonialsGrid.classList.add('anim-stagger');

  // Pickup grid
  const pickupGrid = document.querySelector('.pickup-grid');
  if (pickupGrid) pickupGrid.classList.add('anim-stagger');

  // Section headings
  document.querySelectorAll('.section-tag').forEach(el => el.classList.add('anim-reveal'));
  document.querySelectorAll('.section-title').forEach(el => el.classList.add('anim-reveal'));
  document.querySelectorAll('.section-sub').forEach(el => el.classList.add('anim-reveal'));

  // Why text
  const whyText = document.querySelector('.why-text');
  if (whyText) whyText.classList.add('anim-left');

  // Stats
  document.querySelectorAll('.stat-item').forEach(el => el.classList.add('anim-scale'));

  // Payment note
  const paymentNote = document.querySelector('.payment-note');
  if (paymentNote) paymentNote.classList.add('anim-reveal');

  // FAQ items
  document.querySelectorAll('.faq-item').forEach(el => el.classList.add('anim-reveal'));

  // CTA banner inner
  const ctaBannerInner = document.querySelector('.cta-banner-inner');
  if (ctaBannerInner) ctaBannerInner.classList.add('anim-reveal');

  /* ============================================================
     5. INTERSECTION OBSERVER for all anim classes
  ============================================================ */
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');

        // Trigger counter animation when stats come into view
        if (entry.target.classList.contains('stat-item') || entry.target.closest('.stats-bar')) {
          entry.target.querySelectorAll('[data-target]').forEach(counter => {
            animateCounter(counter);
          });
        }

        // Unobserve after animation (except stagger parents need to stay)
        if (!entry.target.classList.contains('anim-stagger')) {
          animObserver.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe stagger containers
  document.querySelectorAll('.anim-stagger').forEach(el => animObserver.observe(el));

  // Observe individual reveal elements
  document.querySelectorAll('.anim-reveal, .anim-left, .anim-right, .anim-scale').forEach(el => {
    animObserver.observe(el);
  });

  // Observe stats bar
  const statsBar = document.getElementById('stats');
  if (statsBar) animObserver.observe(statsBar);

  /* ============================================================
     6. COUNTER ANIMATION
  ============================================================ */
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* ============================================================
     7. PRODUCT CARD — tilt effect on mouse move
  ============================================================ */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * 4;
        const rotY =  dx * 4;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  }

  /* ============================================================
     8. TESTIMONIAL — auto scroll carousel (mobile only)
  ============================================================ */
  const testimonialsGridEl = document.querySelector('.testimonials-grid');
  if (testimonialsGridEl && window.innerWidth <= 600) {
    // Allow horizontal scroll on mobile testimonials
    testimonialsGridEl.style.overflowX = 'auto';
    testimonialsGridEl.style.display = 'flex';
    testimonialsGridEl.style.flexWrap = 'nowrap';
    testimonialsGridEl.style.gap = '16px';
    testimonialsGridEl.style.scrollSnapType = 'x mandatory';
    testimonialsGridEl.style.paddingBottom = '12px';

    testimonialsGridEl.querySelectorAll('.testimonial-card').forEach(card => {
      card.style.minWidth = '85vw';
      card.style.scrollSnapAlign = 'start';
      card.style.flexShrink = '0';
    });
  }

  /* ============================================================
     9. SMOOTH PARALLAX on hero shapes
  ============================================================ */
  const shapes = document.querySelectorAll('.shape');
  if (shapes.length && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shapes.forEach((shape, i) => {
        const speed = (i + 1) * 0.15;
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  /* ============================================================
     10. PAGE TRANSITION — smooth section highlight on nav click
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(id);
      if (!target) return;

      // Brief flash highlight
      target.style.transition = 'background-color 0.5s ease';
      target.style.backgroundColor = 'rgba(82, 183, 136, 0.04)';
      setTimeout(() => {
        target.style.backgroundColor = '';
      }, 1000);
    });
  });

  /* ============================================================
     11. PRODUCT IMAGE — magnify cursor on hover
  ============================================================ */
  document.querySelectorAll('.product-image-wrap').forEach(wrap => {
    wrap.style.cursor = 'zoom-in';

    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('.product-photo');
      if (!img) return;

      // Create lightbox
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        cursor: zoom-out; animation: fadeInScale 0.3s ease both;
      `;

      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.alt = img.alt;
      imgClone.style.cssText = `
        max-width: 90vw; max-height: 85vh;
        border-radius: 16px;
        box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        animation: popIn 0.35s ease both;
        object-fit: contain;
      `;

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = `
        position: absolute; top: 20px; right: 24px;
        width: 44px; height: 44px; border-radius: 50%;
        background: rgba(255,255,255,0.15); color: white;
        font-size: 1.6rem; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
      `;
      closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(255,255,255,0.3)');
      closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(255,255,255,0.15)');

      overlay.appendChild(imgClone);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const close = () => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.25s ease';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
        }, 250);
      };

      overlay.addEventListener('click', close);
      closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });
    });
  });

  /* ============================================================
     12. LOGO IMAGE — subtle glint animation
  ============================================================ */
  const logoImgs = document.querySelectorAll('.logo-img');
  logoImgs.forEach(img => {
    setInterval(() => {
      img.style.filter = 'brightness(1.15) saturate(1.2)';
      setTimeout(() => img.style.filter = '', 600);
    }, 5000);
  });

});
