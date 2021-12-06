export type BreakPointName = 'phone' | 'tablet' | 'laptop' | 'hi-res';

const _mqs: {[key in BreakPointName]: number} = {
  phone: 320,
  tablet: 641,
  laptop: 1025,
  'hi-res': 1281,
};

export function mq(name: BreakPointName) {
  return `@media (min-width: ${_mqs[name]}px)`;
}
