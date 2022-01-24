import {HasUserIdAuthGuard} from "../../../../lib/serverAnnotations";
import {Body, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import {PossibleAnswerDeleteInput} from "../../constants";
import {checkCreator} from "./edit";
import prisma from "../../../../components/util/prismaClient";
import {fetchQuestion} from "../../q/[q]/newAnswer";

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