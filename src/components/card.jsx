import {
  Card,
  CardActionIcon,
  CardActionIcons,
  CardActions,
  CardPrimaryAction,
} from '@rmwc/card';
import {Elevation} from '@rmwc/elevation';
import {Typography} from '@rmwc/typography';

import styles from '../styles/card.module.scss';

export default function EntryCard({cardData}) {
  const isDataset = cardData.type === 'dataset';
  return (
    <Elevation z={4} wrap>
      <Card className={styles.card}>
        <CardPrimaryAction className={styles.primary}>
          <div className={styles.heading}>
            <Typography use="button" className={styles.type}>
              {isDataset ? 'Dataset' : 'Code'}
            </Typography>
            <Typography
              use="body2"
              className={`${styles.extra} ${
                styles[isDataset ? 'size' : 'url']
              }`}
            >
              {isDataset
                ? cardData.size
                  ? cardData.size
                  : '(size unspecified)'
                : cardData['repo-url'].replace(/.*\/([^\/]*\/[^\/]*)$/, '$1')}
            </Typography>
          </div>
          <Typography use="body1" className={styles.name}>
            {cardData.name}
          </Typography>
        </CardPrimaryAction>
      </Card>
    </Elevation>
  );
}
