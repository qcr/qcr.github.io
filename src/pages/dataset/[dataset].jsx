import {useState} from 'react';
import Link from 'next/link';

import {Typography} from '@mui/material';

import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';
import SimpleDialog from '../../components/simple_dialog';

import DownloadIcon from '!@svgr/webpack!/assets/icon_download.svg';
import ListIcon from '!@svgr/webpack!/assets/icon_list.svg';
import WebsiteIcon from '!@svgr/webpack!/assets/icon_website.svg';
import styles from '../../styles/dataset.module.scss';

import {datasets, lookupEntry} from '/lib/content';

export default function DatasetPage({datasetData}) {
  const [open, setOpen] = useState(false);
  if (typeof datasetData === 'string') datasetData = JSON.parse(datasetData);
  return (
    <Layout>
      <Typography
        variant="h3"
        color="primary"
        sx={{maxWidth: '45rem', marginLeft: 'auto', marginRight: 'auto'}}
      >
        {datasetData.name}
      </Typography>

      {datasetData.url_type == 'list' && (
        <SimpleDialog open={open} urls={datasetData.url} />
      )}
      <FocusButton
        url={datasetData.url_type != 'list' ? datasetData.url : undefined}
        text={
          datasetData.url_type == 'external' ?
            'Visit dataset website' :
            datasetData.url_type == 'list' ?
            'Select dataset variant' :
            'Download the dataset'
        }
        icon={
          datasetData.url_type == 'external' ? (
            <WebsiteIcon />
          ) : datasetData.url_type == 'list' ? (
            <ListIcon />
          ) : (
            <DownloadIcon />
          )
        }
        onClick={
          datasetData.url_type == 'list' ? () => setOpen(true) : undefined
        }
      />
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{marginBottom: '36px'}}
      >
        {datasetData.size}
      </Typography>
      {datasetData.content ? (
        <Typography
          variant="body1"
          className="markdown-body"
          sx={{marginLeft: 'auto', marginRight: 'auto'}}
          component="div"
          dangerouslySetInnerHTML={{__html: datasetData.content}}
        />
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
