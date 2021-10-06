import {Typography} from '@mui/material';

import Card from '../components/card';
import Layout from '../components/layout';

import {code, datasets, collections} from '/lib/content';

import styles from '../styles/list.module.scss';

export default function ListPage({listData, title}) {
  if (typeof listData === 'string') listData = JSON.parse(listData);
  return (
    <Layout list>
      <Typography variant="h3" color="primary">
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

export function getStaticPaths() {
  return {
    paths: [
      {params: {list: 'code'}},
      {params: {list: 'dataset'}},
      {params: {list: 'collection'}},
    ],
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  const listMap = {
    code: code,
    dataset: datasets,
    collection: collections,
  };
  const titleMap = {
    code: 'Our codebases',
    dataset: 'Our datasets',
    collection: 'Our open source collections',
  };
  return {
    props: {
      listData: JSON.stringify(
          Object.values(listMap[ctx.params.list]).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
      ),
      title: titleMap[ctx.params.list],
    },
  };
}
