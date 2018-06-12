import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs/Observable';

export class BaseService {
    constructor(protected http: HttpClient, protected baseUrl: string) {
    }

    post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${url}`, body);
    }

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${url}`);
    }
}
