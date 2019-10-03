/**
 * Methods which operate on users
 */
module.exports = (app, path, state) => {
  app.get("/api/users/:userid/attributes", (request, response) => {
    state.getUser(request.params.userid)
      .then(resp => response.json(resp))
      .catch(err => response.json({ error: err }));
  });

  app.get("/api/users/:userid/groups", (request, response) => {
    state.getMemberGroups(request.params.userid)
      .then(resp => response.json(resp))
      .catch(err => response.json({ error: err }));
  });

  app.post("/api/users/:userid/profile", (request, response) => {
    state.setUserProfile(request.params.userid, request.body.media_id)
      .then(resp => response.json(resp))
      .catch(err => response.json({ error: err }));
  });

  app.get("/api/users/:userid/profile", (request, response) => {
    state.getUserProfile(request.params.userid)
      .then(resp => response.json(resp))
      .catch(err => response.json({ error: err }));
  })

  app.get("/api/users", (_, response) => {
    state.getUserList()
      .then(resp => response.json(resp))
      .catch(err => response.json({ error: err }));
  });

  app.post("/api/users", (request, response) => {
    state.setUserList(request.body)
      .then(() => response.json({ success: true }))
      .catch(err => response.json({ success: false, error: err }));
  });
}
