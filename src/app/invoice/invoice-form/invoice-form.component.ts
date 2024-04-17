import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  template: `
    <form [formGroup]="invoiceForm" (submit)="onSubmit()">
    <app-invoice-form-general [parent]="invoiceForm"></app-invoice-form-general>
    
    <hr />

    <h3>Détails de la facture</h3>
    <app-invoice-form-details 
      [parent]="invoiceForm"
      (details-added)="onAddDetails()"
      (details-removed)="onRemoveDetails($event)"
    >
    </app-invoice-form-details>

    <hr />

    <app-invoice-form-totals [total]="total"></app-invoice-form-totals>

    <button class="mt-3 w-sm-auto btn btn-success" id="submit">
      Enregistrer
    </button>
  </form>
  `,
  styles: [
  ]
})
export class InvoiceFormComponent implements OnInit {

  invoiceForm = this.fb.group({
    customer_name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    status: ['SEND'],
    details: this.fb.array<FormGroup<{
      description: FormControl,
      amount: FormControl,
      quantity: FormControl
    }>>([])
  }, {
    validators: detailsExistsValidator
  })

  onAddDetails() {
    this.details.push(this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
    }))
  }

  onRemoveDetails(index: number) {
    this.details.removeAt(index);
  }

  onSubmit() {
    console.log(this.invoiceForm.value);
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  get total(): number {
    return this.details.value.reduce((itemTotal: number, item) => {
      return itemTotal + (item.amount * item.quantity);
    }, 0)
  }

  get details() {
    return this.invoiceForm.controls.details;
  }

}

const detailsExistsValidator: ValidatorFn = (control: AbstractControl) => {
  const details = control.get('details') as FormArray;
  return details.length > 0 ? null : {
    noDetails: true
  };
}