import { usePropositions } from './util/hooks';
import {PropositionListItemBrief} from "./PropositionListItemBrief";

export const PropositionList = () => {
    const { propositions } = usePropositions();
    return propositions ? (
        <>
            {propositions.map(({ id, title, author }, i) => (
                <PropositionListItemBrief key={i} proposition={ { id, title, author } } />
            ))}
        </>
    ) : null;
};