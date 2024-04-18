import { Component } from "@angular/core"
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { InvoiceFormDetailsComponent } from "./invoice-form-details.component";
import { By } from "@angular/platform-browser";

@Component({
    selector: 'app-test',
    template: `<app-invoice-form-details (details-added)="onAdd()" (details-removed)="onRemove($event)" [parent]="form" ></app-invoice-form-details>`,
    styles: []
})
class TestHostComponent {
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

    onAdd() { }

    onRemove(index: number) { }
}

@Component({
    selector: 'app-test-no-details',
    template: `<app-invoice-form-details (details-added)="onAdd()" (details-removed)="onRemove($event)" [parent]="form" ></app-invoice-form-details>`,
    styles: []
})
class TestHostComponentNoDetails {
    form = new FormGroup({
        details: new FormArray<FormGroup>([])
    });
    onAdd() { }

    onRemove(index: number) { }
}

describe("invoiceFormDetailsComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    it("should display 2 details", () => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, InvoiceFormDetailsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        let detailsRow = fixture.debugElement.queryAll(By.css('.detail-row'));
        expect(detailsRow.length).toBe(2);
    })

    it("should take into account  user modifications to input", () => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, InvoiceFormDetailsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        let detailsRow = fixture.debugElement.queryAll(By.css('.detail-row'));
        expect(detailsRow.length).toBe(2);

        let amount0: HTMLInputElement = fixture.nativeElement.querySelector('#amount_0');
        let description0: HTMLInputElement = fixture.nativeElement.querySelector('#description_0');
        let quantity0: HTMLInputElement = fixture.nativeElement.querySelector('#quantity_0');
        //existing
        expect(amount0).toBeTruthy();
        expect(description0).toBeTruthy();
        expect(quantity0).toBeTruthy();

        //value
        amount0.value = "200";
        amount0.dispatchEvent(new Event("input"));

        description0.value = "UPDATED_DESCRIPTION";
        description0.dispatchEvent(new Event("input"));

        quantity0.value = '3';
        quantity0.dispatchEvent(new Event("input"));

        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.form.controls.details.value[0]).toEqual({
            description: 'UPDATED_DESCRIPTION',
            amount: 200,
            quantity: 3
        });
    });

    it("should Output a custom event when user clicks #add-button", () => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, InvoiceFormDetailsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const onAddSpy = spyOn(component, "onAdd");

        let addButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-button');
        //existing
        expect(addButton).toBeTruthy();
        addButton.click();
        addButton.dispatchEvent(new Event("click"));
        expect(onAddSpy).toHaveBeenCalled();
    });

    it("should Output a custom event when user clicks #remove-button", () => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, InvoiceFormDetailsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const onRemoveSpy = spyOn(component, "onRemove");

        let removeButton0: HTMLButtonElement = fixture.nativeElement.querySelector('#remove-button-0');
        let removeButton1: HTMLButtonElement = fixture.nativeElement.querySelector('#remove-button-1');
        //existing
        expect(removeButton0).toBeTruthy();
        expect(removeButton1).toBeTruthy();
        removeButton0.click();
        removeButton0.dispatchEvent(new Event("click"));
        expect(onRemoveSpy).toHaveBeenCalledWith(0);

        removeButton1.click();
        removeButton1.dispatchEvent(new Event("click"));
        expect(onRemoveSpy).toHaveBeenCalledWith(1);
    });

    it("should display a welcome message with a button to add first détail", () => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponentNoDetails, InvoiceFormDetailsComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();
        fixture = TestBed.createComponent(TestHostComponentNoDetails);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const onAddSpy = spyOn(component, "onAdd");

        let detailsRow = fixture.debugElement.queryAll(By.css('.detail-row'));
        let divMessage = fixture.debugElement.queryAll(By.css('.alert.bg-warning'));
        expect(detailsRow.length).toBe(0);
        expect(divMessage).toBeTruthy();

        let initialAddButton: HTMLButtonElement = fixture.nativeElement.querySelector('#initial-add-button');
        //existing
        expect(initialAddButton).toBeTruthy();
        initialAddButton.click();
        initialAddButton.dispatchEvent(new Event("click"));
        expect(onAddSpy).toHaveBeenCalled();
    })
})