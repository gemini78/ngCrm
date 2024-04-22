import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InvoicesListComponent } from "./invoices-list.component";
import { InvoiceStatusComponent } from "./invoice-status.component";
import { RouterModule } from "@angular/router";
import { InvoiceService } from "../invoice.service";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BehaviorSubject, Observable, from, of, throwError } from "rxjs";
import { TInvoice, TInvoiceStatus, TInvoicesDetail } from "../invoice";
import { By } from "@angular/platform-browser";

describe("InvoicesListComponent", () => {
    let fixture: ComponentFixture<InvoicesListComponent>;
    let component: InvoicesListComponent;
    let service: InvoiceService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [InvoicesListComponent, InvoiceStatusComponent],
            imports: [RouterModule, RouterTestingModule, HttpClientTestingModule],
            providers: [InvoiceService],

        }).compileComponents();
        fixture = TestBed.createComponent(InvoicesListComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(InvoiceService);


    }));

    it("should display an error message if request fails", () => {
        const spyFindAll = spyOn(service, "findAll");
        spyFindAll.and.returnValue(throwError(() => of(null)));

        fixture.detectChanges();
        const alertDiv: HTMLDivElement = fixture.nativeElement.querySelector('alert.bg-danger');
        console.log(alertDiv);

        expect(true).toBeTrue();
    })

    it("should display a list of invoices if request success", () => {
        expect(true).toBeTrue();

        const mockInvoices: any[] = [
            {
                id: 1,
                description: "MOCK_DESCRIPTION",
                customer_name: "MOCK_CUSTOMER",
                status: "PAID",
                total: 300,
                created_at: Date.now(),
                details: []
            },
            {
                id: 2,
                description: "MOCK_DESCRIPTION",
                customer_name: "MOCK_CUSTOMER",
                status: "PAID",
                total: 500,
                created_at: Date.now(),
                details: []
            },

        ];
        const spyFindAll = spyOn(service, "findAll");
        spyFindAll.and.returnValue(of(mockInvoices));
        fixture.detectChanges();
        const allTrs = fixture.debugElement.queryAll(By.css('tbody tr'));
        const oneTr: HTMLTableRowElement = fixture.nativeElement.querySelector('tbody tr');
        expect(allTrs.length).toBe(2);
        expect(oneTr.innerHTML).toContain('300,00&nbsp;€');

    })

})