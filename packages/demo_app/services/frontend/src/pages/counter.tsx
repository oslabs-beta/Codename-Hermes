import React, { useEffect, useState } from 'react';

type Count = {
  count: number;
};

export default function Main() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!count)
      fetch('/api/count')
        .then((d) => d.json())
        .then((d: Count) => setCount(d.count));
  });

  const increment = () => {
    fetch('/api/count', {
      method: 'POST',
    })
      .then((d) => d.json())
      .then((d: Count) => setCount(d.count));
  };

  return (
    <div className='Main'>
      <h1>Kafka counter test</h1>
      <p>
        Your current count is:{' '}
        <span color='red'>{count ?? 'Waiting for count.'}</span>
      </p>
      <button onClick={increment}>Increment Counter</button>
    </div>
  );
}
