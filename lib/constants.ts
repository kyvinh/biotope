import _crypto from "crypto";

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