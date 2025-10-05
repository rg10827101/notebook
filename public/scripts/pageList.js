export async function loadPageList() {
  try {
    const response = await fetch('/list-pages');
    const data = await response.json();

    const listItems = data.map(page => `
      <li class="list-group-item">
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <a href="/pages/${page}" target="_blank">${page}</a>
          <div class="action">
            <button class="btn btn-light" id="sharePage-${page}">Share</button>
            <button class="btn btn-light delete-btn" id="actionDelete-${page}">Delete</button>
          </div>
        </div>
      </li>
    `).join('');

    const pageList = document.getElementById('pageList');
    pageList.innerHTML = listItems;
    document.querySelector("#count").innerText = pageList.children.length;

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const pageName = button.id.replace('actionDelete-', '');
        if (confirm(`Are you sure you want to delete "${pageName}"?`)) {
          try {
            const res = await fetch(`/delete-page/${encodeURIComponent(pageName)}`, { method: 'DELETE' });
            if (res.ok) {
              alert(`"${pageName}" deleted successfully.`);
              button.closest('li')?.remove();
              loadPageList();
            } else {
              alert(`Failed to delete "${pageName}".`);
            }
          } catch (error) {
            console.error('Error deleting page:', error);
          }
        }
      });
    });
  } catch (error) {
    console.error('Error fetching page list:', error);
  }
}
