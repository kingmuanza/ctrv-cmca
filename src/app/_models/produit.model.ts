import { ProduitCategorie } from "./produit.categorie.model";
import { ProduitType } from "./produit.type.model";

export class Produit {
    id = 'Produit'.toUpperCase() + new Date().getTime();
    code = '';
    nom = '';
    description = '';
    prix = 0;
    prixCategorie = {
        ONG: 0,
        Public: 0,
        Privee: 0,
    }
    type = new ProduitType();
    categorie = new ProduitCategorie();
}