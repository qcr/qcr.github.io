'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRE_MARKER = 'REQUIRE';
const REQUIRE_START = `<${REQUIRE_MARKER}>`;
const REQUIRE_END = `</${REQUIRE_MARKER}>`;
const REQUIRE_REGEX = new RegExp(`"${REQUIRE_START}(.*?)${REQUIRE_END}"`, 'g');

module.exports = {
  markPaths: (obj, resPath) => {
    const resDir = path.dirname(resPath);
    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v === 'object') {
        obj[k] = module.exports.markPaths(v, resPath);
      } else {
        if (fs.existsSync(path.join(resDir, v)))
          obj[k] = `${REQUIRE_START}${v}${REQUIRE_END}`;
      }
    });
    return obj;
  },

  substituteRequires: markedString => {
    return markedString.replace(REQUIRE_REGEX, `require('$1').default`);
  },
};
