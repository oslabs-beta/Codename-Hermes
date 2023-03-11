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
  newBid: number | undefined,

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

  //Mathew's original work
  // const { code, method } = JSON.parse(message.value as string) as KafkaData;

  //{ {galleryID: 1, currentBid: 25, newBid: 60}, {galleryID: 2, currentBid:40, newBid: 25} }
  const bids: {bid: Bid} = JSON.parse(message.value as string);

  //Mathew's original work
  // console.log(`Received ${method ?? 'no method'} with code ${code}`);

  //iterate through bids
  for(const bid of Object.values(bids)){
      //find the gallery item to update
      if(!bid.newBid){
        break;
      }

      if(bid.newBid > bid.currentBid){
        bid.currentBid = bid.newBid;
      }
  }

  //Mathew's original work
  // if (method === 'POST') count += 1;

  producer.send(
    [
      {
        topic: 'gateway',
        messages: JSON.stringify({ bids }),
      },
    ],
    () => console.log(`Sent ${count} to the gateway.`)
  );


  //Mathew's original work
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
