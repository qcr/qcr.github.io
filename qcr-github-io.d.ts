declare module '*.csv' {
  const content: string[][];
  export default content;
}

declare module '*.md' {
  import {GrayMatterFile} from 'gray-matter';
  const content: GrayMatterFile<string>;
  export default content;
}

declare module '!@svgr/webpack*' {
  const content: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
