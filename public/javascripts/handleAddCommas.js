const inputMoney = document.getElementById("productPrice");


inputMoney.addEventListener("keyup", (e) => {
    if (e.target.value.length !== 0) {
        var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
        inputMoney.value = n.toLocaleString();
    }else{
        inputMoney.value = 0;
    }
})