document.addEventListener("DOMContentLoaded", function () {
    const marquee = document.querySelector(".marquee");
    const content = marquee.querySelector(".marquee-content");

    // Duplicate until width is at least twice the container
    const contentHTML = content.innerHTML;
    while (content.scrollWidth < marquee.offsetWidth * 2) {
        content.innerHTML += contentHTML;
    }

    // Animate using GSAP
    gsap.to(content, {
        x: "-51%",
        duration: 21,
        repeat: -100,
        ease: "linear"
    });
});