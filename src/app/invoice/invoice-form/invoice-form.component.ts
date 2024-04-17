import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  template: `
    <form [formGroup]="invoiceForm" (submit)="onSubmit()">
    <app-invoice-form-general [parent]="invoiceForm"></app-invoice-form-general>
    
    <hr />

    <h3>Détails de la facture</h3>
    <div class="alert bg-warning text-white" *ngIf="details.length===0">
      <p>Vous devez ajouter des détails à votre facture</p>
      <button class="btn btn-sm btn-outline-light" (click)="onAddDetails()">
        + Ajouter ma première ligne
      </button>
    </div>
    <section formArrayName="details">
      <div class="detail-row" *ngFor="let group of details.controls; let i = index" [formGroup]="group">
        <div class="row mb-3">
          <div class="col-7">
            <input
              formControlName="description"
              [class.is-invalid]="group.controls.description.touched && group.controls.description.invalid"
              [class.is-valid]="group.controls.description.touched && group.controls.description.valid"
              name="decription_{{i}}"
              id="decription_{{i}}"
              type="text"
              placeholder="Description"
              class="form-control"
            />
            <p class="invalid-feedback">La description est obligatoire</p>
          </div>
          <div class="col-2">
            <input
              formControlName="amount"
              [class.is-invalid]="group.controls.amount.touched && group.controls.amount.invalid"
              [class.is-valid]="group.controls.amount.touched && group.controls.amount.valid"
              name="amount_{{i}}"
              id="amount_{{i}}"
              type="number"
              placeholder="Montant"
              class="form-control"
            />
            <p class="invalid-feedback">Le montant est obligatoire</p>
          </div>
          <div class="col-2">
            <input
              formControlName="quantity"
              [class.is-invalid]="group.controls.quantity.touched && group.controls.quantity.invalid"
              [class.is-valid]="group.controls.quantity.touched && group.controls.quantity.valid"
              name="quantity_{{i}}"
              id="quantity_{{i}}"
              type="number"
              placeholder="Quantité"
              class="form-control"
            />
            <p class="invalid-feedback">La quantité est obligatoire</p>
          </div>
          <div class="col-1">
            <button
              type="button"
              class="btn w-auto d-block btn-sm btn-danger"
              (click)="onRemoveDetails(i)"
            >
              X
            </button>
          </div>
        </div>
      </div>
      <button *ngIf="details.length > 0" class="btn btn-primary btn-sm" type="button" (click)="onAddDetails()">
        + Ajouter une ligne
      </button>
    </section>

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