const {PrismaClient} = require('@prisma/client')
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
    const cercleBx = await prisma.cercle.upsert({
        where: { name: 'bx' },
        update: {},
        create: {
            name: 'bx',
            contact: 'Contact owner by mail...',
            creatorId: admin.id
        },
    })
    const questionnaire = await prisma.questionnaire.upsert({
        where: { cercleId_name: { name: 'bx-questionnaire-1' , cercleId: cercleBx.id} },
        update: {},
        create: {
            name: 'bx-questionnaire-1',
            welcomeText: 'Welcome 1 2 ...',
            creatorId: admin.id,
            cercleId: cercleBx.id,

        }
    })
    const q1name = 'Comment jugez-vous la propreté de la rue?';
    const q1 = await prisma.question.upsert({
        where: { questionnaireId_name: { name: q1name , questionnaireId: questionnaire.id}},
        update: {},
        create: {
            name: q1name,
            type: "LIKERT",
            description: 'Comment estimez-vous la propreté de la rue Félix Terlinden?',
            creatorId: admin.id,
            questionnaireId: questionnaire.id
        }
    })
    const q2name = 'Comment amélioreriez-vous la propreté de la rue?';
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
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
