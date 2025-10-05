export async function loadPage(page) {
  try {
    const response = await fetch(page);
    const data = await response.text();
    document.getElementById('currPage').innerHTML = data;
  } catch (error) {
    document.getElementById('currPage').innerHTML = "<p>Error loading page.</p>";
    console.error("Error loading page:", error);
  }
}
