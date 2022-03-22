const categoryName = document.getElementById("categoryName");
const inputThumbnail = document.getElementById("inputThumbnail");
const imgThumbnail = document.getElementById("imgThumbnail");
const sharkTank = document.getElementById("sharkTank");
const sharkTank_2 = document.getElementById("sharkTank_2");
const buttonAddCategory = document.getElementById("buttonAddCategory");
const deleteButton = document.getElementById("deleteButton");
const alertSuccess = document.getElementById("alertSuccess");
const updateButton = document.getElementById("updateButton");
const inputCategoryNameUpdate = document.getElementById("inputCategoryNameUpdate");
const imgUpdate = document.getElementById("imgUpdate");
const updateInputFile = document.getElementById("updateInputFile");


let storeFile;
let storeId;
let storeFileUpdate;
let storeURLTemp;

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


if (buttonAddCategory) {
    buttonAddCategory.addEventListener("click", async () => {
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

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

async function getDataUpdate(id) {
    storeId = id;
    const data = await fetch("/category/getCategoryDetail", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
        .then((res) => res.json())
        .catch((err) => console.error(err));
    inputCategoryNameUpdate.setAttribute("value", data.name)
    if (isValidURL(data.thumbnail)) {
        imgUpdate.setAttribute("src", data.thumbnail);
        storeURLTemp = data.thumbnail;
    } else {
        imgUpdate.setAttribute("src", "/images/no_data.png");
    }
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

if (updateButton) {
    updateButton.addEventListener('click', async () => {
        sharkTank_2.style.display = "flex";
        let formData = new FormData();
        formData.append("name", inputCategoryNameUpdate.value)
        formData.append("thumbnail", !storeFileUpdate ? storeURLTemp : storeFileUpdate);
        formData.append("id", storeId);
        const sendData = await fetch(`/category/updateCategory`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .catch(err => console.error(err));
        if (sendData.payload.status) {
            sharkTank_2.style.display = "none";
            alertSuccess.style.display = "block";
            window.location.reload();
        } else {
            sharkTank_2.style.display = "none";
            window.alert(`${sendData.payload.message}`);
        }
    })
}