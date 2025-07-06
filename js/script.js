// Handle newsletter signup
function handleNewsletterSignup(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  // Simulate API call
  showMessage("Thank you for subscribing! You'll receive our latest updates.", "success");
  event.target.reset();
}

// Show notification message
function showMessage(message, type = "info") {
  const existingMessages = document.querySelectorAll(".notification");
  existingMessages.forEach((msg) => msg.remove());

  const messageEl = document.createElement("div");
  messageEl.className = `notification notification-${type}`;
  messageEl.textContent = message;

  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: #fff;
    font-weight: 600;
    z-index: 2000;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
    ${getMessageColor(type)}
  `;

  document.body.appendChild(messageEl);

  setTimeout(() => {
    messageEl.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => messageEl.remove(), 300);
  }, 3000);
}

function getMessageColor(type) {
  switch (type) {
    case "success":
      return "background: #00D4FF;";
    case "error":
      return "background: #FF007A;";
    case "warning":
      return "background: #FF8C00;";
    case "info":
      return "background: #3B82F6;";
    default:
      return "background: #6B7280;";
  }
}

// Hamburger menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navbarMenu = document.querySelector(".navbar-menu");

  hamburger.addEventListener("click", () => {
    navbarMenu.classList.toggle("active");
    const isExpanded = navbarMenu.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isExpanded);
    hamburger.innerHTML = `<i class="fas ${isExpanded ? "fa-times" : "fa-bars"}"></i>`;
  });

  // Close menu when clicking a link
  navbarMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navbarMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.innerHTML = `<i class="fas fa-bars"></i>`;
    });
  });

  // Scroll-triggered animations
  const sections = document.querySelectorAll(".hero, .features, .testimonials, .how-it-works, .newsletter");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = "0.2s";
          entry.target.querySelectorAll(".feature-card, .testimonial-card, .step-item").forEach((el, index) => {
            el.style.animationDelay = `${0.2 + index * 0.1}s`;
          });
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach(section => observer.observe(section));
});