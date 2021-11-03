// noinspection JSUnusedGlobalSymbols

export default (req, res) => res.json([
    {
        type: "vote-freetext",
        author: "Conseil Communal",
        constituents: ["Cercle des fonctionnaires (tout le personnel) d'Etterbeek"],
        title: "En tant que fonctionnaire communal, quelles sont vos attentes salariales?",
        text: "Octroi d'écochèques au personnel des milieux d'accueil de la petite enfance communaux sur base des prestations de l'année 2021. Source, ... " +
            "Les employés communaux devraient jouir des mêmes avantages que dans le privé. L'octroi d'écochèques permettra de balancer cette inégalité salariale.",
        expiration: "3 months",
        ballek: 26,
        answers: [
            {
                text: "20h par semaine, payé plein-temps; conformément aux revendications de DDT."
            }, {
                text: "+500 euros par mois."
            }
        ]
    },
    {
        type: "vote-freetext",
        constituents: [ "Cercle des imposables d'Etterbeek"],
        title: "Faut-il allouer plus de budget pour le personnel communal d'Etterbeek? Si oui, à quelle hauteur ou équivalent?",
        arguments: [
            {
                text: "Non car leurs revendications n'ont pas été établies de manière démocratique",
                author: "Kevin"
            },
            {
                text: "La question est idiote car le budget n'est pas disponible.",
                author: "Kevin"
            },
        ],
        inFavor: 152,
        against: 24,
        ballek: 256
    },
    {
        type: "vote-yesno-freetext",
        constituents: ["Cercle des parents de Claire-Joie", "Cercle des enseignants et personnes encadrant et administratif de Claire-Joie"],
        author: "APCJ",
        title: "Est-ce que la directrice faisant-fonction de Claire-Joie devrait avoir un titre définitif, valorisé comme directrice?",
        inFavor: 152,
        against: 24,
        ballek: 256,
        arguments: [
            {
                text: "L'ACPJ est concernée par le manque de stabilité dans les fonctions directrices.\\n" +
                    "Target: \\n- Soumettre une lettre co-signée par la majorité des parents de Claire-Joie constatant le manque de directrice nommée (ou valorisée comme telle) à l'école ?fondamentale? Claire-Joie.\\n- Soumettre l'évaluation de Mme Van Roy comme directrice faisant-fonction.",
                author: "APCJ"
            }
        ]
    },
    {
        type: "vote-yesno-freetext",
        title: "Ne pas imposer le Covid Safe Ticket dans l'HoReCa",
        constituents: ["Cercle des imposables d'Etterbeek"],
        author: "~voisin anonyme~"
    },
    {
        type: "vote-yesno-freetext",
        title: "Création d'une plateforme d'e-commerce (style Amazon) et de livraison (style DPD) pour tous les commerces Etterbeekois et ses riverains.",
        constituents: ["Cercle des imposables d'Etterbeek"],
        author: "Benjamin (Cercle Terlinden)"
    }
]);