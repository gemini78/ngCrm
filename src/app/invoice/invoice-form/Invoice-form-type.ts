import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type TInvoiceFormType = FormGroup<{
    customer_name: FormControl;
    description: FormControl;
    status: FormControl;
    details: FormArray<FormGroup<{
        description: FormControl;
        amount: FormControl;
        quantity: FormControl;
    }>>
}>;