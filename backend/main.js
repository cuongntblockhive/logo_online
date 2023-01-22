const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const usersInRoom = {};
const oldNumber = [];
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

io.on("connection", (socket) => {
  socket.on("event", (data) => {
    console.log("event");
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
  socket.on("updateReadyState", (data) => {
    roomData = usersInRoom[data.room];
    // Check name exist or not
    const item = roomData.find((item) => item.name === data.name);
    if (!item) return;
    console.log("itrem", item ,data.state)
    item.state = data.state;
    io.to(data.room).emit("updateDataInRoom", roomData);
    // Check all user in room ready ()
    isAllReady = roomData.every(item => item.state == true)
    if(isAllReady) {
      const index = randomIntFromInterval(0, roomData.length - 1)
      const startCalling = () => {
        // Start game
        const getNumber = () => {
          const number = randomIntFromInterval(1,90)
          const hasCall = oldNumber.find(item => item == number)
          if(hasCall) {
            getNumber()
          }
          return number
        }
        const interval = setInterval(() => {
          const number = getNumber()
          oldNumber.push(number)
          io.to(data.room).emit("callingNumber", oldNumber);
        } , 3000)
      }
      roomData[index].shake = true
      io.to(data.room).emit("readyToPlay", roomData);
      setTimeout(() => {
        startCalling()
      }, 5000)
    }

  });
  socket.on("joinRoom", (data) => {

    socket.join(data.room);
    roomData = usersInRoom[data.room];
    if (roomData && roomData.length > 0) {
      // Check name exist or not
      const item = roomData.find((item) => item.name === data.name);
      if (item) return;
      usersInRoom[data.room] = [
        ...roomData,
        {
          name: data.name,
          state: data.state,
        },
      ];
    } else {
      usersInRoom[data.room] = [
        {
          name: data.name,
          state: data.state,
        },
      ];
    }

    io.to(data.room).emit("updateDataInRoom", usersInRoom[data.room]);
  });
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

server.listen(3001);
