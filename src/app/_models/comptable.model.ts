import { Departement } from "./departement.model";

export class Comptable {
    id = 'Comptable'.toUpperCase() + new Date().getTime();
    code = '';
    noms = '';
    prenoms = '';
    description = '';
    tel = '';
    email = '';
    departement: Departement | undefined;
}