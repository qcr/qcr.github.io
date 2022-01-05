import matter from 'gray-matter';
import mdi from 'markdown-it';

import type * as webpack from 'webpack';

import {convertUri, markObjectPaths} from './helpers';

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
  console.log(`Processing md file: ${ctx.resourcePath}`);
  console.log(await convertUri('setup.py', ctx.resourcePath));

  const md = matter(input);
  md.data = markObjectPaths(
    md.data,
    md.data.type === 'code' ? md.data.url : undefined
  );
  md.content = renderer.render(md.content);

  Object.assign(md, md.data);
  const md_tidy = md as {[key: string]: any};
  ['data', 'empty', 'excerpt', 'isEmpty'].forEach((f) => delete md_tidy[f]);

  cb(null, `export default ${JSON.stringify(md)}`);
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
