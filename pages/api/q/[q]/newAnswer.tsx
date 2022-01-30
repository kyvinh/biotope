import {Body, createHandler, Post, Query} from '@storyofams/next-api-decorators';
import prisma from "../../../../lib/prismaClient";
import {questionIncludeBiotopeQuery} from "../../b/[name]";
import {HasUserIdAuthGuard, QuestionCreatorAuthGuard} from "../../../../lib/serverAnnotations";
import {PossibleAnswerType} from "@prisma/client";
import {NewAnswerInput} from "../../../../lib/constants";

export async function createNewPossibleAnswer(questionId: string, newAnswerInput: NewAnswerInput, userId: string) {

    return await prisma.$transaction(async (prisma) => {
        // Get number of previous PossibleAnswers to increment the order field
        const possibleAnswersCount =
            await prisma.possibleAnswer.count({
                where: {
                    questionId: questionId
                }
            })
        return await prisma.possibleAnswer.create({
            data: {
                type: PossibleAnswerType.TEXT,
                questionId: questionId,
                possibleText: newAnswerInput.newAnswer,
                creatorId: userId,
                order: possibleAnswersCount + 1,
            }
        })
    })
}

export async function fetchQuestion(questionId: string) {
    return await prisma.question.findUnique({
        where: {
            id: questionId
        },
        include: questionIncludeBiotopeQuery.include,
        rejectOnNotFound: true,
    });
}

@HasUserIdAuthGuard()
@QuestionCreatorAuthGuard()
class AddNewAnswerHandler {
    @Post()
    async create(@Body() newAnswerInput: NewAnswerInput, @Query('q') questionId: string, @Query('userId') userId: string) {

        await createNewPossibleAnswer(questionId, newAnswerInput, userId);
        const updatedQuestion = await fetchQuestion(questionId);

        return {status: 'ok', updatedQuestion}
    }
}

export default createHandler(AddNewAnswerHandler);