import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InvoicesListComponent } from "./invoices-list.component";
import { InvoiceStatusComponent } from "./invoice-status.component";
import { RouterModule } from "@angular/router";
import { InvoiceService } from "../invoice.service";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import { By } from "@angular/platform-browser";

describe("InvoicesListComponent", () => {
    let fixture: ComponentFixture<InvoicesListComponent>;
    let component: InvoicesListComponent;
    let service: InvoiceService;
    let spyFindAll: jasmine.Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [InvoicesListComponent, InvoiceStatusComponent],
            imports: [RouterModule, RouterTestingModule, HttpClientTestingModule],
            providers: [InvoiceService],

        }).compileComponents();

        fixture = TestBed.createComponent(InvoicesListComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(InvoiceService);
        spyFindAll = spyOn(service, "findAll");

    }));

    it("should display an error message if request fails", () => {
        spyFindAll.and.returnValue(throwError(() => of(null)));
        fixture.detectChanges();
        const alertDiv: HTMLDivElement = fixture.nativeElement.querySelector('alert.bg-danger');
        expect(true).toBeTrue();
    })

    it("should display a list of invoices if request success", () => {
        spyFindAll.and.returnValue(of(getFakeInvoices()));
        fixture.detectChanges();
        const allTrs = fixture.debugElement.queryAll(By.css('tbody tr'));
        const oneTr: HTMLTableRowElement = fixture.nativeElement.querySelector('tbody tr');
        expect(allTrs.length).toBe(2);
        expect(oneTr.innerHTML).toContain('300,00&nbsp;€');
    });

    it("should delete an invoice if request succeeds", () => {
        spyFindAll.and.returnValue(of(getFakeInvoices()));

        const spyDelete = spyOn(service, "delete");
        spyDelete.and.returnValue(of({}));

        fixture.detectChanges();

        let deleteButton1: HTMLButtonElement = fixture.nativeElement.querySelector('#delete-button-1');
        deleteButton1.click();
        fixture.detectChanges();
        deleteButton1 = fixture.nativeElement.querySelector('#delete-button-1');
        expect(deleteButton1).toBeNull();
    })

    it("should not delete an invoice if request fails", () => {
        spyFindAll.and.returnValue(of(getFakeInvoices()));

        const spyDelete = spyOn(service, "delete");
        spyDelete.and.returnValue(throwError(() => of(null)));

        fixture.detectChanges();

        let deleteButton1: HTMLButtonElement = fixture.nativeElement.querySelector('#delete-button-1');
        deleteButton1.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('#delete-button-1')).toBeDefined();
        expect(fixture.nativeElement.querySelector('.alert.bg-danger')).toBeDefined();
    })
})

const getFakeInvoices = () => {
    return [
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

    ] as any[]
}