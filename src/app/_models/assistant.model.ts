import { Departement } from "./departement.model";

export class Assistant {
    id = 'Assistant'.toUpperCase() + new Date().getTime();
    code = '';
    noms = '';
    prenoms = '';
    description = '';
    tel = '';
    email = '';
    departement: Departement | undefined;
}