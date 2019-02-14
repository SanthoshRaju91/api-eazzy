module.exports = {
  "risp/search/v1/items/random": {
    method: "GET",
    path: "items_random.json"
  },
  "risp/search/v1/items": {
    method: "POST",
    path: "items.json"
  },
  "risp/search/v1/items/:param1/:param2": {
    method: "GET",
    path: "items.json"
  },
  "process/image": {
    method: "POST",
    path: "process.json"
  },
  get_recaptcha: {
    method: "GET",
    path: "recaptcha.json"
  },
  authenticate: {
    method: "POST",
    path: "recaptcha-verify.json"
  },
  "risp/search/v1/status": {
    method: "GET",
    path: "risp-status.json"
  },
  "oauth/token": {
    method: "POST",
    path: "risp-login.json"
  }
};
