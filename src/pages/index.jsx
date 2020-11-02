import {Typography} from '@rmwc/typography';

import CardCarousel from '../components/card_carousel';
import Layout from '../components/layout';

import styles from '../styles/index.module.scss';

import {
  orderByFeatured,
  orderByNewest,
  orderByPopularity,
} from '/lib/analytics';

const LIMIT_FEATURE = 10;
const LIMIT_MOST_POPULAR = 10;
const LIMIT_MOST_RECENT = 10;

export default function HomePage({mostPopular, mostRecent, featured}) {
  if (typeof featured === 'string') featured = JSON.parse(featured);
  if (typeof mostPopular === 'string') mostPopular = JSON.parse(mostPopular);
  if (typeof mostRecent === 'string') mostRecent = JSON.parse(mostRecent);
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
      <CardCarousel cardsData={mostRecent} />
      <Typography use="headline4" className={styles.heading}>
        Most Popular
      </Typography>
      <CardCarousel cardsData={mostPopular} />
      {featured.length > 0 && (
        <>
          <Typography use="headline4" className={styles.heading}>
            Featured Projects
          </Typography>
          <CardCarousel cardsData={featured} />
        </>
      )}
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      featured: orderByFeatured().slice(0, LIMIT_FEATURE),
      mostPopular: orderByPopularity().slice(0, LIMIT_MOST_POPULAR),
      mostRecent: orderByNewest().slice(0, LIMIT_MOST_RECENT),
    },
  };
}
