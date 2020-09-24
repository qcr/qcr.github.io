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
          <CardPrimaryAction>
            <CardMedia sixteenByNine className={styles['image-default']} />
            <div className={styles.footer}>
              {cardData.type !== 'project' && (
                <Typography
                  use="body2"
                  className={`${styles.extra} ${
                    styles[section === 'dataset' ? 'size' : 'url']
                  }`}
                >
                  {section === 'dataset'
                    ? cardData.size
                      ? cardData.size
                      : '(size unspecified)'
                    : cardData.url.replace(/.*\/([^\/]*\/[^\/]*)$/, '$1')}
                </Typography>
              )}
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
