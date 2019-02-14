const url = require("url");
const { getMapped } = require("./utils");

const mockRequests = (req, res) => {
  // parse the request url
  const parsedURL = url.parse(req.url, true);

  // request method
  const method = req.method;
  console.log(`Request - ${parsedURL.pathname}, method - ${method}`);

  // get the pathname from parsedURL and trim the path for easy search
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  let response = {};

  // get mapped response from the mapper;
  const mapped = getMapped(trimmedPath);

  if (Object.keys(mapped).length > 0) {
    if (mapped.hasOwnProperty("path") && mapped.hasOwnProperty("method")) {
      if (method !== "OPTIONS" && method === mapped["method"]) {
        response = require(`${process.cwd()}/mocks/${mapped.path}`);
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
    // stringify you response object
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
};

module.exports = mockRequests;
