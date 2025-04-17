import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import { createRoom, getRoom, sendAnswer } from "./src/socket/handlers";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({
  dev,
  hostname,
  port,
  turbopack: true,
  conf: { allowedDevOrigins: ["*"] },
});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("create-room", (data) =>
      createRoom(data, (response) => {
        socket.emit("room-created", response);
      })
    );

    socket.on("get-room", (data) =>
      getRoom(data, (response) => {
        socket.emit("get-room-response", response);
      })
    );

    socket.on("create-answer", (data) => {
      sendAnswer(data, (response) => {
        console.log("Answer sent:", response);
      });
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
