import datasets from '../data/datasets.yaml';
import projects from '../data/projects.yaml';
import repos from '../data/repositories.yaml';

hydrateDatasets();
hydrateRepos();

hydrateProjects();

function hydrateDatasets() {
  for (const k in datasets) datasets[k].type = 'dataset';
}

function hydrateProjects() {
  for (const k in projects) {
    projects[k].entries = projects[k].entries.map(e => lookupEntry(e));
  }
}

function hydrateRepos() {
  for (const k in repos) repos[k].type = 'repository';
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

export {datasets, projects, repos};
