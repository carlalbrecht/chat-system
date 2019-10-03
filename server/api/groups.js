/**
 * Methods which operate on groups
 */
module.exports = (app, path, state) => {
  app.post("/api/groups/create", (request, response) => {
    state.createGroup(request.body["name"], request.body["creator"])
      .then(() => response.json({ success: true }))
      .catch(() => response.json({ success: false }));
  });

  app.delete("/api/groups/:groupID", (request, response) => {
    state.removeGroup(request.params.groupID)
      .then(() => response.json({ success: true }))
      .catch(() => response.json({ success: false }));
  });

  app.get("/api/groups/:groupID/channels", (request, response) => {
    state.getChannels(request.params.groupID)
      .then(data => response.json(data))
      .catch(() => response.json({ success: false }));
  });

  app.post("/api/groups/:groupID/assistants", (request, response) => {
    state.setAssistants(request.params.groupID, request.body["assistants"])
      .then(() => response.json({ success: true }))
      .catch(() => response.json({ success: false }));
  });

  app.post("/api/groups/:groupID/channels/create", (request, response) => {
    state.createChannel(request.params.groupID, request.body["name"])
      .then(() => response.json({ success: true }))
      .catch(() => response.json({ success: false }));
  });

  app.delete("/api/groups/:groupID/channels/:channelID", (request, response) => {
    state.removeChannel(request.params.groupID, request.params.channelID)
      .then(() => response.json({ success: true }))
      .catch(() => response.json({ success: false }));
  });

  app.post("/api/groups/:groupID/channels/:channelID/adduser", (request, response) => {
    state.addUserToChannel(request.params.groupID, request.params.channelID, request.body["username"])
      .then(() => response.json({ success: true }))
      .catch(() => response.json({ success: false }));
  });

  app.post("/api/groups/:groupID/channels/:channelID/removeuser", (request, response) => {
    state.removeUserFromChannel(request.params.groupID, request.params.channelID, request.body["username"])
      .then(() => response.json({ success: true }))
      .catch(() => response.json({ success: false }));
  });
};
