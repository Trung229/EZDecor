const buttonSignIn = document.getElementById('LogIn');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const showError = document.getElementById('showError');

function loadLogin() {
    return (fetch(`${document.location.origin}/main?userToken=${localStorage?.getItem('token')}`)
        .then(res => {
            if (!res.redirected) {
                window.location = `${document.location.origin}/main?userToken=${localStorage?.getItem('token')}`
            } else {
                return null;
            }
        }));
}


function handleRequest(email, password) {
    return (fetch(`${document.location.origin}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }).then((res) => { return res.json() }));
}

buttonSignIn.addEventListener('click', async() => {
    const email = inputEmail.value;
    const password = inputPassword.value;
    const checkAccount = await handleRequest(email, password);
    if (checkAccount.status) {
        localStorage.setItem('token', checkAccount.token);
        localStorage.setItem('email', checkAccount.email);
        localStorage.setItem('avatar', checkAccount.avatar);
        localStorage.setItem('id', checkAccount.id);
        window.location = `${document.location.origin}/main?userToken=${checkAccount.token}`;
    } else {
        showError.style.display = "block";
        showError.innerHTML = `${checkAccount.payload.message}`;
    }
})

loadLogin();