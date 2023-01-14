import { Assistant } from "./assistant.model";
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
    assistant: Assistant | undefined;

    static getLibelleProfil(profil: string): string {

        if (profil === 'COMMERCIAL') {
            return 'Commercial';
        }
        if (profil === 'Assistant'.toUpperCase()) {
            return 'Assistant';
        }
        return profil
    }
}