import {Button} from '@rmwc/button';
import {Typography} from '@rmwc/typography';

import Link from 'next/link';

import Layout from '../../components/layout';
import styles from '../../styles/dataset.module.scss';
import icon from '/assets/icon_download.svg';

import {datasets, lookupEntry} from '/lib/content';

export default function DatasetPage({datasetData}) {
  if (typeof datasetData === 'string') datasetData = JSON.parse(datasetData);
  return (
    <Layout>
      <Typography use="headline3" className={styles.heading}>
        {datasetData.name}
      </Typography>

      <Link href={datasetData.url}>
        <Button raised trailingIcon={icon} className={styles.button}>
          Download the dataset
        </Button>
      </Link>
      <Typography use="body2" className={styles.extra}>
        {datasetData.size}
      </Typography>
      {datasetData.content ? (
        <Typography use="body1" className="markdown">
          <div dangerouslySetInnerHTML={{__html: datasetData.content}} />{' '}
        </Typography>
      ) : (
        <Typography use="body1" className={`missing ${styles.content}`}>
          Content rendered markdown file specified by the 'details' field of
          your dataset data in '/data/datasets.yaml' (not sure what use as a
          default if no value is provided?)
        </Typography>
      )}
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: Object.values(datasets).map(d => ({
      params: {
        dataset: d.id,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  return {
    props: {
      datasetData: JSON.stringify(lookupEntry(ctx.params.dataset, 'dataset')),
    },
  };
}