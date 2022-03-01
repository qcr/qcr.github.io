import React from 'react';

import {Typography, styled} from '@mui/material';

const StyledBar = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  height: '60px',
  justifyContent: 'space-around',
  marginTop: '30px',
  width: '100%',
}));

const StyledContent = styled('div')(({theme}) => ({
  alignItems: 'center',
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  justifyContent: 'space-between',
  padding: '12px',
}));

const StyledText = styled(Typography)({
  fontSize: '0.85rem',
});

export default function BottomBar() {
  return (
    <StyledBar>
      <StyledContent>
        <StyledText variant="body1">CRICOS No. 00213J</StyledText>
      </StyledContent>
    </StyledBar>
  );
}
