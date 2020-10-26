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

const fs = require('fs');
const path = require('path');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const REPO_CACHE_LOCATION = '/var/tmp/qcr-site';
const REPO_SCHEME = 'repo';
const DEFAULT_REPO_URI = `${REPO_SCHEME}:/README.md`;

const REQUIRE_MARKER = 'REQUIRE';
const REQUIRE_START = `@${REQUIRE_MARKER}@`;
const REQUIRE_END = `@/${REQUIRE_MARKER}@`;
const REQUIRE_REGEX = new RegExp(
  `(\\\\?")?${REQUIRE_START}(.*?)${REQUIRE_END}(\\\\?")?`,
  'g'
);

class GitCacheError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GitCacheError';
  }
}

async function cacheRepo(uriString, repoUrl = undefined) {
  // TODO throw error if git binary isn't detected

  // Generate data from the strings we've received
  const d = parseRepoUri(uriString, repoUrl);

  // Craft a commands that does the following:
  // 1. Ensure the 'repo_user' directory exists
  // 2. Clone the repo if the 'repo_user/repo_name' directory doesn't exist
  // 3. Fetch latest & reset to tip in 'repo_user/repo_name'
  const dir_relative = path.join(REPO_CACHE_LOCATION, d.repo_user);
  const cmd = `{ 
    mkdir -p "${dir_relative}" && cd "${dir_relative}"; 
    [ ! -d "${d.repo_name}" ] && git clone "${d.repo_url}"; 
    cd "${d.repo_name}" && git fetch --all && git reset --hard origin/HEAD;
    } &> /dev/null`;

  // Execute the command
  console.log(
    `Updating git repo cache for '${d.repo_user}/${d.repo_name}' ...`
  );
  try {
    await exec(cmd);
  } catch (e) {
    throw new GitCacheError(`Failed to update cache for '${d.repo_user}/${d.repo_name}'. 
      Original error:
      ${e}`);
  }
  console.log(
    `Finished git repo cache update for '${d.repo_user}/${d.repo_name}'.`
  );
}

function isRepoResource(uriString) {
  return uriString.startsWith(`${REPO_SCHEME}:`);
}

function parseRepoUri(uri, fallbackUrl = undefined) {
  // Extract direct values
  const u = new URL(uri);
  const d = {
    file_path: u.pathname.startsWith('/')
      ? u.pathname.substring(1)
      : u.pathname.replace(/^[^\/]*\/[^\/]*\/(.*)$/, '$1'),
    scheme: u.protocol.replace(':', ''),
    repo_user: u.pathname.startsWith('/')
      ? fallbackUrl.replace(/http[s]?:\/\/github.com\/([^\/]*).*$/, '$1')
      : u.pathname.replace(/^([^\/]*).*$/, '$1'),
    repo_name: u.pathname.startsWith('/')
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
  return path.join(REPO_CACHE_LOCATION, d.repo_user, d.repo_name, d.file_path);
}

module.exports = {
  DEFAULT_REPO_URI,
  markedPath: path => {
    return `${REQUIRE_START}${path}${REQUIRE_END}`;
  },
  markPaths: async function (obj, resPath) {
    const resDir = path.dirname(resPath);
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'object') {
        obj[k] = await module.exports.markPaths(v, resPath);
      } else if (typeof v !== 'string' || !v) {
        continue;
      } else if (v.startsWith('/') || fs.existsSync(path.join(resDir, v))) {
        obj[k] = module.exports.markedPath(v);
      } else if (isRepoResource(v)) {
        await cacheRepo(v, obj.url);
        obj[k] = module.exports.markedPath(repoUriToCachePath(v, obj.url));
      }
    }
    return obj;
  },

  subRequires: markedString => {
    return markedString.replace(
      REQUIRE_REGEX,
      (match, p1, p2, p3, offset, src) => {
        const pre = !p1 || p1 === '\\"' ? `${p1}"+` : '';
        const post = !p3 || p3 === '\\"' ? `+"${p3}` : '';
        return `${pre}require('${p2}')${post}`;
      }
    );
  },

  unmark: markedString => {
    return markedString.replace(REQUIRE_START, '').replace(REQUIRE_END, '');
  },
};
