async function loadPosts(){
  try {
    const resp = await fetch(`${API_BASE}/posts`);
    if (!resp.ok) throw new Error('Failed to fetch posts');
    const posts = await resp.json();
    const list = document.getElementById('posts');
    list.innerHTML = '';
    if (!posts.length){
      list.innerHTML = '<div class="card">No posts yet. Be the first to <a href="new.html">write one</a>!</div>';
      return;
    }
    posts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card post-item';
      card.innerHTML = `
        <h3><a href="post.html?id=${p.id}">${p.title}</a></h3>
        <div class="small">By ${p.author} <span class="badge">${new Date(p.created_at).toLocaleString()}</span></div>
        <p>${(p.excerpt || '').replace(/</g,'&lt;').slice(0,200)}...</p>
      `;
      list.appendChild(card);
    });
  } catch (e){
    document.getElementById('posts').innerHTML = `<div class="card">Error: ${e.message}</div>`;
  }
}
document.addEventListener('DOMContentLoaded', loadPosts);
