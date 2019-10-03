module.exports = {
  connect: function (io, port, state) {
    io.on("connection", socket => {
      console.log(`Socket connected (#${socket.id} on port ${port})`);

      // Client state
      username = null;
      currentGroup = null;
      currentChannel = null;

      socket.on("disconnect", reason => {
        console.log(`Socket disconnected (#${socket.id} on port ${port})`);

        // Only notify on disconnect if the user entered a room to begin with
        if (username === null || currentGroup === null || currentChannel === null) {
          return;
        }

        // Notify other clients that this device has left the room
        io.emit("channel change", {
          name: username,
          group: currentGroup,
          channel: currentChannel,
          direction: "leaving"
        });
      });

      socket.on("chat event", message => {
        // Broadcast incoming messages
        io.emit("chat event", message);

        // Log message in database
        state.logMessage({
          group: currentGroup,
          channel: currentChannel,
          ...message
        });
      });

      socket.on("channel change", message => {
        // Broadcast channel changes, but do not store them permanently
        io.emit("channel change", message);

        if (message.direction == "joining") {
          username = message.name;
          currentGroup = message.group;
          currentChannel = message.channel;
        }
      });
    });
  }
}
