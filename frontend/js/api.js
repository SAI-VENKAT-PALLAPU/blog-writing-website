const API_BASE = 'http://localhost:5000/api';
function getToken(){ return localStorage.getItem('token'); }
function setToken(t){ localStorage.setItem('token', t); }
function clearToken(){ localStorage.removeItem('token'); }
function authHeaders(){
  const t = getToken();
  return t ? { 'Authorization': 'Bearer ' + t } : {};
}
function showAuthUI(){
  const t = getToken();
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutLink = document.getElementById('logoutLink');
  const newLink = document.getElementById('newLink');
  const whoami = document.getElementById('whoami');
  if (t){
    if (loginLink) loginLink.classList.add('hidden');
    if (registerLink) registerLink.classList.add('hidden');
    if (logoutLink) logoutLink.classList.remove('hidden');
    if (newLink) newLink.classList.remove('hidden');
    const u = localStorage.getItem('username') || 'You';
    if (whoami) whoami.textContent = 'Logged in as ' + u;
    if (logoutLink){
      logoutLink.onclick = (e) => { e.preventDefault(); clearToken(); localStorage.removeItem('username'); location.href='index.html'; };
    }
  } else {
    if (loginLink) loginLink.classList.remove('hidden');
    if (registerLink) registerLink.classList.remove('hidden');
    if (logoutLink) logoutLink.classList.add('hidden');
    if (newLink) newLink.classList.add('hidden');
    if (whoami) whoami.textContent = '';
  }
}
document.addEventListener('DOMContentLoaded', showAuthUI);
