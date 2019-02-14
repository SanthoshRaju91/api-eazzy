const axios = require("axios");
const get = require("lodash.get");

function makeRequest(url = "", method = "GET", data, headers = {}) {
  if (url) {
    axios({
      method,
      url,
      data,
      headers
    })
      .then(response => {
        const data = response.data;
        const content = get(data, "response.items");

        if (content) {
          console.log(JSON.stringify(content, 4, 4));
        } else {
          console.info(`Could not find the key`);
        }
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    console.error("No URL specified");
  }
}

makeRequest("http://risp.hikari.dev.rsc.local/risp/search/v1/items/random");
