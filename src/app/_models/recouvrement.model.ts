
import { Proforma } from "./proforma.model";
import { Utilisateur } from "./utilisateur.model";

export class Recouvrement {

    id = 'Recouvrement'.toUpperCase() + new Date().getTime();
    proforma = new Proforma();
    date =  new Date();
    montant = 0;
    validateur: Utilisateur | undefined;

    constructor() {
    }

}
