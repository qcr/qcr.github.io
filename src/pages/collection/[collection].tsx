import {GetStaticPaths, GetStaticProps} from 'next';
import React from 'react';

import {Typography, styled} from '@mui/material';

import {
  ContentCard,
  FocusButton,
  StyledMarkdown,
  StyledTitle,
} from 'sites-shared';

import Layout from '../../components/layout';

import WebsiteIcon from '!@svgr/webpack!/public/icon_website.svg';

import {
  lookupEntry,
  collections,
  CollectionContent,
  contentToContentCardProps,
} from '../../../lib/content';

const StyledCards = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

const StyledSpace = styled('div')({
  marginBottom: '36px',
});

const StyledSection = styled(Typography)({
  fontWeight: 'bold',
  marginTop: '64px',
  marginBottom: '12px',
  marginLeft: 'auto',
  marginRight: 'auto',
});

interface CollectionPageProps {
  code: ContentCardProps[];
  collectionData: CollectionContent;
  datasets: ContentCardProps[];
}

export default function CollectionPage({
  code,
  collectionData,
  datasets,
}: CollectionPageProps) {
  return (
    <Layout>
      <StyledTitle variant="h3" color="primary">
        {collectionData.name}
      </StyledTitle>
      {collectionData.url && (
        <FocusButton
          newTab
          url={collectionData.url}
          text="Go to collection website"
          icon={<WebsiteIcon />}
        />
      )}
      <StyledSpace />
      <StyledMarkdown
        variant="body1"
        // @ts-ignore: "component" does not exist
        component="div"
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: collectionData.content}}
      />
      {collectionData.code && (
        <>
          <StyledSection variant="h5" color="primary">
            Codebases
          </StyledSection>
          <StyledCards>
            {code.map((c, i) => (
              <ContentCard key={i} {...c} />
            ))}
          </StyledCards>
        </>
      )}
      {collectionData.datasets && (
        <>
          <StyledSection variant="h5" color="primary">
            Datasets
          </StyledSection>
          <StyledCards>
            {datasets.map((d, i) => (
              <ContentCard key={i} {...d} />
            ))}
          </StyledCards>
        </>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Object.values(collections).map((p) => ({
      params: {
        collection: p.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (ctx) => {
  const c = lookupEntry(
    ctx.params!.collection as string,
    'collection'
  ) as CollectionContent;
  const code = c._code.map((c) => contentToContentCardProps(c));
  const datasets = c._datasets.map((d) => contentToContentCardProps(d));
  c._code = [];
  c._datasets = [];
  return {
    props: {
      code: code,
      collectionData: c,
      datasets: datasets,
    },
  };
};
