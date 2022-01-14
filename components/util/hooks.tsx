import useSWR from 'swr';
import {fetcher} from './fetcher';

// TODO How to type return biotope: Cercle(public/private, include questions, ...)?
export function useBiotope(name: string) {
    const {data: biotope, mutate: reloadBiotope, error} = useSWR(name ? `/api/b/${name}` : null, fetcher);
    return {biotope, reloadBiotope, error};
}

export function useBiotopeUserHistory(name: string) {
    const {data: userHistory, error} = useSWR(name ? `/api/b/${name}/userHistory` : null, fetcher);
    return {userHistory, error};
}
