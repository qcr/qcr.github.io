import Link from 'next/link';
import {useState} from 'react';

import {Card, CardActionArea, Typography} from '@mui/material';

import LazyImage from '../components/lazy_image';

import styles from '../styles/card.module.scss';

const ELEVATION_DEFAULT = 2;
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
      square={true}
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
              variant="body2"
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
            <div className={styles['name-outer']}>
              <Typography variant="body1" className={styles.name}>
                {cardData.name}
              </Typography>
            </div>
          </div>
        </CardActionArea>
      </Link>
    </Card>
  );
}
