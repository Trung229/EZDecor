
const logOut = document.getElementById("confirm");

logOut.addEventListener("click",() => {
    localStorage.removeItem('token');
    window.location = `${document.location.origin}`
})