const http = require("http");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/contacts") {
    res.end(JSON.stringify(data.contacts));
    return;
  }

  if (req.url === "/deals") {
    res.end(JSON.stringify(data.deals));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3001, () => {
  console.log("Fake CRM running on http://localhost:3001");
});
