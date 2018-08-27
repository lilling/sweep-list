import { HttpErrorResponse } from '@angular/common/http';

export interface IClientError {
    /**
     * Epic correct path.
     */
    actionType: string;
    /**
     * Original error
     */
    error: HttpErrorResponse;
}
