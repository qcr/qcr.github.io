import {Typography} from '@rmwc/typography';

import Card from '../components/card';

import styles from '../styles/project.module.scss';

export default function Project({projectData}) {
  return (
    <section className={styles.section}>
      <Typography use="headline4" className={styles.heading}>
        {projectData.name}
      </Typography>
      <Typography use="body1">{projectData.description}</Typography>
      <div className={styles.entries}>
        {Object.values(projectData.entries).map((e, i) => (
          <Card key={i} cardData={e} />
        ))}
      </div>
    </section>
  );
}
