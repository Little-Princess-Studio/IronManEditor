import Ajv from 'ajv';
import json5 from 'json5';

interface IState {
  /** file path */
  path: string;
  /** file content */
  content: string;
  events: any[];
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
  if (payload && payload.content) {
    try {
      const json = json5.parse(payload.content);

      if (Array(json.events) && json.events.length > 0) {
        const schema = await window.electron.schema();
        const ajv = new Ajv();
        // console.log(json.events, schema);

        payload.events = json.events.map((evt) => {
          if (!Array.isArray(evt) || evt.length < 2) {
            return evt;
          }

          if (schema[evt[0]] && ajv.compile(schema[evt[0]])(evt)) {
            return {
              name: evt[0],
              rawData: evt[1],
              schema: schema[evt[0]].items[1],
            };
          }

          return evt;
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
