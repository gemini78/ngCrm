import { Component, OnInit } from '@angular/core';
import { TInvoice } from '../invoice';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-invoice-edition',
  template: `
    <div class="bg-light p-5 rounded">
  <h1>Modifier une facture</h1>
  <p class="alert bg-info text-white">
    Remplissez les informations de la facture afin de la retrouver dans
    votre liste plus tard !
  </p>
  <p class="alert bg-warning text-white" *ngIf="errorMessage">
    {{errorMessage}}
  </p>

  <app-invoice-form *ngIf="invoice$ | async as invoice" [invoice]=invoice (invoice-form)="onSubmit($event)" ></app-invoice-form>

</div>
  `,
  styles: [
  ]
})
export class InvoiceEditionComponent implements OnInit {
  errorMessage = '';
  invoice$?: Observable<TInvoice>;

  constructor(private route: ActivatedRoute, private service: InvoiceService) { }

  ngOnInit(): void {
    this.invoice$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(id => this.service.find(+id!))
    )
  }
  onSubmit(invoice: TInvoice) { }
}
