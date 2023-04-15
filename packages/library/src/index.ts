import Kafka, {
  KafkaClientOptions,
  KafkaListenerOptions,
  KafkaMessage,
  KafkaSendOptions,
  KafkaTopic,
} from './brokers/kafka/main';

const CodenameHermes = {
  Kafka,
  Rabbit: 'Not implemented.',
  Redis: 'Not implemented.',
};

export default CodenameHermes;

// Individual Kafka exports
export {
  Kafka,
  KafkaClientOptions,
  KafkaListenerOptions,
  KafkaMessage,
  KafkaSendOptions,
  KafkaTopic,
};
