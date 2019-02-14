const url = require("url");
const fs = require("fs");
const https = require("https");

const PROXY_CONFIG = (() => {
  const proxy = fs.readFileSync(`${process.cwd()}/proxy.json`, "utf-8");
  if (typeof proxy === "string") {
    return JSON.parse(proxy);
  } else {
    return {};
  }
})();

const makeRequest = (path, method, body, headers) => {
  const request = {
    host: PROXY_CONFIG.hostname,
    method,
    port: 443,
    path: `/${path}`
  };

  let data = "";

  return new Promise((resolve, reject) => {
    const req = https.request(request, res => {
      res.setEncoding("utf8");

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(data);
      });
    });

    req.on("error", err => {
      console.log(`Error: ${err}`);
      reject(err);
    });

    req.end();
  });
};

const proxyRequests = (req, res) => {
  // parse the request url
  const parsedURL = url.parse(req.url, true);
  // request method
  const method = req.method;
  console.log(`Request - ${parsedURL.pathname}, method - ${method}`);

  // get the pathname from parsedURL and trim the path for easy search
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  let body = "";

  // collect request body chunk if it's post method
  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    if (method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Request-Method", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.writeHead(200);
      res.end();
    } else {
      makeRequest(trimmedPath, method, body)
        .then(response => {
          //   Set CORS headers
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Request-Method", "*");
          res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
          res.setHeader("Access-Control-Allow-Headers", "*");

          // Return the response
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(response);
        })
        .catch(err => {
          //   Set CORS headers
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Request-Method", "*");
          res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
          res.setHeader("Access-Control-Allow-Headers", "*");
          // Return the response
          res.setHeader("Content-Type", "application/json");
          res.writeHead(500);
          res.end(err);
          res.end();
        });
    }
  });
};

module.exports = proxyRequests;
