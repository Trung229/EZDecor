const io = require("socket.io")();
const socketapi = {
    io: io
};
// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on('user join', (msg) => {
        console.log(`user ${msg.name} joined in chat`);
        io.emit('infoUser', msg.name);
        socket.on('disconnect', () => {
            console.log("user disconnected: ", msg.name);
            io.emit('user leave', msg.name);
        })
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('someone typing', (msg) => {
        io.emit('confirm typing', msg);
    });

});
// end of socket.io logic

module.exports = socketapi;