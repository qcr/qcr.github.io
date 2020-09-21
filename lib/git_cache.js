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
