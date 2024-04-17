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

    <div class="row">
      <div class="col-6 text-end">Total HT :</div>
      <div class="col" id="total_ht">{{ total | currency: 'EUR':'symbol':undefined: 'fr'}}</div>
    </div>

    <div class="row">
      <div class="col-6 text-end">Total TVA :</div>
      <div class="col" id="total_tva">{{ totalTVA | currency: 'EUR':'symbol':undefined: 'fr'}}</div>
    </div>
    <div class="row fw-bold">
      <div class="col-6 text-end">Total TTC :</div>
      <div class="col" id="total_ttc">{{ totalTTC | currency: 'EUR':'symbol':undefined: 'fr'}}</div>
    </div>

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

  get totalTVA(): number {
    return this.total * 0.2;
  }

  get totalTTC(): number {
    return (this.total + this.totalTVA);
  }

  get customerName() {
    return this.invoiceForm.controls.customer_name;
  }

  get description() {
    return this.invoiceForm.controls.description;
  }

  get status() {
    return this.invoiceForm.controls.status;
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