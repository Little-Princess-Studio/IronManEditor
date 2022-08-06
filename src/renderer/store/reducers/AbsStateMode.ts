export default class AbsStateMode<S = any> {
  protected dispatch: (action: { type: string; payload: any }) => void = () => {};

  reducer(state: S, action: { type: string; payload: Partial<S> }) {
    return state;
  }

  bindDispatch(dispatch) {
    this.dispatch = dispatch;
  }
}
