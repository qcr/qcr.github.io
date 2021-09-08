import Link from 'next/link';
import {useState} from 'react';

import {Card, CardActionArea, Typography} from '@material-ui/core';

import LazyImage from '../components/lazy_image';

import styles from '../styles/card.module.scss';

const ELEVATION_DEFAULT = 4;
const ELEVATION_HIGHLIGHT = 8;

export default function EntryCard({cardData}) {
  const [elevation, setElevation] = useState(ELEVATION_DEFAULT);
  const section = cardData.type === 'repository' ? 'code' : cardData.type;
  return (
    <Card
      className={styles.card}
      elevation={elevation}
      onMouseOver={() => setElevation(ELEVATION_HIGHLIGHT)}
      onMouseOut={() => setElevation(ELEVATION_DEFAULT)}
    >
      <Link href={`/${section}/${cardData.id}`}>
        <CardActionArea className={styles.clickable}>
          <LazyImage
            images={[cardData.image, cardData._image]}
            className={styles.media}
            style={{
              objectPosition: cardData.image_position,
              objectFit: cardData.image_fit,
            }}
          />
          <div className={styles.footer}>
            <Typography
              use="body2"
              className={`${styles.extra} ${
                styles[section === 'code' ? 'url' : 'size']
              }`}
            >
              {section === 'dataset' ?
                cardData.size ?
                  cardData.size :
                  '(size unspecified)' :
                section === 'code' ?
                cardData.url.replace(/.*\/([^\/]*\/[^\/]*)$/, '$1') :
                'Collection'}
            </Typography>
            <Typography use="body1" className={styles.name}>
              {cardData.name}
            </Typography>
          </div>
        </CardActionArea>
      </Link>
    </Card>
  );
}
