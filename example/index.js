const http = require("http");
const { proxy } = require("../src/index");

http
  .createServer((req, res) => {
    proxy(req, res);
  })
  .listen(3000, () => console.log(`Listening on server 3000`));
