import {GetStaticProps, GetStaticPaths} from 'next';
import React from 'react';
import {Typography} from '@mui/material';

import Card from '../components/card';
import Layout from '../components/layout';

import {
  code,
  datasets,
  collections,
  Content,
  ContentType,
} from '../../lib/content';

import styles from '../styles/list.module.scss';

interface ListPageProps {
  listData: Content[];
  title: string;
}

function ListPage({listData, title}: ListPageProps) {
  if (typeof listData === 'string') listData = JSON.parse(listData);
  return (
    <Layout list>
      <Typography variant="h3" color="primary" sx={{marginTop: '48px'}}>
        {title}
      </Typography>
      <div className={styles.cards}>
        {Object.values(listData).map((d, i) => (
          <Card key={i} cardData={d} />
        ))}
      </div>
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
      listData: JSON.stringify(
        Object.values(listMap[listName]).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      ),
      title: titleMap[listName],
    },
  };
};

export default ListPage;
