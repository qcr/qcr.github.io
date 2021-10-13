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
  const {user: repo_user, name: repo_name} = inputs.url.match(
      /(?<user>[^/]*)\/(?<name>[^/]*)$/,
  ).groups;

  // Dump the input data to the corresponding file
  init(repo_user);
  fs.writeFileSync(
      path.join(REMOTE_DIR_REL, repo_user, `${repo_name}.md`),
      inputsToMarkdown(inputs),
  );
}

function init(repo_user) {
  fs.mkdirSync(
    repo_user ? path.join(REMOTE_DIR_REL, repo_user) : REMOTE_DIR_REL,
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

function rebuildRequired(name_short, repo_path) {
  const cache_info = rc.loadCacheInfo();
  const opts = {
    cwd: repo_path,
    encoding: 'utf8',
    stdio: 'ignore',
  };

  // Handle exit early conditions (doesn't exist in cache, no hash in cache
  // info, either hash is invalid)
  if (!fs.existsSync(repo_path)) {
    console.log(`Repo was not found at path: ${repo_path}`);
    return true;
  }
  if (!cache_info[name_short]) {
    console.log(
        `Entry for '${name_short}' was invalid: ${cache_info[name_short]}`,
    );
    return true;
  }
  cp.execSync('git fetch', opts);
  const last_hash = cache_info[name_short].trim();
  const current_hash = cp
      .execSync(`git rev-parse HEAD`, {...opts, ...{stdio: 'pipe'}})
      .trim();
  try {
    cp.execSync(`git cat-file commit ${current_hash}`, opts);
    cp.execSync(`git cat-file commit ${last_hash}`, opts);
  } catch (e) {
    console.log(e);
    return true;
  }

  // Check the diff for a .md file, or any expected associated files (images,
  // videos, GIFs, etc)
  const hits = cp
      .execSync(`git diff --name-only ${last_hash} ${current_hash}`, {
        ...opts,
        ...{stdio: 'pipe'},
      })
      .trim()
      .split(/[\r\n]+/)
      .filter((f) => /(.md|.gif|.png|.jpg|.jpeg|.webm|.mp4|.ogg)$/i.test(f));
  return hits.length > 0;
}

module.exports = {REMOTE_DIR, createRemoteEntry, rebuildRequired};
