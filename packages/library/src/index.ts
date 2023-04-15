import Kafka, {
  KafkaClientOptions,
  KafkaListenerOptions,
  KafkaMessage,
  KafkaSendOptions,
  KafkaTopic,
} from './brokers/kafka/main';

const CodenameHermes = {
  kafka: Kafka,
  rabbitmq: 'Not implemented.',
  redit: 'Not implemented.',
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
