// noinspection JSUnusedLocalSymbols

const {PrismaClient, PossibleAnswerType, QuestionType, InvitationType} = require('@prisma/client')
const {add, addDays, addHours, set} = require("date-fns");
const {Question} = require("@prisma/client");
const prisma = new PrismaClient()

// https://www.prisma.io/docs/guides/database/seed-database#integrated-seeding-with-prisma-migrate

async function main() {

    const miniLikert = ['Satisfaisant', 'Insatisfaisant']
    const budgetLikert = [
        'trop chers et impactent mon budget',
        `chers mais n'impactent pas mon budget`,
        'adaptés à mon budget',
        `peu chers ou n'impactent pas mon budget`]
    const agreeLikert = [
        `Je suis tout à fait d'accord`,
        `Je suis d'accord`,
        `Je ne suis pas d'accord`,
        `Je ne suis pas du tout d'accord`]

    const generatePossibleAnswers = async (texts, question) => {
        for (const [i, text] of texts.entries()) {
            const data = {
                type: PossibleAnswerType.TEXT,
                creatorId: question.creatorId,
                possibleText: text,
            }
            // TODO: Do not seed this file after 1st prod deploy -> changing the order of answers will create problems!
            await prisma.possibleAnswer.upsert({
                where: {
                    questionId_order: {
                        questionId: question.id,
                        order: i+1}
                },
                update: { ...data },
                create: {
                    questionId: question.id,
                    order: i+1,
                    ...data
                }
            })

        }
    }

    const admin = await prisma.user.upsert({
        where: { email: 'kyvinh@gmail.com' },
        update: {},
        create: {
            name: 'Ky Vinh',
            email: 'kyvinh@gmail.com',
        }
    })

    const apcj1040 = 'apcj-1040';
    const apcj1040Data = {
        headerPic: 'clairejoie-band_oketqg',
        longName: "Association des Parents de l'école Claire-Joie",
        description: `L’**APCJ** souhaite susciter la participation de tous les parents de l’école et récolter **vos avis/commentaires** afin d'améliorer la qualité de vie de tous à l'école.

Tout parent d’un enfant inscrit à Claire Joie est membre de droit de l’association de parents, **gratuitement**.

_Cette enquête est anonyme!_`,
        contact: 'kyvinh@gmail.com',
        creatorId: admin.id,
        private: true,
    }
    const cercleAPCJ = await prisma.cercle.upsert({
        where: { name: apcj1040 },
        update: {
            ...apcj1040Data
        },
        create: {
            name: apcj1040,
            ...apcj1040Data
        },
    })
    const codeForInvitation = 'APCJ22';
    const codeInvite = await prisma.invitation.upsert({
        where: {
            type_code: { type: InvitationType.CODE, code: codeForInvitation}
        },
        update: {
            // expiration: add(new Date(), {days: 15}),
        },
        create: {
            type: InvitationType.CODE,
            cercleId: cercleAPCJ.id,
            creatorId: cercleAPCJ.creatorId,
            code: codeForInvitation,
            expiration: add(new Date(), {days: 15}),
        }
    })
    const tagEnquete = await prisma.tag.upsert({
        where: { name: 'Enquête 2022' },
        update: {},
        create: { name: 'Enquête 2022' }
    })

    let closingDate = addDays(new Date(), 14)
    closingDate = addHours(closingDate, 1)
    closingDate = set(closingDate, { minutes: 0, seconds: 0, milliseconds: 0})

    const apcjQuestions = [
        {
            answers: miniLikert,
            name: 'Accueil parascolaire',
            description: "Comment jugez-vous l'accueil le matin, le midi et le soir?",
            creatorId: cercleAPCJ.creatorId,
            cercleId: cercleAPCJ.id,
            type: QuestionType.DYNAMIC,
            closingDate: closingDate,
            tags: {
                connect: { id: tagEnquete.id }
            }
        },
        {
            answers: miniLikert,
            name: 'Sécurité aux abords de l\'école',
            description: 'La sécurité des enfants en les déposant le matin et en les récupérant le midi/soir nous concerne tous. Comment jugez-vous la sécurité et la convivialité aux abords de l\'école?',
            creatorId: cercleAPCJ.creatorId,
            cercleId: cercleAPCJ.id,
            type: QuestionType.DYNAMIC,
            closingDate: closingDate,
            tags: {
                connect: { id: tagEnquete.id }
            }
        },
        {
            answers: budgetLikert,
            name: 'Frais scolaires',
            description: 'Les frais scolaires et parascolaires (équipement, cantine, sorties, etc...) sont :',
            creatorId: cercleAPCJ.creatorId,
            cercleId: cercleAPCJ.id,
            type: QuestionType.DYNAMIC,
            closingDate: closingDate,
            tags: {
                connect: { id: tagEnquete.id }
            }
        },
        {
            answers: miniLikert,
            name: 'Cantine : repas chaud et repas tartine',
            description: `Nos enfants doivent pouvoir s'alimenter correctement dans un environnement propice. Comment jugez-vous la qualité du temps de repas à l'école ?`,
            creatorId: cercleAPCJ.creatorId,
            cercleId: cercleAPCJ.id,
            type: QuestionType.DYNAMIC,
            closingDate: closingDate,
            tags: {
                connect: { id: tagEnquete.id }
            }
        },
        {
            answers: agreeLikert,
            name: 'Bâtiments et locaux',
            description: `Est-ce que les bâtiments et locaux de l'école de l'école sont accueillants et agréables?
             Est-ce que les couloirs et toilettes sont propres et accessibles à tous?
             Est-ce que les classes et salles de sport sont en bon état et bien aménagés?
             (Ne prenez pas en compte les cours de récréation car elles font partie d'un autre sondage)`,
            creatorId: cercleAPCJ.creatorId,
            cercleId: cercleAPCJ.id,
            type: QuestionType.DYNAMIC,
            closingDate: closingDate,
            tags: {
                connect: { id: tagEnquete.id }
            }
        },
    ]

    for (const apcjQuestion of apcjQuestions) {
        const {answers, tags, ...questionData} = apcjQuestion
        const createdQuestion = await prisma.question.upsert({
            where: { cercleId_name: { name: questionData.name , cercleId: questionData.cercleId}},
            update: {
                ...questionData,
            },
            create: {
                ...questionData
            }
        })
        await prisma.question.update({
            where: { cercleId_name: { name: questionData.name , cercleId: questionData.cercleId}},
            data: {
                tags
            }
        })
        await generatePossibleAnswers(answers, createdQuestion)
    }

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
