import Kafka, {
  KafkaClientOptions,
  KafkaListenerOptions,
  KafkaMessage,
  KafkaSendOptions,
  KafkaTopic,
} from './brokers/kafka/main';

import Rabbit, {
  RabbitClientOptions,
  RabbitListenerOptions,
  RabbitMessage,
  RabbitTopic,
  createRabbitClass
} from './brokers/rabbit/main';

// Individual Kafka exports
export {
  Kafka,
  KafkaClientOptions,
  KafkaListenerOptions,
  KafkaMessage,
  KafkaSendOptions,
  KafkaTopic,
};

// Individual Rabbit exports
export {
  Rabbit,
  RabbitClientOptions,
  RabbitListenerOptions,
  RabbitMessage,
  RabbitTopic,
  createRabbitClass
};

// All export
const CodenameHermes = {
  Kafka,
  Rabbit,
  Redis: 'Not implemented.',
};

export default CodenameHermes;
