const http = require("http");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/customers") {
    res.end(JSON.stringify(data.customers));
    return;
  }

  if (req.url === "/orders") {
    res.end(JSON.stringify(data.orders));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3002, () => {
  console.log("Fake shop running on http://localhost:3002");
});
