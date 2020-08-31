import Layout from '../components/layout';

import styles from '../styles/index.module.scss';

import {datasets, projects, repos} from '/lib/data';

export default function HomePage({projects}) {
  return (
    <Layout home>
      <span className={styles.main}>
        Something big & exciting that summarises who we are (a widescreen image
        of all our
        <br />
        robots lined up could be cool), and maybe a blurb or something...
      </span>
      {Object.values(projects).map((p, i) => (
        <p>{p.name}</p>
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
