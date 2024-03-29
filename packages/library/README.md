<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">

<!-- Logo -->
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./media/CH-Logo-White.png">
    <source media="(prefers-color-scheme: light)" srcset="./media/CH-Logo-Black.png">
    <img alt="Codename Hermes Logo" src="./media/CH-Logo-Black.png" width="300px">
  </picture>

<!-- Brief summary -->

# **Codename Hermes**

### A library to abstract away and standardize the initial setup and implementation of connecting with message brokers.

<br>

  <!-- Directory -->
  <div align="left">
  
  ## Directory

  <!-- TODO: Add "how to install" -->

- [Standards](#standards)

  - [Broker Initilization](#standards-init)
  - [Producing](#standards-produce)
  - [Consuming](#standards-consume)

  <br>

- [Kafka](#kafka)

  - [Kafka Initilization](#kafka-init)
  - [Produce](#kafka-produce)
  - [Consume](#kafka-consume)

  <br>

- [Rabbit](#rabbit)
  - [Rabbit Initilization](#rabbit-init)
  - [Produce](#rabbit-produce)
  - [Consume](#rabbit-consume)

<br>

- [Special Thanks](#special-thanks)
- [Contribute](#contribute)
- [Contributers](#contributers)
    </div>
  </div>

<br>
<hr>
<br>

<!-- Standards section -->
<section id="standards">

## **Standards**

  <!-- Description for Kafka implementation -->

_Currently, these standards are in alpha and are subject to change as a result._

Our primary goal is to uniformize the implementation details of message brokers in Node.JS with the ultimate goal of expanding into other runtimes/languages in the future.

  <br>
  <hr align="center" width="50%">
  <br>
  <!-- Docs -->
  <section id="standards-init">

### **Initilization**

Initilization of message brokers will follow the basic format shown below.

```TypeScript
Broker(clientOptions: GenericClientOptions, topics: GenericTopic<any>);
```

Currently, each broker will have it's own specific `clientOptions`, but will always contain `host` and `port` keys.

```TypeScript
{
  host: string;
  port?: number;
}
```

Additionally, each broker will have specific options for their topics. Though, they will always be in the format found below.

```TypeScript
{
  [topicName: string]: brokerSpecificOptions;
}
```

  </section>

  <br>
  <hr align="center" width="50%">
  <br>

  <section id="standards-produce">

### **Producing Events**

Producing will be fairly straight forward for each message broker and will always follow the basic format shown below.

```TypeScript
send(topicName: string, message: string)
```

We haven't implemented support for messaging multiple topics at once as of yet.

  </section>

  <br>
  <hr align="center" width="50%">
  <br>

  <section id="standards-consume">

### **Consuming Events**

Consuming will be more in-depth than producing, though just as simple.

The first things first, we need to setup a listener for each topic we want to consume. This can be achieved through the basic syntax below.

```TypeScript
listen(topics: string[], options: GenericListenerOptions)
```

GenericListenerOptions will always look like:

```TypeScript
{
  autoCommit?: boolean;
}
```

  <br>

Creating a listener will then allow us to consume messages on that topic. This can be done via the basic syntax below.

```TypeScript
consume(topicName: string, callback: MessageCallback)
```

A MessageCallback will always be based off the example below, although it may change from broker to broker.

```TypeScript
(data: GenericMessage<any>, error?: any) => void
```

Data will always look like:

```TypeScript
{
  topic: string;
  message: string;
}
```

<br>

A more complete example is as follows:

```TypeScript
const topics = {
  topic1: {},
  topic2: {},
}

const broker = await Broker({ host: 'localhost' }, topics);

broker.listen(['topic2'], { autoCommit: true });

broker.consume('topic2', (data, error) => console.log(data.message));

broker.send('topic1', 'Hello World!');

```

  </section>

</section>

<br>
<hr>
<br>

<!-- Kafka section -->
<section id="kafka">

## **Kafka**

  <!-- Description for Kafka implementation -->

Following the same [standards](#standards) as we've gone over previously; Our Kafka implementation will _hopefully_ seem fairly familiar.

  <br>
  <hr align="center" width="50%">
  <br>

  <!-- Docs -->

  <section id="kafka-init">

## **Initilization**

Much like you've seen, initializing Kafka will be the exact same as defined in the standards with the only differance being, we're assigning the returned value of the Kafka factory function to a variable.

```TypeScript
const kafka = Kafka(clientOptions, topics);
const kafka = Kafka(clientOptions, topics, callback);
const kafka = Kafka(clientOptions, topics, producerOptions);
const kafka = Kafka(clientOptions, topics, producerOptions, callback);
```

For now, another discrepancy would be Kafka specific `clientOptions` and `topics`.

Speaking of, we have some new options!

  <br>

### **`clientOptions`**

```TypeScript
{
  host: string;
  port?: number;
  connectTimeout?: number;
  requestTimeout?: number;
  autoConnect?: boolean;
  connectRetryOptions?: RetryOptions;
  idleConnection?: number;
  reconnectOnIdle?: boolean;
  maxAsyncRequests?: number;
}
```

But what do they do? Let's get into that.

  <br>

**`host`** -
_Default: localhost_

The Kafka message broker hostname or IP address.

  <br>

**`port`** -
_Default: 9092_

The port your Kafka message broker is on.

  <br>

**`connectTimeout`** -
_Default: 10,000ms_

How long, in ms, it takes to wait for a successful connection.

  <br>

**`requestTimeout`** -
_Default: 30,000ms_

How long, in ms, for a kafka request to timeout.

  <br>

**`autoConnect`** -
_Default: true_

Should it automatically connect when Kafka is instantiated?

  <br>

**`connectRetryOptions`** -

An object hash that applies to the initial connection to customize connection retries.

```TypeScript
{
  retries?: number; /* (The maximum amount of times to retry the operation.) */
  factor?: number; /* (The exponential factor to use.) */
  minTimeout?: number; /* (The number of milliseconds before starting the first retry. Default is 1000.) */
  maxTimeout?: number; /* (The maximum number of milliseconds between two retries. Default is Infinity.) */
  randomize?: boolean; /* (Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.) */
}
```

_For more information about `connectRetryOptions`, please visit [here](https://www.npmjs.com/package/retry#user-content-retrytimeoutsoptions)._

  <br>

**`ildeConnection`** -
_Default: 5 minutes_

Allows the broker to disconnect an idle connection from a client.

The value is elapsed time in ms without any data written to the TCP socket.

  <br>

**`reconnectOnIdle`** -
_Default: true_

When the connection is closed due to client idling, will the client attempt to auto-reconnect?

  <br>
  
  **`maxAsyncRequests`** -
  _Default: 10_

The maximum async operations at a time toward the kafka cluster.

  <br>
  <hr align="center" width="50%">
  <br>

### **`topics`**

Now that we've covered our Kafka specific `clientOptions`, let's get into our topic structure.

As previously mentioned, we follow this format:

```TypeScript
{
  [topicName: string]: KafkaTopic;
}
```

What does that entail?

Simply put, we're defining our topics as an object. This way we can have access to all of the information in our topics later on.

An example of how a topic will look in your code is as follows:

```TypeScript
const topics = {
  topic1: null,

  topic2: {
    partition: 2,
  },

  topic3: {
    offset: 2,
  },

  topic4: {
    partition: 2,
    offset: 2,
  },
}
```

Now, why do we have null? It's because we're using null to say "use the default options for this topic".

The default options for a topic is:

```TypeScript
{
  partition: 0,
  offset: 0,
}
```

Alright, so you might be asking yourself: "What does the `partition` and `offset` do?"

`partition` is just telling the Kafka broker "hey, this topic has X amount of sub-sections" and `offset` is saying "hey, start each partition at the offset X."

  <br>
  <hr align="center" width="50%">
  <br>

## **`producerOptions`**

Producer options are a way for you to customize how you want to produce, or "send," messages to topics.

```TypeScript
{
  requireAcks?: number;
  ackTimeoutMs?: number;
  partitionerType?: number;
}
```

As usual, let's break down what everything does.

**`requireAcks`** -
_Default: 1_

The amount of acknowledgments the leader has to have received before considering a request complete.

  <br>

**`ackTimeoutMs`** -
_Default: 100ms_

How long, in ms, to wait before considering acknowledgments.

  <br>

**`partitionerType`** -
_Default: 2_

The algorithm that determines which partition to send messages to.

default = 0

random = 1

cyclic = 2

keyed = 3

  <!-- custom = 4 -->

_Custom partitioners are currently in progess._

  <br>

_For more information regarding these `producerOptions`, please refer to [this](https://kafka.apache.org/documentation/#producerconfigs)._

  <br>
  <hr align="center" width="50%">
  <br>

## **`callback`**

This callback is invoked when we successfully connect to the broker as a producer. It will also be invoked if there are any errors.

If there is no error, the argument passed in will be `null`.

```TypeScript
(error: any | null) => void;
```

  <br>
  <hr align="center" width="50%">
  <br>

## **Example**

Now that we have the background knowledge of what each argument is, let's see an example of how it would look in your code.

```TypeScript
const clientOptions = {
  host: 'localhost',
  port: 9092,
}

const topics = {
  topic1: null,
  topic2: null,
}

const kafka = Kafka(clientOptions, topics);
```

  </section>

  <br>
  <hr align="center" width="50%">
  <br>

  <section id="kafka-produce">

### **Producing**

Sending messages to topics has been made simple and straight forward.

The only information you need are the name of the topic and the message you want to send.

Though, we do have options to specify where exactly you want the message to go as well as a callback to perform actions after the message has sent or if it errors out.

_For now, we only support strings as the `message`._

```TypeScript
kafka.send(topicName, message);
kafka.send(topicName, message, options);
kafka.send(topicName, message, callback);
kafka.send(topicName, message, options, callback);
```

### **`options`**

Send options are a way to specify where you want your message to be delivered.

```TypeScript
{
  key?: string;
  partition?: number;
  attributes?: number;
}
```

**`key`** -
_Default: ''_

The key for the message.

It's kind of like specifying the person you're sending a letter to.

  <br>

**`partition`** -
_Default: 0_

What partition, or sub-section, you want to send the message to.

  <br>

**`attributes`** -
_Default: 0_

Specifies whether or not you want to use compression for your message.

No compression = 0

GZip = 1

snappy = 2

  <br>

### **`callback`**

This callback will be invoked when the message successfully send and if there is an error.

If there was an error, that error will be passed as an argument. Otherwise it will be `null`.

```TypeScript
(error: any | null) => void;
```

  </section>

  <br>
  <hr align="center" width="50%">
  <br>

  <section id="kafka-consume">

## **Consuming**

Compared to sending messages to topics, consuming them is a little more involve but still straight forward.

As you can see below, you can provide listener options. Although, if you want to just use the defaults that's valid too.

```TypeScript
kafka.consume(topics, callback)
kafka.consume(topics, listenerOptions, callback)
```

First, let's overview what you can expect in the callback.

**`callback`** -
_Required_

```TypeScript
(message: KafkaMessage | null, error?: any) => void
```

A `KafkaMessage` contains the following:

```TypeScript
{
  topic: string;
  message: string;
  offset?: number;
  partition?: number;
  highWaterOffset?: number;
  key?: string;
}
```

Let's go a bit more in-depth about what each key does.

**`topic`**

The name of the topic a message was consumed from.

  <br>

**`message`**

The message sent to the topic.

  <br>

**`offset`**

The offset of the message.

Think of appending to an array.

  <br>

**`partition`**

The partition, or sub-section, on the topic a message was sent to.

  <br>

**`highWaterOffset`**

The last offset that was successfully replicated to all topics.

  <br>

**`key`**

The identifier for a message.

For example: if you have a `gateway` topic and you need user data from the `auth` topic, you can specify a key to differenciate between other messages sent to the `gateway` topic.

  <br>

Now, the message may be null. This will only occur when there is an error.

### **`listenerOptions`**

Finally, we can dive into what the listener options are and what they do.

We provide a way to customize how you want listeners to behave. If you have no need for customization, there are also default options to fallback on.

`KafkaListenerOptions`

```TypeScript
{
  autoCommit?: boolean;
  groupId?: string;
  autoCommitIntervalMs?: number;
  fetchMaxWaitMs?: number;
  fetchMinBytes?: number;
  fetchMaxBytes?: number;
  fromOffset?: boolean;
}
```

**`autoCommit`** -
_Default: false_

`autoCommit` will automagically mark the consumed messages as "read"

  <br>

**`groupId`** -
_Default: 'kafka-node-group'_

The consumer gorup id.

  <br>

**`autoCommitIntervalMs`** -
_Default: 5000ms_

How often, in ms, will the consumer mark messages as "sent"

  <br>

**`fetchMaxWaitMs`** -
_Default: 100ms_

The max time, in ms, to wait if there is insufficient data when receiving a message.

  <br>

**`fetchMinBytes`** -
_Default: 1_

The minimum number of bytes that must be available to respond.

  <br>

**`fetchMaxBytes`** -
_Default: 2048_

The maximum bytes to include in the message set for this partition.

  <br>

**`fromOffset`** -
_Default: false_

If set true, consumer will fetch message from the given offset in the KafkaMessage.

  <br>

_As of now, we're working on allowing support for Buffers. The options for this will be provided on the `encoding` and `keyEncoding` keys._

  <br>
  <hr align="center" width="50%">
  <br>

## **Example**

Now, let's see an example of what we've learned so far and how it would look in your code.

```TypeScript
const clientOptions = {
  host: 'localhost',
  port: 9092,
}

const topics = {
  topic1: null,
  topic2: null,
}

const kafka = Kafka(clientOptions, topics);

kafka.consume('topic2', { autoCommit: true }, (data, error) => console.log(data.message));

kafka.send('topic2', 'Hello, topic2!');
```

  </section>

</section>

<br>
<hr>
<br>

<!-- Rabbit section -->
<section id=rabbit>

## **RabbitMQ**

<section id=rabbit-init>

### **Initilization**

Initilizing RabbitMQ is similar to the syntax you have seen previously with our standards and Kakfa. With RabbitMQ, we use the "createRabbitClass" factory function to instantiate a variable to act as our broker.

Is that an await? Yes, yes it is. Our RabbitMQ message broker can be instantiated using promises.

```TypeScript

const rabbit = await createRabbitClass(clientOptions, topics);

```

 <br>

### **`clientOptions`**

With Codename Hermes, you can create a customaizable rabbit broker for any occasion thanks to the below client options. Continue reading to find out more!

```TypeScript
{
  username?: string;
  password?: string;
  protocol?: 'amqp' | 'amqps';
  vhost?: string;
  locale?: string;
  frameMax?: number;
  heartbeat?: number;
}
```

<br>

**`username`** -
_Default: guest_

User name to create when RabbitMQ creates a new database from scratch.

  <br>

**`password`** -
_Default: guest_

Password for the default user.

 <br>

**`protocol`** -
_Default: amqp_

Mandatory option to specify what messaging protocol is used for the broker. The Codename Hermes team, decided to utilize the `AMQP 0-9-1 messaging protocol` because it is a mature and widely adopted messaging protocol that provides the necessary features and capabilities for building robust, scalable, and interoperable message broker systems.

Please refer to [AMQP 0-9-1](https://www.rabbitmq.com/tutorials/amqp-concepts.html#what-is-amqp) to learn more!

 <br>

**`vhost`** -
_Default: '/'_

The name for the virtual host. RabbitMQ out of the box uses a virtual host named '/'. Changing this option beyond the default is needed when trying to create logical groupings and/or isolated messaging environments within your RabbitMQ broker.

<br>

**`locale`** -
_Default_: _en_US_

The desired locale for error messages. `NOTE:` RabbitMQ only ever uses en_US.

<br>

**`frameMax`** -
_Default: 0_

The size in bytes of the maximum frame allowed over the connection. 0 means no limit. Please refer to [frameMax](https://amqp-node.github.io/amqplib/channel_api.html#connect) for more inforamtion.

<br>

**`heartbeat`** -
_Default: 0_

The period of the connection heartbeat, in seconds. Please refer to [heartbeating](https://amqp-node.github.io/amqplib/channel_api.https://amqp-node.github.io/amqplib/channel_api.html#heartbeating) for more inforamtion.

<br>

### **`topics`**

Now that you have decided on your options, it is time to determine what type of topics you will be. Let's keep reading to find out about our next topic, "topics".

```TypeScript
{
    exchange: amqp.Options.AssertExchange & {
      name: string;
      type?: 'direct' | 'topic' | 'headers' | 'fanout' | 'match';
    };
  } & amqp.Options.AssertQueue & {
      key?: string;
    }

```

<br>

### **_`exchange object`_**

**`name`** -
_Default: ' ' (empty string)_

Name of the topic exchange. Get creative and specific here.

  <br>

**`type`** -
_Default: topic_

This option determines what type of exchange our RabbitMQ broker will use. Although a developer could use any rabbit exchange type with our library, the Codename Hermes team decided to default to using topics because topic exchanges support the publish-subscribe messaging model as well as supports the scalability and extensibility of messaging systems.

 <br>

#### **`amqp AssertExchange options`**

 <br>

**`durable`** -
_Default: true_

if true, the exchange will survive broker restarts.

<br>

**`internal`** -
_Default: false_

if true, messages cannot be published directly to the exchange (i.e., it can only be the target of bindings, or possibly create messages ex-nihilo).

<br>

**`autoDelete`** -
_Default: false_

if true, the exchange will be destroyed once the number of bindings for which it is the source drop to zero.

<br>

**`alternateExchange`** -
_Default: ' ' (empty string)_

an exchange to send messages to if this exchange can’t route them to any queues. Think backup exchange.

<br>

**`arguments`** -
_Default: {} (empty object)_

any additional arguments that may be needed by an exchange type.

 <br>

Please refer to [AssertExchange options](https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange) for more inforamtion.

<br>

### **_`Additional Properties on topic object`_**

<br>

**`key`** -
_Default: ' ' (empty string)_

This value represents the binding and routing keys to ensure produced messages are consumed by the appropriate rabbit broker.

<br>

#### **`amqp AssertQueue options`**

 <br>

**`exclusive`** -
_Default: false_

if true, scopes the queue to the connection.

<br>

**`durable`** -
_Default: true_

if true, the queue will survive broker restarts, modulo the `effects` of exclusive and `autoDelete`.

<br>

**`autoDelete`** -
_Default: false_

if true, the queue will be deleted when the number of consumers drops to zero.

<br>

**`arguments`** -
_Default: {} (empty object)_

any additional arguments that may be needed by an exchange type.

 <br>

Please refer to [AssertQueue options](https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue) for more inforamtion and potential arguments.

<br>
An example of implementing a topic might look like:

```TypeScript
const topics = {
topic1: {
  exchange: {
    name: "topics",
    durable: false,
    type: "topic",
  },
  durable: false,
  key: "hermes",
},
};
```

<br>

<section id=rabbit-produce>

**`Produce`**

In the wonderful world of Rabbit, we still produce messages with our broker using our standard `send` method.

<br>

`NOTE:` the last argument is optional and is not required to send messages with your rabbit broker.

```TypeScript

send(topic: string, message: string, options?: amqp.Options.Publish)
```

<br>

If you would like to enhance your messages, you are free to do so with the following publish options.

#### **`amqp Publish options`**

 <br>

**`expiration`** -
_Default: ' ' (empty string)_

If supplied, the message will be discarded from a queue once it’s been there longer than the given number of milliseconds. In the specification this is a string; numbers supplied here will be coerced to strings for transit.

<br>

**`userId`** -
_Default: ' ' (empty string)_

If supplied, RabbitMQ will compare it to the username supplied when opening the connection, and reject messages for which it does not match.

<br>

**`CC`** -
_Default: ' ' (empty string)_

A routing key as a string or an array of routing keys as strings; messages will be routed to these routing keys in addition to that given as the routingKey parameter. A string will be implicitly treated as an array containing just that string. This will override any value given for CC in the headers parameter. NB The property names CC and BCC are case-sensitive.

 <br>

**`priority`** -
_Default: 0_

A priority for the message; ignored by versions of RabbitMQ older than 3.5.0, or if the queue is not a priority queue (see maxPriority above).

 <br>

**`persistent`** -
_Default: false_

If truthy, the message will survive broker restarts provided it’s in a queue that also survives restarts. Corresponds to, and overrides, the property deliveryMode.

<br>

Please refer to [Publish options](https://amqp-node.github.io/amqplib/channel_api.html#channel_publish) for more inforamtion and potential arguments.

<br>

_Quick example_

```TypeScript
rabbit.send("topic1", "hello from sender.ts in ch lib test");

```

<br>

<section id=rabbit-consume>

**`Consume`**
<br>
_Comming soon!_

<br>
  <hr align="center" width="50%">
<br>

### **Example**

```TypeScript

import ch, { RabbitTopic, createRabbitClass } from "library";

const clientOptions = { host: "localhost", port: 5672 };

const topics: RabbitTopic = {
  topic1: {
    exchange: {
      name: "topics",
      durable: false,
      type: "topic",
    },
    durable: false,
    key: "hermes",
  },
};

const rabbit = await createRabbitClass(clientOptions,topics);

rabbit.send("topic1", "hello from sender.ts in ch lib test");

```

  <!-- Description for Rabbit implementation -->
  <!-- Docs -->
</section>
</section>

<br>
<hr>
<br>

<section id="special-thanks">

## **Credits**

A **major** special thanks to [kafka-node]() and [amqplib]() for allowing this project to have an accelerated launch!

</section>

<!-- TODO: add contributers w/ linkedin pages -->
<section id="contribute">

## **How to Contribute**

Codename Hermes is currently in alpha, we would love to hear your feedback, encouragement, advice, suggestions, or problems! If you would like to contribute please contact us at info@hermeslib.com

</section>

<section id="contributers">

## **Contributers**

Aaron Allen - [LinkedIn](https://www.linkedin.com/in/aaronrallen/) [GitHub](https://github.com/H3R01A)

Mathew Hultquist - [LinkedIn](https://www.linkedin.com/in/mathewjhultquist/) [GitHub](https://github.com/mjhult)

Jose Mencos - [LinkedIn](https://www.linkedin.com/in/jmencos/) [GitHub](https://github.com/Jmencos)

Samantha Mills - [LinkedIn](https://www.linkedin.com/in/samanthamills/) [GitHub](https://github.com/Slmills14)

</section>
