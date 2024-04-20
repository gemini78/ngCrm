import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { TestBed, waitForAsync } from "@angular/core/testing"
import { AuthInterceptor } from "./auth.interceptor"
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http"
import { AuthService, TOKEN_MANAGER } from "../auth/auth.service"
import { environment } from "src/environments/environment"
import { ITokenManager } from "../token-manager"
import { Observable, of } from "rxjs"

let storedToken: string | null = null;

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

describe("AuthInterceptor", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService, {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true
            }, {
                    provide: TOKEN_MANAGER,
                    useValue: fakeTokenManager
                }]
        })
        storedToken = null;
    }))

    it("should not act on the request if it does not concern /invoice", () => {
        const http: HttpClient = TestBed.inject(HttpClient);
        const httpController = TestBed.inject(HttpTestingController);
        http.get(environment.apiUrl + '/users').subscribe();
        const request = httpController
            .expectOne({
                url: environment.apiUrl + '/users',
                method: 'GET'
            });
        expect(request.request.headers.has('Authorization')).toBeFalse();
        request.flush({})
    });
    it("should throw an error if we reach /invoice whithout an authToken", (done: DoneFn) => {
        const http: HttpClient = TestBed.inject(HttpClient);
        const auth = TestBed.inject(AuthService);
        const authTokenSpy = spyOnProperty(auth, "authToken");
        authTokenSpy.and.returnValue(of(null));

        http.get(environment.apiUrl + '/invoice/toto').subscribe({
            error: (error) => {
                expect(error.message).toBe("Aucun token d'authentification");
                done();
            }
        })
    });
    it("should add Authorization Bearer if we reach /invoice with an authToken", () => {
        const http: HttpClient = TestBed.inject(HttpClient);
        const httpController = TestBed.inject(HttpTestingController);
        const auth = TestBed.inject(AuthService);
        const authTokenSpy = spyOnProperty(auth, "authToken");
        authTokenSpy.and.returnValue(of('MOCK_TOKEN'));

        http.get(environment.apiUrl + '/invoice/toto').subscribe();

        const request = httpController
            .expectOne({
                url: environment.apiUrl + '/invoice/toto',
                method: 'GET'
            });

        expect(request.request.headers.has('Authorization')).toBeTrue();
        expect(request.request.headers.get('Authorization')).toBe('Bearer MOCK_TOKEN');
    });
})

