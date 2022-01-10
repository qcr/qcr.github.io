import {JSDOM} from 'jsdom';
import * as fs from 'fs/promises';
import matter from 'gray-matter';
import mdi from 'markdown-it';

import type * as webpack from 'webpack';

import {
  REPO_DEFAULT_URI,
  convertUri,
  markObjectUris,
  processUri,
  undoMark,
  unmarkString,
} from './helpers';

// TODO this is a little brittle (assumes Next will put the image here...)
const DEFAULT_IMAGE_URL = '/qcr_logo_light_filled.svg';

const renderer = mdi({
  html: true,
})
  .use(require('markdown-it-block-embed'), {
    containerClassName: 'embedded-block',
  })
  .use(require('markdown-it-prism'));

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

  // Render the content as a virtual DOM, and apply all necessary manipulations
  const {elem, path} = await renderContent(
    md.data,
    md.content,
    pathContext,
    repoContext
  );
  await markImages(elem, path);
  resolveImage(md.data, elem);
  md.content = elem.innerHTML;

  console.log(md);

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

  console.log(md_tidy);

  // Generate the export string, unmarking paths as we go
  cb(null, `export default ${unmarkString(JSON.stringify(md_tidy), ctx)}`);
  return;
}

async function markImages(element: HTMLElement, pathContext: string) {
  await Promise.all(
    (Array.from(element.querySelectorAll('img')) as HTMLImageElement[]).map(
      async (i) => {
        i.src = await processUri(i.src, pathContext);
      }
    )
  );
}

async function renderContent(
  data: {[key: string]: any},
  content: string,
  pathContext: string,
  repoContext?: string
) {
  // Decide which content we're using
  const src =
    typeof data.content !== 'undefined'
      ? await convertUri(data.content, pathContext, repoContext)
      : content.trim().length > 0
      ? null
      : data.type === 'code'
      ? await convertUri(REPO_DEFAULT_URI, pathContext, repoContext)
      : undefined;
  if (typeof src === 'undefined') {
    throw Error(
      `Failed to find any valid markdown content for '${pathContext}'.`
    );
  }

  // Obtain any required external content
  const c =
    src === null
      ? content
      : /^https?:\/\//.test(src)
      ? await (await fetch(src)).text()
      : await fs.readFile(src, 'utf8');
  delete data.content;

  // Render the content and return the result as JSDOM so we can manipulate it
  return {
    elem: new JSDOM(renderer.render(c)).window.document.body,
    path: src === null ? pathContext : src,
  };
}

function resolveImage(data: {[key: string]: any}, element: HTMLElement) {
  // Bail if the type isn't code or dataset (collections derive their image
  // from their children, and we have no concept of children yet)
  if (data.type !== 'code' && data.type !== 'dataset') return;

  // Bail if we have an explicitly chosen image
  if (typeof data.image !== 'undefined') return;

  // Search for image & video elements we can possibly pick an image from
  const elems = Array.from(element.querySelectorAll('img, video')) as (
    | HTMLVideoElement
    | HTMLImageElement
  )[];
  if (elems) {
    const m = elems.find((m) => {
      const t = undoMark(
        m.tagName === 'VIDEO'
          ? (m as HTMLVideoElement).poster
          : (m as HTMLImageElement).src
      );
      return /\.(jpg|png|gif)$/.test(t.toLowerCase());
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
