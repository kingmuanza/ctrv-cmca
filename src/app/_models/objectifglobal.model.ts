
export class Objectifglobal {
    id = '';
    dateDebut = new Date();
    dateFin = new Date();
    annee = 2022;
    montant = 0;

    constructor() {
        this.dateDebut = new Date(this.dateDebut.getFullYear() + '-01-01');
        this.dateFin = new Date(this.dateFin.getFullYear() + '-12-31');
    }
}