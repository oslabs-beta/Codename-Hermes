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

/**
 * KafkaData
 *
 */
type KafkaData = {
  code: string;
  method: string;
};

kafka.onMessage('bidding', (message, err) => {
  if (err || !message) return;
  const bidData: { id: number; currBid: number; newBid: number; code: string } =
    JSON.parse(message.value as string);

  let newBidValue = 0;

  //check to see if the new bid value is greater than the curr bid. If so, then make new bid value equal to the new bid
  if (bidData.newBid > bidData.currBid) {
    newBidValue = bidData.newBid;
  } else {
    newBidValue = bidData.currBid;
  }

  kafka.send(
    'gateway',
    JSON.stringify({ newBidValue, code: bidData.code }),
    () => console.log(`Sent ${newBidValue} to gateway`)
  );
});
