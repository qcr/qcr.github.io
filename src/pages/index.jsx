import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

import {Typography} from '@mui/material';

import CardCarousel from '../components/card_carousel';
import Layout from '../components/layout';

import styles from '../styles/index.module.scss';

import {
  numCode,
  numDatasets,
  numCollections,
  orderByFeatured,
  orderByNewest,
  orderByPopularity,
} from '/lib/analytics';

const LIMIT_FEATURE = 10;
const LIMIT_MOST_POPULAR = 10;
const LIMIT_MOST_RECENT = 10;

const sectionStyle = {
  fontWeight: 'bold',
  marginBottom: '12px',
  marginTop: '36px',
};

function HomePage({
  mostPopular,
  mostRecent,
  featured,
  collectionCount,
  codeCount,
  datasetCount,
}) {
  if (typeof featured === 'string') featured = JSON.parse(featured);
  if (typeof mostPopular === 'string') mostPopular = JSON.parse(mostPopular);
  if (typeof mostRecent === 'string') mostRecent = JSON.parse(mostRecent);
  return (
    <Layout home>
      <Image
        alt="QUT Centre for Robotics Banner Image"
        src={require('/assets/banner_image.jpg')}
        className={styles['banner-image']}
        layout="fill"
      />
      <Typography
        variant="body1"
        className={styles.welcome}
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
      </Typography>
      <div className={styles.content}>
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
      </div>
    </Layout>
  );
}

HomePage.propTypes = {
  mostPopular: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  mostRecent: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  featured: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  collectionCount: PropTypes.number,
  codeCount: PropTypes.number,
  datasetCount: PropTypes.number,
};

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

export default HomePage;
