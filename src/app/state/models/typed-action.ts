import { Action } from 'redux';

export interface TypedAction<T> extends Action {
    type: string;
    payload?: T;
}
