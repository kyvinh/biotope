import {
    createMiddlewareDecorator,
    HttpException,
    NextFunction,
    UnauthorizedException
} from "@storyofams/next-api-decorators";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import {Question} from ".prisma/client";
import prisma from "./prismaClient";

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
        },
        rejectOnNotFound: true,
    })
    return originalQuestion.creatorId === userId
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

export function internalServerErrorLogger(
    error: unknown,
    req: NextApiRequest,
    res: NextApiResponse
) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('API Error: ' + message)
    console.error(error)
    if (error instanceof HttpException) {
        res.status(error.statusCode).json(error);
    } else {
        res.status(500).json({ status: 'ko', error: message});
    }
}
