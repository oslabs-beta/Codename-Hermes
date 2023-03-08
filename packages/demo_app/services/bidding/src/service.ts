import { KafkaClient, Producer, Consumer } from 'kafka-node';
import env from 'dotenv';
env.config();

const client = new KafkaClient({
  // If the host is undefined, then it will default to localhost:9092
  kafkaHost: process.env.KAFKA_HOST,
});

const producer = new Producer(client, {
  // requireAcks: true,
});
const consumer = new Consumer(
  client,
  [
    {
      topic: 'bidding',
      // offset: 2,
    },
  ],
  { autoCommit: true }
);

let count = 0;

/**
 * Bid interface
 * 
 */

interface Bid {
  galleryID: string,
  currentBid: number,
  postBid: number,

}

/**
 * KafkaData 
 * 
 */

type KafkaData = {
  code: string;
  method: string;
};

producer.on('ready', () => console.log('Bidding service ready.'));

consumer.on('message', (message) => {

  const { code, method } = JSON.parse(message.value as string) as KafkaData;

  const {galleryID, currentBid, postBid } = JSON.parse(message.value as string) as Bid;

  console.log(`Received ${method ?? 'no method'} with code ${code}`);

  let newBid;
  //Handle Bid incrementing
  if(method === 'POST'){

    newBid = currentBid + postBid;
  }

  //original POST method
  if (method === 'POST') count += 1;

  producer.send(
    [
      {
        topic: 'gateway',
        messages: JSON.stringify({ galleryID, newBid  }),
      },
    ],
    () => console.log(`Sent ${count} to the gateway.`)
  );


  /**
   * Original send producer method
   */

  // producer.send(
  //   [
  //     {
  //       topic: 'gateway',
  //       messages: JSON.stringify({ code, count }),
  //     },
  //   ],
  //   () => console.log(`Sent ${count} to the gateway.`)
  // );



});
