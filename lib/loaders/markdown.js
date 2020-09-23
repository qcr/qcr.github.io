'use strict';

const helpers = require('./helpers');

const md = require('markdown-it');
const be = require('markdown-it-block-embed');
const rl = require('markdown-it-replace-link');

const renderer = md({
  html: true,
  replaceLink: function (link, env) {
    return link.includes(':') ? link : helpers.markedPath(link);
  },
})
  .use(be, {
    containerClassName: 'embedded-block',
  })
  .use(rl);

module.exports = function (input) {
  return `export default \`${helpers.subRequiresString(
    renderer.render(input)
  )}\``;
};
