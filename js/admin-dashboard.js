// Admin Dashboard Functionality
let currentUser = null
let allUsers = []
let filteredUsers = []

document.addEventListener("DOMContentLoaded", () => {
  initializeAdminDashboard()
})

function initializeAdminDashboard() {
  // Check authentication
  currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "index.html"
    return
  }

  // Update user info
  document.getElementById("userName").textContent = `${currentUser.firstName} ${currentUser.lastName}`

  // Load data
  loadAllUsers()
  updateStats()

  // Initialize navigation
  initializeNavigation()
}

function initializeNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      const targetSection = this.getAttribute("href").substring(1)
      showSection(targetSection)

      document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")
    })
  })
}

function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  updatePageHeader(sectionId)

  // Load section-specific data
  if (sectionId === "users") {
    displayUsers()
  } else if (sectionId === "analytics") {
    loadAnalytics()
  }
}

function updatePageHeader(sectionId) {
  const titles = {
    dashboard: { title: "Admin Dashboard", subtitle: "Platform overview and management tools." },
    users: { title: "User Management", subtitle: "View and manage all platform users." },
    analytics: { title: "Analytics", subtitle: "Platform performance and user insights." },
    reports: { title: "Reports", subtitle: "Generate and view platform reports." },
    settings: { title: "Platform Settings", subtitle: "Configure platform settings and preferences." },
    support: { title: "Support Center", subtitle: "Manage user support tickets and inquiries." },
  }

  const pageInfo = titles[sectionId] || titles["dashboard"]
  document.getElementById("pageTitle").textContent = pageInfo.title
  document.getElementById("pageSubtitle").textContent = pageInfo.subtitle
}

function loadAllUsers() {
  allUsers = JSON.parse(localStorage.getItem("users") || "[]")
  filteredUsers = [...allUsers]
}

function updateStats() {
  const totalUsers = allUsers.length
  const mentors = allUsers.filter((u) => u.role === "mentor").length
  const mentees = allUsers.filter((u) => u.role === "mentee").length
  const admins = allUsers.filter((u) => u.role === "admin").length

  // Calculate total matches (connections)
  let totalMatches = 0
  allUsers.forEach((user) => {
    if (user.role === "mentee") {
      const connections = JSON.parse(localStorage.getItem(`connections_${user.id}`) || "[]")
      totalMatches += connections.length
    }
  })

  // Update stat numbers
  const statNumbers = document.querySelectorAll(".stat-number")
  if (statNumbers.length >= 4) {
    statNumbers[0].textContent = totalUsers
    statNumbers[1].textContent = mentors
    statNumbers[2].textContent = mentees
    statNumbers[3].textContent = totalMatches
  }
}

function displayUsers() {
  const usersGrid = document.getElementById("usersGrid")
  if (!usersGrid) return

  if (filteredUsers.length === 0) {
    usersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No users found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `
    return
  }

  usersGrid.innerHTML = filteredUsers
    .map(
      (user) => `
        <div class="user-card">
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="user-info">
                <h3>${user.firstName} ${user.lastName}</h3>
                <p class="user-email">${user.email}</p>
                <div class="user-meta">
                    <span class="role-badge ${user.role}">${user.role}</span>
                    <span class="join-date">Joined ${formatDate(user.createdAt)}</span>
                </div>
                <p class="user-expertise">${user.expertise}</p>
            </div>
            <div class="user-actions">
                <button class="btn-secondary btn-small" onclick="viewUserDetails('${user.id}')">View Details</button>
                <button class="btn-secondary btn-small" onclick="editUser('${user.id}')">Edit</button>
                ${user.id !== currentUser.id ? `<button class="btn-danger btn-small" onclick="suspendUser('${user.id}')">Suspend</button>` : ""}
            </div>
        </div>
    `,
    )
    .join("")
}

function searchUsers() {
  const searchTerm = document.getElementById("userSearch").value.toLowerCase()
  const roleFilter = document.getElementById("roleFilter").value

  filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.expertise.toLowerCase().includes(searchTerm)

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  displayUsers()
}

function filterUsers() {
  searchUsers() // Reuse the search function which also applies filters
}

function viewUserDetails(userId) {
  const user = allUsers.find((u) => u.id === userId)
  if (!user) return

  let additionalInfo = ""

  if (user.role === "mentee") {
    const connections = JSON.parse(localStorage.getItem(`connections_${user.id}`) || "[]")
    const sessions = JSON.parse(localStorage.getItem(`sessions_${user.id}`) || "[]")
    additionalInfo = `
            <p><strong>Connected Mentors:</strong> ${connections.length}</p>
            <p><strong>Total Sessions:</strong> ${sessions.length}</p>
        `
  } else if (user.role === "mentor") {
    // Count mentees connected to this mentor
    let menteeCount = 0
    allUsers.forEach((u) => {
      if (u.role === "mentee") {
        const connections = JSON.parse(localStorage.getItem(`connections_${u.id}`) || "[]")
        if (connections.includes(user.id)) {
          menteeCount++
        }
      }
    })
    additionalInfo = `
            <p><strong>Active Mentees:</strong> ${menteeCount}</p>
            <p><strong>Experience:</strong> ${user.experience || "Not specified"} years</p>
        `
  }

  showMessage(
    `
        User Details:
        Name: ${user.firstName} ${user.lastName}
        Email: ${user.email}
        Role: ${user.role}
        Expertise: ${user.expertise}
        ${additionalInfo}
    `,
    "info",
  )
}

function editUser(userId) {
  showMessage("User editing feature coming soon!", "info")
}

function suspendUser(userId) {
  const user = allUsers.find((u) => u.id === userId)
  if (!user) return

  if (confirm(`Are you sure you want to suspend ${user.firstName} ${user.lastName}?`)) {
    showMessage(`User ${user.firstName} ${user.lastName} has been suspended.`, "warning")
    // In a real app, you would update the user's status in the database
  }
}

function exportUsers() {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    "Name,Email,Role,Expertise,Join Date\n" +
    allUsers
      .map(
        (user) =>
          `"${user.firstName} ${user.lastName}","${user.email}","${user.role}","${user.expertise}","${formatDate(user.createdAt)}"`,
      )
      .join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "users_export.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showMessage("Users exported successfully!", "success")
}

function loadAnalytics() {
  // Simulate loading analytics data
  showMessage("Analytics dashboard loaded!", "info")

  // In a real application, you would load actual chart data here
  // For now, we'll just show a message
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function showMessage(message, type = "info") {
  const existingMessages = document.querySelectorAll(".dashboard-message")
  existingMessages.forEach((msg) => msg.remove())

  const messageEl = document.createElement("div")
  messageEl.className = `dashboard-message message-${type}`
  messageEl.innerHTML = message.replace(/\n/g, "<br>")

  messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        ${getMessageColor(type)}
    `

  document.body.appendChild(messageEl)

  setTimeout(() => {
    messageEl.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => messageEl.remove(), 300)
  }, 5000)
}

function getMessageColor(type) {
  switch (type) {
    case "success":
      return "background: #10B981;"
    case "error":
      return "background: #EF4444;"
    case "warning":
      return "background: #F59E0B;"
    case "info":
      return "background: #3B82F6;"
    default:
      return "background: #6B7280;"
  }
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}
