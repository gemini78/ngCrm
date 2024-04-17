import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InvoiceFormTotalsComponent } from "./invoice-form-totals.component";
import localFr from '@angular/common/locales/fr';
import { Component } from "@angular/core";
import { registerLocaleData } from "@angular/common";

/* @Component({
    selector: 'app-test',
    template: `<app-invoice-form-totals [total]="100"></app-invoice-form-totals>`,
    styles: []
})
class TestComponent { } */

registerLocaleData(localFr);

describe("InvoiceFormTotalsComponent", () => {
    let fixture: ComponentFixture<InvoiceFormTotalsComponent>;
    let component: InvoiceFormTotalsComponent;
    it("should display total, totalTVA, totalTTC", async () => {
        await TestBed.configureTestingModule({
            declarations: [InvoiceFormTotalsComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(InvoiceFormTotalsComponent);
        component = fixture.componentInstance;
        component.total = 100;

        fixture.detectChanges();
        let divTotal: HTMLDivElement = fixture.nativeElement.querySelector('#total_ht');
        let divTotalTVA: HTMLDivElement = fixture.nativeElement.querySelector('#total_tva');
        let divTotalTTC: HTMLDivElement = fixture.nativeElement.querySelector('#total_ttc');
        //console.log(divTotal);

        console.log(divTotalTVA);

        //existing
        expect(divTotal).toBeTruthy();
        expect(divTotalTVA).toBeTruthy();
        expect(divTotalTTC).toBeTruthy();

        //calculs
        expect(divTotal.innerHTML).toContain('100,00&nbsp;€')
        expect(divTotalTVA.innerHTML).toContain('20,00&nbsp;€')
        expect(divTotalTTC.innerHTML).toContain('120,00&nbsp;€')
    })
})