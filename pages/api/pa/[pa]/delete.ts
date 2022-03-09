import {HasUserIdAuthGuard, internalServerErrorLogger} from "../../../../lib/serverAnnotations";
import {Body, Catch, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import {PossibleAnswerDeleteInput} from "../../../../lib/constants";
import {checkCreator} from "./edit";
import prisma from "../../../../lib/prismaClient";
import {fetchQuestion} from "../../q/[q]/newAnswer";

@Catch(internalServerErrorLogger)
@HasUserIdAuthGuard()
class DeletePossibleAnswerHandler {
    @Post()
    async delete(@Body() answerInput: PossibleAnswerDeleteInput, @Query('pa') possibleAnswerId: string, @Query('userId') userId: string) {
        await checkCreator(possibleAnswerId, userId);

        const possibleAnswer = await prisma.possibleAnswer.delete({
            where: {
                id: possibleAnswerId,
            },
        })
        const updatedQuestion = await fetchQuestion(possibleAnswer.questionId);

        return {status: 'ok', updatedQuestion}
    }
}

export default createHandler(DeletePossibleAnswerHandler);