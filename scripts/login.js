import { saveCurrentUser, getCurrentUser } from '../data/auth.js';

if (getCurrentUser()) {
  window.location.href = 'index.html';
}

const params = new URLSearchParams(window.location.search);
if (params.get('registered')) {
  document.querySelector('.js-success-message').textContent =
    'Account created successfully. Please sign in.';
}

document.querySelector('.js-login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('.js-email').value.trim();
  const password = document.querySelector('.js-password').value;
  const errorEl = document.querySelector('.js-error-message');

  errorEl.textContent = '';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      saveCurrentUser({ id: data.id, name: data.name, email: data.email });
      window.location.href = 'index.html';
    } else {
      errorEl.textContent = data.error || 'Incorrect email or password.';
    }
  } catch {
    errorEl.textContent = 'An error occurred. Please try again.';
  }
});
