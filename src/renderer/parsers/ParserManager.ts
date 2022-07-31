class ParserManager {
  private parsers = new Map();

  registerParser(key: string, parser: any) {
    this.parsers.set(key, parser);
  }

  unregisterParser(key: string) {
    this.parsers.delete(key);
  }

  parseEvents(events: any[]) {
    if (!Array.isArray(events) || events.length === 0) {
      return [];
    }

    const result = [];
    const parsers = [...this.parsers.values()];

    for (let i = 0, len = events.length; i < len; i++) {
      const evt = events[i];

      let instance = null;

      for (let j = 0, count = parsers.length; j < count; j++) {
        const P = parsers[j];
        if (P.probe(evt).match) {
          instance = new P(P.probe(evt).evtData);
          break;
        }
      }

      if (instance != null) {
        result.push(instance);
      } else {
        console.log('unrecognized event', evt);
      }
    }

    return result;
  }
}

const manager = new ParserManager();

export default manager;
