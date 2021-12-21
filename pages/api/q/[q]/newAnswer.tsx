import {
    Body, createHandler, createMiddlewareDecorator, NextFunction, Post, Query, UnauthorizedException
} from '@storyofams/next-api-decorators';
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import {PossibleAnswerType, Question} from ".prisma/client";
import prisma from "../../../../components/util/prismaClient";
import {questionIncludeBiotopeQuery} from "../../b/[name]";

const HasUserIdAuthGuard = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {

        const session = await getSession({req})
        if (!session?.user) {
            throw new UnauthorizedException("Who are you?");
            // TODO Should also check whether the user is a constituent, eligible for voting? Or whether he/she has already voted?
        }
        req.query['userId'] = session.user.id
        next();
    }
);

// Requires req.query['userId'] and req.query['q'] !
const QuestionCreatorAuthGuard = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {

        const userId = req.query['userId']
        const questionId = req.query['q']

        debugger

        const originalQuestion:Question = await prisma.question.findUnique({
            where: {
                id: questionId
            }
        })

        if (!originalQuestion || originalQuestion.creatorId !== userId) {
            throw new UnauthorizedException();
        }

        next();
    }
);

class NewAnswerInput {
    newAnswer: string;
}

@HasUserIdAuthGuard()
@QuestionCreatorAuthGuard()
class AddNewAnswerHandler {
    @Post()
    async create(@Body() newAnswerInput: NewAnswerInput, @Query('q') questionId: string, @Query('userId') userId: string) {

        await prisma.possibleAnswer.create({
            data: {
                type: PossibleAnswerType.TEXT,
                questionId: questionId,
                possibleText: newAnswerInput.newAnswer,
                creatorId: userId,
                // TODO: order = ?
            }
        })

        const updatedQuestion = await prisma.question.findUnique({
            where: {
                id: questionId
            },
            include: questionIncludeBiotopeQuery.include
        })

        return {status: 'ok', updatedQuestion}
    }
}

export default createHandler(AddNewAnswerHandler);
