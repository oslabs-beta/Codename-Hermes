import React from 'react';
// import ImgDisplay from './ImageDisplay';
import styles from '../../styles/biddingform.module.css';

const BiddingForm = () => {
  return (
    <div className={styles.biddingform}>
      <label htmlFor='biddingform'>Place your bids</label>
      <br />
      <input
        type='text'
        placeholder='enter bid here'
        className={styles.biddingform}
        id='biddingform'></input>
      <br />
      <button>Submit</button>
    </div>
  );
};

export default BiddingForm;
