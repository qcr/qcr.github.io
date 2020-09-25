import {Typography} from '@rmwc/typography';

import Layout from '../components/layout';

import styles from '../styles/index.module.scss';

import {projects} from '/lib/data';

export default function HomePage(props) {
  return (
    <Layout home>
      <Typography use="body1" className={`missing ${styles.main}`}>
        Something big & exciting that summarises who we are (a widescreen image
        of all our
        <br />
        robots lined up could be cool), and maybe a blurb or something...
      </Typography>
      <Typography use="headline4" className={styles.heading}>
        Newest Additions
      </Typography>
      <Typography use="body1" className={`missing ${styles.carousel}`}>
        "Carousel" of the newest N repositories / datasets / projects
      </Typography>
      <Typography use="headline4" className={styles.heading}>
        Most Popular
      </Typography>
      <Typography use="body1" className={`missing ${styles.carousel}`}>
        "Carousel" of the "most popular" N repositories / datasets / projects
        <br />
        (can determine via views on Google Analytics potentially?)
      </Typography>
      <Typography use="headline4" className={styles.heading}>
        Featured Projects
      </Typography>
      <Typography use="body1" className={`missing ${styles.carousel}`}>
        "Carousel" of our most important projects that we really want to be seen
        <br />
        (determined by... )
      </Typography>
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
