import Kafka from './brokers/kafka/main';
declare const CodenameHermes: {
    kafka: typeof Kafka;
    rabbitmq: string;
    redit: string;
};
export default CodenameHermes;
