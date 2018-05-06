"use babel";
// @flow

import EventEmitter from "events";

/**
 * Event emitter representing Atom request for completion.
 * Emitted events:
 *
 * - `textDocument/completion`: request completion data. Take Atom' option
 *   as parameter.
 */
export class AutoCompleteEventEmitter extends EventEmitter {
  registered: Map<string, Function>;

  constructor() {
    super();
    this.registered = new Map();
  }

  register(id: string, type: string, listener: Function): void {
    console.log("Register new completion provider with ID", id);
    this.registered.set(id, listener);
    super.on(type, listener);
  }

  unregister(id: string) {
    let listener = this.registered.get(id);
    if (listener != null) {
      console.log("Unregister new completion provider with ID", id);
      super.removeListener(id, listener);
      this.registered.delete(id);
    }
  }
}

export const eventEmitter = new AutoCompleteEventEmitter();

export default eventEmitter;
