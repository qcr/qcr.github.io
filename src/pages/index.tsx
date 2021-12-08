import React from 'react';

import {Typography, styled} from '@mui/material';

import CardCarousel from '../components/card_carousel';
import Layout from '../components/layout';

import bannerImage from '/assets/banner_image.jpg';

import {
  numCode,
  numDatasets,
  numCollections,
  orderByFeatured,
  orderByNewest,
  orderByPopularity,
} from '../../lib/analytics';

import {Content} from '../../lib/content';

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
  widtH: '100%',
});

const StyledWelcome = styled(Typography)({
  alignItems: 'center',
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
});

const sectionStyle = {
  fontWeight: 'bold',
  marginBottom: '12px',
  marginTop: '36px',
};

interface HomePageProps {
  mostPopular: Content[];
  mostRecent: Content[];
  featured: Content[];
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
  if (typeof featured === 'string') featured = JSON.parse(featured);
  if (typeof mostPopular === 'string') mostPopular = JSON.parse(mostPopular);
  if (typeof mostRecent === 'string') mostRecent = JSON.parse(mostRecent);
  return (
    <Layout home>
      <StyledBanner
        alt="QUT Centre for Robotics Banner Image"
        src={bannerImage}
        height={300}
      />
      <StyledWelcome
        variant="body1"
        sx={{
          color: 'white',
          backgroundColor: 'primary.main',
        }}
      >
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
        <Typography variant="h4" color="primary" sx={sectionStyle}>
          Newest Additions
        </Typography>
        <CardCarousel cardsData={mostRecent} />
        <Typography variant="h4" color="primary" sx={sectionStyle}>
          Most Popular
        </Typography>
        <CardCarousel cardsData={mostPopular} />
        {featured.length > 0 && (
          <>
            <Typography variant="h4" color="primary" sx={sectionStyle}>
              Featured Collections
            </Typography>
            <CardCarousel cardsData={featured} />
          </>
        )}
      </StyledContent>
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      featured: orderByFeatured().slice(0, LIMIT_FEATURE),
      mostPopular: orderByPopularity().slice(0, LIMIT_MOST_POPULAR),
      mostRecent: orderByNewest().slice(0, LIMIT_MOST_RECENT),
      codeCount: numCode,
      datasetCount: numDatasets,
      collectionCount: numCollections,
    },
  };
}
