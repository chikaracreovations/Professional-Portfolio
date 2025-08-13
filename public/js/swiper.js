document.addEventListener("DOMContentLoaded", function () {
  // Initialize Swiper and make it globally accessible
  window.swiper = new Swiper('.swiper-container', {
    autoHeight: true, // Adjust height dynamically
    loop: true, // Enable looping
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 200,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }
  });

  // Tech modal open
  document.querySelectorAll(".tech-btn").forEach(button => {
    button.addEventListener("click", function () {
      const techDetails = this.getAttribute("data-technologies");
      document.getElementById("techModalBody").innerHTML = techDetails;
      document.getElementById("techModal").style.display = "block";
    });
  });

  // Modal close
  document.querySelector(".modal .close").addEventListener("click", function () {
    document.getElementById("techModal").style.display = "none";
  });

  // Close modal on outside click
  window.addEventListener("click", function (event) {
    if (event.target.id === "techModal") {
      document.getElementById("techModal").style.display = "none";
    }
  });

  // Category filter
  const filterSelect = document.getElementById('categoryFilter');
  const swiperSlides = document.querySelectorAll('.swiper-slide');

  filterSelect.addEventListener('change', function () {
    const selectedCategory = this.value;

    swiperSlides.forEach(slide => {
      const category = slide.getAttribute('data-category');
      if (selectedCategory === 'all' || category === selectedCategory) {
        slide.style.display = ''; // show
      } else {
        slide.style.display = 'none'; // hide
      }
    });

    // Update Swiper so it recalculates
    swiper.update();
  });
});

const heading = document.getElementById('scramble-heading');
const originalText = heading.textContent;

// Wrap each letter in a span
heading.innerHTML = originalText.split('')
  .map(char => `<span>${char}</span>`)
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