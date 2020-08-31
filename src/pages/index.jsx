import Layout from '../components/layout';

import styles from '../styles/index.module.scss';

export default function HomePage() {
  return (
    <Layout home>
      <span className={styles.main}>
        Something big & exciting that summarises who we are (a widescreen image
        of all our
        <br />
        robots lined up could be cool), and maybe a blurb or something...
      </span>
    </Layout>
  );
}
