import { ProduitType } from "./produit.type.model";

export class ProduitCategorie {
    id = 'ProduitCategorie'.toUpperCase() + new Date().getTime();
    code = '';
    nom = '';
    description = '';
    type = new ProduitType();
}