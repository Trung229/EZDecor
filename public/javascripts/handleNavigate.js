console.log("start");
let homeButton = document.getElementById("home");
let productButton = document.getElementById("navigate_product");
let styleButton = document.getElementById("navigate_style");
let categoryButton = document.getElementById("navigate_category");
homeButton?.setAttribute("href",`/main?userToken=${localStorage?.getItem('token')}`)
productButton?.setAttribute("href",`/product?userToken=${localStorage?.getItem('token')}`);
styleButton?.setAttribute("href",`/style?userToken=${localStorage?.getItem('token')}`);
categoryButton?.setAttribute("href",`/category?userToken=${localStorage?.getItem('token')}`);