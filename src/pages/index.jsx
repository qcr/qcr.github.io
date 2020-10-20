import {Typography} from '@rmwc/typography';

import CardCarousel from '../components/card_carousel';
import Layout from '../components/layout';

import styles from '../styles/index.module.scss';

import {randomContent} from '/lib/content';

export default function HomePage({mostPopular, mostRecent, featured}) {
  if (typeof featured === 'string') featured = JSON.parse(featured);
  if (typeof mostPopular === 'string') mostPopular = JSON.parse(mostPopular);
  if (typeof mostRecent === 'string') mostRecent = JSON.parse(mostRecent);
  const gif_test = require('/var/tmp/qcr-site/roboticvisionorg/benchbot/docs/benchbot_web.gif');
  return (
    <Layout home>
      <video poster={gif_test.default.cover} autoPlay>
        <source src={gif_test.default.video} type="video/webm" />
      </video>
      <Typography use="body1" className={`missing ${styles.main}`}>
        Something big & exciting that summarises who we are (a widescreen image
        of all our
        <br />
        robots lined up could be cool), and maybe a blurb or something...
      </Typography>
      {/*
      <Typography use="headline4" className={styles.heading}>
        Newest Additions
      </Typography>
      <CardCarousel cardsData={mostRecent} />
      <Typography use="headline4" className={styles.heading}>
        Most Popular
      </Typography>
      <CardCarousel cardsData={mostPopular} />
      <Typography use="headline4" className={styles.heading}>
        Featured Projects
      </Typography>
      <CardCarousel cardsData={featured} />
      */}
      <Typography use="body1" className={`missing ${styles.carousel}`}>
        Note: carousels are randomly filled at the moment (need to decide what
        <br />
        criteria / sections we want before I implement them)
      </Typography>
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      featured: JSON.stringify([...Array(10).keys()].map((a) => randomContent())),
      mostPopular: JSON.stringify(
          [...Array(10).keys()].map((a) => randomContent())
      ),
      mostRecent: JSON.stringify(
          [...Array(10).keys()].map((a) => randomContent())
      ),
    },
  };
}
