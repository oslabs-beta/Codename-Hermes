// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import CodenameHermes from 'library';
import { KafkaClient, Producer, Consumer } from 'kafka-node';

const kafka = new CodenameHermes.kafka(
  {
    gateway: null,
    bidding: null,
  },
  'localhost:9092',
  (err) => console.log(err ?? 'Gateway ready.')
);

kafka.listener(['gateway'], { autoCommit: true });

type KafkaData = {
  newBidValue: number;
  code: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = Math.random().toString(32).substring(3);
  const { currBid, id, newBid } = req.body;
  const message = {
    id,
    currBid,
    newBid,
    code: secret,
  };

  // Send the message to the bidding service
  kafka.send('bidding', JSON.stringify(message), () =>
    console.log(`\n\nSent ${newBid} to the bidding service.\n\n`)
  );

  // When the gateway receives a response, send that to the client.
  // This is probobly really bad practice because this will accept any response even when there is no client waiting for a response.
  kafka.onMessage('gateway', (message, err) => {
    if (err || !message) return;
    const { newBidValue, code } = JSON.parse(
      message!.value as string
    ) as KafkaData;
    if (code !== secret) {
      return;
    }
    console.log(`Received message: ${message!.value}`);
    res.status(200).json(newBidValue);
  });
}
