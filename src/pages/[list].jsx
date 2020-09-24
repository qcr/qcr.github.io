import {Typography} from '@rmwc/typography';

import Card from '../components/card';
import Layout from '../components/layout';

import {datasets, projects, repos} from '/lib/data';

import styles from '../styles/list.module.scss';

export default function ListPage({listData}) {
  return (
    <Layout home>
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
    code: repos,
    datasets: datasets,
    projects: projects,
  };
  return {
    props: {
      listData: listMap[ctx.params.list],
    },
  };
}
