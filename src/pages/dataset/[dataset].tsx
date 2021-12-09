import {GetStaticPaths, GetStaticProps} from 'next';
import React, {useState} from 'react';

import {styled, Typography} from '@mui/material';

import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';
import SimpleDialog from '../../components/simple_dialog';

import {Missing, StyledMarkdown, StyledTitle} from 'src/styles/shared';

import DownloadIcon from '!@svgr/webpack!/assets/icon_download.svg';
import ListIcon from '!@svgr/webpack!/assets/icon_list.svg';
import WebsiteIcon from '!@svgr/webpack!/assets/icon_website.svg';

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

export default function DatasetPage({datasetData}: DatasetPageProps) {
  const [open, setOpen] = useState(false);
  return (
    <Layout>
      <StyledTitle variant="h3" color="primary">
        {datasetData.name}
      </StyledTitle>

      {_urlIsArray(datasetData) && (
        <SimpleDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          urls={datasetData.url}
        />
      )}
      <FocusButton
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
        <StyledMarkdown
          variant="body1"
          // @ts-ignore: "component" does not exist
          component="div"
          className="markdown-body"
          dangerouslySetInnerHTML={{__html: datasetData.content}}
        />
      ) : (
        <Missing variant="body1">
          Content rendered markdown file specified by the &apos;details&apos;
          field of your dataset data in &apos;/data/datasets.yaml&apos; (not
          sure what to use as a default if no value is provided?)
        </Missing>
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
