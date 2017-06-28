import { Action, Dispatch as ReduxDispatch } from 'redux';

export interface IAction<P> extends Action {
  type: string;
  payload: P;
  error?: boolean;
  meta?: object;
}

export type Dispatch<P> = ReduxDispatch<IAction<P>>;
