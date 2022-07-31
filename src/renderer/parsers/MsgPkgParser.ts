import BaseParser from './BaseParser';
import manager from './ParserManager';

class MsgPkgParser extends BaseParser {
  static probe(event: [evtName: string, evtData: any]) {
    if (!Array.isArray(event) || event.length < 2 || event[0] !== 'set_msg_pkg') {
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
    pkg_name: string;
  } = null;

  constructor(evtData: any) {
    super();

    this.evtData = evtData;
  }

  toStr(): string {
    if (!this.evtData) {
      return '';
    }

    return `use ${this.evtData.pkg_name}.txt`;
  }
}

manager.registerParser('set_msg_pkg', MsgPkgParser);

export default MsgPkgParser;
