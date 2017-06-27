import { Location } from 'history';

export type Token = string;

export interface ISession {
  token: Token;
  loading: boolean;
  error: string;
}

export type Router = Location;

export interface IState {
  session: ISession;
  router: Router;
}
