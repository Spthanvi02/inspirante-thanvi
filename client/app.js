const API = 'http://localhost:3000/api';

let token = localStorage.getItem('token');
let userRole = localStorage.getItem('role');
let userName = localStorage.getItem('name');

function showPage(page) {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('studentDashboard').classList.add('hidden');
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById(page).classList.remove('hidden');
}

if (token && userRole) {
  if (userRole === 'admin') {
    showPage('adminDashboard');
    document.getElementById('adminName').textContent = userName;
    loadAdminEvents();
  } else {
    showPage('studentDashboard');
    document.getElementById('studentName').textContent = userName;
    loadStudentEvents();
    loadMyRegistrations();
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('loginError');

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message;
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name);

    token = data.token;
    userRole = data.role;
    userName = data.name;

    if (userRole === 'admin') {
      showPage('adminDashboard');
      document.getElementById('adminName').textContent = userName;
      loadAdminEvents();
    } else {
      showPage('studentDashboard');
      document.getElementById('studentName').textContent = userName;
      loadStudentEvents();
      loadMyRegistrations();
    }

  } catch (error) {
    errorEl.textContent = 'Something went wrong. Please try again.';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  token = null;
  userRole = null;
  userName = null;
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('loginError').textContent = '';
  showPage('loginPage');
}

async function loadStudentEvents() {
  try {
    const res = await fetch(`${API}/events`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const events = await res.json();
    const container = document.getElementById('eventsList');
    container.innerHTML = '';

    events.forEach(event => {
      const isFull = event.registeredCount >= event.capacity;
      const date = new Date(event.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });

      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <h3>${event.name}</h3>
        <p>Date: ${date}</p>
        <p>Venue: ${event.venue}</p>
        <p>Capacity: ${event.registeredCount}/${event.capacity}</p>
        ${isFull ? '<span class="full-badge">Full</span>' : ''}
        <button
            onclick="registerForEvent('${event._id}')"
            ${isFull ? 'disabled' : ''}>
            Register
        </button>
        <p id="msg-${event._id}" class="error"></p>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    document.getElementById('eventsList').textContent = 'Failed to load events.';
  }
}

async function registerForEvent(eventId) {
  try {
    const res = await fetch(`${API}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ eventId })
    });

    const data = await res.json();
    const msgEl = document.getElementById(`msg-${eventId}`);

    if (!res.ok) {
      msgEl.textContent = data.message;
      msgEl.className = 'error';
      return;
    }

    msgEl.textContent = 'Registered successfully!';
    msgEl.className = 'success';
    loadStudentEvents();
    loadMyRegistrations();

  } catch (error) {
    document.getElementById(`msg-${eventId}`).textContent = 'Something went wrong.';
  }
}

async function loadMyRegistrations() {
  try {
    const res = await fetch(`${API}/registrations/mine`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const registrations = await res.json();
    const container = document.getElementById('myRegistrations');
    container.innerHTML = '';

    if (registrations.length === 0) {
      container.textContent = 'You have not registered for any events yet.';
      return;
    }

    registrations.forEach(reg => {
      const date = new Date(reg.event.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <h3>${reg.event.name}</h3>
        <p>Date: ${date}</p>
        <p>Venue: ${reg.event.venue}</p>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    document.getElementById('myRegistrations').textContent = 'Failed to load registrations.';
  }
}

async function loadAdminEvents() {
  try {
    const res = await fetch(`${API}/events`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const events = await res.json();
    const container = document.getElementById('adminEventsList');
    container.innerHTML = '';

    events.forEach(event => {
      const percentage = Math.round((event.registeredCount / event.capacity) * 100);
      let colorClass = 'green';
      if (percentage >= 80) colorClass = 'red';
      else if (percentage >= 50) colorClass = 'amber';

      const date = new Date(event.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });

      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <h3>${event.name}</h3>
        <p>Date: ${date}</p>
        <p>Venue: ${event.venue}</p>
        <p>Capacity: ${event.registeredCount}/${event.capacity}</p>
        <div class="capacity-bar ${colorClass}" style="width: ${percentage}%"></div>
        <p class="capacity-text ${colorClass}">${percentage}% filled</p>
        <button onclick="viewRegistrations('${event._id}', '${event.name}')">View Registrations</button>
        <div id="regs-${event._id}"></div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    document.getElementById('adminEventsList').textContent = 'Failed to load events.';
  }
}

async function addNewEvent() {
  const name = document.getElementById('eventName').value;
  const date = document.getElementById('eventDate').value;
  const venue = document.getElementById('eventVenue').value;
  const capacity = document.getElementById('eventCapacity').value;
  const msgEl = document.getElementById('createEventMsg');

  try {
    const res = await fetch(`${API}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, date, venue, capacity: Number(capacity) })
    });

    const data = await res.json();

    if (!res.ok) {
      msgEl.textContent = data.message;
      msgEl.className = 'error';
      return;
    }

    msgEl.textContent = 'Event created successfully!';
    msgEl.className = 'success';
    loadAdminEvents();

  } catch (error) {
    msgEl.textContent = 'Something went wrong.';
  }
}

async function viewRegistrations(eventId, eventName) {
  const container = document.getElementById(`regs-${eventId}`);

  try {
    const res = await fetch(`${API}/events/${eventId}/registrations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const registrations = await res.json();

    if (registrations.length === 0) {
      container.innerHTML = '<p>No registrations yet.</p>';
      return;
    }

    let html = `<h4>Registrations for ${eventName}:</h4><ul>`;
    registrations.forEach(reg => {
      html += `<li>${reg.student.name} (${reg.student.username})</li>`;
    });
    html += '</ul>';
    container.innerHTML = html;

  } catch (error) {
    container.textContent = 'Failed to load registrations.';
  }
}