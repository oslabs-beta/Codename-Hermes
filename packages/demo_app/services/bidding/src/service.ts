// import { KafkaClient, Producer, Consumer } from 'kafka-node';
import env from 'dotenv';
env.config();

import CH from 'library';

const kafka = new CH.kafka(
  {
    gateway: null,
    bidding: null,
  },
  'localhost:9092',
  (err) => console.log(err ?? 'Bidding listening')
);

kafka.listener(['bidding'], { autoCommit: true });

let count = 0;

type KafkaData = {
  code: string;
  method: string;
};

kafka.onMessage('bidding', (message, err) => {
  if (err) return;
  console.log('---- New message ----');
  const { code, method } = JSON.parse(message!.value as string) as KafkaData;

  console.log(`Received ${method ?? 'no method'} with code ${code}`);

  if (method === 'POST') count += 1;

  kafka.send('gateway', JSON.stringify({ code, count }));
});
