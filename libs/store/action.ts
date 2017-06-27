import { Action } from 'redux';

export interface IAction<P> extends Action {
  type: string;
  payload: P;
  error?: boolean;
  meta?: object;
}
