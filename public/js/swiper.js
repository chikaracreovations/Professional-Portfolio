document.addEventListener("portfolioDataLoaded", function () {
  // Initialize Swiper and make it globally accessible
  initOrUpdateSwiper();

  // Tech modal close
  const closeBtn = document.querySelector(".modal .close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("techModal").style.display = "none";
    });
  }

  // Close modal on outside click
  window.addEventListener("click", function (event) {
    if (event.target.id === "techModal") {
      document.getElementById("techModal").style.display = "none";
    }
  });

  // Category filter
  const filterSelect = document.getElementById('categoryFilter');
  if (filterSelect) {
    filterSelect.addEventListener('change', function () {
      const selectedCategory = this.value;
      if (window.renderProjects && window.allProjects) {
        const filtered = (selectedCategory === 'all')
          ? window.allProjects
          : window.allProjects.filter(p => p.category === selectedCategory);
        
        window.renderProjects(filtered);
        initOrUpdateSwiper();
      }
    });
  }
});

function initOrUpdateSwiper() {
  if (window.swiper && typeof window.swiper.destroy === 'function') {
    window.swiper.destroy(true, true);
  }

  window.swiper = new Swiper('.swiper-container', {
    autoHeight: true,
    loop: false,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 24,
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 24 },
    }
  });
}

// ==========================================================================
// Falling Letters Effect for Subheadline (Deliberate Glitch Fall Animation)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const heading = document.getElementById('scramble-heading');
  if (heading) {
    const originalText = heading.textContent;

    // Wrap each letter in a span, converting spaces to &nbsp; to prevent collapse in inline-block
    heading.innerHTML = originalText.split('')
      .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const letters = heading.querySelectorAll('span');

    function fallLetters() {
      letters.forEach((span, i) => {
        setTimeout(() => {
          span.classList.add('fall');
        }, i * 100); // delay between each letter falling
      });
    }

    fallLetters();
  }
});
