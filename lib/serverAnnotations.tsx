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

// Requires req.query['userId'] and req.query['q'] !
export const QuestionCreatorAuthGuard = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {

        const userId = req.query['userId']
        const questionId = req.query['q']

        const originalQuestion: Question = await prisma.question.findUnique({
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