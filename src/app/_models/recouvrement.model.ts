
import { Proforma } from "./proforma.model";

export class Recouvrement {

    id = 'Recouvrement'.toUpperCase() + new Date().getTime();
    proforma = new Proforma();
    date =  new Date();
    montant = 0;

    constructor() {
    }

}
