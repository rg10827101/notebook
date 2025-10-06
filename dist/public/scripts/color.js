document.querySelector("body").setAttribute("class", "default");


const themeButtons = document.querySelectorAll("#theme-switcher button");
const body = document.querySelector("body");

themeButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove 'active' class from all buttons
    themeButtons.forEach(btn => btn.classList.remove("active"));

    // Add 'active' class to the clicked button
    button.classList.add("active");

    // Set the theme class on the body
    const themeClass = button.getAttribute("data-theme");
    body.className = themeClass;
  });
});

