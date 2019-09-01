/**
 * Methods which operate on users
 */
module.exports = (app, path, state) => {
  app.get("/api/users/:userid/attributes", (request, response) => {
    response.json(state.getUser(request.params.userid));
  });

  app.get("/api/users", (_, response) => {
    response.json(state.getUserList());
  })

  app.post("/api/users", (request, response) => {
    response.json({ success: state.setUserList(request.body) });
  })
}
