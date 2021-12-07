import Link from 'next/link';
import React, {useState} from 'react';

import {Card, CardActionArea, Typography, styled} from '@mui/material';

import LazyImage from '../components/lazy_image';

import styles from '../styles/card.module.scss';

import {Content} from 'lib/content';

const ELEVATION_DEFAULT = 2;
const ELEVATION_HIGHLIGHT = 8;

interface ContentCardProps {
  cardData: Content;
}

const CARD_HEIGHT = '265px';
const CARD_WIDTH = '300px';

const StyledCard = styled(Card)({
  borderRadius: 0,
  height: CARD_HEIGHT,
  margin: '8px',
  width: CARD_WIDTH,
});

const StyledClickable = styled(CardActionArea)({
  height: '100%',
  position: 'relative',
});

const StyledFooter = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  bottom: 0,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'column',
  height: '95px',
  opacity: 0.9,
  padding: '10px',
  position: 'absolute',
  width: '100%',
}));

const StyledImage = styled(LazyImage)({
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  width: '100%',
});

const StyledInfo = styled(Typography)({
  marginBottom: '8px',
  marginLeft: 'auto',
  minHeight: '1.5em',
  opacity: 0.7,
  textAlign: 'right',
  '&.size': {
    textTransform: 'capitalize',
  },
  '&.url': {
    textTransform: 'lowercase',
  },
});

const StyledName = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'space-around',
  p: {
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2',
    display: '-webkit-box',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export default function ContentCard({cardData}: ContentCardProps) {
  const [elevation, setElevation] = useState(ELEVATION_DEFAULT);
  const section = cardData.type === 'repository' ? 'code' : cardData.type;
  return (
    <StyledCard
      elevation={elevation}
      onMouseOver={() => setElevation(ELEVATION_HIGHLIGHT)}
      onMouseOut={() => setElevation(ELEVATION_DEFAULT)}
      square={true}
    >
      <Link href={`/${section}/${cardData.id}`} passHref>
        <StyledClickable>
          <StyledImage
            images={[cardData.image, cardData._image]}
            style={{
              objectPosition: cardData.image_position,
              objectFit: cardData.image_fit,
            }}
          />
          <StyledFooter>
            <StyledInfo
              variant="body2"
              className={`${section === 'code' ? 'url' : 'size'}`}
            >
              {section === 'dataset'
                ? cardData.size
                  ? cardData.size
                  : ''
                : section === 'code'
                ? cardData.url.replace(/.*\/([^/]*\/[^/]*)$/, '$1')
                : 'Collection'}
            </StyledInfo>
            <StyledName>
              <Typography variant="body1">{cardData.name}</Typography>
            </StyledName>
          </StyledFooter>
        </StyledClickable>
      </Link>
    </StyledCard>
  );
}
