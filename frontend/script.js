const BASE = "http://127.0.0.1:5000";

// 🔐 LOGIN
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials ❌");
  }
}

// 🔐 SIGNUP
async function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE + "/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  });

  const data = await res.json();

  alert(data.msg);
  window.location.href = "login.html";
}

// 📊 FETCH LOGS
async function fetchLogs() {
  const token = localStorage.getItem("token");

  if (!token) return;

  const res = await fetch(BASE + "/logs", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  const container = document.getElementById("logs");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(log => {
    const div = document.createElement("div");
    div.className = "log";
    div.innerHTML = `
      <b>App:</b> ${log[0]} <br>
      <b>Time:</b> ${log[1]}
    `;
    container.appendChild(div);
  });
}

// 🔁 AUTO REFRESH
setInterval(fetchLogs, 3000);

// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}