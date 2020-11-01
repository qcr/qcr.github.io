const cp = require('child_process');

const c = require('./content');

const items = [
  ...Object.values(c.projects),
  ...Object.values(c.code),
  ...Object.values(c.datasets),
];

function orderByFeatured() {
  // NOTE: this will NOT RETURN items without a featured key (as it is
  // explicitly opt-in)
  // TODO: Should this only be projects? For now it supports any type of entry
  const data = items.filter((d) => typeof d.feature !== 'undefined');
  return data.sort(
      (a, b) =>
        parseFloat(b.feature) - parseFloat(a.feature) ||
      a.name.localeCompare(b.name)
  );
}

function orderByNewest() {
  const data = items.map((i) => [
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
  data.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name));
  return data.map((d) => d[1]);
}

module.exports = {orderByFeatured, orderByNewest};
