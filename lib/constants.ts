import _crypto from "crypto";

export const baseEmailConfig = {
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    async generateVerificationToken() {
        return _crypto.randomBytes(32).toString("hex")
    },
};

export const ANON_EMAIL_DOMAIN = process.env.ANON_EMAIL_DOMAIN || 'anon.biotope.brussels'
export const ANSWER_MAX_LENGTH = 150

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