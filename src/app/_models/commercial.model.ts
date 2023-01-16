import { Departement } from "./departement.model";

export class Commercial {
    id = 'Commercial'.toUpperCase() + new Date().getTime();
    code = '';
    noms = '';
    prenoms = '';
    description = '';
    tel = '';
    email = '';
    departement: Departement | undefined;
}