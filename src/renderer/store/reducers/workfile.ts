import Ajv from 'ajv';
import json5 from 'json5';

interface IState {
  /** file path */
  path: string;
  /** file content */
  content: string;
  events: { name: string; rawData?: any; schema?: any }[];
}

const INIT_STATE: IState = {
  path: '',
  content: '',
  events: [],
};

const workfileReducer = (state: IState = INIT_STATE, action: { type: string; payload?: Partial<IState> }) => {
  switch (action.type) {
    case 'update_workfile': {
      return { ...state, ...action.payload };
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
              // FIXME:
              toString() {
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

export default workfileReducer;
