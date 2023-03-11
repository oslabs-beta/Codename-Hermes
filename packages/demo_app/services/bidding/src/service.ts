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

    //Mathew's original work
  // console.log(`Received ${method ?? 'no method'} with code ${code}`);

  const bidData: {id: number, currBid: number, newBid: number} = JSON.parse(message.value as string);

  let newBidValue = 0;

  //check to see if the new bid value is greater than the curr bid. If so, then make new bid value equal to the new bid
  if(bidData.newBid > bidData.currBid){

    newBidValue = bidData.newBid;

  }else{

    newBidValue = bidData.currBid;
  }

  
  producer.send(
    [
      {
        topic: 'gateway',
        messages: newBidValue,
      },
    ],
    () => console.log(`Sent ${newBidValue} to the gateway.`)
  );


  //Mathew's original work
  // if (method === 'POST') count += 1;




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
