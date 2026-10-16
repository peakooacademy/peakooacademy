/**
 * PEAKOO ACADEMY - MAIN JAVASCRIPT
 * Matching Tharun Speaks Interactions, Transitions & Spotlight Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCurriculumTabs();
  initFaqAccordion();
  initModal();
  initCourseCardLinks();
  initCardSpotlights();
  initScrollReveals();
  initCountdownTimer();
  initVideoModal();
  initPathwayCue();
});

/**
 * 1. Floating Pill Navbar & Mobile Drawer
 */
function initNavbar() {
  const navbar = document.getElementById('floatingNavbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawerWrap = document.getElementById('mobileDrawerWrap');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  // Smooth scroll handler for navbar appearance
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  function toggleMobileMenu() {
    if (mobileDrawerWrap && mobileMenuBtn) {
      const isOpen = mobileDrawerWrap.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawerWrap && mobileMenuBtn) {
      mobileDrawerWrap.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  const mobileDrawerCloseBtn = document.getElementById('mobileDrawerCloseBtn');
  if (mobileDrawerCloseBtn) {
    mobileDrawerCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileDrawerWrap) {
    mobileDrawerWrap.addEventListener('click', (e) => {
      if (e.target === mobileDrawerWrap) {
        closeMobileMenu();
      }
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawerWrap && mobileDrawerWrap.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

/**
 * 2. Curriculum Pillars Switcher ("What you'll learn in this Cohort")
 */
function initCurriculumTabs() {
  const pillarBtns = document.querySelectorAll('.pillar-tab-btn');

  pillarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTrack = btn.getAttribute('data-track');
      switchCurriculumTrack(targetTrack);
    });
  });

  // Check URL query parameters (e.g. ?track=web-dev)
  const urlParams = new URLSearchParams(window.location.search);
  const trackParam = urlParams.get('track');
  if (trackParam) {
    switchCurriculumTrack(trackParam);
  }
}

function switchCurriculumTrack(trackId) {
  const pillarBtns = document.querySelectorAll('.pillar-tab-btn');
  const trackPanels = document.querySelectorAll('.track-module-panel');

  pillarBtns.forEach(btn => {
    if (btn.getAttribute('data-track') === trackId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  trackPanels.forEach(panel => {
    if (panel.id === `track-${trackId}`) {
      panel.classList.add('active');
      // Re-trigger staggered animation on module cards
      const cards = panel.querySelectorAll('.module-box-card');
      cards.forEach((card, idx) => {
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = `moduleCardPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${0.04 * (idx + 1)}s backwards`;
      });
    } else {
      panel.classList.remove('active');
    }
  });
}

/**
 * 3. Course Box Links to Curriculum
 */
function initCourseCardLinks() {
  const courseBoxes = document.querySelectorAll('.course-track-box[data-target-track]');

  courseBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const trackId = box.getAttribute('data-target-track');
      if (trackId) {
        const curriculumEl = document.getElementById('curriculum');
        if (curriculumEl) {
          switchCurriculumTrack(trackId);
          curriculumEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = `index.html?track=${trackId}#curriculum`;
        }
      }
    });
  });
}

/**
 * 4. Interactive Mouse Spotlight Glow on Cards (Signature Framer Effect)
 */
function initCardSpotlights() {
  const spotlightCards = document.querySelectorAll(`
    .stat-card-item,
    .course-track-box,
    .module-box-card,
    .pricing-box-card,
    .community-feature-card,
    .student-story-box,
    .mentor-profile-card
  `);

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 5. Scroll-Driven Reveal Animations (Intersection Observer)
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(`
    .section-header,
    .courses-showcase-grid,
    .curriculum-pillars-bar,
    .curriculum-banner-card,
    .modules-six-grid,
    .pricing-cards-container,
    .community-cards-grid,
    .testimonials-row-grid,
    .mentors-team-grid,
    .faq-accordion-wrap,
    .final-cta-banner
  `);

  revealElements.forEach(el => {
    el.classList.add('reveal-init');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 6. FAQ Accordion
 */
function initFaqAccordion() {
  const faqRows = document.querySelectorAll('.faq-row-item');

  faqRows.forEach(row => {
    const triggerBtn = row.querySelector('.faq-toggle-trigger');
    const contentPanel = row.querySelector('.faq-collapsed-panel');

    if (triggerBtn && contentPanel) {
      triggerBtn.addEventListener('click', () => {
        const isActive = row.classList.contains('active');

        // Close other items
        faqRows.forEach(otherRow => {
          if (otherRow !== row) {
            otherRow.classList.remove('active');
            const otherPanel = otherRow.querySelector('.faq-collapsed-panel');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        if (!isActive) {
          row.classList.add('active');
          contentPanel.style.maxHeight = contentPanel.scrollHeight + 30 + 'px';
        } else {
          row.classList.remove('active');
          contentPanel.style.maxHeight = null;
        }
      });
    }
  });
}

/**
 * 7. Enrolment Modal
 */
function initModal() {
  const modalWrap = document.getElementById('enrolModal');
  const closeBtn = modalWrap ? modalWrap.querySelector('.modal-x-btn') : null;
  const triggerBtns = document.querySelectorAll('[data-enrol-trigger]');
  const enrolForm = document.getElementById('academyEnrolForm');
  const successBox = document.getElementById('formSuccessMessage');
  const courseSelect = document.getElementById('courseSelection');
  const slotSelect = document.getElementById('slotSelection');

  // Populate dynamic twice-a-month slots on load
  populateMasterclassSlots();

  function openModal(course = '', tier = '') {
    if (modalWrap) {
      if (courseSelect) {
        let displayCourse = course || 'All 4 Courses Bundle';
        displayCourse = displayCourse.replace(/&amp;/g, '&');
        if (courseSelect.tagName === 'INPUT') {
          courseSelect.value = displayCourse;
        } else if (courseSelect.tagName === 'SELECT') {
          const match = Array.from(courseSelect.options).find(opt => 
            opt.value === displayCourse || opt.value.toLowerCase().includes(displayCourse.toLowerCase()) || displayCourse.toLowerCase().includes(opt.value.toLowerCase())
          );
          if (match) {
            courseSelect.value = match.value;
          } else {
            courseSelect.selectedIndex = 0;
          }
        }
      }
      modalWrap.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalWrap) {
      modalWrap.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (enrolForm) enrolForm.style.display = 'block';
        if (successBox) successBox.style.display = 'none';
      }, 300);
    }
  }

  // Conversion event tracking helper (GA4 & Meta Pixel)
  function trackConversion(eventName, eventParams = {}) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, eventParams);
    }
    console.log(`[Peakoo Analytics] ${eventName}:`, eventParams);
  }

  // Track all WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(waBtn => {
    waBtn.addEventListener('click', () => {
      trackConversion('Contact', { channel: 'WhatsApp' });
    });
  });

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const course = btn.getAttribute('data-course') || '';
      const tier = btn.getAttribute('data-tier') || '';
      trackConversion('InitiateCheckout', { course, tier });
      openModal(course, tier);
    });
  });

  if (modalWrap) {
    modalWrap.querySelectorAll('.modal-x-btn').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });
  }

  if (modalWrap) {
    modalWrap.addEventListener('click', (e) => {
      if (e.target === modalWrap) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalWrap && modalWrap.classList.contains('open')) {
      closeModal();
    }
  });

  if (enrolForm) {
    enrolForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('studentName').value.trim();
      const phone = document.getElementById('studentPhone').value.trim();
      const email = document.getElementById('studentEmail').value.trim();
      const course = courseSelect ? courseSelect.value : 'Live Masterclass (₹99)';
      const slot = slotSelect ? slotSelect.value : '';

      const leadData = {
        name,
        phone,
        email,
        course,
        slot,
        timestamp: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('peakoo_academy_leads') || '[]');
        stored.push(leadData);
        localStorage.setItem('peakoo_academy_leads', JSON.stringify(stored));
      } catch (err) {
        console.error('Storage error:', err);
      }

      trackConversion('Lead', leadData);

      enrolForm.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
        const whatsAppBtn = document.getElementById('whatsAppHandoffBtn');
        if (whatsAppBtn) {
          const slotText = slot ? ` for the slot on ${slot}` : '';
          const prefilled = encodeURIComponent(
            `Hi Peakoo Academy! My name is ${name}. I want to confirm my seat for the ${course || 'Live Masterclass (₹99)'}${slotText}. My email is ${email}.`
          );
          whatsAppBtn.href = `https://wa.me/916305579955?text=${prefilled}`;
        }
      }
    });
  }
}

/**
 * Generates slots available twice a month (spaced ~14-15 days apart on weekends)
 * Displays clean slot dates for users to pick.
 */
function populateMasterclassSlots() {
  const slotSelects = document.querySelectorAll('#slotSelection');
  if (!slotSelects.length) return;

  const slots = [];
  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth();

  for (let m = 0; m < 4; m++) {
    const targetMonth = (currMonth + m) % 12;
    const targetYear = currYear + Math.floor((currMonth + m) / 12);
    
    const midDate = new Date(targetYear, targetMonth, 15, 19, 0, 0);
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    const endDate = new Date(targetYear, targetMonth, Math.min(30, lastDay), 19, 0, 0);

    [midDate, endDate].forEach(d => {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        if (day <= 3) {
          d.setDate(d.getDate() + (6 - day)); // Saturday
        } else {
          d.setDate(d.getDate() + (7 - day)); // Sunday
        }
      }
      if (d.getTime() > now.getTime() + 12 * 3600 * 1000) {
        slots.push(new Date(d));
      }
    });
  }

  slots.sort((a, b) => a.getTime() - b.getTime());

  const uniqueSlots = [];
  const seenDates = new Set();
  for (const d of slots) {
    const key = d.toDateString();
    if (!seenDates.has(key)) {
      seenDates.add(key);
      uniqueSlots.push(d);
    }
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const slotOptions = uniqueSlots.slice(0, 5).map((d, index) => {
    const dayName = dayNames[d.getDay()];
    const dateNum = String(d.getDate()).padStart(2, '0');
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const urgency = index === 0 ? ' (Fast Filling - 4 Seats Left)' : '';
    return {
      value: `${dayName}, ${dateNum} ${month} ${year} • 7:00 PM IST`,
      label: `${dayName}, ${dateNum} ${month} ${year} • 7:00 PM - 9:00 PM IST${urgency}`
    };
  });

  slotSelects.forEach(select => {
    select.innerHTML = '';
    slotOptions.forEach((opt, idx) => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      if (idx === 0) optionEl.selected = true;
      select.appendChild(optionEl);
    });
  });
}

/**
 * 8. Live Real-Time Countdown Timer Ticker
 */
function initCountdownTimer() {
  const cntDays = document.getElementById('cntDays');
  const cntHours = document.getElementById('cntHours');
  const cntMins = document.getElementById('cntMins');
  const cntSecs = document.getElementById('cntSecs');
  if (!cntDays || !cntHours || !cntMins || !cntSecs) return;

  // Use persistent target date or set to 12 days 18 hrs ahead
  let targetTimestamp = localStorage.getItem('peakoo_cohort_target');
  if (!targetTimestamp || isNaN(targetTimestamp)) {
    targetTimestamp = Date.now() + (12 * 86400 + 18 * 3600 + 44 * 60 + 20) * 1000;
    localStorage.setItem('peakoo_cohort_target', targetTimestamp);
  } else {
    targetTimestamp = parseInt(targetTimestamp, 10);
    if (targetTimestamp <= Date.now()) {
      targetTimestamp = Date.now() + (7 * 86400 + 14 * 3600 + 32 * 60) * 1000;
      localStorage.setItem('peakoo_cohort_target', targetTimestamp);
    }
  }

  function updateTimer() {
    const now = Date.now();
    let diff = Math.max(0, targetTimestamp - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);

    cntDays.textContent = String(days).padStart(2, '0');
    cntHours.textContent = String(hours).padStart(2, '0');
    cntMins.textContent = String(mins).padStart(2, '0');
    cntSecs.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 9. Interactive Video Tour Modal & Chapter Selector
 */
function initVideoModal() {
  const openBtn = document.getElementById('openVideoTourBtn');
  const modal = document.getElementById('videoTourModal');
  const closeBtn = document.getElementById('closeVideoTourBtn');
  const closeSecondaryBtn = document.getElementById('closeVideoTourSecondaryBtn');
  const video = document.getElementById('tourVideoPlayer');
  const chapterBtns = document.querySelectorAll('.video-chapter-pill');

  function openVideo() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  }

  function closeVideo() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (video) {
        video.pause();
      }
    }
  }

  if (openBtn) openBtn.addEventListener('click', openVideo);
  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (closeSecondaryBtn) closeSecondaryBtn.addEventListener('click', closeVideo);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVideo();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeVideo();
    }
  });

  chapterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chapterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const time = parseFloat(btn.getAttribute('data-time') || 0);
      if (video) {
        video.currentTime = time;
        video.play().catch(() => {});
      }
    });
  });
}

/**
 * 10. Interactive Pathway Diagram Cue for Mobile
 */
function initPathwayCue() {
  const cue = document.querySelector('.pathway-scroll-cue');
  const stage = document.querySelector('.why-cohort-diagram-stage');
  if (!cue || !stage) return;

  cue.addEventListener('click', () => {
    const maxScroll = stage.scrollWidth - stage.clientWidth;
    if (stage.scrollLeft < maxScroll / 2) {
      stage.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      stage.scrollTo({ left: 0, behavior: 'smooth' });
    }
  });

  stage.addEventListener('scroll', () => {
    const maxScroll = stage.scrollWidth - stage.clientWidth;
    const span = cue.querySelector('span') || cue;
    if (stage.scrollLeft > maxScroll * 0.5) {
      span.innerHTML = '&larr; Scroll to Learn the Skill';
    } else {
      span.innerHTML = 'Swipe to view full pathway &rarr;';
    }
  }, { passive: true });
}
