import { of } from "rxjs";
import { ITokenManager } from "./token-manager";

export class SessionStorageTokenManagerService implements ITokenManager {
    storeToken(token: string) {
        window.sessionStorage.setItem('authToken', token);
        return of(token);
    }

    loadToken() {
        return of(window.sessionStorage.getItem('authToken'));
    }

    removeToken() {
        window.sessionStorage.removeItem('authToken');

        return of(true);
    }
}

export class LocalStorageTokenManagerService implements ITokenManager {
    storeToken(token: string) {
        window.localStorage.setItem('authToken', token);
        return of(token);
    }

    loadToken() {
        return of(window.localStorage.getItem('authToken'));
    }

    removeToken() {
        window.localStorage.removeItem('authToken');

        return of(true);
    }
}