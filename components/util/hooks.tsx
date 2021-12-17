import useSWR from 'swr';
import {fetcher} from './fetcher';

export function useHumeurs() {
    const {data: humeurs} = useSWR('/api/humeurs', fetcher);
    return {humeurs};
}

export function usePropositions() {
    const {data: propositions} = useSWR('/api/propositions', fetcher);
    return {propositions};
}

// TODO How to type return biotope: Cercle(public/private, include questions, ...)?
export function useBiotope(name: string) {
    const {data: biotope, error} = useSWR(`/api/b/${name}`, fetcher);
    return {biotope, error};
}

export function useBiotopeUserHistory(name: string) {
    const {data: userHistory, error} = useSWR(`/api/b/${name}/userHistory` , fetcher);
    return {userHistory, error};
}
