export class Produit {
    id = 'Produit'.toUpperCase() + new Date().getTime();
    code = '';
    nom = '';
    description = '';
    prix = 0;
}