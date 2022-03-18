import useSWR from 'swr';
import {fetcher} from './fetcher';
import {Cercle, User} from ".prisma/client";
import {QuestionWithMetadata} from "../../lib/constants";

// TODO How to type return biotope: Cercle(public/private, include questions, ...)?
export function useBiotope(name: string) {
    const {data: biotope, mutate: reloadBiotope, error} = useSWR<Cercle & { creator: User, isAuthorized: boolean, questions: QuestionWithMetadata[]}>(name ? `/api/b/${name}` : null, fetcher);
    return {biotope, reloadBiotope, error};
}
