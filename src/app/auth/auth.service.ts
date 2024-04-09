import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

export type TRegisterData = {
    email: string;
    name: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) { }

    register(registerData: TRegisterData) {
        return this.http.post('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/auth/signup', registerData)
    }

    exists(email: string) {
        return this.http.post<{ exists: boolean }>('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/user/validation/exists',
            { email }).pipe(map(apiResponse => apiResponse.exists));
    }

}