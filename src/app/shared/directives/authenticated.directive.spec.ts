import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { AuthenticatedDirective } from "./authenticated.directive";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'app-test',
    template: `<h1 *authenticated="true">Title</h1>`,
    styles: []
})
class TestComponent { }

describe("AuthenticatedDirective", () => {
    const fakeAuthService = {
        authStatus$: new BehaviorSubject(false)
    }

    it("should show element only if authStatus$ matches", async () => {

        await TestBed.configureTestingModule({
            declarations: [AuthenticatedDirective, TestComponent],
            providers: [{
                provide: AuthService,
                useValue: fakeAuthService
            }]

        }).compileComponents();

        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();

        fakeAuthService.authStatus$.next(false);
        expect(fixture.nativeElement.querySelector('h1')).toBeNull();

        fakeAuthService.authStatus$.next(true);
        expect(fixture.nativeElement.querySelector('h1')).not.toBeNull();

    })

})