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

import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import util from 'util';

interface RepoUri {
  file_path: string;
  scheme: string;
  repo_user: string;
  repo_name: string;
  repo_url: string;
}

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

const lockedList: string[] = [];

class GitCacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitCacheError';
  }
}

async function blockWhileLocked(id: string, frequency = 1) {
  return new Promise<void>((resolve) => {
    setTimeout(function check() {
      if (!lockedList.includes(id)) {
        return resolve();
      }
      setTimeout(check, 1000 / frequency);
    }, 1000 / frequency);
  });
}

function cacheLocation() {
  return process.env.REPO_CACHE
    ? path.resolve(process.env.REPO_CACHE)
    : DEFAULT_REPO_CACHE_LOCATION;
}

function cacheRepo(uriString: string, repoUrl: string = ''): Promise<void> {
  // TODO throw error if git binary isn't detected

  // Generate data from the strings we've received
  const d = parseRepoUri(uriString, repoUrl);
  const repoId = `${d.repo_user}/${d.repo_name}`;

  // Only proceed if there isn't another update process running!
  if (lockedList.includes(repoId)) {
    console.log(`Process to update '${repoId}' already exists. Waiting...`);
    return blockWhileLocked(repoId);
  }

  // Acquire the lock
  lockedList.push(repoId);

  // Craft a command that does the following:
  // 1. Ensure the 'repo_user' directory exists
  // 2. Clone the repo if the 'repo_user/repo_name' directory doesn't exist
  // 3. Fetch latest & reset to tip in 'repo_user/repo_name'
  const dirRelative = path.join(cacheLocation(), d.repo_user);
  const cmd = `{ 
    mkdir -p "${dirRelative}" && cd "${dirRelative}"; 
    [ ! -d "${d.repo_name}" ] && git clone "${d.repo_url}"; 
    cd "${d.repo_name}" && git fetch --all && git reset --hard origin/HEAD;
    }`;

  // Return a Promise to execute the command
  return new Promise<void>(async (resolve) => {
    console.log(`Updating git repo cache for '${repoId}' ...`);
    try {
      await exec(cmd);
    } catch (e) {
      throw new GitCacheError(`Failed to update cache for '${repoId}'. 
      Original error:
      ${e}`);
    } finally {
      // Release the lock
      lockedList.splice(lockedList.indexOf(repoId), 1);
    }
    console.log(`Finished git repo cache update for '${repoId}'.`);
    resolve();
  });
}

function dumpCacheInfo() {
  const repos = cp.execSync(
    `find ${cacheLocation()} -maxdepth 2 -mindepth 2 -type d`,
    {encoding: 'utf8'}
  );
  const gitCmd = 'git rev-parse HEAD';
  fs.writeFileSync(
    CACHE_INFO_LOCATION,
    JSON.stringify(
      Object.fromEntries(
        repos
          .trim()
          .split(/[\r\n]+/)
          .map((r) => {
            return [
              r.replace(/.*\/([^/]*\/[^/]*$)/, '$1'),
              cp.execSync(gitCmd, {cwd: r, encoding: 'utf8'}),
            ];
          })
      )
    )
  );
}

function isRepoResource(uriString: string, aggressive = false): boolean {
  return (
    uriString.startsWith(`${REPO_SCHEME}:`) ||
    (aggressive && !uriString.includes(':') && shouldMark(uriString))
  );
}

function loadCacheInfo() {
  return JSON.parse(fs.readFileSync(CACHE_INFO_LOCATION, {encoding: 'utf8'}));
}

function markPath(path: string) {
  return `${REQUIRE_START}${path}${REQUIRE_END}`;
}

function parseRepoUri(uri: string, fallbackUrl: string = '') {
  const d: RepoUri = {
    file_path: '',
    scheme: '',
    repo_user: '',
    repo_name: '',
    repo_url: '',
  };

  // Convert URI to correct format (starting with REPO_SCHEME, & either an
  // absolute or relative path)
  if (!uri.startsWith(`${REPO_SCHEME}:`)) {
    uri = `${REPO_SCHEME}:${
      uri.startsWith('/') || uri.startsWith('./') ? uri : `/${uri}`
    }`;
  }
  const u = new URL(uri);
  const pathname = `${u.pathname}${u.search}`; // Hack for loader queries!

  // Extract direct values
  d.file_path = pathname.startsWith('/')
    ? pathname.substring(1)
    : pathname.startsWith('./')
    ? pathname.substring(2)
    : pathname.replace(/^[^/]*\/[^/]*\/(.*)$/, '$1');
  d.scheme = u.protocol.replace(':', '');
  d.repo_user =
    pathname.startsWith('/') || pathname.startsWith('./')
      ? fallbackUrl.replace(/http[s]?:\/\/github.com\/([^/]*).*$/, '$1')
      : pathname.replace(/^([^/]*).*$/, '$1');
  d.repo_name =
    pathname.startsWith('/') || pathname.startsWith('./')
      ? fallbackUrl.replace(/http[s]?:\/\/github.com\/[^/]*\/([^/]*).*$/, '$1')
      : pathname.replace(/^[^/]*\/([^/]*).*$/, '$1');

  // Fill in derived values & return
  d.repo_url = `https://github.com/${d.repo_user}/${d.repo_name}/`;
  return d;
}

function repoUriToCachePath(uriString: string, fallbackUrl: string = '') {
  // Converts a repo uri  to the associated path in the repo cache. For example
  // from:
  //     repo:btalb/abstract_map/README.md
  // to:
  //     REPO_CACHE_LOCATION/btalb/abstract_map/README.md
  const d = parseRepoUri(uriString, fallbackUrl);
  const out = path.join(cacheLocation(), d.repo_user, d.repo_name, d.file_path);
  return out.startsWith('/') ? out : `/${out}`;
}

function removeRequire(string: string) {
  return string.replace(/require\('([^']*)'\)/, '$1');
}

function shouldMark(path: string) {
  return (
    isRepoResource(path) ||
    /^(\/|\.\/|https?:\/\/github\.com|[^:]*$)/i.test(path)
  );
}

async function subRequires(
  markedString: string,
  rootUrl: string,
  aggressive = false
) {
  const promises: Promise<void>[] = [];
  const githubRegex = new RegExp(
    /^https:?:\/\/github\.com/.source +
      /\/.*\/blob\/master\/.*\.(gif|png|jpe?g|webp)$/.source,
    'i'
  );
  const ret = markedString.replace(
    REQUIRE_REGEX,
    (match, p1, p2, p3, offset, src) => {
      // Handle cases we don't want to be requiring in our dependency graph
      // TODO wish these weren't so adhoc...
      if (githubRegex.test(p2)) {
        return p2.replace(/blob/, 'raw');
      } else if (/^https?:/.test(p2)) {
        return p2;
      } else if (p2.startsWith('#')) {
        return path.join(rootUrl, p2);
      } else if (
        !/\.(md|gif|png|jpe?g|webp)(\?.*)?$/.test(p2) ||
        (aggressive && /\.md$/.test(p2))
      ) {
        return path.join(rootUrl, 'blob/master', p2);
      }

      // Handle the rest of the cases
      const pre = p1 === '\\"' ? `${p1}"+` : '';
      const post = p3 === '\\"' ? `+"${p3}` : '';
      const [out, promise] = translate(unmark(p2), rootUrl, aggressive);
      if (promise) promises.push(promise);
      return `${pre}require('${out}')${post}`;
    }
  );
  await Promise.all(promises);
  return ret;
}

function translate(
  string: string,
  rootUrl: string,
  aggressive = false
): [string, Promise<void> | undefined] {
  let out;
  let promise;
  if (isRepoResource(string, aggressive)) {
    promise = cacheRepo(string, rootUrl);
    out = repoUriToCachePath(string, rootUrl);
  } else {
    out = string;
  }
  return [out, promise];
}

function unmark(markedString: string) {
  return markedString.replace(REQUIRE_START, '').replace(REQUIRE_END, '');
}

export default {
  DEFAULT_REPO_URI,
  cacheLocation,
  dumpCacheInfo,
  isRepoResource,
  loadCacheInfo,
  markPath,
  removeRequire,
  shouldMark,
  subRequires,
  translate,
  unmark,
};
