import BaseParser from './BaseParser';
import manager from './ParserManager';

class MsgParser extends BaseParser {
  static probe(event: [evtName: string, evtData: any]) {
    if (!Array.isArray(event) || event.length < 2 || event[0] !== 'msg') {
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
    type: string;
    cid: string;
    content: string;
  } = null;

  constructor(evtData: any) {
    super();

    this.evtData = evtData;
  }

  toStr(): string {
    if (!this.evtData) {
      return '';
    }

    return `[ID: ${this.evtData.cid}] says ${this.evtData.content}`;
  }
}

manager.registerParser('msg', MsgParser);

export default MsgParser;
