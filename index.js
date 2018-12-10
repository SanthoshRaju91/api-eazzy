const http = require("http");
const url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

const PORT = process.env.PORT || 3000;

const mapper_service = require("./utils/service_map");

const serviceMaps = mapper_service.mapperCompute();

function serveRequests(req, res) {
  // parse the request url
  const parsedURL = url.parse(req.url, true);

  // request method
  const method = req.method;

  // get the pathname from parsedURL and trim the path for easy search
  var path = parsedURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  let response = {};

  // get mapped response from the mapper
  const mapped = mapper_service.getMapped(trimmedPath);

  if (Object.keys(mapped).length > 0) {
    if (mapped.hasOwnProperty("path") && mapped.hasOwnProperty("method")) {
      if (method === mapped["method"]) {
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
  // stringify you repsonse object
  // your response should be in JSON format only.
  const jsonResponse = JSON.stringify(response);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Return the response
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(jsonResponse);
}

const httpServer = http.createServer((req, res) => {
  serveRequests(req, res);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
