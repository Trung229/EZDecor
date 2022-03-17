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
let storeFile;
let storeId;

const socket = io();


socket.on("deleteProduct",(msg)=>{
    console.log("message real time ",msg);
})

if(inputThumbnail){
    inputThumbnail.addEventListener("change", (e) => {
        console.log("hi");
        const file = e.target.files[0];
        storeFile = file;
        file.preview = URL.createObjectURL(file);
        imgThumbnail.style.display = "block";
        imgThumbnail.setAttribute("src", file.preview);
        inputThumbnail.setAttribute("value", file.preview)
    })
}

if(buttonSubmitForm){
    buttonSubmitForm.addEventListener("click", async () => {
        sharkTank.style.display = "flex";
        const indexValue = inlineFormCustomSelectPref.options.selectedIndex;
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
        }else{
            sharkTank.style.display = "none";
            window.alert(`${sendData.payload.message}`);
        }
    })
    
}

if(deleteButton){
    deleteButton.addEventListener("click", async ()=>{
        const check = await fetch(`/product/deleteProduct`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:storeId})
        })
        .then(res=> res.json())
        .catch(err=> console.log(err));
        if(check.data.payload.status){
            window.location.reload();
        }else{
            alert(check.data.payload.message);
        }
    })    
}

function getId(id){
    storeId = id;
}