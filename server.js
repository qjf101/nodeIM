const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const socketio = require('socket.io');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    // pingTimeout: 5000, 
    // pingInterval: 5000
});

const PORT = 3005 || process.env.PORT;

let users = [];
const userIds = {};
const rooms = {
    general: []
};

app.use(cors());
app.use(express.json())

app.get('/users', function (req, res, next) {
	res.json({users, userIds});
    next()
});

app.get('/messages', function (req, res, next) {
	res.json(rooms);
    next()
});

app.post('/addUser', function (req, res, next) {
    const {user, id} = req.body.userData;

    if (id) {
        userIds[id] = user;
    } else {
        users.push(user)
    }
    res.status(200).json(req.body.userData)
});

app.post('/sendMessage', function (req, res, next) {
    const {room, msg} = req.body.msgData;
    rooms[room].push(msg);
    res.status(200).json(req.body.msgData)
});

const removeUser = (user, id) => {
    users = [...users.filter(function(u){
        return u != user;
    })]

    delete userIds[id];
}

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
// });

// Run when client connects
io.on('connection', socket => {
    // Welcome current user
    let welcomeMessage = {timestamp: moment().format('h:mm a'),user: 'chatBot', msg: 'Welcome to nodeIM!'}
    socket.emit('message', welcomeMessage);

    // Broadcast when a user connects
    let connectMessage = {timestamp: moment().format('h:mm a'),user: 'chatBot', msg: `A user has joined the chat`};
    socket.broadcast.emit('userConnection', connectMessage );
    rooms.general.push(connectMessage);

    // Runs when client disconnects
    socket.on('disconnect', () => {
        let disconnectMessage = {timestamp: moment().format('h:mm a'),user: 'chatBot', msg: `${userIds[socket.id]} has left the chat`};
        removeUser(userIds[socket.id], socket.id)
        console.log(` removed user: ${socket.id}`)
        io.emit('userConnection', disconnectMessage);
        rooms.general.push(disconnectMessage);
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        let formattedMessage = {timestamp: moment().format('h:mm a'),user: 'chatBot', ...msg}
        io.emit('message', formattedMessage)
        rooms.general.push(formattedMessage)
    })

})

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

