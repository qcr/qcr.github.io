import Link from 'next/link';

import {Typography} from '@mui/material';

import FocusButton from '../../components/focus_button';
import Layout from '../../components/layout';
import styles from '../../styles/code.module.scss';
import GitHubIcon from '!@svgr/webpack!/assets/icon_github.svg';

import {code, lookupEntry} from '/lib/content';

export default function CodePage({codeData}) {
  if (typeof codeData === 'string') codeData = JSON.parse(codeData);
  return (
    <Layout>
      <Typography
        variant="h3"
        color="primary"
        sx={{maxWidth: '45rem', marginLeft: 'auto', marginRight: 'auto'}}
      >
        {codeData.name}
      </Typography>

      <FocusButton
        newTab
        url={codeData.url}
        text="View the code on GitHub"
        icon={<GitHubIcon />}
      />
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{fontStyle: 'italic', marginBottom: '36px'}}
      >
        {codeData.url.replace(/.*\/([^\/]*\/[^\/]*)$/, '$1')}
      </Typography>
      {codeData.content ? (
        <Typography
          use="body1"
          className="markdown-body"
          sx={{marginLeft: 'auto', marginRight: 'auto'}}
          component="div"
          dangerouslySetInnerHTML={{__html: codeData.content}}
        />
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
    paths: Object.values(code).map((c) => ({
      params: {
        code: c.id,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  return {
    props: {
      codeData: JSON.stringify(lookupEntry(ctx.params.code, 'code')),
    },
  };
}
