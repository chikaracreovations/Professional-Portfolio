document.addEventListener("DOMContentLoaded", () => {
  // Fetch portfolio data
  fetch("/data/portfolio.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load portfolio data configuration.");
      }
      return response.json();
    })
    .then(data => {
      // 1. Load and Render Skills
      renderSkills(data.skills);

      // 2. Load and Render Projects
      renderProjects(data.projects);

      // 3. Dispatch data load complete event so Swiper initializes correctly
      document.dispatchEvent(new CustomEvent('portfolioDataLoaded'));
    })
    .catch(error => {
      console.error("Error rendering portfolio dynamically:", error);
      // Fallback message inside containers
      const servicesList = document.getElementById("servicesList");
      const swiperWrapper = document.getElementById("swiperWrapper");
      if (servicesList) servicesList.innerHTML = `<p class="error-msg">Error loading skills. Please refresh the page.</p>`;
      if (swiperWrapper) swiperWrapper.innerHTML = `<div class="swiper-slide"><p class="error-msg">Error loading projects. Please refresh the page.</p></div>`;
    });
});

// Render Skills section
function renderSkills(skills) {
  const container = document.getElementById("servicesList");
  if (!container) return;
  container.innerHTML = ""; // Clear loader placeholder

  skills.forEach(skill => {
    const item = document.createElement("div");
    item.className = "service-item";

    if (skill.bullets && Array.isArray(skill.bullets)) {
      // Skill block with bullet points
      let bulletHtml = skill.bullets.map(bullet => `<li>${bullet}</li>`).join("");
      item.innerHTML = `
        <h3>${skill.title}</h3>
        <p>${bulletHtml}</p>
      `;
    } else {
      // Basic skill block
      item.innerHTML = `
        <h3>${skill.title}</h3>
        <p>${skill.description}</p>
      `;
    }

    container.appendChild(item);
  });
}

// Render Projects section
function renderProjects(projects) {
  const container = document.getElementById("swiperWrapper");
  if (!container) return;
  container.innerHTML = ""; // Clear loader placeholder

  projects.forEach(project => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.setAttribute("data-category", project.category || "web-development");

    slide.innerHTML = `
      <div class="portfolio-item">
        <img src="${project.image}" alt="${project.title}" class="portfolio-image">
        <div class="portfolio-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <br>
          <div class="portfolio-buttons">
            <button class="btn tech-btn" data-technologies='${project.technologies}'>
              View Technologies
            </button>
            <a href="${project.url || '#'}" class="btn" target="_blank" rel="noopener noreferrer">
              View Project
            </a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(slide);
  });
}
