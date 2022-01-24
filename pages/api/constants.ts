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