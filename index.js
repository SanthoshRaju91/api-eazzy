const http = require("http");
const url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

const PORT = process.env.PORT || 3000;
const IS_PROXY = process.env.IS_PROXY || false;

const mapper_service = require("./utils/service_map");
const serviceMaps = mapper_service.mapperCompute();

function makeRequest(url, method = "GET", headers = {}) {
  const request = {
    protocol: "http:",
    method,
    hostname: "risp.hikari.dev.rsc.local",
    path: `${url}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  let data = "";
  return new Promise((resolve, reject) => {
    const req = http.request(request, res => {
      res.setEncoding("utf8");

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        console.log("Resolved data");
        resolve(data);
      });
    });

    req.on("error", err => {
      console.log(`Error`);
      console.log(err);
      reject(err);
    });

    req.end();
  });
}

function proxyRequests(req, res) {
  //parse the request url
  const parsedURL = url.parse(req.url, true);
  // request method
  const method = req.method;
  console.log(`Request - ${parsedURL.pathname}, method - ${method}`);

  // get the pathname from parsedURL and trim the path for easy search
  var path = parsedURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");
  let body = "";

  if (trimmedPath === "auth") {
    trimmedPath = "1.1.5-denis.miller-api-authentication/api/oauth/token";
  }

  // collect request body chuck if it's post method
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
      makeRequest(trimmedPath, method)
        .then(response => {
          // Set CORS headers
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
          console.log(err);
        });
    }
  });
}

function serveRequests(req, res) {
  // parse the request url
  const parsedURL = url.parse(req.url, true);

  // request method
  const method = req.method;
  console.log(`Request - ${parsedURL.pathname}, method - ${method}`);

  // get the pathname from parsedURL and trim the path for easy search
  var path = parsedURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  let response = {};

  // get mapped response from the mapper
  const mapped = mapper_service.getMapped(trimmedPath);

  if (Object.keys(mapped).length > 0) {
    if (mapped.hasOwnProperty("path") && mapped.hasOwnProperty("method")) {
      response = require(`./mocks/${mapped.path}`);
      if (method !== "OPTIONS" && method === mapped["method"]) {
        response = require(`./mocks/${mapped.path}`);
      } else {
        response = {
          message: `Mock's method and the request method are different`
        };
      }
    } else {
      response = {
        message: "Mock mapping to your JSON is invalid"
      };
    }
  }

  // respond to OPTIONS http verb
  if (method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.writeHead(200);
    res.end();
  } else {
    // stringify you repsonse object
    // your response should be in JSON format only.
    const jsonResponse = JSON.stringify(response);

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (trimmedPath === "risp/search/v1/status") {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(401);
      res.end(jsonResponse);
    } else {
      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(jsonResponse);
    }
  }
}

const httpServer = http.createServer((req, res) => {
  if (IS_PROXY) {
    proxyRequests(req, res);
  } else {
    serveRequests(req, res);
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
