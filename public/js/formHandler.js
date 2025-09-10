import { loadPageList } from './pageList.js';

export function setupFormHandler() {
  const form = document.getElementById('pageForm');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const html = document.getElementById('html').value;

    try {
      const response = await fetch('/create-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ title, html })
      });

      const result = await response.text();
      alert("Saved successfully");
      console.log(result);
      form.reset();
      loadPageList();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the page.');
    }
  });
}
