import prisma from '../../../../lib/prismaClient'
import {hashUid} from "../../../../lib/user";
import {createNewPossibleAnswer, fetchQuestion} from "./newAnswer";
import {Body, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import {HasUserIdAuthGuard} from "../../../../lib/serverAnnotations";

export interface AnswerDto {
    possibleAnswerId?: string,  // Either 1 answer here OR multiple in possibleAnswerIds
    newAnswer?: {
        text?: string
    },
    possibleAnswerIds?: string[]
}

@HasUserIdAuthGuard()
class AnswerHandler {

    @Post()
    async answer(@Body() answerInput: AnswerDto, @Query('q') questionId: string, @Query('userId') userId: string) {

        const uid = hashUid(userId)

        try {

            const transaction = []

            // Create new possible answer if supplied

            if (answerInput.newAnswer) {
                const possibleAnswer = await createNewPossibleAnswer(questionId, {newAnswer: answerInput.newAnswer.text}, userId);
                transaction.push(
                    prisma.answer.create({
                        data: {
                            possibleAnswerId: possibleAnswer.id,
                            hashUid: uid,
                            questionId: questionId,
                        }
                    })
                )
            }

            if (answerInput.possibleAnswerId) {
                transaction.push(
                    prisma.answer.upsert({
                        where: {
                            questionId_hashUid: {
                                questionId: questionId,
                                hashUid: uid
                            }
                        },
                        // TODO Should modify createdOn?
                        update: {
                            possibleAnswerId: answerInput.possibleAnswerId
                        },
                        create: {
                            possibleAnswerId: answerInput.possibleAnswerId,
                            hashUid: uid,
                            questionId: questionId,
                        }
                    })
                )
            } else if (answerInput.possibleAnswerIds?.length > 0) {
                transaction.push(
                    prisma.answer.deleteMany({
                        where: {
                            questionId: questionId,
                            hashUid: uid
                        }
                    })
                )
                transaction.push(
                    ...answerInput.possibleAnswerIds.map(possibleAnswerId => prisma.answer.create({
                        data: {
                            questionId: questionId,
                            hashUid: uid,
                            possibleAnswerId: possibleAnswerId,
                        }
                    }))
                )
            }

            await prisma.$transaction(transaction);

            const updatedQuestion = await fetchQuestion(questionId);
            return {status: 'ok', updatedQuestion}

        } catch (error) {
            console.error("QUESTION_ANSWER_ERROR", {
                identifier: questionId,
                error
            });
            throw error;
        }

    }
}

export default createHandler(AnswerHandler);