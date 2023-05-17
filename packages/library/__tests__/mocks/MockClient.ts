export class MockClient {
  constructor() {}

  // Kafka specific
  close = jest.fn();
  topicExists = jest.fn();
  refreshMetadata = jest.fn();
  sendOffsetCommitV2Request = jest.fn();
  on = jest.fn();
  connect = jest.fn();
  createTopics = jest.fn();
  loadMetadataForTopics = jest.fn();
}
