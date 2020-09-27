import Slider from 'react-slick';

import Card from './card';

import styles from '../styles/card_carousel.module.scss';

export default function CardCarousel({cardsData}) {
  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 3.5,
    slidesToScroll: 3,
  };
  return (
    <Slider {...settings} className={styles.carousel}>
      {Object.values(cardsData).map((c, i) => (
        <div className={styles.item}>
          <Card key={i} cardData={c} />
        </div>
      ))}
    </Slider>
  );
}
