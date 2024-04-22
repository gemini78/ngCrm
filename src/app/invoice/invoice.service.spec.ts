import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { InvoiceService } from "./invoice.service";
import { TInvoice } from "./invoice";
import { environment } from "src/environments/environment";
import { of } from "rxjs";


const API_URL = environment.apiUrl;

describe("InvoiceService", () => {
    let service: InvoiceService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [InvoiceService]

        }).compileComponents();
    }))

    it("should call /invoice in POST when we call create()", () => {

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

        expect(request.request.body).toEqual({
            description: "MOCK_DESCRIPTION",
            customer_name: "MOCK_CUSTOMER",
            status: 'PAID',
            details: [
                { amount: 30000, quantity: 2, description: 'MOCK_DESCRIPTION' }
            ]
        });
    });

    it("should call /invoice/{:id} in DELETE when we call delete()", () => {
        const httpController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(InvoiceService);

        service.delete(78).subscribe();

        const request = httpController.expectOne({
            url: API_URL + '/invoice/78',
            method: 'DELETE'
        });
        expect(true).toBeTrue();
    })

    it("should call /invoice/{:id} in PUT when we call update()", () => {
        service = TestBed.inject(InvoiceService);

        const datasInvoice: TInvoice = {
            id: 78,
            description: "MOCK_DESCRIPTION",
            customer_name: "MOCK_CUSTOMER",
            status: 'PAID',
            details: [
                { amount: 300, quantity: 2, description: 'MOCK_DESCRIPTION' }
            ]
        }
        service.update(datasInvoice).subscribe()

        const httpController = TestBed.inject(HttpTestingController);
        const request = httpController.expectOne({
            url: API_URL + '/invoice/78',
            method: 'PUT'
        });

        expect(request.request.body).toEqual({
            id: 78,
            description: "MOCK_DESCRIPTION",
            customer_name: "MOCK_CUSTOMER",
            status: 'PAID',
            details: [
                { amount: 30000, quantity: 2, description: 'MOCK_DESCRIPTION' }
            ]
        });
    });

    it("should call /invoice in GET when we call findAll()", (done: DoneFn) => {
        service = TestBed.inject(InvoiceService);
        const httpController = TestBed.inject(HttpTestingController);

        service.findAll().subscribe(invoices => {
            const invoice = invoices[0];
            expect(invoice.total).toBe(300);
            done();
        });

        const request = httpController.expectOne({
            url: API_URL + '/invoice',
            method: 'GET'
        });

        request.flush([
            { total: 30000 }
        ])

    })

    it("should call /invoice/{:id} in GET when we call find()", (done: DoneFn) => {
        service = TestBed.inject(InvoiceService);
        const httpController = TestBed.inject(HttpTestingController);

        service.find(78).subscribe(invoice => {
            const detail1 = invoice.details[0];
            const detail2 = invoice.details[1];
            expect(detail1.amount).toBe(300);
            expect(detail2.amount).toBe(40);
            done();
        });

        const request = httpController.expectOne({
            url: API_URL + '/invoice/78',
            method: 'GET'
        });

        request.flush({
            details: [
                { amount: 30000 },
                { amount: 4000 },
            ]
        })

    })
})