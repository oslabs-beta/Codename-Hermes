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
  currentBid: number

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

  const bids: {bid: Bid} = JSON.parse(message.value as string);

  console.log(`Received ${method ?? 'no method'} with code ${code}`);

  const galleryID2Change = 'cool';
  //iterate through bids
  for(const [key, bid] of Object.entries(bids)){
      //find the gallery item to update
      if(bid.galleryID === galleryID2Change){
        console.log('hello');
      } 
  }

  //Handle Bid incrementing
  if(method === 'POST'){

    // newBid = currentBid + postBid;
  }

  //original POST method
  if (method === 'POST') count += 1;

  producer.send(
    [
      {
        topic: 'gateway',
        messages: JSON.stringify({ bids }),
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
