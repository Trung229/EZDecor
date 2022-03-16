const email = document.querySelector("#userDropdown > span");
const image = document.querySelector("#userDropdown > img");
email.innerHTML = localStorage.getItem("email");
image.setAttribute("src", localStorage.getItem("avatar"));