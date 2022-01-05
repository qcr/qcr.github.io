import type * as webpack from 'webpack';

async function asyncLoader(
  input: string,
  ctx: webpack.LoaderContext<any>,
  cb: (err: string | null, result: string) => void
) {
  cb(null, `export default 'loaded'`);
  return;
}

export default function loader(
  this: webpack.LoaderContext<any>,
  input: string
) {
  this.addDependency(this.resourcePath);
  const cb = this.async();
  asyncLoader(input, this, (err, result) => {
    if (err) return cb(Error(err));
    cb(null, result);
  });
}
