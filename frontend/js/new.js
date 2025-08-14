document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('saveBtn');
  const title = document.getElementById('title');
  const content = document.getElementById('content');
  if(!localStorage.getItem('token')){
    alert('Please login first');
    location.href = 'login.html';
    return;
  }
  btn.onclick = async () => {
    const payload = { title: title.value.trim(), content: content.value.trim() };
    if (!payload.title || !payload.content){
      alert('Title and content are required');
      return;
    }
    const resp = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload)
    });
    const j = await resp.json();
    if (resp.ok){
      location.href = `post.html?id=${j.id}`;
    } else {
      alert('Failed to publish: ' + (j.error || resp.statusText));
    }
  };
});
