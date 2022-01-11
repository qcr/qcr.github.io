import loaderUtils from 'loader-utils';
import path from 'path';

import type * as webpack from 'webpack';

const STATIC_IMAGES_PATH = 'static/images';

async function asyncLoader(
  input: string,
  ctx: webpack.LoaderContext<any>,
  cb: (err: string | null, result: string) => void
) {
  // Figure out where we are saving the file
  const params = ctx.resourceQuery
    ? loaderUtils.parseQuery(ctx.resourceQuery)
    : {};
  const output = ctx._compilation!.outputOptions;

  const inPath = ctx.resourcePath;
  const outFile = path.join(
    STATIC_IMAGES_PATH,
    loaderUtils.interpolateName(
      ctx,
      `[name]-[contenthash].${
        params.webp ? 'webp' : params.jpg ? 'jpg' : 'mp4'
      }`,
      {content: input}
    )
  );
  const outPath = path.join('..', outFile);
  const outPublic = path.join(output.publicPath as string, outFile);
  // console.log(`Output for '${inPath}':\n\t${outPath}\n\t${outPublic}`);

  // Emit the file at the chosen destination
  ctx.emitFile(
    outPath,
    /.webp$/.test(outPath) ? 'WEBP' : /.jpg$/.test(outPath) ? 'JPEG' : 'MP4'
  );

  // Return the module pointing to the destination
  // (can't use 'export default ...' as you then must use the loader as
  // 'require(fn).default'... ughhh this dribble is tedious...)
  cb(null, `module.exports = ${JSON.stringify(outPublic)}`);
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
