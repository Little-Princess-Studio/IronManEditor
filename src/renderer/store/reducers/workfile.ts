import json5 from 'json5';
import manager from '../../parsers/ParserManager';

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
      const newState = { ...state, ...action.payload };

      if (newState.content) {
        try {
          const jsonData = json5.parse(newState.content);

          newState.events = manager.parseEvents(jsonData.events);

          console.log(jsonData);
        } catch (err) {
          console.error(err);
        }
      }

      return newState;
    }
    default:
      return state;
  }
};

export const updateWorkFile = (payload: Partial<IState>) => {
  return {
    type: 'update_workfile',
    payload,
  };
};

export default workfileReducer;
