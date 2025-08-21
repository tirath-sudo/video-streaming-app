// server/socket.js
import http from 'http';
import { Server } from 'socket.io';

let ioInstance = null;
export const getIO = () => ioInstance;

const createSocketServer = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  ioInstance = io;

  io.on("connection", (socket) => {
    // Give the client its own socket id
    socket.emit("me", socket.id);

    // If a socket disconnects, tell others the call ended
    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });

    // Caller starts a call
    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name
      });
    });

    // Callee answers
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });

    // Explicit end-call from client
    socket.on("endCall", ({ to, callId }) => {
      if (to) {
        io.to(to).emit("callEnded", { callId });
      }
      // Also echo to the sender (so both sides tidy up UI)
      socket.emit("callEnded", { callId });
    });

    // Screen share start/stop
    socket.on("startScreenShare", (data) => {
      io.to(data.userId).emit("startScreenShare", data.screenTrack);
    });

    socket.on("stopScreenShare", (data) => {
      io.to(data.userId).emit("stopScreenShare", data.videoTrack);
    });

    // Recording start/stop
    socket.on("startRecording", (data) => {
      io.to(data.userId).emit("startRecording");
    });

    socket.on("stopRecording", (data) => {
      io.to(data.userId).emit("stopRecording");
    });
  });

  return { server, io };
};

export default createSocketServer;
