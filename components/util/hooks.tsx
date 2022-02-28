import useSWR from 'swr';
import {fetcher} from './fetcher';
import {Cercle, Question, Tag, User} from ".prisma/client";
import {PossibleAnswerWithArguments} from "../QuestionResults";

// TODO How to type return biotope: Cercle(public/private, include questions, ...)?
export function useBiotope(name: string) {
    const {data: biotope, mutate: reloadBiotope, error} = useSWR<Cercle & { creator: User, isAuthorized: boolean, questions: (Question & { votes: number, creator: User, lastVoteDate: Date, userAnswered: boolean, lastUserAnswer: Date, shortDescription: string, tags: Tag[], possibleAnswers: PossibleAnswerWithArguments[] })[]}>(name ? `/api/b/${name}` : null, fetcher);
    return {biotope, reloadBiotope, error};
}
