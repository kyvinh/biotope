import prisma from '../../../../lib/prismaClient'
import {Catch, createHandler, Get, Query} from "@storyofams/next-api-decorators";
import {
    HasUserIdAuthGuard,
    internalServerErrorLogger,
    QuestionCreatorAuthGuard
} from "../../../../lib/serverAnnotations";

// TODO Should also check whether the user is authorized:
//      - user is a constituent, eligible for voting?
//      - Or whether he/she has already voted?

@Catch(internalServerErrorLogger)
@HasUserIdAuthGuard()
@QuestionCreatorAuthGuard()
class GetResultsHandler {
    @Get()
    async fetchResults(@Query('combinations') returnCombinations = false, @Query('q') questionId: string, @Query('userId') userId: string) {

        try {
            const question = await prisma.question.findUnique({
                include: {
                    possibleAnswers: {
                        include: {
                            _count: {
                                select: { answers: true }
                            }
                        }
                    }
                },
                where: {
                    id: questionId
                },
                rejectOnNotFound: true,
            })

            // For each PossibleAnswer, find the number of respondents reached since creation of the PA
            // TODO: Optimize this query!
            const votersCountMap = {}
            for (const possibleAnswer of question.possibleAnswers) {
                const counterResult = await prisma.$queryRaw`select count(distinct hashUid) as votersCount, questionId
                                                                        from answer
                                                                        where answer.questionId = ${possibleAnswer.questionId}
                                                                          and answer.createdOn >= ${possibleAnswer.createdOn}
                                                                        group by questionId`
                votersCountMap[possibleAnswer.id] = counterResult[0]
            }
            question.possibleAnswers = question.possibleAnswers.map(possibleAnswer => {
                const {votersCount} = votersCountMap[possibleAnswer.id]
                return {votersCount, ...possibleAnswer}
            });

            if (returnCombinations) {
                // For each PossibleAnswer, find the other PossibleAnswer users have voted for also
                const sameUserVoteMap = {};
                for (const possibleAnswer of question.possibleAnswers) {
                    sameUserVoteMap[possibleAnswer.id] = await prisma.$queryRaw`select possibleAnswerId, count(hashUid) as sameUserVotes
                                                                       from answer
                                                                       where possibleAnswerId != ${possibleAnswer.id}
                                                                         and questionId = ${possibleAnswer.questionId}
                                                                         and hashUid in (
                                                                           select hashUid
                                                                           from answer
                                                                           where possibleAnswerId = ${possibleAnswer.id}
                                                                       )
                                                                       group by possibleAnswerId
                                                                       order by sameUserVotes desc`
                }
                question.possibleAnswers = question.possibleAnswers.map(possibleAnswer => {
                    const sameUserVotes = sameUserVoteMap[possibleAnswer.id]
                    return {sameUserVotes, ...possibleAnswer}
                });
            }

            // console.log("API Results", question.possibleAnswers)

            return {status: 'ok', results: question.possibleAnswers};

        } catch (error) {
            console.error("QUESTION_RESULTS_ERROR", {
                identifier: questionId,
                error
            });
            throw error;
        }
    }
}

export default createHandler(GetResultsHandler);