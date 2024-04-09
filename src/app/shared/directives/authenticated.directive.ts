import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Directive({
    selector: "[authenticated]"
})
export class AuthenticatedDiective {

    @Input('authenticated')
    value = true;

    subscription?: Subscription

    constructor(private template: TemplateRef<HTMLElement>, private container: ViewContainerRef, private auth: AuthService) { }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    ngOnInit() {
        this.subscription = this.auth.authStatus$.subscribe(status => {
            this.container.clear();
            if (status === this.value) {
                this.container.createEmbeddedView(this.template);
            }
        })
    }
}