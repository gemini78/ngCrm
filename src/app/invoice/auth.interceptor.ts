import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, switchMap, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.startsWith(environment.apiUrl + '/invoice')) {
            return next.handle(req)
        }

        return this.auth.authToken.pipe(
            tap(token => {
                if (!token) {
                    throw new Error("Aucun token d'authentification")
                }
            }),
            switchMap(token => {
                const reqWithToken = req.clone({
                    headers: new HttpHeaders({
                        "Authorization": `Bearer ${token}`
                    })
                })
                return next.handle(reqWithToken)
            })
        )
    }

}