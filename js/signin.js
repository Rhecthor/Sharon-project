// Handle pre-registration form submission
function handlePreRegister(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();
  const confirmPassword = formData.get("confirmPassword")?.trim();
  const role = formData.get("role");
  const terms = formData.get("terms") === "on";

  // Validation
  if (!email || !password || !confirmPassword || !role || !terms) {
    showMessage("All fields and terms acceptance are required.", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters long.", "error");
    return;
  }

  // Check for existing user
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.email === email)) {
    showMessage("This email is already registered.", "error");
    return;
  }

  // Save temporary registration data
  const tempUser = { email, password, role };
  localStorage.setItem("tempUser", JSON.stringify(tempUser));

  showMessage("Redirecting to complete registration...", "success");
  setTimeout(() => {
    window.location.href = `${role}-register.html`;
  }, 2000);
}

// Show notification message
function showMessage(message, type = "info") {
  const existingMessages = document.querySelectorAll(".notification");
  existingMessages.forEach(msg => msg.remove());

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

  navbarMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navbarMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.innerHTML = `<i class="fas fa-bars"></i>`;
    });
  });

  // Pre-fill email if coming from registration
  const tempUser = JSON.parse(localStorage.getItem("tempUser") || "{}");
  if (tempUser.email) {
    document.querySelector("#registerEmail").value = tempUser.email;
    document.querySelector("#role").value = tempUser.role;
    localStorage.removeItem("tempUser");
  }
});