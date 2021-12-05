import fs from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';

import type Renderer from 'markdown-it/lib/renderer';
import type * as webpack from 'webpack';

import rc from '../repo_cache';

const inst = md({
  html: true,
})
  .use(require('markdown-it-block-embed'), {
    containerClassName: 'embedded-block',
  })
  .use(require('markdown-it-prism'))
  .use(require('markdown-it-replace-link'), {
    replaceLink: function (link: string) {
      // Here we determine whether the asset should be required or not (we cast
      // this net as wide as required here, as we can later reject requiring the
      // asset in the subRequires() fn)
      return rc.shouldMark(link) ? rc.markPath(link) : link;
    },
  });

const highlightDefault = inst.options.highlight;
inst.options.highlight = function (str, lang, attrs) {
  return highlightDefault!(str, lang, '').replace(
    /^<pre><code>/,
    '<pre class="language-none"><code class="language-none">'
  );
};

const codeInlineRendererDefault = inst.renderer.rules.code_inline;
inst.renderer.rules.code_inline = function (tokens, idx, options, env, slf) {
  return codeInlineRendererDefault!(tokens, idx, options, env, slf).replace(
    /^<code/,
    '<code class="language-none"'
  );
};

const imageRendererDefault = inst.renderer.rules.image!;
const imageRendererCustom: Renderer.RenderRule = function (
  tokens,
  idx,
  options,
  env,
  slf
) {
  const srcAttr = tokens[idx].attrs!.find((a) => a[0] === 'src');
  const src = rc.unmark(srcAttr![1]);
  if (src.endsWith('.gif')) {
    return `<video autoplay loop poster="${rc.markPath(
      `${src}?image`
    )}"><source src="${rc.markPath(
      `${src}?webm`
    )}" type="video/webm"/></video>`;
  } else {
    return imageRendererDefault(tokens, idx, options, env, slf);
  }
};

async function buildOutput(
  input: string,
  resPath: string,
  cb: (err: string | null, result: string) => void
) {
  const out = matter(input);
  processInput(out);
  if (Object.keys(out.data).length === 0) {
    throw new Error(`No front matter found in file '${resPath}'!`);
  }

  // Load in content as required
  const implicitContent = Boolean(out.data.content);
  if (implicitContent) {
    out.data.content = fs.readFileSync(
      rc.removeRequire(await rc.subRequires(out.data.content, out.data.url)),
      {encoding: 'utf8'}
    );
  } else {
    delete out.data.content;
  }

  // Tidy up the front-matter data format
  Object.assign(out, out.data);
  const out_tidy = out as {[key: string]: any};
  ['data', 'empty', 'excerpt', 'isEmpty'].forEach((f) => delete out_tidy[f]);

  // Render markdown & return an importable result (including a dirty hack to
  // get rid of quotations around the 'image' key require...)
  out_tidy.content = renderMarkdown(out_tidy.content);
  cb(
    null,
    `export default ${(
      await rc.subRequires(
        JSON.stringify(out_tidy),
        out_tidy.url,
        implicitContent
      )
    ).replace(/("image": *)(https?[^,}]*)/, '$1"$2"')}`
  );
  return;
}

function processInput(input: matter.GrayMatterFile<string>) {
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

function renderMarkdown(string: string) {
  // Handle srcs embedded in raw HTML tags...
  // TODO this technically doesn't handle GIFs properly in production.... but
  // would be too annoying to fix at the moment (would need to process img
  // tags, not the raw HTML)
  string = string.replace(/src="(.*?[^\\])"/g, (match, p1, offset, src) => {
    return rc.shouldMark(p1) ? `src="${rc.markPath(p1)}"` : match;
  });

  // Run it through the markdown renderer & return the result
  return inst.render(string).replace(/<pre>/g, '<pre class="language-none">');
}

export default function loader(
  this: webpack.LoaderContext<any>,
  input: string
) {
  this.addDependency(this.resourcePath);

  // Set the correct image renderer
  inst.renderer.rules.image =
    this.mode === 'production' ? imageRendererCustom : imageRendererDefault;

  // Run the loader
  const cb = this.async();
  buildOutput(input, this.resourcePath, (err, result) => {
    if (err) return cb(Error(err));
    cb(null, result);
  });
}
