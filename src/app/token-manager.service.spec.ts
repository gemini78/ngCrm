import { LocalStorageTokenManagerService, SessionStorageTokenManagerService } from "./token-manager.service"

describe("LocalStorageTokenManager", () => {
    let service: LocalStorageTokenManagerService;

    beforeEach(() => {
        window.localStorage.removeItem('authToken');
        service = new LocalStorageTokenManagerService();
    })
    it("should store token in localStorage and return an observable of the token ", (done: DoneFn) => {
        service.storeToken('MOCK_TOKEN').subscribe(token => {
            expect(token).toBe('MOCK_TOKEN');
            done();
        });
        expect(window.localStorage.getItem('authToken')).toBe('MOCK_TOKEN');
    })

    it("should load a token from localStorage (if there is one)", (done: DoneFn) => {
        window.localStorage.setItem('authToken', 'MOCK_TOKEN');
        service.loadToken().subscribe(token => {
            expect(token).toBe('MOCK_TOKEN');
            done();
        });
    })

    it("should load null if no token is stored in the localStorage", (done: DoneFn) => {
        service.loadToken().subscribe(token => {
            expect(token).toBe(null);
            done();
        });
    })

    it("should remove the token from localStorage", (done: DoneFn) => {
        window.localStorage.setItem('authToken', 'MOCK_TOKEN');
        service.removeToken().subscribe(() => {
            expect(window.localStorage.getItem('authToken')).toBeNull();
            done();
        })
    })
})

describe("SessionStorageTokenManager", () => {
    let service: SessionStorageTokenManagerService;

    beforeEach(() => {
        window.sessionStorage.removeItem('authToken');
        service = new SessionStorageTokenManagerService();
    })
    it("should store token in sessionStorage and return an observable of the token ", (done: DoneFn) => {
        service.storeToken('MOCK_TOKEN').subscribe(token => {
            expect(token).toBe('MOCK_TOKEN');
            done();
        });
        expect(window.sessionStorage.getItem('authToken')).toBe('MOCK_TOKEN');
    })

    it("should load a token from sessionStorage (if there is one)", (done: DoneFn) => {
        window.sessionStorage.setItem('authToken', 'MOCK_TOKEN');
        service.loadToken().subscribe(token => {
            expect(token).toBe('MOCK_TOKEN');
            done();
        });
    })

    it("should load null if no token is stored in the sessionStorage", (done: DoneFn) => {
        service.loadToken().subscribe(token => {
            expect(token).toBe(null);
            done();
        });
    })

    it("should remove the token from sessionStorage", (done: DoneFn) => {
        window.sessionStorage.setItem('authToken', 'MOCK_TOKEN');
        service.removeToken().subscribe(() => {
            expect(window.sessionStorage.getItem('authToken')).toBeNull();
            done();
        })
    })
})