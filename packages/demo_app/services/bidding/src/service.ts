import CH from 'library';
// import { KafkaClient, Producer, Consumer } from 'kafka-node';

const kafka = new CH.kafka(
  {
    gateway: null,
    bidding: null,
  },
  'localhost:9092',
  (err) => console.log(err ?? 'Bidding listening')
);
// const client = new KafkaClient({
//   // If the host is undefined, then it will default to localhost:9092
//   kafkaHost: process.env.KAFKA_HOST,
// });

// const producer = new Producer(client);

// producer.on('ready', () => console.log('Bidding service ready.'));

kafka.listener(['bidding'], { autoCommit: true });
// const consumer = new Consumer(
//   client,
//   [
//     {
//       topic: 'bidding',
//       // offset: 2,
//     },
//   ],
//   { autoCommit: true }
// );

kafka.onMessage('bidding', (message, err) => {
  // consumer.on('message', (message) => {});

  if (err || !message) return;

  const bidData: BidData = JSON.parse(message.value as string);

  const newBidValue =
    bidData.newBid > bidData.currBid ? bidData.newBid : bidData.currBid;

  kafka.send(
    'gateway',
    JSON.stringify({ newBidValue, code: bidData.code }),
    () => console.log(`Sent ${newBidValue} to gateway.`)
  );
  //   producer.send(
  //     [
  //       {
  //         topic: 'gateway',
  //         messages: newBidValue,
  //       },
  //     ],
  //     () => console.log(`Sent ${newBidValue} to the gateway.`)
  //   );
});

type BidData = {
  id: number;
  currBid: number;
  newBid: number;
  code: string;
};
