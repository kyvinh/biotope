// noinspection JSUnusedLocalSymbols

const {PrismaClient, PossibleAnswerType, QuestionType, InvitationType} = require('@prisma/client')
const {add, addDays} = require("date-fns");
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
        update: {
            headerPic: 'clairejoie-band_oketqg',
            longName: "Association des Parents de l'école Claire-Joie",
            description: `L’**APCJ** souhaite susciter la participation de tous les parents de l’école et récolter **vos avis/commentaires** afin d'améliorer la qualité de vie de tous à l'école.

Tout parent d’un enfant inscrit à Claire Joie est membre de droit de l’association de parents, **gratuitement**.

_Cette enquête est anonyme!_`,
        },
        create: {
            name: 'terlinden-1040',
            longName: "Association des Parents de l'école Claire-Joie",
            contact: 'Hail me in the street',
            creatorId: admin.id,
            private: true,
            headerPic: 'clairejoie-band_oketqg',
            description: `L’**APCJ** souhaite susciter la participation de tous les parents de l’école et récolter **vos avis/commentaires** afin d'améliorer la qualité de vie de tous à l'école.

Tout parent d’un enfant inscrit à Claire Joie est membre de droit de l’association de parents, **gratuitement**.`,
        },
    })
    const codeForInvitation = '123456';
    const codeInvite = await prisma.invitation.upsert({
        where: {
            type_code: { type: InvitationType.CODE, code: codeForInvitation}
        },
        update: {
            expiration: add(new Date(), {days: 15}),
        },
        create: {
            type: InvitationType.CODE,
            cercleId: cercleTerlinden.id,
            creatorId: admin.id,
            code: codeForInvitation,
            expiration: add(new Date(), {days: 15}),
        }
    })
    const tagUrbanisme = await prisma.tag.upsert({
        where: { name: 'Urbanisme' },
        update: {},
        create: { name: 'Urbanisme' }
    })
    const tagMobilite = await prisma.tag.upsert({
        where: { name: 'Mobilité' },
        update: {},
        create: { name: 'Mobilité' }
    })
    const tagLoisirs = await prisma.tag.upsert({
        where: { name: 'Loisirs' },
        update: {},
        create: { name: 'Loisirs' }
    })
    const terlindenQ1name = 'Comment jugez-vous la propreté de la rue Félix Terlinden?';
    const terlindenQ1 = await prisma.question.upsert({
        where: { cercleId_name: { name: terlindenQ1name , cercleId: cercleTerlinden.id}},
        update: {
            tags: {
                connect: { id: tagUrbanisme.id }
            }
        },
        create: {
            name: terlindenQ1name,
            type: QuestionType.DYNAMIC,
            description: "Bonjour, ce questionnaire sonde les habitants de la rue Félix Terlinden par rapport à la propreté publique. (MARKDOWN?) Notre rue mérite une attention particulière car elle est à proximité de plusieurs centres d'activité: La Chasse, Jourdan, Flagey.",
            creatorId: admin.id,
            cercleId: cercleTerlinden.id,
        }
    })
    const terlindenQ1a1 = await prisma.possibleAnswer.upsert({
        where: { questionId_order: { order: 1, questionId: terlindenQ1.id}},
        update: {},
        create: {
            type: PossibleAnswerType.TEXT,
            order: 1,
            possibleText: "Sale",
            questionId: terlindenQ1.id,
            creatorId: admin.id
        }
    })
    const terlindenQ2name = 'Comment améliorer notre rue et les rues avoisinantes en terme de mobilité et d\'attractivité?';
    // noinspection JSCheckFunctionSignatures
    const terlindenQ2 = await prisma.question.upsert({
        where: { cercleId_name: { name: terlindenQ2name , cercleId: cercleTerlinden.id}},
        update: {
            closingDate: addDays(new Date(), -14),
            closed: true,
            tags: {
                connect: [ { id: tagUrbanisme.id }, { id: tagMobilite.id }]
            }
        },
        create: {
            name: terlindenQ2name,
            type: QuestionType.DYNAMIC,
            description: 'La rue n\'est pas safe pour les cyclistes (autorisés en sens contraire mais avec peu d\'espace). La rue n\'est pas verdurée du tout.',
            creatorId: admin.id,
            cercleId: cercleTerlinden.id,
            closingDate: addDays(new Date(), -14),
            closed: true,
        }
    })

    const terlindenQ3name = 'Quelles activités voudriez-vous voir dans la rue Félix Terlinden?';
    // noinspection JSCheckFunctionSignatures
    const terlindenQ3 = await prisma.question.upsert({
        where: { cercleId_name: { name: terlindenQ3name , cercleId: cercleTerlinden.id}},
        update: {
            closingDate: addDays(new Date(), 14),
            tags: {
                connect: { id: tagLoisirs.id }
            }
        },
        create: {
            name: terlindenQ3name,
            type: QuestionType.DYNAMIC,
            description: "Quelles activités à soutenir? Rajouter une proposition d'activité si possible.",
            creatorId: admin.id,
            cercleId: cercleTerlinden.id,
            closingDate: addDays(new Date(), 14)
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
