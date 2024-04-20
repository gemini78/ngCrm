import { Component, Input, OnInit } from '@angular/core';
import { TInvoiceStatus } from '../invoice';

@Component({
  selector: 'app-invoice-status',
  template: `
    <span class="badge {{ badgeClass }}">{{ statusLabel }}</span>
  `,
  styles: [
  ]
})
export class InvoiceStatusComponent implements OnInit {

  @Input()
  status: TInvoiceStatus = 'SENT';

  get badgeClass() {
    return this.status === "SENT" ? 'bg-info' : this.status === "PAID" ? 'bg-success' : 'bg-danger';
  }

  get statusLabel() {
    return this.status === 'SENT' ? 'Envoyée' : this.status === "PAID" ? 'Payée' : 'Annulée';
  }
  constructor() { }

  ngOnInit(): void {
  }

}
