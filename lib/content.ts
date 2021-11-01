import {JSDOM} from 'jsdom';
import path from 'path';

import DEFAULT_IMAGE from '/assets/qcr_logo_light_filled.svg';

const VALID_TYPES = ['code', 'dataset', 'collection'];

type ContentType = 'code' | 'dataset' | 'collection';

export interface Content {
  name: string;
  type: ContentType;
  id?: string;
  content: string;
  image?: string;
  _image?: string;
  image_position?: string;
  image_fit?: string;
  src?: string;
}

export interface ContentLocation {
  hits: __WebpackModuleApi.RequireContext;
  root: string;
}

export interface ContentSet {
  code: {[key: string]: CodeContent};
  collection: {[key: string]: CollectionContent};
  dataset: {[key: string]: DatasetContent};
}

export interface DatasetUrl {
  name: string;
  url: string;
  size: string;
}

export interface CodeContent extends Content {
  type: 'code';
  url: string;
}

export interface CollectionContent extends Content {
  type: 'collection';
  code?: (string | CodeContent)[];
  datasets?: (string | DatasetContent)[];
  feature?: number;
}

export interface DatasetContent extends Content {
  type: 'dataset';
  size: string;
  url: string | DatasetUrl[];
  url_type: 'list' | 'external' | 'internal';
}

function _isString(x: any): x is string {
  return typeof x === 'string';
}

class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentError';
  }
}

function hydrate() {
  // Hydrate the code / datasets fields in all collection content
  Object.values(collections).forEach((p) => {
    if (p.code) {
      p.code = p.code.filter(_isString).map((c) => {
        if (!(c in code)) {
          throw new ContentError(
            `Collection '${p.id}' contains code with ID '${c}' which ` +
              `doesn't exist! (offending collection file: ${p.src})`
          );
        }
        return code[c];
      });
    }
    if (p.datasets) {
      p.datasets = p.datasets.filter(_isString).map((d) => {
        if (!(d in datasets)) {
          throw new ContentError(
            `Collection '${p.id}' contains dataset with ID '${d}' which ` +
              `doesn't exist! (offending collection file: ${p.src})`
          );
        }
        return datasets[d];
      });
    }
  });

  // Hydrate the image field in all entries
  [...Object.values(code), ...Object.values(datasets)].forEach((c) => {
    // Try & pull first image from HTML content
    if (c.image === undefined) {
      const d = new JSDOM(`${c.content}`).window.document;
      const media = Array.from(d.querySelectorAll('img, video')) as (
        | HTMLVideoElement
        | HTMLImageElement
      )[];
      if (media) {
        const m = media.find((m) => {
          return (
            m.tagName === 'VIDEO'
              ? (m as HTMLVideoElement).poster
              : (m as HTMLImageElement).src
          ).startsWith('/_next/');
        });
        if (m && m.tagName === 'VIDEO') {
          c.image = (m as HTMLVideoElement).poster;
          c._image = (m.querySelector('source') as HTMLSourceElement).src;
        } else if (m) {
          c.image = (m as HTMLImageElement).src;
        }
      }
    }

    // If this fails, fallback to the default image
    if (c.image === undefined) c.image = DEFAULT_IMAGE;
  });
  Object.values(collections).forEach((p) => {
    if (p.image === undefined) {
      const t =
        p.code && p.code.length > 0
          ? p.code[0]
          : p.datasets && p.datasets.length > 0
          ? p.datasets[0]
          : undefined;
      p.image = t ? (t as Content).image : DEFAULT_IMAGE;
      if (t) p.image_position = (t as Content).image_position;
    }
  });
}

function importContent(reqs: ContentLocation[]) {
  const ret: ContentSet = {code: {}, dataset: {}, collection: {}};
  for (const r of reqs) {
    for (const k of r.hits.keys()) {
      // Import, & fill in default values
      const c = r.hits(k).default as
        | CodeContent
        | CollectionContent
        | DatasetContent;
      c.src = path.join(r.root, k);
      if (!c.id) {
        c.id = k.replace(/.*\/(.*)\.[^.]*$/g, '$1').replace(/_/g, '-');
      }
      if (!c.image_position) c.image_position = 'center';

      // Handle all possible data errors here
      // TODO finish potential error set...
      if (!VALID_TYPES.includes(c.type)) {
        throw new ContentError(
          `Invalid type. The value '${c.type}' is not in the accepted ` +
            `values list:\n\t${VALID_TYPES}\n(offending content file: ${k})`
        );
      } else if (ret[c.type][c.id] !== undefined) {
        throw new ContentError(
          `Duplicate content with same ID ('${c.id}') & type ('${c.type}').` +
            ` Offending files:\n\t${ret[c.type][c.id].src}\n\t${c.src}\n` +
            `Please either add a different 'id' to one of the entries, or ` +
            `change the filename.`
        );
      } else if (c.type === 'dataset' && !c.content.trim()) {
        throw new ContentError(
          `Dataset provided without any description. We can't expect ` +
            `people to download datasets without details!\n` +
            `(offending content file: ${k})`
        );
      }

      // Passes all checks, let's add it to our content set
      ret[c.type][c.id] = c;
    }
  }
  return ret;
}

function lookupEntry(name: string, type: ContentType) {
  if (content[type] === undefined || content[type][name] === undefined) {
    throw new ContentError(
      `Failed to find content with ID '${name}' & type '${type}'. ` +
        `Are you sure this exists?`
    );
  }
  return content[type][name];
}

function randomContent() {
  // TODO remove this function
  const all = [
    ...Object.values(code),
    ...Object.values(datasets),
    ...Object.values(collections),
  ];
  return all[Math.floor(Math.random() * all.length)];
}

const content = importContent([
  {hits: require.context('/content/', true, /\.md$/), root: '/content'},
  {
    hits: require.context('/content/.remote', true, /\.md$/),
    root: '/content/.remote',
  },
]);

const code = content.code;
const datasets = content.dataset;
const collections = content.collection;
hydrate();

const codeCount = Object.values(code).length;
const datasetCount = Object.values(datasets).length;
const collectionCount = Object.values(collections).length;

export {
  code,
  codeCount,
  datasets,
  datasetCount,
  lookupEntry,
  collections,
  collectionCount,
  randomContent,
};
