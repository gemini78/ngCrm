import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AuthService, TOKEN_MANAGER } from "./auth.service"

import { ITokenManager } from "../token-manager"
import { Observable, catchError, combineLatest, of, skip } from "rxjs"
import { Router } from "@angular/router"
import { LoginComponent } from "./login/login.component"
import { ReactiveFormsModule } from "@angular/forms"

let service: AuthService;
let storedToken: string | null = null;
let router: Router;
let fixture: ComponentFixture<LoginComponent>;
let component: LoginComponent;

const fakeTokenManager: ITokenManager = {
    storeToken: function (token: string): Observable<string> {
        storedToken = token;
        return of(token);
    },
    loadToken: function (): Observable<string | null> {
        return of(storedToken);
    },
    removeToken: function (): Observable<boolean> {
        storedToken = null;
        return of(true);
    }
}

describe("AutService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ReactiveFormsModule],
            providers: [AuthService, {
                provide: TOKEN_MANAGER,
                useValue: fakeTokenManager
            }]
        })

        storedToken = null;
    })

    it("should set authStatus$ to TRUE if token is stored", (done: DoneFn) => {
        /* const http = TestBed.inject(HttpClient);
        const httpController = TestBed.inject(HttpTestingController); */
        storedToken = 'MOCK_TOKEN';
        service = TestBed.inject(AuthService);

        service.authStatus$.subscribe(status => {
            expect(status).toBeTrue();
            done();
        })
    })

    it("should set authStatus$ to FALSE if token is no stored", (done: DoneFn) => {
        service = TestBed.inject(AuthService);
        service.logout();
        expect(storedToken).toBeNull();

        service.authStatus$.subscribe(status => {
            expect(status).toBeFalse();
            done();
        })
    })

    it("should set authStatus$ to FALSE and remove token when we call logout()", (done: DoneFn) => {
        service = TestBed.inject(AuthService);

        service.authStatus$.subscribe(status => {
            expect(status).toBeFalse();
            done();
        })
    })

    it("should store token and set authStatus$ to TRUE if login() succeeds", (done: DoneFn) => {
        const http = TestBed.inject(HttpClientTestingModule);
        const httpController = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);


        service = TestBed.inject(AuthService);
        const login$ = service.login({
            email: 'john.doe@gmail.com',
            password: 'passw0rd'
        });

        const authStatus$ = service.authStatus$.pipe(skip(1));

        combineLatest([login$, authStatus$]).subscribe(([token, status]) => {
            expect(token).toBe('MOCK_TOKEN');
            expect(storedToken).toBe('MOCK_TOKEN');
            expect(status).toBeTrue();
            done();
        })

        const request = httpController
            .expectOne('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/auth/login');

        request.flush({
            authToken: 'MOCK_TOKEN'
        })

    })

    it("should not store token and set authStatus$ to FALSE if login() fails", (done: DoneFn) => {
        const http = TestBed.inject(HttpClientTestingModule);
        const httpController = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);


        service = TestBed.inject(AuthService);
        const login$ = service.login({
            email: 'john.doe@gmail.com',
            password: 'passw0rd'
        }).pipe(catchError(() => of('error')));

        const authStatus$ = service.authStatus$;

        combineLatest([login$, authStatus$]).subscribe({
            next: ([token, status]) => {
                expect(token).toBe('error')
                expect(status).toBeFalse();
                expect(storedToken).toBeNull();
                done();
            }
        })

        const request = httpController
            .expectOne('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/auth/login');

        request.flush({
            message: 'MOCK_ERROR_MESSAGE'
        }, {
            status: 401,
            statusText: 'Forbidden'
        })

    })

    it("should register new account", (done: DoneFn) => {
        const httpController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AuthService);
        service.register({
            email: 'mock@mail.com',
            password: 'passw0rd',
            name: 'MOCK_NAME'
        }).subscribe(() => {
            done();
        });

        const request = httpController
            .expectOne({
                method: 'POST',
                url: 'https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/auth/signup'
            });

        expect(request.request.body).toEqual({
            email: 'mock@mail.com',
            password: 'passw0rd',
            name: 'MOCK_NAME',
        })

        request.flush({})
    })

    it("should verify if a mail already exist", (done: DoneFn) => {
        const httpController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AuthService);
        service.exists('mock@mail.com').subscribe((exists) => {
            expect(exists).toBeTrue();
            done();
        })

        const request = httpController
            .expectOne({
                method: 'POST',
                url: 'https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/user/validation/exists'
            });

        expect(request.request.body).toEqual({ email: 'mock@mail.com' })

        request.flush({
            exists: true,
        })
    })
})