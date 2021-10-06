import Link from 'next/link';

import {Typography} from '@mui/material';

import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';

import DownloadIcon from '!@svgr/webpack!/assets/icon_download.svg';
import styles from '../../styles/dataset.module.scss';

import {datasets, lookupEntry} from '/lib/content';

export default function DatasetPage({datasetData}) {
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
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{fontStyle: 'italic', marginBottom: '36px'}}
      >
        {datasetData.size}
      </Typography>
      {datasetData.content ? (
        <Typography
          variant="body1"
          className="markdown-body"
          sx={{marginLeft: 'auto', marginRight: 'auto'}}
        >
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
