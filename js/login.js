// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();
  const remember = formData.get("remember") === "on";

  // Validation
  if (!email || !password) {
    showMessage("Email and password are required.", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  // Check against localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showMessage("Invalid email or password.", "error");
    return;
  }

  // Save current user
  localStorage.setItem("currentUser", JSON.stringify(user));
  if (remember) {
    localStorage.setItem("rememberUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("rememberUser");
  }

  showMessage("Login successful! Redirecting...", "success");
  setTimeout(() => {
    window.location.href = user.role === "mentee" ? "mentee.html" : "index.html"; // Placeholder for admin/mentor dashboards
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

  // Pre-fill login if remember me is set
  const rememberedUser = JSON.parse(localStorage.getItem("rememberUser") || "{}");
  if (rememberedUser.email) {
    document.querySelector("#loginEmail").value = rememberedUser.email;
    document.querySelector("#loginPassword").value = rememberedUser.password;
    document.querySelector("#remember").checked = true;
  }
});