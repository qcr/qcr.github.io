import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';

import {AppBar, Tab, Tabs, styled} from '@mui/material';

import {mq} from 'src/styles/shared';

import QcrLogo from '!@svgr/webpack!/public/qcr_logo_light.svg';

const StyledBar = styled(AppBar)({
  alignItems: 'center',
  justifyContent: 'space-around',
  [mq('tablet')]: {
    flexDirection: 'row',
  },
});

const StyledLogo = styled(QcrLogo)({
  width: '100px',
  margin: '0px 6px',
  cursor: 'pointer',
  [mq('tablet')]: {
    width: '150px',
  },
});

const StyledTab = styled(Tab)(({theme}) => ({
  color: 'white',
  opacity: 1.0,
  textTransform: 'capitalize',
}));

export default function TopBar() {
  const r = useRouter();
  const selected = r.asPath.startsWith('/collection')
    ? 0
    : r.asPath.startsWith('/code')
    ? 1
    : r.asPath.startsWith('/dataset')
    ? 2
    : false;
  return (
    <StyledBar>
      <Link href="/" passHref>
        <a>
          <StyledLogo />
        </a>
      </Link>
      <Tabs
        value={selected}
        TabIndicatorProps={{
          style: {
            backgroundColor: 'white',
          },
        }}
      >
        <Link href="/collection" passHref>
          <StyledTab label="Collections" />
        </Link>
        <Link href="/code" passHref>
          <StyledTab label="Code" />
        </Link>
        <Link href="/dataset" passHref>
          <StyledTab label="Datasets" />
        </Link>
      </Tabs>
    </StyledBar>
  );
}
