import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  template: `
  <div class="bg-light rounded p-3">
      <h1>Créer un compte sur NgCRM !</h1>
      <p>
        Vous pourrez alors gérer facilement vos factures en tant que Freelance !
      </p>
      <form>
        <div>
          <label class="mb-1" for="name">Nom d'utilisateur</label>
          <input
            type="text"
            placeholder="Votre nom d'utilisateur"
            name="name"
            id="name"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">Le nom d'utilisateur est obligatoire</p>
        </div>
        <div>
          <label class="mb-1" for="email">Adresse email</label>
          <input
            type="email"
            placeholder="Adresse email de connexion"
            name="email"
            id="email"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">L'adresse email doit être valide</p>
        </div>
        <div>
          <label class="mb-1" for="password">Mot de passe</label>
          <input
            type="password"
            placeholder="Votre mot de passe"
            name="password"
            id="password"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">
            Le mot de passe est obligatoire, doit faire 8 caractères minimum et
            contenir au moins un chiffre
          </p>
        </div>
        <div>
          <label class="mb-1" for="confirmPassword">Confirmation</label>
          <input
            type="password"
            placeholder="Confirmez votre mot de passe"
            name="confirmPassword"
            id="confirmPassword"
            class="mb-3 form-control"
          />

          <p class="invalid-feedback">
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

  constructor() { }

  ngOnInit(): void {
  }

}
