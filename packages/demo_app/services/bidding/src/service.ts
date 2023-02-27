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

client.topicExists(['test'], (e) => {
  if (e) {
    console.log(e);
    return;
  }

  const producer = new Producer(client);
  const consumer = new Consumer(
    client,
    [
      {
        topic: 'test',
      },
    ],
    { autoCommit: false }
  );

  producer.on('ready', () => console.log(`Producer is ready to be used. ✅`));

  producer.send(
    [
      {
        topic: 'test',
        messages: ['hello', 'world'],
      },
    ],
    (err, data) => {
      if (err) {
        console.log(`Producer err: ${err}`);
        return;
      }

      console.log('Sent');
    }
  );

  consumer.on('message', (msg) => console.log(`Received: ${msg.value}`));
});
