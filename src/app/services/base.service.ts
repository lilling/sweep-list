import { HttpClient } from '@angular/common/http';

export class BaseService {
    constructor(protected http: HttpClient, protected baseUrl: string) {
    }

    post<T>(url: string, body: any) {
        return this.http.post<T>(`${this.baseUrl}${url}`, body);
    }

    get<T>(url: string, isTextResponse = false) {
        if (isTextResponse) {
            return this.http.get(`${this.baseUrl}${url}`, { responseType: 'text' });
        } else {
            return this.http.get<T>(`${this.baseUrl}${url}`);
        }
    }
}
