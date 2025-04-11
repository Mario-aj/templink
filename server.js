import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import { createRoom } from "./src/socket/handlers";

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
      createRoom(socket, data, (response) => {
        socket.emit("room-created", response);
      })
    );
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
