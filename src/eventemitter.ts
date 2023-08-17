import { EventEmitter } from "events";

export default class TypedEventEmitter<TEvents extends Record<string, any>> {
  private emitter = new EventEmitter();
  public removeAllListeners;
  constructor() {
    this.removeAllListeners = this.emitter.removeAllListeners;
  }

  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: TEvents[TEventName]
  ) {
    this.emitter.emit(eventName, ...(eventArg as any));
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ): void {
    this.emitter.on(eventName, handler as any);
  }

  once<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArt: TEvents[TEventName]) => void,
  ): void {
    this.emitter.once(eventName, handler as any);
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ): void {
    this.emitter.off(eventName, handler as any);
  }
}
