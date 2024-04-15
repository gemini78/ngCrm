import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken, inject } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { ITokenManager } from "../token-manager";
import { environment } from "src/environments/environment";

const API_URL = environment.apiUrl;

export type TRegisterData = {
    email: string;
    name: string;
    password: string;
};

export type TLoginData = {
    email: string;
    password: string;
};

export type TLoginApiResponse = {
    authToken: string
};

export const TOKEN_MANAGER = new InjectionToken('the class to inject to store the token');

@Injectable()
export class AuthService {
    authStatus$ = new BehaviorSubject(false);

    constructor(private http: HttpClient, @Inject(TOKEN_MANAGER) private tokenManager: ITokenManager) {
        this.tokenManager.loadToken().subscribe(token => {
            if (token) {
                this.authStatus$.next(true);
            }
        })
    }

    register(registerData: TRegisterData) {
        return this.http.post(API_URL + '/auth/signup', registerData)
    }

    exists(email: string) {
        return this.http.post<{ exists: boolean }>(API_URL + '/user/validation/exists',
            { email }).pipe(map(apiResponse => apiResponse.exists));
    }

    login(loginData: TLoginData) {
        return this.http.post<TLoginApiResponse>(API_URL + '/auth/login', loginData).pipe(
            map(apiResponse => apiResponse.authToken),
            tap(token => {
                this.tokenManager.storeToken(token);
                this.authStatus$.next(true);
            })
        )
    }

    logout() {
        this.tokenManager.removeToken()
        this.authStatus$.next(false);
    }

    get authToken() {
        return this.tokenManager.loadToken();
    }

}