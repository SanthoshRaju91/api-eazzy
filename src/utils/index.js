const set = require("lodash.set");
const get = require("lodash.get");
const path = require("path");
const fs = require("fs");

// Compute a mapper logic to build a tree with the mapper object
// and have an end property to each property end of the mapper
// indicating the path end.
function mapperCompute(mapper) {
  let maps = {};

  for (let map in mapper) {
    const splits = map.split("/");

    if (splits.length > 1) {
      set(maps, [...splits, "end"], mapper[map]);
    } else {
      set(maps, [map, "end"], mapper[map]);
    }
  }
  return maps;
}

// Get the mapped config { method: '', path: ''}
// from the map string /url string.
function getMapped(map) {
  const splits = map.split("/");

  if (splits.length > 1) {
    if (get(maps, [...splits, "end"], "")) {
      return get(maps, [...splits, "end"]);
    } else {
      let path = [];
      let paramCount = 1;

      // construct on param if the given URL is dynamic param
      for (let split = 0; split < splits.length; split++) {
        if (get(maps, [splits[split]], "")) {
          path.push(splits[split]);
        } else {
          path.push(`:param${paramCount++}`);
        }
      }

      return get(maps, [...path, "end"], {});
    }
  } else {
    return get(maps, [map, "end"], {});
  }
}

const maps = (() => {
  let maps = fs.readFileSync(
    path.resolve(`${process.cwd()}/mapper.json`),
    "utf-8"
  );

  if (typeof maps === "string") {
    const parsedMaps = JSON.parse(maps);
    return mapperCompute(parsedMaps);
  } else {
    return {};
  }
})();

module.exports = {
  mapperCompute,
  getMapped
};
