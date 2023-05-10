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
  <!-- TODO: Add "how to contribute" -->

- <a href="#standards">Standards</a>

  - <a href="#standards-init">Broker Initilization</a>
  - <a href="#standards-produce">Producing</a>
  - <a href="#standards-consume">Consuming</a>

  <br>

- <a href="#kafka">Kafka</a>

  - <a href="#kafka-init">Kafka Initilization</a>
  - <a href="#kafka-produce">Produce</a>
  - <a href="#kafka-consume">Consume</a>

  <br>

- <a href="#rabbit">Rabbit</a>
  - <a href="#rabbit-init">Rabbit Initilization</a>
  - <a href="#rabbit-produce">Produce</a>
  - <a href="#rabbit-consume">Consume</a>
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

The first things first, we need to setup a listener for each topic we want to consume. This can be acheived through the basic syntax below.

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

### **Initilization**

Much like you've seen, initilizing Kafka will be the exact same as defined in the standards with the only differance being, we're assigning the returned value of the Kafka factory function to a variable.

```TypeScript
const kafka = Kafka(clientOptions, topics);

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

### **Example**

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

  <!-- TODO: Add in-depth info for all options -->

  </section>

  <br>
  <hr align="center" width="50%">
  <br>

  <section id="kafka-consume">

### **Consuming**

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
(message: KafkaMessage, error?: any) => void
```

A `KafkaMessage` contains the following:

```TypeScript
{
  topic: string; /* (The topic name.) */
  message: string; /* (The message received.) */
  offset?: number; /* (The offset of the message.) */
  partition?: number; /* (The partition the message was sent to.) */
  highWaterOffset?: number; /* () */
  key?: string; /* (The key. This is specified by you when you send a message.) */
}
```

  <!-- TODO: Finish adding in-depth desc of options. -->

  </section>

</section>

<br>
<hr>
<br>

<!-- Rabbit section -->
<section id="rabbit">

## **RabbitMQ**

  <!-- Description for Rabbit implementation -->
  <!-- Docs -->
</section>

<!-- TODO: add special thanks for kafka-node and amqplib -->
<!-- TODO: add contributers w/ linkedin pages -->
