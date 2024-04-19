import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { InvoiceService } from "./invoice.service";
import { TInvoice } from "./invoice";
import { environment } from "src/environments/environment";


const API_URL = environment.apiUrl;

describe("InvoiceService", () => {
    let service: InvoiceService;

    it("should call /invoice in POST when we call create", async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [InvoiceService]

        }).compileComponents();

        service = TestBed.inject(InvoiceService);

        const datasInvoice: TInvoice = {
            description: "MOCK_DESCRIPTION",
            customer_name: "MOCK_CUSTOMER",
            status: 'PAID',
            details: [
                { amount: 300, quantity: 2, description: 'MOCK_DESCRIPTION' }
            ]
        }
        service.create(datasInvoice).subscribe()

        const httpController = TestBed.inject(HttpTestingController);
        const request = httpController.expectOne({
            url: API_URL + '/invoice',
            method: 'POST'
        });

        expect(request.request.body).toEqual(datasInvoice);
    })
})