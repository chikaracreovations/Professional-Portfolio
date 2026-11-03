// ==========================================================================
// SPATIAL UI SUITE (3D PERSPECTIVE PHYSICS, DEPTH LAYERING & AMBIENT SPOTLIGHT)
// ==========================================================================

(function initSpatialUI() {
  // Check for touch / fine pointer
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // -------------------------------------------------------------------------
  // 1. Interactive Spatial Ambient Spotlight
  // -------------------------------------------------------------------------
  if (isFinePointer) {
    let spotlight = document.getElementById('spatial-spotlight');
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.id = 'spatial-spotlight';
      spotlight.className = 'spatial-spotlight';
      document.body.appendChild(spotlight);
    }

    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateSpotlight);
      }
    }, { passive: true });

    function updateSpotlight() {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      const dist = Math.hypot(mouseX - currentX, mouseY - currentY);
      if (dist > 0.5) {
        requestAnimationFrame(updateSpotlight);
      } else {
        isMoving = false;
      }
    }
  }

  // -------------------------------------------------------------------------
  // 2. Spatial 3D Perspective Tilt on Interactive Cards (Desktop/Fine Pointer)
  // -------------------------------------------------------------------------
  const spatialSelectors = [
    '.profile-card',
    '.info-card',
    '.stat-card',
    '.portfolio-item',
    '.highlight-item',
    '.certificate-card',
    '.tech-card',
    '[data-spatial-tilt]'
  ];

  function attachSpatialTilt(card) {
    if (!isFinePointer || card._hasSpatialTilt) return;
    card._hasSpatialTilt = true;

    // Ensure 3D transform style
    card.classList.add('spatial-tilt-active');

    let isHovered = false;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let rafId = null;

    const maxTilt = card.classList.contains('tech-card') ? 14 : 9;

    function renderTilt() {
      if (!isHovered && Math.abs(currentRotX) < 0.05 && Math.abs(currentRotY) < 0.05) {
        card.style.transform = '';
        rafId = null;
        return;
      }

      currentRotX += (targetRotX - currentRotX) * 0.15;
      currentRotY += (targetRotY - currentRotY) * 0.15;

      const zDepth = isHovered ? (card.classList.contains('tech-card') ? 12 : 16) : 0;
      card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(${zDepth}px)`;

      rafId = requestAnimationFrame(renderTilt);
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      if (!rafId) rafId = requestAnimationFrame(renderTilt);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      targetRotX = ((y - centerY) / centerY) * -maxTilt;
      targetRotY = ((x - centerX) / centerX) * maxTilt;

      // Update specular sheen position
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      card.style.setProperty('--spatial-x', `${xPercent.toFixed(1)}%`);
      card.style.setProperty('--spatial-y', `${yPercent.toFixed(1)}%`);

      if (!rafId) rafId = requestAnimationFrame(renderTilt);
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
      card.style.setProperty('--spatial-x', '50%');
      card.style.setProperty('--spatial-y', '50%');
    });
  }

  function initAllSpatialCards() {
    spatialSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(attachSpatialTilt);
    });
  }

  // Run on load and observe dynamic elements (e.g. Swiper portfolio cards loaded from JSON)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllSpatialCards);
  } else {
    initAllSpatialCards();
  }

  // Observe dynamically inserted cards (e.g., portfolio project loader)
  const observer = new MutationObserver(() => {
    initAllSpatialCards();
  });

  const swiperWrapper = document.getElementById('swiperWrapper');
  if (swiperWrapper) {
    observer.observe(swiperWrapper, { childList: true, subtree: true });
  }

  // Expose global helper if needed
  window.refreshSpatialUI = initAllSpatialCards;
})();

