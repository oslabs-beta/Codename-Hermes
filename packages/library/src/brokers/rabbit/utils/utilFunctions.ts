import { Options } from 'amqplib';
import { RabbitClientOptions, RabbitListenerOptions } from '../main';

export const convertGenericListenerConfigToRabbitAmqpConfig = (
  genericConfig: RabbitListenerOptions
): Options.Consume => ({
  consumerTag: genericConfig.consumerTag,
  noAck: genericConfig.autoCommit,
  exclusive: genericConfig.exclusive,
  priority: genericConfig.priority,
  arguments: genericConfig.arguments,
});
