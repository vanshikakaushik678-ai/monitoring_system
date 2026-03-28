document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const loginForm = document.getElementById('loginForm');

  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been sent.');
      form.reset();
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login functionality will be connected with backend.');
      loginForm.reset();
    });
  }
});