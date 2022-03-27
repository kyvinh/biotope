import _crypto from "crypto";
import {Argument, PossibleAnswer, Question, Tag, User} from ".prisma/client";

export const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}`;

export const CODE_LENGTH = 6;
export const ANON_EMAIL_DOMAIN = process.env.ANON_EMAIL_DOMAIN || 'anon.biotope.brussels'
export const ANSWER_MAX_LENGTH = 150

export const baseEmailConfig = {
    server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
        }
    },
    from: process.env.EMAIL_FROM,
    async generateVerificationToken() {
        return _crypto.randomBytes(32).toString("hex")
    },
};

/*
 * API Input types:
 */

export class NewAnswerInput {
    newAnswer: string;
}

export class PossibleAnswerInput {
    answerText: string;
}

export class PossibleAnswerDeleteInput {
    deletedId: string;
}

export class QuestionEditDto {
    name: string;
    description: string;
    closingDate?: Date;
}

export class EmailSubDto {
    email: string;
}

export class SameUserVotesDto {
    possibleAnswerId: string;
    sameUserVotes: number;
}

/*
 * API Return types:
 */
export type QuestionWithMetadata =
    Question
    & { votes: number, creator: User, lastVoteDate: Date, userAnswered: boolean, lastUserAnswer: Date, shortDescription: string
    , tags: Tag[]
    , possibleAnswers: PossibleAnswerWithArguments[]
}
export type PossibleAnswerWithArguments = PossibleAnswer & { arguments: Argument[] }
export type PossibleAnswerWithCount =
    PossibleAnswerWithArguments
    & { count: number; percent: number, sameUserVotes: SameUserVotesDto[], arguments: Argument[] }
