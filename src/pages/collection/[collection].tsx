import {GetStaticPaths, GetStaticProps} from 'next';
import React from 'react';

import {Typography, styled} from '@mui/material';

import Card from '../../components/card';
import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';

import {StyledMarkdown, StyledTitle} from 'src/styles/shared';

import WebsiteIcon from '!@svgr/webpack!/assets/icon_website.svg';

import {
  lookupEntry,
  collections,
  CollectionContent,
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
  marginTop: '36px',
  marginBottom: '12px',
  marginLeft: 'auto',
  marginRight: 'auto',
});

interface CollectionPageProps {
  collectionData: CollectionContent;
}

export default function CollectionPage({collectionData}: CollectionPageProps) {
  if (typeof collectionData === 'string') {
    collectionData = JSON.parse(collectionData);
  }
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
        component="div"
        dangerouslySetInnerHTML={{__html: collectionData.content}}
      />
      {collectionData.code && (
        <>
          <StyledSection variant="h5" color="primary">
            Codebases
          </StyledSection>
          <StyledCards>
            {collectionData.code.map((r, i) => (
              <Card key={i} cardData={r} />
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
            {collectionData.datasets.map((r, i) => (
              <Card key={i} cardData={r} />
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
  return {
    props: {
      collectionData: JSON.stringify(
        lookupEntry(ctx.params!.collection as string, 'collection')
      ),
    },
  };
};
