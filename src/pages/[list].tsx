import {GetStaticProps, GetStaticPaths} from 'next';
import React from 'react';
import {Typography, styled} from '@mui/material';

import {ContentCard, ContentCardProps, Layout, StyledTitle} from 'sites-shared';

import {
  code,
  datasets,
  collections,
  ContentType,
  contentToContentCardProps,
} from '../../lib/content';

interface ListPageProps {
  listData: ContentCardProps[];
  title: string;
}

const StyledCards = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

function ListPage({listData, title}: ListPageProps) {
  if (typeof listData === 'string') listData = JSON.parse(listData);
  return (
    <Layout list>
      <StyledTitle variant="h3" color="primary">
        {title}
      </StyledTitle>
      <StyledCards>
        {Object.values(listData).map((d, i) => (
          <ContentCard key={i} {...d} />
        ))}
      </StyledCards>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {params: {list: 'code'}},
      {params: {list: 'dataset'}},
      {params: {list: 'collection'}},
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const listMap = {
    code: code,
    dataset: datasets,
    collection: collections,
  };
  const titleMap = {
    code: 'Codebases on GitHub',
    dataset: 'Downloadable datasets',
    collection: 'Open source collections',
  };
  const listName = ctx.params!.list as ContentType;
  return {
    props: {
      listData: Object.values(listMap[listName])
        .map((c) => contentToContentCardProps(c))
        .sort((a, b) => a.primaryText.localeCompare(b.primaryText)),
      title: titleMap[listName],
    },
  };
};

export default ListPage;
