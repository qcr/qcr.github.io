import React from 'react';
import {useMediaQuery} from 'react-responsive';
import Slider from 'react-slick';

import Card from './card';

import styles from '../styles/card_carousel.module.scss';

export default function CardCarousel({cardsData}) {
  const slides = useMediaQuery({minWidth: 1300}) ?
    3.35 :
    useMediaQuery({minWidth: 1200}) ?
    3 :
    useMediaQuery({minWidth: 800}) ?
    2 :
    1;
  const settings = {
    arrows: useMediaQuery({query: '(any-hover: hover)'}),
    dots: true,
    infinite: false,
    slidesToShow: slides,
    slidesToScroll: Math.floor(slides),
  };
  return (
    <Slider
      {...settings}
      className={styles.carousel}
      style={{width: '${slides * 330}px'}}
    >
      {Object.values(cardsData).map((c, i) => (
        <div key={i} className={styles.item}>
          <Card cardData={c} />
        </div>
      ))}
    </Slider>
  );
}
