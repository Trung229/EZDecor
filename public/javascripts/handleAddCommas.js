const inputMoney = document.getElementById("InputProductPrice");


if(inputMoney){
    inputMoney.addEventListener("keyup", (e) => {
        if (e.target.value.length !== 0) {
            var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
            inputMoney.value = n.toLocaleString();
        }else{
            inputMoney.value = 0;
        }
    })
}else{
    console.log("not this page")
}