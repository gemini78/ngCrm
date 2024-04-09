import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken, inject } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { LocalStorageTokenManagerService } from "./token-manager.service";
import { ITokenManager } from "./token-manager";

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
        return this.http.post('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/auth/signup', registerData)
    }

    exists(email: string) {
        return this.http.post<{ exists: boolean }>('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/user/validation/exists',
            { email }).pipe(map(apiResponse => apiResponse.exists));
    }

    login(loginData: TLoginData) {
        return this.http.post<TLoginApiResponse>('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/auth/login', loginData).pipe(
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