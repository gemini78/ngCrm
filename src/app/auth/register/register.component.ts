import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService, TRegisterData } from '../auth.service';

@Component({
  selector: 'app-register',
  template: `
  <div class="bg-light rounded p-3">
      <h1>Créer un compte sur NgCRM !</h1>
      <p>
        Vous pourrez alors gérer facilement vos factures en tant que Freelance !
      </p>
      <form [formGroup]="registerForm" (submit)="onSubmit()">
        <div class="alert bg-warning" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <div>
          <label class="mb-1" for="name">Nom d'utilisateur</label>
          <input
            autocomplete=off
            formControlName="name"
            [class.is-invalid]="name.invalid && name.touched"
            [class.is-valid]="name.valid && name.touched"
            type="text"
            placeholder="Votre nom d'utilisateur"
            name="name"
            id="name"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">Le nom d'utilisateur est obligatoire et doit faire plus de 4 caractères</p>
        </div>
        <div>
          <label class="mb-1" for="email">Adresse email</label>
          <input
            autocomplete=off
            formControlName="email"
            [class.is-invalid]="email.invalid && email.touched"
            [class.is-valid]="email.valid && email.touched"
            type="email"
            placeholder="Adresse email de connexion"
            name="email"
            id="email"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback" *ngIf="email.hasError('required') || email.hasError('email')">L'adresse email doit être valide</p>
          <p class="text-info" *ngIf="email.pending">
            <span class="spinner-boder spinner-boder-sm">Chargement ...</span>
          </p>
          <p class="invalid-feedback" *ngIf="email.hasError('uniqueEmail')">Cette adresse est déjà utilisée</p>
        </div>
        <div>
          <label class="mb-1" for="password">Mot de passe</label>
          <input
            autocomplete=off
            formControlName="password"
            [class.is-invalid]="password.invalid && password.touched"
            [class.is-valid]="password.valid && password.touched"
            type="password"
            placeholder="Votre mot de passe"
            name="password"
            id="password"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">
            Le mot de passe est obligatoire, doit faire plus de 4 caractères minimum et
            contenir au moins un chiffre
          </p>
        </div>
        <div>
          <label class="mb-1" for="confirmPassword">Confirmation</label>
          <input
            autocomplete=off
            formControlName="confirmPassword"
            [class.is-invalid]="(confirmPassword.invalid || registerForm.hasError('confirm')) && confirmPassword.touched"
            [class.is-valid]="confirmPassword.valid && confirmPassword.touched"
            type="password"
            placeholder="Confirmez votre mot de passe"
            name="confirmPassword"
            id="confirmPassword"
            class="mb-3 form-control"
          />

          <p class="invalid-feedback" *ngIf="confirmPassword.hasError('required')">
            La confirmation du mot de passe est obligatoire
          </p>
          <p class="invalid-feedback" *ngIf="registerForm.hasError('confirm') && !confirmPassword.hasError('required')">
            La confirmation ne correspond pas au mot de passe
          </p>
        </div>
        <button class="btn btn-success">Créer mon compte NgCRM !</button>
      </form>
    </div>
  `,
  styles: [
  ]
})
export class RegisterComponent implements OnInit {
  errorMessage = '';
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email], [this.uniqeEmailAsyncValidator.bind(this)]],
    name: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/\d+/)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: confirmPasswordValidator
  })

  onSubmit() {

    if (this.registerForm.invalid) {
      return;
    }

    const data: TRegisterData = {
      name: this.name.value!,
      email: this.email.value!,
      password: this.password.value!,
    }

    this.auth.register(data)
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (error) => this.errorMessage = "Un problème est survenu, merci de réssayer plus tard"
      })
  }

  constructor(private router: Router, private auth: AuthService, private fb: FormBuilder) { }

  uniqeEmailAsyncValidator(control: AbstractControl) {
    return this.auth.exists(control.value).pipe(
      map(exists => exists ? { uniqueEmail: true } : null)
    );
  }

  ngOnInit(): void {
  }

  get name() { return this.registerForm.controls.name; }
  get email() { return this.registerForm.controls.email; }
  get password() { return this.registerForm.controls.password; }
  get confirmPassword() { return this.registerForm.controls.confirmPassword; }
}

const confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password?.value === confirmPassword?.value) {
    return null;
  }
  return {
    confirm: true
  };
}