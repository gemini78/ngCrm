import { HttpClient } from "@angular/common/http";
import { TInvoice } from "./invoice";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { pipe, switchMap, tap } from "rxjs";

@Injectable()
export class InvoiceService {
    constructor(private http: HttpClient, private auth: AuthService) { }

    create(invoiceData: TInvoice) {
        return this.auth.authToken.pipe(
            tap(token => {
                if (!token) {
                    throw new Error('Unauthenticated')
                }
            }),
            switchMap(token => {
                return this.http.post<TInvoice>('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/invoice', invoiceData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            })
        )
    }

    update(invoiceData: TInvoice) {
        return this.http.put('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/invoice/' + invoiceData.id, invoiceData)
    }

    delete(id: number) {
        return this.http.delete('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/invoice/' + id);
    }

    findAll() {
        return this.http.get<TInvoice[]>('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/invoice');
    }

    find(id: number) {
        return this.http.get<TInvoice>('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/invoice/' + id);
    }
}