module.exports = {
  "items/random": {
    method: "GET",
    path: "items_random.json"
  },
  items: {
    method: "POST",
    path: "items.json"
  },
  "items/:param1/:param2": {
    method: "GET",
    path: "items.json"
  }
};
