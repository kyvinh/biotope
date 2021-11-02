export default (req, res) => res.json([
    {
        title: "Octroi d'écochèques au personnel des milieux d'accueil de la petite enfance communaux sur base des prestations de l'année 2021",
        author: "Conseil Communal",
        arguments: [
            {
                text: "Les employés communaux devraient jouir des mêmes avantages que dans le privé. L'octroi d'écochèques permettra de balancer cette inégalité salariale.",
                author: {
                    displayName: "Conseil Communal"
                }
            },
            {
                text: "Non car leurs revendications n'ont pas été établies de manière démocratique",
                author: "Kevin",
                sources: [
                    {
                        type: "vote-freetext",
                        title: "En tant que fonctionnaire communal, quelles sont vos attentes afin de renforcer le service public,",
                        ballek: 26,
                        answers: ["Montrer l'exemple en imposant 20h par semaine, payé plein-temps; conformément aux revendications de DDT.", "+500 euros par mois.", "+200 euros par mois."]
                    },
                    {
                        type: "vote-freetext",
                        constituents: [ "Cercle des imposables d'Etterbeek"],
                        title: "Faut-il allouer plus de budget pour le personnel communal d'Etterbeek? Si oui, à quelle hauteur ou équivalent?"
                    }
                ]
            }
        ]
    },
    {
        title: "Renoncer au Covid Safe Ticket dans l'HoReCa",
        author: {
            displayName: "~voisin anonyme~"
        }
    },
    {
        title: "Soutien pour la directrice faisant-fonction de Claire-Joie",
        author: {
            displayName: "~parent anonyme 1~"
        },
        status: "En cours de vote et débat",
        constituents: [
            "Cercle des parents de Claire-Joie", "Cercle des enseignants et personnes encadrant et administratif de Claire-Joie"
        ],
        target: {
            deadline: "6 months",
            text: "- Soumettre une lettre co-signée par la majorité des parents de Claire-Joie constatant le manque de directrice nommée (ou valorisée comme telle) à l'école ?fondamentale? Claire-Joie.\\n- Soumettre l'évaluation de Mme Van Roy comme directrice faisant-fonction."
        },
        arguments: [
            {
                author: {
                    displayName: "~parent anonyme 2~"
                },
                text: "Tous les parents de Claire-Joie souhaite une stabilité pour leurs enfants scolarisés à Etterbeek et ils soutiennent en majorité la directrice faisant-fonction Mme Van Roy.",
                sources: [
                    {
                        type: "vote-yesno",
                        constituents: ["Cercle des imposables d'Etterbeek"],
                        title: "Est-ce que la directrice faisant-fonction de Claire-Joie devrait avoir un titre définitif, valorisé comme directrice?",
                        inFavor: 152,
                        against: 24,
                        ballek: 256
                    }
                ]
            }
        ]
    },
    {
        title: "Création d'une plateforme d'e-commerce (style Amazon) et de livraison (style DPD) pour tous les commerces Etterbeekois et ses riverains.",
        author: {
            displayName: "Benjamin"
        },
    }
]);