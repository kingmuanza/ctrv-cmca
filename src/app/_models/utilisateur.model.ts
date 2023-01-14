import { Assistant } from "./assistant.model";
import { Commercial } from "./commercial.model";
import { Comptable } from "./comptable.model";

export class Utilisateur {
    id = 'Utilisateur'.toUpperCase() + new Date().getTime();
    login = '';
    passe = '';
    profil = '';
    actif = true;
    dateCreation = new Date();
    doitChangerPasse = true;
    commercial: Commercial | undefined;
    assistant: Assistant | undefined;
    comptable: Comptable | undefined;

    static getLibelleProfil(profil: string): string {

        if (profil === 'COMMERCIAL') {
            return 'Commercial';
        }
        if (profil === 'Assistant'.toUpperCase()) {
            return 'Assistant';
        }
        if (profil === 'Comptable'.toUpperCase()) {
            return 'Comptable';
        }
        return profil
    }
}