import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService, TOKEN_MANAGER } from "../auth.service";
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { LocalStorageTokenManagerService } from "../token-manager.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { Router } from "@angular/router";
import { LoginComponent } from "./login.component";
import { of, throwError } from "rxjs";

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let service: AuthService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
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

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);

        fixture.detectChanges();
    })

    it("should validate inputs", () => {
        let inputEmail: HTMLInputElement = fixture.nativeElement.querySelector('#email');
        //existing
        expect(inputEmail).toBeTruthy();

        //testing required email
        inputEmail.value = "";
        inputEmail.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.email.invalid).toBeTrue();

        // bad email
        inputEmail.value = "john";
        inputEmail.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.email.invalid).toBeTrue();

        // good email
        inputEmail.value = "jd2@gmail.com";
        inputEmail.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.email.valid).toBeTrue();

        let inputPassword: HTMLInputElement = fixture.nativeElement.querySelector('#password');
        //existing
        expect(inputPassword).toBeTruthy();

        //testing required password
        inputPassword.value = "";
        inputPassword.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.password.invalid).toBeTrue();

        //testing too short password
        inputPassword.value = "pas0";
        inputPassword.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.password.invalid).toBeTrue();

        //testing password without digit
        inputPassword.value = "password";
        inputPassword.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.password.invalid).toBeTrue();

        //testing good password
        inputPassword.value = "passw0rd";
        inputPassword.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.password.valid).toBeTrue();
    })

    it("should redirect to / if login succeed ", () => {

        component.loginForm.setValue({
            email: 'john.doe@gmail.com',
            password: 'passw0rd'
        })

        let spyLogin = spyOn(service, "login");
        spyLogin.and.returnValue(of('TOKEN'));
        let spyNavigate = spyOn(router, 'navigateByUrl');
        component.onSubmit();
        expect(spyNavigate).toHaveBeenCalledWith('/');
    })

    it("should not redirect and show error an error", async () => {
        component.loginForm.setValue({
            email: 'john.doe@gmail.com',
            password: 'passw0rd'
        })

        let spyLogin = spyOn(service, "login");
        spyLogin.and.returnValue(throwError(() => {
            return {
                error: {
                    message: 'MOCK_MESSAGE'
                }
            }
        }));
        let spyNavigate = spyOn(router, 'navigateByUrl');
        component.onSubmit();
        fixture.detectChanges()
        expect(spyNavigate).not.toHaveBeenCalled();

        // alert exist
        let alert: HTMLElement = fixture.nativeElement.querySelector('.alert.bg-warning');
        expect(alert).toBeDefined();

    })
})