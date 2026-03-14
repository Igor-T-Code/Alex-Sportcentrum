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
      trainer: 'Wanik Awdijan',
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
      trainer: 'Wanik Awdijan',
      times: [
        ['Donnerstag', '18:30 – 19:30']
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
    let d = DISCIPLINES[key];

    // Fallback: try localStorage data for admin-created courses
    if (!d) {
      try {
        const stored = JSON.parse(localStorage.getItem('alex_kurse') || '[]');
        const k = stored.find(c => c.id === key);
        if (k) {
          const farbe = k.farbe || '#e63946';
          const r = parseInt(farbe.slice(1,3),16), g = parseInt(farbe.slice(3,5),16), b = parseInt(farbe.slice(5,7),16);
          const dayNames = { 'Mo':'Montag','Di':'Dienstag','Mi':'Mittwoch','Do':'Donnerstag','Fr':'Freitag','Sa':'Samstag' };
          const times = [];
          k.zeiten.split(',').forEach(part => {
            part = part.trim();
            const m = part.match(/^(Mo|Di|Mi|Do|Fr|Sa)\s+(.*)/);
            if (m) times.push([dayNames[m[1]] || m[1], m[2]]);
          });
          d = { title: k.name, icon: '#icon-boxen', color: farbe, bg: `rgba(${r},${g},${b},0.15)`, desc: k.beschreibung || '', trainer: k.trainer || '', times };
        }
      } catch(e) {}
    }
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

  // Modal CTA — close modal and scroll to prices
  modalCta.addEventListener('click', (e) => {
    e.preventDefault();
    closeDisciplineModal();
    setTimeout(() => {
      const preise = document.querySelector('#preise');
      if (preise) {
        const offset = navbar.offsetHeight + 16;
        const top = preise.getBoundingClientRect().top + window.scrollY - offset;
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
