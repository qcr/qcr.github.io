import cp from 'child_process';
import loaderUtils from 'loader-utils';
import path from 'path';
import util from 'util';

import type * as webpack from 'webpack';

const exec = util.promisify(cp.exec);

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
        params.webp ? 'webp' : params.jpg ? 'jpg' : params.webm ? 'webm' : 'mp4'
      }`,
      {content: input}
    )
  );
  const outPath = path.join('..', outFile);
  const outPublic = path.join(output.publicPath as string, outFile);
  console.log(`Output for '${inPath}':\n\t${outPath}\n\t${outPublic}`);

  // Emit the file at the chosen destination
  ctx.emitFile(
    outPath,
    /.webp$/.test(outPath)
      ? (
          await exec(`ffmpeg -ss 0 -i ${inPath} -vframes 1 -f webp -`, {
            encoding: 'buffer',
          })
        ).stdout
      : /.jpg$/.test(outPath)
      ? (
          await exec(`ffmpeg -ss 0 -i ${inPath} -vframes 1 -f mjpeg -`, {
            encoding: 'buffer',
          })
        ).stdout
      : /.webm$/.test(outPath)
      ? (
          await exec(`ffmpeg -i ${inPath} -c:v vp9 -crf 41 -f webm -`, {
            encoding: 'buffer',
            maxBuffer: 1024 * 1024 * 100,
          })
        ).stdout
      : (
          await exec(
            `ffmpeg -i ${inPath} -c:v libx264 -crf 25 -pix_fmt yuv420p ` +
              `/tmp/mp4.mp4; cat /tmp/mp4.mp4`,
            {
              encoding: 'buffer',
              maxBuffer: 1024 * 1024 * 100,
            }
          )
        ).stdout
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
