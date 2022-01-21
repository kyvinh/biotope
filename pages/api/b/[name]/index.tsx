import prisma from '../../../../components/util/prismaClient'
import {Prisma} from "@prisma/client";
import {parseISO} from "date-fns";
import {BadRequestException, createHandler, Get, Query, Req, UnauthorizedException} from "@storyofams/next-api-decorators";
import {getSession} from "next-auth/react";
import {NextApiRequest} from "next";

export const questionIncludeBiotopeQuery = {
    include: {
        creator: true,
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

class FetchBiotope {

    @Get()
    async fetchBiotope(@Query('name') biotopeName: string, @Req() req: NextApiRequest) {

        const session = await getSession({req})
        const userId = session?.user?.id;

        // Biotope basics (if private and user is not a member)

        const b = await prisma.cercle.findUnique({
            where: {
                name: biotopeName
            },
            include: {
                creator: true,
            }
        })

        if (!b) {
            throw new BadRequestException(`${biotopeName} is not valid`)
        }

        if (b.private) {
            if (!userId) {
                // Return basic info only
                return b;
            } else {
                // Must check if we're a member or the creator
                if (userId !== b.creatorId) {
                    const invite = await prisma.invitations.findFirst({
                        where: {
                            invitedId: userId,
                            cercleId: b.id,
                        }
                    })
                    if (!invite) {
                        throw new UnauthorizedException(`${b.id} not accessible to ${userId}`)
                    }
                }
            }
        }

        // We are authorized to return more details: questions, ...

        b.questions = await prisma.questions.findMany({
            where: {
                cercleId: b.id
            },
            include: questionIncludeBiotopeQuery.include,
            orderBy: {
                createdOn: 'desc',
            }
        })

        // Add some stats such as count of distinct voters and last vote date per question

        const questionIds = b.questions.reduce((acc, question) => {
            acc.push(question.id);
            return acc;
        }, []);
        // TODO Will query below break if no questionIds?
        const results = await prisma.$queryRaw`SELECT questionId,
                                                      count(distinct hashUid) as votes,
                                                      max(createdOn)          as lastVoteDate
                                               FROM answer
                                               WHERE questionId in (${Prisma.join(questionIds)})
                                               group by questionId`

        b.questions.forEach((question) => {
            const result = results.find((element) => element.questionId === question.id)
            question.votes = result ? result.votes : 0;
            question.lastVoteDate = result ? parseISO(result.lastVoteDate) : null;
        })

        return b
    }
}

export default createHandler(FetchBiotope);