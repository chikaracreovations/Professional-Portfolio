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

    slidesPerView: 1,
    spaceBetween: 200,

    breakpoints: {
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 3 },
    }
  });
});

document.querySelectorAll(".tech-btn").forEach(button => {
  button.addEventListener("click", function () {
    const techDetails = this.getAttribute("data-technologies");
    document.getElementById("techModalBody").innerHTML = techDetails;
    document.getElementById("techModal").style.display = "block";
  });
});

document.querySelector(".modal .close").addEventListener("click", function () {
  document.getElementById("techModal").style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target.id === "techModal") {
    document.getElementById("techModal").style.display = "none";
  }
});
