import {createMiddlewareDecorator, NextFunction, UnauthorizedException} from "@storyofams/next-api-decorators";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import {Question} from ".prisma/client";
import prisma from "../components/util/prismaClient";

export const HasUserIdAuthGuard = createMiddlewareDecorator(
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

export const isQuestionCreator = async (questionId, userId) => {
    const originalQuestion: Question = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    })
    return originalQuestion && originalQuestion.creatorId === userId
}

// Requires req.query['userId'] and req.query['q'] !
export const QuestionCreatorAuthGuard = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {

        const userId = req.query['userId']
        const questionId = req.query['q']
        const authorized = await isQuestionCreator(questionId, userId)

        if (!authorized) {
            throw new UnauthorizedException();
        }

        next();
    }
);