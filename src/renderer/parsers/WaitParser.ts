import BaseParser from './BaseParser';
import manager from './ParserManager';

class WaitParser extends BaseParser {
  static probe(event: [evtName: string, evtData: any]) {
    if (!Array.isArray(event) || event.length < 2 || event[0] !== 'wait') {
      return {
        match: false,
      };
    }

    return {
      match: true,
      evtData: event[1],
    };
  }

  private evtData: {
    time: number;
  } = null;

  constructor(evtData: any) {
    super();

    this.evtData = evtData;
  }

  toStr(): string {
    if (!this.evtData) {
      return '';
    }

    return `Wait ${this.evtData.time}s`;
  }
}

manager.registerParser('wait', WaitParser);

export default WaitParser;
