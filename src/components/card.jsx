import {Card, CardPrimaryAction} from '@rmwc/card';
import {Elevation} from '@rmwc/elevation';
import {Typography} from '@rmwc/typography';

import styles from '../styles/card.module.scss';

export default function EntryCard({cardData}) {
  return (
    <Elevation z={6} wrap>
      <Card className={styles.card}>
        <CardPrimaryAction className={styles.primary}>
          <div className={styles.heading}>
            <Typography use="button" className={styles.type}>
              {cardData.type === 'dataset' ? 'Dataset' : 'Code'}
            </Typography>
            <Typography
              use="button"
              className={`${styles.extra} ${
                styles[cardData.type == 'dataset' ? 'size' : 'url']
              }`}
            >
              {cardData.type === 'dataset'
                ? cardData.size
                  ? cardData.size
                  : '(size unspecified)'
                : cardData['repo-url']}
            </Typography>
          </div>
          <Typography use="body1">{cardData.name}</Typography>
        </CardPrimaryAction>
      </Card>
    </Elevation>
  );
}
