import {Body, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import prisma from "../../../lib/prismaClient";
import {ActionType, QuestionType} from "@prisma/client";
import {HasUserIdAuthGuard} from "../../../lib/serverAnnotations";
import {QuestionEditDto} from "../../../lib/constants";

// TODO: Test that user has enough rights to create a question?!

@HasUserIdAuthGuard()
class AddNewQuestionHandler {
    @Post()
    async create(@Body() newQuestionInput: QuestionEditDto, @Query('b') biotopeName: string, @Query('userId') userId: string) {

        const b = await prisma.cercle.findUnique({
            where: {
                name: biotopeName
            },
            rejectOnNotFound: true,
        })

        const question = await prisma.question.create({
            data: {
                type: QuestionType.DYNAMIC,
                name: newQuestionInput.name,
                description: newQuestionInput.description,
                cercleId: b.id,
                creatorId: userId,
                closingDate: newQuestionInput.closingDate,
            }
        })

        await prisma.reputationAction.create({
            data: {
                actionType: ActionType.CREATE_QUESTION,
                userId: userId,
            }
        })

        return {status: 'ok', question}
    }
}

export default createHandler(AddNewQuestionHandler);