import React from 'react';
// import BiddingForm from '../src/components/BiddingForm';
import ImgDisplay from '../components/ImgDisplay/ImgDisplay';
import apirateslifeforme from '../../public/apirateslifeforme.png';
import dotsoncardstock from '../../public/dotsoncardstock.png';
import heart from '../../public/heart.png';
import seaturtle from '../../public/seaturtle.png';
import starrynightmixedmedia from '../../public/starrynightmixedmedia.png';
import undertherainbow from '../../public/undertherainbow.png';
import underwaterseascape from '../../public/underwaterseascape.png';

interface Art {
  title: string;
  file: string;
}

const artWork: Art[] = [
  { title: 'A Pirates Life for Me', file: apirateslifeforme },
  { title: 'Dots on Cardstock', file: dotsoncardstock },
  { title: 'Heart', file: heart },
  { title: 'Sea Turtle', file: seaturtle },
  { title: 'Starry Night Mixed Media', file: starrynightmixedmedia },
  { title: 'Under the Rainbow', file: undertherainbow },
  { title: 'Underwater Seascape', file: underwaterseascape },
];

const ImgBidding = () => {
  return (
    <div>
      {artWork.map((el, i) => (
        <ImgDisplay imgsrc={el.file} title={el.title} key={i} id={i} />
      ))}
    </div>
  );
};

export default ImgBidding;
