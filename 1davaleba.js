// 1) Create a server and handle this route
// /delete-file?filepath=test.txt,  and delete this file,
// if this file does not exists handle some error message.

const http = require("http");
const url = require("url");
const queryString = require("querystring");
const fs = require("fs/promises");

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  if (parsedUrl.pathname === "/delete-file" && req.method === "DELETE") {
    const query = queryString.parse(parsedUrl.query);
    const filepath = query.filepath;

    if (!filepath) {
      res.writeHead(400);
      res.end(
        JSON.stringify({ error: "Filepath query parameter is required" })
      );
      return;
    }

    try {
      await fs.unlink(filepath);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: `file ${filepath} deleted successfully` })
      );
    } catch (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `File ${filepath} not found` }));
      }
    }
  }

  if (parsedUrl.pathname === "/make-file" && req.method === "POST") {
    const query = queryString.parse(parsedUrl.query);
    const filepath = query.filepath;

    if (!filepath) {
      res.writeHead(400);
      res.end(
        JSON.stringify({ error: "File path query parameter is required" })
      );
      return;
    }
    try {
      await fs.writeFile(filepath, "Hello!");
      res.writeHead(200);
      res.end(
        JSON.stringify({ message: `file ${filepath} created succcessfully!` })
      );
    } catch (err) {
      console.err("err" + err);
    }
  }

  if (parsedUrl.pathname === "/rename-file" && req.method === "PATCH") {
    const query = queryString.parse(parsedUrl.query);
    const filepath = query.filepath;
    const newname = query.newname;

    if (!filepath || !newname) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "filepath and newname is required" }));

      return;
    }

    console.log(filepath, newname);

    try {
      await fs.rename(filepath, newname);
      res.writeHead(200);
      res.end(
        JSON.stringify({
          message: `File ${filepath} was renamed to ${newname}`,
        })
      );
    } catch (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `File ${filepath} not found` }));
      }
    }
  }
});

server.listen(4000, () => {
  console.log(`Your server is running on http://localhost:4000`);
});
