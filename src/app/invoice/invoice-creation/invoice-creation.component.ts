import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-creation',
  template: `
    <div class="bg-light p-5 rounded">
  <h1>Créer une nouvelle facture</h1>
  <p class="alert bg-info text-white">
    Remplissez les informations de la facture afin de la retrouver dans
    votre liste plus tard !
  </p>

  <form>
    <div class="row">
      <div class="col">
        <label for="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Description de la facture"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">La description est obligatoire !</p>
      </div>
      <div class="col">
        <label for="customer_name">Client</label>
        <input
          type="text"
          id="customer_name"
          name="customer_name"
          placeholder="Nom du client / la société"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">Le client est obligatoire !</p>
      </div>
      <div class="col">
        <label for="status">Statut</label>
        <select name="status" id="status" class="form-control mb-3">
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELED">Annulée</option>
        </select>
      </div>
    </div>

    <hr />

    <h3>Détails de la facture</h3>
    <div class="alert bg-warning text-white">
      <p>Vous devez ajouter des détails à votre facture</p>
      <button class="btn btn-sm btn-outline-light">
        + Ajouter ma première ligne
      </button>
    </div>
    <section>
      <div class="detail-row">
        <div class="row mb-3">
          <div class="col-7">
            <input
              type="text"
              placeholder="Description"
              class="form-control"
            />
            <p class="invalid-feedback">La description est obligatoire</p>
          </div>
          <div class="col-2">
            <input
              type="number"
              placeholder="Montant"
              class="form-control"
            />
            <p class="invalid-feedback">Le montant est obligatoire</p>
          </div>
          <div class="col-2">
            <input
              type="number"
              placeholder="Quantité"
              class="form-control"
            />
            <p class="invalid-feedback">La quantité est obligatoire</p>
          </div>
          <div class="col-1">
            <button
              type="button"
              class="btn w-auto d-block btn-sm btn-danger"
            >
              X
            </button>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" type="button">
        + Ajouter une ligne
      </button>
    </section>

    <hr />

    <div class="row">
      <div class="col-6 text-end">Total HT :</div>
      <div class="col" id="total_ht">1 800,00 €</div>
    </div>

    <div class="row">
      <div class="col-6 text-end">Total TVA :</div>
      <div class="col" id="total_tva">200,00 €</div>
    </div>
    <div class="row fw-bold">
      <div class="col-6 text-end">Total TTC :</div>
      <div class="col" id="total_ttc">2 000,00 €</div>
    </div>

    <button class="mt-3 w-sm-auto btn btn-success" id="submit">
      Enregistrer
    </button>
  </form>
</div>
  `,
  styles: [
  ]
})
export class InvoiceCreationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
