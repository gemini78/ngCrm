import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { InvoiceCreationComponent } from './invoice-creation/invoice-creation.component';
import { InvoiceEditionComponent } from './invoice-edition/invoice-edition.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import localFr from '@angular/common/locales/fr';

registerLocaleData(localFr);

const routes: Routes = [
  { path: '', component: InvoicesListComponent },
  { path: 'create', component: InvoiceCreationComponent },
  { path: 'id', component: InvoiceEditionComponent },
];

@NgModule({
  declarations: [
    InvoiceCreationComponent,
    InvoiceEditionComponent,
    InvoicesListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class InvoiceModule { }
