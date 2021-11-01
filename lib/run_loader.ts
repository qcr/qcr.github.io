import fs from 'fs';
import path from 'path';
import {runLoaders} from 'loader-runner';

runLoaders(
  {
    resource:
      '/var/tmp/qcr-site/roboticvisionorg/benchbot/docs/benchbot_web.gif',
    loaders: [path.resolve(__dirname, './loaders/gif')],
    readResource: fs.readFile.bind(fs),
    context: {
      emitFile: () => {},
    },
  },
  (err: string | null, result: string) => {
    err ? console.error(err) : console.log(result);
  }
);
