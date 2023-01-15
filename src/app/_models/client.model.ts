import { ClientPersonne } from "./client.personne.model";

export class Client {
    id = 'Client'.toUpperCase() + new Date().getTime();
    code = '';
    nom = '';
    noms = '';
    prenoms = '';
    description = '';
    tel = '';
    email = '';
    secteur = '';
    categorie = '';
    personnes = new Array<ClientPersonne>();
}