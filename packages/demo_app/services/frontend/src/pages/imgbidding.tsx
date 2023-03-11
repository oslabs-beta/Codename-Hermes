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
// import heart from '../../public/heart.png'
const artWork: any[] = [
  apirateslifeforme,
  dotsoncardstock,
  heart,
  seaturtle,
  starrynightmixedmedia,
  undertherainbow,
  underwaterseascape,
];

const ImgBidding = () => {
  return (
    <div>
      {artWork.map((el, i) => {
        return <ImgDisplay imgsrc={el} key={i} id={i}></ImgDisplay>;
      })}
    </div>
  );
};

export default ImgBidding;
