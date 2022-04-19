const styleName = document.getElementById("styleName");
const styleDescription = document.getElementById("styleDescription");
const inputThumbnail = document.getElementById("inputThumbnail");
const buttonAddStyle = document.getElementById("buttonAddStyle");
const deleteButton = document.getElementById("deleteButton");
const sharkTank = document.getElementById("sharkTank");
const inputCategoryNameUpdate = document.getElementById("inputCategoryNameUpdate");
const imgUpdate = document.getElementById("imgUpdate");
const updateInputFile = document.getElementById("updateInputFile");
const updateButton = document.getElementById("updateButton");
const inputStyleDescription = document.getElementById("inputStyleDescription");
let storeFile;
let storeId;
let storeURLTemp;
let storeFileUpdate;
let storePreviousImage;

// var socket = io.connect();
// console.log(socket);
// socket.on('UpdateStyle', (msg) => {
//     console.log("ok")
// });
// function dispatchEvent() {
//     console.log("ok");
//     socket.on('update', (msg) => console.log(msg));
// }
// dispatchEvent();
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

if (updateInputFile) {
    updateInputFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        storeFileUpdate = file;
        file.preview = URL.createObjectURL(file);
        imgUpdate.setAttribute("src", file.preview);
        updateInputFile.setAttribute("value", file.preview)
    })
}
if (buttonAddStyle) {
    buttonAddStyle.addEventListener("click", async() => {
        console.log("ok:", styleName.value)
        if (styleName.value.length === 0 || styleDescription.value.length === 0) {
            alert("some fields are empty");
        } else {
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


function getId(id) {
    storeId = id;
}

if (deleteButton) {
    deleteButton.addEventListener("click", async() => {
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

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

async function getDataUpdate(id) {
    storeId = id;
    const data = await fetch("/style/getStyleDetail", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        .then((res) => res.json())
        .catch((err) => console.error(err));
    inputCategoryNameUpdate.setAttribute("value", data.name)
    inputStyleDescription.innerHTML = data.description;
    if (isValidURL(data.images)) {
        imgUpdate.setAttribute("src", data.images);
        storeURLTemp = data.images;
        storePreviousImage = imgUpdate.getAttribute("src");
    } else {
        imgUpdate.setAttribute("src", "/images/no_data.png");
    }
}

if (updateButton) {
    updateButton.addEventListener('click', async() => {
        if (inputCategoryNameUpdate.value.length === 0 || inputStyleDescription.value.length === 0) {
            alert("some fields are empty");
        } else {
            sharkTank_2.style.display = "flex";
            let formData = new FormData();
            formData.append("name", inputCategoryNameUpdate.value)
            formData.append("images", !storeFileUpdate ? storeURLTemp : storeFileUpdate);
            formData.append("id", storeId);
            formData.append("description", inputStyleDescription.value)
            const sendData = await fetch(`/style/updateStyle`, {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .catch(err => console.error(err));
            if (sendData.payload.status) {
                sharkTank_2.style.display = "none";
                window.location.reload();
            } else {
                sharkTank_2.style.display = "none";
                window.alert(`${sendData.payload.message}`);
            }
        }
    })
}