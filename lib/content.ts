import path from 'path';

import {QcrContentCardProps} from 'qcr-sites-shared';

const DEFAULT_IMAGE_URL = '/qcr_logo_light_filled.svg';
const VALID_TYPES = ['code', 'dataset', 'collection'];

export type Content = CodeContent | CollectionContent | DatasetContent;
export type ContentType = 'code' | 'dataset' | 'collection';

export interface ContentCommon {
  name: string;
  type: ContentType;
  id?: string;
  content: string;
  image?: string;
  _images?: string[];
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

export interface CodeContent extends ContentCommon {
  type: 'code';
  url: string;
}

export interface CollectionContent extends ContentCommon {
  type: 'collection';
  code?: string[];
  _code: CodeContent[];
  datasets?: string[];
  _datasets: DatasetContent[];
  feature?: number;
  url?: string;
}

export interface DatasetContent extends ContentCommon {
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

function contentToContentCardProps(content: Content): QcrContentCardProps {
  return {
    linkUrl: `/${content.type}/${content.id}`,
    ...(content.image_fit && {mediaFit: content.image_fit}),
    ...(content.image_position && {mediaPosition: content.image_position}),
    mediaUrls: content._images,
    primaryText: content.name,
    secondaryText:
      content.type === 'dataset'
        ? content.size
          ? content.size
          : ''
        : content.type === 'code'
        ? content.url.replace(/.*\/([^/]*\/[^/]*)$/, '$1')
        : 'Collection',
    secondaryTransform: content.type === 'code' ? 'lowercase' : 'capitalize',
  };
}

function hydrate() {
  // Hydrate the code / datasets fields in all collection content
  Object.values(collections).forEach((p) => {
    if (p.code) {
      p._code = p.code.filter(_isString).map((c) => {
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
      p._datasets = p.datasets.filter(_isString).map((d) => {
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

  // Derive the collection's card image if it's not defined
  Object.values(collections).forEach((c) => {
    if (c.image === undefined) {
      const t =
        c.code && c.code.length > 0
          ? c._code[0]
          : c.datasets && c.datasets.length > 0
          ? c._datasets[0]
          : undefined;
      if (t) {
        const tc = t as Content;
        c.image = tc.image;
        c._images = tc._images;
        if (tc.image_fit) c.image_fit = tc.image_fit;
        if (tc.image_position) c.image_position = tc.image_position;
      } else {
        c.image = DEFAULT_IMAGE_URL;
        c._images = [DEFAULT_IMAGE_URL];
      }
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
  {
    hits: require.context('/content', true, /\.\/.*\.md$/),
    root: '/content',
  },
  // {
  //   hits: require.context('/content/.debug', true, /\.\/.*\.md$/),
  //   root: '/content/.debug',
  // },
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
  contentToContentCardProps,
  datasets,
  datasetCount,
  lookupEntry,
  collections,
  collectionCount,
  randomContent,
};
