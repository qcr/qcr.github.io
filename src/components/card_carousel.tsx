import React from 'react';
import Carousel from 'react-multi-carousel';

import Card from './card';

import styles from '../styles/card_carousel.module.scss';

import {Content} from '../../lib/content';

interface CardCarouselProps {
  cardsData: Content[];
}

export default function CardCarousel({cardsData}: CardCarouselProps) {
  return (
    <Carousel
      className={styles.carousel}
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
        <div key={i} className={styles.item}>
          <Card cardData={c} />
        </div>
      ))}
    </Carousel>
  );
}
