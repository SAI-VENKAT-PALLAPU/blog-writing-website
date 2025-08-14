function getParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}
async function loadPost(){
  const id = getParam('id');
  if (!id) { location.href = 'index.html'; return; }
  try {
    const resp = await fetch(`${API_BASE}/posts/${id}`);
    if (!resp.ok) throw new Error('Post not found');
    const p = await resp.json();
    document.getElementById('title').textContent = p.title;
    document.getElementById('author').textContent = p.author;
    document.getElementById('created_at').textContent = new Date(p.created_at).toLocaleString();
    document.getElementById('content').textContent = p.content;
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username && username === p.author){
      const editLink = document.getElementById('editLink');
      const deleteBtn = document.getElementById('deleteBtn');
      editLink.classList.remove('hidden');
      editLink.href = `edit.html?id=${p.id}`;
      deleteBtn.classList.remove('hidden');
      deleteBtn.onclick = async () => {
        if (!confirm('Delete this post?')) return;
        const resp = await fetch(`${API_BASE}/posts/${p.id}`, {
          method: 'DELETE',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' }
        });
        if (resp.ok){ location.href = 'index.html'; }
        else {
          const j = await resp.json().catch(()=>({error:'error'}));
          alert('Delete failed: ' + (j.error || resp.statusText));
        }
      };
    }
  } catch (e){
    document.body.innerHTML = `<div class="container"><div class="card">Error: ${e.message}</div></div>`;
  }
}
document.addEventListener('DOMContentLoaded', loadPost);
