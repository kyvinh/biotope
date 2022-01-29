import useSWR from 'swr';
import {fetcher} from './fetcher';
import {Cercle, Question, Tag, User} from ".prisma/client";

// TODO How to type return biotope: Cercle(public/private, include questions, ...)?
export function useBiotope(name: string) {
    const {data: biotope, mutate: reloadBiotope, error} = useSWR<Cercle & { questions: (Question & { creator: User, lastVoteDate: Date, tags: Tag[] })[]}>(name ? `/api/b/${name}` : null, fetcher);
    return {biotope, reloadBiotope, error};
}
