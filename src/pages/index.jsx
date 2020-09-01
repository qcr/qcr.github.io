import {Typography} from '@rmwc/typography';

import Layout from '../components/layout';
import Project from '../components/project';

import styles from '../styles/index.module.scss';

import {datasets, projects, repos} from '/lib/data';

export default function HomePage({projects}) {
  return (
    <Layout home>
      <Typography use="body1" className={`missing ${styles.main}`}>
        Something big & exciting that summarises who we are (a widescreen image
        of all our
        <br />
        robots lined up could be cool), and maybe a blurb or something...
      </Typography>
      {Object.values(projects).map((p, i) => (
        <Project key={i} projectData={p} />
      ))}
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      projects: projects,
    },
  };
}
