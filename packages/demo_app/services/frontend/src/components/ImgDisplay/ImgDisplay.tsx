import React, { FC, useState } from 'react';
import Image from 'next/image';
import styles from './imgstyledisplay.module.scss';

const ImgDisplay: FC<{ imgsrc: string; id: number; title: string }> = ({
  imgsrc,
  id,
  title,
}) => {
  const [currBid, setCurrBid] = useState(0);
  const [newBid, setNewBid] = useState(0);

  const handleClick = async () => {
    const response = await fetch('/api/bidRoute', {
      method: 'POST',
      body: JSON.stringify({ currBid, id, newBid }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data, 'frontend received');
    setCurrBid(data);
  };

  return (
    <div className={styles.imgdisplay}>
      <div>
        <Image
          src={imgsrc}
          // width='200px'
          alt=''
        />
        <br />
        <h2>{title ?? 'Unnamed Work.'}</h2>
        <p>Current Bid: ${currBid}</p>

        <input
          type='number'
          placeholder='enter bid'
          value={newBid}
          onChange={(e) => setNewBid(Number(e.target.value))}></input>
        <br />
        <button onClick={handleClick}>Submit bid</button>
      </div>
    </div>
  );
};

export default ImgDisplay;
