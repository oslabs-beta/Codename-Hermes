export class MockProducer {
  constructor() {}

  publish = jest.fn();
  send = jest.fn();
}
