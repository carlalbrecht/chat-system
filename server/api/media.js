const fs = require("fs");
const uuidv4 = require("uuid/v4");
const mime = require("mime-types");

/**
 * Methods which operate on multimedia
 */
module.exports = (app, path, state) => {
  app.post("/api/multipost", (request, response) => {
    const filename = uuidv4();
    const extension = mime.extension(request.headers["content-type"]);
    const filePath = `${path}/media/${filename}.${extension}`;

    // Make media directory, if we are starting for the first time
    fs.mkdir(`${path}/media`, (err) => {
      fs.writeFile(filePath, request.body, (err) => {
        if (err) {
          response.json({ success: false, error: err });
        } else {
          response.json({ success: true, id: filename });
        }
      });
    });
  });
};
