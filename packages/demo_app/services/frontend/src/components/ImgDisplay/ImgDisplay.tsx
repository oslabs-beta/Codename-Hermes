import React from 'react';
import Image from 'next/image';
import BiddingForm from '../BiddingForm/BiddingForm';
import styles from '../../styles/imgstyledisplay.module.css';

const ImgDisplay = () => {
  const imgArr = [
    'https://www.boredpanda.com/blog/wp-content/uploads/2022/09/relatable-funny-memes-22-63284d45ebe28__700.jpg',
    'https://thumbor.bigedition.com/dog-with-caffeine/jjfqING-CYZnbfuDFyFTE6oEEHg=/301x145:888x732/800x800/filters:quality(80)/granite-web-prod/4e/9d/4e9d7d8aac824532b6ffb2b9ffcee8c3.jpeg',
    'https://assets-global.website-files.com/5f3c19f18169b62a0d0bf387/60d33bf3a2121cc74f72a286_0AEnnZYBAYzmSXzyGaopjvEGKKO1yFqf_zMXqFTAT6vUDfXVPRifI3J8oBjZUl51PnRQqf2tqpjiRt33IKgg4sTiJi2YShGTN5iNUIoYbNj2HXobiQg4-k7yBiNT54EKOGYyZOR2.png',
  ];

  return (
    <div className={styles.imgdisplay}>
      {imgArr.map((el, i) => {
        return (
          <div key={i + 2}>
            <img
              className={styles.bidimg}
              key={i}
              src={el}
              width='200px'
              alt=''
            />
            <BiddingForm key={i + 1} />
          </div>
        );
      })}
    </div>
  );
};

export default ImgDisplay;
