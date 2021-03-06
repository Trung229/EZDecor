const inputThumbnail = document.getElementById("inputThumbnail");
const imgThumbnail = document.getElementById("imgThumbnail")
const productName = document.getElementById("InputProductName");
const productPrice = document.getElementById("InputProductPrice");
const inputDescription = document.getElementById("inputDescription");
const productNumber = document.getElementById("productNumber");
const inlineFormCustomSelectPref = document.getElementById("inlineFormCustomSelectPref");
const buttonSubmitForm = document.getElementById("buttonSubmitForm");
const sharkTank = document.getElementById("sharkTank");
const alertSuccess = document.getElementById("alertSuccess");
const alertDanger = document.getElementById("alertDanger");
const deleteButton = document.getElementById("deleteButton");
const confirmDelete = document.getElementById("confirmDelete");
const buttonProductDetail = document.querySelectorAll(".buttonProductDetail");
const sharkTankInDelete = document.getElementById("sharkTankInDelete");
let storeFile;
let storeId;

console.log(inlineFormCustomSelectPref.options);
if (inputThumbnail) {
    inputThumbnail.addEventListener("change", (e) => {
        const file = e.target.files[0];
        storeFile = file;
        file.preview = URL.createObjectURL(file);
        imgThumbnail.style.display = "block";
        imgThumbnail.setAttribute("src", file.preview);
        inputThumbnail.setAttribute("value", file.preview)
    })
}

if (buttonSubmitForm) {
    buttonSubmitForm.addEventListener("click", async () => {
        const indexValue = inlineFormCustomSelectPref.options.selectedIndex;
        if (productName.value.length === 0 || productPrice.value.length === 0 || inputDescription.value.length === 0) {
            alert("some fields are empty")
        } else if (!inlineFormCustomSelectPref.options[indexValue]) {
            alert("Please, country is required")
        } else if (productNumber.value == 0) {
            alert("Please, select number of product")
        } else {
            sharkTank.style.display = "flex";
            let formData = new FormData();
            formData.append("name", productName.value)
            formData.append("price", productPrice.value)
            formData.append("description", inputDescription.value)
            formData.append("inventory", productNumber.value)
            formData.append("origin", inlineFormCustomSelectPref.options[indexValue].text)
            formData.append("thumbnail", storeFile)
            formData.append("admin", localStorage.getItem("id"))
            const sendData = await fetch(`/product/addProduct`, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .catch(err => console.error(err));
            if (sendData.payload.status) {
                sharkTank.style.display = "none";
                alertSuccess.style.display = "block";
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                sharkTank.style.display = "none";
                window.alert(`${sendData.payload.message}`);
            }
        }
    })

}
if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
        sharkTankInDelete.style.display = "flex";
        const check = await fetch(`/product/deleteProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: storeId })
        })
            .then(res => res.json())
            .catch(err => console.log(err));
        if (check.data.payload.status) {
            sharkTankInDelete.style.display = "none";
            window.location.reload();
        } else {
            alert(check.data.payload.message);
        }
    })
}

function getId(id) {
    storeId = id;
}



function getProductId(id) {
    localStorage.setItem('productId', id);
    if (buttonProductDetail) {
        buttonProductDetail.forEach((item) => {
            item.setAttribute("href", `/product/productDetail/${localStorage?.getItem('productId')}?userToken=${localStorage?.getItem('token')}`);
        })
    }
}