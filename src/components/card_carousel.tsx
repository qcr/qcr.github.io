import React from 'react';
import Carousel from 'react-multi-carousel';

import {styled} from '@mui/material';

import Card from './card';

import {Content} from '../../lib/content';

interface CardCarouselProps {
  cardsData: Content[];
}

const StyledCarousel = styled(Carousel)(({theme}) => ({
  '.react-multiple-carousel__arrow': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.75,
  },
  '.react-multi-carousel-dot button': {
    border: 'none',
    backgroundColor: 'lightgrey',
  },
  '.react-multi-carousel-dot--active button': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledItem = styled('div')({
  marginBottom: '30px',
});

export default function CardCarousel({cardsData}: CardCarouselProps) {
  return (
    <StyledCarousel
      autoPlay={true}
      showDots={true}
      responsive={{
        big: {breakpoint: {max: 100000, min: 1300}, items: 4},
        med: {breakpoint: {min: 1000, max: 1300}, items: 3},
        small: {breakpoint: {min: 650, max: 1000}, items: 2},
        mini: {breakpoint: {min: 0, max: 650}, items: 1},
      }}
    >
      {Object.values(cardsData).map((c, i) => (
        <StyledItem key={i}>
          <Card cardData={c} />
        </StyledItem>
      ))}
    </StyledCarousel>
  );
}
