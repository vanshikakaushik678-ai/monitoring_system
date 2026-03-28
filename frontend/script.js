document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const loginForm = document.getElementById('loginForm');

  // ------------------------
  // Contact Form Submission
  // ------------------------
  if(contactForm){
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('input[name="name"]').value;
      const email = contactForm.querySelector('input[name="email"]').value;
      const message = contactForm.querySelector('textarea[name="message"]').value;

      try {
        const res = await fetch('http://127.0.0.1:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();
        if(data.success){
          alert('✅ Message sent successfully!');
          contactForm.reset();
        } else {
          alert('❌ Failed to send message. Try again.');
        }
      } catch (err) {
        console.error(err);
        alert('⚠️ Error connecting to server.');
      }
    });
  }

  // ------------------------
  // Login Form Submission
  // ------------------------
  if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = loginForm.querySelector('input[name="username"]').value;
      const password = loginForm.querySelector('input[name="password"]').value;

      try {
        const res = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if(res.ok){
          // Save JWT token in localStorage
          localStorage.setItem('token', data.token);
          alert('✅ Login successful!');
          window.location.href = 'dashboard.html';
        } else {
          alert(data.msg || '❌ Invalid credentials');
        }
      } catch (err) {
        console.error(err);
        alert('⚠️ Error connecting to server.');
      }
    });
  }
});