// Handle registration form submission
function handleRegister(event, role) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const user = {
    id: Date.now().toString(),
    role: role,
    firstName: formData.get("firstName")?.trim(),
    lastName: formData.get("lastName")?.trim(),
    email: formData.get("email")?.trim(),
    country: formData.get("country")?.trim() || "",
    zipcode: formData.get("zipcode")?.trim() || "",
    phone: formData.get("phone")?.trim() || "",
    bio: formData.get("bio")?.trim() || "",
  };

  // Role-specific fields
  if (role === "mentor") {
    user.expertise = formData.get("expertise")?.trim();
    user.experience = parseInt(formData.get("experience")) || 0;
  } else if (role === "mentee") {
    user.learningGoals = formData.get("learningGoals")?.split(",").map(goal => goal.trim()).filter(goal => goal) || [];
    user.interests = formData.get("interests")?.split(",").map(interest => interest.trim()).filter(interest => interest) || [];
  }

  // Validation
  if (!user.firstName || !user.lastName || !user.email) {
    showMessage("First name, last name, and email are required.", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  if (role === "mentor" && (!user.expertise || user.experience < 0)) {
    showMessage("Expertise and valid years of experience are required for mentors.", "error");
    return;
  }

  if (role === "mentee" && !user.learningGoals.length) {
    showMessage("At least one learning goal is required for mentees.", "error");
    return;
  }

  // Save to localStorage
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.email === user.email)) {
    showMessage("This email is already registered.", "error");
    return;
  }

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  showMessage("Registration successful! Redirecting to dashboard...", "success");
  setTimeout(() => {
    if (role === "mentee") {
      window.location.href = "mentee.html";
    } else if (role === "mentor") {
      window.location.href = "mentor.html";
    } else if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
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
});