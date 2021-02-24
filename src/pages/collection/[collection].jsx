import {Typography} from '@rmwc/typography';

import Card from '../../components/card';
import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';

import icon from '/assets/icon_website.svg';
import styles from '../../styles/collection.module.scss';

import {lookupEntry, collections} from '/lib/content';

export default function CollectionPage({collectionData}) {
  if (typeof collectionData === 'string') collectionData = JSON.parse(collectionData);
  return (
    <Layout>
      <Typography use="headline3" className={styles.heading}>
        {collectionData.name}
      </Typography>
      {collectionData.url && (
        <FocusButton
          newTab
          url={collectionData.url}
          text="Go to collection website"
          icon={icon}
        />
      )}
      <Typography use="body1" className="markdown-body">
        <div dangerouslySetInnerHTML={{__html: collectionData.content}} />{' '}
      </Typography>
      {collectionData.code && (
        <>
          <Typography use="headline4" className={styles.subheading}>
            Code Repositories
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
          <Typography use="headline4" className={styles.subheading}>
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

export function getStaticPaths() {
  return {
    paths: Object.values(collections).map(p => ({
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
      collectionData: JSON.stringify(lookupEntry(ctx.params.collection, 'collection')),
    },
  };
}
