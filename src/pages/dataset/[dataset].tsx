import {GetStaticPaths, GetStaticProps} from 'next';
import React, {useState} from 'react';

import {styled, Typography} from '@mui/material';

import {
  QcrFocusButton,
  QcrMissingContentBox,
  QcrSimpleDialog,
  QcrMarkdown,
  QcrTitle,
} from 'qcr-sites-shared';

import Layout from '../../components/layout';

import DownloadIcon from '!@svgr/webpack!/public/icon_download.svg';
import ListIcon from '!@svgr/webpack!/public/icon_list.svg';
import WebsiteIcon from '!@svgr/webpack!/public/icon_website.svg';

import {
  datasets,
  lookupEntry,
  DatasetContent,
  DatasetUrl,
} from '../../../lib/content';

interface DatasetPageProps {
  datasetData: DatasetContent;
}

function _urlIsArray(
  x: DatasetContent
): x is DatasetContent & {url: DatasetUrl[]} {
  return x.url_type === 'list' && typeof x.url !== 'string';
}

function _urlIsString(x: DatasetContent): x is DatasetContent & {url: string} {
  return !_urlIsArray(x);
}

const StyledSubtitle = styled(Typography)({
  marginBottom: '36px',
});

function _datasetUrlToSimpleDialogItem(datasetUrl: DatasetUrl) {
  return {
    primaryText: datasetUrl.name,
    secondaryText: datasetUrl.size ? datasetUrl.size : ' ',
    linkUrl: datasetUrl.url,
  };
}

export default function DatasetPage({datasetData}: DatasetPageProps) {
  const [open, setOpen] = useState(false);
  return (
    <Layout>
      <QcrTitle variant="h3" color="primary">
        {datasetData.name}
      </QcrTitle>

      {_urlIsArray(datasetData) && (
        <QcrSimpleDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          items={datasetData.url.map((d) => _datasetUrlToSimpleDialogItem(d))}
        />
      )}
      <QcrFocusButton
        url={_urlIsString(datasetData) ? datasetData.url : undefined}
        text={
          datasetData.url_type == 'external'
            ? 'Visit dataset website'
            : datasetData.url_type == 'list'
            ? 'Select dataset variant'
            : 'Download the dataset'
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
      <StyledSubtitle variant="subtitle1" color="primary">
        {datasetData.size}
      </StyledSubtitle>
      {datasetData.content ? (
        <QcrMarkdown
          variant="body1"
          // @ts-ignore: "component" does not exist
          component="div"
          className="markdown-body"
          dangerouslySetInnerHTML={{__html: datasetData.content}}
        />
      ) : (
        <QcrMissingContentBox variant="body1">
          Content rendered markdown file specified by the &apos;details&apos;
          field of your dataset data in &apos;/data/datasets.yaml&apos; (not
          sure what to use as a default if no value is provided?)
        </QcrMissingContentBox>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Object.values(datasets).map((d) => ({
      params: {
        dataset: d.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (ctx) => {
  return {
    props: {
      datasetData: lookupEntry(ctx.params!.dataset as string, 'dataset'),
    },
  };
};
