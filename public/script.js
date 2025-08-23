
window.onload = loadPageList;


const pageList = document.querySelector("#pageList");



function loadPageList() {
    fetch('/list-pages')
        .then(response => response.json())
        .then(data => {
            const listItems = data.map(page =>
                `<li class="list-group-item">
                <div style="display:flex; justify-content: space-between; align-items: center;">
                <a href="/pages/${page}" target="_blank">${page}</a>
                    <div class="action">
                    <button class="btn btn-light" id="sharePage-${page}">
                        <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.5 6.5L8.5 10.5" stroke="#000000" stroke-width="1.5"></path><path d="M8.5 13.5L15.5 17.5" stroke="#000000" stroke-width="1.5"></path></svg>
                    </button>
                    <button class="btn btn-light delete-btn" id="actionDelete-${page}">
                        <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    </div>
                </div>
                </li>`
            ).join('');
            document.getElementById('pageList').innerHTML = listItems;
            const numbers = pageList.children.length ? pageList.children.length : 0;
            document.querySelector("#count").innerText = numbers;


            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const buttonId = button.id; // e.g., "actionDelete-hawa.html"
                    const pageName = buttonId.replace('actionDelete-', ''); // Extract "hawa.html"
                    console.warn(pageName);

                    if (confirm(`Are you sure you want to delete "${pageName}"?`)) {
                        fetch(`/delete-page/${encodeURIComponent(pageName)}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (response.ok) {
                                    alert(`"${pageName}" deleted successfully.`);
                                    button.closest('li')?.remove(); // Remove the list item if inside <li>
                                    loadPageList(); // Refresh the list of pages
                                } else {
                                    alert(`Failed to delete "${pageName}".`);
                                }
                            })
                            .catch(error => console.error('Error deleting page:', error));
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching page list:', error));
}


document.getElementById('pageForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const title = document.getElementById('title').value;
    const html = document.getElementById('html').value;

    fetch('/create-page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            title: title,
            html: html
        })
    })
        .then(response => response.text())
        .then(data => {
            alert("Saved successfully"); // Show success message
            console.log(data);
            document.getElementById('pageForm').reset();
            loadPageList(); // Refresh the list of pages
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating the page.');
        });
});






