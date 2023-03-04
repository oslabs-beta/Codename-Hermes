import { KafkaClient, Producer, Consumer, ProducerStream, ConsumerGroupStream, ConsumerGroup,KafkaClientOptions,ProducerStreamOptions, ConsumerGroupStreamOptions   } from 'kafka-node';
const Transform = require('stream').Transform;
const _ = require('lodash');
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


const kafkaClient2: KafkaClientOptions = {
  kafkaHost: process.env.KAFKA_HOST,
};

const options: ProducerStreamOptions = {
  kafkaClient: kafkaClient2,
};

const consumerOptions: ConsumerGroupStreamOptions = {
  kafkaHost: process.env.KAFKA_HOST,
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  // asyncPush: false,
  id: 'consumer1',
  fromOffset: 'latest'
}

// const producer = new Producer(client);

const producer = new ProducerStream(options);

// const consumer = new Consumer(
//   client,
//   [
//     {
//       topic: 'bidding',
//       offset: 2,
//     },
//   ],
//   { autoCommit: true }
// );


const topicObj = [
    'bidding'
    ]

/**
 * creation of consumer with ConsumerGroupStream
 */
const consumerGroup = new ConsumerGroupStream(consumerOptions, topicObj);

/**
 * creation of ConsumerGroup
 */
const consumer = new ConsumerGroup(consumerOptions, topicObj);

console.log('hello from bidding');
console.log(`kafkaHost ${process.env.KAFKA_HOST}`)
console.log(`kafkaClient ${kafkaClient2.kafkaHost}`)



const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (text:any, __:never, callback:any) {
    console.log(`Received message ${text.value} transforming input`);
    callback(null, {
      topic: 'gateway',
      messages: text.value
    });
  }
});

consumerGroup.pipe(messageTransform).pipe(producer);


//producer.on('ready', () => console.log('Bidding service ready.'));

// consumer.on('message', (message) => {
//   const { msg, code } = JSON.parse(message.value as string) as {
//     msg: string;
//     code: string;
//   };

//   const newMsg = { response: `Hello, ${msg}!`, code };

//   producer.sendPayload(
//     [
//       {
//         topic: 'gateway',
//         messages: JSON.stringify(newMsg),
//       },
//     ],
//     () => console.log(`Sent ${newMsg.response} to the gateway.`)
//   );
// });
