import { Commercial } from "./commercial.model";

export class Utilisateur {
    id = 'Utilisateur'.toUpperCase() + new Date().getTime();    
    login = '';
    passe = '';
    profil = '';
    actif = true;
    dateCreation = new Date();
    commercial: Commercial | undefined;
    doitChangerPasse = true;

    static getLibelleProfil(profil: string): string {

        if (profil === 'COMMERCIAL') {
            return 'Commercial';
        }
        return profil
    }
}