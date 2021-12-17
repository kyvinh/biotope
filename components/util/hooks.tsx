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

export function useBiotope(name) {
    const {data: biotope, error} = useSWR(`/api/b/${name}`, fetcher);
    return {biotope, error};
}

export function useBiotopeUserHistory(name) {
    const {data: userHistory, error} = useSWR(`/api/b/${name}/userHistory` , fetcher);
    return {userHistory, error};
}
