const COOKIE_NAME = 'ecommerce_test_session';
const COOKIE_DAYS = 30;

function setCookie(value) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}

function getCookie() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function getCurrentUser() {
  try {
    const stored = localStorage.getItem('currentUser') || getCookie();
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user) {
  const value = JSON.stringify(user);
  localStorage.setItem('currentUser', value);
  setCookie(value);
}

export function logout() {
  localStorage.removeItem('currentUser');
  clearCookie();
  window.location.href = 'login.html';
}
