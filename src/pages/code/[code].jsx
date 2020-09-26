import {Button} from '@rmwc/button';
import {Typography} from '@rmwc/typography';

import Link from 'next/link';

import Layout from '../../components/layout';
import styles from '../../styles/code.module.scss';
import icon from '/assets/icon_github.svg';

import {lookupEntry, repos} from '/lib/data';

export default function CodePage({codeData}) {
  return (
    <Layout>
      <Typography use="headline3" className={styles.heading}>
        {codeData.name}
      </Typography>

      <Link href={codeData.url}>
        <a target="_blank" className={styles['button-link']}>
          <Button raised trailingIcon={icon} className={styles.button}>
            View the code on GitHub
          </Button>
        </a>
      </Link>
      <Typography use="body2" className={styles.extra}>
        {codeData.url.replace(/.*\/([^\/]*\/[^\/]*)$/, '$1')}
      </Typography>
      {codeData.details ? (
        <Typography use="body1" className="markdown">
          <div dangerouslySetInnerHTML={{__html: codeData.details}} />{' '}
        </Typography>
      ) : (
        <Typography use="body1" className={`missing ${styles.content}`}>
          Content rendered from README.md of the repository, or a custom
          override specified by the 'details' field of your repository data in
          '/data/repositories.yaml'
        </Typography>
      )}
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: Object.values(repos).map(r => ({
      params: {
        code: r.id,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  return {
    props: {
      codeData: lookupEntry(ctx.params.code),
    },
  };
}
