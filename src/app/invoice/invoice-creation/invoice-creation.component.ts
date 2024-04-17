import { Component, OnInit } from '@angular/core';
import { TInvoice } from '../invoice';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-creation',
  template: `
    <div class="bg-light p-5 rounded">
  <h1>Créer une nouvelle facture</h1>
  <p class="alert bg-info text-white">
    Remplissez les informations de la facture afin de la retrouver dans
    votre liste plus tard !
  </p>

  <app-invoice-form (invoice-form)="onSubmit($event)" ></app-invoice-form>

</div>
  `,
  styles: [
  ]
})
export class InvoiceCreationComponent implements OnInit {

  constructor(private service: InvoiceService) { }

  ngOnInit(): void {
  }

  onSubmit(invoiceData: TInvoice) {
    this.service.create(invoiceData).subscribe({
      next: () => console.log(),
      error: (error) => console.log(error)
    })
    console.log(invoiceData);
  }
}