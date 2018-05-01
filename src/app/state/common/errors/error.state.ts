import { IClientError } from '../../../../../shared/classes/client-error.interface';

export interface IErrorState {
    errorMap: { [key: string]: IClientError };
}

export const INITIAL_ERROR_STATE: IErrorState = {
    errorMap: {}
};
