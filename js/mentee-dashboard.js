// Mentee Dashboard Functionality
let currentUser = null;
let allMentors = [];
let myMentors = [];
let sessions = [];
let conversations = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  initializeMenteeDashboard();
});

function initializeMenteeDashboard() {
  // Check authentication
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "mentee") {
    window.location.href = "index.html";
    return;
  }

  // Update user info
  document.getElementById("userName").textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("profileName").textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("profileEmail").textContent = currentUser.email;
  document.getElementById("profileBio").textContent = currentUser.bio || "No bio available";
  document.getElementById("learningGoals").innerHTML = currentUser.learningGoals
    ? currentUser.learningGoals.map(goal => `<li>${goal}</li>`).join("")
    : "<li>No goals set</li>";
  document.getElementById("interests").innerHTML = currentUser.interests
    ? currentUser.interests.map(interest => `<span>${interest}</span>`).join("")
    : "<span>No interests set</span>";

  // Load data
  loadMentors();
  loadMyMentors();
  loadSessions();
  loadConversations();
  updateStats();

  // Initialize navigation
  initializeNavigation();

  // Set minimum date for session scheduling
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("sessionDate");
  if (dateInput) {
    dateInput.min = today;
  }

  // Initialize edit profile form
  initializeEditProfile();
}

function initializeNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("href").substring(1);
      showSection(targetSection);

      document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  updatePageHeader(sectionId);

  // Load section-specific data
  if (sectionId === "find-mentors") {
    displayMentors();
  } else if (sectionId === "my-mentors") {
    displayMyMentors();
  } else if (sectionId === "sessions") {
    displaySessions();
  } else if (sectionId === "messages") {
    displayConversations();
  } else if (sectionId === "profile") {
    updateProfileSection();
  }
}

function updatePageHeader(sectionId) {
  const titles = {
    dashboard: { title: "Dashboard", subtitle: "Welcome back! Here's your learning journey overview." },
    "find-mentors": {
      title: "Find Mentors",
      subtitle: "Discover experienced professionals ready to guide your growth.",
    },
    "my-mentors": { title: "My Mentors", subtitle: "Manage your mentor relationships and connections." },
    sessions: { title: "Sessions", subtitle: "View and manage your mentorship sessions." },
    messages: { title: "Messages", subtitle: "Communicate with your mentors." },
    progress: { title: "Progress", subtitle: "Track your learning progress and achievements." },
    profile: { title: "Profile", subtitle: "Manage your profile information and preferences." },
  };

  const pageInfo = titles[sectionId] || titles["dashboard"];
  document.getElementById("pageTitle").textContent = pageInfo.title;
  document.getElementById("pageSubtitle").textContent = pageInfo.subtitle;
}

function loadMentors() {
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  // Expanded demo mentors list
  if (!users.some((u) => u.role === "mentor")) {
    const demoMentors = [
      {
        id: "mentor1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "mentor",
        expertise: "Web Development, React, JavaScript",
        bio: "Senior developer at Google with 10+ years experience in building scalable web applications.",
        experience: 10,
      },
      {
        id: "mentor2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        role: "mentor",
        expertise: "Data Science, Python, Machine Learning",
        bio: "Data scientist at Microsoft, passionate about AI and data-driven decision making.",
        experience: 8,
      },
      {
        id: "mentor3",
        firstName: "Michael",
        lastName: "Lee",
        email: "michael.lee@example.com",
        role: "mentor",
        expertise: "Mobile Development, Flutter, Dart",
        bio: "Mobile app expert at Meta, specializing in cross-platform development.",
        experience: 6,
      },
      {
        id: "mentor4",
        firstName: "Fatima",
        lastName: "Yusuf",
        email: "fatima.yusuf@example.com",
        role: "mentor",
        expertise: "DevOps, AWS, Docker",
        bio: "DevOps engineer at Amazon, expert in cloud infrastructure and CI/CD pipelines.",
        experience: 7,
      },
      {
        id: "mentor5",
        firstName: "Chinedu",
        lastName: "Okafor",
        email: "chinedu.okafor@example.com",
        role: "mentor",
        expertise: "Backend Development, Node.js, Express",
        bio: "Backend specialist at Andela, focused on building robust APIs.",
        experience: 9,
      },
      {
        id: "mentor6",
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@example.com",
        role: "mentor",
        expertise: "UI/UX Design, F the user to make sure the code works as expectedigma, Adobe XD",
        bio: "UI/UX designer at Spotify, creating intuitive and engaging user experiences.",
        experience: 5,
      },
      {
        id: "mentor7",
        firstName: "David",
        lastName: "Kim",
        email: "david.kim@example.com",
        role: "mentor",
        expertise: "Cloud Computing, Azure, Kubernetes",
        bio: "Cloud architect at IBM, specializing in scalable cloud solutions.",
        experience: 11,
      },
      {
        id: "mentor8",
        firstName: "Linda",
        lastName: "Zhou",
        email: "linda.zhou@example.com",
        role: "mentor",
        expertise: "Cybersecurity, Network Security",
        bio: "Cybersecurity expert at Cisco, focused on protecting digital assets.",
        experience: 12,
      },
      {
        id: "mentor9",
        firstName: "Aisha",
        lastName: "Patel",
        email: "aisha.patel@example.com",
        role: "mentor",
        expertise: "Artificial Intelligence, TensorFlow, Deep Learning",
        bio: "AI researcher at NVIDIA, advancing neural network technologies.",
        experience: 9,
      },
      {
        id: "mentor10",
        firstName: "Carlos",
        lastName: "Rodriguez",
        email: "carlos.rodriguez@example.com",
        role: "mentor",
        expertise: "Game Development, Unity, C#",
        bio: "Game developer at Epic Games, crafting immersive gaming experiences.",
        experience: 7,
      },
      {
        id: "mentor11",
        firstName: "Sophie",
        lastName: "Nguyen",
        email: "sophie.nguyen@example.com",
        role: "mentor",
        expertise: "Frontend Development, Vue.js, TypeScript",
        bio: "Frontend engineer at Atlassian, building dynamic user interfaces.",
        experience: 6,
      },
      {
        id: "mentor12",
        firstName: "Ahmed",
        lastName: "Khan",
        email: "ahmed.khan@example.com",
        role: "mentor",
        expertise: "Database Systems, PostgreSQL, MongoDB",
        bio: "Database administrator at Oracle, optimizing data management systems.",
        experience: 10,
      },
    ];
    users = users.concat(demoMentors);
    localStorage.setItem("users", JSON.stringify(users));
  }

  allMentors = users
    .filter((user) => user.role === "mentor")
    .map((mentor) => ({
      ...mentor,
      rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0-5.0
      reviews: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
      hourlyRate: Math.floor(Math.random() * 100) + 50, // Random rate $50-150
      availability: Math.random() > 0.3 ? "Available" : "Busy",
      company: getRandomCompany(),
      title: getRandomTitle(),
    }));
}

function getRandomCompany() {
  const companies = [
    "Google", "Microsoft", "Apple", "Amazon", "Meta", 
    "Netflix", "Tesla", "Spotify", "Uber", "Airbnb",
    "NVIDIA", "Epic Games", "Atlassian", "Oracle", "IBM"
  ];
  return companies[Math.floor(Math.random() * companies.length)];
}

function getRandomTitle() {
  const titles = [
    "Senior Software Engineer",
    "Lead Developer",
    "Principal Engineer",
    "Engineering Manager",
    "Tech Lead",
    "Senior Product Manager",
    "Data Scientist",
    "DevOps Engineer",
    "AI Researcher",
    "Game Developer",
    "Frontend Engineer",
    "Database Administrator"
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function loadMyMentors() {
  const connections = JSON.parse(localStorage.getItem(`connections_${currentUser.id}`) || "[]");
  myMentors = allMentors.filter((mentor) => connections.includes(mentor.id));
}

function loadSessions() {
  sessions = JSON.parse(localStorage.getItem(`sessions_${currentUser.id}`) || "[]");
}

function loadConversations() {
  conversations = JSON.parse(localStorage.getItem(`conversations_${currentUser.id}`) || "[]");
}

function updateStats() {
  document.getElementById("activeMentorsCount").textContent = myMentors.length;

  const upcomingSessionsContainer = document.getElementById("upcomingSessions");
  if (upcomingSessionsContainer) {
    const upcomingSessions = sessions.filter((session) => new Date(session.date) > new Date()).slice(0, 3);

    if (upcomingSessions.length === 0) {
      upcomingSessionsContainer.innerHTML = `
        <div class="empty-state-small">
          <i class="fas fa-calendar"></i>
          <p>No upcoming sessions</p>
          <button class="btn-primary btn-small" onclick="showSection('find-mentors')">Find a Mentor</button>
        </div>
      `;
    } else {
      upcomingSessionsContainer.innerHTML = upcomingSessions
        .map((session) => {
          const mentor = allMentors.find((m) => m.id === session.mentorId);
          return `
            <div class="session-item">
              <div class="session-info">
                <h4>${session.topic}</h4>
                <p>with ${mentor ? mentor.firstName + " " + mentor.lastName : "Unknown"}</p>
                <span class="session-time">${formatSessionDate(session.date, session.time)}</span>
              </div>
              <button class="btn-primary btn-small" onclick="joinSession('${session.id}')">Join</button>
            </div>
          `;
        })
        .join("");
    }
  }
}

function displayMentors() {
  const mentorsGrid = document.getElementById("mentorsGrid");
  if (!mentorsGrid) return;

  let filteredMentors = allMentors;

  const searchTerm = document.getElementById("mentorSearch")?.value.toLowerCase() || "";
  if (searchTerm) {
    filteredMentors = filteredMentors.filter(
      (mentor) =>
        mentor.firstName.toLowerCase().includes(searchTerm) ||
        mentor.lastName.toLowerCase().includes(searchTerm) ||
        mentor.expertise.toLowerCase().includes(searchTerm) ||
        mentor.company.toLowerCase().includes(searchTerm)
    );
  }

  if (currentFilter !== "all") {
    filteredMentors = filteredMentors.filter((mentor) =>
      mentor.expertise.toLowerCase().includes(currentFilter.toLowerCase())
    );
  }

  if (filteredMentors.length === 0) {
    mentorsGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>No mentors found</h3>
        <p>Try adjusting your search terms or filters</p>
      </div>
    `;
    return;
  }

  mentorsGrid.innerHTML = filteredMentors
    .map(
      (mentor) => `
        <div class="mentor-card">
          <div class="mentor-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="mentor-info">
            <h3>${mentor.firstName} ${mentor.lastName}</h3>
            <p class="mentor-title">${mentor.title} at ${mentor.company}</p>
            <p class="mentor-expertise">${mentor.expertise}</p>
            <div class="mentor-rating">
              ${generateStars(mentor.rating)}
              <span>${mentor.rating} (${mentor.reviews} reviews)</span>
            </div>
            <div class="mentor-details">
              <span class="mentor-rate">$${mentor.hourlyRate}/hour</span>
              <span class="mentor-availability ${mentor.availability.toLowerCase()}">${mentor.availability}</span>
            </div>
          </div>
          <div class="mentor-actions">
            <button class="btn-primary" onclick="connectWithMentor('${mentor.id}')">
              ${myMentors.find((m) => m.id === mentor.id) ? "Connected" : "Connect"}
            </button>
            <button class="btn-secondary" onclick="viewMentorProfile('${mentor.id}')">View Profile</button>
            <button class="btn-secondary contact-btn" onclick="sendMessage('${mentor.id}')">Contact</button>
          </div>
        </div>
      `
    )
    .join("");
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

function searchMentors() {
  displayMentors();
}

function filterMentors(category) {
  currentFilter = category;
  document.querySelectorAll(".filter-tag").forEach((tag) => tag.classList.remove("active"));
  event.target.classList.add("active");
  displayMentors();
}

function connectWithMentor(mentorId) {
  if (myMentors.find((m) => m.id === mentorId)) {
    showMessage("You are already connected with this mentor!", "info");
    return;
  }

  const connections = JSON.parse(localStorage.getItem(`connections_${currentUser.id}`) || "[]");
  connections.push(mentorId);
  localStorage.setItem(`connections_${currentUser.id}`, JSON.stringify(connections));

  const mentor = allMentors.find((m) => m.id === mentorId);
  if (mentor) {
    myMentors.push(mentor);
  }

  const conversation = {
    id: Date.now().toString(),
    mentorId: mentorId,
    menteeId: currentUser.id,
    messages: [
      {
        id: Date.now().toString(),
        senderId: currentUser.id,
        text: `Hi! I'd love to connect and learn from your expertise in ${mentor.expertise}.`,
        timestamp: new Date().toISOString(),
        read: false,
      },
    ],
    lastMessage: new Date().toISOString(),
  };

  conversations.push(conversation);
  localStorage.setItem(`conversations_${currentUser.id}`, JSON.stringify(conversations));

  updateStats();
  showMessage("Successfully connected with mentor! You can now message them.", "success");
  displayMentors();
}

function viewMentorProfile(mentorId) {
  const mentor = allMentors.find((m) => m.id === mentorId);
  if (!mentor) {
    showMessage("Mentor not found.", "error");
    return;
  }

  const modal = document.getElementById("mentorProfileModal");
  const content = document.getElementById("mentorProfileContent");

  content.innerHTML = `
    <div class="mentor-profile-header">
      <div class="mentor-profile-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="mentor-profile-info">
        <h2>${mentor.firstName} ${mentor.lastName}</h2>
        <p class="mentor-profile-title">${mentor.title} at ${mentor.company}</p>
        <div class="mentor-profile-rating">
          ${generateStars(mentor.rating)}
          <span>${mentor.rating} (${mentor.reviews} reviews)</span>
        </div>
        <div class="mentor-profile-details">
          <span class="profile-rate">$${mentor.hourlyRate}/hour</span>
          <span class="profile-availability ${mentor.availability.toLowerCase()}">${mentor.availability}</span>
        </div>
      </div>
      <div class="mentor-profile-actions">
        <button class="btn-primary" onclick="connectWithMentor('${mentor.id}')">
          ${myMentors.find((m) => m.id === mentor.id) ? "Connected" : "Connect"}
        </button>
        <button class="btn-secondary contact-btn" onclick="sendMessage('${mentor.id}')">Message</button>
      </div>
    </div>
    <div class="mentor-profile-content">
      <div class="profile-section">
        <h3>About</h3>
        <p>${mentor.bio || "No bio available"}</p>
      </div>
      <div class="profile-section">
        <h3>Expertise</h3>
        <div class="expertise-tags">
          ${mentor.expertise
            .split(",")
            .map((skill) => `<span class="expertise-tag">${skill.trim()}</span>`)
            .join("")}
        </div>
      </div>
      <div class="profile-section">
        <h3>Experience</h3>
        <p>${mentor.experience || "Not specified"} years of professional experience</p>
      </div>
      <div class="profile-section">
        <h3>Recent Reviews</h3>
        <div class="reviews-list">
          <div class="review-item">
            <div class="review-header">
              <span class="reviewer-name">Anonymous</span>
              <div class="review-rating">${generateStars(5)}</div>
            </div>
            <p>"Excellent mentor with great communication skills and deep technical knowledge."</p>
          </div>
          <div class="review-item">
            <div class="review-header">
              <span class="reviewer-name">Anonymous</span>
              <div class="review-rating">${generateStars(5)}</div>
            </div>
            <p>"Very patient and helpful. Helped me understand complex concepts easily."</p>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "block";
}

function closeMentorProfile() {
  document.getElementById("mentorProfileModal").style.display = "none";
}

function displayMyMentors() {
  const myMentorsGrid = document.getElementById("myMentorsGrid");
  if (!myMentorsGrid) return;

  if (myMentors.length === 0) {
    myMentorsGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-users"></i>
        <h3>No mentors connected yet</h3>
        <p>Start by finding and connecting with mentors</p>
        <button class="btn-primary" onclick="showSection('find-mentors')">Find Mentors</button>
      </div>
    `;
    return;
  }

  myMentorsGrid.innerHTML = myMentors
    .map(
      (mentor) => `
        <div class="my-mentor-card">
          <div class="mentor-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="mentor-info">
            <h3>${mentor.firstName} ${mentor.lastName}</h3>
            <p class="mentor-title">${mentor.title}</p>
            <p class="mentor-company">${mentor.company}</p>
            <div class="mentor-rating">
              ${generateStars(mentor.rating)}
              <span>${mentor.rating}</span>
            </div>
          </div>
          <div class="mentor-actions">
            <button class="btn-primary btn-small" onclick="scheduleSessionWithMentor('${mentor.id}')">
              <i class="fas fa-calendar"></i> Schedule
            </button>
            <button class="btn-secondary btn-small contact-btn" onclick="sendMessage('${mentor.id}')">
              <i class="fas fa-message"></i> Message
            </button>
            <button class="btn-secondary btn-small" onclick="viewMentorProfile('${mentor.id}')">
              <i class="fas fa-eye"></i> Profile
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

function scheduleSessionWithMentor(mentorId) {
  const modal = document.getElementById("scheduleSessionModal");
  const mentorSelect = document.getElementById("sessionMentor");

  mentorSelect.innerHTML =
    '<option value="">Choose a mentor</option>' +
    myMentors.map((mentor) => `<option value="${mentor.id}">${mentor.firstName} ${mentor.lastName}</option>`).join("");

  mentorSelect.value = mentorId;
  modal.style.display = "block";
}

function scheduleNewSession() {
  const modal = document.getElementById("scheduleSessionModal");
  const mentorSelect = document.getElementById("sessionMentor");

  mentorSelect.innerHTML =
    '<option value="">Choose a mentor</option>' +
    myMentors.map((mentor) => `<option value="${mentor.id}">${mentor.firstName} ${mentor.lastName}</option>`).join("");

  modal.style.display = "block";
}

function closeScheduleModal() {
  document.getElementById("scheduleSessionModal").style.display = "none";
}

function handleScheduleSession(event) {
  event.preventDefault();

  const mentorId = document.getElementById("sessionMentor").value;
  const topic = document.getElementById("sessionTopic").value;
  const date = document.getElementById("sessionDate").value;
  const time = document.getElementById("sessionTime").value;
  const duration = document.getElementById("sessionDuration").value;
  const notes = document.getElementById("sessionNotes").value;

  if (!mentorId || !topic || !date || !time) {
    showMessage("Please fill out all required fields.", "error");
    return;
  }

  const session = {
    id: Date.now().toString(),
    mentorId: mentorId,
    menteeId: currentUser.id,
    topic: topic,
    date: date,
    time: time,
    duration: Number.parseInt(duration),
    notes: notes,
    status: "scheduled",
    createdAt: new Date().toISOString(),
  };

  sessions.push(session);
  localStorage.setItem(`sessions_${currentUser.id}`, JSON.stringify(sessions));

  closeScheduleModal();
  showMessage("Session scheduled successfully!", "success");
  updateStats();
  event.target.reset();
}

function displaySessions() {
  showSessionTab("upcoming");
}

function showSessionTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  const sessionsContent = document.getElementById("sessionsContent");
  let filteredSessions = [];

  const now = new Date();

  switch (tab) {
    case "upcoming":
      filteredSessions = sessions.filter(
        (session) => new Date(session.date + "T" + session.time) > now && session.status === "scheduled"
      );
      break;
    case "completed":
      filteredSessions = sessions.filter(
        (session) =>
          session.status === "completed" ||
          (new Date(session.date + "T" + session.time) < now && session.status === "scheduled")
      );
      break;
    case "cancelled":
      filteredSessions = sessions.filter((session) => session.status === "cancelled");
      break;
  }

  if (filteredSessions.length === 0) {
    sessionsContent.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar"></i>
        <h3>No ${tab} sessions</h3>
        <p>${tab === "upcoming" ? "Schedule a session with your mentors" : `No ${tab} sessions found`}</p>
        ${tab === "upcoming" ? '<button class="btn-primary" onclick="scheduleNewSession()">Schedule Session</button>' : ""}
      </div>
    `;
    return;
  }

  sessionsContent.innerHTML = filteredSessions
    .map((session) => {
      const mentor = allMentors.find((m) => m.id === session.mentorId);
      return `
        <div class="session-card">
          <div class="session-header">
            <h3>${session.topic}</h3>
            <span class="session-status ${session.status}">${session.status}</span>
          </div>
          <div class="session-details">
            <p><i class="fas fa-user"></i> ${mentor ? mentor.firstName + " " + mentor.lastName : "Unknown Mentor"}</p>
            <p><i class="fas fa-calendar"></i> ${formatSessionDate(session.date, session.time)}</p>
            <p><i class="fas fa-clock"></i> ${session.duration} minutes</p>
            ${session.notes ? `<p><i class="fas fa-note-sticky"></i> ${session.notes}</p>` : ""}
          </div>
          <div class="session-actions">
            ${
              tab === "upcoming"
                ? `
                  <button class="btn-primary btn-small" onclick="joinSession('${session.id}')">Join Session</button>
                  <button class="btn-secondary btn-small" onclick="rescheduleSession('${session.id}')">Reschedule</button>
                  <button class="btn-danger btn-small" onclick="cancelSession('${session.id}')">Cancel</button>
                `
                : ""
            }
            ${
              tab === "completed"
                ? `
                  <button class="btn-secondary btn-small" onclick="viewSessionNotes('${session.id}')">View Notes</button>
                  <button class="btn-primary btn-small" onclick="rateSession('${session.id}')">Rate Session</button>
                `
                : ""
            }
          </div>
        </div>
      `;
    })
    .join("");
}

function formatSessionDate(date, time) {
  const sessionDate = new Date(date + "T" + time);
  const now = new Date();
  const diffTime = sessionDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today, " + sessionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Tomorrow, " + sessionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays < 7)
    return (
      sessionDate.toLocaleDateString([], { weekday: "long" }) +
      ", " +
      sessionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

  return (
    sessionDate.toLocaleDateString() + ", " + sessionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function joinSession(sessionId) {
  showMessage("Joining session... (This would open video call)", "info");
}

function rescheduleSession(sessionId) {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return;

  const modal = document.getElementById("scheduleSessionModal");
  const mentorSelect = document.getElementById("sessionMentor");
  const topicInput = document.getElementById("sessionTopic");
  const dateInput = document.getElementById("sessionDate");
  const timeInput = document.getElementById("sessionTime");
  const durationSelect = document.getElementById("sessionDuration");
  const notesInput = document.getElementById("sessionNotes");

  mentorSelect.innerHTML =
    '<option value="">Choose a mentor</option>' +
    myMentors.map((mentor) => `<option value="${mentor.id}">${mentor.firstName} ${mentor.lastName}</option>`).join("");
  mentorSelect.value = session.mentorId;
  topicInput.value = session.topic;
  dateInput.value = session.date;
  timeInput.value = session.time;
  durationSelect.value = session.duration;
  notesInput.value = session.notes;

  modal.setAttribute("data-session-id", sessionId);
  modal.style.display = "block";
}

function cancelSession(sessionId) {
  if (confirm("Are you sure you want to cancel this session?")) {
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].status = "cancelled";
      localStorage.setItem(`sessions_${currentUser.id}`, JSON.stringify(sessions));
      showMessage("Session cancelled successfully", "success");
      displaySessions();
    }
  }
}

function viewSessionNotes(sessionId) {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return;

  showMessage(`Session Notes: ${session.notes || "No notes available"}`, "info");
}

function rateSession(sessionId) {
  showMessage("Rating session... (This would open a rating form)", "info");
}

function sendMessage(mentorId) {
  const mentor = allMentors.find((m) => m.id === mentorId);
  if (!mentor) {
    showMessage("Mentor not found.", "error");
    return;
  }

  showSection("messages");
  startConversationWithMentor(mentorId);
}

function displayConversations() {
  const conversationsList = document.getElementById("conversationsList");
  if (!conversationsList) return;

  if (conversations.length === 0) {
    conversationsList.innerHTML = `
      <div class="empty-state-small">
        <i class="fas fa-comments"></i>
        <p>No conversations yet</p>
        <p>Start a conversation by contacting a mentor</p>
      </div>
    `;
    return;
  }

  conversationsList.innerHTML = conversations
    .map((conversation) => {
      const mentor = allMentors.find((m) => m.id === conversation.mentorId);
      const lastMessage = conversation.messages[conversation.messages.length - 1];

      return `
        <div class="conversation-item" onclick="openConversation('${conversation.id}')">
          <div class="conversation-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="conversation-info">
            <h4>${mentor ? mentor.firstName + " " + mentor.lastName : "Unknown"}</h4>
            <p class="last-message">${lastMessage.text.substring(0, 50)}${lastMessage.text.length > 50 ? "..." : ""}</p>
            <span class="message-time">${formatMessageTime(lastMessage.timestamp)}</span>
          </div>
          ${!lastMessage.read && lastMessage.senderId !== currentUser.id ? '<div class="unread-indicator"></div>' : ""}
        </div>
      `;
    })
    .join("");
}

function startConversationWithMentor(mentorId) {
  let conversation = conversations.find((c) => c.mentorId === mentorId);

  if (!conversation) {
    const mentor = allMentors.find((m) => m.id === mentorId);
    conversation = {
      id: Date.now().toString(),
      mentorId: mentorId,
      menteeId: currentUser.id,
      messages: [
        {
          id: Date.now().toString(),
          senderId: currentUser.id,
          text: `Hi ${mentor.firstName}! I'm interested in learning more about ${mentor.expertise}. Can we discuss further?`,
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
      lastMessage: new Date().toISOString(),
    };
    conversations.push(conversation);
    localStorage.setItem(`conversations_${currentUser.id}`, JSON.stringify(conversations));
  }

  displayConversations();
  openConversation(conversation.id);
}

function openConversation(conversationId) {
  const conversation = conversations.find((c) => c.id === conversationId);
  if (!conversation) {
    showMessage("Conversation not found.", "error");
    return;
  }

  const mentor = allMentors.find((m) => m.id === conversation.mentorId);
  const chatArea = document.getElementById("chatArea");

  chatArea.innerHTML = `
    <div class="chat-header">
      <div class="chat-user-info">
        <div class="chat-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="chat-user-details">
          <h3>${mentor ? mentor.firstName + " " + mentor.lastName : "Unknown"}</h3>
          <span class="user-status">${mentor ? mentor.availability : "Offline"}</span>
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
        `
        )
        .join("")}
    </div>
    <div class="chat-input">
      <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="handleMessageKeyPress(event, '${conversationId}')">
      <button class="send-btn" onclick="sendMessageInConversation('${conversationId}')">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  `;

  const chatMessages = document.getElementById("chatMessages");
  chatMessages.scrollTop = chatMessages.scrollHeight;

  conversation.messages.forEach((msg) => {
    if (!msg.read && msg.senderId !== currentUser.id) {
      msg.read = true;
    }
  });
  localStorage.setItem(`conversations_${currentUser.id}`, JSON.stringify(conversations));
  displayConversations();
}

function sendMessageInConversation(conversationId) {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value.trim();

  if (!messageText) {
    showMessage("Please enter a message.", "error");
    return;
  }

  const conversation = conversations.find((c) => c.id === conversationId);
  if (!conversation) {
    showMessage("Conversation not found.", "error");
    return;
  }

  const message = {
    id: Date.now().toString(),
    senderId: currentUser.id,
    text: messageText,
    timestamp: new Date().toISOString(),
    read: false,
  };

  conversation.messages.push(message);
  conversation.lastMessage = message.timestamp;

  localStorage.setItem(`conversations_${currentUser.id}`, JSON.stringify(conversations));

  messageInput.value = "";
  openConversation(conversationId);
  displayConversations();
}

function handleMessageKeyPress(event, conversationId) {
  if (event.key === "Enter") {
    sendMessageInConversation(conversationId);
  }
}

function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

function initializeEditProfile() {
  const editProfileBtn = document.querySelector(".edit-profile-btn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", openEditProfileModal);
  }

  const editProfileForm = document.getElementById("editProfileForm");
  if (editProfileForm) {
    editProfileForm.addEventListener("submit", handleEditProfile);
  }
}

function openEditProfileModal() {
  const modal = document.getElementById("editProfileModal");
  const firstNameInput = document.getElementById("editFirstName");
  const lastNameInput = document.getElementById("editLastName");
  const bioInput = document.getElementById("editBio");
  const goalsInput = document.getElementById("editLearningGoals");
  const interestsInput = document.getElementById("editInterests");

  firstNameInput.value = currentUser.firstName || "";
  lastNameInput.value = currentUser.lastName || "";
  bioInput.value = currentUser.bio || "";
  goalsInput.value = currentUser.learningGoals ? currentUser.learningGoals.join(", ") : "";
  interestsInput.value = currentUser.interests ? currentUser.interests.join(", ") : "";

  modal.style.display = "block";
}

function closeEditProfileModal() {
  document.getElementById("editProfileModal").style.display = "none";
}

function handleEditProfile(event) {
  event.preventDefault();

  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName = document.getElementById("editLastName").value.trim();
  const bio = document.getElementById("editBio").value.trim();
  const learningGoals = document.getElementById("editLearningGoals").value
    .split(",")
    .map((goal) => goal.trim())
    .filter((goal) => goal);
  const interests = document.getElementById("editInterests").value
    .split(",")
    .map((interest) => interest.trim())
    .filter((interest) => interest);

  if (!firstName || !lastName) {
    showMessage("First name and last name are required.", "error");
    return;
  }

  currentUser.firstName = firstName;
  currentUser.lastName = lastName;
  currentUser.bio = bio;
  currentUser.learningGoals = learningGoals;
  currentUser.interests = interests;

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex((u) => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));
  }
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  updateProfileSection();
  closeEditProfileModal();
  showMessage("Profile updated successfully!", "success");
}

function updateProfileSection() {
  document.getElementById("userName").textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("profileName").textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("profileEmail").textContent = currentUser.email;
  document.getElementById("profileBio").textContent = currentUser.bio || "No bio available";
  document.getElementById("learningGoals").innerHTML = currentUser.learningGoals
    ? currentUser.learningGoals.map(goal => `<li>${goal}</li>`).join("")
    : "<li>No goals set</li>";
  document.getElementById("interests").innerHTML = currentUser.interests
    ? currentUser.interests.map(interest => `<span>${interest}</span>`).join("")
    : "<span>No interests set</span>";
}

function showMessage(message, type = "info") {
  const existingMessages = document.querySelectorAll(".dashboard-message");
  existingMessages.forEach((msg) => msg.remove());

  const messageEl = document.createElement("div");
  messageEl.className = `dashboard-message message-${type}`;
  messageEl.textContent = message;

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
      return "background: #10B981;";
    case "error":
      return "background: #EF4444;";
    case "warning":
      return "background: #F59E0B;";
    case "info":
      return "background: #3B82F6;";
    default:
      return "background: #6B7280;";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

window.addEventListener("click", (event) => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});