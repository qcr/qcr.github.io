import {
  Card,
  CardActionIcon,
  CardActionIcons,
  CardActions,
  CardMedia,
  CardPrimaryAction,
} from '@rmwc/card';
import {Elevation} from '@rmwc/elevation';
import {Typography} from '@rmwc/typography';

import Link from 'next/link';

import styles from '../styles/card.module.scss';

export default function EntryCard({cardData}) {
  const section = cardData.type === 'repository' ? 'code' : cardData.type;
  return (
    <Elevation z={4} wrap>
      <Card className={styles.card}>
        <Link href={`/${section}/${cardData.id}`}>
          <CardPrimaryAction className={styles.clickable}>
            <CardMedia sixteenByNine className={styles['image-default']} />
            <div className={styles.footer}>
              <Typography
                use="body2"
                className={`${styles.extra} ${
                  styles[section === 'code' ? 'url' : 'size']
                }`}
              >
                {section === 'dataset'
                  ? cardData.size
                    ? cardData.size
                    : '(size unspecified)'
                  : section === 'code'
                  ? cardData.url.replace(/.*\/([^\/]*\/[^\/]*)$/, '$1')
                  : 'Project'}
              </Typography>
              <Typography use="body1" className={styles.name}>
                {cardData.name}
              </Typography>
            </div>
          </CardPrimaryAction>
        </Link>
      </Card>
    </Elevation>
  );
}
