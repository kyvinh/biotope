import prisma from '../../../../lib/prismaClient'
import {Prisma} from "@prisma/client";
import {parseISO} from "date-fns";
import {createHandler, Get, Query, Req} from "@storyofams/next-api-decorators";
import {getSession} from "next-auth/react";
import {NextApiRequest} from "next";
import {Question} from ".prisma/client";
import {hashUid} from "../../../../lib/user";

export const questionIncludeBiotopeQuery = {
    include: {
        creator: true,
        tags: true,
        possibleAnswers: {
            include: {
                arguments: {
                    include: {
                        creator: true
                    }
                },
                creator: true
            },
            orderBy: {
                order: 'asc'    // TODO Does this work?
            }
        },
    }
}

// Add some stats such as count of distinct voters and last vote date per question
async function addVoteMetadata(questions: Question[], userId?: string) {

    const questionIds = questions.reduce((acc, question) => {
        acc.push(question.id);
        return acc;
    }, []);

    // TODO Will query below break if no questionIds?
    const voteDataResults = await prisma.$queryRaw`SELECT questionId,
                                                      COUNT(DISTINCT hashUid) AS votes,
                                                      MAX(createdOn)          AS lastVoteDate
                                               FROM answer
                                               WHERE questionId IN (${Prisma.join(questionIds)})
                                               GROUP BY questionId`

    questions.forEach((question) => {
        const voteData = voteDataResults.find(element => element.questionId === question.id)
        // @ts-ignore
        question.votes = voteData ? voteData.votes : 0;
        // @ts-ignore
        question.lastVoteDate = voteData ? parseISO(voteData.lastVoteDate) : null;
    })

    // Fetch whether user has answered the questions (count user answers).
    // Do not fetch the answer data! (privacy-first)

    let answerDataResults = [];
    if (userId) {
        const hashedUid = hashUid(userId);
        answerDataResults = await prisma.$queryRaw`SELECT questionId,
                                                      COUNT(id) AS answerCount,
                                                      MAX(createdOn) AS lastAnswerDate
                                                   FROM answer
                                                   WHERE questionId IN (${Prisma.join(questionIds)})
                                                      AND hashUid = ${hashedUid}
                                                   GROUP BY questionId`
    }

    questions.forEach((question) => {
        const answerData = answerDataResults.find(element => element.questionId === question.id)
        // @ts-ignore
        question.userAnswered = answerData ? answerData.answerCount > 0 : false;
        // @ts-ignore
        question.lastUserAnswer = answerData ? parseISO(answerData.lastAnswerDate) : null;
    })

    return questions;
}

export async function fetchBiotope(userId: string, biotopeName: string) {

    // Biotope basics (if private and user is not a member)

    const b = await prisma.cercle.findUnique({
        where: {
            name: biotopeName
        },
        include: {
            creator: true,
        },
        rejectOnNotFound: true,
    })

    let isAuthorized: boolean

    if (!b.private) {
        isAuthorized = true;
    } else {
        if (!userId) {
            // Browsing a private biotope with no user
            isAuthorized = false
        } else {
            // Must check if we're a member or the creator
            if (userId === b.creatorId) {
                isAuthorized = true
            } else {
                const invite = await prisma.invitation.findFirst({
                    where: {
                        invitedId: userId,
                        cercleId: b.id,
                    }
                })
                isAuthorized = !!invite;
            }
        }
    }

    b.isAuthorized = isAuthorized
    if (!b.isAuthorized) {
        // Not authorized -> return basic info without throwing exception
        return b;
    }

    // From here on:
    // - we are authorized to return more biotope details: questions, ...
    // - userId may not be set if we are browsing a public biotope

    b.questions = await prisma.question.findMany({
        where: {
            cercleId: b.id
        },
        include: questionIncludeBiotopeQuery.include,
        orderBy: {
            createdOn: 'desc',
        }
    });

    b.questions = await addVoteMetadata(b.questions, userId);

    // Favorite questions are the ones created by the biotope creator

    b.questions.forEach((question) => {
        // @ts-ignore
        question.starred = question.creatorId === b.creatorId;
    })

    return b
}

class FetchBiotope {

    @Get()
    async fetchBiotope(@Query('name') biotopeName: string, @Req() req: NextApiRequest) {
        const session = await getSession({req})
        const userId = session?.user?.id;
        return await fetchBiotope(userId, biotopeName);
    }
}

export default createHandler(FetchBiotope);