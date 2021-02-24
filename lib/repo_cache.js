'use strict';
// This library implements support for specifying resources from a remote
// repository. For example, the following would get a `README.md` in the root
// of the repository at "https://github.com/btalb/abstract_map/":
//    repo:btalb/abstract_map/README.md
//
// There is also support for a syntax which doesn't explicitly specify the
// repository, but requires a logical default repository to exist (for example
// if this resource is specified in the YAML for a specific repository:
//    repo:/README.md
//
// These specifiers are technically URIs with a custom "repo" scheme & support
// for two different modes of path specification. See link below for further
// details on URIs & terminology:
//    https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const process = require('process');
const util = require('util');

const exec = util.promisify(cp.exec);

const CACHE_INFO_LOCATION = path.join(
  process.env.NEXT_OUT_DIR ? process.env.NEXT_OUT_DIR : '',
  '.repo_cache_info'
);

const REPO_SCHEME = 'repo';
const DEFAULT_REPO_CACHE_LOCATION = '/var/tmp/qcr-site';
const DEFAULT_REPO_URI = `${REPO_SCHEME}:/README.md`;

const REQUIRE_MARKER = 'REQUIRE';
const REQUIRE_START = `@${REQUIRE_MARKER}@`;
const REQUIRE_END = `@/${REQUIRE_MARKER}@`;
const REQUIRE_REGEX = new RegExp(
  `(\\\\?")?${REQUIRE_START}(.*?)${REQUIRE_END}(\\\\?")?`,
  'g'
);

const locked_list = [];

class GitCacheError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GitCacheError';
  }
}

async function blockWhileLocked(id, frequency = 10) {
  return new Promise(resolve => {
    setTimeout(function check() {
      if (!locked_list.includes(id)) {
        return resolve();
      }
      setTimeout(check, 1000 / frequency);
    }, 1000 / frequency);
  });
}

function cacheLocation() {
  return process.env.REPO_CACHE
    ? process.env.REPO_CACHE
    : DEFAULT_REPO_CACHE_LOCATION;
}

async function cacheRepo(uriString, repoUrl = undefined) {
  // TODO throw error if git binary isn't detected

  // Generate data from the strings we've received
  const d = parseRepoUri(uriString, repoUrl);
  const repo_id = `${d.repo_user}/${d.repo_name}`;

  // Only proceed if there isn't another update process running!
  if (locked_list.includes(repo_id)) {
    console.log(`Process to update '${repo_id}' already exists. Waiting...`);
    await blockWhileLocked(repo_id);
    return;
  }

  // Acquire the lock
  locked_list.push(repo_id);

  // Craft a commands that does the following:
  // 1. Ensure the 'repo_user' directory exists
  // 2. Clone the repo if the 'repo_user/repo_name' directory doesn't exist
  // 3. Fetch latest & reset to tip in 'repo_user/repo_name'
  const dir_relative = path.join(cacheLocation(), d.repo_user);
  const cmd = `{ 
    mkdir -p "${dir_relative}" && cd "${dir_relative}"; 
    [ ! -d "${d.repo_name}" ] && git clone "${d.repo_url}"; 
    cd "${d.repo_name}" && git fetch --all && git reset --hard origin/HEAD;
    }`;

  // Execute the command
  console.log(`Updating git repo cache for '${repo_id}' ...`);
  try {
    await exec(cmd);
  } catch (e) {
    throw new GitCacheError(`Failed to update cache for '${repo_id}'. 
      Original error:
      ${e}`);
  } finally {
    // Release the lock
    locked_list.splice(locked_list.indexOf(repo_id), 1);
  }
  console.log(`Finished git repo cache update for '${repo_id}'.`);
}

function dumpCacheInfo() {
  const repos = cp.execSync(
    `find ${cacheLocation()} -maxdepth 2 -mindepth 2 -type d`,
    {encoding: 'utf8'}
  );
  fs.writeFileSync(
    CACHE_INFO_LOCATION,
    JSON.stringify(
      Object.fromEntries(
        repos
          .trim()
          .split(/[\r\n]+/)
          .map(r => {
            return [
              r.replace(/.*\/([^/]*\/[^/]*$)/, '$1'),
              cp.execSync('git rev-parse HEAD', {cwd: r, encoding: 'utf8'}),
            ];
          })
      )
    )
  );
}

function isRepoResource(uriString, aggressive = false) {
  return (
    uriString.startsWith(`${REPO_SCHEME}:`) ||
    (aggressive &&
      !uriString.includes(':') &&
      module.exports.shouldMark(uriString))
  );
}

function loadCacheInfo() {
  return JSON.parse(fs.readFileSync(CACHE_INFO_LOCATION));
}

function parseRepoUri(uri, fallbackUrl = undefined) {
  // Convert URI to correct format
  if (!uri.startsWith(`${REPO_SCHEME}:`))
    uri = `${REPO_SCHEME}:${
      uri.startsWith('/') || uri.startsWith('./') ? uri : `/${uri}`
    }`;

  // Extract direct values
  const u = new URL(uri);
  const d = {
    file_path: u.pathname.startsWith('/')
      ? u.pathname.substring(1)
      : u.pathname.startsWith('./')
      ? u.pathname.substring(2)
      : u.pathname.replace(/^[^\/]*\/[^\/]*\/(.*)$/, '$1'),
    scheme: u.protocol.replace(':', ''),
    repo_user:
      u.pathname.startsWith('/') || u.pathname.startsWith('./')
        ? fallbackUrl.replace(/http[s]?:\/\/github.com\/([^\/]*).*$/, '$1')
        : u.pathname.replace(/^([^\/]*).*$/, '$1'),
    repo_name:
      u.pathname.startsWith('/') || u.pathname.startsWith('./')
        ? fallbackUrl.replace(
            /http[s]?:\/\/github.com\/[^\/]*\/([^\/]*).*$/,
            '$1'
          )
        : u.pathname.replace(/^[^\/]*\/([^\/]*).*$/, '$1'),
  };

  // Fill in derived values & return
  d.repo_url = `https://github.com/${d.repo_user}/${d.repo_name}/`;
  return d;
}

function repoUriToCachePath(uriString, fallbackUrl = undefined) {
  // Converts a repo uri  to the associated path in the repo cache. For example
  // from:
  //     repo:btalb/abstract_map/README.md
  // to:
  //     REPO_CACHE_LOCATION/btalb/abstract_map/README.md
  const d = parseRepoUri(uriString, fallbackUrl);
  const out = path.join(cacheLocation(), d.repo_user, d.repo_name, d.file_path);
  return out.startsWith('/') ? out : `/${out}`;
}

module.exports = {
  DEFAULT_REPO_URI,
  cacheLocation,
  dumpCacheInfo,
  isRepoResource,
  loadCacheInfo,
  markPath: path => {
    return `${REQUIRE_START}${path}${REQUIRE_END}`;
  },
  removeRequire: string => {
    return string.replace(/require\(\'([^\']*)\'\)/, '$1');
  },
  shouldMark: path => {
    return (
      module.exports.isRepoResource(path) ||
      /^(\/|\.\/|https?:\/\/github\.com|[^:]*$)/i.test(path)
    );
  },
  subRequires: async (markedString, rootUrl, aggressive = false) => {
    const promises = [];
    const ret = markedString.replace(
      REQUIRE_REGEX,
      (match, p1, p2, p3, offset, src) => {
        // Handle cases we don't want to be requiring in our dependency graph
        if (/^https?:/.test(p2)) {
          return p2;
        } else if (p2.startsWith('#')) {
          return path.join(rootUrl, p2);
        } else if (
          !/\.(md|gif|png|jpg|jpeg|webp)$/.test(p2) ||
          (aggressive && /\.md$/.test(p2))
        ) {
          return path.join(rootUrl, 'blob/master', p2);
        }

        // Handle the rest of the cases
        const pre = p1 === '\\"' ? `${p1}"+` : '';
        const post = p3 === '\\"' ? `+"${p3}` : '';
        const [out, promise] = module.exports.translate(
          module.exports.unmark(p2),
          rootUrl,
          aggressive
        );
        if (promise) promises.push(promise);
        return `${pre}require('${out}')${post}`;
      }
    );
    await Promise.all(promises);
    return ret;
  },
  translate: (string, rootUrl, aggressive = false) => {
    let out, promise;
    if (isRepoResource(string, aggressive)) {
      promise = cacheRepo(string, rootUrl);
      out = repoUriToCachePath(string, rootUrl);
    } else {
      out = string;
    }
    return [out, promise];
  },
  unmark: markedString => {
    return markedString.replace(REQUIRE_START, '').replace(REQUIRE_END, '');
  },
};
