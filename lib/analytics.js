const cp = require('child_process');

const c = require('./content');

const ANALYTICS = require('./analytics.csv');

const items = [
  ...Object.values(c.projects),
  ...Object.values(c.code),
  ...Object.values(c.datasets),
];

const numCode = Object.keys(c.code).length;
const numDatasets = Object.keys(c.datasets).length;
const numProjects = Object.keys(c.projects).length;

function orderByFeatured() {
  // NOTE: this will NOT RETURN items without a featured key (as it is
  // explicitly opt-in)
  // TODO: Should this only be projects? For now it supports any type of entry
  const data = items.filter(d => typeof d.feature !== 'undefined');
  return data.sort(
    (a, b) =>
      parseFloat(b.feature) - parseFloat(a.feature) ||
      a.name.localeCompare(b.name)
  );
}

function orderByNewest() {
  const data = items.map(i => [
    parseInt(
      cp
        .execSync(
          `git log --format=%ad --date=unix --follow -- ${i.src.replace(
            /^\//,
            ''
          )} | tail -1`,
          {
            encoding: 'utf8',
          }
        )
        .trim()
    ),
    i,
  ]);
  console.log(data);
  data.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name));
  return data.map(d => d[1]);
}

function orderByPopularity() {
  // TODO make this actually pull from Google Analytics rather than a dumped
  // file (once I figure out how to simply get a usable API key with OAuth2...)
  const start = ANALYTICS.findIndex(
    l =>
      l.length === 2 &&
      l[0] === 'Page path and screen class' &&
      l[1] === 'Views'
  );
  const end = ANALYTICS.findIndex((l, i) => i > start && l[0] === '');
  const data = ANALYTICS.slice(start + 1, end);
  return data.flatMap(d => {
    const matches = d[0].match(/^\/(?<type>[^/]*)\/(?<id>[^/]*)/);
    if (matches && matches.groups.type && matches.groups.id) {
      const i = items.find(
        i => i.type === matches.groups.type && i.id === matches.groups.id
      );
      return i ? i : [];
    } else {
      return [];
    }
  });
}

module.exports = {
  numCode,
  numDatasets,
  numProjects,
  orderByFeatured,
  orderByNewest,
  orderByPopularity,
};
