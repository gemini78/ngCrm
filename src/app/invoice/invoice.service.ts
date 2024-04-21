import { HttpClient } from "@angular/common/http";
import { TInvoice } from "./invoice";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { map, pipe, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";

const API_URL = environment.apiUrl;

@Injectable()
export class InvoiceService {
    constructor(private http: HttpClient) { }

    create(invoiceData: TInvoice) {
        const finalInvoice: TInvoice = this.mapAppInvoiceToApiInvoice(invoiceData);

        return this.http.post<TInvoice>(API_URL + '/invoice', finalInvoice)
    }

    update(invoiceData: TInvoice) {
        const finalInvoice: TInvoice = this.mapAppInvoiceToApiInvoice(invoiceData);

        return this.http.put(API_URL + '/invoice/' + invoiceData.id, finalInvoice)
    }

    delete(id: number) {
        return this.http.delete(API_URL + '/invoice/' + id);
    }

    findAll() {
        return this.http.get<TInvoice[]>(API_URL + '/invoice').pipe(
            map(invoices => {
                return invoices.map(invoice => {
                    return { ...invoice, total: invoice.total! / 100 }
                })
            })
        );
    }

    find(id: number) {
        return this.http.get<TInvoice>(API_URL + '/invoice/' + id).pipe(
            map(invoice => this.mapApiInvoiceToAppInvoice(invoice))
        );
    }

    mapAppInvoiceToApiInvoice(invoice: TInvoice) {
        return {
            ...invoice,
            details: invoice.details.map((item) => {
                return { ...item, amount: item.amount * 100 }
            })
        }
    }

    mapApiInvoiceToAppInvoice(invoice: TInvoice) {
        return {
            ...invoice, details: invoice.details.map(item => {
                return { ...item, amount: item.amount / 100 }
            })
        }
    }
}