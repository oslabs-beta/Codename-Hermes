import express from 'express';
import { Consumer, KafkaClient, Producer } from 'kafka-node';

const app = express();

const kafkaClient = new KafkaClient({
  kafkaHost: process.env.KAFKA_HOST,
});

const producer = new Producer(kafkaClient);
const consumer = new Consumer(
  kafkaClient,
  [
    {
      topic: 'gateway',
    },
  ],
  { autoCommit: true }
);

try {
  app.get('/favicon.ico', (_, res) => res.status(404).send('No'));

  app.get('/:test', (req, res) => {
    const { test } = req.params;
    const secret = Math.random().toString(32).substring(3);

    // Send the message to the bidding service
    producer.send(
      [
        {
          topic: 'bidding',
          messages: JSON.stringify({
            msg: test,
            code: secret,
          }),
        },
      ],
      () => console.log(`Sent ${test} to the bidding service.`)
    );

    // When the gateway receives a response, send that to the client.
    // This is probobly really bad practice because this will accept any response even when there is no client waiting for a response.
    consumer.on('message', (message) => {
      console.log(`Received message: ${message.value}`);
      const { response, code } = JSON.parse(message.value as string) as {
        response: string;
        code: string;
      };

      if (code !== secret) {
        console.log(`Code mismatch! ${code} !== ${secret}`);
        return;
      }

      res.status(200).json({ response });
    });
  });
} catch (e) {
  console.log(e);
}

app.listen(3000, () => console.log('Listening on http://locahost:3000'));
