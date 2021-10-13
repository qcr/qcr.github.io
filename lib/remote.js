const cp = require('child_process');
const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

const rc = require('./repo_cache');

const REMOTE_DIR = '/content/.remote';
const REMOTE_DIR_REL = path.join(__dirname, '..', REMOTE_DIR);

function createRemoteEntry(inputs) {
  // Ensure inputs meet the minimum requirements
  if (!inputs.name) {
    console.log('Payload is missing the required \'name\' field. Aborting.');
    return false;
  }
  if (!inputs.url) {
    console.log('Payload is missing the required \'url\' field. Aborting.');
    return false;
  }

  // Pull out user & repo name info from URL
  const {user: repoUser, name: repoName} = inputs.url.match(
      /(?<user>[^/]*)\/(?<name>[^/]*)$/,
  ).groups;

  // Dump the input data to the corresponding file
  init(repoUser);
  fs.writeFileSync(
      path.join(REMOTE_DIR_REL, repoUser, `${repoName}.md`),
      inputsToMarkdown(inputs),
  );
}

function init(repoUser) {
  fs.mkdirSync(
    repoUser ? path.join(REMOTE_DIR_REL, repoUser) : REMOTE_DIR_REL,
    {recursive: true},
  );
}

function inputsToMarkdown(inputs) {
  // Perform input validation / modification
  inputs.type = 'code';
  if (inputs.content) {
    inputs.content = inputs.content.replace(/^(.\/)?(\/)?/, 'repo:/');
  }
  if (inputs.image) {
    inputs.image = inputs.image.replace(/^(.\/)?(\/)?/, 'repo:/');
  }

  // Return string with input dumped as YAML front-matter
  return matter.stringify('', inputs);
}

function rebuildRequired(nameShort, repoPath) {
  const cacheInfo = rc.loadCacheInfo();
  const opts = {
    cwd: repoPath,
    encoding: 'utf8',
    stdio: 'ignore',
  };

  // Handle exit early conditions (doesn't exist in cache, no hash in cache
  // info, either hash is invalid)
  if (!fs.existsSync(repoPath)) {
    console.log(`Repo was not found at path: ${repoPath}`);
    return true;
  }
  if (!cacheInfo[nameShort]) {
    console.log(
        `Entry for '${nameShort}' was invalid: ${cacheInfo[nameShort]}`,
    );
    return true;
  }
  cp.execSync('git fetch', opts);
  const lastHash = cacheInfo[nameShort].trim();
  const currentHash = cp
      .execSync(`git rev-parse HEAD`, {...opts, ...{stdio: 'pipe'}})
      .trim();
  try {
    cp.execSync(`git cat-file commit ${currentHash}`, opts);
    cp.execSync(`git cat-file commit ${lastHash}`, opts);
  } catch (e) {
    console.log(e);
    return true;
  }

  // Check the diff for a .md file, or any expected associated files (images,
  // videos, GIFs, etc)
  const hits = cp
      .execSync(`git diff --name-only ${lastHash} ${currentHash}`, {
        ...opts,
        ...{stdio: 'pipe'},
      })
      .trim()
      .split(/[\r\n]+/)
      .filter((f) => /(.md|.gif|.png|.jpg|.jpeg|.webm|.mp4|.ogg)$/i.test(f));
  return hits.length > 0;
}

module.exports = {REMOTE_DIR, createRemoteEntry, rebuildRequired};
