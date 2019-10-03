/**
 * Super secure authentication™ which simply returns whether or not the user is
 * authenticated, rather than returning an auth token or something sane.
 */
module.exports = (app, path, state) => {
  app.post("/api/auth", (request, response) => {
    state.getUser(request.body["username"]).then(user => {
      if (user === undefined) {
        // User does not exist
        response.json({ authenticated: false });
      } else {
        // User exists - check password
        response.json({
          authenticated: request.body["password"] === user.password
        });
      }
    });
  })
};
