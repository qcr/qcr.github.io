import React from 'react';
import {useRouter} from 'next/router';

import {styled} from '@mui/material';

import {QcrBottomBar, QcrPage, QcrTopBar, qcr_mqs} from 'qcr-sites-shared';

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

const StyledSpace = styled('div')({
  height: '128px',
  [qcr_mqs('tablet')]: {
    height: '92px',
  },
});

const tabs = [
  {text: 'Collections', target: '/collection'},
  {text: 'Code', target: '/code'},
  {text: 'Datasets', target: '/dataset'},
];

export default function Layout({
  children,
  home = false,
  list = false,
}: LayoutProps) {
  const r = useRouter();
  const selected = r.asPath.startsWith('/collection')
    ? 0
    : r.asPath.startsWith('/code')
    ? 1
    : r.asPath.startsWith('/dataset')
    ? 2
    : false;
  const Body = home ? StyledHome : list ? StyledList : StyledContent;
  return (
    <QcrPage>
      <QcrTopBar selected={selected} title="Open Source" tabs={tabs} />
      <StyledSpace />
      <Body>{children}</Body>
      <QcrBottomBar />
    </QcrPage>
  );
}
