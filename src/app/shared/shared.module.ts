import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatedDirective } from './directives/authenticated.directive';



@NgModule({
  declarations: [AuthenticatedDirective],
  imports: [
    CommonModule
  ],
  exports: [AuthenticatedDirective]
})
export class SharedModule { }
