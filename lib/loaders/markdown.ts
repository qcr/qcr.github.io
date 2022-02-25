import {JSDOM} from 'jsdom';
import * as fs from 'fs/promises';
import matter from 'gray-matter';
import mdi from 'markdown-it';

import type * as webpack from 'webpack';

import {
  REPO_DEFAULT_URI,
  convertUri,
  getUriOptions,
  isGifUri,
  markUri,
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
  const {doc, elem, path} = await renderContent(
    md.data,
    md.content,
    pathContext,
    repoContext
  );
  resolveImage(md.data, elem);
  await insertResponsiveMedia(doc, elem, path);
  md.content = elem.innerHTML;

  // Mark paths in front matter data, and flatten the object
  if (md.data.image)
    md.data._images = await selectImages(md.data.image, path, repoContext);

  Object.assign(md, md.data);
  const md_tidy = md as {[key: string]: any};
  ['data', 'empty', 'excerpt', 'isEmpty'].forEach((f) => delete md_tidy[f]);

  // Generate the export string, unmarking paths as we go
  cb(null, `export default ${unmarkString(JSON.stringify(md_tidy), ctx)}`);
  return;
}

async function insertResponsiveMedia(
  doc: Document,
  element: HTMLElement,
  pathContext: string
) {
  await Promise.all(
    (Array.from(element.querySelectorAll('img')) as HTMLImageElement[]).map(
      async (img) => {
        // Build up list of sources
        const isVid = isGifUri(img.src);
        const s = async (opt?: string) =>
          await processUri(img.src, pathContext, undefined, opt);
        let srcs = [await s('?webp'), await s()];
        if (isVid) {
          srcs.pop();
          srcs.splice(0, 0, await s('?mp4'));
          srcs.splice(0, 0, await s('?webm'));
        }
        srcs = [...new Set(srcs)];
        // console.log(`${img.src} (${img.alt})`);
        // console.log(srcs);

        // Construct a replacement element that uses optimised sources
        let el: HTMLVideoElement | HTMLPictureElement;
        const typeRegex = new RegExp(/.*?([^@]*)@/);
        if (isVid) {
          const v = doc.createElement('video') as HTMLVideoElement;
          v.autoplay = true;
          v.defaultMuted = true;
          v.loop = true;
          v.poster = srcs[srcs.length - 1];
          srcs.slice(0, srcs.length - 1).forEach((s) => {
            let c = doc.createElement('source') as HTMLSourceElement;
            c.src = s;
            c.type = `video/${getUriOptions(s)}`;
            v.appendChild(c);
          });
          v.insertAdjacentText('beforeend', img.alt);
          el = v;
        } else {
          const p = doc.createElement('picture') as HTMLPictureElement;
          srcs.slice(0, srcs.length - 1).forEach((s) => {
            let c = doc.createElement('source') as HTMLSourceElement;
            c.srcset = s;
            c.type = `image/${getUriOptions(s)}`;
            p.appendChild(c);
          });
          let i = doc.createElement('img') as HTMLImageElement;
          i.alt = img.alt;
          i.src = srcs[srcs.length - 1];
          p.appendChild(i);
          el = p;
        }

        // Perform the replacing
        img.replaceWith(el);
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
  const dom = new JSDOM(renderer.render(c));
  return {
    doc: dom.window.document,
    elem: dom.window.document.body,
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
    data.image = elems
      .map((e) =>
        undoMark(
          e.tagName === 'VIDEO'
            ? (e as HTMLVideoElement).poster
            : (e as HTMLImageElement).src
        )
      )
      .find((s) => /\.(jpg|png|gif)$/.test(s.toLowerCase()));
  }

  // Revert to the default placeholder image if we still failed
  if (data.image === undefined) data.image = DEFAULT_IMAGE_URL;
}

async function selectImages(
  imageSrc: string,
  pathContext: string,
  repoContext?: string
) {
  const srcs = [];
  if (imageSrc === DEFAULT_IMAGE_URL) return [imageSrc];
  imageSrc = await convertUri(imageSrc, pathContext, repoContext);
  if (isGifUri(imageSrc)) {
    srcs.push(markUri(imageSrc, '?webm'));
    srcs.push(markUri(imageSrc, '?mp4'));
  }
  srcs.push(markUri(imageSrc, '?webp'));
  srcs.push(markUri(imageSrc, isGifUri(imageSrc) ? '?jpg' : undefined));
  return srcs;
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
