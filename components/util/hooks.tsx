import useSWR from 'swr';
import { fetcher } from './fetcher';

export function useHumeurs() {
    const { data: humeurs } = useSWR('/api/humeurs', fetcher);
    return { humeurs };
}

export function usePropositions() {
    const { data: propositions } = useSWR('/api/propositions', fetcher);
    return { propositions };
}