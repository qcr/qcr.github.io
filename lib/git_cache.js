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

import sg from 'simple-git';

const CACHE_LOCATION = '/.repo-cache/';
const REPO_PROTOCOL = 'repo:';

export const DEFAULT_REPO_URI = undefined;

export function isRepoResource(uriString) {
  return uriString.startsWith(`${REPO_PROTOCOL}/`);
}

export function updateRepo(name) {
  // Get user & repo names from name string
  // Create user directory if it doesn't exist
  // Clone repo if named directory doesn't exist
  // Fetch all & reset to tip of remote master
}
