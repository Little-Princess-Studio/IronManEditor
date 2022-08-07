import AbsStateMode from './AbsStateMode';
import Ajv from 'ajv';
import json5 from 'json5';
import format from 'string-template';

interface IState {
  /** file path */
  path: string;
  /** file content */
  content: string;
  events: { name: string; rawData?: any; schema?: any }[];
  activeEventIndex: number;
}

const INIT_STATE: IState = {
  path: '',
  content: '',
  events: [],
  activeEventIndex: -1,
};

const saveWorkFile = async (path: string, content: string, events: any[]) => {
  try {
    const json = json5.parse(content);
    json.events = events.map((evt) => {
      const arr = [evt.name];

      if (evt.rawData) {
        arr.push(evt.rawData);
      }

      return arr;
    });

    await window.electron.file.writeFile(path, json5.stringify(json, null, '  '));
  } catch (err) {
    console.log(err);
  }
};

class WorkFileMode extends AbsStateMode<IState> {
  private schema: { [name: string]: any } | null = null;

  async getSchema() {
    if (this.schema) {
      return this.schema;
    }

    this.schema = await window.electron.schema();
    return this.schema;
  }

  constructor() {
    super();

    this.getSchema();
  }

  reducer(state: IState = INIT_STATE, action: { type: string; payload: Partial<IState> }): IState {
    switch (action.type) {
      case 'delete_workfile_event_at': {
        const events = [...state.events];
        events.splice(action.payload as number, 1);

        saveWorkFile(state.path, state.content, events);

        return { ...state, events };
      }
      case 'update_workfile_event': {
        const events = [...state.events];
        const { index, rawData } = action.payload as any;

        events[index] = { ...events[index], rawData };

        saveWorkFile(state.path, state.content, events);

        return { ...state, events };
      }
      case 'merge_workfile_state': {
        return { ...state, ...action.payload };
      }
      default:
        return state;
    }
  }

  async updateWorkFile(payload: Partial<IState>) {
    payload.events = [];

    if (payload.content) {
      try {
        const json = json5.parse(payload.content);

        if (Array(json.events) && json.events.length > 0) {
          const schema = await this.getSchema();
          const ajv = new Ajv();

          ajv.addKeyword('toStr');

          payload.events = json.events.map((evt) => {
            if (!Array.isArray(evt)) {
              return {
                name: 'unknown',
                rawData: evt,
                toString() {
                  return JSON.stringify(this.rawData);
                },
              };
            }

            if (evt.length < 2) {
              return {
                name: evt[0] || 'unknown',
                toString() {
                  return '';
                },
              };
            }

            const evtName = evt[0];

            if (schema[evtName] && ajv.compile(schema[evtName])(evt)) {
              return {
                name: evtName,
                rawData: evt[1],
                schema: schema[evtName].items[1],
                toString() {
                  if (this.schema.toStr) {
                    return format(this.schema.toStr, this.rawData);
                  }

                  return JSON.stringify(this.rawData);
                },
              };
            }

            return {
              name: evtName,
              rawData: evt[1],
              toString() {
                return JSON.stringify(this.rawData);
              },
            };
          });

          console.log(payload.events);
        }
      } catch (err) {
        console.log(err);
      }
    }

    this.dispatch({
      type: 'merge_workfile_state',
      payload: {
        ...payload,
        activeEventIndex: -1,
      },
    });
  }

  deleteEvent(index: number) {
    this.dispatch({
      type: 'delete_workfile_event_at',
      payload: index,
    });
  }

  activateEvent(activeEventIndex: number) {
    this.dispatch({
      type: 'merge_workfile_state',
      payload: { activeEventIndex },
    });
  }

  updateEventData(rawData: any, index: number) {
    this.dispatch({
      type: 'update_workfile_event',
      payload: {
        index,
        rawData,
      },
    });
  }

  resetWorkfile() {
    this.dispatch({
      type: 'merge_workfile_state',
      payload: INIT_STATE,
    });
  }
}

const workfileMode = new WorkFileMode();

export default workfileMode;
