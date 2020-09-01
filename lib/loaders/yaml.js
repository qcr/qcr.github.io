'use strict';

const yaml = require('yaml');
const helpers = require('./helpers');

module.exports = function (input) {
  // Go through all fields marking paths
  const markedData = helpers.markPaths(yaml.parse(input), this.resourcePath);
  return `export default ${helpers.substituteRequires(
    JSON.stringify(markedData)
  )}`;
};
