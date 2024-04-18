import { Component, DebugElement, createComponent } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { InvoiceFormGeneralComponent } from "./invoice-form-general.component";
import { By } from "@angular/platform-browser";

@Component({
    selector: 'app-test',
    template: `<app-invoice-form-general [parent]="form"></app-invoice-form-general>`,
    styles: []
})
class TestHostComponent {
    form = new FormGroup({
        customer_name: new FormControl(),
        description: new FormControl(),
        status: new FormControl(),
    })
}

describe("InvoiceFormGeneralComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent, InvoiceFormGeneralComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();


    })

    it("should take into account input modifications", () => {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        let inputDescription: HTMLInputElement = fixture.nativeElement.querySelector('#description');
        let inputCustomerName: HTMLInputElement = fixture.nativeElement.querySelector('#customer_name');
        let inputStatus: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
        //existing
        expect(inputDescription).toBeTruthy();
        expect(inputCustomerName).toBeTruthy();
        expect(inputStatus).toBeTruthy();
        console.log(component);
        // values
        inputDescription.value = "MOCK_DESCRIPTION";
        inputDescription.dispatchEvent(new Event("input"));

        inputCustomerName.value = "MOCK_CUSTOMER";
        inputCustomerName.dispatchEvent(new Event("input"));
        inputStatus.value = 'PAID';
        inputStatus.dispatchEvent(new Event('change'))
        fixture.detectChanges();

        expect(component.form.value).toEqual({
            description: 'MOCK_DESCRIPTION',
            status: "PAID",
            customer_name: "MOCK_CUSTOMER"
        });
    })
})