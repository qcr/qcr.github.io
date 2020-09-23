'use strict';

const path = require('path');
const yaml = require('yaml');

const helpers = require('./helpers');

function addDefaults(data, directory) {
  if (
    path.basename(directory) === 'code' &&
    typeof data.details === 'undefined'
  )
    data.details = helpers.DEFAULT_REPO_URI;
  return data;
}

module.exports = function (input) {
  // Go through all fields marking paths
  const markedData = helpers.markPaths(
    addDefaults(yaml.parse(input), this.context),
    this.resourcePath
  );
  return `export default ${helpers.subRequiresJson(
    JSON.stringify(markedData)
  )}`;
};
