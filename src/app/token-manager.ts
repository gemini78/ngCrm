import { Observable } from "rxjs";

export interface ITokenManager {
    storeToken(token: string): Observable<string>;
    loadToken(): Observable<string | null>;
    removeToken(): Observable<boolean>
}