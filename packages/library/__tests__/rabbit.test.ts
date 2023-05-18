import { MockProducer } from './mocks/MockProducer';
import Rabbit from '../src/brokers/rabbit/main';
import { MockClient } from './mocks/MockClient';
import MockConsumer from './mocks/MockConsumer';

describe('Rabbit', ()=> {

console.log('this is a test');

it('should send to a topic', () => {
    expect(true).toBe(true);
  });

});