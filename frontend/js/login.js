document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('loginBtn');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const msg = document.getElementById('msg');
  btn.onclick = async () => {
    msg.textContent = 'Signing in...';
    const resp = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value.trim(), password: password.value })
    });
    const j = await resp.json();
    if (resp.ok){
      setToken(j.token);
      localStorage.setItem('username', j.username);
      location.href = 'index.html';
    } else {
      msg.textContent = j.error || 'Login failed';
    }
  };
});
