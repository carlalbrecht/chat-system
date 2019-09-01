/**
 * Methods which operate on users
 */
module.exports = (app, path, state) => {
  app.get("/api/users/:userid/attributes", (request, response) => {
    response.json(state.getUser(request.params.userid));
  });
}
