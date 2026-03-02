/* ========================================
   Alex Sportcentrum — Main JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile burger menu ---
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Contact form handling ---
  const form = document.getElementById('kontakt-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name');

      // Replace form with success message
      form.parentElement.innerHTML = `
        <div class="form-success">
          <div style="font-size:3rem;margin-bottom:16px">✅</div>
          <h3>Danke, ${name}!</h3>
          <p>Wir melden uns innerhalb von 24 Stunden bei dir.<br>Wir freuen uns auf dein Probetraining!</p>
        </div>
      `;
    });
  }

  // --- Scroll reveal animation ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply to cards and sections
  document.querySelectorAll('.trainer-card, .preis-card, .review-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = '#e63946';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // --- Mobile Sticky CTA Bar ---
  const mobileCta = document.getElementById('mobile-cta');
  if (mobileCta) {
    let ctaVisible = false;
    const heroEl = document.getElementById('hero');
    const kontaktEl = document.getElementById('kontakt');

    const updateCta = () => {
      const pastHero = window.scrollY > (heroEl ? heroEl.offsetHeight - 100 : 400);
      const atKontakt = kontaktEl
        ? window.scrollY + window.innerHeight > kontaktEl.offsetTop + 100
        : false;
      const shouldShow = pastHero && !atKontakt;

      if (shouldShow !== ctaVisible) {
        ctaVisible = shouldShow;
        mobileCta.classList.toggle('is-visible', shouldShow);
      }
    };

    window.addEventListener('scroll', updateCta, { passive: true });
    updateCta();
  }

  // --- Discipline Modal System ---
  const DISCIPLINES = {
    'boxen': {
      title: 'Boxen',
      icon: '#icon-boxen',
      color: 'var(--red)',
      bg: 'rgba(230, 57, 70, 0.15)',
      desc: 'Klassisches Boxen mit Fokus auf Technik, Pratzenarbeit und kontrolliertem Sparring. Von GBU-Weltmeister Alexander Awdijan persönlich geleitet — für Anfänger und Fortgeschrittene.',
      trainer: 'Alexander Awdijan',
      times: [
        ['Montag', '18:30 – 19:30'],
        ['Dienstag', '18:30 – 19:30 (Fortgeschr.)'],
        ['Mittwoch', '18:30 – 19:30'],
        ['Samstag', '16:00 – 17:00']
      ]
    },
    'kick': {
      title: 'Kick- & Thaiboxen',
      icon: '#icon-kick',
      color: 'var(--gold)',
      bg: 'rgba(212, 168, 67, 0.15)',
      desc: 'Kick- und Thaiboxen vereint Schlag- und Tritttechniken. Trainiert Kondition, Koordination und Selbstverteidigung. Geleitet von IBF Junioren-Weltmeister Wanik Awdijan.',
      trainer: 'Wanik Awdijan',
      times: [
        ['Montag', '20:00 – 21:00'],
        ['Mittwoch', '20:00 – 21:00'],
        ['Freitag', '18:30 – 19:30']
      ]
    },
    'fitness': {
      title: 'Fitness-Boxen',
      icon: '#icon-fitness',
      color: '#5b8fb9',
      bg: 'rgba(91, 143, 185, 0.15)',
      desc: 'Hochintensives Workout mit Box-Elementen. Verbessert Ausdauer, Kraft und Körpergefühl — ohne Körperkontakt. Perfekt für Fitness-Einsteiger und alle, die boxnah trainieren wollen.',
      trainer: 'Wanik Awdijan',
      times: [
        ['Dienstag', '20:00 – 21:00'],
        ['Donnerstag', '20:00 – 21:00'],
        ['Freitag', '20:00 – 21:00']
      ]
    },
    'zirkel': {
      title: 'Zirkeltraining',
      icon: '#icon-zirkel',
      color: '#8a8a8a',
      bg: 'rgba(138, 138, 138, 0.15)',
      desc: 'Funktionelles Ganzkörpertraining im Zirkel-Format. Stationen für Kraft, Ausdauer, Schnelligkeit und Koordination — abwechslungsreich und effektiv.',
      trainer: 'Fitness-Trainerin',
      times: [
        ['Dienstag', '18:30 – 19:30'],
        ['Donnerstag', '18:30 – 19:30']
      ]
    },
    'pilates': {
      title: 'Faszien & Pilates',
      icon: '#icon-pilates',
      color: '#b07aab',
      bg: 'rgba(176, 122, 171, 0.15)',
      desc: 'Faszientraining und Pilates für Beweglichkeit, Körperhaltung und Regeneration. Idealer Ausgleich zum intensiven Kampfsporttraining.',
      trainer: 'Fitness-Trainerin',
      times: [
        ['Donnerstag', '18:30 – 19:30']
      ]
    },
    'kinder-boxen': {
      title: 'Kinder-Boxen',
      icon: '#icon-kinder',
      color: 'var(--green-light)',
      bg: 'rgba(64, 145, 108, 0.15)',
      desc: 'Boxtraining für Kinder: Technik, Disziplin und Selbstbewusstsein. In einer sicheren Umgebung lernen Kinder Respekt, Konzentration und Körperbeherrschung.',
      trainer: 'Alexander Awdijan',
      times: [
        ['Montag', '17:00 – 18:00'],
        ['Mittwoch', '17:00 – 18:00']
      ]
    },
    'kinder-zirkel': {
      title: 'Kinder-Zirkel',
      icon: '#icon-kinder',
      color: 'var(--green-light)',
      bg: 'rgba(64, 145, 108, 0.15)',
      desc: 'Spielerisches Zirkeltraining für Kinder mit Fokus auf Koordination, Beweglichkeit und Spaß an Bewegung.',
      trainer: 'Alexander Awdijan',
      times: [
        ['Dienstag', '17:00 – 18:00']
      ]
    },
    'kinder-sv': {
      title: 'Kinder-Selbstverteidigung',
      icon: '#icon-kinder',
      color: 'var(--green-light)',
      bg: 'rgba(64, 145, 108, 0.15)',
      desc: 'Selbstverteidigung für Kinder: Situationserkennung, Reaktion und einfache Techniken für mehr Sicherheit im Alltag.',
      trainer: 'Alexander Awdijan',
      times: [
        ['Donnerstag', '17:00 – 18:00']
      ]
    },
    'kinder-kick': {
      title: 'Kinder Kick-/Thaiboxen',
      icon: '#icon-kinder',
      color: 'var(--green-light)',
      bg: 'rgba(64, 145, 108, 0.15)',
      desc: 'Kick- und Thaiboxen für Kinder: Schlag- und Tritttechniken in altersgerechter Form. Fördert Motorik, Ausdauer und Selbstvertrauen.',
      trainer: 'Alexander Awdijan',
      times: [
        ['Freitag', '17:00 – 18:00']
      ]
    }
  };

  const modal = document.getElementById('discipline-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTrainer = document.getElementById('modal-trainer');
  const modalTimes = document.getElementById('modal-times');
  const modalCta = document.getElementById('modal-cta');
  let scrollPos = 0;

  function openDisciplineModal(key) {
    const d = DISCIPLINES[key];
    if (!d) return;

    modalIcon.style.background = d.bg;
    modalIcon.style.color = d.color;
    modalIcon.innerHTML = `<svg width="28" height="28"><use href="${d.icon}"/></svg>`;
    modalTitle.textContent = d.title;
    modalDesc.textContent = d.desc;
    modalTrainer.innerHTML = `Trainer: <strong>${d.trainer}</strong>`;
    modalTimes.innerHTML = d.times.map(([day, time]) =>
      `<div class="modal-time-row"><span>${day}</span><span>${time}</span></div>`
    ).join('');

    // iOS scroll lock
    scrollPos = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollPos}px`;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeDisciplineModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollPos);
  }

  // Event delegation — one listener for all [data-discipline]
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-discipline]');
    if (trigger) {
      e.preventDefault();
      openDisciplineModal(trigger.dataset.discipline);
      return;
    }

    // Close on backdrop click
    if (e.target === modal) {
      closeDisciplineModal();
    }
  });

  // Close button
  modal.querySelector('.modal-close').addEventListener('click', closeDisciplineModal);

  // Modal CTA — close modal and scroll to contact
  modalCta.addEventListener('click', (e) => {
    e.preventDefault();
    closeDisciplineModal();
    setTimeout(() => {
      const kontakt = document.querySelector('#kontakt');
      if (kontakt) {
        const offset = navbar.offsetHeight + 16;
        const top = kontakt.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 350);
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeDisciplineModal();
    }
  });

  // Enter/Space on [data-discipline] elements with role=button
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-discipline]')) {
      e.preventDefault();
      openDisciplineModal(e.target.dataset.discipline);
    }
  });
});

/* ===== Animated Counter for Hero Stats ===== */
{
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length) {
    setTimeout(() => {
      counters.forEach(el => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 1600;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;

          if (isDecimal) {
            el.textContent = current.toFixed(1) + suffix;
          } else {
            el.textContent = Math.floor(current).toLocaleString('de-DE') + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      });
    }, 800);
  }
}
