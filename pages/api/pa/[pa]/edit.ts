import {HasUserIdAuthGuard, isQuestionCreator} from "../../../../lib/serverAnnotations";
import {
    Body,
    createHandler,
    Post,
    Query,
    UnauthorizedException,
    UnprocessableEntityException
} from "@storyofams/next-api-decorators";
import {PossibleAnswerInput} from "../../constants";
import {fetchQuestion} from "../../q/[q]/newAnswer";
import prisma from "../../../../components/util/prismaClient";

export const checkCreator = async (possibleAnswerId: string, userId: string) => {
    // Cannot use QuestionCreatorAuthGuard because we don't have the questionId in the URL => do it manually
    const originalPossibleAnswer = await prisma.possibleAnswer.findUnique({
        where: {id: possibleAnswerId},
    })
    if (!originalPossibleAnswer) {
        throw new UnprocessableEntityException()
    }
    const authorized = await isQuestionCreator(originalPossibleAnswer.questionId, userId)
    if (!authorized) {
        throw new UnauthorizedException();
    }
}

@HasUserIdAuthGuard()
class EditPossibleAnswerHandler {
    @Post()
    async edit(@Body() answerInput: PossibleAnswerInput, @Query('pa') possibleAnswerId: string, @Query('userId') userId: string) {

        await checkCreator(possibleAnswerId, userId);

        const possibleAnswer = await prisma.possibleAnswer.update({
            where: {
                id: possibleAnswerId,
            },
            data: {
                possibleText: answerInput.answerText,
            }
        })
        const updatedQuestion = await fetchQuestion(possibleAnswer.questionId);

        return {status: 'ok', updatedQuestion}
    }
}

export default createHandler(EditPossibleAnswerHandler);
