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
    const q1 = await prisma.question.upsert({
        where: { questionnaireId_name: { name: 'Comment jugez-vous la propreté de la rue?' , questionnaireId: questionnaire.id}},
        update: {},
        create: {
            name: 'Comment jugez-vous la propreté de la rue?',
            type: "LIKERT",
            description: 'Welcome 1 2 ...',
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
