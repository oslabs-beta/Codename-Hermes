import React from 'react';
import { useState } from 'react';
import { text } from 'stream/consumers';

const SendGreeting = () => {
  const [comment, setComment] = useState('');

  const handleClick = async () => {
    const response = await fetch('/api/testroute', {
      method: 'POST',
      body: JSON.stringify({comment}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    console.log('this is data:' , data)
  };

  return (
    <div>
      <h1>You found the test page</h1>
      <input placeholder='enter data here' type='text' value={comment} onChange={e => setComment(e.target.value)}></input>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default SendGreeting;
