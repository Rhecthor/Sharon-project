// Mentor Dashboard Functionality
let currentUser = null
let myMentees = []
let sessions = []
let conversations = []

document.addEventListener("DOMContentLoaded", () => {
  initializeMentorDashboard()
})

function initializeMentorDashboard() {
  // Check authentication
  currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || currentUser.role !== "mentor") {
    window.location.href = "index.html"
    return
  }

  // Update user info
  document.getElementById("userName").textContent = `${currentUser.firstName} ${currentUser.lastName}`

  // Load data
  loadMyMentees()
  loadSessions()
  loadConversations()
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
  if (sectionId === "my-mentees") {
    displayMentees()
  } else if (sectionId === "sessions") {
    displaySessions()
  } else if (sectionId === "messages") {
    displayConversations()
  }
}

function updatePageHeader(sectionId) {
  const titles = {
    dashboard: { title: "Mentor Dashboard", subtitle: "Welcome back! Here's your mentoring overview." },
    "my-mentees": { title: "My Mentees", subtitle: "Manage your mentee relationships and track their progress." },
    sessions: { title: "Sessions", subtitle: "View and manage your mentorship sessions." },
    messages: { title: "Messages", subtitle: "Communicate with your mentees." },
    availability: { title: "Availability", subtitle: "Manage your availability and time slots." },
    earnings: { title: "Earnings", subtitle: "Track your earnings and payment history." },
    profile: { title: "Profile", subtitle: "Manage your mentor profile and expertise." },
  }

  const pageInfo = titles[sectionId] || titles["dashboard"]
  document.getElementById("pageTitle").textContent = pageInfo.title
  document.getElementById("pageSubtitle").textContent = pageInfo.subtitle
}

function loadMyMentees() {
  // Get all users and find mentees connected to this mentor
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const allMentees = users.filter((user) => user.role === "mentee")

  // Get connections where mentees have connected to this mentor
  myMentees = []
  allMentees.forEach((mentee) => {
    const connections = JSON.parse(localStorage.getItem(`connections_${mentee.id}`) || "[]")
    if (connections.includes(currentUser.id)) {
      myMentees.push({
        ...mentee,
        progress: Math.floor(Math.random() * 100), // Random progress for demo
        lastSession: getRandomDate(),
        totalSessions: Math.floor(Math.random() * 20) + 1,
      })
    }
  })
}

function getRandomDate() {
  const days = Math.floor(Math.random() * 30) + 1
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function loadSessions() {
  // Load sessions where this mentor is involved
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
  sessions = []

  allUsers.forEach((user) => {
    if (user.role === "mentee") {
      const userSessions = JSON.parse(localStorage.getItem(`sessions_${user.id}`) || "[]")
      const mentorSessions = userSessions.filter((session) => session.mentorId === currentUser.id)
      sessions.push(...mentorSessions)
    }
  })
}

function loadConversations() {
  // Load conversations where this mentor is involved
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
  conversations = []

  allUsers.forEach((user) => {
    if (user.role === "mentee") {
      const userConversations = JSON.parse(localStorage.getItem(`conversations_${user.id}`) || "[]")
      const mentorConversations = userConversations.filter((conv) => conv.mentorId === currentUser.id)
      conversations.push(
        ...mentorConversations.map((conv) => ({
          ...conv,
          menteeId: user.id,
          menteeName: `${user.firstName} ${user.lastName}`,
        })),
      )
    }
  })
}

function updateStats() {
  // Update dashboard stats
  const upcomingSessions = sessions.filter((session) => new Date(session.date) > new Date()).length
  const completedSessions = sessions.filter(
    (session) =>
      session.status === "completed" ||
      (new Date(session.date + "T" + session.time) < new Date() && session.status === "scheduled"),
  ).length

  // Update stat numbers (you can customize these)
  const statNumbers = document.querySelectorAll(".stat-number")
  if (statNumbers.length >= 4) {
    statNumbers[0].textContent = myMentees.length // Active Mentees
    statNumbers[1].textContent = upcomingSessions // Sessions This Month
    statNumbers[2].textContent = "4.9" // Average Rating
    statNumbers[3].textContent = "$" + (myMentees.length * 150 + Math.floor(Math.random() * 500)) // Monthly Earnings
  }
}

function displayMentees() {
  const menteesGrid = document.getElementById("menteesGrid")
  if (!menteesGrid) return

  if (myMentees.length === 0) {
    menteesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No mentees yet</h3>
                <p>Mentees will appear here when they connect with you</p>
            </div>
        `
    return
  }

  menteesGrid.innerHTML = myMentees
    .map(
      (mentee) => `
        <div class="mentee-card">
            <div class="mentee-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="mentee-info">
                <h3>${mentee.firstName} ${mentee.lastName}</h3>
                <p class="mentee-goal">Learning ${mentee.expertise}</p>
                <div class="mentee-progress">
                    <span>Progress: ${mentee.progress}%</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${mentee.progress}%"></div>
                    </div>
                </div>
                <p class="last-session">Last session: ${formatLastSession(mentee.lastSession)}</p>
                <p class="total-sessions">Total sessions: ${mentee.totalSessions}</p>
            </div>
            <div class="mentee-actions">
                <button class="btn-primary btn-small" onclick="scheduleSessionWithMentee('${mentee.id}')">Schedule Session</button>
                <button class="btn-secondary btn-small" onclick="sendMessageToMentee('${mentee.id}')">Send Message</button>
                <button class="btn-secondary btn-small" onclick="viewMenteeProgress('${mentee.id}')">View Progress</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function formatLastSession(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function scheduleSessionWithMentee(menteeId) {
  showMessage("Session scheduling feature coming soon!", "info")
}

function sendMessageToMentee(menteeId) {
  showSection("messages")
  // Find or create conversation with this mentee
  const conversation = conversations.find((c) => c.menteeId === menteeId)
  if (conversation) {
    openConversation(conversation.id)
  }
}

function viewMenteeProgress(menteeId) {
  const mentee = myMentees.find((m) => m.id === menteeId)
  if (mentee) {
    showMessage(`${mentee.firstName}'s progress: ${mentee.progress}% complete`, "info")
  }
}

function displaySessions() {
  // Similar to mentee dashboard but from mentor perspective
  showMessage("Sessions management coming soon!", "info")
}

function displayConversations() {
  const conversationsList = document.getElementById("conversationsList")
  if (!conversationsList) return

  if (conversations.length === 0) {
    conversationsList.innerHTML = `
            <div class="empty-state-small">
                <i class="fas fa-comments"></i>
                <p>No conversations yet</p>
            </div>
        `
    return
  }

  conversationsList.innerHTML = conversations
    .map((conversation) => {
      const lastMessage = conversation.messages[conversation.messages.length - 1]

      return `
            <div class="conversation-item" onclick="openConversation('${conversation.id}')">
                <div class="conversation-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="conversation-info">
                    <h4>${conversation.menteeName}</h4>
                    <p class="last-message">${lastMessage ? lastMessage.text.substring(0, 50) + "..." : "No messages yet"}</p>
                    <span class="message-time">${lastMessage ? formatMessageTime(lastMessage.timestamp) : ""}</span>
                </div>
            </div>
        `
    })
    .join("")
}

function openConversation(conversationId) {
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return

  const chatArea = document.getElementById("chatArea")

  chatArea.innerHTML = `
        <div class="chat-header">
            <div class="chat-user-info">
                <div class="chat-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="chat-user-details">
                    <h3>${conversation.menteeName}</h3>
                    <span class="user-status">Online</span>
                </div>
            </div>
        </div>
        <div class="chat-messages" id="chatMessages">
            ${conversation.messages
              .map(
                (message) => `
                <div class="message ${message.senderId === currentUser.id ? "sent" : "received"}">
                    <div class="message-content">
                        <p>${message.text}</p>
                        <span class="message-timestamp">${formatMessageTime(message.timestamp)}</span>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        <div class="chat-input">
            <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="handleMessageKeyPress(event, '${conversationId}')">
            <button class="send-btn" onclick="sendMessageInConversation('${conversationId}')">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `

  // Scroll to bottom
  const chatMessages = document.getElementById("chatMessages")
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function sendMessageInConversation(conversationId) {
  const messageInput = document.getElementById("messageInput")
  const messageText = messageInput.value.trim()

  if (!messageText) return

  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return

  const message = {
    id: Date.now().toString(),
    senderId: currentUser.id,
    text: messageText,
    timestamp: new Date().toISOString(),
    read: false,
  }

  conversation.messages.push(message)

  // Update the mentee's conversation in their localStorage
  const menteeConversations = JSON.parse(localStorage.getItem(`conversations_${conversation.menteeId}`) || "[]")
  const menteeConvIndex = menteeConversations.findIndex((c) => c.id === conversationId)
  if (menteeConvIndex !== -1) {
    menteeConversations[menteeConvIndex].messages.push(message)
    localStorage.setItem(`conversations_${conversation.menteeId}`, JSON.stringify(menteeConversations))
  }

  messageInput.value = ""
  openConversation(conversationId)
}

function handleMessageKeyPress(event, conversationId) {
  if (event.key === "Enter") {
    sendMessageInConversation(conversationId)
  }
}

function formatMessageTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

function showMessage(message, type = "info") {
  const existingMessages = document.querySelectorAll(".dashboard-message")
  existingMessages.forEach((msg) => msg.remove())

  const messageEl = document.createElement("div")
  messageEl.className = `dashboard-message message-${type}`
  messageEl.textContent = message

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
        max-width: 300px;
        ${getMessageColor(type)}
    `

  document.body.appendChild(messageEl)

  setTimeout(() => {
    messageEl.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => messageEl.remove(), 300)
  }, 3000)
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
