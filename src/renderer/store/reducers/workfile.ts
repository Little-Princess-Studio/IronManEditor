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

const workfileReducer = (state: IState = INIT_STATE, action: { type: string; payload?: Partial<IState> }) => {
  switch (action.type) {
    case 'update_workfile': {
      return { ...state, ...action.payload, activeEventIndex: -1 };
    }
    case 'delete_workfile_event_at': {
      const events = [...state.events];
      events.splice(action.payload as number, 1);

      saveWorkFile(state.path, state.content, events);

      return { ...state, events };
    }
    case 'activate_workfile_event': {
      return { ...state, activeEventIndex: action.payload };
    }
    case 'update_workfile_event': {
      const events = [...state.events];
      const { index, rawData } = action.payload as any;

      events[index] = { ...events[index], rawData };

      saveWorkFile(state.path, state.content, events);

      return { ...state, events };
    }
    default:
      return state;
  }
};

export const updateWorkFile = async (dispatch, payload: Partial<IState>) => {
  payload.events = [];

  if (payload.content) {
    try {
      const json = json5.parse(payload.content);

      if (Array(json.events) && json.events.length > 0) {
        const schema = await window.electron.schema();
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

  dispatch({
    type: 'update_workfile',
    payload,
  });
};

export const deleteEvent = (index: number) => {
  return {
    type: 'delete_workfile_event_at',
    payload: index,
  };
};

export const activateEvent = (index: number) => {
  return {
    type: 'activate_workfile_event',
    payload: index,
  };
};

export const updateEventData = (rawData, index) => {
  return {
    type: 'update_workfile_event',
    payload: {
      index,
      rawData,
    },
  };
};

export default workfileReducer;
