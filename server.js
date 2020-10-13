const http          = require('http'),
express             = require('express'),
socketio            = require('socket.io'),
formatMessage       = require('./utils/messages'),
UUser               = require('./utils/users')

const app           = express(),
server              = http.createServer(app),
io                  = socketio(server)

const botName       = 'Dygoo'

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = UUser.userJoin(socket.id, username, room)
        
        socket.join(user.room)

        socket.emit('message', formatMessage(botName, 'Welcome to Dygoo!'))

        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`)
        )

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: UUser.getRoomUsers(user.room)
        })
    })

    socket.on('chatMessage', msg => {
        const user = UUser.getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    socket.on('disconnect', () => {
        const user = UUser.userLeave(socket.id)

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            )

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: UUser.getRoomUsers(user.room)
            })
        }
    })
})

const PORT = process.env.PORT || 7000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))