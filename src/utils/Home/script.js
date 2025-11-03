export const homeScript = () => {
  const menuToggle = document.querySelector(".home-menu-toggle");
  const navLinks = document.querySelector(".home-nav-links");
  const hamburguer = document.querySelector("#hamburguer");

  if (!menuToggle || !navLinks || !hamburguer) return;

  menuToggle.addEventListener("click", () => {
    if (!navLinks.classList.contains("active")) {
      navLinks.classList.add("active");
      hamburguer.className = "fas fa-times";
      hamburguer.style.transition = "transform 0.3s ease-in-out";
      hamburguer.style.transform = "rotate(180deg)";
    } else {
      navLinks.classList.remove("active");
      hamburguer.className = "fas fa-bars";
      hamburguer.style.transition = "transform 0.3s ease-in-out";
      hamburguer.style.transform = "rotate(0deg)";
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      navLinks.classList.remove("active");
    });
  });


  const filterButtons = document.querySelectorAll(".home-filter-btn");
  const portfolioItems = document.querySelectorAll(".home-portfolio-item");

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        portfolioItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            item.style.display = "block";
            item.style.animation = "fadeInUp 0.5s ease";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }
};

export default homeScript;
