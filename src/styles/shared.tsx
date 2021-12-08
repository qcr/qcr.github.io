import {Typography, styled} from '@mui/material';

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

export const FocusBox = styled(Typography)({
  alignItems: 'center',
  backgroundColor: 'grey',
  borderColor: 'black',
  borderRadius: '10px',
  borderStyle: 'solid',
  borderWidth: '2px',
  display: 'flex',
  fontStyle: 'italic',
  fontSize: '1.5rem',
  justifyContent: 'center',
  margin: '30px auto',
  padding: '50px',
  textAlign: 'center',
});

export const Notify = styled(FocusBox)({
  backgroundColor: 'lightsalmon',
  borderColor: 'salmon',
});
