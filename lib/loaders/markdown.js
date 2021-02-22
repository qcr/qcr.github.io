'use strict';

const fs = require('fs');
const matter = require('gray-matter');
const md = require('markdown-it');

const rc = require('../repo_cache');

const inst = md({
  html: true,
  replaceLink: function (link, env) {
    // Here we determine whether the asset should be required or not (we cast
    // this net as wide as required here, as we can later reject requiring the
    // asset in the subRequires() fn)
    return rc.shouldMark(link) ? rc.markPath(link) : link;
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
  const out = matter(input);
  processInput(out);

  // Load in content as required
  const implicitContent = Boolean(out.data.content);
  if (implicitContent) {
    out.data.content = fs.readFileSync(
      rc.unmark(out.data.content, out.data.url),
      {encoding: 'utf8'}
    );
  } else {
    delete out.data.content;
  }
  if (out.data.image) {
    console.log(`${out.data.image} ->`);
    out.data.image = rc.subRequires(out.data.image, out.data.url);
    console.log(`\t${out.data.image}`);
  }

  // Tidy up the front-matter data format
  Object.assign(out, out.data);
  ['data', 'empty', 'excerpt', 'isEmpty'].forEach(f => delete out[f]);

  // Render markdown & return an importable result
  out.content = renderMarkdown(out.content);
  cb(
    null,
    `export default ${rc.subRequires(
      JSON.stringify(out),
      out.url,
      implicitContent
    )}`
  );
  return;
}

function processInput(input) {
  // Add in any appropriate default values
  if (
    input.data.type === 'code' &&
    input.data.content === undefined &&
    !input.content.trim()
  ) {
    input.data.content = rc.DEFAULT_REPO_URI;
  }

  // Mark any paths in expected properties
  if (input.data.content) input.data.content = rc.markPath(input.data.content);
  if (input.data.image) input.data.image = rc.markPath(input.data.image);
}

function renderMarkdown(string) {
  // Handle srcs embedded in raw HTML tags...
  string = string.replace(/src="(.*?[^\\])"/g, (match, p1, offset, src) => {
    return rc.shouldMark(p1) ? `src="${rc.markPath(p1)}"` : match;
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
  this.addDependency(this.resourcePath);

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
