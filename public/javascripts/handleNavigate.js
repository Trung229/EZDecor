let homeButton = document.getElementById("home");
let productButton = document.getElementById("navigate_product");
let styleButton = document.getElementById("navigate_style");
let categoryButton = document.getElementById("navigate_category");
if (homeButton) homeButton.setAttribute("href", `/main?userToken=${localStorage?.getItem('token')}`)
if (productButton) productButton.setAttribute("href", `/product?userToken=${localStorage?.getItem('token')}`);
if (styleButton) styleButton.setAttribute("href", `/style?userToken=${localStorage?.getItem('token')}`);
if (categoryButton) categoryButton.setAttribute("href", `/category?userToken=${localStorage?.getItem('token')}`);