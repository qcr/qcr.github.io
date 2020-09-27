import {TextField} from '@rmwc/textfield';
import {Typography} from '@rmwc/typography';

import Card from '../components/card';
import Layout from '../components/layout';

import {code, datasets, projects} from '/lib/content';

import styles from '../styles/list.module.scss';

export default function ListPage({listData}) {
  if (typeof listData === 'string') listData = JSON.parse(listData);
  return (
    <Layout list>
      <TextField
        outlined
        className={styles.filter}
        label="Search (UNIMPLEMENTED)"
      />
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
      {params: {list: 'datasets'}},
      {params: {list: 'projects'}},
    ],
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  const listMap = {
    code: code,
    datasets: datasets,
    projects: projects,
  };
  return {
    props: {
      listData: JSON.stringify(listMap[ctx.params.list]),
    },
  };
}