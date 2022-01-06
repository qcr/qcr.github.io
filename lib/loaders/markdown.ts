import matter from 'gray-matter';
import mdi from 'markdown-it';

import type * as webpack from 'webpack';

import {markObjectUris, unmarkString} from './helpers';

const renderer = mdi({
  html: true,
})
  .use(require('markdown-it-block-embed'), {
    containerClassName: 'embedded-block',
  })
  .use(require('markdown-it-prism'))
  .use(require('markdown-it-replace-link'), {
    replaceLink: function (link: string) {
      // TODO: implement
      return link;
    },
  });

async function asyncLoader(
  input: string,
  ctx: webpack.LoaderContext<any>,
  cb: (err: string | null, result: string) => void
) {
  ctx.addDependency(ctx.resourcePath);
  // console.log(`Processing md file: ${ctx.resourcePath}`);

  // Parse YAML front matter, and render our markdown as a HTML string
  const md = matter(input);
  md.content = renderer.render(md.content);

  // Derive any required front matter data that may be implied
  // TODO

  // Mark paths in front matter data, and flatten the object
  md.data = await markObjectUris(
    md.data,
    ['image'],
    ctx.resourcePath,
    md.data.type === 'code' ? md.data.url : undefined
  );
  Object.assign(md, md.data);
  const md_tidy = md as {[key: string]: any};
  ['data', 'empty', 'excerpt', 'isEmpty'].forEach((f) => delete md_tidy[f]);

  const {content, ...x} = md_tidy;
  console.log(x);

  // Generate the export string, unmarking paths as we go
  cb(null, `export default ${unmarkString(JSON.stringify(md_tidy), ctx)}`);
  return;
}

export default function loader(
  this: webpack.LoaderContext<any>,
  input: string
) {
  const cb = this.async();
  asyncLoader(input, this, (err, result) => {
    if (err) return cb(Error(err));
    cb(null, result);
  });
}
