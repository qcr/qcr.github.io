import React from 'react';
import {useRouter} from 'next/router';

import {styled} from '@mui/material';

import {QcrBody, QcrBottomBar, QcrPage, QcrTopBar} from 'qcr-sites-shared';

interface LayoutProps {
  children: React.ReactNode[];
  home?: boolean;
  list?: boolean;
}

const StyledHome = styled(QcrBody)({
  padding: '0px',
  maxWidth: 'initial',
  width: '100%',
});

const StyledList = styled(QcrBody)({
  maxWidth: '1700px',
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
  const Body = home ? StyledHome : list ? StyledList : QcrBody;
  return (
    <QcrPage>
      <QcrTopBar selected={selected} title="Open Source" tabs={tabs} />
      <Body>{children}</Body>
      <QcrBottomBar />
    </QcrPage>
  );
}
