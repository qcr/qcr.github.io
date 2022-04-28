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
  // Don't touch already marked URIs
  if (isMarkedUri(uri)) return uri;

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

function getUriOptions(possiblyMarkedString: string) {
  return undoMark(possiblyMarkedString).match(/.*\?(.*)$/)![1];
}

function isAbsolutePathUri(uri: string) {
  return uri.startsWith('/');
}

function isGifUri(uri: string) {
  return uri.toLowerCase().endsWith('.gif');
}

function isMarkedUri(uri: string) {
  return REQUIRE_REGEX.test(uri);
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

function markUri(uri: string, option?: string) {
  return `${REQUIRE_START}${uri}${option ? option : ''}${REQUIRE_END}`;
}

async function processUri(
  uri: string,
  pathContext: string,
  repoContext?: string,
  options?: string,
  ignoreHttp = false
) {
  const c = await convertUri(uri, pathContext, repoContext);
  return !(ignoreHttp && /^http/.test(c)) && shouldMark(c)
    ? markUri(c, options)
    : c;
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
  const r = repoUri.match(`^${REPO_SCHEME}([^\/]*)\/([^\/]*)\/(.*)$`);
  if (r === null) throw e;

  // Convert the explicit repo URI to HTTPS and return the result
  return `https://github.com/${r[1]}/${r[2]}/raw/HEAD/${r[3]}`;
}

function shouldMark(uri: string) {
  return !isMarkedUri(uri) && (isAbsolutePathUri(uri) || isGifUri(uri));
}

function undoMark(possiblyMarkedString: string) {
  return possiblyMarkedString
    .replace(REQUIRE_START, '')
    .replace(REQUIRE_END, '');
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
  return `require(${loaderUtils.stringifyRequest(ctx, uri)})`;
}

export {
  REPO_DEFAULT_URI,
  convertUri,
  getUriOptions,
  isGifUri,
  markObjectUris,
  markUri,
  processUri,
  shouldMark,
  undoMark,
  unmarkString,
};
