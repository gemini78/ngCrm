import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InvoiceCreationComponent } from "./invoice-creation.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { InvoiceService } from "../invoice.service";
import { InvoiceFormComponent } from "../invoice-form/invoice-form.component";
import { InvoiceFormGeneralComponent } from "../invoice-form/invoice-form-general.component";
import { InvoiceFormDetailsComponent } from "../invoice-form/invoice-form-details.component";
import { InvoiceFormTotalsComponent } from "../invoice-form/invoice-form-totals.component";
import { AuthService, TOKEN_MANAGER } from "src/app/auth/auth.service";
import { ITokenManager } from "src/app/token-manager";
import { Observable, of, throwError } from "rxjs";
import { TInvoice } from "../invoice";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

let storedToken: string | null = null;
let service: InvoiceService;
let router: Router;

const fakeTokenManager: ITokenManager = {
    storeToken: function (token: string): Observable<string> {
        storedToken = token;
        return of(token);
    },
    loadToken: function (): Observable<string | null> {
        return of(storedToken);
    },
    removeToken: function (): Observable<boolean> {
        storedToken = null;
        return of(true);
    }
}
describe("InvoiceCreationComponent", () => {
    let fixture: ComponentFixture<InvoiceCreationComponent>;
    let component: InvoiceCreationComponent;

    it("should redirect to ../  if invoice creation succeed", async () => {
        await TestBed.configureTestingModule({
            declarations: [InvoiceCreationComponent,
                InvoiceFormComponent,
                InvoiceFormGeneralComponent,
                InvoiceFormDetailsComponent,
                InvoiceFormTotalsComponent],
            imports: [ReactiveFormsModule, RouterTestingModule,
                HttpClientTestingModule],
            providers: [InvoiceService, AuthService, {
                provide: TOKEN_MANAGER,
                useValue: fakeTokenManager
            }]
        }).compileComponents();

        fixture = TestBed.createComponent(InvoiceCreationComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(InvoiceService);
        router = TestBed.inject(Router);
        fixture.detectChanges();
        const spyCreate = spyOn(service, "create");

        const datasInvoice: TInvoice = {
            description: "MOCK_DESCRIPTION",
            customer_name: "MOCK_CUSTOMER",
            status: 'PAID',
            details: [
                { amount: 300, quantity: 2, description: 'MOCK_DESCRIPTION' }
            ]
        }
        spyCreate.and.returnValue(of(datasInvoice));

        let submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
        let initialAddButton: HTMLButtonElement = fixture.nativeElement.querySelector('#initial-add-button');
        let inputDescription: HTMLInputElement = fixture.nativeElement.querySelector('#description');
        let inputCustomerName: HTMLInputElement = fixture.nativeElement.querySelector('#customer_name');
        let inputStatus: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
        fixture.detectChanges();

        //existing
        expect(submitButton).toBeTruthy();
        expect(initialAddButton).toBeTruthy();
        expect(inputDescription).toBeTruthy();
        expect(inputCustomerName).toBeTruthy();
        expect(inputStatus).toBeTruthy();

        // values
        inputDescription.value = "MOCK_DESCRIPTION";
        inputDescription.dispatchEvent(new Event("input"));

        inputCustomerName.value = "MOCK_CUSTOMER";
        inputCustomerName.dispatchEvent(new Event("input"));
        inputStatus.value = 'PAID';
        inputStatus.dispatchEvent(new Event('change'));

        // add line detail
        initialAddButton.click();
        fixture.detectChanges();

        let amount0: HTMLInputElement = fixture.nativeElement.querySelector('#amount_0');
        let description0: HTMLInputElement = fixture.nativeElement.querySelector('#description_0');
        let quantity0: HTMLInputElement = fixture.nativeElement.querySelector('#quantity_0');

        //existing
        expect(amount0).toBeTruthy();
        expect(description0).toBeTruthy();
        expect(quantity0).toBeTruthy();

        let detailsRow = fixture.debugElement.queryAll(By.css('.detail-row'));
        expect(detailsRow.length).toBe(1);

        fixture.detectChanges();

        //value
        amount0.value = "300";
        amount0.dispatchEvent(new Event("input"));

        description0.value = "MOCK_DESCRIPTION";
        description0.dispatchEvent(new Event("input"));

        quantity0.value = '2';
        quantity0.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        let spyNavigate = spyOn(router, 'navigate');
        submitButton.click();
        fixture.detectChanges();
        expect(spyNavigate).toHaveBeenCalledWith(['../'], {
            relativeTo: TestBed.inject(ActivatedRoute)
        });
        // alert not exist
        let alert: HTMLElement = fixture.nativeElement.querySelector('.alert.bg-warning');
        expect(alert).not.toBeTruthy();
    })

    it("should not redirect and display message if invoice creation failed", async () => {
        await TestBed.configureTestingModule({
            declarations: [InvoiceCreationComponent,
                InvoiceFormComponent,
                InvoiceFormGeneralComponent,
                InvoiceFormDetailsComponent,
                InvoiceFormTotalsComponent],
            imports: [ReactiveFormsModule, RouterTestingModule,
                HttpClientTestingModule],
            providers: [InvoiceService, AuthService, {
                provide: TOKEN_MANAGER,
                useValue: fakeTokenManager
            }]
        }).compileComponents();

        fixture = TestBed.createComponent(InvoiceCreationComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(InvoiceService);
        router = TestBed.inject(Router);
        fixture.detectChanges();
        const spyCreate = spyOn(service, "create");
        spyCreate.and.returnValue(throwError(() => of(null)));

        let submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
        let initialAddButton: HTMLButtonElement = fixture.nativeElement.querySelector('#initial-add-button');
        let inputDescription: HTMLInputElement = fixture.nativeElement.querySelector('#description');
        let inputCustomerName: HTMLInputElement = fixture.nativeElement.querySelector('#customer_name');
        let inputStatus: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
        fixture.detectChanges();

        //existing
        expect(submitButton).toBeTruthy();
        expect(initialAddButton).toBeTruthy();
        expect(inputDescription).toBeTruthy();
        expect(inputCustomerName).toBeTruthy();
        expect(inputStatus).toBeTruthy();

        // values
        inputDescription.value = "MOCK_DESCRIPTION";
        inputDescription.dispatchEvent(new Event("input"));

        inputCustomerName.value = "MOCK_CUSTOMER";
        inputCustomerName.dispatchEvent(new Event("input"));
        inputStatus.value = 'PAID';
        inputStatus.dispatchEvent(new Event('change'));

        // add line detail
        initialAddButton.click();
        fixture.detectChanges();

        let amount0: HTMLInputElement = fixture.nativeElement.querySelector('#amount_0');
        let description0: HTMLInputElement = fixture.nativeElement.querySelector('#description_0');
        let quantity0: HTMLInputElement = fixture.nativeElement.querySelector('#quantity_0');

        //existing
        expect(amount0).toBeTruthy();
        expect(description0).toBeTruthy();
        expect(quantity0).toBeTruthy();

        let detailsRow = fixture.debugElement.queryAll(By.css('.detail-row'));
        expect(detailsRow.length).toBe(1);

        fixture.detectChanges();

        //value
        amount0.value = "300";
        amount0.dispatchEvent(new Event("input"));

        description0.value = "MOCK_DESCRIPTION";
        description0.dispatchEvent(new Event("input"));

        quantity0.value = '2';
        quantity0.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        let spyNavigate = spyOn(router, 'navigate');
        submitButton.click();
        fixture.detectChanges();
        expect(spyNavigate).not.toHaveBeenCalled();

        // alert exist
        let alert: HTMLElement = fixture.nativeElement.querySelector('.alert.bg-warning');
        expect(alert).toBeTruthy();
    })
})