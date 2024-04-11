import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService, TOKEN_MANAGER } from "../auth.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { LocalStorageTokenManagerService } from "../../token-manager.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";

describe('RegisterComponent', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let component: RegisterComponent;
    let service: AuthService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [CommonModule,
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                SharedModule],
            providers: [AuthService, {
                provide: TOKEN_MANAGER,
                useClass: LocalStorageTokenManagerService
            }]

        }).compileComponents();

        service = TestBed.inject(AuthService);

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
    })

    it("should validate inputs", () => {
        let inputEmail: HTMLInputElement = fixture.nativeElement.querySelector('#email');
        //existing
        expect(inputEmail).toBeDefined();

        //required
        inputEmail.value = "";
        inputEmail.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.email.invalid).toBeTrue();

        //invalid
        inputEmail.value = "john";
        inputEmail.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.email.invalid).toBeTrue();

        let spyExists = spyOn(service, "exists");
        // email existing
        spyExists.and.returnValue(of(true));
        inputEmail.value = "jd@gmail.com";
        inputEmail.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.email.invalid).toBeTrue();

        // email available (not existing)
        spyExists.and.returnValue(of(false));
        inputEmail.value = "jd@gmail.com";
        inputEmail.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.email.valid).toBeTrue();


        let inputPassword: HTMLInputElement = fixture.nativeElement.querySelector('#password');
        let inputConfirmPassword: HTMLInputElement = fixture.nativeElement.querySelector('#confirmPassword');

        //existing
        expect(inputPassword).toBeDefined();
        expect(inputConfirmPassword).toBeDefined();

        // testing wrong password confirmation
        inputPassword.value = "passw0rd";
        inputConfirmPassword.value = "passw1rd";
        inputPassword.dispatchEvent(new Event("input"));
        inputConfirmPassword.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.registerForm.hasError('confirm')).toBeTrue();

        // testing good password confirmation
        inputPassword.value = "passw0rd";
        inputConfirmPassword.value = "passw0rd";
        inputPassword.dispatchEvent(new Event("input"));
        inputConfirmPassword.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.registerForm.hasError('confirm')).toBeFalse();
    })

    it("should not call authService.register if form is invalid ", () => {
        component.registerForm.patchValue({
            email: 'batman',
            password: '',
            confirmPassword: '',
            name: ''
        })
        let spyRegister = spyOn(service, "register");
        component.onSubmit()
        expect(spyRegister).not.toHaveBeenCalled();
    })

    it("should redirect to / if register succeed ", () => {

        component.registerForm.patchValue({
            email: 'jd@gmail.com',
            password: 'passw0rd',
            confirmPassword: 'passw0rd',
            name: 'John Doe'
        });

        let spyRegister = spyOn(service, "register");
        spyRegister.and.returnValue(of({}));

        let spyNavigate = spyOn(router, 'navigateByUrl');

        component.onSubmit()
        expect(spyNavigate).toHaveBeenCalledWith('/')
    })

    it("should not redirect and show an error", () => {

        component.registerForm.setValue({
            email: 'jd@gmail.com',
            password: 'passw0rd',
            confirmPassword: 'passw0rd',
            name: 'John Doe'
        });


        let spyRegister = spyOn(service, "register");
        spyRegister.and.returnValue(throwError(() => null));

        let spyNavigate = spyOn(router, 'navigateByUrl');

        component.onSubmit()
        expect(spyNavigate).not.toHaveBeenCalled();

        // alert exist
        let alert: HTMLDivElement = fixture.nativeElement.querySelector('.alert.bg-warning');
        expect(alert).toBeDefined();
    })
})