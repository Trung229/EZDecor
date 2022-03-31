const inputGroupImages = document.getElementById("inputGroupImages");
const containerImages = document.getElementById("containerImages");
const sendImages = document.getElementById("sendImages");
const activeImages = document.querySelector(".carousel-item");
const updateCategories = document.getElementById("updateCategories");
const dataCheckbox = document.querySelectorAll(".data-checkbox");
const updateStyle = document.getElementById("updateStyleButton");
const dataCheckboxStyle = document.querySelectorAll(".data-checkboxStyle");
const sharkTank = document.getElementById("sharkTank");

let storeFile;

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