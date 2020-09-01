'use strict';

const md = require('markdown-it');
const be = require('markdown-it-block-embed');

const renderer = md().use(be, {containerClassName: 'embedded-block'});

module.exports = function (input) {
  return `export default \`${renderer.render(input)}\``;
};
