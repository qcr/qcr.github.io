import cp from 'child_process';

import * as c from './content';

import ANALYTICS from './analytics.csv';

const items = [
  ...Object.values(c.collections),
  ...Object.values(c.code),
  ...Object.values(c.datasets),
];

const numCode = Object.keys(c.code).length;
const numDatasets = Object.keys(c.datasets).length;
const numCollections = Object.keys(c.collections).length;

function _isFeatured(x: any): x is c.CollectionContent & {feature: number} {
  return 'feature' in x && typeof x.feature !== 'undefined';
}

function orderByFeatured() {
  // NOTE: this will NOT RETURN items without a featured key (as it is
  // explicitly opt-in)
  // TODO: Only support collections? For now it supports any type of entry
  const data = items.filter(_isFeatured);
  return data.sort(
    (a, b) => b.feature - a.feature || a.name.localeCompare(b.name)
  );
}

function orderByNewest() {
  const data: [number, c.Content][] = items.map((i) => [
    parseInt(
      cp
        .execSync(
          `git log --format=%ad --date=unix --follow -- ${i.src!.replace(
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
  data.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name));
  return data.map((d) => d[1]);
}

function orderByPopularity() {
  // TODO make this actually pull from Google Analytics rather than a dumped
  // file (once I figure out how to simply get a usable API key with OAuth2...)
  const start = ANALYTICS.findIndex(
    (l) =>
      l.length === 2 &&
      l[0] === 'Page path + query string and screen class' &&
      l[1] === 'Views'
  );
  const end = ANALYTICS.findIndex((l, i) => i > start && l[0] === '');
  const data = ANALYTICS.slice(start + 1, end);
  return data.flatMap((d) => {
    const matches = d[0].match(/^\/(?<type>[^/]*)\/(?<id>[^/]*)/);
    if (matches && matches.groups && matches.groups.type && matches.groups.id) {
      const i = items.find(
        (i) =>
          matches.groups &&
          i.type === matches.groups.type &&
          i.id === matches.groups.id
      );
      return i ? i : [];
    } else {
      return [];
    }
  });
}

export {
  numCode,
  numDatasets,
  numCollections,
  orderByFeatured,
  orderByNewest,
  orderByPopularity,
};
