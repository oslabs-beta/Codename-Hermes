import { Kafka } from 'library';

const kafka = new Kafka(
  {
    host: 'localhost',
    port: 9092,
  },
  {
    gateway: null,
    bidding: null,
  },
  (err) => console.log(err ?? 'Bidding listening')
);

type BidData = {
  id: number;
  currBid: number;
  newBid: number;
  code: string;
};

kafka.consume('bidding', { autoCommit: true }, (err, message) => {
  // consumer.on('message', (message) => {});

  if (err || !message) return;

  const bidData: BidData = JSON.parse(message.message as string);

  const newBidValue =
    bidData.newBid > bidData.currBid ? bidData.newBid : bidData.currBid;

  kafka.send(
    'gateway',
    JSON.stringify({ newBidValue, code: bidData.code }),
    () => console.log(`Sent ${newBidValue} to gateway.`)
  );
});
