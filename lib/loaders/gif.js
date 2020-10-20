const loaderUtils = require('loader-utils');
const path = require('path');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const PUBLIC_ROOT = '/_next';
const PATH_ROOT = 'static/videos';

async function generateImages(content, loaderContext, cb) {
  // Derive paths
  const inPath = loaderContext.resourcePath;
  const coverPath = path.join(
    PATH_ROOT,
    loaderUtils.interpolateName(loaderContext, '[hash].jpg', {
      content: content,
    })
  );
  const videoPath = path.join(
    PATH_ROOT,
    loaderUtils.interpolateName(loaderContext, '[hash].webm', {
      content: content,
    })
  );
  const coverPublicPath = path.join(PUBLIC_ROOT, coverPath);
  const videoPublicPath = path.join(PUBLIC_ROOT, videoPath);

  // Generate the required derived files
  let {stdout} = await exec(
    `ffmpeg -ss 0 -i ${inPath} -vframes 1 -q:v 2 -f mjpeg -`,
    {
      encoding: 'buffer',
    }
  );
  loaderContext.emitFile(coverPath, stdout);
  ({stdout} = await exec(
    `ffmpeg -i ${inPath} -c:v libvpx -crf 4 -auto-alt-ref 0 -f webm -`,
    {
      encoding: 'buffer',
      maxBuffer: 1024 * 1024 * 100,
    }
  ));
  loaderContext.emitFile(videoPath, stdout);

  // Return the result of the loader
  cb(
    null,
    `export default { video: __webpack_public_path__ + ${JSON.stringify(
      videoPublicPath
    )}, cover: __webpack_public_path__ + ${JSON.stringify(coverPublicPath)} }`
  );
}

module.exports = function (input) {
  const cb = this.async();
  console.log(`Processing gif '${this.resourcePath}' ...`);
  generateImages(input, this, (err, result) => {
    if (err) return cb(err);
    console.log(`Finished processing gif '${this.resourcePath}'.`);
    cb(null, result);
  });
};
