document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper('.swiper-container', {
    autoHeight: true, // Adjust height dynamically based on active slide
      loop: true, // Enable looping
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  });  