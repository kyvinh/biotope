import { usePropositions } from './util/hooks';
import {PropositionListItemBrief} from "./PropositionListItemBrief";

export const PropositionList = () => {
    const { propositions } = usePropositions();
    console.dir(propositions)
    return propositions ? (
        <>
            {propositions.map((proposition, i) => (
                // Should not transfer the whole proposition object?
                <PropositionListItemBrief key={i} proposition={ proposition } />
            ))}
        </>
    ) : null;
};