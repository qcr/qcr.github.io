import Link from 'next/link';

import {Typography, makeStyles} from '@material-ui/core';

import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';

import DownloadIcon from '/assets/icon_download.svg';
import styles from '../../styles/dataset.module.scss';

import {datasets, lookupEntry} from '/lib/content';

const bodyStyle = makeStyles(() => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export default function DatasetPage({datasetData}) {
  const csBody = bodyStyle();
  if (typeof datasetData === 'string') datasetData = JSON.parse(datasetData);
  return (
    <Layout>
      <Typography variant="h3" className={styles.heading} color="primary">
        {datasetData.name}
      </Typography>

      <FocusButton
        url={datasetData.url}
        text="Download the dataset"
        icon={<DownloadIcon />}
      />
      <Typography variant="subtitle1" className={styles.extra} color="primary">
        {datasetData.size}
      </Typography>
      {datasetData.content ? (
        <Typography variant="body1" classes={csBody} className="markdown-body">
          <div dangerouslySetInnerHTML={{__html: datasetData.content}} />{' '}
        </Typography>
      ) : (
        <Typography variant="body1" className={`missing ${styles.content}`}>
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
    paths: Object.values(datasets).map((d) => ({
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
