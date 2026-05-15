const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const yearEl = document.getElementById('year');
const languageLinks = document.querySelectorAll('.lang-link');
const languageStorageKey = 'vortexlabs-language';
const heroSection = document.querySelector('.hero');
const heroVortex = document.querySelector('.hero-vortex');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setupScrollReveal = () => {
  if (prefersReducedMotion) {
    return;
  }

  const sections = document.querySelectorAll('main section, .site-footer');
  const revealSelector = [
    '.section-heading',
    '.hero-copy > *',
    '.hero-card',
    '.hero-stats > div',
    '.proof-item',
    '.info-card',
    '.process-step',
    '.showcase-card',
    '.logo-pill',
    '.testimonial-card',
    '.why-item',
    '.pricing-card',
    '.founder-portrait-card',
    '.about-copy > *',
    '.cta-card > *',
    '.footer-grid > div',
    '.footer-bottom > span',
  ].join(', ');

  sections.forEach((section) => {
    section.classList.add('reveal-section');
    const items = section.querySelectorAll(revealSelector);
    items.forEach((item, index) => {
      item.classList.add('reveal-item');
      item.style.setProperty('--reveal-delay', `${Math.min(index * 65, 360)}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
};

const setupMagneticButtons = () => {
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const magneticTargets = document.querySelectorAll('.button');
  magneticTargets.forEach((button) => {
    button.classList.add('is-magnetic');

    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
};

const setupHeroParallax = () => {
  if (!heroSection || !heroVortex || prefersReducedMotion) {
    return;
  }

  let ticking = false;

  const updateParallax = () => {
    const rect = heroSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const offset = Math.max(-1, Math.min(1, rect.top / viewportHeight));
    heroVortex.style.transform = `translateY(${offset * -28}px)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
};

const setupCursorEffect = () => {
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches || window.innerWidth < 1024) {
    return;
  }

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.body.classList.add('cursor-active');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  const animate = () => {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    window.requestAnimationFrame(animate);
  };

  document.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  document.querySelectorAll('a, button').forEach((target) => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  animate();
};

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

if (languageLinks.length) {
  languageLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const selectedLanguage = (link.dataset.language || link.textContent || 'en').trim().toLowerCase();
      window.localStorage.setItem(languageStorageKey, selectedLanguage);
    });
  });

  const currentPath = window.location.pathname;
  const isEnglishEntry = currentPath === '/' || currentPath.endsWith('/index.html');
  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  const browserLanguages = navigator.languages || [navigator.language || 'en'];
  const browserPrefersGerman = browserLanguages.some((language) => language.toLowerCase().startsWith('de'));

  if (isEnglishEntry && (savedLanguage === 'de' || (!savedLanguage && browserPrefersGerman))) {
    const germanUrl = new URL('de.html', window.location.href);
    if (window.location.pathname !== germanUrl.pathname) {
      window.location.replace(germanUrl.href);
    }
  }
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

setupScrollReveal();
setupMagneticButtons();
setupHeroParallax();
setupCursorEffect();
