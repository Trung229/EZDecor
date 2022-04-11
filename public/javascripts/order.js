let orderID;
let userID;

const allowButton = document.getElementById("allowButton");

allowButton.addEventListener("click", async() => {
    const check = await fetch("/order/updateStatus", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": orderID,
                "user_id": userID
            })
        })
        .then((res) => res.json())
        .catch((err) => console.error(err))
    alert(check.status);
    window.location.reload();

})

function getId(order, customerID) {
    orderID = order;
    userID = customerID;
}