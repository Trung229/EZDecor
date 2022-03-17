const categoryName = document.getElementById("categoryName");
const inputThumbnail = document.getElementById("inputThumbnail");
const imgThumbnail = document.getElementById("imgThumbnail");
const sharkTank = document.getElementById("sharkTank");
const buttonAddCategory = document.getElementById("buttonAddCategory");
const deleteButton = document.getElementById("deleteButton");
const alertSuccess = document.getElementById("alertSuccess");

let storeFile;
let storeId;

if (inputThumbnail) {
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


if (buttonAddCategory) {
    buttonAddCategory.addEventListener("click",async () => {
        sharkTank.style.display = "flex";
        let formData = new FormData();
        formData.append("name", categoryName.value)
        formData.append("thumbnail", storeFile);
        const sendData = await fetch(`/category/addCategory`, {
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
    })
}

function getId(id) {
    storeId = id;
}

if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
        const check = await fetch(`/category/deleteCategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: storeId })
        })
            .then(res => res.json())
            .catch(err => console.log(err));
        if (check.data.payload.status) {
            window.location.reload();
        } else {
            alert(check.data.payload.message);
        }
    })
}