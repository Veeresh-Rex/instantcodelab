var usernames = {};
var rooms = [];
var roomAd = {};

module.exports.sock = (server) => {
  const socket = require('socket.io');
  const options = {
    maxHttpBufferSize: 5e7,
  };
  const io = socket(server, options);
  io.sockets.on('connection', (socket) => {
    function updateuser(roomId) {
      let x = roomAd[roomId];
      let arr = [];
      if (x !== undefined) {
        x.forEach((ele) => {
          arr.push(usernames[ele]);
        });

        io.emit('update', arr, roomId);
      }
    }

    socket.on('change-user', (username) => {
      function getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
      }
      let socketid = getKeyByValue(usernames, username);

      io.sockets.in(socketid).emit('personal-ide', username);
    });
    socket.on('getidedata', function (text, user) {
      io.emit('adminsideide', text, user);
    });
    socket.on('userdochange', function (changeData, user) {
      io.emit('userdochangeToadmin', changeData, user);
    });
    socket.on('admindatachang', (username, changeObj) => {
      io.emit('adminsidedata', username, changeObj);
    });
    socket.on('admin-page', (roomId) => {
      updateuser(roomId);
    });
    socket.on('delete-room', (roomId) => {
      rooms = rooms.filter((ele) => ele === roomId);
      io.emit('delete-roomadmin', roomId);
    });

    socket.on('createroom', (roomId, username) => {
      socket.username = username;
      socket.room = roomId;
      usernames[socket.id] = username;
      socket.join(roomId);
      if (!rooms.find((ele) => ele === roomId)) {
        rooms.push(roomId);
        roomAd[roomId] = [socket.id];
      } else {
        roomAd[roomId].push(socket.id);
      }
      updateuser(roomId);
      socket.on('disconnect', () => {
        console.log('disconnected!', socket.username);
        socket.leave(socket.room);
        let index = roomAd[roomId].indexOf(socket.id);
        delete usernames[socket.id];
        delete roomAd[roomId][index];
        updateuser(roomId);
      });
    });
  });
};
