import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice-form-general',
  template: `
    <div class="row" [formGroup]="parent" *ngIf="parent">
      <div class="col">
        <label for="description">Description</label>
        <input
          formControlName="description"
          [class.is-invalid]="description?.touched && description?.invalid" 
          [class.is-valid]="description?.touched && description?.valid" 
          type="text"
          id="description"
          name="description"
          placeholder="Description de la facture"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">La description est obligatoire et doit faire au moins 10 caracteres!!</p>
      </div>
      <div class="col">
        <label for="customer_name">Client</label>
        <input
          formControlName="customer_name"
          [class.is-invalid]= "customerName?.touched && customerName?.invalid"
          [class.is-valid]= "customerName?.touched && customerName?.valid"
          type="text"
          id="customer_name"
          name="customer_name"
          placeholder="Nom du client / la société"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">Le client est obligatoire et doit faire au moins 5 caracteres!</p>
      </div>
      <div class="col">
        <label for="status">Statut</label>
        <select formControlName="status" name="status" id="status" class="form-control mb-3">
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELED">Annulée</option>
        </select>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class InvoiceFormGeneralComponent {

  @Input()
  parent?: FormGroup<{
    customer_name: FormControl;
    description: FormControl;
    status: FormControl;
    details: FormArray<FormGroup<{
      description: FormControl;
      amount: FormControl;
      quantity: FormControl;
    }>>
  }>;

  get customerName() {
    return this.parent?.controls.customer_name;
  }

  get description() {
    return this.parent?.controls.description;
  }

}
