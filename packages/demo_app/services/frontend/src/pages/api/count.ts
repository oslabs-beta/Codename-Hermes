// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { KafkaClient, Producer, Consumer } from 'kafka-node';

const kafkaClient = new KafkaClient({
  kafkaHost: process.env.KAFKA_HOST,
});

const producer = new Producer(kafkaClient, {
  // requireAcks: true,
});
const consumer = new Consumer(
  kafkaClient,
  [
    {
      topic: 'gateway',
    },
  ],
  { autoCommit: true }
);

producer.on('ready', () => console.log('Gateway produce ready ✅'));

type KafkaData = {
  count: number;
  code: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = Math.random().toString(32).substring(3);
  const message = {
    code: secret,
    method: req.method,
  };

  // Send the message to the bidding service
  producer.send(
    [
      {
        topic: 'bidding',
        messages: JSON.stringify(message),
      },
    ],
    /**
     * The data will respond with this:
     * {
     *  indexOfMessage: offsetOfMessage
     * }
     */
    (err, data: { bidding: { [index: string]: number } }) => {
      console.log(`Sent ${message.method} to the bidding service.`);
    }
  );

  // When the gateway receives a response, send that to the client.
  // This is probobly really bad practice because this will accept any response even when there is no client waiting for a response.
  consumer.on('message', (message) => {
    const { count, code } = JSON.parse(message.value as string) as KafkaData;
    if (code !== secret) {
      // console.log('Code mismatch.');
      return;
    }
    console.log(`Received message: ${message.value}`);
    res.status(200).json({ count });
  });
  // })
}
