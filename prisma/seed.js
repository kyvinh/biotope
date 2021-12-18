const {PrismaClient, PossibleAnswerType, QuestionType} = require('@prisma/client')
const prisma = new PrismaClient()

// https://www.prisma.io/docs/guides/database/seed-database#integrated-seeding-with-prisma-migrate

async function main() {

    const admin = await prisma.user.upsert({
        where: { email: 'kyvinh@gmail.com' },
        update: {},
        create: {
            name: 'Ky Vinh',
            email: 'kyvinh@gmail.com',
        }
    })
    const unknown = await prisma.user.upsert({
        where: { email: 'unknown@biotope.be' },
        update: {},
        create: {
            name: 'Anonymous 1',
            email: 'unknown@biotope.be',
        }
    })
    const cercleBx = await prisma.cercle.upsert({
        where: { name: 'bx' },
        update: {},
        create: {
            name: 'bx',
            contact: 'Contact owner by mail...',
            creatorId: admin.id,
            private: false,
        },
    })
    const q1name = 'Comment jugez-vous la propreté des rues?';
    const q1 = await prisma.question.upsert({
        where: { cercleId_name: { name: q1name , cercleId: cercleBx.id}},
        update: {},
        create: {
            name: q1name,
            type: QuestionType.DYNAMIC,
            description: 'Bonjour, ce questionnaire sonde les habitants de Bruxelles par rapport à la propreté publique. Comment estimez-vous la propreté des rues dans Bruxelles en général?',
            creatorId: admin.id,
            cercleId: cercleBx.id
        }
    })
    const q2name = 'Comment jugez-vous la mobilité dans Bruxelles et ses 19 communes?';
    const q2 = await prisma.question.upsert({
        where: { cercleId_name: { name: q2name , cercleId: cercleBx.id}},
        update: {},
        create: {
            name: q2name,
            type: QuestionType.DYNAMIC,
            description: 'Comment trouvez-vous les différentes options de mobilité dans notre capitale? Que ce soit pour vos déplacements privés ou professionnels?',
            creatorId: admin.id,
            cercleId: cercleBx.id
        }
    })
    const cercleTerlinden = await prisma.cercle.upsert({
        where: { name: 'terlinden-1040' },
        update: {},
        create: {
            name: 'terlinden-1040',
            contact: 'Hail me in the street',
            creatorId: admin.id,
            private: true,
            headerPic: 'felixterlinden-plaque',
            description: 'Ce biotope rassemble tous les voisins résidant dans la rue Félix Terlinden et des rues avoisinantes.'
        },
    })
    const terlindenQ1name = 'Comment jugez-vous la propreté de la rue Félix Terlinden?';
    const terlindenQ1 = await prisma.question.upsert({
        where: { cercleId_name: { name: terlindenQ1name , cercleId: cercleTerlinden.id}},
        update: {},
        create: {
            name: terlindenQ1name,
            type: QuestionType.DYNAMIC,
            description: "Bonjour, ce questionnaire sonde les habitants de la rue Félix Terlinden par rapport à la propreté publique. (MARKDOWN?) Notre rue mérite une attention particulière car elle est à proximité de plusieurs centres d'activité: La Chasse, Jourdan, Flagey.",
            creatorId: admin.id,
            cercleId: cercleTerlinden.id
        }
    })

    const terlindenQ2name = 'Comment améliorer notre rue et les rues avoisinantes en terme de mobilité et d\'attractivité?';
    const terlindenQ2 = await prisma.question.upsert({
        where: { cercleId_name: { name: terlindenQ2name , cercleId: cercleTerlinden.id}},
        update: {},
        create: {
            name: terlindenQ2name,
            type: QuestionType.DYNAMIC,
            description: 'La rue n\'est pas safe pour les cyclistes (autorisés en sens contraire mais avec peu d\'espace. La rue n\'est pas verduré du tout.',
            creatorId: admin.id,
            cercleId: cercleTerlinden.id
        }
    })

    const terlindenQ3name = 'Quelles activités voudriez-vous voir dans la rue Félix Terlinden?';
    const terlindenQ3 = await prisma.question.upsert({
        where: { cercleId_name: { name: terlindenQ3name , cercleId: cercleTerlinden.id}},
        update: {},
        create: {
            name: terlindenQ3name,
            type: QuestionType.DYNAMIC,
            description: "Quelles activités à soutenir? Rajouter une proposition d'activité si possible.",
            creatorId: admin.id,
            cercleId: cercleTerlinden.id
        }
    })

    const cercleUnknown = await prisma.cercle.upsert({
        where: { name: 'qqpart-1030' },
        update: {},
        create: {
            name: 'qqpart-1030',
            contact: 'Contact me through the city hall',
            creatorId: unknown.id,
            private: true
        },
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
