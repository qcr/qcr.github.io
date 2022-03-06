import React from 'react';

import {Typography, styled} from '@mui/material';

import {QcrCardCarousel, QcrContentCardProps} from 'qcr-sites-shared';

import Layout from '../components/layout';

import {
  numCode,
  numDatasets,
  numCollections,
  orderByFeatured,
  orderByNewest,
  orderByPopularity,
} from '../../lib/analytics';

import {contentToContentCardProps} from '../../lib/content';

const LIMIT_FEATURE = 10;
const LIMIT_MOST_POPULAR = 10;
const LIMIT_MOST_RECENT = 10;

const StyledBanner = styled('img')({
  objectFit: 'cover',
  objectPosition: '50% 52.5%',
});

const StyledContent = styled('div')({
  margin: '0 auto',
  maxWidth: '1250px',
  padding: '0 16px',
  width: '100%',
});

const StyledSection = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '12px',
  marginTop: '36px',
});

const StyledWelcome = styled(Typography)(({theme}) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  padding: '36px',
  width: '100%',
  a: {
    textDecoration: 'underline',
  },
  p: {
    fontSize: '1.15em',
    margin: '1ch 0',
    maxWidth: '100ch',
    textAlign: 'center',
  },
}));

interface HomePageProps {
  mostPopular: QcrContentCardProps[];
  mostRecent: QcrContentCardProps[];
  featured: QcrContentCardProps[];
  collectionCount: number;
  codeCount: number;
  datasetCount: number;
}

export default function HomePage({
  mostPopular,
  mostRecent,
  featured,
  collectionCount,
  codeCount,
  datasetCount,
}: HomePageProps) {
  return (
    <Layout home>
      <StyledBanner
        alt="QUT Centre for Robotics Banner Image"
        src="/banner_image.jpg"
        height={300}
      />
      <StyledWelcome variant="body1">
        <p>
          Welcome the QUT Centre for Robotics Open Source website. This is the
          place where we share our public contributions with the wider robotics
          communities. These contributions include &nbsp;
          <strong>{collectionCount}</strong>&nbsp; collections, &nbsp;
          <strong>{codeCount}</strong> codebases, and &nbsp;
          <strong>{datasetCount}</strong>&nbsp; datasets.
        </p>
        <p>
          Please see our{' '}
          <a href="https://github.com/qcr">GitHub organisation</a> and{' '}
          <a href="https://research.qut.edu.au/qcr/">main site</a> for more
          details about the Centre&apos;s work.
        </p>
      </StyledWelcome>
      <StyledContent>
        <StyledSection variant="h4" color="primary">
          Newest Additions
        </StyledSection>
        <QcrCardCarousel cardsData={mostRecent} />
        <StyledSection variant="h4" color="primary">
          Most Popular
        </StyledSection>
        <QcrCardCarousel cardsData={mostPopular} />
        {featured.length > 0 && (
          <>
            <StyledSection variant="h4" color="primary">
              Featured Collections
            </StyledSection>
            <QcrCardCarousel cardsData={featured} />
          </>
        )}
      </StyledContent>
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      featured: orderByFeatured()
        .slice(0, LIMIT_FEATURE)
        .map((c) => contentToContentCardProps(c)),
      mostPopular: orderByPopularity()
        .slice(0, LIMIT_MOST_POPULAR)
        .map((c) => contentToContentCardProps(c)),
      mostRecent: orderByNewest()
        .slice(0, LIMIT_MOST_RECENT)
        .map((c) => contentToContentCardProps(c)),
      codeCount: numCode,
      datasetCount: numDatasets,
      collectionCount: numCollections,
    },
  };
}
