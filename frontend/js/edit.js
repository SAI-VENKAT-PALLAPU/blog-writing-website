function getParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}
document.addEventListener('DOMContentLoaded', async () => {
  if(!localStorage.getItem('token')){
    alert('Please login first');
    location.href = 'login.html';
    return;
  }
  const id = getParam('id');
  const title = document.getElementById('title');
  const content = document.getElementById('content');
  const btn = document.getElementById('updateBtn');
  const resp = await fetch(`${API_BASE}/posts/${id}`);
  if (!resp.ok){ alert('Post not found'); location.href='index.html'; return; }
  const p = await resp.json();
  title.value = p.title;
  content.value = p.content;
  btn.onclick = async () => {
    const payload = { title: title.value.trim(), content: content.value.trim() };
    const r = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    if (r.ok){ location.href = `post.html?id=${id}`; }
    else { alert('Update failed: ' + (j.error || r.statusText)); }
  };
});
