import {JSDOM} from 'jsdom';
import loaderUtils from 'loader-utils';
import matter from 'gray-matter';
import mdi from 'markdown-it';

import type * as webpack from 'webpack';

import {markObjectUris, processUri, unmarkString} from './helpers';

// TODO this is a little brittle (assumes Next will put the image here...)
const DEFAULT_IMAGE_URL = '/qcr_logo_light_filled.svg';

async function asyncLoader(
  input: string,
  ctx: webpack.LoaderContext<any>,
  cb: (err: string | null, result: string) => void
) {
  const pathContext = ctx.resourcePath;
  ctx.addDependency(pathContext);

  // Parse YAML front matter, and render our markdown as a HTML string
  const md = matter(input);
  const repoContext = md.data.type === 'code' ? md.data.url : undefined;
  md.content = generateRenderer(pathContext, repoContext).render(md.content);

  // Derive any required front matter data that may be implied
  resolveImage(md.data, md.content);

  // Mark paths in front matter data, and flatten the object
  if (md.data.image !== DEFAULT_IMAGE_URL) {
    md.data = await markObjectUris(
      md.data,
      ['image'],
      pathContext,
      repoContext
    );
  }
  Object.assign(md, md.data);
  const md_tidy = md as {[key: string]: any};
  ['data', 'empty', 'excerpt', 'isEmpty'].forEach((f) => delete md_tidy[f]);

  // const {content, ...x} = md_tidy;
  // console.log(x);

  // Generate the export string, unmarking paths as we go
  cb(null, `export default ${unmarkString(JSON.stringify(md_tidy), ctx)}`);
  return;
}

function generateRenderer(pathContext: string, repoContext: string) {
  return mdi({
    html: true,
  })
    .use(require('markdown-it-block-embed'), {
      containerClassName: 'embedded-block',
    })
    .use(require('markdown-it-prism'))
    .use(require('markdown-it-replace-link'), {
      replaceLink: function (link: string) {
        return processUri(link, pathContext, repoContext);
      },
    });
}

function resolveImage(data: {[key: string]: any}, content: string) {
  // Bail if the type isn't code or dataset (collections derive their image
  // from their children, and we have no concept of children yet)
  if (data.type !== 'code' && data.type !== 'dataset') return;

  // Bail if we have an explicitly chosen image
  if (typeof data.image !== 'undefined') return;

  // Build the content's DOM, and try automatically pick an image
  const d = new JSDOM(`${content}`).window.document;
  const media = Array.from(d.querySelectorAll('img, video')) as (
    | HTMLVideoElement
    | HTMLImageElement
  )[];
  if (media) {
    const m = media.find((m) => {
      return (
        m.tagName === 'VIDEO'
          ? (m as HTMLVideoElement).poster
          : (m as HTMLImageElement).src
      ).startsWith('/_next/');
    });
    if (m && m.tagName === 'VIDEO') {
      data.image = (m as HTMLVideoElement).poster;
      data._image = (m.querySelector('source') as HTMLSourceElement).src;
    } else if (m) {
      data.image = (m as HTMLImageElement).src;
    }
  }

  // Revert to the default placeholder image if we still failed
  if (data.image === undefined) data.image = DEFAULT_IMAGE_URL;
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
