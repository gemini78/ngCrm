import { HttpClient } from "@angular/common/http";
import { TInvoice } from "./invoice";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { pipe, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";

const API_URL = environment.apiUrl;

@Injectable()
export class InvoiceService {
    constructor(private http: HttpClient, private auth: AuthService) { }

    create(invoiceData: TInvoice) {
        return this.http.post<TInvoice>(API_URL + '/invoice', invoiceData)
    }

    update(invoiceData: TInvoice) {
        return this.http.put(API_URL + '/invoice/' + invoiceData.id, invoiceData)
    }

    delete(id: number) {
        return this.http.delete(API_URL + '/invoice/' + id);
    }

    findAll() {
        return this.http.get<TInvoice[]>(API_URL + '/invoice');
    }

    find(id: number) {
        return this.http.get<TInvoice>(API_URL + '/invoice/' + id);
    }
}