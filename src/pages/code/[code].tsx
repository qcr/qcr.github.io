import {GetStaticPaths, GetStaticProps} from 'next';
import React from 'react';

import {Typography, styled} from '@mui/material';

import {
  QcrFocusButton,
  QcrMissingContentBox,
  QcrMarkdown,
  QcrTitle,
} from 'qcr-sites-shared';

import Layout from '../../components/layout';

import GitHubIcon from '!@svgr/webpack!/public/icon_github.svg';

import {code, lookupEntry, CodeContent} from '../../../lib/content';

interface CodePageProps {
  codeData: CodeContent;
}

const StyledSubtitle = styled(Typography)({
  fontSize: 'italic',
  marginBottom: '36px',
});

export default function CodePage({codeData}: CodePageProps) {
  return (
    <Layout>
      <QcrTitle variant="h3" color="primary">
        {codeData.name}
      </QcrTitle>

      <QcrFocusButton
        newTab
        url={codeData.url}
        text="View the code on GitHub"
        icon={<GitHubIcon />}
      />
      <StyledSubtitle variant="subtitle1" color="primary">
        {codeData.url.replace(/.*\/([^/]*\/[^/]*)$/, '$1')}
      </StyledSubtitle>
      {codeData.content ? (
        <QcrMarkdown
          variant="body1"
          // @ts-ignore: "component" does not exist
          component="div"
          className="markdown-body"
          dangerouslySetInnerHTML={{__html: codeData.content}}
        />
      ) : (
        <QcrMissingContentBox variant="body1">
          Content rendered from README.md of the repository, or a custom
          override specified by the &apos;details&apos; field of your repository
          data in &apos;/data/repositories.yaml&apos;
        </QcrMissingContentBox>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Object.values(code).map((c) => ({
      params: {
        code: c.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (ctx) => {
  return {
    props: {
      codeData: lookupEntry(ctx.params!.code as string, 'code'),
    },
  };
};
