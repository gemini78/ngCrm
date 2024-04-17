import { HttpClient } from "@angular/common/http";
import { TInvoice } from "./invoice";
import { Injectable } from "@angular/core";

@Injectable()
export class InvoiceService {
    constructor(private http: HttpClient) { }

    create(invoiceData: TInvoice) {
        return this.http.post('https://x8ki-letl-twmt.n7.xano.io/api:BTcrjDR0/invoice', invoiceData);
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