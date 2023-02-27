import { KafkaClient, Producer, Consumer } from 'kafka-node';
import env from 'dotenv';
env.config();

// export interface KafkaClientOptions {
//   kafkaHost?: string;
//   connectTimeout?: number;
//   requestTimeout?: number;
//   autoConnect?: boolean;
//   connectRetryOptions?: RetryOptions;
//   sslOptions?: any;
//   clientId?: string;
//   idleConnection?: number;
//   reconnectOnIdle?: boolean;
//   maxAsyncRequests?: number;
//   sasl?: any;
// }

const client = new KafkaClient({
  // If the host is undefined, then it will default to localhost:9092
  kafkaHost: process.env.KAFKA_HOST,
});

const producer = new Producer(client);
const consumer = new Consumer(
  client,
  [
    {
      topic: 'bidding',
      offset: 2,
    },
  ],
  { autoCommit: true }
);

producer.on('ready', () => console.log('Bidding service ready.'));
consumer.on('message', (message) => {
  const { msg, code } = JSON.parse(message.value as string) as {
    msg: string;
    code: string;
  };

  const newMsg = { response: `Hello, ${msg}!`, code };
  producer.send(
    [
      {
        topic: 'gateway',
        messages: JSON.stringify(newMsg),
      },
    ],
    () => console.log(`Sent ${newMsg.response} to the gateway.`)
  );
});
