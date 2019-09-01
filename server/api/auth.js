/**
 * Super secure authentication™ which simply returns whether or not the user is
 * authenticated, rather than returning an auth token or something sane.
 */
module.exports = (app, path, state) => {
  app.post("/api/auth", (request, response) => {
    response.json({
      authenticated: state.getUser(request.body["username"]) !== undefined
    });
  })
};
