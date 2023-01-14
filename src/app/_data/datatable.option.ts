
export const DatatablesOptions = {
    pagingType: 'full_numbers',
    dom: 'Bfrtip',
    order: [[0, 'desc']],
    buttons: [
        {
            extend: 'copyHtml5',
            title: 'Liste des zones',
            className: 'btn btn-primary'
        },
        {
            extend: 'excelHtml5',
            title: 'Liste des zones',
            className: 'btn btn-primary'
        },
        {
            extend: 'pdfHtml5',
            title: 'Liste des zones',
            download: 'open',
            className: 'btn btn-primary'
        },
        {
            extend: 'print',
            message: 'Liste des zones',
            autoPrint: false,
            className: 'btn btn-primary'
        }
    ],
};