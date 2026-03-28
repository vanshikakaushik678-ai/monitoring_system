// Device data (simulate real-time updates)
let devices = [
  {name: "Device 1", status: "online"},
  {name: "Device 2", status: "offline"},
  {name: "Device 3", status: "online"}
];

// Function to update cards
function updateCards() {
  const total = devices.length;
  const online = devices.filter(d => d.status === "online").length;
  const offline = devices.filter(d => d.status === "offline").length;

  document.getElementById('totalDevices').textContent = total;
  document.getElementById('onlineDevices').textContent = online;
  document.getElementById('offlineDevices').textContent = offline;
}

// Function to show alert popups
function showAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert-popup';
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => { alertDiv.remove(); }, 4000);
}

// Example alert simulation
setTimeout(() => showAlert("Device 2 went offline!"), 3000);
setTimeout(() => showAlert("Device 3 temperature is high!"), 6000);

// Chart.js for device status
const ctx = document.getElementById('deviceChart').getContext('2d');
const deviceChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Online', 'Offline'],
    datasets: [{
      label: 'Device Status',
      data: [devices.filter(d => d.status === 'online').length,
             devices.filter(d => d.status === 'offline').length],
      backgroundColor: ['#4caf50', '#f44336'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

updateCards();