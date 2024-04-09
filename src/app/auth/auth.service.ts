import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";

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

@Injectable()
export class AuthService {
    authStatus$ = new BehaviorSubject(false);
    authToken: string | null = null;
    constructor(private http: HttpClient) { }

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
                this.authToken = token;
                this.authStatus$.next(true);
            })
        )
    }

    logout() {
        this.authToken = null;
        this.authStatus$.next(false);
    }

}