import {Typography} from '@rmwc/typography';

import Card from '../../components/card';
import Layout from '../../components/layout';

import {lookupEntry, projects} from '/lib/content';

import styles from '../../styles/project.module.scss';

export default function ProjectPage({projectData}) {
  if (typeof projectData === 'string') projectData = JSON.parse(projectData);
  return (
    <Layout>
      <Typography use="headline3" className={styles.heading}>
        {projectData.name}
      </Typography>
      <Typography use="body1" className="markdown">
        <div dangerouslySetInnerHTML={{__html: projectData.content}} />{' '}
      </Typography>
      {projectData.code && (
        <>
          <Typography use="headline4" className={styles.subheading}>
            Code Repositories
          </Typography>
          <div className={styles.cards}>
            {projectData.code.map((r, i) => (
              <Card key={i} cardData={r} />
            ))}
          </div>
        </>
      )}
      {projectData.datasets && (
        <>
          <Typography use="headline4" className={styles.subheading}>
            Datasets
          </Typography>
          <div className={styles.cards}>
            {projectData.datasets.map((r, i) => (
              <Card key={i} cardData={r} />
            ))}
          </div>
        </>
      )}
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
      projectData: JSON.stringify(lookupEntry(ctx.params.project, 'project')),
    },
  };
}
