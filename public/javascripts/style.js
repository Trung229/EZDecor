const styleName = document.getElementById("styleName");
const styleDescription = document.getElementById("styleDescription");
const inputThumbnail = document.getElementById("inputThumbnail");
const buttonAddStyle = document.getElementById("buttonAddStyle");
const deleteButton = document.getElementById("deleteButton");
const sharkTank = document.getElementById("sharkTank");
let storeFile;
let storeId;

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


if (buttonAddStyle) {
    buttonAddStyle.addEventListener("click", async () => {
        sharkTank.style.display = "flex";
        let formData = new FormData();
        formData.append("name", styleName.value)
        formData.append("description", styleDescription.value)
        formData.append("thumbnail", storeFile);
        const sendData = await fetch(`/style/addStyle`, {
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
        const check = await fetch(`/style/deleteStyle`, {
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