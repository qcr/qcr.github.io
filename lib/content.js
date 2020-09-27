import path from 'path';

const DEFAULT_IMAGE = require('/assets/qcr_logo_light_filled.png');
const VALID_TYPES = ['code', 'dataset', 'project'];

class ContentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ContentError';
  }
}

function hydrate() {
  // Hydrate the code / datasets fields in all project content
  Object.values(projects).forEach(p => {
    if (p.code) {
      p.code = p.code.map(c => {
        if (!(c in code)) {
          throw new ContentError(
            `Project '${p.id}' contains code with ID '${c}' which doesn't exist!` +
              `(offending project file: ${p.src})`
          );
        }
        return code[c];
      });
    }
    if (p.datasets) {
      p.datasets = p.datasets.map(d => {
        if (!(d in datasets)) {
          throw new ContentError(
            `Project '${p.id}' contains dataset with ID '${d}' which doesn't exist!` +
              `(offending project file: ${p.src})`
          );
        }
        return datasets[d];
      });
    }
  });

  // Hydrate the image field in all entries
  [...Object.values(code), ...Object.values(datasets)].forEach(c => {
    // Try & pull first image from HTML content
    if (c.image === undefined) {
      c.image = undefined;
    }

    // If this fails, fallback to the default image
    if (c.image === undefined) c.image = DEFAULT_IMAGE;
  });
  Object.values(projects).forEach(p => {
    if (p.image === undefined)
      p.image =
        p.code && p.code.length > 0
          ? p.code[0].image
          : p.dataset && p.dataset.length > 0
          ? p.dataset[0]
          : DEFAULT_IMAGE;
  });
}

function importContent(req) {
  const ret = {code: {}, dataset: {}, project: {}};
  req.keys().forEach(k => {
    const c = req(k).default;
    if (typeof c === 'string') {
      console.log(`Key '${k}' created (type: '${typeof c}'):`);
      console.log(c);
    }
    c.src = k;
    if (!c.id) c.id = k.replace(/.*\/(.*)\.[^\.]*$/g, '$1');

    // Handle all possible data errors here
    // TODO finish potential error set...
    if (!VALID_TYPES.includes(c.type)) {
      throw new ContentError(
        `Invalid type. The value '${c.type}' is not in the accepted values list:\n` +
          `\t${VALID_TYPES}\n` +
          `(offending content file: ${k})`
      );
    } else if (ret[c.type][c.id] !== undefined) {
      throw new ContentError(
        `Duplicate content with same ID ('${c.id}') & type ('${c.type}'). Offending files:\n ` +
          `\t${ret[c.type][c.id].src}\n` +
          `\t${k}`
      );
    } else if (c.type === 'dataset' && !c.content.trim()) {
      throw new ContentError(
        `Dataset provided without any description. We can't expect people to download datasets without details!` +
          `(offending content file: ${k})`
      );
    }

    // Passes all checks, let's add it to our content set
    ret[c.type][c.id] = c;
  });
  return ret;
}

function lookupEntry(name, type) {
  if (content[type] === undefined || content[type][name] === undefined) {
    throw new ContentError(
      `Failed to find content with ID '${name}' & type '${type}'. Are you sure this exists?`
    );
  }
  return content[type][name];
}

function randomContent() {
  // TODO remove this function
  const all = [
    ...Object.values(code),
    ...Object.values(datasets),
    ...Object.values(projects),
  ];
  return all[Math.floor(Math.random() * all.length)];
}

const content = importContent(require.context('/content/', true, /\.md$/));

const code = content.code;
const datasets = content.dataset;
const projects = content.project;
hydrate();

export {code, datasets, lookupEntry, projects, randomContent};
