import useSWR from 'swr';
import {fetcher} from './fetcher';

// TODO How to type return biotope: Cercle(public/private, include questions, ...)?
export function useBiotope(name: string) {
    const {data: biotope, mutate: reloadBiotope, error} = useSWR(`/api/b/${name}`, fetcher);
    return {biotope, reloadBiotope, error};
}

export function useBiotopeUserHistory(name: string) {
    const {data: userHistory, error} = useSWR(`/api/b/${name}/userHistory` , fetcher);
    return {userHistory, error};
}
