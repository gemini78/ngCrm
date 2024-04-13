import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AuthService, TOKEN_MANAGER } from "./auth.service"

import { ITokenManager } from "../token-manager"
import { Observable, combineLatest, of, skip } from "rxjs"
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
})