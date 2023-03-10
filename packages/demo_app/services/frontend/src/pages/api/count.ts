// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import CodenameHermes from 'CodenameHermes';
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
  kafka.send('bidding', JSON.stringify(message));

  // When the gateway receives a response, send that to the client.
  // This is probobly really bad practice because this will accept any response even when there is no client waiting for a response.
  kafka.onMessage('gateway', (message) => {
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
