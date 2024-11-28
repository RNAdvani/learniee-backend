import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { User } from './models/user.model';
import { Message } from './models/message.model'; // Import the Message model

export const setupSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const userSocketMap = new Map<string, string>();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user connection
    socket.on('user_connected', async (userId: string) => {
      userSocketMap.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      console.log('Status change login:', userId, socket.id);

      io.emit('user_status_change', { userId, isOnline: true });
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {

      console.log('Message received:', data);
      try {
        console.log('Message sent:', data);

        // Save message to the database
        const savedMessage = await Message.create({
          sender: data.sender,
          receiver: data.receiver,
          content: data.content,
          timestamp: new Date(),
        });

        console.log('Message saved to DB:', savedMessage);

        // Emit the message to the receiver
        const receiverSocketId = userSocketMap.get(data.receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', savedMessage);
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Handle typing events
    socket.on('typing', (data) => {
      const receiverSocketId = userSocketMap.get(data.receiver);
      console.log('Typing:', data, receiverSocketId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { userId: data.sender });
      }
    });

    socket.on("stopped_typing", (data) => {
    const receiverSocketId = userSocketMap.get(data.receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_stopped_typing", { userId: data.sender });
    }
  });

    // Handle user disconnection
    socket.on('disconnect', async () => {
      let userId: string | undefined;

      for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
          userId = key;
          break;
        }
      }

      if (userId) {
        userSocketMap.delete(userId);

        await User.findByIdAndUpdate(userId, { isOnline: false,lastOnline: new Date(),updatedAt: new Date() });

        io.emit('user_status_change', { userId, isOnline: false });
        console.log('User disconnected:', userId, socket.id);
      }
    });
  });

  return io;
};
