const {PrismaClient, PossibleAnswerType} = require('@prisma/client')
const prisma = new PrismaClient()

// https://www.prisma.io/docs/guides/database/seed-database#integrated-seeding-with-prisma-migrate

async function main() {

    const likertOptions = [
        {type: PossibleAnswerType.NUMBER, possibleNumber: 1, order: 1, possibleText: "Insalubre"},
        {type: PossibleAnswerType.NUMBER, possibleNumber: 2, order: 2, possibleText: "Sale"},
        {type: PossibleAnswerType.NUMBER, possibleNumber: 3, order: 3, possibleText: "Normale"},
        {type: PossibleAnswerType.NUMBER, possibleNumber: 4, order: 4, possibleText: "Propre"},
        {type: PossibleAnswerType.NUMBER, possibleNumber: 5, order: 5, possibleText: "Sans reproche"}
    ];

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
    const questionnaire = await prisma.questionnaire.upsert({
        where: { cercleId_name: { name: 'bx-questionnaire-1' , cercleId: cercleBx.id} },
        update: {},
        create: {
            name: 'bx-questionnaire-1',
            welcomeText: 'Bonjour, ce questionnaire sonde les habitants de Bruxelles par rapport à la propreté publique.',
            creatorId: admin.id,
            cercleId: cercleBx.id,

        }
    })
    const q1name = 'Comment jugez-vous la propreté des rues?';
    const q1 = await prisma.question.upsert({
        where: { questionnaireId_name: { name: q1name , questionnaireId: questionnaire.id}},
        update: {},
        create: {
            name: q1name,
            type: "LIKERT",
            description: 'Comment estimez-vous la propreté des rues dans Bruxelles en général?',
            creatorId: admin.id,
            questionnaireId: questionnaire.id
        }
    })
    const q1optionsData = likertOptions.reduce((prev, value) => ([...prev, {...value, questionId: q1.id}]), []);
    const q1options = await prisma.possibleAnswer.createMany({
        data: q1optionsData,
        skipDuplicates: true,   // Acts like an upsert
    })
    const q2name = 'Comment est-ce que la commune et ses habitants pourraient amélioreriez-vous la propreté de la rue?';
    const q2 = await prisma.question.upsert({
        where: { questionnaireId_name: { name: q2name , questionnaireId: questionnaire.id}},
        update: {},
        create: {
            name: q2name,
            type: "LONGTEXT",
            description: 'Welcome 3 4 ...',
            creatorId: admin.id,
            questionnaireId: questionnaire.id
        }
    })
    const cercleTerlinden = await prisma.cercle.upsert({
        where: { name: 'terlinden-1040' },
        update: {},
        create: {
            name: 'terlinden-1040',
            contact: 'Hail me in the street',
            creatorId: admin.id,
            private: true
        },
    })
    const terlindenQuestionnaire = await prisma.questionnaire.upsert({
        where: { cercleId_name: { name: 'terlinden-questionnaire-1' , cercleId: cercleTerlinden.id} },
        update: {},
        create: {
            name: 'terlinden-questionnaire-1',
            welcomeText: 'Bonjour, ce questionnaire sonde les habitants de la rue Félix Terlinden par rapport à la propreté publique.',
            creatorId: admin.id,
            cercleId: cercleTerlinden.id,

        }
    })
    const terlindenQ1name = 'Comment jugez-vous la propreté de la rue Félix Terlinden?';
    const terlindenQ1 = await prisma.question.upsert({
        where: { questionnaireId_name: { name: terlindenQ1name , questionnaireId: terlindenQuestionnaire.id}},
        update: {},
        create: {
            name: terlindenQ1name,
            type: "LIKERT",
            description: 'Comment estimez-vous la propreté de la rue Félix Terlinden?',
            creatorId: admin.id,
            questionnaireId: terlindenQuestionnaire.id
        }
    })
    const terlindenQ1optionsData = likertOptions.reduce((prev, value) => ([...prev, {...value, questionId: terlindenQ1.id}]), []);
    const terlindenQ1options = await prisma.possibleAnswer.createMany({
        data: terlindenQ1optionsData,
        skipDuplicates: true,   // Acts like an upsert
    })
    const cercleUnkown = await prisma.cercle.upsert({
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
