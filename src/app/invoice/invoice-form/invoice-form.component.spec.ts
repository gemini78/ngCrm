import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InvoiceFormComponent } from "./invoice-form.component";
import { InvoiceFormDetailsComponent } from "./invoice-form-details.component";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { InvoiceFormGeneralComponent } from "./invoice-form-general.component";
import { InvoiceFormTotalsComponent } from "./invoice-form-totals.component";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";
import { TInvoice } from "../invoice";

describe("InvoiceFormComponent", () => {
    let fixture: ComponentFixture<InvoiceFormComponent>;
    let component: InvoiceFormComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InvoiceFormComponent, InvoiceFormDetailsComponent, InvoiceFormGeneralComponent, InvoiceFormTotalsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();
    })
    it("should validate customer_name", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        const field = component.invoiceForm.controls.customer_name;
        let customerInput: HTMLInputElement = fixture.nativeElement.querySelector('#customer_name');
        //existing
        expect(customerInput).toBeTruthy();

        customerInput.value = "";
        customerInput.dispatchEvent(new Event("input"));
        expect(field.hasError('required')).toBeTrue();

        customerInput.value = "Steb";
        customerInput.dispatchEvent(new Event("input"));
        expect(field.hasError('minlength')).toBeTrue();

        customerInput.value = "John D";
        customerInput.dispatchEvent(new Event("input"));
        expect(field.valid).toBeTrue();
    })

    it("should validate description", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        const field = component.invoiceForm.controls.description;
        let descriptionInput: HTMLInputElement = fixture.nativeElement.querySelector('#description');
        //existing
        expect(descriptionInput).toBeTruthy();

        descriptionInput.value = "";
        descriptionInput.dispatchEvent(new Event("input"));
        expect(field.hasError('required')).toBeTrue();

        descriptionInput.value = "lorem ips";
        descriptionInput.dispatchEvent(new Event("input"));
        expect(field.hasError('minlength')).toBeTrue();

        descriptionInput.value = "lorem ipsum";
        descriptionInput.dispatchEvent(new Event("input"));
        expect(field.valid).toBeTrue();
    });

    it("should validate that at least one detail item is given", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        expect(component.invoiceForm.hasError('noDetails')).toBeTrue();

        component.onAddDetails();
        expect(component.invoiceForm.hasError('noDetails')).toBeFalse();
    })

    it("should validate details", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        component = fixture.componentInstance;
        component.onAddDetails();
        fixture.detectChanges();

        const detailItem0 = component.invoiceForm.controls.details.at(0);
        //existing
        expect(detailItem0).toBeTruthy();

        // DESCRIPTION
        let descriptionInput0: HTMLInputElement = fixture.nativeElement.querySelector('#description_0');
        //existing
        expect(descriptionInput0).toBeTruthy();

        //values
        descriptionInput0.value = "";
        descriptionInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.description.hasError('required'))

        descriptionInput0.value = "lore";
        descriptionInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.description.hasError('minlength')).toBeTrue();


        // AMOUNT
        let amountInput0: HTMLInputElement = fixture.nativeElement.querySelector('#amount_0');
        //existing
        expect(amountInput0).toBeTruthy();
        //values
        amountInput0.value = "";
        amountInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.amount.hasError('required'))

        amountInput0.value = "-2";
        amountInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.amount.hasError('min'))

        amountInput0.value = "300";
        amountInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.amount.valid).toBeTrue();

        // QUANTITY
        let quantityInput0: HTMLInputElement = fixture.nativeElement.querySelector('#quantity_0');
        //existing
        expect(quantityInput0).toBeTruthy();
        //values
        quantityInput0.value = "";
        quantityInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.quantity.hasError('required'))

        quantityInput0.value = "-2";
        quantityInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.quantity.hasError('min'))

        quantityInput0.value = "5";
        quantityInput0.dispatchEvent(new Event("input"));
        expect(detailItem0.controls.quantity.valid).toBeTrue();
    });

    it("should add a detail item when we call addDetails()", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        component = fixture.componentInstance;
        component.onAddDetails();
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.detail-row')).length).toBe(1);

        component.onAddDetails();
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.detail-row')).length).toBe(2);
    });

    it("should remove a detail item when we call removeDetails()", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        component = fixture.componentInstance;
        component.onAddDetails(); // item 0
        component.onAddDetails(); // item 1
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.detail-row')).length).toBe(2);
        component.onRemoveDetails(0);
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.detail-row')).length).toBe(1);
        component.onRemoveDetails(0);
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.detail-row')).length).toBe(0);
    });

    it("should listen to details events", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const initialAddButton: HTMLButtonElement = fixture.nativeElement.querySelector('#initial-add-button');
        //existing
        expect(initialAddButton).toBeTruthy();
        initialAddButton.click();
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.detail-row')).length).toBe(1);

        const removeButton0: HTMLButtonElement = fixture.nativeElement.querySelector('#remove-button-0');
        //existing
        expect(removeButton0).toBeTruthy();
        removeButton0.click();
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.detail-row')).length).toBe(0);
    });

    it("should calculate total", () => {
        fixture = TestBed.createComponent(InvoiceFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.details.push(new FormGroup({
            amount: new FormControl(200),
            quantity: new FormControl(3),
            description: new FormControl(''),
        }));
        component.details.push(new FormGroup({
            amount: new FormControl(300),
            quantity: new FormControl(3),
            description: new FormControl(''),
        }));
        fixture.detectChanges();
        expect(component.total).toBe(1500);
    })
})

@Component({
    selector: 'app-test-host',
    template: `<app-invoice-form (invoice-form)="onSubmit($event)"></app-invoice-form>`,
    styles: []
})
class TestHostComponent {
    onSubmit(invoice: TInvoice) { }

    form = new FormGroup({
        details: new FormArray([
            new FormGroup({
                amount: new FormControl(100),
                description: new FormControl('MOCK_DESCRIPTION_1'),
                quantity: new FormControl(2),
            }),
            new FormGroup({
                amount: new FormControl(200),
                description: new FormControl('MOCK_DESCRIPTION_2'),
                quantity: new FormControl(5),
            })
        ])
    })
}

describe("InvoiceFormComponent whith host", () => {

    it("should emit an event on (invoice-form) if form is valid and user clicks submit button", async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent, InvoiceFormComponent, InvoiceFormGeneralComponent, InvoiceFormDetailsComponent, InvoiceFormTotalsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();

        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const component = fixture.componentInstance;
        const submitSpy = spyOn(component, "onSubmit");
        let submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
        let initialAddButton: HTMLButtonElement = fixture.nativeElement.querySelector('#initial-add-button');

        let inputDescription: HTMLInputElement = fixture.nativeElement.querySelector('#description');
        let inputCustomerName: HTMLInputElement = fixture.nativeElement.querySelector('#customer_name');
        let inputStatus: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
        fixture.detectChanges();

        //existing
        expect(submitButton).toBeTruthy();
        expect(initialAddButton).toBeTruthy();
        expect(inputDescription).toBeTruthy();
        expect(inputCustomerName).toBeTruthy();
        expect(inputStatus).toBeTruthy();

        // values
        inputDescription.value = "MOCK_DESCRIPTION";
        inputDescription.dispatchEvent(new Event("input"));

        inputCustomerName.value = "MOCK_CUSTOMER";
        inputCustomerName.dispatchEvent(new Event("input"));
        inputStatus.value = 'PAID';
        inputStatus.dispatchEvent(new Event('change'));

        // add line detail
        initialAddButton.click();
        fixture.detectChanges();

        let amount0: HTMLInputElement = fixture.nativeElement.querySelector('#amount_0');
        let description0: HTMLInputElement = fixture.nativeElement.querySelector('#description_0');
        let quantity0: HTMLInputElement = fixture.nativeElement.querySelector('#quantity_0');

        //existing
        expect(amount0).toBeTruthy();
        expect(description0).toBeTruthy();
        expect(quantity0).toBeTruthy();

        let detailsRow = fixture.debugElement.queryAll(By.css('.detail-row'));
        expect(detailsRow.length).toBe(1);

        fixture.detectChanges();

        //value
        amount0.value = "300";
        amount0.dispatchEvent(new Event("input"));

        description0.value = "MOCK_DESCRIPTION";
        description0.dispatchEvent(new Event("input"));

        quantity0.value = '2';
        quantity0.dispatchEvent(new Event("input"));

        submitButton.click();
        fixture.detectChanges();

        const datasInvoice: TInvoice = {
            description: "MOCK_DESCRIPTION",
            customer_name: "MOCK_CUSTOMER",
            status: 'PAID',
            details: [
                { amount: 300, quantity: 2, description: 'MOCK_DESCRIPTION' }
            ]
        }
        expect(submitSpy).toHaveBeenCalledWith(datasInvoice);
    })

    it("should not emit an event on (invoice-form) if form is invalid and user clicks submit button", async () => {

        // BY DEFAULT THE FORM IS INVALID
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent, InvoiceFormComponent, InvoiceFormGeneralComponent, InvoiceFormDetailsComponent, InvoiceFormTotalsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();

        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const component = fixture.componentInstance;
        const submitSpy = spyOn(component, "onSubmit");
        let submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
        submitButton.click();
        fixture.detectChanges();
        expect(submitSpy).not.toHaveBeenCalled();
    })
})