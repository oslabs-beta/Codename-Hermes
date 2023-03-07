import React from 'react';
// import ImgDisplay from './ImageDisplay';


const  BiddingForm = () => {
  return (
    <div className='biddingform'>
      <label htmlFor='biddingform'>Place your bids</label>
      <br/>
      <input type='text' placeholder='enter bid here' className='biddingform' id='biddingform'></input>
      <br/>
      <button>Submit</button>      
    </div>
  )
}

export default BiddingForm;