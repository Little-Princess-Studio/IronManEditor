export default abstract class BaseParser {
  static probe(event: [evtName: string, evtData: any]) {
    if (!Array.isArray(event) || event.length < 1) {
      return {
        match: false,
      };
    }

    return {
      match: true,
      evtData: event[1],
    };
  }

  abstract toStr(): string;
}
