import React from 'react';

import {styled} from '@mui/material';

import BottomBar from './bottom_bar';
import TopBar from './top_bar';
import {mq} from 'src/styles/shared';

interface LayoutProps {
  children: React.ReactNode[];
  home?: boolean;
  list?: boolean;
}

const StyledMain = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  margin: '0 auto',
});

const StyledContent = styled(StyledMain)({
  maxWidth: '970px',
  padding: '10px',
  width: '100%',
});

const StyledHome = styled(StyledMain)({
  width: '100%',
});

const StyledList = styled(StyledMain)({
  maxWidth: '1700px',
});

const StyledPage = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  a: {
    color: 'inherit',
  },
});

const StyledSpace = styled('div')({
  height: '128px',
  [mq('tablet')]: {
    height: '92px',
  },
});

export default function Layout({
  children,
  home = false,
  list = false,
}: LayoutProps) {
  const Body = home ? StyledHome : list ? StyledList : StyledContent;
  return (
    <StyledPage>
      <TopBar />
      <StyledSpace />
      <Body>{children}</Body>
      <BottomBar />
    </StyledPage>
  );
}
