'use strict';

const rc = require('../repo_cache');

const matter = require('gray-matter');

const md = require('markdown-it');

const inst = md({
  html: true,
  replaceLink: function (link, env) {
    return link.includes(':') || link.startsWith('#')
      ? link
      : rc.markedPath(link);
  },
})
  .use(require('markdown-it-block-embed'), {
    containerClassName: 'embedded-block',
  })
  .use(require('markdown-it-prism'))
  .use(require('markdown-it-replace-link'));

const highlightDefault = inst.options.highlight;
inst.options.highlight = function (str, lang) {
  return highlightDefault(str, lang).replace(
    /^<pre><code>/,
    '<pre class="language-none"><code class="language-none">'
  );
};

const codeInlineRendererDefault = inst.renderer.rules.code_inline;
inst.renderer.rules.code_inline = function (tokens, idx, options, env, slf) {
  return codeInlineRendererDefault(tokens, idx, options, env, slf).replace(
    /^<code/,
    '<code class="language-none"'
  );
};

const imageRendererDefault = inst.renderer.rules.image;
const imageRendererCustom = function (tokens, idx, options, env, slf) {
  const srcAttr = tokens[idx].attrs.find(a => a[0] === 'src');
  const src = rc.unmark(srcAttr[1]);
  if (src.endsWith('.gif')) {
    return `<video autoplay loop poster="${rc.markedPath(
      `${src}?image`
    )}"><source src="${rc.markedPath(
      `${src}?webm`
    )}" type="video/webm"/></video>`;
  } else {
    return imageRendererDefault(tokens, idx, options, env, slf);
  }
};

async function buildOutput(input, resPath, cb) {
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
    if (resPath.includes('debug')) {
      console.log(
        `module.exports = ${rc.subRequires(
          JSON.stringify(renderMarkdown(input))
        )}`
      );
    }
    cb(
      null,
      `module.exports = ${rc.subRequires(
        JSON.stringify(renderMarkdown(input))
      )}`
    );
    return;
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
    if (renderContent) {
      structuredInput.content = renderMarkdown(structuredInput.content);
    }
    const markedPaths = await rc.markPaths(structuredInput, resPath);
    cb(null, `export default ${rc.subRequires(JSON.stringify(markedPaths))}`);
    return;
  }
}

function processInput(structuredInput) {
  // Add in any appropriate default values
  if (
    structuredInput.data.type === 'code' &&
    structuredInput.data.content === undefined &&
    !structuredInput.content.trim()
  ) {
    structuredInput.data.content = rc.DEFAULT_REPO_URI;
  }
}

function renderMarkdown(string) {
  // Handle srcs embedded in raw HTML tags...
  // TODO technically vulnerable to src urls with escaped quotations...
  string = string.replace(/src="(.*?)"/g, (match, p1, offset, src) => {
    return p1.includes(':') || p1.startsWith('#')
      ? match
      : `src="${rc.markedPath(p1)}"`;
  });

  // Run it through the markdown renderer & return the result
  return inst.render(string).replace(/<pre>/g, '<pre class="language-none">');
}

// TODO I have no idea why when I return a raw string I need to use the
// 'module.exports = ...' syntax (otherwise the import ends up having an object
// with the string in the 'default' field), but when I return an object I need
// to use the 'export default ...' syntax... leave it in the "figure out if
// needs be" basket
module.exports = function (input) {
  // Set the correct image renderer
  inst.renderer.rules.image =
    this.mode === 'production' ? imageRendererCustom : imageRendererDefault;

  // Run the loader
  const cb = this.async();
  buildOutput(input, this.resourcePath, (err, result) => {
    if (err) return cb(err);
    cb(null, result);
  });
};

module.exports.separable = true;
