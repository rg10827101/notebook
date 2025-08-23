
window.onload = loadPageList;


        
function loadPageList() {
    fetch('/list-pages')
        .then(response => response.json())
        .then(data => {
            const listItems = data.map(page => 
                `<li><a href="/pages/${page}" target="_blank">${page}</a></li>`
            ).join('');
            document.getElementById('pageList').innerHTML = listItems;
        })
        .catch(error => console.error('Error fetching page list:', error));
}


 document.getElementById('pageForm').addEventListener('submit', function(event) {
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