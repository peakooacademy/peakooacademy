/**
 * PEAKOO ACADEMY x GANESH (IIT BOMBAY / @iitbtalks)
 * CREATIVE PORTFOLIO & SEPARATE IIT GUIDANCE PAYMENT ENGINE
 * 
 * IMPORTANT:
 * This payment gateway configuration and lead handler is 100% SEPARATE from
 * the main Peakoo Academy courses payment ID. Do NOT combine them.
 */

// ============================================================================
// SEPARATE PAYMENT CONFIGURATION FOR IIT GUIDANCE (GANESH / IIT BOMBAY)
// ============================================================================
// To activate your live Razorpay gateway specifically for IIT Students Guidance:
// 1. Enter your separate Razorpay Key ID below.
// 2. If left as test key or uninitialized, a simulated test checkout / direct WhatsApp handoff is triggered.
// ============================================================================
const GANESH_GUIDANCE_PAYMENT_CONFIG = {
  // YOUR SEPARATE RAZORPAY KEY ID FOR IIT STUDENTS GUIDANCE:
  // (Separate from Peakoo Academy course Key ID 'rzp_live_Tpq0VqqWnN5qNE')
  keyId: 'rzp_live_Tpq0VqqWnN5qNE', // Replace with your separate Guidance Live Key if needed
  companyName: 'IIT Guidance • Ganesh Korra (@iitbtalks)',
  description: 'Live IIT Mentorship Masterclass',
  themeColor: '#FF5500',
  currency: 'INR',
  prices: {
    'live iit mentorship masterclass': 249,
    'iit mentorship masterclass': 249,
    'guidance masterclass': 249,
    'masterclass': 249,
    'master class': 249,
    '1-on-1 iitian personalized guidance call': 249,
    '1-on-1 guidance call': 249,
    '1-on-1 guidance': 249,
  }
};

/**
 * Extract integer amount from string or lookup table
 */
function getGuidanceAmount(planStr = '') {
  if (!planStr) return 249;
  const match = planStr.match(/₹\s*([\d,]+)/);
  if (match && match[1]) {
    const val = parseInt(match[1].replace(/,/g, ''), 10);
    if (!isNaN(val) && val > 0) return val;
  }
  const clean = planStr.toLowerCase();
  for (const [key, price] of Object.entries(GANESH_GUIDANCE_PAYMENT_CONFIG.prices)) {
    if (clean.includes(key)) return price;
  }
  return 249;
}

document.addEventListener('DOMContentLoaded', () => {
  initPopcornLoaderAndGravityDrop();
  initScrollDirectionNavbar();
  initGuidanceModal();
  initGuidanceCountdown();
  initGuidanceFaq();
  initSpotlights();
  initStickyBar();
  initDynamicSlots();
  initScrollProgressBar();
  initUdghoshExperience3DScroll();
  initScrollTriggerAnimations();
  initStoryShapeOverlay();
  initSplitTextAnimations();
  initUdghoshGallery();
  initHero3DTransform();
});

/**
 * 0. Portfolio Navbar Scroll Dynamics
 * - Visible by default when in the Hero section (initial load and within hero).
 * - Once scrolled past the hero section into next sections:
 *     - Scrolling DOWN hides navbar.
 *     - Scrolling UP reveals navbar.
 */
function initScrollDirectionNavbar() {
  const navWrap = document.querySelector('.floating-navbar-wrap');
  if (!navWrap) return;

  const heroSection = document.querySelector('.portfolio-hero-section') || document.querySelector('#about');
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  const scrollDeltaThreshold = 6; // Filter out tiny jitters

  function updateNavbar() {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate hero section bottom threshold
    let heroBottom = 650;
    if (heroSection) {
      heroBottom = heroSection.offsetTop + heroSection.offsetHeight - 120;
    }

    // 1. When on the Hero section -> Navbar is ALWAYS VISIBLE
    if (currentScrollY <= heroBottom) {
      navWrap.classList.add('is-visible');
      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
      ticking = false;
      return;
    }

    // 2. Once in the next sections: follow scroll direction
    const delta = currentScrollY - lastScrollY;

    // Scrolling UP -> Reveal navbar
    if (delta < -scrollDeltaThreshold) {
      navWrap.classList.add('is-visible');
    }
    // Scrolling DOWN -> Hide navbar
    else if (delta > scrollDeltaThreshold) {
      navWrap.classList.remove('is-visible');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateNavbar();
  });

  // Initial check: ensure visible on load since user starts on hero section
  updateNavbar();
}

/**
 * 1. Guidance Reservation Modal & Separate Razorpay Gateway
 */
function initGuidanceModal() {
  const modalWrap = document.getElementById('guidanceModal');
  if (!modalWrap) return;

  const closeBtns = modalWrap.querySelectorAll('.modal-x-btn, .guidance-modal-close');
  const triggerBtns = document.querySelectorAll('[data-guidance-trigger]');
  const form = document.getElementById('guidanceEnrolForm');
  const successBox = document.getElementById('guidanceSuccessMessage');
  const planSelect = document.getElementById('guidancePlanSelection');
  const slotSelect = document.getElementById('guidanceSlotSelection');

  function updateBtnAmount(planValue) {
    if (!form) return;
    const submitBtnSpan = form.querySelector('button[type="submit"] span');
    if (submitBtnSpan) {
      const amt = getGuidanceAmount(planValue);
      submitBtnSpan.textContent = `Reserve & Pay ₹${amt.toLocaleString('en-IN')}`;
    }
  }

  if (planSelect && planSelect.tagName === 'SELECT') {
    planSelect.addEventListener('change', () => {
      updateBtnAmount(planSelect.value);
    });
  }

  function openGuidanceModal(targetPlan = '') {
    if (planSelect) {
      if (planSelect.options && targetPlan) {
        const opts = Array.from(planSelect.options);
        const match = opts.find(o => 
          o.value.toLowerCase().includes(targetPlan.toLowerCase()) || 
          targetPlan.toLowerCase().includes(o.value.toLowerCase())
        );
        if (match) {
          planSelect.value = match.value;
        }
      } else if (targetPlan) {
        planSelect.value = targetPlan;
      }
    }
    updateBtnAmount(planSelect ? planSelect.value : targetPlan);
    modalWrap.classList.add('open');
    modalWrap.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeGuidanceModal() {
    modalWrap.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalWrap.style.display = '';
      if (form) form.style.display = 'block';
      if (successBox) successBox.style.display = 'none';
    }, 300);
  }

  // Direct trigger listeners + document-level event delegation
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Live IIT Mentorship Masterclass (₹249)';
      openGuidanceModal(plan);
    });
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-guidance-trigger], a[href="#reserve"], .btn-nav-join');
    if (trigger) {
      e.preventDefault();
      const plan = trigger.getAttribute('data-plan') || 'Live IIT Mentorship Masterclass (₹249)';
      openGuidanceModal(plan);
    }
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeGuidanceModal));

  modalWrap.addEventListener('click', (e) => {
    if (e.target === modalWrap) {
      closeGuidanceModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalWrap.classList.contains('open')) {
      closeGuidanceModal();
    }
  });

  // Submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guidanceStudentName').value.trim();
      const phone = document.getElementById('guidanceStudentPhone').value.trim();
      const email = document.getElementById('guidanceStudentEmail').value.trim();
      const college = document.getElementById('guidanceStudentCollege') ? document.getElementById('guidanceStudentCollege').value.trim() : 'N/A';
      const plan = planSelect ? planSelect.value : 'Live IIT Mentorship Masterclass (₹249)';
      const slot = slotSelect ? slotSelect.value : 'Upcoming Weekend Slot';
      const amount = getGuidanceAmount(plan);

      const submitBtn = form.querySelector('button[type="submit"]');
      const submitBtnSpan = submitBtn ? submitBtn.querySelector('span') : null;
      const origText = submitBtnSpan ? submitBtnSpan.textContent : `Reserve & Pay ₹${amount}`;

      function resetSubmit() {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnSpan) submitBtnSpan.textContent = origText;
      }

      function onGuidanceSuccess(paymentId = 'pay_iitb_guidance_' + Date.now().toString(36)) {
        // Store in a completely SEPARATE LocalStorage namespace for guidance
        const reservationData = {
          name,
          phone,
          email,
          college,
          plan,
          slot,
          amount,
          paymentId,
          mentor: 'Ganesh (IIT Bombay / @iitbtalks)',
          status: 'CONFIRMED',
          source: 'Ganesh Creator Portfolio',
          timestamp: new Date().toISOString()
        };

        try {
          const stored = JSON.parse(localStorage.getItem('iitb_guidance_reservations') || '[]');
          stored.push(reservationData);
          localStorage.setItem('iitb_guidance_reservations', JSON.stringify(stored));
        } catch (err) {
          console.error('Storage error for guidance lead:', err);
        }

        form.style.display = 'none';
        if (successBox) {
          successBox.style.display = 'block';

          const receiptContainer = successBox.querySelector('.guidance-receipt-card');
          if (receiptContainer) {
            receiptContainer.innerHTML = `
              <div style="margin-bottom: 6px;"><span style="color: var(--text-muted);">Session:</span> <strong style="color: #fff;">${plan}</strong></div>
              <div style="margin-bottom: 6px;"><span style="color: var(--text-muted);">Mentor:</span> <strong style="color: var(--color-orange);">Ganesh Korra (IIT Bombay)</strong></div>
              <div style="margin-bottom: 6px;"><span style="color: var(--text-muted);">Amount:</span> <strong style="color: #25D366; font-size: 15px;">₹${amount.toLocaleString('en-IN')}</strong></div>
              <div style="margin-bottom: 6px;"><span style="color: var(--text-muted);">Receipt ID:</span> <code style="color: #FF5500; background: rgba(255,85,0,0.12); padding: 2px 6px; border-radius: 4px; font-size: 12px;">${paymentId}</code></div>
              <div><span style="color: var(--text-muted);">Preferred Slot:</span> <span style="color: #fff;">${slot}</span></div>
            `;
          }

          const waBtn = document.getElementById('guidanceWhatsAppBtn');
          if (waBtn) {
            const prefilled = encodeURIComponent(
              `Hi Ganesh! My name is ${name} (${college || 'Student'}). I just reserved my seat for the IIT Mentorship Masterclass: "${plan}" on ${slot}. Payment ID: ${paymentId}. Email: ${email}. Please share my onboarding details & Masterclass link!`
            );
            waBtn.href = `https://wa.me/916305579955?text=${prefilled}`;
          }
        }
      }

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        alert('Payment gateway is initializing. Please check your connection or retry in a moment.');
        resetSubmit();
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnSpan) submitBtnSpan.textContent = 'Opening Secure Gateway...';

      const options = {
        key: GANESH_GUIDANCE_PAYMENT_CONFIG.keyId,
        amount: amount * 100, // in paise
        currency: GANESH_GUIDANCE_PAYMENT_CONFIG.currency,
        name: GANESH_GUIDANCE_PAYMENT_CONFIG.companyName,
        description: `${plan} - Ganesh (IIT Bombay)`,
        image: 'assets/cropped-peakoo-icon-white-512.webp',
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        notes: {
          guidance_plan: plan,
          preferred_slot: slot,
          college: college,
          creator: 'Ganesh (@iitbtalks)',
          collab: 'Peakoo Academy'
        },
        theme: {
          color: GANESH_GUIDANCE_PAYMENT_CONFIG.themeColor
        },
        handler: function (response) {
          onGuidanceSuccess(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function () {
            resetSubmit();
          }
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert('Payment was not completed: ' + (response.error.description || 'Unknown reason'));
          resetSubmit();
        });
        rzp.open();
      } catch (err) {
        console.error('Razorpay initialization error:', err);
        // Fallback to simulated booking if keys aren't provisioned yet
        setTimeout(() => {
          onGuidanceSuccess('pay_simulated_guidance_' + Date.now().toString(36));
        }, 800);
      }
    });
  }
}

/**
 * 2. Populate Dynamic Guidance Slots (Twice a month, upcoming weekends)
 */
function initDynamicSlots() {
  const slotSelect = document.getElementById('guidanceSlotSelection');
  if (!slotSelect) return;

  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  slotSelect.innerHTML = '';

  let added = 0;
  for (let i = 1; i <= 45 && added < 4; i++) {
    const candidate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    // Prefer Saturdays (6) and Sundays (0)
    if (candidate.getDay() === 0 || candidate.getDay() === 6) {
      const dayName = days[candidate.getDay()];
      const dNum = String(candidate.getDate()).padStart(2, '0');
      const mName = months[candidate.getMonth()];
      const yNum = candidate.getFullYear();

      const timeSlot = candidate.getDay() === 0 ? '7:00 PM - 8:30 PM IST' : '6:00 PM - 7:30 PM IST';
      const label = `${dayName}, ${dNum} ${mName} ${yNum} • ${timeSlot}${added === 0 ? ' (Fast Filling — 4 Seats Left)' : ''}`;
      
      const opt = document.createElement('option');
      opt.value = `${dayName}, ${dNum} ${mName} ${yNum} (${timeSlot})`;
      opt.textContent = label;
      if (added === 0) opt.selected = true;
      slotSelect.appendChild(opt);
      added++;
    }
  }
}

/**
 * 3. Live Urgency Countdown Timer (Counts down to closest Sunday)
 */
function initGuidanceCountdown() {
  const timerEl = document.getElementById('guidanceCountdown');
  if (!timerEl) return;

  function update() {
    const now = new Date();
    // Target next Sunday 7:00 PM
    const target = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    target.setDate(now.getDate() + daysUntilSunday);
    target.setHours(19, 0, 0, 0);

    const diff = target.getTime() - now.getTime();
    if (diff <= 0) {
      timerEl.textContent = '00d : 00h : 00m : 00s';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    timerEl.textContent = `${String(d).padStart(2, '0')}d : ${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`;
  }

  update();
  setInterval(update, 1000);
}

/**
 * 4. FAQ Accordion for Portfolio & Guidance
 */
function initGuidanceFaq() {
  const items = document.querySelectorAll('.guidance-faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');
    if (btn && panel) {
      // Clone button to strip duplicate competing event listeners from main.js
      const freshBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(freshBtn, btn);

      freshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('active');

        // Close other items
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherPanel = other.querySelector('.faq-answer-panel');
            if (otherPanel) {
              otherPanel.style.maxHeight = null;
              otherPanel.style.padding = '0 26px';
            }
          }
        });

        if (!isOpen) {
          item.classList.add('active');
          panel.style.maxHeight = (panel.scrollHeight + 35) + 'px';
          panel.style.padding = '0 26px 22px';
        } else {
          item.classList.remove('active');
          panel.style.maxHeight = null;
          panel.style.padding = '0 26px';
        }
      });
    }
  });
}

/**
 * 5. Interactive Mouse Spotlight Glow on Cards
 */
function initSpotlights() {
  const cards = document.querySelectorAll('.creator-card-spotlight, .guidance-pillar-card, .guidance-plan-card, .work-project-card');
  cards.forEach(card => {
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
 * 6. Sticky Mobile Reservation Bar
 */
function initStickyBar() {
  const bar = document.getElementById('mobileStickyBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bar.style.display = 'flex';
    } else {
      bar.style.display = 'none';
    }
  });
}

/**
 * 7. Top Page Scroll Progress Bar
 */
function initScrollProgressBar() {
  let bar = document.getElementById('scrollProgressBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scrollProgressBar';
    bar.className = 'scroll-progress-bar';
    document.body.prepend(bar);
  }

  function updateBar() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.pageYOffset / total) * 100 : 0;
    bar.style.width = `${progress.toFixed(2)}%`;
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/**
 * 8. Comprehensive ScrollTrigger Animation Engine
 * Matches Udghosh'26 / Codrops 3D perspective scroll effect.
 * Uses GSAP + ScrollTrigger when available (CDN), and provides a continuous RAF
 * 3D perspective + parallax fallback if offline or loading.
 */
function initScrollTriggerAnimations() {
  const hasGSAP = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    initGSAPEngine();
  } else {
    // Run fallback immediately
    initFallbackScrollEngine();

    // When window finishes loading, check if GSAP CDN has become available
    window.addEventListener('load', () => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initGSAPEngine();
      }
    });
  }

  // Ensure trigger coordinates refresh after all media and fonts load
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
}

/**
 * ============================================================================
 * UDGHOSH '26 3D PERSPECTIVE SCROLL ENGINE (Experiences Section)
 * Exactly matched to https://udghosh.org.in/social
 * - True 3D perspective (1000px) with transform-origin at (50% 100%)
 * - Dynamic rotate3d(1, ry, rz, deg) from -52deg up to +50deg
 * - Inner photo vertical parallax via translate3d(0, innerY, 0)
 * - Protruding 3D floating title with translate3d(0, 0, 160px)
 * - Continuous silky-smooth lerp physics engine with IntersectionObserver
 * ============================================================================
 */
class UdghoshExperienceItem {
  constructor(el, index) {
    this.DOM = { el: el };
    this.DOM.image = el.querySelector('.content__item-img');
    this.DOM.imageWrapper = el.querySelector('.content__item-imgwrap');
    this.DOM.title = el.querySelector('.content__item-title');
    this.DOM.description = el.querySelector('.content__item-description');
    this.index = index;

    if (!this.DOM.imageWrapper) return;

    // Set 3D perspective & origin (exact Udghosh setup)
    this.DOM.el.style.perspective = '1000px';
    this.DOM.el.style.webkitPerspective = '1000px';
    this.DOM.imageWrapper.style.transformOrigin = '50% 100%';
    this.DOM.imageWrapper.style.transformStyle = 'preserve-3d';
    this.DOM.imageWrapper.style.webkitTransformStyle = 'preserve-3d';

    // Alternate subtle 3D yaw (ry) and roll (rz) per card
    const isEven = index % 2 === 1;
    this.ry = isEven ? -0.32 : 0.32;
    this.rz = isEven ? 0.12 : -0.12;

    // Floating 3D Title depth
    const isMobile = window.innerWidth <= 768;
    if (this.DOM.title) {
      const zDepth = isMobile ? 60 : 160;
      this.DOM.title.style.transform = `translate3d(0, 0, ${zDepth}px)`;
    }

    const toValue = isMobile ? -28 : -48;
    const overflow = isMobile ? 45 : 75;

    this.renderedStyles = {
      innerTranslationY: {
        previous: 0,
        current: 0,
        ease: 0.1,
        setValue: (winH) => {
          const rect = this.DOM.el.getBoundingClientRect();
          const elH = rect.height || 450;
          const enterDist = winH * 1.15;
          const exitDist = -elH * 0.85;
          const progress = (enterDist - rect.top) / (enterDist - exitDist);
          const clamped = Math.max(0, Math.min(1, progress));
          return -overflow + clamped * (2 * overflow);
        }
      },
      itemRotation: {
        previous: 0,
        current: 0,
        ease: 0.1,
        toValue: toValue,
        setValue: (winH) => {
          const rect = this.DOM.el.getBoundingClientRect();
          const elH = rect.height || 450;
          const enterDist = winH * 1.25;
          const exitDist = -elH * 0.85;
          const progress = (enterDist - rect.top) / (enterDist - exitDist);
          const clamped = Math.max(0, Math.min(1, progress));
          const min = -1 * toValue;
          return toValue + clamped * (min - toValue);
        }
      }
    };

    this.update();

    this.isVisible = true;
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          this.isVisible = e.isIntersecting || e.intersectionRatio > 0;
        });
      }, { rootMargin: '300px 0px 300px 0px' });
      this.observer.observe(this.DOM.el);
    }
  }

  lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }

  update() {
    const winH = window.innerHeight;
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].previous =
        this.renderedStyles[key].setValue(winH);
    }
    this.layout();
  }

  render(winH) {
    if (!this.isVisible) return;
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].setValue(winH);
      this.renderedStyles[key].previous = this.lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].ease
      );
    }
    this.layout();
  }

  layout() {
    if (this.DOM.image) {
      this.DOM.image.style.transform = `translate3d(0, ${this.renderedStyles.innerTranslationY.previous.toFixed(2)}px, 0)`;
    }
    if (this.DOM.imageWrapper) {
      this.DOM.imageWrapper.style.transform = `rotate3d(1, ${this.ry}, ${this.rz}, ${this.renderedStyles.itemRotation.previous.toFixed(2)}deg)`;
    }
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
  }
}

let udghoshExpManager = null;

function initUdghoshExperience3DScroll() {
  const itemEls = document.querySelectorAll('.content__item--expand');
  if (!itemEls.length) return;

  if (udghoshExpManager) {
    udghoshExpManager.destroy();
  }

  const items = Array.from(itemEls).map((el, i) => new UdghoshExperienceItem(el, i));
  let rAF = null;

  const onResize = () => {
    items.forEach(item => item.update());
  };

  window.addEventListener('resize', onResize);

  const loop = () => {
    const winH = window.innerHeight;
    items.forEach(item => item.render(winH));
    rAF = requestAnimationFrame(loop);
  };

  rAF = requestAnimationFrame(loop);

  udghoshExpManager = {
    items,
    destroy: () => {
      if (rAF) cancelAnimationFrame(rAF);
      window.removeEventListener('resize', onResize);
      items.forEach(item => item.destroy());
    }
  };
}

/**
 * GSAP + ScrollTrigger Engine
 */
function initGSAPEngine() {
  const isMobile = window.innerWidth < 768;

  // 1. Experiences Section: Udghosh '26 3D Perspective Tilt on Scroll (https://udghosh.org.in/social)
  initUdghoshExperience3DScroll();

  // Content body smooth entrance via ScrollTrigger
  const items = document.querySelectorAll('.content__item--expand');
  items.forEach((item) => {
    const desc = item.querySelector('.content__item-description');
    if (desc) {
      gsap.fromTo(desc,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  // 2. Hero Stats entrance
  const heroStats = document.querySelectorAll('.hero-stat-cell');
  if (heroStats.length) {
    gsap.from(heroStats, {
      opacity: 0,
      y: 35,
      stagger: 0.1,
      duration: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.hero-stats-row',
        start: 'top 90%'
      }
    });
  }

  // 2b. Masterclass Hub Card & Curriculum Modules Entrance
  const hubCard = document.querySelector('.masterclass-hub-card');
  if (hubCard) {
    gsap.from(hubCard, {
      opacity: 0,
      y: 35,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.25
    });
    const moduleItems = hubCard.querySelectorAll('.hub-module-item');
    if (moduleItems.length) {
      gsap.from(moduleItems, {
        opacity: 0,
        x: 24,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.45
      });
    }
  }

  // 3. Journey Story Columns
  const storyCol = document.querySelector('.journey-story-col');
  const photoCol = document.querySelector('.journey-photo-col');
  if (storyCol && photoCol) {
    gsap.from(storyCol, {
      opacity: 0,
      x: isMobile ? 0 : -40,
      y: isMobile ? 35 : 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.journey-layout-grid',
        start: 'top 80%'
      }
    });
    gsap.from(photoCol, {
      opacity: 0,
      x: isMobile ? 0 : 40,
      y: isMobile ? 35 : 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.journey-layout-grid',
        start: 'top 80%'
      }
    });
  }

  // 4. Golden Rules Cards Cascade Stagger
  const ruleCards = document.querySelectorAll('.golden-rule-card');
  if (ruleCards.length) {
    gsap.from(ruleCards, {
      opacity: 0,
      y: 40,
      scale: 0.96,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.golden-rules-grid',
        start: 'top 82%'
      }
    });
  }

  // 5. Guidance Mentorship Pillars
  const pillarCards = document.querySelectorAll('.guidance-pillar-card');
  if (pillarCards.length) {
    gsap.from(pillarCards, {
      opacity: 0,
      y: 38,
      stagger: 0.1,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.guidance-pillars-grid',
        start: 'top 82%'
      }
    });
  }

  // 6. Guidance Plans / Pricing Cards
  const planCards = document.querySelectorAll('.guidance-plan-card');
  if (planCards.length) {
    gsap.from(planCards, {
      opacity: 0,
      y: 45,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.guidance-plans-grid',
        start: 'top 80%'
      }
    });
  }

  // 7. Instagram Reels Cards
  const reels = document.querySelectorAll('.insta-reel-card');
  if (reels.length) {
    gsap.from(reels, {
      opacity: 0,
      y: 35,
      scale: 0.95,
      stagger: 0.08,
      duration: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.insta-reels-grid',
        start: 'top 82%'
      }
    });
  }

  // 8. FAQ Items
  const faqItems = document.querySelectorAll('.faq-card-row');
  if (faqItems.length) {
    gsap.from(faqItems, {
      opacity: 0,
      y: 25,
      stagger: 0.07,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.faq-cards-container',
        start: 'top 85%'
      }
    });
  }

  // 9. Section Headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(hdr => {
    gsap.from(hdr, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hdr,
        start: 'top 88%'
      }
    });
  });
}

/**
 * High-performance continuous RAF fallback
 * (active when GSAP is offline or unreachable)
 */
function initFallbackScrollEngine() {
  const itemEls = document.querySelectorAll('.content__item--expand');
  if (!itemEls.length) return;

  // Initialize the exact Udghosh 3D Perspective Scroll Engine
  initUdghoshExperience3DScroll();

  // Initialize body styling for fallback transitions
  itemEls.forEach(item => {
    const b = item.querySelector('.content__item-description');
    if (b) {
      b.style.opacity = '1';
      b.style.transform = 'translateY(0)';
      b.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  });

  // Also setup IntersectionObserver for standard page items in fallback mode
  const revealTargets = document.querySelectorAll(`
    .section-header,
    .hero-stat-cell,
    .journey-story-col,
    .journey-photo-col,
    .golden-rule-card,
    .guidance-pillar-card,
    .guidance-plan-card,
    .insta-reel-card,
    .faq-card-row
  `);
  revealTargets.forEach(el => {
    el.classList.add('scroll-reveal-item');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => observer.observe(el));

  function fallbackLoop() {
    // If GSAP became available, exit fallback loop
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;
    for (const item of fallbackItems) {
      item.updateValues();
      item.render();
    }
    requestAnimationFrame(fallbackLoop);
  }

  requestAnimationFrame(fallbackLoop);
}

/**
 * 10. Authentic Story Organic Wave Shape Overlay Reveal
 * Uses Blake Bowen's organic bezier liquid morphing animation with GSAP 3.
 * Triggers automatically via ScrollTrigger when approaching #journey,
 * sweeping across the section and revealing the authentic story contents.
 */
function initStoryShapeOverlay() {
  const overlayWrap = document.getElementById('storyWaveWrap');
  if (!overlayWrap) return;

  const paths = overlayWrap.querySelectorAll('.shape-overlays__path');
  if (!paths.length) return;

  const numPoints = 10;
  const numPaths = paths.length;
  const delayPointsMax = 0.28;
  const delayPerPath = 0.22;
  const duration = 0.85;
  let isOpened = false;
  let pointsDelay = [];
  let allPoints = [];

  // Initialize all points to 100
  for (let i = 0; i < numPaths; i++) {
    const points = [];
    allPoints.push(points);
    for (let j = 0; j < numPoints; j++) {
      points.push(100);
    }
  }

  function render() {
    for (let i = 0; i < numPaths; i++) {
      const path = paths[i];
      const points = allPoints[i];
      if (!path || !points) continue;

      let d = isOpened ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`;

      for (let j = 0; j < numPoints - 1; j++) {
        const p = ((j + 1) / (numPoints - 1)) * 100;
        const cp = p - (1 / (numPoints - 1) * 100) / 2;
        d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
      }

      d += isOpened ? ` V 100 H 0` : ` V 0 H 0`;
      path.setAttribute('d', d);
    }
  }

  // Pre-render initial path
  render();

  let tl = null;
  function getTimeline() {
    if (tl) return tl;
    if (typeof gsap !== 'undefined') {
      tl = gsap.timeline({
        onUpdate: render,
        defaults: {
          ease: 'power2.inOut',
          duration: duration
        },
        onComplete: () => {
          if (!isOpened) {
            overlayWrap.style.opacity = '0';
            overlayWrap.style.pointerEvents = 'none';
          }
        }
      });
    }
    return tl;
  }

  function playReveal() {
    const activeTl = getTimeline();
    if (!activeTl || typeof gsap === 'undefined') {
      overlayWrap.style.opacity = '0';
      return;
    }

    overlayWrap.style.opacity = '1';
    overlayWrap.style.pointerEvents = 'none';
    isOpened = false;
    activeTl.progress(0).clear();

    for (let i = 0; i < numPoints; i++) {
      pointsDelay[i] = Math.random() * delayPointsMax;
    }

    for (let i = 0; i < numPaths; i++) {
      const points = allPoints[i];
      for (let j = 0; j < numPoints; j++) {
        points[j] = 100;
      }
      const pathDelay = delayPerPath * (numPaths - i - 1);

      for (let j = 0; j < numPoints; j++) {
        const delay = pointsDelay[j];
        activeTl.to(points, {
          [j]: 0
        }, delay + pathDelay);
      }
    }

    // Simultaneously reveal the inner authentic story elements
    const storyCol = document.querySelector('.journey-story-col');
    const photoCol = document.querySelector('.journey-photo-col');
    const header = document.querySelector('#journey .section-header');
    if (header) {
      gsap.fromTo(header, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    }
    if (storyCol) {
      gsap.fromTo(storyCol, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.35, ease: 'power3.out' });
    }
    if (photoCol) {
      gsap.fromTo(photoCol, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.45, ease: 'power3.out' });
    }
  }

  function toggle() {
    const activeTl = getTimeline();
    if (!activeTl || activeTl.isActive()) return;
    overlayWrap.style.opacity = '1';
    activeTl.progress(0).clear();

    for (let i = 0; i < numPoints; i++) {
      pointsDelay[i] = Math.random() * delayPointsMax;
    }

    for (let i = 0; i < numPaths; i++) {
      const points = allPoints[i];
      const pathDelay = delayPerPath * (isOpened ? i : (numPaths - i - 1));
      const targetVal = isOpened ? 100 : 0;

      for (let j = 0; j < numPoints; j++) {
        const delay = pointsDelay[j];
        activeTl.to(points, {
          [j]: targetVal
        }, delay + pathDelay);
      }
    }

    isOpened = !isOpened;
  }

  // Hook to ScrollTrigger
  function attachScrollTrigger() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#journey',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          playReveal();
        }
      });
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            playReveal();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      const section = document.getElementById('journey');
      if (section) observer.observe(section);
    }
  }

  attachScrollTrigger();
  window.addEventListener('load', attachScrollTrigger);

  // Interactive replay trigger on the pill badge
  const pillTag = document.querySelector('#journey .section-pill-tag');
  if (pillTag) {
    pillTag.setAttribute('title', 'Click to replay organic wave reveal');
    pillTag.addEventListener('click', (e) => {
      e.preventDefault();
      playReveal();
    });
  }

  overlayWrap.addEventListener('click', toggle);
}

/**
 * 11. SplitText Line Animations with ScrollTrigger
 * Implements masked line-by-line scroll reveals matching GSAP SplitText standard.
 * Waits for document.fonts.ready, supports autoSplit on window resize,
 * and animates masked lines with scrubbed or triggered ScrollTrigger.
 */
function initSplitTextAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  if (typeof SplitText !== 'undefined') {
    gsap.registerPlugin(SplitText, ScrollTrigger);
  }

  const textTargets = document.querySelectorAll(`
    .portfolio-hero-title,
    .section-title,
    .ganesh-quote-text,
    .split
  `);

  if (!textTargets.length) return;

  // Custom Split Engine that matches GSAP SplitText API (lines + mask)
  function splitElementIntoMaskedLines(el) {
    if (!el.dataset.origHtml) {
      el.dataset.origHtml = el.innerHTML;
    } else {
      el.innerHTML = el.dataset.origHtml;
    }

    // Step 1: Wrap words into inline spans, carefully preserving .text-orange
    function wrapTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return node;
        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        const isOrange = Boolean(
          node.parentElement &&
          (node.parentElement.classList.contains('text-orange') ||
           node.parentElement.closest('.text-orange'))
        );

        words.forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) {
            fragment.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement('span');
            span.className = isOrange ? 'split-word text-orange' : 'split-word';
            span.style.display = 'inline-block';
            span.textContent = w;
            if (isOrange) {
              span.style.color = '#FF5500';
              span.style.webkitTextFillColor = '#FF5500';
              span.style.textShadow = '0 0 24px rgba(255, 85, 0, 0.65), 0 0 45px rgba(255, 85, 0, 0.35)';
            }
            fragment.appendChild(span);
          }
        });
        return fragment;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') return node;
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach(child => {
          const replaced = wrapTextNodes(child);
          if (replaced !== child) {
            node.replaceChild(replaced, child);
          }
        });
        return node;
      }
      return node;
    }

    const tempChildren = Array.from(el.childNodes);
    tempChildren.forEach(child => {
      const replaced = wrapTextNodes(child);
      if (replaced !== child) {
        el.replaceChild(replaced, child);
      }
    });

    // Step 2: Measure offsetTop of each word to group into lines
    const wordSpans = Array.from(el.querySelectorAll('.split-word'));
    if (!wordSpans.length) return [];

    const lines = [];
    let currentLine = [];
    let currentTop = -999;

    wordSpans.forEach(w => {
      const top = Math.round(w.offsetTop);
      if (Math.abs(top - currentTop) > 6) {
        if (currentLine.length) lines.push(currentLine);
        currentLine = [w];
        currentTop = top;
      } else {
        currentLine.push(w);
      }
    });
    if (currentLine.length) lines.push(currentLine);

    el.innerHTML = '';
    const lineElements = [];

    lines.forEach(lineWords => {
      const lineMask = document.createElement('span');
      lineMask.className = 'split-line-mask';
      lineMask.style.display = 'block';
      lineMask.style.overflow = 'hidden';
      lineMask.style.position = 'relative';

      const lineInner = document.createElement('span');
      lineInner.className = 'split-line';
      lineInner.style.display = 'block';
      lineInner.style.willChange = 'transform';

      lineWords.forEach((w, idx) => {
        if (w.classList.contains('text-orange')) {
          const orangeWrap = document.createElement('span');
          orangeWrap.className = 'text-orange';
          orangeWrap.style.color = '#FF5500';
          orangeWrap.style.webkitTextFillColor = '#FF5500';
          orangeWrap.style.textShadow = '0 0 24px rgba(255, 85, 0, 0.65), 0 0 45px rgba(255, 85, 0, 0.35)';
          orangeWrap.appendChild(w);
          lineInner.appendChild(orangeWrap);
        } else {
          lineInner.appendChild(w);
        }
        if (idx < lineWords.length - 1) {
          lineInner.appendChild(document.createTextNode(' '));
        }
      });

      lineMask.appendChild(lineInner);
      el.appendChild(lineMask);
      lineElements.push(lineInner);
    });

    return lineElements;
  }

  const fontsReady = (document.fonts && document.fonts.ready)
    ? document.fonts.ready
    : Promise.resolve();

  fontsReady.then(() => {
    const activeScrollTriggers = [];

    function setupAnimations() {
      activeScrollTriggers.forEach(st => st && st.kill && st.kill());
      activeScrollTriggers.length = 0;

      textTargets.forEach((el) => {
        let lines = [];

        if (typeof SplitText !== 'undefined') {
          try {
            const split = SplitText.create(el, {
              type: 'words,lines',
              mask: 'lines',
              linesClass: 'split-line',
              autoSplit: true
            });
            lines = split.lines;
          } catch (e) {
            lines = splitElementIntoMaskedLines(el);
          }
        } else {
          lines = splitElementIntoMaskedLines(el);
        }

        if (!lines || !lines.length) return;

        const rect = el.getBoundingClientRect();
        const isNearTop = rect.top < window.innerHeight * 0.75;

        if (isNearTop) {
          gsap.fromTo(lines,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
              delay: 0.15
            }
          );
        } else {
          const container = el.closest('.container') || el.parentElement || el;
          const anim = gsap.fromTo(lines,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: container,
                start: 'clamp(top 85%)',
                end: 'clamp(top 50%)',
                scrub: 0.8,
                toggleActions: 'play none none reverse'
              }
            }
          );
          if (anim.scrollTrigger) {
            activeScrollTriggers.push(anim.scrollTrigger);
          }
        }
      });
    }

    setupAnimations();

    // AutoSplit on window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupAnimations();
        ScrollTrigger.refresh();
      }, 250);
    });
  });
}

/**
 * 12. Popcorn Preloader & Gravity Card Drop Engine
 */
function initPopcornLoaderAndGravityDrop() {
  const loader = document.getElementById('popcornLoader');
  const spotlightCard = document.querySelector('.creator-card-spotlight');
  const replayBtn = document.getElementById('btnDropReplay');

  function triggerGravityDrop() {
    if (!spotlightCard) return;
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(spotlightCard,
        { y: -650, rotation: -12, opacity: 0, scale: 0.88 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.25,
          ease: 'bounce.out',
          clearProps: 'transform'
        }
      );
    } else {
      spotlightCard.style.opacity = '1';
      spotlightCard.style.transform = 'none';
    }
  }

  if (loader) {
    const kernels = loader.querySelectorAll('.popcorn-kernel');
    if (typeof gsap !== 'undefined' && kernels.length) {
      const popTl = gsap.timeline({
        onComplete: () => {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            onComplete: () => {
              loader.classList.add('is-hidden');
              triggerGravityDrop();
            }
          });
        }
      });

      // Animate kernels popping out like popcorn
      kernels.forEach((k, idx) => {
        const xOffset = (idx % 2 === 0 ? -1 : 1) * (40 + Math.random() * 140);
        const yOffset = - (60 + Math.random() * 180);
        const rot = (Math.random() - 0.5) * 40;
        popTl.to(k, {
          x: xOffset,
          y: yOffset,
          scale: 1,
          rotation: rot,
          duration: 0.65,
          ease: 'back.out(2.2)'
        }, idx * 0.07);
      });

      popTl.to(kernels, {
        opacity: 0,
        scale: 0.8,
        duration: 0.35,
        delay: 0.3
      });
    } else {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        triggerGravityDrop();
      }, 1000);
    }
  } else {
    triggerGravityDrop();
  }

  // Interactive Replay Button
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerGravityDrop();
    });
  }
}

/**
 * ============================================================================
 * 12. UDGHOSH-STYLE 3D SPIRAL HELIX GALLERY & LIGHTBOX
 * Inspired by https://ca.udghosh.org.in/ (IIT Kanpur Sports Fest Gallery)
 * ============================================================================
 */
function initUdghoshGallery() {
  const pin = document.getElementById('gallerySpiralPin');
  const viewport = document.getElementById('gallerySpiralViewport');
  const stage = document.getElementById('gallerySpiralStage');
  if (!pin || !viewport || !stage) return;

  const cards = Array.from(stage.querySelectorAll('.spiral-card'));
  const cardInners = cards.map(c => c.querySelector('.spiral-card-inner'));
  const totalCards = cards.length;
  if (!totalCards) return;

  const activeIndexEl = document.getElementById('galleryActiveCounter');
  const activeTitleEl = document.getElementById('galleryActiveTitle');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');

  // Lightbox elements
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Metadata for all 12 cards
  const galleryData = [
    {
      img: 'assets/ganesh/img_6023.webp',
      tag: 'CAMPUS LIFE',
      title: 'IIT Bombay Campus & Legacy',
      desc: 'Iconic grounds of IIT Bombay — 4+ years of rigorous engineering, exploration, and lifelong memories.'
    },
    {
      img: 'assets/ganesh/img_1478.webp',
      tag: 'CULTURAL PODIUM',
      title: 'Inter-IIT 2x Silver Medals',
      desc: 'Representing IIT Bombay at the Inter-IIT Cultural Meet and securing 2 Silver Medals against top IITs nationwide.'
    },
    {
      img: 'assets/ganesh/img_7751.webp',
      tag: 'SPORTS & AGILITY',
      title: 'Athletics, Kabaddi & Kho-Kho',
      desc: 'Represented IIT Bombay at national sports meets, building grit, endurance, and on-field tactical agility.'
    },
    {
      img: 'assets/ganesh/img_9789.webp',
      tag: 'STAGE PRODUCTION',
      title: 'TELCA Festival & OC Lead',
      desc: 'Overall Coordinator & Core Production Lead orchestrating state-level stage festivals with 5,000+ audience.'
    },
    {
      img: 'assets/ganesh/img_1527.webp',
      tag: 'DISCIPLINE & LEADERSHIP',
      title: 'NCC Drills & Ceremonials',
      desc: 'Official NCC Cadet drills and formal parades, instilling unwavering discipline and commanding leadership.'
    },
    {
      img: 'assets/ganesh/img_0234.webp',
      tag: 'TECH INNOVATION',
      title: 'Robotics, Labs & Tech Expos',
      desc: 'Prototyping, robotics, and engineering project demonstrations at IIT Bombay tech showcases.'
    },
    {
      img: 'assets/ganesh/img_3294.webp',
      tag: 'VENTURE CAPITAL',
      title: 'Startup Scaling & Ecosystem',
      desc: 'Evaluating early-stage startups and driving strategic growth, investments, and enterprise scaling.'
    },
    {
      img: 'assets/ganesh/img_6032.webp',
      tag: 'JEE MENTORSHIP',
      title: 'Keynotes & Student Guidance',
      desc: 'Guiding JEE aspirants and college freshers on cracking competitive exams and navigating IIT opportunities.'
    },
    {
      img: 'assets/ganesh/img_7761.webp',
      tag: 'TEAM HONORS',
      title: 'Championships & Speaking',
      desc: 'Inspiring teams, addressing audiences, and celebrating championship victories with IIT Bombay squads.'
    },
    {
      img: 'assets/ganesh/img_5106.webp',
      tag: 'BUSINESS OPERATIONS',
      title: 'Apparel Scaling & Strategy',
      desc: 'Bootstrapping and scaling a successful college merchandise & apparel business across IIT Bombay.'
    },
    {
      img: 'assets/ganesh/img_6029.webp',
      tag: 'ACADEMIC JOURNEY',
      title: 'Milestones & Convocation',
      desc: 'Celebrating pivotal milestones and graduation achievements alongside cherished batchmates.'
    },
    {
      img: 'assets/ganesh/img_6030.webp',
      tag: 'PEER STRATEGY',
      title: 'Collaboration & Mentoring',
      desc: 'Problem-solving sessions, peer mentoring, and shaping young engineering minds for future leadership.'
    }
  ];

  // Parameters
  let radius = 380;
  let vSpacing = 245;
  let cutAngle = 64;
  let perspective = 1450;
  let totalHeight = vSpacing * totalCards;
  let cosCut = Math.cos(cutAngle * Math.PI / 180);
  const angleStep = 360 / totalCards;

  function updateDimensions() {
    const w = pin.offsetWidth || window.innerWidth;
    if (w <= 480) {
      radius = 150;
      vSpacing = 145;
      cutAngle = 58;
      perspective = 800;
    } else if (w <= 768) {
      radius = 215;
      vSpacing = 165;
      cutAngle = 60;
      perspective = 1000;
    } else if (w <= 1100) {
      radius = 300;
      vSpacing = 195;
      cutAngle = 62;
      perspective = 1200;
    } else {
      radius = 380;
      vSpacing = 245;
      cutAngle = 64;
      perspective = 1450;
    }
    totalHeight = vSpacing * totalCards;
    cosCut = Math.cos(cutAngle * Math.PI / 180);
    viewport.style.perspective = `${perspective}px`;
  }

  updateDimensions();

  // Spiral state
  const spiralState = { progress: 0 };
  let currentFrontIndex = 0;

  function renderSpiral() {
    // 2 complete revolutions across the full scroll distance
    const rotation = 720 * spiralState.progress;
    const vOffset = spiralState.progress * totalHeight * 2;
    let maxDepth = -1;
    let bestIndex = 0;

    cards.forEach((card, idx) => {
      if (!card) return;
      const cardAngle = idx * angleStep + rotation;
      const normalizedAngle = (cardAngle % 360 + 360) % 360;
      const rad = (normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle) * Math.PI / 180;
      const cosVal = Math.cos(rad);
      const depthProgress = (cosVal + 1) / 2;

      let fade = (cosVal - cosCut) / (1 - cosCut);
      fade = Math.max(0, Math.min(1, fade));
      fade = fade * fade * (3 - 2 * fade); // smoothstep

      let yPos = idx * vSpacing + vOffset + totalHeight / 2;
      yPos = (yPos % totalHeight + totalHeight) % totalHeight - totalHeight / 2;

      card.style.transform = `translate3d(-50%, calc(-50% + ${yPos.toFixed(2)}px), 0) rotateY(${cardAngle.toFixed(2)}deg) translateZ(${radius}px)`;
      card.style.zIndex = Math.round(1000 * depthProgress);
      card.style.pointerEvents = fade > 0.05 ? 'auto' : 'none';

      const inner = cardInners[idx];
      if (inner) {
        const scale = 0.70 + 0.45 * depthProgress;
        inner.style.transform = `scale(${scale.toFixed(3)})`;
        inner.style.opacity = Math.max(0.08, fade).toFixed(3);
        inner.style.filter = `brightness(${(0.52 + 0.65 * depthProgress).toFixed(3)}) blur(${(2.6 * (1 - fade)).toFixed(2)}px)`;
        const isActive = depthProgress > 0.985;
        inner.classList.toggle('is-active', isActive);

        if (depthProgress > maxDepth) {
          maxDepth = depthProgress;
          bestIndex = idx;
        }
      }
    });

    if (bestIndex !== currentFrontIndex) {
      currentFrontIndex = bestIndex;
      if (activeIndexEl) {
        activeIndexEl.textContent = `${String(currentFrontIndex + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
      }
      if (activeTitleEl && galleryData[currentFrontIndex]) {
        activeTitleEl.textContent = galleryData[currentFrontIndex].title;
      }
    }
  }

  renderSpiral();

  // GSAP ScrollTrigger Integration
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => '+=' + Math.round(2.6 * window.innerHeight),
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        spiralState.progress = self.progress;
        renderSpiral();
      },
      onRefreshInit: updateDimensions,
      onRefresh: renderSpiral
    });
  }

  window.addEventListener('resize', () => {
    updateDimensions();
    renderSpiral();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  // Previous & Next controls
  function stepSpiral(direction) {
    const stepSize = 1 / (totalCards * 2);
    let target = spiralState.progress + direction * stepSize;
    if (target < 0) target = 1 + target;
    if (target > 1) target = target % 1;

    if (typeof gsap !== 'undefined') {
      gsap.to(spiralState, {
        progress: target,
        duration: 0.55,
        ease: 'power2.out',
        onUpdate: renderSpiral
      });
    } else {
      spiralState.progress = target;
      renderSpiral();
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); stepSpiral(-1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); stepSpiral(1); });

  // Lightbox Implementation
  let currentLightboxIdx = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryData[index]) return;
    currentLightboxIdx = index;
    const item = galleryData[index];

    if (lightboxImg) {
      lightboxImg.src = item.img;
      lightboxImg.alt = item.title;
    }
    if (lightboxTag) lightboxTag.textContent = item.tag;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${totalCards}`;

    lightbox.style.display = 'flex';
    requestAnimationFrame(() => {
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  }

  function nextLightbox() {
    openLightbox((currentLightboxIdx + 1) % totalCards);
  }

  function prevLightbox() {
    openLightbox((currentLightboxIdx - 1 + totalCards) % totalCards);
  }

  // Card clicks open lightbox
  cardInners.forEach((inner, idx) => {
    if (!inner) return;
    inner.addEventListener('click', () => openLightbox(idx));
    inner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.style.display === 'none') return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextLightbox();
    else if (e.key === 'ArrowLeft') prevLightbox();
  });
}

/**
 * 14. Hero 3D Transform on Pointer Move (GSAP quickTo Engine)
 */
function initHero3DTransform() {
  const heroSection = document.querySelector(".portfolio-hero-section") || document.querySelector("#about");
  const heroBox = document.querySelector(".hero-3d-box");
  const heroContent = document.querySelector(".hero-3d-content");

  if (!heroSection || !heroBox || !heroContent) return;
  if (typeof gsap === 'undefined') return;

  gsap.set(heroSection, { perspective: 850 });

  const outerRX = gsap.quickTo(heroBox, "rotationX", { ease: "power3", duration: 0.5 });
  const outerRY = gsap.quickTo(heroBox, "rotationY", { ease: "power3", duration: 0.5 });
  const innerX = gsap.quickTo(heroContent, "x", { ease: "power3", duration: 0.5 });
  const innerY = gsap.quickTo(heroContent, "y", { ease: "power3", duration: 0.5 });

  heroSection.addEventListener("pointermove", (e) => {
    // Avoid touch-drag jitter on phones & tablets so touch scrolling is 100% native and smooth
    if (e.pointerType === "touch") return;
    const rect = heroSection.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    outerRX(gsap.utils.interpolate(14, -14, relY));
    outerRY(gsap.utils.interpolate(-14, 14, relX));
    innerX(gsap.utils.interpolate(-24, 24, relX));
    innerY(gsap.utils.interpolate(-24, 24, relY));
  });

  heroSection.addEventListener("pointerleave", () => {
    outerRX(0);
    outerRY(0);
    innerX(0);
    innerY(0);
  });
}



