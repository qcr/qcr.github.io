import {Typography} from '@rmwc/typography';

import Card from '../../components/card';
import Layout from '../../components/layout';

import {lookupEntry, projects} from '/lib/data';

import styles from '../../styles/project.module.scss';

export default function ProjectPage({projectData}) {
  const datasets = projectData.entries.filter(e => e.type === 'dataset');
  const repos = projectData.entries.filter(e => e.type === 'repository');
  return (
    <Layout>
      <Typography use="headline3" className={styles.heading}>
        {projectData.name}
      </Typography>
      <p>{projectData.description}</p>
      <Typography use="headline4" className={styles.subheading}>
        Repositories
      </Typography>
      <div className={styles.cards}>
        {repos.map((r, i) => (
          <Card key={i} cardData={r} />
        ))}
      </div>
      <Typography use="headline4" className={styles.subheading}>
        Datasets
      </Typography>
      <div classname={styles.cards}>
        {datasets.map((r, i) => (
          <Card key={i} cardData={r} />
        ))}
      </div>
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: Object.values(projects).map(p => ({
      params: {
        project: p.id,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  return {
    props: {
      projectData: projects[ctx.params.project],
    },
  };
}
