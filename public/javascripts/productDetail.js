const inputGroupImages = document.getElementById("inputGroupImages");
const containerImages = document.getElementById("containerImages");
const sendImages = document.getElementById("sendImages");
const activeImages = document.querySelector(".carousel-item");
const updateCategories = document.getElementById("updateCategories");
const dataCheckbox = document.querySelectorAll(".data-checkbox");
const updateStyle = document.getElementById("updateStyleButton");
const dataCheckboxStyle = document.querySelectorAll(".data-checkboxStyle");
const sharkTank = document.getElementById("sharkTank");
const productNameUpdate = document.getElementById("productDetailName");
const productPrice = document.getElementById("InputProductPrice");
const productDetailFileImage = document.getElementById("productDetailFileImage");
const productDetailURLimage = document.getElementById("productDetailURLimage");
const productDetailDescription = document.getElementById("productDetailDescription");
const productDetailInventory = document.getElementById("productDetailInventory");
const updateAllInfo = document.getElementById("updateAllInfo");
const sharkTank2 = document.getElementById("sharkTank2");


let storeFile;

console.log("hi");

if (activeImages) {
    activeImages.classList.add("active");
}

function revokeURL(myURL, container) {
    URL.revokeObjectURL(myURL);
    container.remove();
}

sendImages.addEventListener("click", async() => {
    sharkTank.style.display = "flex";
    let formData = new FormData();
    formData.append("id", localStorage.getItem("productId"));
    const myArr = Array.from(storeFile);
    myArr.map((item) => {
        formData.append("images", item);
    })
    const message = await fetch("/product/updateImagesProduct", {
            method: 'POST',
            body: formData
        })
        .then((res) => res.json())
        .catch(err => console.log(err));
    if (message.result.payload.status) {
        alert(message.result.payload.message);
        sharkTank.style.display = "none";
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {
        alert(message.result.payload.message);
    }
})


inputGroupImages.addEventListener("change", (e) => {
    const newArr = [...e.target.files];
    storeFile = newArr;
    if (e.target.files.length > 100) {
        alert("Chào bạn, Hiện tại do đang sử dụng free server lưu ảnh, nên tụi mình chỉ được đẩy tối đa là 8 tấm một lúc, nếu muốn nhiều hơn hãy nạp tiền cho admin")
    } else {
        newArr.map((item) => {
            let image = document.createElement("img");
            let container = document.createElement("div");
            let myIcon = document.createElement("i");
            item.preview = URL.createObjectURL(item);
            image.setAttribute("src", item.preview);
            image.style.width = 100;
            image.style.height = 100;
            image.style.marginLeft = 10;
            image.style.marginTop = 10;
            myIcon.classList.add("fa", "fa-trash");
            myIcon.style.position = "absolute";
            myIcon.style.right = 0;
            myIcon.style.top = 10;
            myIcon.style.color = "#36b9cc";
            container.style.position = "relative";
            myIcon.style.cursor = "pointer";
            myIcon.addEventListener("click", () => { revokeURL(item.preview, container) });
            container.appendChild(image);
            container.appendChild(myIcon);
            containerImages.appendChild(container);
        })
    }
})

updateCategories.addEventListener("click", () => {
    const newArr = Array.from(dataCheckbox);
    const arrID = newArr.filter((item) => {
        if (item.checked) {
            return { _id: item.value };
        }
    })
    const data = arrID.map((item) => {
        return { _id: item.value }
    })

    const sendingData = {
        id: localStorage.getItem("productId"),
        category: data
    }
    fetch(`${document.location.origin}/product/updateCategories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
    }).
    then((response) => {
            return response.json()
        })
        .then((response) => {
            alert("Upload success !!! ");
            window.location.reload();
        })
        .catch(err => console.error(err))
})

updateStyle.addEventListener("click", () => {
    const newArr = Array.from(dataCheckboxStyle);
    const arrID = newArr.filter((item) => {
        if (item.checked) {
            return { _id: item.value };
        }
    })
    const data = arrID.map((item) => {
        return { _id: item.value }
    })

    const sendingData = {
        id: localStorage.getItem("productId"),
        styleId: data
    }
    fetch(`${document.location.origin}/product/updateStyle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
    }).
    then((response) => {
            return response.json()
        })
        .then((response) => {
            alert("Upload success !!! ");
            window.location.reload();
        })
        .catch(err => console.error(err))
})


if (productDetailFileImage) {
    productDetailFileImage.addEventListener("change", (e) => {
        const file = e.target.files[0];
        storeFile = file;
        file.preview = URL.createObjectURL(file);
        productDetailURLimage.style.display = "block";
        productDetailURLimage.setAttribute("src", file.preview);
        productDetailFileImage.setAttribute("value", file.preview)
    })
}

updateAllInfo.addEventListener("click", async() => {

    sharkTank2.style.display = "flex";
    let formData = new FormData();
    formData.append("name", productNameUpdate.value)
    formData.append("thumbnail", storeFile);
    formData.append("price", productPrice.value);
    formData.append("description", productDetailDescription.value)
    formData.append("inventory", productDetailInventory.value)
    formData.append("id", localStorage.getItem("productId"))
    const sendData = await fetch(`/product/updateProduct`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .catch(err => console.error(err));
    if (sendData.payload.status) {
        sharkTank2.style.display = "none";
        window.location.reload();
    } else {
        sharkTank2.style.display = "none";
        window.alert(`${sendData.payload.message}`);
    }
})