import { Component, Inject, InjectionToken, Input, OnInit } from '@angular/core';

export const TAXE_RATE_TOKEN = new InjectionToken('Le taux de TVA applicable', {
  providedIn: 'root',
  factory() {
    return 0.2
  }
})

@Component({
  selector: 'app-invoice-form-totals',
  template: `
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
  `,
  styles: [
  ]
})
export class InvoiceFormTotalsComponent {
  @Input()
  total = 0;

  constructor(@Inject(TAXE_RATE_TOKEN) private taxRate: number) { }

  get totalTVA(): number {
    return this.total * this.taxRate;
  }

  get totalTTC(): number {
    return (this.total + this.totalTVA);
  }

}
