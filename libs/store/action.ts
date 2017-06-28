import { Action, Dispatch as ReduxDispatch } from 'redux';

export interface IAnyAction {
  type: any;
}

export type Meta = null | { [key: string]: any };

export interface IAction<P> extends IAnyAction {
  type: string;
  payload: P;
  error?: boolean;
  meta?: Meta;
}

export interface ISuccess<P, S> {
  params: P;
  result: S;
}

export interface IFailure<P, E> {
  params: P;
  error: E;
}

export interface IActionCreator<P> {
  type: string;
  (payload: P, meta?: Meta): IAction<P>;
}

export interface IEmptyActionCreator extends IActionCreator<undefined> {
  (payload?: undefined, meta?: Meta): IAction<undefined>;
}

export function isType<P>(
  action: IAnyAction,
  actionCreator: IActionCreator<P>,
): action is IAction<P> {
  return action.type === actionCreator.type;
}

export interface IActionCreatorFactory {
  (type: string, commonMeta?: Meta, error?: boolean): IEmptyActionCreator;
  <P>(type: string, commomMeta?: Meta, isError?: boolean): IActionCreator<P>;
}

export function actionCreatorFactory(
  prefix?: string | null,
  defaultIsError: (payload: any) => boolean = p => p instanceof Error,
): IActionCreatorFactory {
  const actionTypes: {[type: string]: boolean} = {};

  const base = prefix ? `${prefix}/` : '';

  function actionCreator <P>(
    type: string, commonMeta?: Meta,
    isError: ((payload: P) => boolean) | boolean = defaultIsError,
  ): IActionCreator<P> {
    const fullType = base + type;

    if (process.env.NODE_ENV !== 'production') {
      if (actionTypes[fullType]) {
        throw new Error(`Duplicate action type: ${fullType}`);
      }
      actionTypes[fullType] = true;
    }

    return Object.assign(
      (payload: P, meta?: Meta) => {
        const action: IAction<P> = {
          payload,
          type: fullType,
        };

        if (commonMeta || meta) {
          action.meta = Object.assign({}, commonMeta, meta);
        }

        if (isError && (typeof isError === 'boolean' || isError(payload))) {
          action.error = true;
        }

        return action;
      },
      { type: fullType },
    );
  }

  return Object.assign(actionCreator);
}

export type Dispatch<P> = ReduxDispatch<IAction<P>>;
