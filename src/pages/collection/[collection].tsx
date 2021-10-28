import PropTypes from 'prop-types';
import React from 'react';

import {Typography} from '@mui/material';

import Card from '../../components/card';
import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';

import WebsiteIcon from '!@svgr/webpack!/assets/icon_website.svg';
import styles from '../../styles/collection.module.scss';

import {lookupEntry, collections} from '/lib/content';

const sectionStyle = {
  fontWeight: 'bold',
  marginTop: '36px',
  marginBottom: '12px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

function CollectionPage({collectionData}) {
  if (typeof collectionData === 'string') {
    collectionData = JSON.parse(collectionData);
  }
  return (
    <Layout>
      <Typography
        variant="h3"
        color="primary"
        sx={{maxWidth: '45rem', marginLeft: 'auto', marginRight: 'auto'}}
      >
        {collectionData.name}
      </Typography>
      {collectionData.url && (
        <FocusButton
          newTab
          url={collectionData.url}
          text="Go to collection website"
          icon={<WebsiteIcon />}
          className={styles.button}
        />
      )}
      <div className={styles.space} />
      <Typography
        use="body1"
        className="markdown-body"
        sx={{marginLeft: 'auto', marginRight: 'auto'}}
        component="div"
        dangerouslySetInnerHTML={{__html: collectionData.content}}
      />
      {collectionData.code && (
        <>
          <Typography variant="h5" color="primary" sx={sectionStyle}>
            Codebases
          </Typography>
          <div className={styles.cards}>
            {collectionData.code.map((r, i) => (
              <Card key={i} cardData={r} />
            ))}
          </div>
        </>
      )}
      {collectionData.datasets && (
        <>
          <Typography variant="h5" color="primary" sx={sectionStyle}>
            Datasets
          </Typography>
          <div className={styles.cards}>
            {collectionData.datasets.map((r, i) => (
              <Card key={i} cardData={r} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}

CollectionPage.propTypes = {
  collectionData: PropTypes.object,
};

export function getStaticPaths() {
  return {
    paths: Object.values(collections).map((p) => ({
      params: {
        collection: p.id,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  return {
    props: {
      collectionData: JSON.stringify(
          lookupEntry(ctx.params.collection, 'collection'),
      ),
    },
  };
}

export default CollectionPage;
