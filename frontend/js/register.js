document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('registerBtn');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const msg = document.getElementById('msg');
  btn.onclick = async () => {
    msg.textContent = 'Creating account...';
    const resp = await fetch(`${API_BASE}/auth/register`, {
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
      msg.textContent = j.error || 'Registration failed';
    }
  };
});
