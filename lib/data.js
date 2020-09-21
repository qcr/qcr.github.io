// import {DEFAULT_REPO_URI, isRepoResource, updateRepo} from './git_cache';

import datasets from '../data/datasets.yaml';
import projects from '../data/projects.yaml';
import repos from '../data/repositories.yaml';

hydrateDatasets();
hydrateRepos();

hydrateProjects();

function hydrateDatasets() {
  hydrateEntries(datasets, 'dataset');
}

function hydrateEntries(entries, type) {
  for (const e in entries) {
    if (Object.prototype.hasOwnProperty.call(entries, e)) {
      entries[e].id = e;
      entries[e].type = type;
      if (!('details' in entries[e])) {
        if (type === 'repository') {
          // entries[e].details = DEFAULT_REPO_URI;
        } else if (type === 'datasets') {
          throw new Error(
            `Dataset error: dataset '${e}' has no details (we can't ` +
              `expect people to download a dataset with no details)`
          );
        }
      }

      // Handle remote resource requests
      // if (isRepoResource(entries[e].details)) {
      //   updateRepo(entries[e].url);
      // }
    }
  }
}

function hydrateProjects() {
  for (const k in projects) {
    if (Object.prototype.hasOwnProperty.call(projects, k)) {
      projects[k].entries = projects[k].entries.map(e => lookupEntry(e));
    }
  }
}

function hydrateRepos() {
  hydrateEntries(repos, 'repository');
}

function lookupEntry(name) {
  const r = repos[name];
  const d = datasets[name];
  if (typeof r === 'undefined' && typeof d === 'undefined') {
    throw new Error(
      `Data error: could not find a repo or dataset with the label '${name}'`
    );
  } else if (typeof r !== 'undefined' && typeof d !== 'undefined') {
    throw new Error(
      `Data error: found BOTH a repo and dataset with the label '${name}'`
    );
  }
  return typeof r === 'undefined' ? d : r;
}

export {datasets, lookupEntry, projects, repos};
