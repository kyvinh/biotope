import { usePropositions } from './util/hooks';

export const PropositionsList = () => {
    const { propositions } = usePropositions();
    return propositions ? (
        <>
            {propositions.map(({ id, title, author }, i) => (
                <div key={i}><h4>{title}</h4><span>{author.displayName}</span></div>
            ))}
        </>
    ) : null;
};