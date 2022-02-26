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
  // console.log(`Output for '${inPath}':\n\t${outPath}\n\t${outPublic}`);

  // Emit the file at the chosen destination
  const buffSz = /.(webp|jpg)/.test(outPath) ? undefined : 1024 * 1024 * 50;
  const ext = outPath.substring(outPath.lastIndexOf('.') + 1);
  ctx.emitFile(
    outPath,
    await ffmpeg(
      ext === 'webp'
        ? `ffmpeg -y -ss 0 -i ${inPath} -vframes 1`
        : ext === 'jpg'
        ? `ffmpeg -y -ss 0 -i ${inPath} -vframes 1`
        : ext === 'webm'
        ? `ffmpeg -y -i ${inPath} -c:v vp9 -crf 41`
        : ext === 'mp4'
        ? `ffmpeg -y -i ${inPath} -c:v libx264 -crf 25 -pix_fmt yuv420p`
        : 'false',
      ext,
      buffSz
    )
  );
  console.log(`Generated ${outPublic}`);

  // Return the module pointing to the destination
  // (can't use 'export default ...' as you then must use the loader as
  // 'require(fn).default'... ughhh this dribble is tedious...)
  cb(null, `module.exports = ${JSON.stringify(outPublic)}`);
  return;
}

async function ffmpeg(
  cmd: string,
  outfileType: string,
  bufferSize = 1024 * 1024
) {
  const MAX_ATTEMPTS = 3;
  let x = 0;
  let out = Buffer.alloc(0);
  while (x < MAX_ATTEMPTS) {
    try {
      out = (
        await exec(
          `p=/tmp/$(openssl rand -hex 64).${outfileType}; ` +
            `${cmd} $p; cat $p; rm $p`,
          {encoding: 'buffer', maxBuffer: bufferSize}
        )
      ).stdout;
      x = MAX_ATTEMPTS;
    } catch (e) {
      x += 1;
      if (x == MAX_ATTEMPTS) throw e;
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  return out;
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
