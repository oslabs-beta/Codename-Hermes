import express from 'express';
import {
  ProducerStream,
  KafkaClient,
  KafkaClientOptions,
  ProducerStreamOptions, Consumer
} from 'kafka-node';
import env from 'dotenv';
env.config();

const Transform = require('stream').Transform;
const _ = require('lodash');
const fs = require('fs');

const app = express();

const kafkaClient = new KafkaClient({
  kafkaHost: process.env.KAFKA_HOST,
});

const kafkaClient2: KafkaClientOptions = {
  kafkaHost: process.env.KAFKA_HOST,
};

const options: ProducerStreamOptions = {
  kafkaClient: kafkaClient2,
};


// const consumerOptions: ConsumerGroupStreamOptions = {
//   kafkaHost: process.env.KAFKA_HOST,
//   fromOffset: 'latest',
//   groupId: '2'
// }


// const producer = new Producer(kafkaClient);

const producer = new ProducerStream(options);

const consumer = new Consumer(
  kafkaClient,
  [
    {
      topic: 'gateway',
    },
  ],
  { autoCommit: true }
);

// const topicObjGateway = [
//   'gateway'
//   ]

// const consumer = new ConsumerGroupStream(consumerOptions, topicObjGateway);

console.log(`from inside gateway`);
console.log(`kafkaHost ${process.env.KAFKA_HOST}`)
console.log(`kafkaClient ${kafkaClient2.kafkaHost}`)

try {
  app.get('/favicon.ico', (_, res) => res.status(404).send('No'));

  app.get('/:test', (req, res) => {
    const { test } = req.params;
    // const secret = Math.random().toString(32).substring(3);

    fs.appendFileSync('src/hi_log.txt', test, 'utf8')

    
    const messageFromGateWay = fs.createReadStream('src/hi_log.txt');

    const stdinTransform = new Transform({
      objectMode: true,
      decodeStrings: true,
      transform (text:any, __:never, callback:any) {
        text = _.trim(text);
        console.log(`pushing message ${text} to Bidding Topic`);


        callback(null, {
          topic: 'bidding',
          messages: text
        });

       
      }
    });

   
    messageFromGateWay.setEncoding('utf8');

    messageFromGateWay.pipe(stdinTransform).pipe(producer);

    
    // Send the message to the bidding service
    // producer.sendPayload(
    //   [
    //     {
    //       topic: 'bidding',
    //       messages: JSON.stringify({
    //         msg: test,
    //         code: secret,
    //       }),
    //     },
    //   ],
    //   () => console.log(`Sent ${test} to the bidding service`)
    // );

    // This will really be in a seperate "server" but acts like it's here
    //   consumer.on('message', (message) => {
    // const { msg, code } = JSON.parse(message.value as string) as {
    //   msg: string;
    //   code: string;
    // };

    // const newMsg = { response: `Hello, ${msg}!`, code };
    // producer.send(
    //   [
    //     {
    //       topic: 'gateway',
    //       messages: JSON.stringify(newMsg),
    //     },
    //   ],
    //   () => console.log(`Sent ${newMsg.response} to the gateway.`)
    // );

    // When the gateway receives a response, send that to the client.
    // This is probobly really bad practice because this will accept any response even when there is no client waiting for a response.
    
    
    consumer.on('message', (message) => {
      console.log(message);
      console.log(`Received message: ${message}`);
      console.log(`message.value is: ${message}`)
      
      /**
       * Old Mathew code
       */
      
      // const { response, code } = JSON.parse(message.value as string) as {
      //   response: string;
      //   code: string;
      // };

      // if (code !== secret) {
      //   console.log(`Code mismatch! ${code} !== ${secret}`);
      //   return;
      // }
     
      
      res.status(200).json(message);
    });
  });
} catch (e) {
  console.log(e);
}

app.listen(3000, () => console.log('Listening on http://locahost:3000'));
