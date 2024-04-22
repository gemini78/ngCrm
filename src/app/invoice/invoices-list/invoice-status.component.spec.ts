import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InvoiceStatusComponent } from "./invoice-status.component";

describe("InvoiceStatusComponent", () => {
    let fixture: ComponentFixture<InvoiceStatusComponent>;
    let component: InvoiceStatusComponent;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [InvoiceStatusComponent],
            imports: [],
            providers: [],

        }).compileComponents();
        fixture = TestBed.createComponent(InvoiceStatusComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }))
    it("should display and translate invoice status correctly", () => {
        let span: HTMLSpanElement = fixture.nativeElement.querySelector('span.badge');
        //existing
        expect(span).toBeTruthy();

        //values
        component.status = "PAID";
        fixture.detectChanges();
        expect(span).toHaveClass('bg-success');
        expect(span.innerText).toContain('Payée');

        component.status = "SENT";
        fixture.detectChanges();
        expect(span).toHaveClass('bg-info');
        expect(span.innerText).toContain('Envoyée');

        component.status = "CANCELED";
        fixture.detectChanges();
        expect(span).toHaveClass('bg-danger');
        expect(span.innerText).toContain('Annulée');
    })
})