import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice-form-details',
  template: `
    <ng-container [formGroup]="parent" *ngIf="parent && details">
      <div class="alert bg-warning text-white" *ngIf="details.length===0">
        <p>Vous devez ajouter des détails à votre facture</p>
        <button type="button" class="btn btn-sm btn-outline-light" (click)="detailsAddedEvent.emit()">
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
                (click)="detailsRemovedEvent.emit(i)"
              >
                X
              </button>
            </div>
          </div>
        </div>
        <button *ngIf="details.length > 0" class="btn btn-primary btn-sm" type="button" (click)="detailsAddedEvent.emit()">
          + Ajouter une ligne
        </button>
      </section>
    </ng-container>
  `,
  styles: [
  ]
})
export class InvoiceFormDetailsComponent {
  @Output('details-removed')
  detailsRemovedEvent = new EventEmitter<number>()

  @Output('details-added')
  detailsAddedEvent = new EventEmitter()

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

  get details() {
    return this.parent?.controls.details;
  }

}
