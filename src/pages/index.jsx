import {Typography} from '@material-ui/core';

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

export default function HomePage({
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
      <img
        alt="QUT Centre for Robotics Banner Image"
        src={require('/assets/banner_image.jpg')}
        className={styles['banner-image']}
        layout="fill"
      />
      <div className={styles.welcome}>
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
          <a href="https://research.qut.edu.au/qcr/">main site</a> for more
          details about the Centre.
        </p>
      </div>
      <div className={styles.content}>
        <Typography use="headline4" className="heading">
          Newest Additions
        </Typography>
        <CardCarousel cardsData={mostRecent} />
        <Typography use="headline4" className="heading">
          Most Popular
        </Typography>
        <CardCarousel cardsData={mostPopular} />
        {featured.length > 0 && (
          <>
            <Typography use="headline4" className="heading">
              Featured Collections
            </Typography>
            <CardCarousel cardsData={featured} />
          </>
        )}
      </div>
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
