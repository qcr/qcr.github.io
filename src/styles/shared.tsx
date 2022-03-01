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

export const Missing = styled(FocusBox)({
  backgroundColor: 'lightsalmon',
  borderColor: 'salmon',
  height: '1000px',
});

export const Notify = styled(FocusBox)({
  backgroundColor: 'lightsalmon',
  borderColor: 'salmon',
});

export const StyledMarkdown = styled(Typography)({
  '&&': {
    margin: '0 auto',
    maxWidth: '45rem',
    '.embedded-block': {
      margin: '10px',
      textAlign: 'center',
    },
    'iframe, img, video': {
      maxWidth: '100%',
    },
    ":not(pre) > code[class*='language-']": {
      paddingLeft: '0.3em',
      paddingRight: '0.3em',
    },
  },
});

export const StyledTitle = styled(Typography)({
  marginTop: '48px',
});
