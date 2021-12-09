import cp from 'child_process';
import loaderUtils from 'loader-utils';
import path from 'path';
import util from 'util';

import type * as webpack from 'webpack';

const exec = util.promisify(cp.exec);

const PATH_ROOT = 'static/gifs';

async function buildOutput(
  content: string,
  loaderContext: webpack.LoaderContext<any>,
  cb: (err: string | null, result: string) => void
) {
  // Figure out what we are creating
  const params = loaderContext.resourceQuery
    ? loaderUtils.parseQuery(loaderContext.resourceQuery)
    : {};

  // Construct our paths
  // TODO figure out why some of the resources are coming in with a compiler
  // saying to place them in '.next/server/' (they are STATIC....)
  const inPath = loaderContext.resourcePath;
  const outFilename = loaderUtils.interpolateName(
    loaderContext,
    `[hash].${params.webm ? 'webm' : params.image ? 'jpg' : 'gif'}`,
    {content: content}
  );
  const outDir = `${
    loaderContext.mode === 'development' ? '../' : ''
  }/static/gifs/`;
  const outPath = path.join(outDir, outFilename);
  const outPublic = path.join('/_next/static/gifs/', outFilename);

  console.log(
    `WRITING:\n\t${inPath}\nTO:\n\t${outPath}\nAVAILABLE AT:\n\t${outPublic}`
  );

  // Generate the requested file
  // TODO not sure why I can't just use the input data? It is a different size
  // to what I get if I just cat the file (smaller) which makes no sense to
  // me...
  loaderContext.emitFile(
    outPath,
    params.webm
      ? (
          await exec(
            `ffmpeg -i ${inPath} -c:v libvpx -crf 4 -auto-alt-ref 0 -f webm -`,
            {
              encoding: 'buffer',
              maxBuffer: 1024 * 1024 * 100,
            }
          )
        ).stdout
      : params.image
      ? (
          await exec(`ffmpeg -ss 0 -i ${inPath} -vframes 1 -q:v 2 -f mjpeg -`, {
            encoding: 'buffer',
          })
        ).stdout
      : (
          await exec(`cat ${inPath}`, {
            encoding: 'buffer',
            maxBuffer: 1024 * 1024 * 100,
          })
        ).stdout
  );

  // Return the result of the loader
  cb(null, `module.exports = ${JSON.stringify(outPublic)}`);
}

export default function loader(
  this: webpack.LoaderContext<any>,
  input: string
) {
  const cb = this.async();
  const res = /[^/]*$/.exec(this.resource)![0];
  console.log(
    `${this.resourceQuery ? 'Processing' : 'Skipping'} gif '${res}' ...`
  );
  buildOutput(input, this, (err, result) => {
    if (err) return cb(Error(err));
    if (this.resourceQuery) console.log(`Finished processing gif '${res}'.`);
    cb(null, result);
  });
}
