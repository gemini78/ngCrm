import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { TInvoice } from '../invoice';

@Component({
  selector: 'app-invoices-list',
  template: `
    <div class="bg-light p-3 rounded">
  <h1>Liste de vos factures</h1>
  <hr />
  <table class="table table-hover">
    <thead>
      <tr>
        <th>Id.</th>
        <th>Description</th>
        <th>Date</th>
        <th class="text-center">Total HT</th>
        <th class="text-center">Statut</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let invoice of invoices">
        <td>{{invoice.id}}</td>
        <td>{{invoice.description}}</td>
        <td>{{invoice.created_at | date : 'dd/MM/yyyy'}}</td>
        <td class="text-center">{{ invoice.total | currency: 'EUR':'symbol': undefined : 'fr' }}</td>
        <td class="text-center">
          <app-invoice-status [status]="invoice.status"></app-invoice-status>
        </td>
        <td>
          <a routerLink="/invoices/{{invoice.id}}" class="btn btn-sm btn-primary">
            Modifier
          </a>
          <button (click)="onDelete(invoice.id!)" class="btn btn-sm ms-1 btn-danger">Supprimer</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  `,
  styles: [
  ]
})
export class InvoicesListComponent implements OnInit {
  invoices: TInvoice[] = [];

  constructor(private service: InvoiceService) { }

  ngOnInit(): void {
    this.service.findAll().subscribe(invoices => { this.invoices = invoices })
  }

  onDelete(id: number) { }
}
