import { Client } from "./client.model";
import { Commercial } from "./commercial.model";
import { Produit } from "./produit.model";
import { Utilisateur } from "./utilisateur.model";

export class Proforma {

    static PAYEE = 1;
    static IMPAYEE = 0;

    static VALIDEE = 1;
    static INVALIDEE = 0;

    id = 'Proforma'.toUpperCase() + new Date().getTime();
    commercial = new Commercial();
    client = new Client();
    date = new Date();
    dateValidation = new Date();
    montant = 0;
    montantValidee = 0;
    lignes = new Array<Ligne>();

    statut = 0;
    validee = 0;
    images: string[] = [];
    validateur: Utilisateur | undefined; 

    constructor() {
        this.statut = Proforma.IMPAYEE;
        this.validee = Proforma.INVALIDEE;
    }
}

export class Ligne {
    id = 'Ligne'.toUpperCase() + new Date().getTime();
    produit = new Produit();
    quantite = 1;
    debut = new Date();
    fin = new Date();
}