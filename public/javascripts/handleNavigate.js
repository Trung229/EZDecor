console.log("start");
let homeButton = document.getElementById("home");
let productButton = document.getElementById("navigate_product");
homeButton.setAttribute("href",`/main?userToken=${localStorage?.getItem('token')}`)
productButton.setAttribute("href",`/product?userToken=${localStorage?.getItem('token')}`);