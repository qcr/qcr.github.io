import loaderUtils from 'loader-utils';
import path from 'path';

import type * as webpack from 'webpack';

const REPO_DEFAULT_BRANCH = 'master';
const REPO_SCHEME = 'repo:';
const REPO_DEFAULT_URI = `${REPO_SCHEME}/README.md`;

const REQUIRE_MARKER = 'REQUIRE';
const REQUIRE_START = `@${REQUIRE_MARKER}@`;
const REQUIRE_END = `@/${REQUIRE_MARKER}@`;
const REQUIRE_REGEX = new RegExp(
  `(\\\\?")?${REQUIRE_START}(.*?)${REQUIRE_END}(\\\\?")?`,
  'g'
);

const _defaultBranchCache: {[key: string]: any} = {};

function defaultBranchKey(repoUser: string, repoName: string) {
  return `${repoUser}/${repoName}`;
}

function blobUriToRawUri(uri: string) {
  return uri.replace(
    /^(https?\:\/\/github\.com\/[^\/]*\/[^\/]*\/)blob/,
    '$1raw'
  );
}

async function convertUri(
  uri: string,
  pathContext: string,
  repoContext?: string
) {
  // Convert 'repo:' URIs to HTTPS
  if (isRepoUri(uri)) uri = await repoUriToHttpsUri(uri, repoContext);

  // Convert 'blob' GitHub HTTPS URLs to 'raw' (no check needed as the regex
  // won't modify if it isn't a blob URI)
  uri = blobUriToRawUri(uri);

  // Convert relative path URIs to absolute paths using context
  if (isRelativePathUri(uri))
    uri = relativePathUriToAbsoluteUri(uri, pathContext);

  return uri;
}

function isAbsolutePathUri(uri: string) {
  return uri.startsWith('/');
}

function isGifUri(uri: string) {
  return uri.toLowerCase().endsWith('.gif');
}

function isRelativePathUri(uri: string) {
  return !isAbsolutePathUri(uri) && !/^https?:/.test(uri);
}

function isRepoUri(uri: string) {
  return uri.startsWith(REPO_SCHEME);
}

async function markObjectUris(
  obj: {[key: string]: any},
  keyNames: string[],
  pathContext: string,
  repoContext?: string
) {
  await Promise.all(
    Object.entries(obj).map(async ([k, v]) => {
      // Handle any non-string keys
      if (typeof v === 'object')
        obj[k] = await markObjectUris(v, keyNames, pathContext, repoContext);
      if (!keyNames.includes(k)) return;
      if (typeof v !== 'string') return;

      // Convert to URI and mark if appropriate
      obj[k] = await processUri(v, pathContext, repoContext);
    })
  );
  return obj;
}

function markUri(uri: string) {
  return `${REQUIRE_START}${uri}${REQUIRE_END}`;
}

async function processUri(
  uri: string,
  pathContext: string,
  repoContext?: string
) {
  const c = await convertUri(uri, pathContext, repoContext);
  // console.log(
  //   `${pathContext} -> '???':\n\t${uri}\n\t${c}\n\t${shouldMark(c)}${
  //     shouldMark(c) ? `\n\t${markUri(c)}` : ''
  //   }`
  // );
  return shouldMark(c) ? markUri(c) : c;
}

function relativePathUriToAbsoluteUri(pathUri: string, pathRoot: string) {
  // Absolute URIs can be either '/...' or 'https?://...'
  return path.join(path.dirname(pathRoot), pathUri);
}

async function repoUriToHttpsUri(repoUri: string, repoContext?: string) {
  // Attempt to convert to explicit format if implicit format is used
  const e = Error(
    `No repo user and/or name could be found using:\n\tURI ` +
      `'${repoUri}'\n\tContext: '${repoContext}'`
  );
  if (repoUri.startsWith(`${REPO_SCHEME}/`)) {
    if (typeof repoContext === 'undefined') throw e;

    const ms = repoContext.match(`https?\:\/\/github\.com\/([^\/]*)\/([^\/]*)`);
    if (ms === null || ms.length !== 3) throw e;

    repoUri = `${REPO_SCHEME}${ms[1]}/${ms[2]}${repoUri.substring(
      REPO_SCHEME.length
    )}`;
  }

  // Get details about the repository (including the default branch)
  const r = repoUri.match(`^${REPO_SCHEME}([^\/]*)\/([^\/]*)\/(.*)$`);
  if (r === null) throw e;
  const k = defaultBranchKey(r[1], r[2]);
  let branch = _defaultBranchCache[k];
  if (branch === null) {
    // Waits for default branch currently being fetched
    await new Promise<void>((resolve, _) => {
      (function waitForBranch() {
        if (_defaultBranchCache[k] !== null) return resolve();
        setTimeout(waitForBranch, 50);
      })();
    });
    branch = _defaultBranchCache[k];
  } else if (typeof branch === 'undefined') {
    // Starts the process of fetching a default branch
    _defaultBranchCache[k] = null;
    try {
      const resp = await fetch(`https://api.github.com/repos/${r[1]}/${r[2]}`);
      if (resp.status >= 400 && resp.status < 600) throw Error();
      const j = await resp.json();
      if (typeof j.default_branch === 'undefined') throw Error();
      branch = j.default_branch;
    } catch (err) {
      branch = REPO_DEFAULT_BRANCH;
      console.log(
        `Failed to fetch default branch for '${k}', ` +
          `using '${branch}' as fallback.`
      );
    }
    _defaultBranchCache[k] = branch;
  }

  // Convert the explicit repo URI to HTTPS and return the result
  return `https://github.com/${r[1]}/${r[2]}/raw/${branch}/${r[3]}`;
}

function shouldMark(uri: string) {
  return isAbsolutePathUri(uri) || isGifUri(uri);
}

function unmarkString(markedString: string, ctx: webpack.LoaderContext<any>) {
  return markedString.replace(
    REQUIRE_REGEX,
    (match, p1, p2, p3, offset, src) => {
      const pre = !p1 || p1 === '\\"' ? `${p1}"+` : '';
      const post = !p3 || p3 === '\\"' ? `+"${p3}` : '';
      return `${pre}${umarkUri(p2, ctx)}${post}`;
    }
  );
}

function umarkUri(uri: string, ctx: webpack.LoaderContext<any>) {
  const src = /\.(jpg|png)$/.test(uri.toLowerCase()) ? `${uri}?webp` : uri;
  return `require(${loaderUtils.stringifyRequest(ctx, src)})`;
}

export {
  REPO_DEFAULT_URI,
  convertUri,
  markObjectUris,
  processUri,
  shouldMark,
  unmarkString,
};
