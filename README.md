<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">

<!-- Logo -->
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./media/CH-Logo-White.png">
    <source media="(prefers-color-scheme: light)" srcset="./media/CH-Logo-Black.png">
    <img alt="Codename Hermes Logo" src="./media/CH-Logo-Black.png" width="300px" align="center">
  </picture>

<!-- Brief summary -->

# **Codename Hermes**

### A library to abstract away and standardize the initial setup and implementation of connecting with message brokers.

<br>

  <!-- Directory -->
  <div align="left">
  
  ## Directory

- <a href="#standards">Standards</a>

  - <a href="#standards-init">Broker Initilization</a>
  - <a href="#standards-produce">Producing</a>
  - <a href="#standards-consume">Consuming</a>

  <br>

- <a href="#kafka">Kafka</a>

  - <a href="#kafka-produce">Produce</a>
  - <a href="#kafka-consume">Consume</a>

  <br>

- <a href="#rabbit">Rabbit</a>
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

### **Initilization**

Much like you've seen, initilizing Kafka will be the exact same as defined in the standards with the only differance being, we're assigning the returned value of the Kafka factory function.

```TypeScript
const kafka = Kafka(clientOptions, topics);

```

For now, another discrepancy would be Kafka specific `clientOptions` and `topics`.

With Kafka we have some new options!

```TypeScript
{
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

**`connectTimeout`**

<br>

**`requestTimeout`**

<br>

**`autoConnect`**

<br>

**`connectRetryOptions`**

These options are to further customize how you want the client to reconnect to the Kafka broker.

```TypeScript
{
  retries?: number;
  factor?: number;
  minTimeout?: number;
  maxTimeout?: number;
  randomize?: boolean;
}
```

<br>

**`ildeConnection`**

<br>

**`reconnectOnIdle`**

<br>
 
**`maxAsyncRequests`**

<br>

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
