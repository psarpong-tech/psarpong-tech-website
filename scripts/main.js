// Mobile navigation and small progressive enhancements for Psarpong Tech.
const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    primaryNav.classList.toggle("is-open", !isExpanded);
    const label = menuButton.querySelector(".sr-only");
    if (label) label.textContent = isExpanded ? "Open navigation menu" : "Close navigation menu";
    const icon = menuButton.querySelector(".menu-icon");
    if (icon) icon.textContent = isExpanded ? "☰" : "✕";
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
      const label = menuButton.querySelector(".sr-only");
      if (label) label.textContent = "Open navigation menu";
      const icon = menuButton.querySelector(".menu-icon");
      if (icon) icon.textContent = "☰";
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isExpanded =
        menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      navigation.classList.toggle("open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        navigation.classList.remove("open");
      });
    });
  }

  // Automatically display the current year in the footer
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

