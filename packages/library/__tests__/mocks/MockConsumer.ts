// TODO: differenciate between kafka/rabbit
export default class MockConsumer {
  private eventCallbacks: {
    message: any;
    error: any;
  };

  constructor() {
    this.eventCallbacks = {
      message: [],
      error: [],
    };
  }

  on(eventName: string, cb: (message: any) => void) {
    switch (eventName) {
      case 'message':
        this.eventCallbacks.message.push(cb);
        break;

      case 'error':
        this.eventCallbacks.error.push(cb);
        break;

      default:
        return;
    }
  }

  trigger(eventName: 'message' | 'error', message: any) {
    this.eventCallbacks[eventName].forEach((event: any) => event(message));
  }
}
