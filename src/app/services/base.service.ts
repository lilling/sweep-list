import { HttpClient } from '@angular/common/http';

export class BaseService {
    constructor(protected http: HttpClient, protected baseUrl: string) {
    }

    post<T>(url: string, body: any) {
        return this.http.post<T>(`${this.baseUrl}${url}`, body);
    }
}
