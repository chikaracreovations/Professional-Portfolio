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
      // Store globally for filtering
      window.allProjects = data.projects || [];

      // 1. Load and Render Skills
      renderSkills(data.skills);

      // 2. Load and Render Projects
      renderProjects(window.allProjects);

      // 3. Dispatch data load complete event so Swiper initializes correctly
      document.dispatchEvent(new CustomEvent('portfolioDataLoaded'));
    })
    .catch(error => {
      console.error("Error rendering portfolio dynamically:", error);
      const servicesList = document.getElementById("servicesList");
      const swiperWrapper = document.getElementById("swiperWrapper");
      if (servicesList) servicesList.innerHTML = `<p class="error-msg">Error loading skills. Please refresh the page.</p>`;
      if (swiperWrapper) swiperWrapper.innerHTML = `<div class="swiper-slide"><p class="error-msg">Error loading projects. Please refresh the page.</p></div>`;
    });
});

// Helper for skill icons
function getSkillIcon(title) {
  const lower = title.toLowerCase();
  if (lower.includes("algorithm") || lower.includes("dsa")) return "fa-solid fa-code-branch";
  if (lower.includes("ai") || lower.includes("machine learning")) return "fa-solid fa-microchip";
  if (lower.includes("full-stack") || lower.includes("cloud")) return "fa-solid fa-layer-group";
  if (lower.includes("tooling") || lower.includes("cse")) return "fa-solid fa-terminal";
  return "fa-solid fa-laptop-code";
}

// Render Skills section
function renderSkills(skills) {
  const container = document.getElementById("servicesList");
  if (!container || !skills) return;
  container.innerHTML = "";

  skills.forEach(skill => {
    const item = document.createElement("div");
    item.className = "service-item";

    const iconClass = getSkillIcon(skill.title);

    let contentHtml = "";
    if (skill.bullets && Array.isArray(skill.bullets)) {
      const bulletsList = skill.bullets.map(b => {
        const parts = b.split(":");
        if (parts.length > 1) {
          return `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(":")}</li>`;
        }
        return `<li>${b}</li>`;
      }).join("");
      contentHtml = `<ul class="skill-bullets">${bulletsList}</ul>`;
    } else {
      contentHtml = `<p>${skill.description || ""}</p>`;
    }

    item.innerHTML = `
      <div class="skill-header">
        <span class="skill-icon"><i class="${iconClass}"></i></span>
        <h3>${skill.title}</h3>
      </div>
      <div class="skill-body">
        ${contentHtml}
      </div>
    `;

    container.appendChild(item);
  });
}

// Render Projects section (exposed globally so filter can re-render)
window.renderProjects = function renderProjects(projects) {
  const container = document.getElementById("swiperWrapper");
  if (!container) return;
  container.innerHTML = "";

  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div class="swiper-slide">
        <div class="portfolio-item empty-state">
          <p>No projects currently found in this category.</p>
        </div>
      </div>
    `;
    return;
  }

  projects.forEach(project => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.setAttribute("data-category", project.category || "web-development");

    const tagsHtml = (project.tags || []).map(t => `<span class="project-tag">${t}</span>`).join("");
    const githubBtn = project.github 
      ? `<a href="${project.github}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer" title="View Source Code"><i class="fab fa-github"></i> Code</a>`
      : "";

    slide.innerHTML = `
      <div class="portfolio-item">
        <div class="portfolio-img-wrap">
          <img src="${project.image}" alt="${project.title}" class="portfolio-image" loading="lazy">
        </div>
        <div class="portfolio-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          ${tagsHtml ? `<div class="project-tags">${tagsHtml}</div>` : ""}
          <div class="portfolio-buttons">
            <a href="${project.url || '#'}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
            </a>
            ${githubBtn}
            <button class="btn tech-btn" data-technologies='${project.technologies || ""}'>
              <i class="fa-solid fa-circle-info"></i> Details
            </button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(slide);
  });

  // Re-bind modal buttons on new elements
  bindTechModalButtons();
};

function bindTechModalButtons() {
  document.querySelectorAll(".tech-btn").forEach(button => {
    button.onclick = function () {
      const techDetails = this.getAttribute("data-technologies");
      const modalBody = document.getElementById("techModalBody");
      const modal = document.getElementById("techModal");
      if (modalBody && modal) {
        modalBody.innerHTML = techDetails || "<p>Details unavailable.</p>";
        modal.style.display = "block";
      }
    };
  });
}
