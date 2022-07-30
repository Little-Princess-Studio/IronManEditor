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

    // TODO:

    return [];
  }
}

const manager = new ParserManager();

export default manager;
