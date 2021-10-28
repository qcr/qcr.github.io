const fs = require('fs');
const path = require('path');
const {runLoaders} = require('loader-runner');

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
    (err, result) => {
    err ? console.error(err) : console.log(result);
    },
);
