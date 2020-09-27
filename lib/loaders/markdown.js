'use strict';

const helpers = require('./helpers');

const matter = require('gray-matter');

const md = require('markdown-it');
const be = require('markdown-it-block-embed');
const rl = require('markdown-it-replace-link');

const renderer = md({
  html: true,
  replaceLink: function (link, env) {
    return link.includes(':') || link.startsWith('#')
      ? link
      : helpers.markedPath(link);
  },
})
  .use(be, {
    containerClassName: 'embedded-block',
  })
  .use(rl);

function processInput(structuredInput) {
  // Add in any appropriate default values
  if (
    structuredInput.data.type === 'code' &&
    structuredInput.data.content === undefined &&
    !structuredInput.content.trim()
  )
    structuredInput.data.content = helpers.DEFAULT_REPO_URI;
}

// TODO I have no f... idea why when I return a raw string I need to use the
// 'module.exports = ...' syntax (otherwise the import ends up having an object
// with the string in the 'default' field), but when I return an object I need
// to use the 'export default ...' syntax... leave it in the figure out if
// needs be basket
module.exports = function (input) {
  // Handle differently based on whether there is front matter or not
  // TODO how do we correctly error when someone has created content without
  // front matter??? (should use an arg given to the content loader in
  // 'content' front_matter field, rather than checking 'isEmpty' below)
  const structuredInput = matter(input);
  if (
    structuredInput.isEmpty ||
    Object.keys(structuredInput.data).length === 0
  ) {
    // This will be for when content is specified in a different file (or
    // remote repo)
    return `module.exports = ${helpers.subRequires(
      JSON.stringify(renderer.render(input))
    )}`;
  } else {
    // This is for the actual content files
    processInput(structuredInput);
    const renderContent = !structuredInput.data.content;

    // Tidy up the front-matter data format
    Object.assign(structuredInput, structuredInput.data);
    ['data', 'empty', 'excerpt', 'isEmpty'].forEach(
      f => delete structuredInput[f]
    );

    // Render markdown & return an importable result
    if (renderContent)
      structuredInput.content = renderer.render(structuredInput.content);
    return `export default ${helpers.subRequires(
      JSON.stringify(helpers.markPaths(structuredInput, this.resourcePath))
    )}`;
  }
};

module.exports.separable = true;
