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
      {params: {list: 'project'}},
    ],
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  const listMap = {
    code: code,
    dataset: datasets,
    project: projects,
  };
  return {
    props: {
      listData: JSON.stringify(
          Object.values(listMap[ctx.params.list]).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
      ),
    },
  };
}
