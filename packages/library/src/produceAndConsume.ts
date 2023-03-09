/**
 * example
 */
import { KafkaClient, Producer, Consumer } from 'kafka-node';
import env from 'dotenv';
env.config();

const client = new KafkaClient({
  // If the host is undefined, then it will default to localhost:9092
  kafkaHost: process.env.KAFKA_HOST,
});


/**
 * input: String
 * output: value: any
 */
exports.consume = function(consumerTopic){

  //message to return
  let result;

  const consumer = new Consumer(
    client,
    [
      {
        topic: consumerTopic
        // offset: 2,
      },
    ],
    { autoCommit: true }
  );
  
  let count = 0;
  
  /**
   * KafkaData 
   * 
   */
  
  type KafkaData = {
    code: string;
    method: string;
  };

  consumer.on('message', (message) => {
      
    const { code, method } = JSON.parse(message.value as string) as KafkaData;

  
    console.log(`Received ${method ?? 'no method'} with code ${code}`);
  
    //original POST method
    if (method === 'POST') count += 1;


    //obtain the message and assign to result
    result = message;

  });

  //returned the consumed message
  return result;
}

  


exports.produceAndConsume = function (producerTopic, consumerTopic){


  
      const producer = new Producer(client, {
        // requireAcks: true,
      });
      const consumer = new Consumer(
        client,
        [
          {
            topic: consumerTopic
            // offset: 2,
          },
        ],
        { autoCommit: true }
      );
      
      let count = 0;
      
      /**
       * KafkaData 
       * 
       */
      
      type KafkaData = {
        code: string;
        method: string;
      };
      
      producer.on('ready', () => console.log('Bidding service ready.'));
      
      consumer.on('message', (message) => {
      
        const { code, method } = JSON.parse(message.value as string) as KafkaData;

      
        console.log(`Received ${method ?? 'no method'} with code ${code}`);
      
        //original POST method
        if (method === 'POST') count += 1;
      
   
        producer.send(
          [
            {
              topic: producerTopic,
              messages: JSON.stringify({ code, count }),
            },
          ],
          () => console.log(`Sent ${count} to the gateway.`)
        );
      });
}


  