document.addEventListener('DOMContentLoaded', () => {
  const totalDevicesEl = document.getElementById('totalDevices');
  const onlineDevicesEl = document.getElementById('onlineDevices');
  const offlineDevicesEl = document.getElementById('offlineDevices');
  const alertsTable = document.getElementById('alertsTable');

  // ------------------------
  // Helper: Show alert popup
  // ------------------------
  function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-popup';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => { alertDiv.remove(); }, 4000);
  }

  // ------------------------
  // Fetch devices from backend
  // ------------------------
  async function fetchDevices() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/devices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch (err) {
      console.error('Error fetching devices:', err);
      return [];
    }
  }

  // ------------------------
  // Fetch alerts from backend
  // ------------------------
  async function fetchAlerts() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch (err) {
      console.error('Error fetching alerts:', err);
      return [];
    }
  }

  // ------------------------
  // Update dashboard
  // ------------------------
  async function updateDashboard() {
    const devices = await fetchDevices();
    const alerts = await fetchAlerts();

    // Update cards
    const total = devices.length;
    const online = devices.filter(d => d.status === 'online').length;
    const offline = devices.filter(d => d.status === 'offline').length;

    totalDevicesEl.textContent = total;
    onlineDevicesEl.textContent = online;
    offlineDevicesEl.textContent = offline;

    // Update Chart.js
    const ctx = document.getElementById('deviceChart').getContext('2d');
    if(window.deviceChartInstance){
      window.deviceChartInstance.data.datasets[0].data = [online, offline];
      window.deviceChartInstance.update();
    } else {
      window.deviceChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Online', 'Offline'],
          datasets: [{
            label: 'Device Status',
            data: [online, offline],
            backgroundColor: ['#4caf50', '#f44336'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // Update alerts table
    alertsTable.innerHTML = '';
    alerts.forEach(alert => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${alert.device}</td><td>${alert.time}</td><td>${alert.alert}</td>`;
      alertsTable.appendChild(row);
      showAlert(`${alert.device}: ${alert.alert}`);
    });
  }

  // Refresh dashboard every 10 seconds
  updateDashboard();
  setInterval(updateDashboard, 10000);
});